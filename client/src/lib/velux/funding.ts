/**
 * Förder-Policies der VELUX-Kostenschätzung: BEG EM (BAFA-Zuschuss) und
 * Steuerermäßigung nach §35c EStG — als gleichrangige, nicht kombinierbare
 * Alternativen, ohne Empfehlung.
 *
 * Geltungsbereich: erste, selbstgenutzte Wohneinheit (EFH/ZFH). Jede Ausgabe
 * ist ein „rechnerischer Maximalwert unter Annahmen" (status
 * potentially_eligible); fehlende Antworten werden als Annahme ausgewiesen.
 *
 * Quellen: BEG-UPDATE-2026-07.md (Richtlinie BEG EM vom 17.07.2026, in Kraft
 * seit 21.07.2026), §35c EStG / ESanMV Anlage 4 (Dachflächenfenster Uw ≤ 1,0).
 * Regelfreigabe: Plan v3 vom 04.09.2026 (siehe PR-1b).
 */

import { isEligibleGlazing } from "./catalog";
import type { PositionDetail } from "./estimate";

export type TriState = "yes" | "no" | "unknown";
export type BuildingAge = "under_5" | "5_to_10" | "over_10" | "unknown";

/** Antworten des Förder-Checks. Im Wizard-Entwurf sind leere Strings erlaubt. */
export interface FundingAnswers {
  buildingAge: BuildingAge | "";
  energyRenovation: TriState | "";
  ownerOccupied: TriState | "";
  hasIsfp: TriState | "";
}

export const EMPTY_FUNDING_ANSWERS: FundingAnswers = {
  buildingAge: "",
  energyRenovation: "",
  ownerOccupied: "",
  hasIsfp: "",
};

export function isFundingComplete(a: FundingAnswers): boolean {
  return Boolean(a.buildingAge && a.energyRenovation && a.ownerOccupied && a.hasIsfp);
}

export interface RuleSetMeta {
  rulesVersion: string;
  label: string;
  effectiveFrom: string;
  lastReviewedAt: string;
  /** Wiedervorlage: bis dahin gilt die Regel als geprüft. */
  validThrough: string;
}

export const RULES: { beg: RuleSetMeta; tax35c: RuleSetMeta } = {
  beg: {
    rulesVersion: "beg-em-2026-07-21",
    label: "BEG EM – BAFA-Zuschuss",
    effectiveFrom: "2026-07-21",
    lastReviewedAt: "2026-09-04",
    validThrough: "2026-12-31",
  },
  tax35c: {
    rulesVersion: "estg-35c-2026",
    label: "Steuerermäßigung §35c EStG",
    effectiveFrom: "2020-01-01",
    lastReviewedAt: "2026-09-04",
    validThrough: "2026-12-31",
  },
};

export const BEG = {
  rate: 0.15,
  isfpBonusRate: 0.05,
  /** Höchstgrenze förderrelevanter Ausgaben je WE/Jahr ohne iSFP (= iSFP-Bonus-Schwelle). */
  capWithoutIsfp: 30000,
  capWithIsfp: 60000,
} as const;

export const TAX35C = {
  rate: 0.2,
  /** 20 % von max. 200.000 € = 40.000 € je Objekt. */
  maxBase: 200000,
  years: [0.07, 0.07, 0.06] as const,
  yearCaps: [14000, 14000, 12000] as const,
} as const;

export interface BegScenario {
  kind: "beg";
  status: "potentially_eligible";
  eligibleCostsGross: number;
  cap: number;
  capApplied: boolean;
  base: number;
  isfpBonus: number;
  rateLabel: string;
  amountMax: number;
  assumptions: string[];
  missingAnswers: string[];
  meta: RuleSetMeta;
}

export interface TaxScenario {
  kind: "tax35c";
  status: "potentially_eligible";
  eligibleCostsGross: number;
  base: number;
  capApplied: boolean;
  totalMax: number;
  year1: number;
  year2: number;
  year3: number;
  assumptions: string[];
  missingAnswers: string[];
  meta: RuleSetMeta;
}

export interface FundingEvaluation {
  eligibleCostsNet: number;
  eligibleCostsGross: number;
  ineligibleThermoPositions: number;
  beg: BegScenario | null;
  /** Grund, warum kein BEG-Szenario ausgewiesen wird. */
  begReason: string | null;
  tax35c: TaxScenario | null;
  tax35cReason: string | null;
  notCombinable: true;
}

const fmtEur = (n: number) => new Intl.NumberFormat("de-DE").format(n);

/** Förderrelevante Kosten: nur Positionen mit Uw ≤ 1,0 (Material + Einbau). */
export function eligibleCosts(details: PositionDetail[]): { net: number; gross: number; thermoPositions: number } {
  const net = details.filter((d) => isEligibleGlazing(d.glazing)).reduce((s, d) => s + d.matPos + d.labPos, 0);
  const thermoPositions = details.filter((d) => !isEligibleGlazing(d.glazing)).length;
  return { net, gross: Math.round(net * 1.19), thermoPositions };
}

export function evaluateBeg(eligibleGross: number, a: FundingAnswers): { scenario: BegScenario | null; reason: string | null } {
  if (eligibleGross <= 0) return { scenario: null, reason: "Keine förderrelevante Verglasung gewählt (BEG-Anforderung Uw ≤ 1,0 W/m²K)." };
  if (a.buildingAge === "under_5") return { scenario: null, reason: "Das Gebäude ist jünger als 5 Jahre (Bauantrag); die BEG EM setzt mindestens 5 Jahre voraus." };
  if (a.energyRenovation === "no") return { scenario: null, reason: "Kein Fenstertausch mit verbessertem Uw-Wert angegeben." };

  const assumptions = ["erste Wohneinheit, Jahresbudget noch nicht verbraucht", "Antrag vor Vorhabenbeginn, Energieeffizienz-Experte eingebunden"];
  const missingAnswers: string[] = [];
  if (a.buildingAge === "unknown" || a.buildingAge === "") { assumptions.push("Gebäude älter als 5 Jahre (Angabe fehlt)"); missingAnswers.push("buildingAge"); }
  if (a.energyRenovation === "unknown" || a.energyRenovation === "") { assumptions.push("Fenstertausch mit verbessertem Uw-Wert (Angabe fehlt)"); missingAnswers.push("energyRenovation"); }
  const hasIsfp = a.hasIsfp === "yes";
  if (a.hasIsfp === "unknown" || a.hasIsfp === "") { assumptions.push("ohne iSFP gerechnet (Angabe fehlt)"); missingAnswers.push("hasIsfp"); }
  if (hasIsfp) assumptions.push("iSFP gültig und zur Maßnahme passend");

  const cap = hasIsfp ? BEG.capWithIsfp : BEG.capWithoutIsfp;
  const base = Math.min(eligibleGross, cap);
  const isfpBonus = hasIsfp ? Math.round(Math.max(0, base - BEG.capWithoutIsfp) * BEG.isfpBonusRate) : 0;
  const amountMax = Math.round(base * BEG.rate) + isfpBonus;
  const rateEffective = base > 0 ? amountMax / base : 0;
  const rateLabel = isfpBonus > 0
    ? `${(rateEffective * 100).toLocaleString("de-DE", { maximumFractionDigits: 1 })} % (15 % + 5 % iSFP-Bonus auf den Anteil über ${fmtEur(BEG.capWithoutIsfp)} €)`
    : "15 %";

  return {
    scenario: {
      kind: "beg", status: "potentially_eligible", eligibleCostsGross: eligibleGross,
      cap, capApplied: eligibleGross > cap, base, isfpBonus, rateLabel, amountMax,
      assumptions, missingAnswers, meta: RULES.beg,
    },
    reason: null,
  };
}

export function evaluateTax35c(eligibleGross: number, a: FundingAnswers): { scenario: TaxScenario | null; reason: string | null } {
  if (eligibleGross <= 0) return { scenario: null, reason: "Keine energetische Maßnahme im Sinne der ESanMV gewählt (Dachflächenfenster Uw ≤ 1,0 W/m²K)." };
  if (a.buildingAge === "under_5" || a.buildingAge === "5_to_10") return { scenario: null, reason: "Das Gebäude ist jünger als 10 Jahre; §35c EStG setzt mehr als 10 Jahre voraus." };
  if (a.ownerOccupied === "no") return { scenario: null, reason: "Kein selbstgenutztes Wohneigentum angegeben; §35c EStG gilt nur für Selbstnutzer." };

  const assumptions = ["Fachunternehmen mit Bescheinigung nach amtlichem Muster, Rechnung und unbare Zahlung", "ausreichende Einkommensteuer über drei Jahre", "keine öffentliche Förderung für dieselbe Maßnahme", "Höchstbetrag von 40.000 € je Objekt noch nicht ausgeschöpft"];
  const missingAnswers: string[] = [];
  if (a.buildingAge === "unknown" || a.buildingAge === "") { assumptions.push("Gebäude älter als 10 Jahre (Angabe fehlt)"); missingAnswers.push("buildingAge"); }
  if (a.ownerOccupied === "unknown" || a.ownerOccupied === "") { assumptions.push("selbstgenutztes Wohneigentum (Angabe fehlt)"); missingAnswers.push("ownerOccupied"); }

  const base = Math.min(eligibleGross, TAX35C.maxBase);
  // Gesamt = 20 % der Basis (max. 40.000 €); Jahresbeträge einzeln gerundet, Summe kann um 1 € abweichen.
  const totalMax = Math.min(Math.round(base * TAX35C.rate), TAX35C.maxBase * TAX35C.rate);
  const [y1, y2, y3] = TAX35C.years.map((r, i) => Math.min(Math.round(base * r), TAX35C.yearCaps[i]));
  return {
    scenario: {
      kind: "tax35c", status: "potentially_eligible", eligibleCostsGross: eligibleGross,
      base, capApplied: eligibleGross > TAX35C.maxBase, totalMax, year1: y1, year2: y2, year3: y3,
      assumptions, missingAnswers, meta: RULES.tax35c,
    },
    reason: null,
  };
}

export function evaluateFunding(details: PositionDetail[], a: FundingAnswers): FundingEvaluation {
  const { net, gross, thermoPositions } = eligibleCosts(details);
  const beg = evaluateBeg(gross, a);
  const tax = evaluateTax35c(gross, a);
  return {
    eligibleCostsNet: net, eligibleCostsGross: gross, ineligibleThermoPositions: thermoPositions,
    beg: beg.scenario, begReason: beg.reason, tax35c: tax.scenario, tax35cReason: tax.reason,
    notCombinable: true,
  };
}
