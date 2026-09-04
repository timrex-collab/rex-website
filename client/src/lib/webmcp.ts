/**
 * WebMCP-Adapter — dünne Schicht über `document.modelContext`.
 *
 * Enthält keine Fachlogik. Verantwortlich für: Feature-Flag (fail-closed),
 * Origin-Allowlist, Origin-Trial-Token, Feature-Detection, asynchrone
 * Registrierung mit getrennten Ergebnissen, Kombination von Lebenszyklus- und
 * Aufruf-Signal, Fehlernormalisierung (Tools werfen nie zum Agenten) und eine
 * versionierte Event-Schnittstelle ohne Nutzdaten.
 *
 * Stand der API (webmcp-types 0.1.5, Spec-Repo webmachinelearning/webmcp):
 *   document.modelContext.registerTool(tool, { signal }): Promise<void>
 *   – kein unregisterTool: Abmeldung ausschließlich über AbortSignal
 *   – execute(input, { signal }) erhält ein eigenes Signal je Aufruf
 */

export type WebMCPTool = WebMCP.ModelContextTool;

export type RegistrationResult =
  | { status: "registered" }
  | { status: "unsupported" }
  | { status: "disabled"; reason: "flag" | "origin" | "local_override" }
  | { status: "registration_error"; error: string }
  | { status: "registration_aborted" };

export const WEBMCP_EVENT_NAME = "rex:webmcp";
export const WEBMCP_EVENT_VERSION = "rex.webmcp.v1";

export type WebMCPEventType =
  | "registration_result"
  | "invocation_start"
  | "invocation_invalid_input"
  | "invocation_result"
  | "invocation_error"
  | "invocation_aborted"
  | "ui_apply_committed"
  | "cta_transition";

/** Event-Detail: bewusst ohne Eingaben, Ergebnisse, Fotos, OCR oder Kontaktdaten. */
export interface WebMCPEventDetail {
  v: typeof WEBMCP_EVENT_VERSION;
  event: WebMCPEventType;
  tool?: string;
  invocationId?: string;
  durationMs?: number;
  errorCode?: string;
  status?: string;
}

/** Vite-Env sicher lesen (unter Node/tsx fehlt import.meta.env). */
function env(key: string): string | undefined {
  const e = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  return e ? e[key] : undefined;
}

function readLocal(key: string): string | null {
  try {
    return typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function allowedOrigins(): string[] {
  const raw = env("VITE_WEBMCP_ORIGINS") ?? "";
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

/**
 * Fail-closed: aktiv nur, wenn das Flag exakt "true" ist, der aktuelle Origin
 * in der Allowlist steht und kein lokaler Debug-Override gesetzt ist.
 */
export function webmcpEnabledState(): { enabled: true } | { enabled: false; reason: "flag" | "origin" | "local_override" } {
  if (env("VITE_WEBMCP_ENABLED") !== "true") return { enabled: false, reason: "flag" };
  if (typeof location === "undefined" || !allowedOrigins().includes(location.origin)) return { enabled: false, reason: "origin" };
  if (readLocal("rex.webmcp") === "off") return { enabled: false, reason: "local_override" };
  return { enabled: true };
}

export function isWebMCPEnabled(): boolean {
  return webmcpEnabledState().enabled;
}

export function getModelContext(): WebMCP.ModelContext | null {
  if (typeof document === "undefined") return null;
  return document.modelContext ?? (typeof navigator !== "undefined" ? navigator.modelContext : undefined) ?? null;
}

export function emitWebMCPEvent(detail: Omit<WebMCPEventDetail, "v">): void {
  const payload: WebMCPEventDetail = { v: WEBMCP_EVENT_VERSION, ...detail };
  if (readLocal("rex.webmcp.debug") === "1") console.debug("[webmcp]", payload);
  try {
    window.dispatchEvent(new CustomEvent(WEBMCP_EVENT_NAME, { detail: payload }));
  } catch {
    /* kein DOM (Tests) */
  }
}

/**
 * Origin-Trial-Token programmatisch injizieren (offiziell dokumentierter Weg),
 * damit er nur auf Seiten mit Tools ausgeliefert wird. Idempotent. Das Token
 * ist öffentlich (kein Secret) und kommt aus der Netlify-Env-Variable.
 */
export function ensureOriginTrialToken(): boolean {
  const token = env("VITE_WEBMCP_OT_TOKEN")?.trim();
  if (!token || typeof document === "undefined") return false;
  if (document.querySelector(`meta[http-equiv="origin-trial"][data-rex-webmcp]`)) return true;
  const meta = document.createElement("meta");
  meta.httpEquiv = "origin-trial";
  meta.content = token;
  meta.setAttribute("data-rex-webmcp", "1");
  document.head.append(meta);
  return true;
}

/** Lebenszyklus- und Aufruf-Signal kombinieren (AbortSignal.any mit Fallback). */
export function combineSignals(a: AbortSignal, b: AbortSignal | undefined): AbortSignal {
  if (!b) return a;
  const anyFn = (AbortSignal as unknown as { any?: (signals: AbortSignal[]) => AbortSignal }).any;
  if (typeof anyFn === "function") return anyFn([a, b]);
  const c = new AbortController();
  const onAbort = () => c.abort();
  if (a.aborted || b.aborted) c.abort();
  a.addEventListener("abort", onAbort, { once: true });
  b.addEventListener("abort", onAbort, { once: true });
  return c.signal;
}

/** Nach Token-Injektion kann die API kurz verzögert erscheinen; begrenzt warten. */
async function waitForModelContext(signal: AbortSignal, maxMs: number): Promise<WebMCP.ModelContext | null> {
  const started = Date.now();
  while (!signal.aborted && Date.now() - started < maxMs) {
    const mc = getModelContext();
    if (mc) return mc;
    await new Promise((r) => setTimeout(r, 100));
  }
  return getModelContext();
}

const newInvocationId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `inv-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

/**
 * Registriert ein Tool. `lifecycle` steuert die Lebensdauer der Registrierung
 * (abort = abmelden). Der execute-Wrapper protokolliert Aufrufe ohne Nutzdaten,
 * kombiniert beide Signale, prüft die JSON-Serialisierbarkeit und liefert bei
 * Fehlern ein strukturiertes Objekt statt einer Exception.
 */
export async function registerWebMCPTool(tool: WebMCPTool, lifecycle: AbortSignal): Promise<RegistrationResult> {
  const state = webmcpEnabledState();
  if (!state.enabled) return report({ status: "disabled", reason: state.reason });
  const injected = ensureOriginTrialToken();
  let mc = getModelContext();
  if (!mc && injected) mc = await waitForModelContext(lifecycle, 1500);
  if (!mc || typeof mc.registerTool !== "function") return report({ status: "unsupported" });
  if (lifecycle.aborted) return report({ status: "registration_aborted" });

  const wrapped: WebMCPTool = {
    ...tool,
    execute: async (input, options) => {
      const invocationId = newInvocationId();
      const t0 = typeof performance !== "undefined" ? performance.now() : Date.now();
      const signal = combineSignals(lifecycle, options?.signal);
      emitWebMCPEvent({ event: "invocation_start", tool: tool.name, invocationId });
      const done = (event: WebMCPEventType, extra: Partial<WebMCPEventDetail> = {}) =>
        emitWebMCPEvent({ event, tool: tool.name, invocationId, durationMs: Math.round((typeof performance !== "undefined" ? performance.now() : Date.now()) - t0), ...extra });
      try {
        if (signal.aborted) { done("invocation_aborted"); return { ok: false, error: { code: "ABORTED", message: "Aufruf abgebrochen." } }; }
        const result = await tool.execute(input, { signal });
        const serialised = JSON.parse(JSON.stringify(result ?? null));
        if (signal.aborted) done("invocation_aborted");
        else if (isRecord(serialised) && serialised.ok === false) done("invocation_invalid_input", { errorCode: isRecord(serialised.error) ? String(serialised.error.code ?? "") : undefined });
        else done("invocation_result");
        return serialised;
      } catch (e) {
        done("invocation_error", { errorCode: "INTERNAL_ERROR" });
        console.error(`[webmcp] ${tool.name}:`, e);
        return { ok: false, error: { code: "INTERNAL_ERROR", message: "Berechnung fehlgeschlagen. Bitte den Preisrechner auf der Seite direkt verwenden." } };
      }
    },
  };

  try {
    await mc.registerTool(wrapped, { signal: lifecycle });
  } catch (e) {
    if (lifecycle.aborted) return report({ status: "registration_aborted" });
    return report({ status: "registration_error", error: e instanceof Error ? `${e.name}: ${e.message}` : String(e) });
  }
  if (lifecycle.aborted) return report({ status: "registration_aborted" });
  return report({ status: "registered" });

  function report(r: RegistrationResult): RegistrationResult {
    emitWebMCPEvent({ event: "registration_result", tool: tool.name, status: r.status });
    return r;
  }
}
