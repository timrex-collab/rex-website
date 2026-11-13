/**
 * P4b – MCP-Endpunkt `/mcp` für den VELUX-Preisrechner (ChatGPT-Plugin, Variante A).
 *
 * Grundlage: UMSETZUNGSPLAN-2026-10-KI-ANFRAGEN.md (P4) und Planentwurf 2 (Commit 4e35371,
 * Codex-Gegenlesung 11.11.2026). Deploy 1 (#115): lesende Tools. Deploy 2: Anfrage senden.
 *
 * - Lesende Tools aus `client/src/lib/velux` – dieselbe Fachlogik wie WebMCP und Rechner.
 * - `prepare` baut auf dem Server den vollständigen Versandinhalt (Beträge aus der zentralen Logik)
 *   und bindet ihn über `summaryId` (SHA-256 über Inhalt, Rechenversion und `submissionKey`).
 *   Es speichert nichts.
 * - `submit` sendet nur genau diesen Inhalt: Hash-Vergleich, atomare Reservierung des
 *   `submissionKey` (Zustände in Bearbeitung / übermittelt / Ausgang unklar), Tageskontingent über
 *   atomare Plätze, dann POST an Netlify Forms (`velux-preisrechner`). Kein Foto.
 * - Stores nach Deploy-Kontext getrennt (`rex-mcp-production`, `rex-mcp-preview`); lokal und in CI
 *   Speicher im Arbeitsspeicher und Probelauf ohne Versand.
 * - Ohne Authentifizierung. Antwortet nur auf www.rex-bedachung.de, Deploy-Previews und lokal.
 * - Anfragen über 64 KB werden abgelehnt; Aufruflimit über die Rate-Limit-Regel unten.
 * - Unsere Anwendungslogs enthalten keine Eingaben: nur Tool-Name, Ergebnis-Code und Dauer.
 */

import { getStore } from "@netlify/blobs";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { buildCalculateTool, buildOptionsTool, buildResolveTool } from "../../client/src/lib/velux/tools";
import { ESTIMATE_INPUT_SCHEMA } from "../../client/src/lib/velux/validate";
import { INQUIRY_LIMITS, PHOTO_FOLLOW_UP, PHOTO_NOT_SENT, buildPluginInquiry } from "../../client/src/lib/velux/inquiry";

/** Höchstgröße einer Anfrage in Byte (Plan P4b, 2.1). */
export const MAX_BODY_BYTES = 64 * 1024;
/** Höchstzahl neuer Anfragen pro Kalendertag (Europe/Berlin), E4. */
export const DAILY_LIMIT = 50;
/** Wartezeit auf Netlify Forms, danach gilt der Ausgang als unklar. */
export const SEND_TIMEOUT_MS = 10_000;
const IDEM_TTL_MS = 24 * 60 * 60 * 1000;
const PHONE = "0234 / 58 31 00";
const CALCULATOR_URL = "https://www.rex-bedachung.de/velux-preisrechner-bochum";

export const TOOL = {
  prepare: "rex_velux_prepare_inquiry_v1",
  submit: "rex_velux_submit_inquiry_v1",
} as const;

// ── Speicher ─────────────────────────────────────────────────────────

/** Minimale Schnittstelle zu Netlify Blobs; im Test und lokal durch `memoryStore` ersetzt. */
export interface KeyStore {
  /** Legt den Schlüssel nur an, wenn er noch nicht existiert. true = angelegt. */
  createIfNew(key: string, value: string): Promise<boolean>;
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  list(prefix: string): Promise<string[]>;
}

export function memoryStore(): KeyStore {
  const m = new Map<string, string>();
  return {
    async createIfNew(k, v) { if (m.has(k)) return false; m.set(k, v); return true; },
    async get(k) { return m.get(k) ?? null; },
    async set(k, v) { m.set(k, v); },
    async delete(k) { m.delete(k); },
    async list(p) { return Array.from(m.keys()).filter((k) => k.startsWith(p)); },
  };
}

function blobStore(name: string): KeyStore {
  const store = getStore({ name, consistency: "strong" });
  return {
    async createIfNew(k, v) { const r = await store.set(k, v, { onlyIfNew: true }); return r.modified; },
    async get(k) { return (await store.get(k, { type: "text" })) ?? null; },
    async set(k, v) { await store.set(k, v); },
    async delete(k) { await store.delete(k); },
    async list(p) { return (await store.list({ prefix: p })).blobs.map((b) => b.key); },
  };
}

// ── Versand ──────────────────────────────────────────────────────────

export type SendOutcome = "sent" | "rejected" | "unknown";
export type Sender = (fields: Record<string, string>) => Promise<SendOutcome>;

/**
 * POST an Netlify Forms.
 * - 2xx/3xx: angenommen.
 * - 4xx (außer 408): eindeutig abgelehnt, ein neuer Versuch ist erlaubt.
 * - 408, 5xx (z. B. Gateway-Fehler), Timeout, Abbruch: Ausgang unklar – die Anfrage kann trotzdem
 *   angekommen sein, deshalb kein Neuversand (Codex-Review #116, P1).
 */
export function netlifyFormsSender(origin: string, timeoutMs = SEND_TIMEOUT_MS): Sender {
  return async (fields) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(`${origin}/`, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(fields).toString(),
        redirect: "manual",
        signal: controller.signal,
      });
      if (res.status >= 200 && res.status < 400) return "sent";
      if (res.status >= 400 && res.status < 500 && res.status !== 408) return "rejected";
      return "unknown";
    } catch {
      return "unknown";
    } finally {
      clearTimeout(timer);
    }
  };
}

// ── Anfrage-Dienst ───────────────────────────────────────────────────

export type Mode = "production" | "preview" | "local";

export interface InquiryDeps {
  mode: Mode;
  store: KeyStore;
  send: Sender;
  now?: () => Date;
  randomKey?: () => string;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const HEX64 = /^[0-9a-f]{64}$/;

async function sha256Hex(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function summaryIdFor(fields: Record<string, string>, calcVersion: string, submissionKey: string): Promise<string> {
  const ordered = Object.keys(fields).sort().map((k) => [k, fields[k]]);
  return sha256Hex(JSON.stringify({ v: calcVersion, k: submissionKey, f: ordered }));
}

const berlinDay = (d: Date) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin" }).format(d);
const pad2 = (n: number) => String(n).padStart(2, "0");

type Result = Record<string, unknown>;
const failure = (code: string, message: string, extra: Result = {}): Result => ({ ok: false, error: { code, message }, ...extra });

/** Nimmt die Steuerfelder von `submit` aus der Eingabe, der Rest ist die Anfrage wie bei `prepare`. */
function splitSubmit(input: unknown): { ok: true; inquiry: Result; summaryId: string; submissionKey: string; confirmed: unknown } | { ok: false; result: Result } {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, result: failure("INVALID_INPUT", "Eingabe muss ein Objekt sein.") };
  const { summaryId, submissionKey, userConfirmed, ...inquiry } = input as Result;
  if (typeof submissionKey !== "string" || !UUID.test(submissionKey)) return { ok: false, result: failure("INVALID_INPUT", "submissionKey fehlt oder ist ungültig – den Wert aus rex_velux_prepare_inquiry_v1 übergeben.") };
  if (typeof summaryId !== "string" || !HEX64.test(summaryId)) return { ok: false, result: failure("INVALID_INPUT", "summaryId fehlt oder ist ungültig – den Wert aus rex_velux_prepare_inquiry_v1 übergeben.") };
  return { ok: true, inquiry, summaryId, submissionKey, confirmed: userConfirmed };
}

export function createInquiryService(deps: InquiryDeps) {
  const now = deps.now ?? (() => new Date());
  const randomKey = deps.randomKey ?? (() => crypto.randomUUID());
  const testPrefix = deps.mode === "production" ? undefined : deps.mode === "preview" ? "TEST – Preview" : "TEST – lokal";

  async function prepare(input: unknown): Promise<Result> {
    await cleanup();
    const built = buildPluginInquiry(input, { testPrefix });
    if (!built.ok) return failure(built.error.code, built.error.message, built.error.path ? { path: built.error.path } : {});
    const submissionKey = randomKey();
    const summaryId = await summaryIdFor(built.fields, built.calcVersion, submissionKey);
    return {
      ok: true,
      summary: built.summary,
      summaryId,
      submissionKey,
      calcVersion: built.calcVersion,
      photoNote: PHOTO_NOT_SENT,
      agentInstruction:
        "Zeige dem Nutzer die Zusammenfassung vollständig (mit Kontaktdaten, Nachricht, Fensterzuordnung und dem Hinweis zum Foto). " +
        "Sende nur, wenn er genau dieser Zusammenfassung ausdrücklich zustimmt, mit rex_velux_submit_inquiry_v1 und denselben Eingaben, " +
        "summaryId, submissionKey und userConfirmed=true. Ändert er etwas, rufe rex_velux_prepare_inquiry_v1 neu auf und frage erneut.",
    };
  }

  /**
   * Löscht Kontingent-Plätze von Vortagen und Versandvermerke, die älter als 24 Stunden sind.
   * Läuft bei jedem prepare und submit (best effort): Wird das Plugin nicht genutzt, bleiben die
   * Einträge bis zum nächsten Aufruf liegen – so steht es auch in der Datenschutzerklärung.
   */
  async function cleanup(): Promise<void> {
    const t = now().getTime();
    const today = berlinDay(now());
    try {
      for (const key of await deps.store.list("quota/")) {
        if (key.slice(6, 16) < today) await deps.store.delete(key);
      }
      for (const key of await deps.store.list("idem/")) {
        const raw = await deps.store.get(key);
        const at = raw ? Number(JSON.parse(raw).at) : 0;
        if (!at || t - at > IDEM_TTL_MS) await deps.store.delete(key);
      }
    } catch { /* Aufräumen darf den Versand nie beeinflussen */ }
  }

  async function submit(input: unknown): Promise<Result> {
    await cleanup();
    const split = splitSubmit(input);
    if (!split.ok) return split.result;
    if (split.confirmed !== true) {
      return failure("CONFIRMATION_MISSING", "Nicht gesendet: userConfirmed=true fehlt. Erst die Zusammenfassung zeigen und die ausdrückliche Zustimmung des Nutzers einholen.");
    }
    const built = buildPluginInquiry(split.inquiry, { testPrefix });
    if (!built.ok) return failure(built.error.code, built.error.message, built.error.path ? { path: built.error.path } : {});
    const expected = await summaryIdFor(built.fields, built.calcVersion, split.submissionKey);
    if (expected !== split.summaryId) {
      return failure("SUMMARY_MISMATCH", "Nicht gesendet: Die Anfrage weicht von der bestätigten Zusammenfassung ab (Eingaben, Beträge oder Rechenversion). " +
        "Bitte rex_velux_prepare_inquiry_v1 neu aufrufen, die neue Zusammenfassung zeigen und erneut zustimmen lassen.");
    }

    const t = now().getTime();
    const today = berlinDay(now());
    const idemKey = `idem/${split.submissionKey}`;

    // 1. Reservieren (atomar). Scheitert der Speicher, wird nicht gesendet.
    let reserved: boolean;
    try {
      reserved = await deps.store.createIfNew(idemKey, JSON.stringify({ state: "in_progress", at: t }));
    } catch {
      return failure("STORE_UNAVAILABLE", `Nicht gesendet: Der Versand ist gerade nicht möglich. Bitte später erneut versuchen oder anrufen: ${PHONE}.`);
    }
    if (!reserved) {
      let state = "in_progress";
      try { const raw = await deps.store.get(idemKey); if (raw) state = JSON.parse(raw).state; } catch { /* Zustand unbekannt */ }
      if (state === "sent") return { ok: true, status: "ALREADY_SENT", message: "Diese Anfrage wurde bereits gesendet. Nicht erneut senden." };
      if (state === "unknown") return failure("OUTCOME_UNKNOWN", `Ob diese Anfrage angekommen ist, konnten wir nicht bestätigen. Bitte nicht erneut senden. Wenn Sie sichergehen möchten, rufen Sie uns an: ${PHONE}.`);
      return failure("IN_PROGRESS", "Diese Anfrage wird gerade gesendet. Bitte nicht erneut senden.");
    }

    // 2. Tageskontingent: einen freien Platz atomar belegen.
    let slot: string | null = null;
    try {
      for (let i = 1; i <= DAILY_LIMIT && !slot; i++) {
        const key = `quota/${today}/${pad2(i)}`;
        if (await deps.store.createIfNew(key, JSON.stringify({ at: t }))) slot = key;
      }
    } catch {
      await deps.store.delete(idemKey).catch(() => {});
      return failure("STORE_UNAVAILABLE", `Nicht gesendet: Der Versand ist gerade nicht möglich. Bitte später erneut versuchen oder anrufen: ${PHONE}.`);
    }
    if (!slot) {
      await deps.store.delete(idemKey).catch(() => {});
      return failure("DAILY_LIMIT", `Nicht gesendet: Für heute sind keine weiteren Anfragen über ChatGPT möglich. Bitte morgen erneut versuchen, den Rechner nutzen (${CALCULATOR_URL}) oder anrufen: ${PHONE}.`);
    }

    // 3. Versand (lokal nur Probelauf).
    const outcome: SendOutcome = deps.mode === "local" ? "sent" : await deps.send(built.fields);

    // 4. Ergebnis festhalten.
    if (outcome === "rejected") {
      await deps.store.delete(idemKey).catch(() => {});
      return failure("SEND_FAILED", `Nicht gesendet: Das Formular hat die Anfrage abgelehnt. Bitte später erneut versuchen oder anrufen: ${PHONE}.`);
    }
    if (outcome === "unknown") {
      await deps.store.set(idemKey, JSON.stringify({ state: "unknown", at: t })).catch(() => {});
      return failure("OUTCOME_UNKNOWN", `Ob die Anfrage angekommen ist, konnten wir nicht bestätigen. Bitte nicht erneut senden. Wenn Sie sichergehen möchten, rufen Sie uns an: ${PHONE}.`);
    }
    await deps.store.set(idemKey, JSON.stringify({ state: "sent", at: t })).catch(() => {});
    return {
      ok: true,
      status: "SENT",
      ...(deps.mode === "local" ? { dryRun: true } : {}),
      message: `Ihre Anfrage ist bei Rex Bedachungs GmbH eingegangen. ${built.hasEmail ? PHOTO_FOLLOW_UP.email : PHOTO_FOLLOW_UP.phone}`,
    };
  }

  return { prepare, submit };
}

// ── Tool-Definitionen ────────────────────────────────────────────────

const INQUIRY_PROPERTIES = {
  positions: ESTIMATE_INPUT_SCHEMA.properties.positions,
  funding: ESTIMATE_INPUT_SCHEMA.properties.funding,
  contact: {
    type: "object",
    additionalProperties: false,
    required: ["name"],
    description: "Kontaktdaten wie im Rechnerformular: Name und E-Mail oder Telefon; Adresse freiwillig. Nur Angaben, die der Nutzer selbst gemacht hat.",
    properties: {
      name: { type: "string", minLength: INQUIRY_LIMITS.name.min, maxLength: INQUIRY_LIMITS.name.max },
      email: { type: "string", maxLength: INQUIRY_LIMITS.email },
      telefon: { type: "string", maxLength: INQUIRY_LIMITS.telefon.max },
      strasse: { type: "string", maxLength: INQUIRY_LIMITS.strasse },
      plz: { type: "string", maxLength: INQUIRY_LIMITS.plz },
      ort: { type: "string", maxLength: INQUIRY_LIMITS.ort },
    },
  },
  message: { type: "string", maxLength: INQUIRY_LIMITS.nachricht, description: "Optionale Nachricht des Nutzers, wörtlich – keine eigene Formulierung." },
  existingWindowNote: {
    type: "object",
    additionalProperties: false,
    required: ["status"],
    description: "Optional: Bestandsfenster. status=confirmed nur, wenn der Nutzer die Zuordnung ausdrücklich bestätigt hat; assumed bei einer nicht bestätigten Lesart (z. B. vom Foto); none ohne Angabe.",
    properties: {
      reading: { type: "string", maxLength: INQUIRY_LIMITS.reading, description: "Gelesene Typenbezeichnung, z. B. „GGL S10 → SK10“." },
      status: { type: "string", enum: ["confirmed", "assumed", "none"] },
    },
  },
} as const;

function inquiryTools(service: ReturnType<typeof createInquiryService>) {
  return [
    {
      name: TOOL.prepare,
      title: "VELUX-Anfrage vorbereiten",
      description:
        "Bereitet eine Angebotsanfrage an Rex Bedachungs GmbH vor, sendet aber nichts. Rechnet die Kostenschätzung auf dem Server neu und liefert die " +
        "vollständige Zusammenfassung, summaryId und submissionKey. Die Zusammenfassung dem Nutzer vollständig zeigen und nur nach seiner ausdrücklichen " +
        "Zustimmung rex_velux_submit_inquiry_v1 aufrufen. Ein Foto aus dem Chat wird nicht übertragen.",
      inputSchema: { type: "object", additionalProperties: false, required: ["positions", "funding", "contact"], properties: INQUIRY_PROPERTIES },
      annotations: { readOnlyHint: true },
      execute: (input: unknown) => service.prepare(input),
    },
    {
      name: TOOL.submit,
      title: "VELUX-Anfrage senden",
      description:
        "Sendet die mit rex_velux_prepare_inquiry_v1 vorbereitete Anfrage an Rex Bedachungs GmbH. Nur aufrufen, wenn der Nutzer genau dieser " +
        "Zusammenfassung ausdrücklich zugestimmt hat – mit denselben Eingaben, summaryId, submissionKey und userConfirmed=true. Bei SUMMARY_MISMATCH neu " +
        "vorbereiten und erneut fragen. Bei IN_PROGRESS, ALREADY_SENT oder OUTCOME_UNKNOWN nicht erneut senden.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        required: ["positions", "funding", "contact", "summaryId", "submissionKey", "userConfirmed"],
        properties: {
          ...INQUIRY_PROPERTIES,
          summaryId: { type: "string", description: "Aus rex_velux_prepare_inquiry_v1." },
          submissionKey: { type: "string", description: "Aus rex_velux_prepare_inquiry_v1." },
          userConfirmed: { type: "boolean", description: "true nur nach ausdrücklicher Zustimmung des Nutzers zu genau dieser Zusammenfassung." },
        },
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
      execute: (input: unknown) => service.submit(input),
    },
  ];
}

// ── Server ───────────────────────────────────────────────────────────

export function buildServer(deps: InquiryDeps): Server {
  const tools = [buildOptionsTool(), buildResolveTool(), buildCalculateTool(), ...inquiryTools(createInquiryService(deps))];
  const server = new Server(
    { name: "rex-velux-preisrechner", version: "2.0.0" },
    {
      capabilities: { tools: {} },
      instructions:
        "Endpunkt der Rex Bedachungs GmbH (Bochum, autorisierter VELUX-Partner). Die Werkzeuge berechnen eine unverbindliche Kostenschätzung für den " +
        "Austausch von VELUX-Dachfenstern. Eine Anfrage an Rex wird nur gesendet, wenn der Nutzer der vollständigen Zusammenfassung aus " +
        "rex_velux_prepare_inquiry_v1 ausdrücklich zustimmt. Alternativ öffnet der Nutzer den calculatorUrl und sendet im Rechner selbst ab.",
    },
  );
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: tools.map((t) => ({
      name: t.name,
      ...(t.title ? { title: t.title } : {}),
      description: t.description,
      inputSchema: t.inputSchema as { type: "object"; [key: string]: unknown },
      ...(t.annotations ? { annotations: t.annotations } : {}),
    })),
  }));
  server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
    const started = Date.now();
    const tool = tools.find((t) => t.name === request.params.name);
    if (!tool) {
      return { isError: true, content: [{ type: "text" as const, text: `Unbekanntes Werkzeug: ${request.params.name}` }] };
    }
    const result = (await tool.execute(request.params.arguments ?? {}, { signal: extra.signal } as never)) as Record<string, unknown>;
    const isError = result?.ok === false;
    const code = isError ? (result.error as { code?: string } | undefined)?.code ?? "ERROR" : (result.status as string | undefined) ?? "OK";
    // Nur Tool-Name, Ergebnis-Code und Dauer – keine Eingaben.
    console.log(JSON.stringify({ tool: tool.name, code, ms: Date.now() - started }));
    return {
      ...(isError ? { isError: true } : {}),
      structuredContent: result,
      content: [{ type: "text" as const, text: JSON.stringify(result) }],
    };
  });
  return server;
}

/** Live-Domain, Deploy-Previews und lokale Tests; alles andere (Branch-Aliase, Permalinks) bleibt gesperrt. */
const ALLOWED_HOST = /^(www\.rex-bedachung\.de|deploy-preview-\d+--leafy-sprite-bbbfd6\.netlify\.app|localhost|127\.0\.0\.1)$/;

export function isAllowedHost(req: Request): boolean {
  try {
    return ALLOWED_HOST.test(new URL(req.url).hostname);
  } catch {
    return false;
  }
}

interface NetlifyContext { deploy?: { context?: string } }

/** Produktion nur mit Production-Kontext und Live-Domain; Preview nur auf Deploy-Previews; sonst lokal. */
export function resolveMode(req: Request, context?: NetlifyContext): Mode {
  const host = new URL(req.url).hostname;
  if (context?.deploy?.context === "production" && host === "www.rex-bedachung.de") return "production";
  if (context?.deploy?.context === "deploy-preview" && host.startsWith("deploy-preview-")) return "preview";
  return "local";
}

const localStore = memoryStore();

function depsFor(req: Request, context?: NetlifyContext): InquiryDeps {
  const mode = resolveMode(req, context);
  if (mode === "local") return { mode, store: localStore, send: async () => "sent" };
  return {
    mode,
    store: blobStore(mode === "production" ? "rex-mcp-production" : "rex-mcp-preview"),
    send: netlifyFormsSender(new URL(req.url).origin),
  };
}

const json = (status: number, message: string) =>
  new Response(JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32600, message } }), {
    status,
    headers: { "content-type": "application/json" },
  });

export default async (req: Request, context?: NetlifyContext): Promise<Response> => {
  if (!isAllowedHost(req)) return new Response("Not Found", { status: 404 });

  // Größengrenze: erst den Header, dann die tatsächliche Länge prüfen.
  const declared = Number(req.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return json(413, "Anfrage zu groß");
  let forward = req;
  if (req.method === "POST") {
    const body = await req.arrayBuffer();
    if (body.byteLength > MAX_BODY_BYTES) return json(413, "Anfrage zu groß");
    forward = new Request(req.url, { method: req.method, headers: req.headers, body });
  }

  const server = buildServer(depsFor(req, context));
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  await server.connect(transport);
  try {
    return await transport.handleRequest(forward);
  } finally {
    void server.close();
  }
};

/**
 * Aufruflimit (Plan P4b, 3.1; E4 freigegeben 11.11.2026): 60 Aufrufe pro 60 s je Absender-IP.
 * Gilt für den ganzen Pfad, also auch Handshake und Tool-Liste. Ungültige Regeln lassen den Deploy
 * nicht scheitern – nach jedem Deploy im Netlify-Log prüfen, ob die Regel aktiv ist.
 */
export const config = {
  path: "/mcp",
  rateLimit: {
    windowLimit: 60,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};
