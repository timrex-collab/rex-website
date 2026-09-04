/**
 * WebMCP-Tools des VELUX-Preisrechners (Vertrag v1) — dünner Adapter.
 *
 * Enthält keine Preis- oder Förderregeln: Eingaben laufen durch validate.ts,
 * Berechnung durch estimate.ts/funding.ts, Bestandsfenster durch resolve.ts,
 * Texte kommen aus content.ts. Hier werden nur Tool-Beschreibungen, Schemas
 * und kompakte Antwortobjekte zusammengesetzt (Schlüssel englisch, Texte
 * deutsch). Kein React, kein DOM, kein Netzwerk.
 */

import {
  BLINDS, CATALOG, DIMS, EDW, GL, LABOR, MODEL_CODES, SHUTTERS, SIZE_CODES, WINDOWS, blindsForSize, fmt,
  isEligibleGlazing, shuttersForSize, sizesForModel, type ModelCode, type SizeCode,
} from "./catalog";
import { ASSUMPTIONS, DISCLAIMER, EXCLUSIONS, FUNDING_NOTES, NEXT_STEPS, PAGE_URL, SCOPE_NOTE } from "./content";
import { buildEstimate, type CanonicalEstimate, type ValidatedPosition } from "./estimate";
import { RULES, type FundingAnswers } from "./funding";
import { resolveExistingWindow } from "./resolve";
import {
  CODE_TO_GLAZING, CONTRACT_VERSION, ESTIMATE_INPUT_SCHEMA, OBSERVATION_INPUT_SCHEMA, OPTIONS_INPUT_SCHEMA, PUBLIC_GLAZINGS,
  publicPosition, validateEstimateInput, validateObservationInput, validateOptionsInput, type EstimateInput, type ToolError,
} from "./validate";
import type { WebMCPTool } from "../webmcp";

export const TOOL_NAMES = {
  options: "rex_velux_get_options_v1",
  resolve: "rex_velux_resolve_existing_window_v1",
  calculate: "rex_velux_calculate_estimate_v1",
  apply: "rex_velux_apply_configuration_v1",
} as const;

export const SCOPE = "single_owner_occupied_dwelling";

export type ApplyOutcome = { applied: true } | { applied: false; code: "DRAFT_EXISTS" | "BUSY" | "ABORTED" };

/** Brücke in den sichtbaren Rechner (Implementierung: bridge.ts, React). */
export interface VeluxUiBridge {
  hasUserDraft(): boolean;
  apply(positions: ValidatedPosition[], funding: FundingAnswers, signal: AbortSignal | undefined): Promise<ApplyOutcome>;
}

export interface ToolFailure { ok: false; error: ToolError; pageUrl: string }
export const failure = (error: ToolError): ToolFailure => ({ ok: false, error, pageUrl: PAGE_URL });

// ── Fingerprint (deterministisch, ohne Speicherung) ──────────────────

/** FNV-1a 32 Bit über die kanonische Eingabe + Katalog-/Regelversionen. */
export function estimateFingerprint(positions: ValidatedPosition[], funding: FundingAnswers): string {
  const canonical = JSON.stringify({
    c: CONTRACT_VERSION, r: CATALOG.revision, b: RULES.beg.rulesVersion, t: RULES.tax35c.rulesVersion,
    p: positions.map((p) => [p.model, p.size, p.glazing, p.qty, p.shutter, p.shutterQty, p.blind, p.blindQty]),
    f: [funding.buildingAge, funding.energyRenovation, funding.ownerOccupied, funding.hasIsfp],
  });
  let h = 0x811c9dc5;
  for (let i = 0; i < canonical.length; i++) {
    h ^= canonical.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `VX-${h.toString(16).padStart(8, "0").toUpperCase()}`;
}

// ── Presenter ────────────────────────────────────────────────────────

const de = (iso: string) => iso.split("-").reverse().join(".");

export function presentEstimate(input: EstimateInput, estimate: CanonicalEstimate, calculatedAt: string = new Date().toISOString()) {
  const { totals, funding, details } = estimate;
  const beg = funding.beg;
  const tax = funding.tax35c;
  const fundingSummary = beg && tax
    ? `Förderung (Alternativen, nicht kombinierbar): BEG-Zuschuss bis ${fmt(beg.amountMax)} € möglich ODER Steuerermäßigung §35c bis ${fmt(tax.totalMax)} € möglich – jeweils Maximalwert unter Annahmen.`
    : beg ? `Förderung: BEG-Zuschuss bis ${fmt(beg.amountMax)} € möglich (Maximalwert unter Annahmen); §35c nicht: ${funding.tax35cReason}`
    : tax ? `Förderung: Steuerermäßigung §35c bis ${fmt(tax.totalMax)} € möglich (Maximalwert unter Annahmen); BEG nicht: ${funding.begReason}`
    : `Keine Förderung ausgewiesen: ${funding.begReason}`;
  const summary = `${totals.totalFenster} VELUX Fenster: ab ${fmt(totals.totalBrutto)} € brutto (${fmt(totals.totalNetto)} € netto) inkl. Eindeckrahmen und Einbau-Mindestpreisen. ${fundingSummary}`;

  return {
    ok: true as const,
    contractVersion: CONTRACT_VERSION,
    scope: SCOPE,
    catalog: { name: CATALOG.name, validFrom: CATALOG.validFrom, revision: CATALOG.revision },
    rulesVersions: { beg: RULES.beg.rulesVersion, tax35c: RULES.tax35c.rulesVersion, reviewedAt: RULES.beg.lastReviewedAt },
    calculatedAt,
    estimateFingerprint: estimateFingerprint(input.positions, input.funding),
    currency: "EUR",
    vatRate: 0.19,
    summary,
    totals: { grossFrom: totals.totalBrutto, netFrom: totals.totalNetto, vat: totals.mwst, windowCount: totals.totalFenster },
    positions: details.map((d, i) => {
      const p = publicPosition(d);
      return {
        index: i + 1, model: p.model, modelName: p.modelName, size: p.size, dimensionsCm: p.dimensionsCm, glazing: p.glazing,
        fundingEligibleGlazing: isEligibleGlazing(d.glazing), quantity: p.quantity,
        ...(p.shutter !== "none" ? { shutter: p.shutter, shutterQuantity: p.shutterQuantity } : {}),
        ...(p.blind !== "none" ? { blind: p.blind, blindQuantity: p.blindQuantity } : {}),
        grossFrom: Math.round((d.matPos + d.labPos) * 1.19),
      };
    }),
    ...(input.existingWindow ? { existingWindow: input.existingWindow } : {}),
    funding: {
      notCombinable: true,
      ineligibleThermoPositions: funding.ineligibleThermoPositions,
      eligibleCostsGross: funding.eligibleCostsGross,
      begGrant: beg ? { status: beg.status, eligibleCostsGross: beg.eligibleCostsGross, capPerDwelling: beg.cap, capApplied: beg.capApplied, rateLabel: beg.rateLabel, amountMax: beg.amountMax, assumptions: beg.assumptions, missingAnswers: beg.missingAnswers, rulesVersion: beg.meta.rulesVersion, validThrough: beg.meta.validThrough } : null,
      begGrantReason: funding.begReason,
      taxBonus35c: tax ? { status: tax.status, base: tax.base, capApplied: tax.capApplied, totalMax: tax.totalMax, year1: tax.year1, year2: tax.year2, year3: tax.year3, assumptions: tax.assumptions, missingAnswers: tax.missingAnswers, rulesVersion: tax.meta.rulesVersion, validThrough: tax.meta.validThrough } : null,
      taxBonus35cReason: funding.tax35cReason,
      notes: ([funding.ineligibleThermoPositions > 0 ? FUNDING_NOTES.thermo : null, FUNDING_NOTES.notCombinable] as Array<string | null>).filter((n): n is string => n !== null),
    },
    assumptions: [...ASSUMPTIONS],
    exclusions: [...EXCLUSIONS],
    disclaimer: DISCLAIMER,
    nextStep: NEXT_STEPS[0],
    pageUrl: PAGE_URL,
    breakdown: input.includeBreakdown
      ? details.map((d, i) => ({ index: i + 1, unitPricesNet: { window: d.wp, flashingEdw2000: d.edw, shutter: d.sp || null, blind: d.bp || null }, laborNetFrom: { removal: LABOR.demontage, installation: LABOR.einbau, flashing: LABOR.eindeckrahmen, shutter: d.sp ? LABOR.rollladen : null, blind: d.bp ? LABOR.rollo : null }, materialNet: d.matPos, laborNetFrom_total: d.labPos, positionNetFrom: d.matPos + d.labPos }))
      : null,
  };
}

export function presentOptions(model: ModelCode | null, size: SizeCode | null, includePrices: boolean) {
  const models = (model ? [model] : MODEL_CODES).map((m) => ({
    code: m, name: WINDOWS[m].name, description: WINDOWS[m].desc,
    sizes: sizesForModel(m).filter((s) => !size || s === size),
    ...(includePrices && model ? { unitPricesNet: Object.fromEntries(sizesForModel(m).filter((s) => !size || s === size).map((s) => [s, { THERMO: WINDOWS[m].prices[s]!.T, ENERGIE: WINDOWS[m].prices[s]!.E, ENERGIE_PLUS: WINDOWS[m].prices[s]!.P, flashingEdw2000: EDW[s] }])) } : {}),
  }));
  const sizes = Object.fromEntries(SIZE_CODES.filter((s) => !size || s === size).map((s) => [s, `${DIMS[s]} cm`]));
  return {
    ok: true as const,
    contractVersion: CONTRACT_VERSION,
    catalog: { name: CATALOG.name, validFrom: CATALOG.validFrom, revision: CATALOG.revision, pricesAre: CATALOG.pricesAre },
    models,
    sizes,
    sizeCodeHint: "Buchstaben = Breite (C 55 · F 66 · M 78 · P 94 · S 114 · U 134 cm), Ziffern = Höhe (02 78 · 04 98 · 06 118 · 08 140 · 10 160 cm).",
    glazings: PUBLIC_GLAZINGS.map((g) => { const code = (Object.keys(CODE_TO_GLAZING) as Array<keyof typeof GL>).find((k) => CODE_TO_GLAZING[k] === g)!; return { code: g, label: GL[code].l, veluxCode: GL[code].code, uw: GL[code].uw, g: GL[code].g, fundingEligibleGlazing: isEligibleGlazing(code) }; }),
    shutters: (Object.keys(SHUTTERS) as Array<keyof typeof SHUTTERS>).map((s) => ({ code: s, name: SHUTTERS[s].name, availableSizes: SIZE_CODES.filter((z) => shuttersForSize(z).includes(s)).length === SIZE_CODES.length ? "all" : SIZE_CODES.filter((z) => shuttersForSize(z).includes(s)), ...(includePrices && size ? { unitPriceNet: SHUTTERS[s].prices[size] } : {}) })),
    blinds: (Object.keys(BLINDS) as Array<keyof typeof BLINDS>).map((b) => ({ code: b, name: BLINDS[b].name, availableSizes: SIZE_CODES.filter((z) => blindsForSize(z).includes(b)).length === SIZE_CODES.length ? "all" : SIZE_CODES.filter((z) => blindsForSize(z).includes(b)), ...(includePrices && size ? { unitPriceNet: BLINDS[b].prices[size] } : {}) })),
    laborNetFrom: includePrices ? { removal: LABOR.demontage, installation: LABOR.einbau, flashing: LABOR.eindeckrahmen, shutter: LABOR.rollladen, blind: LABOR.rollo, note: "Mindestpreise je Stück, netto" } : undefined,
    constraints: { maxPositions: 10, quantityPerPosition: [1, 10], accessoryQuantityMax: "quantity der Position", flashing: "EDW 2000 Ziegel h/W wird je Fenster automatisch mitgerechnet" },
    scope: SCOPE,
    scopeNote: SCOPE_NOTE,
    hint: `Für Gesamtkosten, MwSt. und Förderung immer ${TOOL_NAMES.calculate} verwenden – nicht selbst rechnen. Alt-Codes vom Typenschild zuerst mit ${TOOL_NAMES.resolve} auflösen.`,
    pageUrl: PAGE_URL,
  };
}

// ── Tool-Definitionen ────────────────────────────────────────────────

export function buildOptionsTool(): WebMCPTool {
  return {
    name: TOOL_NAMES.options,
    title: "VELUX-Optionen des Preisrechners",
    description: "Liefert die im Preisrechner von Rex Bedachungs GmbH (Bochum) kalkulierbaren VELUX-Dachfenster: Modelle (GGU, GGL, GPU, GPL), Größencodes mit cm-Maßen, Verglasungen mit Uw/g und Förderrelevanz, Rollläden/Rollos, Randbedingungen. Einzelpreise nur mit includePrices und model. Für Gesamtkosten, MwSt. und Förderung nicht selbst rechnen, sondern rex_velux_calculate_estimate_v1 aufrufen.",
    inputSchema: OPTIONS_INPUT_SCHEMA,
    annotations: { readOnlyHint: true },
    execute: (input) => {
      const v = validateOptionsInput(input);
      if (!v.ok) return failure(v.error);
      return presentOptions(v.value.model, v.value.size, v.value.includePrices);
    },
  };
}

export function buildResolveTool(): WebMCPTool {
  return {
    name: TOOL_NAMES.resolve,
    title: "VELUX-Bestandsfenster vom Typenschild bestimmen",
    description: "Prüft Angaben vom Typenschild eines vorhandenen VELUX-Dachfensters (Fenstertyp, Größencode – auch Alt-Codes wie M08 oder 308) gegen den versionierten Katalog und liefert Status, Kandidaten und den nächsten Schritt. Kein Bild übergeben: die Codes einzeln als Text, unsichere Zeichen als alternatives, nicht raten. Alt-Codes werden nie stillschweigend umgeschlüsselt; aus Fotos erkannte Angaben müssen vom Nutzer bestätigt werden. Das Ergebnis liefert nur den Bestand – Zielmodell, neue Verglasung und Zubehör wählt der Nutzer danach ausdrücklich.",
    inputSchema: OBSERVATION_INPUT_SCHEMA,
    annotations: { readOnlyHint: true },
    execute: (input) => {
      const v = validateObservationInput(input);
      if (!v.ok) return failure(v.error);
      const r = resolveExistingWindow(v.value);
      return { ok: true as const, contractVersion: CONTRACT_VERSION, ...r, pageUrl: PAGE_URL, existingGlazingNote: "Die Verglasung des Altfensters ist nie die neue Verglasung und begründet keine Förderung. Neue Verglasung immer mit dem Nutzer wählen." };
    },
  };
}

export function buildCalculateTool(): WebMCPTool {
  return {
    name: TOOL_NAMES.calculate,
    title: "VELUX-Kostenschätzung berechnen",
    description: "Berechnet eine unverbindliche Kostenschätzung für den Austausch von VELUX-Dachfenstern durch Rex Bedachungs GmbH (Bochum): Material (VELUX UVP netto) inkl. Eindeckrahmen EDW 2000, Einbau-Mindestpreise, MwSt., sowie BEG-Zuschuss (BAFA) und Steuerermäßigung §35c EStG als zwei nicht kombinierbare Alternativen mit ausgewiesenen Annahmen – ohne Empfehlung. Reine Berechnung ohne Wirkung auf die Seite. Rohdaten des Nutzers übergeben, nicht selbst rechnen; unbekannte Förderangaben als unknown übergeben; die Verglasung des Altfensters nie als neue übernehmen. Geltungsbereich: erste, selbstgenutzte Wohneinheit.",
    inputSchema: ESTIMATE_INPUT_SCHEMA,
    annotations: { readOnlyHint: true },
    execute: (input) => {
      const v = validateEstimateInput(input);
      if (!v.ok) return failure(v.error);
      return presentEstimate(v.value, buildEstimate(v.value.positions, v.value.funding));
    },
  };
}

const APPLY_INPUT_SCHEMA = {
  ...ESTIMATE_INPUT_SCHEMA,
  properties: {
    ...ESTIMATE_INPUT_SCHEMA.properties,
    replaceExisting: { type: "boolean", default: false, description: "true = einen bereits begonnenen Entwurf des Nutzers im Rechner überschreiben. Ohne true wird bei vorhandenem Entwurf DRAFT_EXISTS zurückgegeben – dann den Nutzer fragen." },
  },
} as const;

export function buildApplyTool(bridge: VeluxUiBridge): WebMCPTool {
  return {
    name: TOOL_NAMES.apply,
    title: "Konfiguration im sichtbaren Preisrechner anzeigen",
    description: "Übernimmt eine validierte Konfiguration in den Preisrechner auf der Seite und zeigt das Ergebnis (Schritt 3) sichtbar an, damit der Nutzer Zahlen, Annahmen und das Anfrageformular sieht. Ändert den Zustand der Seite; sendet nichts ab. Überschreibt einen begonnenen Nutzerentwurf nur mit replaceExisting=true. Vorher rex_velux_calculate_estimate_v1 für die reine Berechnung nutzen.",
    inputSchema: APPLY_INPUT_SCHEMA,
    annotations: { readOnlyHint: false },
    execute: async (input, options) => {
      const raw = input && typeof input === "object" && !Array.isArray(input) ? { ...(input as Record<string, unknown>) } : input;
      let replaceExisting = false;
      if (raw && typeof raw === "object" && "replaceExisting" in raw) {
        if (typeof raw.replaceExisting !== "boolean") return failure({ code: "INVALID_INPUT", message: "replaceExisting muss true oder false sein.", path: "replaceExisting" });
        replaceExisting = raw.replaceExisting;
        delete (raw as Record<string, unknown>).replaceExisting;
      }
      const v = validateEstimateInput(raw);
      if (!v.ok) return failure(v.error);
      if (bridge.hasUserDraft() && !replaceExisting) return failure({ code: "DRAFT_EXISTS", message: "Im Preisrechner ist bereits ein Entwurf des Nutzers vorhanden. Nutzer fragen und mit replaceExisting=true überschreiben." });
      const outcome = await bridge.apply(v.value.positions, v.value.funding, options?.signal);
      if (!outcome.applied) {
        const messages = { DRAFT_EXISTS: "Entwurf vorhanden.", BUSY: "Der Preisrechner verarbeitet gerade eine andere Übernahme – kurz warten und erneut versuchen.", ABORTED: "Übernahme abgebrochen." } as const;
        return failure({ code: outcome.code, message: messages[outcome.code] });
      }
      const estimate = presentEstimate(v.value, buildEstimate(v.value.positions, v.value.funding));
      return { ...estimate, uiApplied: true, uiNote: "Ergebnis ist im Preisrechner unter Schritt 3 sichtbar. Für ein Festangebot füllt der Nutzer dort Kontaktdaten aus und klickt selbst auf „Anfrage senden“." };
    },
  };
}

export function buildVeluxTools(bridge: VeluxUiBridge) {
  return { options: buildOptionsTool(), resolve: buildResolveTool(), calculate: buildCalculateTool(), apply: buildApplyTool(bridge) };
}
