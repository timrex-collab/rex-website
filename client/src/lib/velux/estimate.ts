/**
 * VELUX-Kostenschätzung — Typen und Berechnungskern (PricingEngine).
 *
 * Einzige Berechnungsinstanz für UI, PDF, Anfrage-Text und (ab PR-2a) WebMCP.
 * Die Formeln in `calcDetails` und `calcTotalsLegacy` wurden in PR-1a wörtlich
 * aus client/src/components/VeluxPreisrechner.tsx übernommen (Zeilen 344–354
 * Stand 889a9e8). Die Förder-/Steuerlogik des Altcodes (Step3) wurde in PR-1b
 * durch die Policies in funding.ts ersetzt: BEG EM und §35c EStG als
 * gleichrangige Alternativen, Basis nur förderrelevante Positionen (Uw ≤ 1,0),
 * dreiwertige Antworten, ausgewiesene Annahmen.
 */

import {
  BLINDS,
  EDW,
  GL,
  LABOR,
  SHUTTERS,
  WINDOWS,
  isEligibleGlazing,
  type BlindCode,
  type GlazingCode,
  type ModelCode,
  type ShutterCode,
  type SizeCode,
} from "./catalog";
import { evaluateFunding, type FundingAnswers, type FundingEvaluation } from "./funding";

export type ShutterChoice = ShutterCode | "none";
export type BlindChoice = BlindCode | "none";

/** Wizard-Entwurf: unvollständige Positionen (leere Strings) sind erlaubt. */
export interface DraftPosition {
  id?: number;
  model: ModelCode | "";
  size: SizeCode | "";
  glazing: GlazingCode | "";
  qty: number;
  shutter: ShutterChoice;
  shutterQty: number;
  blind: BlindChoice;
  blindQty: number;
}

/** Vollständige, für die Berechnung geeignete Position. */
export interface ValidatedPosition {
  model: ModelCode;
  size: SizeCode;
  glazing: GlazingCode;
  qty: number;
  shutter: ShutterChoice;
  shutterQty: number;
  blind: BlindChoice;
  blindQty: number;
}

/** Position im Wizard-State (mit React-Key). */
export type UiPosition = ValidatedPosition & { id: number };

/**
 * Zielkonfiguration für den Austausch — bewusst getrennt vom Bestandsfenster
 * (resolve.ts: ResolvedExistingWindow). Der Bestand liefert Typ/Größe als
 * Vorschlag; Zielmodell, neue Verglasung und Zubehör werden immer ausdrücklich
 * gewählt. Eine alte Verglasung wird nie als neue übernommen.
 */
export interface ReplacementConfiguration {
  positions: ValidatedPosition[];
  funding: FundingAnswers;
}

export interface PositionDetail extends ValidatedPosition {
  /** Fensterpreis je Stück (UVP netto) */
  wp: number;
  /** Eindeckrahmen EDW 2000 je Stück */
  edw: number;
  /** Rollladen je Stück (0 wenn keiner) */
  sp: number;
  /** Rollo je Stück (0 wenn keins) */
  bp: number;
  /** Material der Position gesamt (netto) */
  matPos: number;
  /** Einbau der Position gesamt (netto, Mindestpreise) */
  labPos: number;
}

export interface QuoteTotals {
  totalMat: number;
  totalLab: number;
  totalNetto: number;
  mwst: number;
  totalBrutto: number;
  totalFenster: number;
  hasIneligible: boolean;
  ineligibleCount: number;
}

export interface CanonicalEstimate {
  details: PositionDetail[];
  totals: QuoteTotals;
  funding: FundingEvaluation;
}

export function isCompletePosition(p: DraftPosition): p is DraftPosition & ValidatedPosition {
  return Boolean(p.model && p.size && p.glazing);
}

/**
 * Spiegelt `canStep1` des Wizards: mindestens eine Position, alle vollständig.
 * Liefert null, solange der Entwurf nicht berechenbar ist.
 */
export function toValidatedPositions(draft: DraftPosition[]): ValidatedPosition[] | null {
  if (draft.length === 0 || !draft.every(isCompletePosition)) return null;
  return draft.map(({ id: _id, ...rest }) => rest as ValidatedPosition);
}

/** Wörtlich aus VeluxPreisrechner.tsx Z. 344–354. */
export function calcDetails(positions: ValidatedPosition[]): PositionDetail[] {
  return positions.map((p) => {
    // Non-null-Assertion: der Altcode greift ebenfalls ungeprüft zu; eine im
    // Katalog nicht vorhandene Modell/Größe-Kombination wirft wie bisher.
    const wp = WINDOWS[p.model].prices[p.size]![p.glazing];
    const edw = EDW[p.size] || 0;
    const sp = p.shutter !== "none" && p.shutterQty > 0 ? SHUTTERS[p.shutter]?.prices[p.size] || 0 : 0;
    const bp = p.blind !== "none" && p.blindQty > 0 ? BLINDS[p.blind]?.prices[p.size] || 0 : 0;
    const matPos = (wp + edw) * p.qty + sp * p.shutterQty + bp * p.blindQty;
    const labPos =
      (LABOR.demontage + LABOR.einbau + LABOR.eindeckrahmen) * p.qty +
      (sp ? LABOR.rollladen * p.shutterQty : 0) +
      (bp ? LABOR.rollo * p.blindQty : 0);
    return { ...p, wp, edw, sp, bp, matPos, labPos };
  });
}

/** Preissummen (Material, Einbau, MwSt.); Formeln wie im Altcode Z. 366–372. */
export function calcTotals(details: PositionDetail[]): QuoteTotals {
  const totalMat = details.reduce((s, d) => s + d.matPos, 0);
  const totalLab = details.reduce((s, d) => s + d.labPos, 0);
  const totalNetto = totalMat + totalLab;
  const mwst = Math.round(totalNetto * 0.19);
  const totalBrutto = totalNetto + mwst;
  const totalFenster = details.reduce((s, d) => s + d.qty, 0);
  const ineligibleCount = details.filter((d) => !isEligibleGlazing(d.glazing)).length;
  return { totalMat, totalLab, totalNetto, mwst, totalBrutto, totalFenster, hasIneligible: ineligibleCount > 0, ineligibleCount };
}

/** Einstiegspunkt für UI, PDF, Text und WebMCP. */
export function buildEstimate(positions: ValidatedPosition[], answers: FundingAnswers): CanonicalEstimate {
  const details = calcDetails(positions);
  return { details, totals: calcTotals(details), funding: evaluateFunding(details, answers) };
}

export { GL };
export type { FundingAnswers, FundingEvaluation };
export type { GlazingCode, ModelCode, SizeCode, ShutterCode, BlindCode };
