/**
 * React-Bridge zwischen dem Apply-Tool und dem sichtbaren Preisrechner.
 *
 * - `apply` setzt Positionen, Förderantworten und Schritt 3 über die normalen
 *   Setter der Komponente und löst erst auf, wenn React den neuen State
 *   tatsächlich gerendert hat (bestätigter Commit).
 * - Nur eine Übernahme gleichzeitig (BUSY), abbrechbar über AbortSignal,
 *   Scroll/Fokus respektieren prefers-reduced-motion, Screenreader-Hinweis
 *   über aria-live, Session-Marker für den späteren CTA-Übergang.
 * - Die Bridge ist referenzstabil; aktueller State wird über Refs gelesen.
 */

import { useEffect, useMemo, useRef } from "react";
import { emitWebMCPEvent } from "@/lib/webmcp";
import type { DraftPosition, ValidatedPosition } from "./estimate";
import { EMPTY_FUNDING_ANSWERS, type FundingAnswers } from "./funding";
import type { ApplyOutcome, VeluxUiBridge } from "./tools";

export const RESULT_ANCHOR_ID = "rechner-ergebnis";
export const APPLIED_SESSION_KEY = "rex.webmcp.applied";

interface BridgeArgs {
  positions: DraftPosition[];
  funding: FundingAnswers;
  step: number;
  setPositions: (p: DraftPosition[]) => void;
  setFunding: (f: FundingAnswers) => void;
  setStep: (s: number) => void;
  announce: (message: string) => void;
  makeId: () => number;
}

interface Pending {
  ids: number[];
  resolve: (o: ApplyOutcome) => void;
  signal: AbortSignal | undefined;
  onAbort: (() => void) | null;
}

export function hasUserDraft(positions: DraftPosition[], funding: FundingAnswers, step: number): boolean {
  if (step > 1) return true;
  if (positions.some((p) => p.model || p.size || p.glazing)) return true;
  return (Object.keys(EMPTY_FUNDING_ANSWERS) as Array<keyof FundingAnswers>).some((k) => funding[k] !== "");
}

function focusResult(signal: AbortSignal | undefined): void {
  if (typeof document === "undefined" || signal?.aborted) return;
  const el = document.getElementById(RESULT_ANCHOR_ID);
  if (!el) return;
  const reduced = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  el.focus({ preventScroll: true });
}

export function useVeluxBridge(args: BridgeArgs): VeluxUiBridge {
  const stateRef = useRef(args);
  stateRef.current = args;
  const pendingRef = useRef<Pending | null>(null);

  // Commit-Bestätigung: sobald der gesetzte State gerendert ist, auflösen.
  useEffect(() => {
    const pending = pendingRef.current;
    if (!pending) return;
    const ids = args.positions.map((p) => p.id ?? -1);
    const committed = args.step === 3 && ids.length === pending.ids.length && ids.every((id, i) => id === pending.ids[i]);
    if (!committed) return;
    pendingRef.current = null;
    pending.signal?.removeEventListener("abort", pending.onAbort as () => void);
    if (pending.signal?.aborted) { pending.resolve({ applied: false, code: "ABORTED" }); return; }
    emitWebMCPEvent({ event: "ui_apply_committed" });
    try { sessionStorage.setItem(APPLIED_SESSION_KEY, "1"); } catch { /* privat/blockiert */ }
    args.announce("Konfiguration aus der KI-Anfrage übernommen. Das Ergebnis wird unter Schritt 3 angezeigt.");
    const raf = typeof requestAnimationFrame === "function" ? requestAnimationFrame : (cb: () => void) => setTimeout(cb, 0);
    raf(() => focusResult(pending.signal));
    pending.resolve({ applied: true });
  }, [args.positions, args.funding, args.step]);

  return useMemo<VeluxUiBridge>(() => ({
    hasUserDraft: () => {
      const s = stateRef.current;
      return hasUserDraft(s.positions, s.funding, s.step);
    },
    apply: (positions: ValidatedPosition[], funding: FundingAnswers, signal: AbortSignal | undefined) =>
      new Promise<ApplyOutcome>((resolve) => {
        if (pendingRef.current) { resolve({ applied: false, code: "BUSY" }); return; }
        if (signal?.aborted) { resolve({ applied: false, code: "ABORTED" }); return; }
        const s = stateRef.current;
        const withIds = positions.map((p) => ({ ...p, id: s.makeId() }));
        const pending: Pending = { ids: withIds.map((p) => p.id), resolve, signal, onAbort: null };
        pending.onAbort = () => {
          if (pendingRef.current === pending) { pendingRef.current = null; resolve({ applied: false, code: "ABORTED" }); }
        };
        signal?.addEventListener("abort", pending.onAbort, { once: true });
        pendingRef.current = pending;
        s.setPositions(withIds);
        s.setFunding(funding);
        s.setStep(3);
      }),
  }), []);
}
