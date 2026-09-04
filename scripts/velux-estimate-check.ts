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

// ── Determinismus + JSON-Roundtrip ────────────────────────────────────
{
  const g = GOLDENS[1];
  const a = JSON.stringify(buildEstimate(g.positions, g.funding));
  const b = JSON.stringify(buildEstimate(g.positions, g.funding));
  if (a !== b) fail("Berechnung nicht deterministisch");
  if (JSON.stringify(JSON.parse(a)) !== a) fail("Ergebnis nicht verlustfrei JSON-serialisierbar");
}

console.log("");
if (failures > 0) {
  console.error(`${failures} Abweichung(en). Preislogik NICHT freigeben.`);
  process.exit(1);
}
console.log(dump ? "Live-Werte ausgegeben (kein Vergleich)." : "Alle Prüfungen bestanden.");
