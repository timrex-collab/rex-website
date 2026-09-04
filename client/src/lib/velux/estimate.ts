/**
 * VELUX-Kostenschätzung — Typen und Berechnungskern (PricingEngine).
 *
 * Einzige Berechnungsinstanz für UI, PDF, Anfrage-Text und (ab PR-2a) WebMCP.
 * Die Formeln in `calcDetails` und `calcTotalsLegacy` wurden in PR-1a wörtlich
 * aus client/src/components/VeluxPreisrechner.tsx übernommen (Zeilen 344–354
 * bzw. 366–412, Stand 889a9e8). Stellen, die bekannte fachliche Schwächen des
 * Altcodes bewusst konservieren, sind mit `LEGACY-QUIRK` markiert und werden in
 * PR-1b durch die Förder-Policies in funding.ts abgelöst.
 */

import {
  BLINDS,
  EDW,
  GL,
  LABOR,
  SHUTTERS,
  WINDOWS,
  fmt,
  isEligibleGlazing,
  type BlindCode,
  type GlazingCode,
  type ModelCode,
  type ShutterCode,
  type SizeCode,
} from "./catalog";

export type ShutterChoice = ShutterCode | "none";
export type BlindChoice = BlindCode | "none";
export type JaNein = "ja" | "nein";
/** Wizard-Antwort: "" = noch nicht beantwortet. */
export type JaNeinDraft = JaNein | "";

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

/** Förder-Check des Altcodes (drei Ja/Nein-Fragen). Wird in PR-1b abgelöst. */
export interface FundingAnswersLegacy {
  altbau: JaNeinDraft;
  sanierung: JaNeinDraft;
  isfp: JaNeinDraft;
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
  eligible: boolean;
  hasIsfp: boolean;
  bafaMaxBrutto: number;
  hasIneligible: boolean;
  ineligibleCount: number;
  foerderNetto: number;
  foerderBrutto: number;
  bafaBasis: number;
  isfpBonus: number;
  bafaFoerder: number;
  bafaRateEffektiv: number;
  bafaRateLabel: string;
  steuerBasis: number;
  steuerBonus: number;
  steuerJahr1: number;
  steuerJahr2: number;
  steuerJahr3: number;
  investitionBrutto: number;
  investitionSteuer: number;
}

export interface CanonicalEstimate {
  details: PositionDetail[];
  totals: QuoteTotals;
}

export const ISFP_SCHWELLE = 30000;

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

/** Wörtlich aus VeluxPreisrechner.tsx Z. 366–412 (Step3). */
export function calcTotalsLegacy(details: PositionDetail[], foerderung: FundingAnswersLegacy): QuoteTotals {
  const totalMat = details.reduce((s, d) => s + d.matPos, 0);
  const totalLab = details.reduce((s, d) => s + d.labPos, 0);
  const totalNetto = totalMat + totalLab;
  const mwst = Math.round(totalNetto * 0.19);
  const totalBrutto = totalNetto + mwst;
  const totalFenster = details.reduce((s, d) => s + d.qty, 0);

  // ─── Förderung nach BEG EM (BAFA Einzelmaßnahme) ─────────────────
  // Nur Fenster mit Uw ≤ 1,0 W/(m²·K) sind förderrelevant → ENERGIE + ENERGIE PLUS, NICHT THERMO
  const eligible = foerderung.altbau === "ja" && foerderung.sanierung === "ja";
  const hasIsfp = foerderung.isfp === "ja";
  const bafaMaxBrutto = hasIsfp ? 60000 : 30000; // Cap pro WE/Jahr auf Bruttokosten

  // Förderfähige Positionen: nur ENERGIE (E) oder ENERGIE PLUS (P)
  const eligibleDetails = details.filter((d) => isEligibleGlazing(d.glazing));
  const ineligibleDetails = details.filter((d) => d.glazing === "T");
  const hasIneligible = ineligibleDetails.length > 0;
  const ineligibleCount = ineligibleDetails.length;
  const foerderNetto = eligibleDetails.reduce((s, d) => s + d.matPos + d.labPos, 0);
  // LEGACY-QUIRK: foerderBrutto/bafaBasis werden auch bei eligible=false
  // berechnet (im Altcode nicht angezeigt). PR-1b liefert dann null.
  const foerderBrutto = Math.round(foerderNetto * 1.19);
  const bafaBasis = Math.min(foerderBrutto, bafaMaxBrutto);

  // BEG EM seit 21.07.2026: 15 % Grundförderung; der iSFP-Bonus von 5 Prozentpunkten
  // greift nur auf den Kostenanteil oberhalb von 30.000 €.
  const isfpBonusBasis = hasIsfp ? Math.max(0, bafaBasis - ISFP_SCHWELLE) : 0;
  const isfpBonus = Math.round(isfpBonusBasis * 0.05);
  const bafaFoerder = eligible && foerderBrutto > 0 ? Math.round(bafaBasis * 0.15) + isfpBonus : 0;
  // Effektiver Mischsatz für die Anzeige (z. B. 15,0 % / 17,5 %)
  const bafaRateEffektiv = bafaBasis > 0 ? bafaFoerder / bafaBasis : 0;
  const bafaRateLabel =
    isfpBonus > 0
      ? `${(bafaRateEffektiv * 100).toLocaleString("de-DE", { maximumFractionDigits: 1 })} % (15 % + 5 % iSFP-Bonus auf den Anteil über ${fmt(ISFP_SCHWELLE)} €)`
      : "15 %";

  // §35c EStG: 20% Steuerermäßigung über 3 Jahre (7%+7%+6%), kein Energieberater nötig
  // Voraussetzung: selbstgenutztes Wohneigentum, Gebäude ≥ 10 Jahre alt
  // LEGACY-QUIRK: Basis ist die Bruttosumme ALLER Positionen (auch THERMO, Uw 1,3)
  // und das Gate ist `eligible` (Gebäude > 5 Jahre statt > 10 Jahre). PR-1b korrigiert.
  const steuerBasis = Math.min(totalBrutto, 200000);
  const steuerBonus = eligible ? Math.round(steuerBasis * 0.2) : 0;
  const steuerJahr1 = eligible ? Math.round(steuerBasis * 0.07) : 0;
  const steuerJahr2 = eligible ? Math.round(steuerBasis * 0.07) : 0;
  const steuerJahr3 = eligible ? Math.round(steuerBasis * 0.06) : 0;

  // BAFA-Zuschuss ist Direktzahlung an Kunden — wird vom Brutto abgezogen, MwSt ändert sich nicht
  const investitionBrutto = totalBrutto - bafaFoerder;
  const investitionSteuer = totalBrutto - steuerBonus;

  return {
    totalMat, totalLab, totalNetto, mwst, totalBrutto, totalFenster,
    eligible, hasIsfp, bafaMaxBrutto, hasIneligible, ineligibleCount,
    foerderNetto, foerderBrutto, bafaBasis, isfpBonus, bafaFoerder,
    bafaRateEffektiv, bafaRateLabel,
    steuerBasis, steuerBonus, steuerJahr1, steuerJahr2, steuerJahr3,
    investitionBrutto, investitionSteuer,
  };
}

/** Einstiegspunkt für UI, PDF, Text und WebMCP. */
export function buildEstimate(positions: ValidatedPosition[], foerderung: FundingAnswersLegacy): CanonicalEstimate {
  const details = calcDetails(positions);
  return { details, totals: calcTotalsLegacy(details, foerderung) };
}

export { GL };
export type { GlazingCode, ModelCode, SizeCode, ShutterCode, BlindCode };
