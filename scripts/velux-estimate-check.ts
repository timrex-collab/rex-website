/**
 * Regressions-Check für die VELUX-Kostenschätzung (client/src/lib/velux).
 *
 * Warum: Preis- und Förderlogik werden seit PR-1a zentral gepflegt und von
 * UI, PDF, Anfrage-Text und WebMCP gemeinsam genutzt. Dieser Check hält
 * Referenzkonfigurationen mit LITERALEN Erwartungswerten fest, damit ein
 * Refactor oder eine unbeabsichtigte Änderung sofort auffällt.
 *
 * Die Preis-Goldwerte wurden gegen die Preistabellen (VELUX UVP 2026, Stand
 * catalog.ts) von Hand nachgerechnet und vor dem Refactor am Altcode
 * (VeluxPreisrechner.tsx, Commit 889a9e8) bestätigt. Die Förder-Erwartungen
 * folgen den in PR-1b freigegebenen Policies (funding.ts: BEG EM ab 21.07.2026,
 * §35c EStG; Basis nur Uw ≤ 1,0; Alternativen ohne Empfehlung).
 *
 * Aufruf:  npm run estimate:check
 *          npm run estimate:check -- --dump   (gibt Live-Werte aus, schreibt nichts)
 *
 * Goldwerte werden ausschließlich per Hand geändert, mit Quellkommentar
 * (Katalog-Revision, Datum, Grund). Es gibt bewusst keinen "Update"-Modus.
 */

import {
  BLINDS, DIMS, EDW, MODEL_CODES, SHUTTERS, SIZE_CODES, WINDOWS, GL,
  blindsForSize, dimsCm, shuttersForSize, sizesForModel,
  type SizeCode,
} from "../client/src/lib/velux/catalog";
import {
  buildEstimate, toValidatedPositions,
  type PositionDetail, type QuoteTotals, type ValidatedPosition,
} from "../client/src/lib/velux/estimate";
import { LEGACY_SIZES, WINDOW_TYPES, findLegacySize } from "../client/src/lib/velux/legacyCatalog";
import { resolveExistingWindow, type ResolveResult, type WindowObservation } from "../client/src/lib/velux/resolve";
import { validateEstimateInput, validateObservationInput, validateOptionsInput } from "../client/src/lib/velux/validate";
import { buildVeluxTools, estimateFingerprint, presentEstimate, TOOL_NAMES, type VeluxUiBridge } from "../client/src/lib/velux/tools";
import {
  evaluateBeg, evaluateTax35c, RULES,
  type BegScenario, type FundingAnswers, type FundingEvaluation, type TaxScenario,
} from "../client/src/lib/velux/funding";

interface Golden {
  name: string;
  positions: ValidatedPosition[];
  funding: FundingAnswers;
  expectPositions?: Array<Pick<PositionDetail, "matPos" | "labPos">>;
  expectTotals: Partial<QuoteTotals>;
  expectFunding?: Partial<Pick<FundingEvaluation, "eligibleCostsGross" | "ineligibleThermoPositions" | "begReason" | "tax35cReason">>;
  expectBeg?: Partial<BegScenario> | null;
  expectTax?: Partial<TaxScenario> | null;
}

const pos = (
  model: ValidatedPosition["model"], size: SizeCode, glazing: ValidatedPosition["glazing"], qty = 1,
  extra: Partial<Pick<ValidatedPosition, "shutter" | "shutterQty" | "blind" | "blindQty">> = {},
): ValidatedPosition => ({
  model, size, glazing, qty, shutter: "none", shutterQty: 0, blind: "none", blindQty: 0, ...extra,
});
const answers = (buildingAge: FundingAnswers["buildingAge"], energyRenovation: FundingAnswers["energyRenovation"], ownerOccupied: FundingAnswers["ownerOccupied"], hasIsfp: FundingAnswers["hasIsfp"]): FundingAnswers =>
  ({ buildingAge, energyRenovation, ownerOccupied, hasIsfp });

// Quelle Preise: VELUX UVP 2026 (catalog.ts, Revision 2026-07-01), nachgerechnet 04.09.2026.
// Quelle Förderung: funding.ts (beg-em-2026-07-21, estg-35c-2026), Freigabe Plan v3 vom 04.09.2026.
const GOLDENS: Golden[] = [
  {
    name: "1 · 1× GGU MK08 ENERGIE · >10 J. / Fenstertausch ja / Selbstnutzung ja / iSFP nein (FAQ-Fall 'ab ca. 1.800 € netto')",
    positions: [pos("GGU", "MK08", "E")],
    funding: answers("over_10", "yes", "yes", "no"),
    expectPositions: [{ matPos: 1218, labPos: 550 }],
    expectTotals: { totalMat: 1218, totalLab: 550, totalNetto: 1768, mwst: 336, totalBrutto: 2104, totalFenster: 1, hasIneligible: false, ineligibleCount: 0 },
    expectFunding: { eligibleCostsGross: 2104, ineligibleThermoPositions: 0, begReason: null, tax35cReason: null },
    expectBeg: { eligibleCostsGross: 2104, cap: 30000, capApplied: false, base: 2104, isfpBonus: 0, amountMax: 316, rateLabel: "15 %", missingAnswers: [] as string[] },
    expectTax: { base: 2104, capApplied: false, totalMax: 421, year1: 147, year2: 147, year3: 126, missingAnswers: [] as string[] },
  },
  {
    name: "2 · 10× GPU UK08 ENERGIE PLUS + 10× GGL UK10 ENERGIE PLUS · >10 J. / ja / ja / iSFP ja (60.000-€-Cap, iSFP-Bonus)",
    positions: [pos("GPU", "UK08", "P", 10), pos("GGL", "UK10", "P", 10)],
    funding: answers("over_10", "yes", "yes", "yes"),
    expectPositions: [{ matPos: 21860, labPos: 5500 }, { matPos: 19000, labPos: 5500 }],
    expectTotals: { totalNetto: 51860, mwst: 9853, totalBrutto: 61713, totalFenster: 20 },
    expectFunding: { eligibleCostsGross: 61713 },
    expectBeg: { cap: 60000, capApplied: true, base: 60000, isfpBonus: 1500, amountMax: 10500, rateLabel: "17,5 % (15 % + 5 % iSFP-Bonus auf den Anteil über 30.000 €)" },
    expectTax: { base: 61713, capApplied: false, totalMax: 12343, year1: 4320, year2: 4320, year3: 3703 },
  },
  {
    name: "3 · 1× GGL CK02 THERMO + SSL + DKL · >10 J. / ja / ja / nein → keine förderrelevante Verglasung",
    positions: [pos("GGL", "CK02", "T", 1, { shutter: "SSL", shutterQty: 1, blind: "DKL", blindQty: 1 })],
    funding: answers("over_10", "yes", "yes", "no"),
    expectPositions: [{ matPos: 1271, labPos: 720 }],
    expectTotals: { totalNetto: 1991, mwst: 378, totalBrutto: 2369, hasIneligible: true, ineligibleCount: 1 },
    expectFunding: { eligibleCostsGross: 0, ineligibleThermoPositions: 1 },
    expectBeg: null,
    expectTax: null,
  },
  {
    name: "4 · 2× GGU PK08 ENERGIE PLUS + SML×1 + DSL×2 · <5 J. / ja / unbekannt / nein → Gebäude zu jung für beide Wege",
    positions: [pos("GGU", "PK08", "P", 2, { shutter: "SML", shutterQty: 1, blind: "DSL", blindQty: 2 })],
    funding: answers("under_5", "yes", "unknown", "no"),
    expectPositions: [{ matPos: 4196, labPos: 1320 }],
    expectTotals: { totalMat: 4196, totalLab: 1320, totalNetto: 5516, mwst: 1048, totalBrutto: 6564 },
    expectFunding: { eligibleCostsGross: 6564 },
    expectBeg: null,
    expectTax: null,
  },
  {
    name: "5 · 1× GGU MK08 THERMO + 1× GGU MK08 ENERGIE · >10 J. / ja / ja / nein (gemischt: Basis nur ENERGIE-Position)",
    positions: [pos("GGU", "MK08", "T"), pos("GGU", "MK08", "E")],
    funding: answers("over_10", "yes", "yes", "no"),
    expectPositions: [{ matPos: 972, labPos: 550 }, { matPos: 1218, labPos: 550 }],
    expectTotals: { totalNetto: 3290, mwst: 625, totalBrutto: 3915, hasIneligible: true, ineligibleCount: 1 },
    expectFunding: { eligibleCostsGross: 2104, ineligibleThermoPositions: 1 },
    expectBeg: { amountMax: 316 },
    expectTax: { base: 2104, totalMax: 421 },
  },
  {
    name: "6 · 1× GGU MK08 ENERGIE · 5–10 J. / ja / ja / nein → BEG möglich, §35c nicht (unter 10 Jahre)",
    positions: [pos("GGU", "MK08", "E")],
    funding: answers("5_to_10", "yes", "yes", "no"),
    expectTotals: { totalBrutto: 2104 },
    expectBeg: { amountMax: 316 },
    expectTax: null,
  },
  {
    name: "7 · 1× GGU MK08 ENERGIE · alles unbekannt → beide Wege als Maximalwert unter Annahmen, fehlende Antworten ausgewiesen",
    positions: [pos("GGU", "MK08", "E")],
    funding: answers("unknown", "unknown", "unknown", "unknown"),
    expectTotals: { totalBrutto: 2104 },
    expectBeg: { amountMax: 316, isfpBonus: 0, missingAnswers: ["buildingAge", "energyRenovation", "hasIsfp"] },
    expectTax: { totalMax: 421, missingAnswers: ["buildingAge", "ownerOccupied"] },
  },
  {
    name: "8 · 1× GGU MK08 ENERGIE · >10 J. / ja / Selbstnutzung nein / nein → §35c nicht",
    positions: [pos("GGU", "MK08", "E")],
    funding: answers("over_10", "yes", "no", "no"),
    expectTotals: { totalBrutto: 2104 },
    expectBeg: { amountMax: 316 },
    expectTax: null,
  },
  {
    name: "9 · 1× GGU MK08 ENERGIE · >10 J. / Fenstertausch nein / ja / nein → BEG nicht, §35c möglich",
    positions: [pos("GGU", "MK08", "E")],
    funding: answers("over_10", "no", "yes", "no"),
    expectTotals: { totalBrutto: 2104 },
    expectBeg: null,
    expectTax: { totalMax: 421 },
  },
];

let failures = 0;
const fail = (msg: string) => { failures++; console.error(`  ✗ ${msg}`); };
const pendingAsync: Promise<void>[] = [];
const dump = process.argv.includes("--dump");

function compare(label: string, actual: Record<string, unknown>, expected: Record<string, unknown>) {
  for (const [k, v] of Object.entries(expected)) {
    const a = actual[k];
    const same = typeof v === "number" && typeof a === "number" ? Math.abs(a - v) < 1e-9 : JSON.stringify(a) === JSON.stringify(v);
    if (!same) fail(`${label}.${k}: erwartet ${JSON.stringify(v)}, erhalten ${JSON.stringify(a)}`);
  }
}

console.log("VELUX-Kostenschätzung — Regressions-Check\n");

// ── Katalog-Invarianten ───────────────────────────────────────────────
console.log("Katalog-Invarianten");
if (SIZE_CODES.length !== 19) fail(`19 Größen erwartet, ${SIZE_CODES.length} gefunden`);
for (const size of SIZE_CODES) {
  const { widthCm, heightCm } = dimsCm(size);
  if (!(widthCm > 0 && heightCm > 0)) fail(`DIMS[${size}] nicht parsebar: ${DIMS[size]}`);
  if (!(Number.isInteger(EDW[size]) && EDW[size] > 0)) fail(`EDW[${size}] fehlt oder ungültig`);
  for (const s of Object.keys(SHUTTERS) as Array<keyof typeof SHUTTERS>) {
    const p = SHUTTERS[s].prices[size];
    if (!(Number.isInteger(p) && (p as number) > 0)) fail(`SHUTTERS.${s}[${size}] fehlt`);
  }
  for (const b of Object.keys(BLINDS) as Array<keyof typeof BLINDS>) {
    const p = BLINDS[b].prices[size];
    if (!(Number.isInteger(p) && (p as number) > 0)) fail(`BLINDS.${b}[${size}] fehlt`);
  }
  if (shuttersForSize(size).length !== 2 || blindsForSize(size).length !== 2) fail(`Zubehör-Verfügbarkeit ${size}`);
}
let pricePoints = 0;
for (const model of MODEL_CODES) {
  const sizes = sizesForModel(model);
  if (sizes.length === 0) fail(`${model}: keine Größen`);
  for (const size of sizes) {
    if (!SIZE_CODES.includes(size)) fail(`${model}: unbekannte Größe ${size}`);
    const row = WINDOWS[model].prices[size]!;
    for (const g of Object.keys(GL) as Array<keyof typeof GL>) {
      const p = row[g];
      if (!(Number.isInteger(p) && p > 0)) fail(`${model} ${size} ${g}: Preis fehlt`);
      pricePoints++;
    }
    if (!(row.T < row.E && row.E < row.P)) fail(`${model} ${size}: Verglasungsstaffel T < E < P verletzt`);
  }
}
console.log(`  ${MODEL_CODES.length} Modelle, ${SIZE_CODES.length} Größen, ${pricePoints} Fensterpreise geprüft`);

// ── Entwurf → validierte Positionen ──────────────────────────────────
console.log("Entwurfs-Validierung");
if (toValidatedPositions([]) !== null) fail("leerer Entwurf muss null liefern");
if (toValidatedPositions([{ model: "GGU", size: "", glazing: "", qty: 1, shutter: "none", shutterQty: 0, blind: "none", blindQty: 0 }]) !== null) fail("unvollständige Position muss null liefern");
const v = toValidatedPositions([{ id: 7, model: "GGU", size: "MK08", glazing: "E", qty: 2, shutter: "none", shutterQty: 0, blind: "none", blindQty: 0 }]);
if (!v || v.length !== 1 || "id" in v[0]) fail("vollständige Position muss ohne id durchgereicht werden");

// ── Goldwerte ─────────────────────────────────────────────────────────
console.log("Goldwerte");
for (const g of GOLDENS) {
  const { details, totals, funding } = buildEstimate(g.positions, g.funding);
  if (dump) {
    console.log(`\n  ${g.name}`);
    details.forEach((d, i) => console.log(`    Pos ${i + 1}: matPos=${d.matPos} labPos=${d.labPos}`));
    console.log("    " + JSON.stringify(totals));
    console.log("    " + JSON.stringify(funding));
    continue;
  }
  const before = failures;
  g.expectPositions?.forEach((e, i) => compare(`${g.name} · Pos ${i + 1}`, details[i] as unknown as Record<string, unknown>, e));
  compare(g.name, totals as unknown as Record<string, unknown>, g.expectTotals);
  if (g.expectFunding) compare(`${g.name} · funding`, funding as unknown as Record<string, unknown>, g.expectFunding);
  if (g.expectBeg === null && funding.beg !== null) fail(`${g.name} · beg: null erwartet, Szenario erhalten (${funding.beg.amountMax} €)`);
  if (g.expectBeg && !funding.beg) fail(`${g.name} · beg: Szenario erwartet, null erhalten (${funding.begReason})`);
  if (g.expectBeg && funding.beg) compare(`${g.name} · beg`, funding.beg as unknown as Record<string, unknown>, g.expectBeg);
  if (g.expectTax === null && funding.tax35c !== null) fail(`${g.name} · tax35c: null erwartet, Szenario erhalten (${funding.tax35c.totalMax} €)`);
  if (g.expectTax && !funding.tax35c) fail(`${g.name} · tax35c: Szenario erwartet, null erhalten (${funding.tax35cReason})`);
  if (g.expectTax && funding.tax35c) compare(`${g.name} · tax35c`, funding.tax35c as unknown as Record<string, unknown>, g.expectTax);
  if (funding.beg && funding.tax35c && !funding.notCombinable) fail(`${g.name}: notCombinable muss true sein`);
  console.log(`  ${failures === before ? "✓" : "✗"} ${g.name}`);
}

// ── Grenzwerte der Förder-Policies (synthetische förderrelevante Bruttokosten) ──
console.log("Förder-Grenzwerte");
{
  const a = answers("over_10", "yes", "yes", "no");
  const ai = answers("over_10", "yes", "yes", "yes");
  const begAt = (gross: number, ans: FundingAnswers) => evaluateBeg(gross, ans).scenario!;
  const cases: Array<[string, number, FundingAnswers, Partial<BegScenario>]> = [
    ["29.999 € ohne iSFP", 29999, a, { base: 29999, capApplied: false, amountMax: 4500, isfpBonus: 0 }],
    ["30.000 € ohne iSFP", 30000, a, { base: 30000, capApplied: false, amountMax: 4500 }],
    ["30.001 € ohne iSFP → Cap", 30001, a, { base: 30000, capApplied: true, amountMax: 4500 }],
    ["30.001 € mit iSFP → Bonus 0 (gerundet)", 30001, ai, { base: 30001, capApplied: false, isfpBonus: 0, amountMax: 4500 }],
    ["59.999 € mit iSFP", 59999, ai, { base: 59999, capApplied: false, isfpBonus: 1500, amountMax: 10500 }],
    ["60.000 € mit iSFP", 60000, ai, { base: 60000, capApplied: false, isfpBonus: 1500, amountMax: 10500 }],
    ["60.001 € mit iSFP → Cap", 60001, ai, { base: 60000, capApplied: true, isfpBonus: 1500, amountMax: 10500 }],
  ];
  for (const [label, gross, ans, exp] of cases) compare(`BEG ${label}`, begAt(gross, ans) as unknown as Record<string, unknown>, exp);
  const t1 = evaluateTax35c(200000, a).scenario!;
  compare("§35c 200.000 €", t1 as unknown as Record<string, unknown>, { base: 200000, capApplied: false, totalMax: 40000, year1: 14000, year2: 14000, year3: 12000 });
  const t2 = evaluateTax35c(250000, a).scenario!;
  compare("§35c 250.000 € → Cap", t2 as unknown as Record<string, unknown>, { base: 200000, capApplied: true, totalMax: 40000, year1: 14000, year2: 14000, year3: 12000 });
  if (evaluateBeg(0, a).scenario !== null) fail("BEG bei 0 € förderrelevant muss null sein");
  if (evaluateTax35c(0, a).scenario !== null) fail("§35c bei 0 € förderrelevant muss null sein");
  for (const k of ["beg", "tax35c"] as const) {
    const m = RULES[k];
    if (!(m.rulesVersion && m.effectiveFrom && m.lastReviewedAt && m.validThrough)) fail(`RULES.${k}: Metadaten unvollständig`);
    if (new Date(m.validThrough) < new Date()) fail(`RULES.${k}: validThrough ${m.validThrough} abgelaufen – Regelwerk erneut prüfen und Datum nachziehen`);
  }
  console.log(`  ${cases.length + 2} Grenzfälle, Regel-Metadaten geprüft`);
}

// ── Typenschild-Katalog + Resolver ────────────────────────────────────
console.log("Typenschild-Katalog");
{
  const codes = new Set<string>();
  for (const e of LEGACY_SIZES) {
    if (codes.has(e.observedCode)) fail(`Legacy-Katalog: Code ${e.observedCode} doppelt`);
    codes.add(e.observedCode);
    if (!SIZE_CODES.includes(e.currentEquivalent)) fail(`Legacy-Katalog: ${e.observedCode} → unbekanntes Äquivalent ${e.currentEquivalent}`);
    if (e.mapping === "exact" && e.observedCode !== e.currentEquivalent) fail(`Legacy-Katalog: exact-Eintrag ${e.observedCode} ≠ ${e.currentEquivalent}`);
    if (e.mapping !== "exact" && e.verification === "verified") fail(`Legacy-Katalog: ${e.observedCode} als verified markiert – nur nach Prüfung durch den Betrieb`);
    if (!e.sourceRef) fail(`Legacy-Katalog: ${e.observedCode} ohne Quelle`);
  }
  for (const size of SIZE_CODES) {
    if (findLegacySize(size)?.mapping !== "exact") fail(`Legacy-Katalog: ${size} fehlt als exact`);
    if (findLegacySize(`${size[0]}${size.slice(2)}`)?.currentEquivalent !== size) fail(`Legacy-Katalog: Buchstabencode für ${size} fehlt`);
  }
  if (findLegacySize("308")?.currentEquivalent !== "MK08") fail("308 → MK08 erwartet");
  if (findLegacySize("047")?.currentEquivalent !== "MK08") fail("047 → MK08 erwartet");
  const typeCodes = new Set<string>();
  for (const t of WINDOW_TYPES) { if (typeCodes.has(t.code)) fail(`WINDOW_TYPES: ${t.code} doppelt`); typeCodes.add(t.code); }
  for (const m of MODEL_CODES) if (!WINDOW_TYPES.find((t) => t.code === m && t.supported)) fail(`WINDOW_TYPES: ${m} nicht als supported hinterlegt`);
  console.log(`  ${LEGACY_SIZES.length} Größencodes, ${WINDOW_TYPES.length} Typen geprüft`);
}

console.log("Resolver");
{
  type Case = { name: string; input: WindowObservation; status: ResolveResult["status"]; existing?: [string, string] | null; candidateCount?: number; noEcho?: string };
  const cases: Case[] = [
    { name: "MK08 getippt → resolved", input: { brand: "VELUX", windowType: "GGU", sizeCode: "MK08", source: "user_typed" }, status: "resolved", existing: ["GGU", "MK08"] },
    { name: "Kleinschreibung/Leerzeichen normalisiert", input: { windowType: " ggl ", sizeCode: "mk 08", source: "user_typed" }, status: "resolved", existing: ["GGL", "MK08"] },
    { name: "M08 (2001–2013) → confirmation, Kandidat MK08", input: { windowType: "GGL", sizeCode: "M08", source: "user_typed" }, status: "confirmation_required", existing: ["GGL", "MK08"], candidateCount: 1 },
    { name: "308 (1991–2001) → confirmation", input: { windowType: "GGL", sizeCode: "308", source: "user_typed" }, status: "confirmation_required", existing: ["GGL", "MK08"] },
    { name: "047 (vor 1991) → confirmation", input: { windowType: "GGL", sizeCode: "047", source: "user_typed" }, status: "confirmation_required", existing: ["GGL", "MK08"] },
    { name: "Bild-Quelle MK08 → nie resolved", input: { brand: "VELUX", windowType: "GGU", sizeCode: "MK08", source: "agent_image_recognition" }, status: "confirmation_required", existing: ["GGU", "MK08"] },
    { name: "Website-Foto MK08 → nie resolved", input: { windowType: "GGU", sizeCode: "MK08", source: "site_recognition" }, status: "confirmation_required", existing: ["GGU", "MK08"] },
    { name: "Alternative Lesart (MO8) → confirmation", input: { windowType: "GGU", sizeCode: { value: "M08", alternatives: ["MO8"], reason: "0/O unsicher" }, source: "user_typed" }, status: "confirmation_required", existing: ["GGU", "MK08"] },
    { name: "Unlesbar aus Bild → new_photo_required", input: { windowType: "GGU", sizeCode: "??", source: "site_recognition" }, status: "new_photo_required", existing: null },
    { name: "Unlesbar, aber OCR-Variante trifft (MK0B → MK08) → confirmation", input: { windowType: "GGU", sizeCode: "MK0B", source: "site_recognition" }, status: "confirmation_required", existing: null, candidateCount: 1 },
    { name: "Fehlende Größe getippt → confirmation", input: { windowType: "GGU", source: "user_typed" }, status: "confirmation_required", existing: null },
    { name: "GHL (Alttyp) → manual_review", input: { windowType: "GHL", sizeCode: "M08", source: "user_typed" }, status: "manual_review", existing: null },
    { name: "GPU CK02 (Kombination nicht kalkulierbar) → manual_review", input: { windowType: "GPU", sizeCode: "CK02", source: "user_typed" }, status: "manual_review", existing: null },
    { name: "Sondergröße MK12 → manual_review", input: { windowType: "GGU", sizeCode: "MK12", source: "user_typed" }, status: "manual_review", existing: null },
    { name: "Rollladen-Typenschild SSL → unsupported_product", input: { windowType: "SSL", sizeCode: "MK08", source: "user_typed" }, status: "unsupported_product", existing: null },
    { name: "Eindeckrahmen EDW → unsupported_product", input: { windowType: "EDW", sizeCode: "MK08", source: "user_typed" }, status: "unsupported_product", existing: null },
    { name: "Fremdhersteller ROTO → unsupported_product", input: { brand: "Roto", windowType: "R4", sizeCode: "7/11", source: "user_typed" }, status: "unsupported_product", existing: null },
    { name: "Unbekannter Typ XYZ getippt → manual_review", input: { windowType: "XYZ", sizeCode: "MK08", source: "user_typed" }, status: "manual_review", existing: null },
    { name: "Produktionscode wird nie zurückgegeben", input: { windowType: "GGL", sizeCode: "MK04", productionCode: "306621 03BF01N", source: "user_typed" }, status: "resolved", existing: ["GGL", "MK04"], noEcho: "306621" },
  ];
  for (const c of cases) {
    const r = resolveExistingWindow(c.input);
    const before = failures;
    if (r.status !== c.status) fail(`${c.name}: Status ${r.status} statt ${c.status} (${r.nextStep})`);
    if (c.existing === null && r.existingWindow) fail(`${c.name}: existingWindow erwartet null`);
    if (c.existing && (!r.existingWindow || r.existingWindow.windowType !== c.existing[0] || r.existingWindow.sizeCode !== c.existing[1])) fail(`${c.name}: existingWindow ${JSON.stringify(r.existingWindow)}`);
    if (c.candidateCount !== undefined && r.candidates.length !== c.candidateCount) fail(`${c.name}: ${r.candidates.length} Kandidaten statt ${c.candidateCount}`);
    if (c.noEcho && JSON.stringify(r).includes(c.noEcho)) fail(`${c.name}: Produktionscode im Ergebnis`);
    if (r.status === "resolved" && r.source !== "user_typed") fail(`${c.name}: resolved nur bei user_typed erlaubt`);
    if (r.status === "resolved" && r.existingWindow?.mapping !== "exact") fail(`${c.name}: resolved nur bei exact-Mapping erlaubt`);
    if (!r.nextStep || !r.catalogVersion) fail(`${c.name}: nextStep/catalogVersion fehlt`);
    console.log(`  ${failures === before ? "✓" : "✗"} ${c.name}`);
  }
  // Fuzz: darf nie werfen, Status immer gültig
  const statuses = new Set(["resolved", "confirmation_required", "new_photo_required", "manual_review", "unsupported_product"]);
  const junk = ["", " ", "\u0000", "€€€", "a".repeat(500), "<script>", "GGL MK08 306621", "МК08", "GGU\nMK08", "null", "undefined", "0", "MK", "K08", "GG", "8", "Y47"];
  let fuzzed = 0;
  for (const a of junk) for (const b of junk) for (const src of ["user_typed", "agent_image_recognition"] as const) {
    let r: ResolveResult;
    try { r = resolveExistingWindow({ brand: a, windowType: a, sizeCode: { value: b, alternatives: [a, b] }, variantCode: b, source: src }); }
    catch (e) { fail(`Resolver wirft bei ${JSON.stringify([a, b])}: ${String(e)}`); continue; }
    if (!statuses.has(r.status)) fail(`Resolver: ungültiger Status ${r.status}`);
    if (JSON.stringify(JSON.parse(JSON.stringify(r))) !== JSON.stringify(r)) fail("Resolver: Ergebnis nicht JSON-stabil");
    fuzzed++;
  }
  console.log(`  ${cases.length} Fälle, ${fuzzed} Fuzz-Kombinationen`);
}

// ── WebMCP-Vertrag: Validator, Presenter, Tools ───────────────────────
console.log("WebMCP-Validator");
{
  const good = { positions: [{ model: "GGU", size: "MK08", glazing: "ENERGIE", quantity: 1 }], funding: { buildingAge: "over_10", energyRenovation: "yes", ownerOccupied: "yes", hasIsfp: "no" } };
  const expectErr = (name: string, input: unknown, code: string, extra?: (e: { path?: string; allowedValues?: string[]; allowedSizes?: string[] }) => boolean) => {
    const v = validateEstimateInput(input);
    if (v.ok) { fail(`${name}: Fehler ${code} erwartet, Eingabe akzeptiert`); return; }
    if (v.error.code !== code) fail(`${name}: ${v.error.code} statt ${code} (${v.error.message})`);
    else if (extra && !extra(v.error)) fail(`${name}: Zusatzprüfung fehlgeschlagen (${JSON.stringify(v.error)})`);
  };
  const v0 = validateEstimateInput(good);
  if (!v0.ok) fail(`Gültige Eingabe abgelehnt: ${v0.error.message}`);
  else {
    const p = v0.value.positions[0];
    if (p.glazing !== "E" || p.qty !== 1 || p.shutter !== "none" || p.shutterQty !== 0) fail("Gültige Eingabe falsch normalisiert");
  }
  const v1 = validateEstimateInput({ ...good, positions: [{ model: " ggu ", size: "mk08", glazing: "Energie Plus", quantity: 2, shutter: "ssl" }] });
  if (!v1.ok) fail(`Normalisierung: ${v1.error.message}`);
  else if (v1.value.positions[0].glazing !== "P" || v1.value.positions[0].shutter !== "SSL" || v1.value.positions[0].shutterQty !== 2) fail("Normalisierung/Default shutterQuantity falsch");
  expectErr("GPU CK02", { ...good, positions: [{ model: "GPU", size: "CK02", glazing: "ENERGIE", quantity: 1 }] }, "INVALID_SIZE_FOR_MODEL", (e) => e.allowedSizes?.length === 15);
  expectErr("unbekannter Schlüssel", { ...good, foo: 1 }, "UNKNOWN_FIELD");
  expectErr("unbekannter Positionsschlüssel", { ...good, positions: [{ ...good.positions[0], price: 1 }] }, "UNKNOWN_FIELD");
  expectErr("ungültige Verglasung", { ...good, positions: [{ ...good.positions[0], glazing: "STANDARD" }] }, "INVALID_ENUM", (e) => e.allowedValues?.includes("ENERGIE_PLUS") === true);
  expectErr("quantity 0", { ...good, positions: [{ ...good.positions[0], quantity: 0 }] }, "INVALID_INPUT");
  expectErr("quantity 11", { ...good, positions: [{ ...good.positions[0], quantity: 11 }] }, "INVALID_INPUT");
  expectErr("shutterQuantity > quantity", { ...good, positions: [{ ...good.positions[0], shutter: "SML", shutterQuantity: 3 }] }, "ACCESSORY_QTY_EXCEEDS_WINDOWS");
  expectErr("shutterQuantity ohne shutter", { ...good, positions: [{ ...good.positions[0], shutterQuantity: 1 }] }, "INVALID_INPUT");
  expectErr("Förderung fehlt", { positions: good.positions }, "INVALID_INPUT");
  expectErr("Förderung Boolean statt Enum", { ...good, funding: { ...good.funding, hasIsfp: true } }, "INVALID_ENUM", (e) => e.path === "funding.hasIsfp");
  expectErr("leere Positionen", { ...good, positions: [] }, "INVALID_INPUT");
  expectErr("11 Positionen", { ...good, positions: Array(11).fill(good.positions[0]) }, "INVALID_INPUT");
  expectErr("null", null, "INVALID_INPUT");
  expectErr("Array", [good], "INVALID_INPUT");
  expectErr("existingWindow unbekannt", { ...good, existingWindow: { windowType: "XXX" } }, "INVALID_ENUM");
  const o1 = validateOptionsInput(undefined); if (!o1.ok || o1.value.includePrices) fail("Options: leere Eingabe muss gültig sein");
  const o2 = validateOptionsInput({ model: "gpu", includePrices: true }); if (!o2.ok || o2.value.model !== "GPU") fail("Options: model-Normalisierung");
  const o3 = validateOptionsInput({ model: "ABC" }); if (o3.ok || o3.error.code !== "INVALID_ENUM") fail("Options: ungültiges Modell");
  const r1 = validateObservationInput({ windowType: "GGL", sizeCode: { value: "M08", alternatives: ["MO8"] }, source: "agent_image_recognition" }); if (!r1.ok) fail(`Observation gültig: ${r1.error.message}`);
  const r2 = validateObservationInput({ source: "user_typed" }); if (r2.ok) fail("Observation ohne Typ/Größe muss abgelehnt werden");
  const r3 = validateObservationInput({ windowType: "GGL", source: "photo" }); if (r3.ok || r3.error.code !== "INVALID_ENUM") fail("Observation ungültige source");
  const r4 = validateObservationInput({ windowType: { value: "GGL", extra: 1 }, source: "user_typed" }); if (r4.ok || r4.error.code !== "UNKNOWN_FIELD") fail("Observation unbekanntes Feld");
  // Fuzz auf jeder Ebene: nie werfen
  const junk: unknown[] = [null, 0, -1, 1.5, "", "x".repeat(1000), [], {}, { a: 1 }, true, Symbol.for("s"), () => 1];
  let fuzzed = 0;
  for (const a of junk) for (const b of junk) {
    for (const input of [a, { positions: a, funding: b }, { positions: [a], funding: good.funding }, { positions: [{ ...good.positions[0], quantity: a, shutter: b }], funding: good.funding }, { positions: good.positions, funding: { ...good.funding, buildingAge: a } }]) {
      try { validateEstimateInput(input); validateOptionsInput(input); validateObservationInput(input); fuzzed++; }
      catch (e) { fail(`Validator wirft: ${String(e)}`); }
    }
  }
  console.log(`  Validator-Fälle geprüft, ${fuzzed} Fuzz-Eingaben ohne Exception`);
}

console.log("WebMCP-Presenter und Tools");
{
  const noBridge: VeluxUiBridge = { hasUserDraft: () => false, apply: async () => ({ applied: true }) };
  const tools = buildVeluxTools(noBridge);
  const names = Object.values(TOOL_NAMES);
  for (const n of names) if (!/^[a-z0-9_]{1,64}$/.test(n)) fail(`Toolname ${n} verletzt [a-z0-9_]{1,64}`);
  for (const t of Object.values(tools)) {
    if (!t.description || t.description.length < 80) fail(`${t.name}: Beschreibung zu kurz`);
    if (!t.inputSchema || (t.inputSchema as { type?: string }).type !== "object") fail(`${t.name}: inputSchema fehlt`);
  }
  if (tools.calculate.annotations?.readOnlyHint !== true || tools.options.annotations?.readOnlyHint !== true || tools.resolve.annotations?.readOnlyHint !== true) fail("read-only Tools müssen readOnlyHint=true tragen");
  if (tools.apply.annotations?.readOnlyHint !== false) fail("Apply-Tool muss readOnlyHint=false tragen");

  const input = { positions: [{ model: "GGU", size: "PK08", glazing: "ENERGIE_PLUS", quantity: 2, shutter: "SML", shutterQuantity: 1, blind: "DSL", blindQuantity: 2 }, { model: "GGL", size: "MK08", glazing: "THERMO", quantity: 1 }, { model: "GPU", size: "SK06", glazing: "ENERGIE", quantity: 1 }], funding: { buildingAge: "over_10", energyRenovation: "yes", ownerOccupied: "unknown", hasIsfp: "no" } };
  const signal = new AbortController().signal;
  const res = tools.calculate.execute(input, { signal }) as Record<string, unknown>;
  if (res.ok !== true) fail(`calculate: ${JSON.stringify(res)}`);
  else {
    const text = JSON.stringify(res);
    if (text.length > 5000) fail(`calculate: Antwort ${text.length} Zeichen > 5.000 (3 Positionen, zwei Szenarien, kompakt)`);
    const totals = res.totals as { grossFrom: number; netFrom: number };
    if (totals.grossFrom !== Math.round(totals.netFrom * 1.19) && Math.abs(totals.grossFrom - totals.netFrom * 1.19) > 1) fail("calculate: brutto ≠ netto × 1,19");
    const fp = res.estimateFingerprint as string;
    if (!/^VX-[0-9A-F]{8}$/.test(fp)) fail(`Fingerprint-Format: ${fp}`);
    const again = tools.calculate.execute(input, { signal }) as Record<string, unknown>;
    if (again.estimateFingerprint !== fp) fail("Fingerprint nicht deterministisch");
    const varied = tools.calculate.execute({ ...input, funding: { ...input.funding, hasIsfp: "yes" } }, { signal }) as Record<string, unknown>;
    if (varied.estimateFingerprint === fp) fail("Fingerprint ändert sich nicht mit der Eingabe");
    if (JSON.stringify(JSON.parse(text)) !== text) fail("calculate: nicht JSON-stabil");
    if (text.includes("Empfehlung:") || /"recommended"/.test(text)) fail("calculate: Antwort enthält eine Empfehlung");
    if ((res.breakdown ?? null) !== null) fail("calculate: breakdown ohne includeBreakdown");
    const withBreakdown = tools.calculate.execute({ ...input, includeBreakdown: true }, { signal }) as Record<string, unknown>;
    if (!Array.isArray(withBreakdown.breakdown) || withBreakdown.breakdown.length !== 3) fail("calculate: breakdown fehlt");
    if (JSON.stringify(withBreakdown).length > 7000) fail("calculate: Antwort mit breakdown zu groß");
  }
  const small = tools.calculate.execute({ positions: [{ model: "GGU", size: "MK08", glazing: "ENERGIE", quantity: 1 }], funding: { buildingAge: "over_10", energyRenovation: "yes", ownerOccupied: "yes", hasIsfp: "no" } }, { signal }) as Record<string, unknown>;
  if (small.ok !== true) fail("calculate small");
  else {
    const t = small.totals as { grossFrom: number };
    if (t.grossFrom !== 2104) fail(`calculate: Goldwert 2104 erwartet, ${t.grossFrom}`);
    const f = small.funding as { begGrant: { amountMax: number } | null; taxBonus35c: { totalMax: number } | null };
    if (f.begGrant?.amountMax !== 316 || f.taxBonus35c?.totalMax !== 421) fail("calculate: Förderwerte weichen von den Goldwerten ab");
    if (!(small.summary as string).startsWith("1 VELUX Fenster: ab 2.104 € brutto")) fail(`Summary: ${small.summary}`);
    const smallLen = JSON.stringify(small).length;
    if (smallLen > 3200) fail(`calculate: Standardantwort (1 Position) ${smallLen} Zeichen > 3.200`);
    console.log(`  Antwortgröße 1 Position: ${smallLen} Zeichen`);
  }
  const bad = tools.calculate.execute({ positions: [{ model: "GPU", size: "CK02", glazing: "ENERGIE", quantity: 1 }], funding: input.funding }, { signal }) as Record<string, unknown>;
  if (bad.ok !== false || (bad.error as { code: string }).code !== "INVALID_SIZE_FOR_MODEL") fail("calculate: Fehlerpfad");
  const opts = tools.options.execute({}, { signal }) as Record<string, unknown>;
  if (opts.ok !== true || JSON.stringify(opts).length > 3000) fail(`options: kompakt erwartet (${JSON.stringify(opts).length} Zeichen)`);
  console.log(`  Antwortgröße options: ${JSON.stringify(opts).length} Zeichen`);
  if (JSON.stringify(opts).includes("unitPricesNet")) fail("options: Preise ohne includePrices");
  const optsP = tools.options.execute({ model: "GGU", includePrices: true }, { signal }) as Record<string, unknown>;
  if (optsP.ok !== true || !JSON.stringify(optsP).includes("unitPricesNet")) fail("options: Preise mit includePrices+model fehlen");
  const resolved = tools.resolve.execute({ windowType: "GGL", sizeCode: "308", productionCode: "306621 03BF01N", source: "user_typed" }, { signal }) as Record<string, unknown>;
  if (resolved.ok !== true || resolved.status !== "confirmation_required" || JSON.stringify(resolved).includes("306621")) fail("resolve-Tool: Status oder Echo falsch");
  console.log("  Presenter, Fingerprint, Antwortgrößen, Tool-Metadaten geprüft");

  // Apply-Tool: DRAFT_EXISTS / BUSY / ABORTED / Erfolg über eine Fake-Bridge
  pendingAsync.push((async () => {
    const draftBridge: VeluxUiBridge = { hasUserDraft: () => true, apply: async () => ({ applied: true }) };
    const a1 = await buildVeluxTools(draftBridge).apply.execute({ positions: input.positions.slice(0, 1), funding: input.funding }, { signal }) as Record<string, unknown>;
    if (a1.ok !== false || (a1.error as { code: string }).code !== "DRAFT_EXISTS") fail("apply: DRAFT_EXISTS erwartet");
    const a2 = await buildVeluxTools(draftBridge).apply.execute({ positions: input.positions.slice(0, 1), funding: input.funding, replaceExisting: true }, { signal }) as Record<string, unknown>;
    if (a2.ok !== true || a2.uiApplied !== true) fail("apply: replaceExisting muss überschreiben");
    const busyBridge: VeluxUiBridge = { hasUserDraft: () => false, apply: async () => ({ applied: false, code: "BUSY" }) };
    const a3 = await buildVeluxTools(busyBridge).apply.execute({ positions: input.positions.slice(0, 1), funding: input.funding }, { signal }) as Record<string, unknown>;
    if (a3.ok !== false || (a3.error as { code: string }).code !== "BUSY") fail("apply: BUSY erwartet");
    const a4 = await buildVeluxTools(noBridge).apply.execute({ positions: input.positions.slice(0, 1), funding: input.funding, replaceExisting: "ja" }, { signal }) as Record<string, unknown>;
    if (a4.ok !== false || (a4.error as { code: string }).code !== "INVALID_INPUT") fail("apply: replaceExisting muss boolean sein");
  })().catch((e) => fail(`apply async: ${String(e)}`)));
  void presentEstimate; void estimateFingerprint;
}

// ── Determinismus + JSON-Roundtrip ────────────────────────────────────
{
  const g = GOLDENS[1];
  const a = JSON.stringify(buildEstimate(g.positions, g.funding));
  const b = JSON.stringify(buildEstimate(g.positions, g.funding));
  if (a !== b) fail("Berechnung nicht deterministisch");
  if (JSON.stringify(JSON.parse(a)) !== a) fail("Ergebnis nicht verlustfrei JSON-serialisierbar");
}

void Promise.all(pendingAsync).then(() => {
  console.log("");
  if (failures > 0) {
    console.error(`${failures} Abweichung(en). Preislogik NICHT freigeben.`);
    process.exit(1);
  }
  console.log(dump ? "Live-Werte ausgegeben (kein Vergleich)." : "Alle Prüfungen bestanden.");
});
