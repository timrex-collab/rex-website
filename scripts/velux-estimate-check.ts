/**
 * Regressions-Check für die VELUX-Kostenschätzung (client/src/lib/velux).
 *
 * Warum: Preis- und Förderlogik werden seit PR-1a zentral gepflegt und von
 * UI, PDF, Anfrage-Text und WebMCP gemeinsam genutzt. Dieser Check hält
 * Referenzkonfigurationen mit LITERALEN Erwartungswerten fest, damit ein
 * Refactor oder eine unbeabsichtigte Änderung sofort auffällt.
 *
 * Die Goldwerte wurden gegen die Preistabellen (VELUX UVP 2026, Stand
 * catalog.ts) von Hand nachgerechnet und vor dem Refactor am Altcode
 * (VeluxPreisrechner.tsx, Commit 889a9e8) bestätigt. Fälle mit dem Tag
 * `legacyQuirk` dokumentieren bekanntes Altverhalten, das in PR-1b fachlich
 * korrigiert wird — sie sind Charakterisierung, kein Richtigkeitsbeweis.
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
  type FundingAnswersLegacy, type PositionDetail, type QuoteTotals, type ValidatedPosition,
} from "../client/src/lib/velux/estimate";

interface Golden {
  name: string;
  positions: ValidatedPosition[];
  funding: FundingAnswersLegacy;
  expectPositions?: Array<Pick<PositionDetail, "matPos" | "labPos">>;
  expectTotals: Partial<QuoteTotals>;
  legacyQuirk?: string;
}

const pos = (
  model: ValidatedPosition["model"], size: SizeCode, glazing: ValidatedPosition["glazing"], qty = 1,
  extra: Partial<Pick<ValidatedPosition, "shutter" | "shutterQty" | "blind" | "blindQty">> = {},
): ValidatedPosition => ({
  model, size, glazing, qty, shutter: "none", shutterQty: 0, blind: "none", blindQty: 0, ...extra,
});

// Quelle: VELUX UVP 2026 (catalog.ts, Revision 2026-07-01), nachgerechnet 04.09.2026.
const GOLDENS: Golden[] = [
  {
    name: "1 · 1× GGU MK08 ENERGIE, Altbau ja / Sanierung ja / iSFP nein (FAQ-Fall 'ab ca. 1.800 € netto')",
    positions: [pos("GGU", "MK08", "E")],
    funding: { altbau: "ja", sanierung: "ja", isfp: "nein" },
    expectPositions: [{ matPos: 1218, labPos: 550 }],
    expectTotals: {
      totalMat: 1218, totalLab: 550, totalNetto: 1768, mwst: 336, totalBrutto: 2104, totalFenster: 1,
      eligible: true, hasIsfp: false, bafaMaxBrutto: 30000, hasIneligible: false, ineligibleCount: 0,
      foerderBrutto: 2104, bafaBasis: 2104, isfpBonus: 0, bafaFoerder: 316, bafaRateLabel: "15 %",
      steuerBasis: 2104, steuerBonus: 421, steuerJahr1: 147, steuerJahr2: 147, steuerJahr3: 126,
      investitionBrutto: 1788, investitionSteuer: 1683,
    },
  },
  {
    name: "2 · 10× GPU UK08 ENERGIE PLUS + 10× GGL UK10 ENERGIE PLUS, ja/ja/ja (iSFP-Schwelle + 60.000-€-Cap)",
    positions: [pos("GPU", "UK08", "P", 10), pos("GGL", "UK10", "P", 10)],
    funding: { altbau: "ja", sanierung: "ja", isfp: "ja" },
    expectPositions: [{ matPos: 21860, labPos: 5500 }, { matPos: 19000, labPos: 5500 }],
    expectTotals: {
      totalNetto: 51860, mwst: 9853, totalBrutto: 61713, totalFenster: 20,
      eligible: true, hasIsfp: true, bafaMaxBrutto: 60000,
      foerderBrutto: 61713, bafaBasis: 60000, isfpBonus: 1500, bafaFoerder: 10500, bafaRateEffektiv: 0.175,
      bafaRateLabel: "17,5 % (15 % + 5 % iSFP-Bonus auf den Anteil über 30.000 €)",
      steuerBasis: 61713, steuerBonus: 12343, steuerJahr1: 4320, steuerJahr2: 4320, steuerJahr3: 3703,
      investitionBrutto: 51213, investitionSteuer: 49370,
    },
  },
  {
    name: "3 · 1× GGL CK02 THERMO + SSL + DKL, ja/ja/nein (nicht förderrelevant)",
    positions: [pos("GGL", "CK02", "T", 1, { shutter: "SSL", shutterQty: 1, blind: "DKL", blindQty: 1 })],
    funding: { altbau: "ja", sanierung: "ja", isfp: "nein" },
    expectPositions: [{ matPos: 1271, labPos: 720 }],
    expectTotals: {
      totalNetto: 1991, mwst: 378, totalBrutto: 2369,
      eligible: true, hasIneligible: true, ineligibleCount: 1,
      foerderNetto: 0, foerderBrutto: 0, bafaBasis: 0, bafaFoerder: 0,
      steuerBonus: 474, steuerJahr1: 166, steuerJahr2: 166, steuerJahr3: 142, investitionSteuer: 1895,
    },
    legacyQuirk: "§35c wird auf THERMO (Uw 1,3) berechnet; fachlich muss der Wert 0 sein (PR-1b).",
  },
  {
    name: "4 · 2× GGU PK08 ENERGIE PLUS + SML×1 + DSL×2, nein/ja/nein (Gebäude zu jung)",
    positions: [pos("GGU", "PK08", "P", 2, { shutter: "SML", shutterQty: 1, blind: "DSL", blindQty: 2 })],
    funding: { altbau: "nein", sanierung: "ja", isfp: "nein" },
    expectPositions: [{ matPos: 4196, labPos: 1320 }],
    expectTotals: {
      totalMat: 4196, totalLab: 1320, totalNetto: 5516, mwst: 1048, totalBrutto: 6564,
      eligible: false, foerderBrutto: 6564, bafaBasis: 6564, bafaFoerder: 0,
      steuerBonus: 0, steuerJahr1: 0, steuerJahr2: 0, steuerJahr3: 0, investitionBrutto: 6564,
    },
    legacyQuirk: "foerderBrutto/bafaBasis werden trotz eligible=false berechnet (nicht angezeigt); PR-1b liefert null.",
  },
  {
    name: "5 · 1× GGU MK08 THERMO + 1× GGU MK08 ENERGIE, ja/ja/nein (gemischt)",
    positions: [pos("GGU", "MK08", "T"), pos("GGU", "MK08", "E")],
    funding: { altbau: "ja", sanierung: "ja", isfp: "nein" },
    expectPositions: [{ matPos: 972, labPos: 550 }, { matPos: 1218, labPos: 550 }],
    expectTotals: {
      totalNetto: 3290, mwst: 625, totalBrutto: 3915, hasIneligible: true, ineligibleCount: 1,
      foerderBrutto: 2104, bafaFoerder: 316,
      steuerBasis: 3915, steuerBonus: 783,
    },
    legacyQuirk: "§35c-Basis enthält die THERMO-Position — live sichtbar zu hoch (PR-1b: Basis = nur Uw ≤ 1,0).",
  },
];

let failures = 0;
const fail = (msg: string) => { failures++; console.error(`  ✗ ${msg}`); };
const dump = process.argv.includes("--dump");

function compare(label: string, actual: Record<string, unknown>, expected: Record<string, unknown>) {
  for (const [k, v] of Object.entries(expected)) {
    const a = actual[k];
    const same = typeof v === "number" && typeof a === "number" ? Math.abs(a - v) < 1e-9 : a === v;
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
  const { details, totals } = buildEstimate(g.positions, g.funding);
  if (dump) {
    console.log(`\n  ${g.name}`);
    details.forEach((d, i) => console.log(`    Pos ${i + 1}: matPos=${d.matPos} labPos=${d.labPos}`));
    console.log("    " + JSON.stringify(totals));
    continue;
  }
  const before = failures;
  g.expectPositions?.forEach((e, i) => compare(`${g.name} · Pos ${i + 1}`, details[i] as unknown as Record<string, unknown>, e));
  compare(g.name, totals as unknown as Record<string, unknown>, g.expectTotals);
  console.log(`  ${failures === before ? "✓" : "✗"} ${g.name}${g.legacyQuirk ? `\n      (Charakterisierung: ${g.legacyQuirk})` : ""}`);
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
