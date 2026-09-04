/**
 * Parser + Validator für die WebMCP-Tool-Eingaben (Vertrag v1).
 *
 * Strikt: unbekannte Schlüssel werden abgewiesen, Enums geprüft, Größen gegen
 * das Modell validiert, Mengen begrenzt. Fehler sind strukturiert und tragen
 * die erlaubten Werte, damit ein Agent sich in einer Runde selbst korrigiert.
 * Alle Texte deutsch, alle Schlüssel englisch.
 */

import {
  DIMS, MODEL_CODES, SIZE_CODES, WINDOWS, blindsForSize, shuttersForSize, sizesForModel,
  type BlindCode, type GlazingCode, type ModelCode, type ShutterCode, type SizeCode,
} from "./catalog";
import type { ValidatedPosition } from "./estimate";
import type { BuildingAge, FundingAnswers, TriState } from "./funding";
import type { ObservationSource, WindowObservation } from "./resolve";

export const CONTRACT_VERSION = "1";

export type PublicGlazing = "THERMO" | "ENERGIE" | "ENERGIE_PLUS";
export const PUBLIC_GLAZINGS: PublicGlazing[] = ["THERMO", "ENERGIE", "ENERGIE_PLUS"];
export const GLAZING_TO_CODE: Record<PublicGlazing, GlazingCode> = { THERMO: "T", ENERGIE: "E", ENERGIE_PLUS: "P" };
export const CODE_TO_GLAZING: Record<GlazingCode, PublicGlazing> = { T: "THERMO", E: "ENERGIE", P: "ENERGIE_PLUS" };

export type ErrorCode =
  | "INVALID_INPUT" | "UNKNOWN_FIELD" | "INVALID_ENUM" | "INVALID_SIZE_FOR_MODEL" | "ACCESSORY_QTY_EXCEEDS_WINDOWS"
  | "SCOPE_NOT_SUPPORTED" | "DRAFT_EXISTS" | "BUSY" | "ABORTED" | "INTERNAL_ERROR";

export interface ToolError {
  code: ErrorCode;
  message: string;
  path?: string;
  allowedValues?: string[];
  allowedSizes?: string[];
}

export type Validation<T> = { ok: true; value: T } | { ok: false; error: ToolError };

const TRI: TriState[] = ["yes", "no", "unknown"];
const AGES: BuildingAge[] = ["under_5", "5_to_10", "over_10", "unknown"];
const SHUTTERS_PUBLIC = ["none", "SSL", "SML"];
const BLINDS_PUBLIC = ["none", "DKL", "DSL"];
export const MAX_POSITIONS = 10;
export const MAX_QTY = 10;

// ── JSON-Schemas (für registerTool.inputSchema) ───────────────────────

export const POSITION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["model", "size", "glazing", "quantity"],
  properties: {
    model: { type: "string", enum: MODEL_CODES, description: "VELUX Fenstertyp des NEUEN Fensters: GGU = Kunststoff-Schwingfenster (feuchtraumgeeignet), GGL = Holz-Schwingfenster, GPU = Kunststoff-Klapp-Schwingfenster, GPL = Holz-Klapp-Schwingfenster. GPU/GPL sind nicht in allen Größen verfügbar (siehe rex_velux_get_options_v1)." },
    size: { type: "string", enum: SIZE_CODES, description: "VELUX Größencode (Breite×Höhe in cm), z. B. MK08 = 78×140 cm. Alt-Codes (M08, 308) vorher mit rex_velux_resolve_existing_window_v1 auflösen." },
    glazing: { type: "string", enum: PUBLIC_GLAZINGS, description: "Verglasung des NEUEN Fensters. THERMO (Uw 1,3) ist nicht förderrelevant; ENERGIE (Uw 1,0, g 0,46) und ENERGIE_PLUS (Uw 1,0, g 0,44) erfüllen die BEG-Anforderung Uw ≤ 1,0. Nie die Verglasung des Altfensters übernehmen – den Nutzer fragen." },
    quantity: { type: "integer", minimum: 1, maximum: MAX_QTY, description: "Anzahl Fenster dieser Position." },
    shutter: { type: "string", enum: SHUTTERS_PUBLIC, default: "none", description: "Außenrollladen: none = keiner, SSL = Solar-Rollladen (kabellos), SML = Elektro-Rollladen." },
    shutterQuantity: { type: "integer", minimum: 1, maximum: MAX_QTY, description: "Anzahl Rollläden (höchstens quantity). Fehlt der Wert: einer je Fenster." },
    blind: { type: "string", enum: BLINDS_PUBLIC, default: "none", description: "Verdunkelungsrollo (Stoff Standard Weiß): none = keins, DKL = manuell, DSL = solar." },
    blindQuantity: { type: "integer", minimum: 1, maximum: MAX_QTY, description: "Anzahl Rollos (höchstens quantity). Fehlt der Wert: eines je Fenster." },
  },
} as const;

export const FUNDING_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["buildingAge", "energyRenovation", "ownerOccupied", "hasIsfp"],
  description: "Antworten des Förder-Checks. Unbekannte Angaben als \"unknown\" übergeben, nicht raten – das Ergebnis weist Annahmen dann aus.",
  properties: {
    buildingAge: { type: "string", enum: AGES, description: "Alter des Gebäudes (Bauantrag): under_5, 5_to_10, over_10 oder unknown. BEG EM setzt mindestens 5 Jahre voraus, §35c EStG mehr als 10 Jahre." },
    energyRenovation: { type: "string", enum: TRI, description: "Fenstertausch mit verbessertem Uw-Wert (energetische Einzelmaßnahme)? yes / no / unknown." },
    ownerOccupied: { type: "string", enum: TRI, description: "Selbstgenutztes Wohneigentum? yes / no / unknown. Voraussetzung für §35c EStG." },
    hasIsfp: { type: "string", enum: TRI, description: "Liegt ein individueller Sanierungsfahrplan (iSFP) vor? yes / no / unknown." },
  },
} as const;

export const EXISTING_WINDOW_SCHEMA = {
  type: "object",
  additionalProperties: false,
  description: "Optional: bestätigtes Bestandsfenster (nur informativ, aus rex_velux_resolve_existing_window_v1).",
  properties: {
    windowType: { type: "string", enum: MODEL_CODES },
    sizeCode: { type: "string", enum: SIZE_CODES },
  },
} as const;

export const ESTIMATE_INPUT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["positions", "funding"],
  properties: {
    positions: { type: "array", minItems: 1, maxItems: MAX_POSITIONS, description: "Eine Position je Fenstertyp/Größe/Verglasung; gleiche Fenster über quantity zusammenfassen.", items: POSITION_SCHEMA },
    funding: FUNDING_SCHEMA,
    existingWindow: EXISTING_WINDOW_SCHEMA,
    includeBreakdown: { type: "boolean", default: false, description: "true = zusätzlich Netto-Einzelpreise je Position (längere Antwort). Standard false." },
  },
} as const;

export const OPTIONS_INPUT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    model: { type: "string", enum: MODEL_CODES, description: "Optional: nur Größen und (mit includePrices) Preise dieses Modells." },
    size: { type: "string", enum: SIZE_CODES, description: "Optional: nur Informationen zu dieser Größe." },
    includePrices: { type: "boolean", default: false, description: "true = Einzelpreise netto (nur zusammen mit model). Für Gesamtkosten immer rex_velux_calculate_estimate_v1 verwenden." },
  },
} as const;

const OBSERVATION_FIELD_SCHEMA = {
  oneOf: [
    { type: "string" },
    { type: "object", additionalProperties: false, required: ["value"], properties: { value: { type: "string" }, alternatives: { type: "array", items: { type: "string" }, maxItems: 5 }, reason: { type: "string" } } },
  ],
} as const;

export const OBSERVATION_INPUT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["source"],
  properties: {
    brand: { ...OBSERVATION_FIELD_SCHEMA, description: "Hersteller laut Typenschild, z. B. VELUX." },
    windowType: { ...OBSERVATION_FIELD_SCHEMA, description: "Fenstertyp laut Typenschild, z. B. GGL. Unsichere Zeichen als alternatives angeben." },
    sizeCode: { ...OBSERVATION_FIELD_SCHEMA, description: "Größencode laut Typenschild, auch Alt-Codes (MK08, M08, 308). Unsichere Zeichen als alternatives angeben, nicht raten." },
    variantCode: { ...OBSERVATION_FIELD_SCHEMA, description: "Optional: Ausführungskennziffer (z. B. 0070). Nur informativ." },
    productionCode: { type: "string", description: "Optional: Produktions-/Seriencode. Wird nicht ausgewertet und nie zurückgegeben." },
    source: { type: "string", enum: ["user_typed", "agent_image_recognition", "site_recognition"], description: "Herkunft der Angaben: user_typed (vom Nutzer genannt) oder agent_image_recognition (vom Agenten aus einem Foto gelesen)." },
  },
} as const;

// ── Helfer ────────────────────────────────────────────────────────────

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const err = (code: ErrorCode, message: string, extra: Partial<ToolError> = {}): { ok: false; error: ToolError } => ({ ok: false, error: { code, message, ...extra } });

function rejectUnknownKeys(obj: Record<string, unknown>, allowed: readonly string[], path: string): ToolError | null {
  const unknown = Object.keys(obj).filter((k) => !allowed.includes(k));
  if (unknown.length === 0) return null;
  return { code: "UNKNOWN_FIELD", message: `Unbekannte Felder in ${path}: ${unknown.join(", ")}.`, path, allowedValues: [...allowed] };
}

function normEnum(v: unknown): string {
  return typeof v === "string" ? v.trim().toUpperCase().replace(/[\s-]+/g, "_") : "";
}

function normLowerEnum(v: unknown): string {
  return typeof v === "string" ? v.trim().toLowerCase().replace(/[\s-]+/g, "_") : "";
}

function intInRange(v: unknown, min: number, max: number): number | null {
  const n = typeof v === "string" && /^\d+$/.test(v.trim()) ? Number(v) : v;
  return typeof n === "number" && Number.isInteger(n) && n >= min && n <= max ? n : null;
}

// ── Validierung ───────────────────────────────────────────────────────

export interface EstimateInput {
  positions: ValidatedPosition[];
  funding: FundingAnswers;
  existingWindow: { windowType: ModelCode; sizeCode: SizeCode } | null;
  includeBreakdown: boolean;
}

export function validatePosition(raw: unknown, path: string): Validation<ValidatedPosition> {
  if (!isRecord(raw)) return err("INVALID_INPUT", `${path} muss ein Objekt sein.`, { path });
  const unknown = rejectUnknownKeys(raw, Object.keys(POSITION_SCHEMA.properties), path);
  if (unknown) return { ok: false, error: unknown };

  const model = normEnum(raw.model);
  if (!(MODEL_CODES as string[]).includes(model)) return err("INVALID_ENUM", `${path}.model muss einer der VELUX-Fenstertypen sein.`, { path: `${path}.model`, allowedValues: [...MODEL_CODES] });
  const size = normEnum(raw.size);
  if (!(SIZE_CODES as string[]).includes(size)) return err("INVALID_ENUM", `${path}.size muss ein aktueller VELUX-Größencode sein (Alt-Codes zuerst mit rex_velux_resolve_existing_window_v1 auflösen).`, { path: `${path}.size`, allowedValues: [...SIZE_CODES] });
  const allowedSizes = sizesForModel(model as ModelCode);
  if (!allowedSizes.includes(size as SizeCode)) return err("INVALID_SIZE_FOR_MODEL", `${model} ist in der Größe ${size} nicht verfügbar.`, { path: `${path}.size`, allowedSizes });
  const glazingPublic = normEnum(raw.glazing);
  if (!(PUBLIC_GLAZINGS as string[]).includes(glazingPublic)) return err("INVALID_ENUM", `${path}.glazing muss THERMO, ENERGIE oder ENERGIE_PLUS sein.`, { path: `${path}.glazing`, allowedValues: PUBLIC_GLAZINGS });
  const qty = intInRange(raw.quantity, 1, MAX_QTY);
  if (qty === null) return err("INVALID_INPUT", `${path}.quantity muss eine ganze Zahl von 1 bis ${MAX_QTY} sein.`, { path: `${path}.quantity` });

  const shutter = raw.shutter === undefined ? "none" : normEnum(raw.shutter) === "NONE" ? "none" : normEnum(raw.shutter);
  if (!SHUTTERS_PUBLIC.includes(shutter)) return err("INVALID_ENUM", `${path}.shutter muss none, SSL oder SML sein.`, { path: `${path}.shutter`, allowedValues: SHUTTERS_PUBLIC });
  if (shutter !== "none" && !shuttersForSize(size as SizeCode).includes(shutter as ShutterCode)) return err("INVALID_ENUM", `Rollladen ${shutter} ist für ${size} nicht verfügbar.`, { path: `${path}.shutter`, allowedValues: ["none", ...shuttersForSize(size as SizeCode)] });
  let shutterQty = 0;
  if (shutter !== "none") {
    shutterQty = raw.shutterQuantity === undefined ? qty : (intInRange(raw.shutterQuantity, 1, MAX_QTY) ?? -1);
    if (shutterQty < 1) return err("INVALID_INPUT", `${path}.shutterQuantity muss eine ganze Zahl von 1 bis ${MAX_QTY} sein.`, { path: `${path}.shutterQuantity` });
    if (shutterQty > qty) return err("ACCESSORY_QTY_EXCEEDS_WINDOWS", `${path}.shutterQuantity (${shutterQty}) darf quantity (${qty}) nicht übersteigen.`, { path: `${path}.shutterQuantity` });
  } else if (raw.shutterQuantity !== undefined) {
    return err("INVALID_INPUT", `${path}.shutterQuantity nur zusammen mit shutter SSL oder SML.`, { path: `${path}.shutterQuantity` });
  }

  const blind = raw.blind === undefined ? "none" : normEnum(raw.blind) === "NONE" ? "none" : normEnum(raw.blind);
  if (!BLINDS_PUBLIC.includes(blind)) return err("INVALID_ENUM", `${path}.blind muss none, DKL oder DSL sein.`, { path: `${path}.blind`, allowedValues: BLINDS_PUBLIC });
  if (blind !== "none" && !blindsForSize(size as SizeCode).includes(blind as BlindCode)) return err("INVALID_ENUM", `Rollo ${blind} ist für ${size} nicht verfügbar.`, { path: `${path}.blind`, allowedValues: ["none", ...blindsForSize(size as SizeCode)] });
  let blindQty = 0;
  if (blind !== "none") {
    blindQty = raw.blindQuantity === undefined ? qty : (intInRange(raw.blindQuantity, 1, MAX_QTY) ?? -1);
    if (blindQty < 1) return err("INVALID_INPUT", `${path}.blindQuantity muss eine ganze Zahl von 1 bis ${MAX_QTY} sein.`, { path: `${path}.blindQuantity` });
    if (blindQty > qty) return err("ACCESSORY_QTY_EXCEEDS_WINDOWS", `${path}.blindQuantity (${blindQty}) darf quantity (${qty}) nicht übersteigen.`, { path: `${path}.blindQuantity` });
  } else if (raw.blindQuantity !== undefined) {
    return err("INVALID_INPUT", `${path}.blindQuantity nur zusammen mit blind DKL oder DSL.`, { path: `${path}.blindQuantity` });
  }

  return {
    ok: true,
    value: {
      model: model as ModelCode, size: size as SizeCode, glazing: GLAZING_TO_CODE[glazingPublic as PublicGlazing], qty,
      shutter: shutter as ValidatedPosition["shutter"], shutterQty, blind: blind as ValidatedPosition["blind"], blindQty,
    },
  };
}

export function validateFunding(raw: unknown, path = "funding"): Validation<FundingAnswers> {
  if (!isRecord(raw)) return err("INVALID_INPUT", `${path} muss ein Objekt mit buildingAge, energyRenovation, ownerOccupied und hasIsfp sein.`, { path });
  const unknown = rejectUnknownKeys(raw, Object.keys(FUNDING_SCHEMA.properties), path);
  if (unknown) return { ok: false, error: unknown };
  const age = normLowerEnum(raw.buildingAge);
  if (!(AGES as string[]).includes(age)) return err("INVALID_ENUM", `${path}.buildingAge muss under_5, 5_to_10, over_10 oder unknown sein.`, { path: `${path}.buildingAge`, allowedValues: AGES });
  const tri = (key: "energyRenovation" | "ownerOccupied" | "hasIsfp"): Validation<TriState> => {
    const v = normLowerEnum(raw[key]);
    if (!(TRI as string[]).includes(v)) return err("INVALID_ENUM", `${path}.${key} muss yes, no oder unknown sein.`, { path: `${path}.${key}`, allowedValues: TRI });
    return { ok: true, value: v as TriState };
  };
  const e = tri("energyRenovation"); if (!e.ok) return e;
  const o = tri("ownerOccupied"); if (!o.ok) return o;
  const i = tri("hasIsfp"); if (!i.ok) return i;
  return { ok: true, value: { buildingAge: age as BuildingAge, energyRenovation: e.value, ownerOccupied: o.value, hasIsfp: i.value } };
}

export function validateEstimateInput(input: unknown): Validation<EstimateInput> {
  if (!isRecord(input)) return err("INVALID_INPUT", "Eingabe muss ein Objekt mit positions und funding sein.");
  const unknown = rejectUnknownKeys(input, Object.keys(ESTIMATE_INPUT_SCHEMA.properties), "input");
  if (unknown) return { ok: false, error: unknown };
  if (!Array.isArray(input.positions) || input.positions.length < 1) return err("INVALID_INPUT", "positions muss eine Liste mit mindestens einer Position sein.", { path: "positions" });
  if (input.positions.length > MAX_POSITIONS) return err("INVALID_INPUT", `Höchstens ${MAX_POSITIONS} Positionen.`, { path: "positions" });
  const positions: ValidatedPosition[] = [];
  for (let i = 0; i < input.positions.length; i++) {
    const p = validatePosition(input.positions[i], `positions[${i}]`);
    if (!p.ok) return p;
    positions.push(p.value);
  }
  const funding = validateFunding(input.funding);
  if (!funding.ok) return funding;
  let existingWindow: EstimateInput["existingWindow"] = null;
  if (input.existingWindow !== undefined) {
    if (!isRecord(input.existingWindow)) return err("INVALID_INPUT", "existingWindow muss ein Objekt sein.", { path: "existingWindow" });
    const u = rejectUnknownKeys(input.existingWindow, ["windowType", "sizeCode"], "existingWindow");
    if (u) return { ok: false, error: u };
    const wt = normEnum(input.existingWindow.windowType); const sc = normEnum(input.existingWindow.sizeCode);
    if (wt && !(MODEL_CODES as string[]).includes(wt)) return err("INVALID_ENUM", "existingWindow.windowType unbekannt.", { path: "existingWindow.windowType", allowedValues: [...MODEL_CODES] });
    if (sc && !(SIZE_CODES as string[]).includes(sc)) return err("INVALID_ENUM", "existingWindow.sizeCode unbekannt.", { path: "existingWindow.sizeCode", allowedValues: [...SIZE_CODES] });
    if (wt && sc) existingWindow = { windowType: wt as ModelCode, sizeCode: sc as SizeCode };
  }
  if (input.includeBreakdown !== undefined && typeof input.includeBreakdown !== "boolean") return err("INVALID_INPUT", "includeBreakdown muss true oder false sein.", { path: "includeBreakdown" });
  return { ok: true, value: { positions, funding: funding.value, existingWindow, includeBreakdown: input.includeBreakdown === true } };
}

export interface OptionsInput { model: ModelCode | null; size: SizeCode | null; includePrices: boolean }

export function validateOptionsInput(input: unknown): Validation<OptionsInput> {
  const raw = input === undefined || input === null ? {} : input;
  if (!isRecord(raw)) return err("INVALID_INPUT", "Eingabe muss ein Objekt sein (leer erlaubt).");
  const unknown = rejectUnknownKeys(raw, Object.keys(OPTIONS_INPUT_SCHEMA.properties), "input");
  if (unknown) return { ok: false, error: unknown };
  let model: ModelCode | null = null;
  if (raw.model !== undefined) {
    const m = normEnum(raw.model);
    if (!(MODEL_CODES as string[]).includes(m)) return err("INVALID_ENUM", "model unbekannt.", { path: "model", allowedValues: [...MODEL_CODES] });
    model = m as ModelCode;
  }
  let size: SizeCode | null = null;
  if (raw.size !== undefined) {
    const s = normEnum(raw.size);
    if (!(SIZE_CODES as string[]).includes(s)) return err("INVALID_ENUM", "size unbekannt.", { path: "size", allowedValues: [...SIZE_CODES] });
    size = s as SizeCode;
  }
  if (raw.includePrices !== undefined && typeof raw.includePrices !== "boolean") return err("INVALID_INPUT", "includePrices muss true oder false sein.", { path: "includePrices" });
  return { ok: true, value: { model, size, includePrices: raw.includePrices === true } };
}

function observationField(v: unknown, path: string): Validation<string | { value: string; alternatives?: string[]; reason?: string } | undefined> {
  if (v === undefined || v === null) return { ok: true, value: undefined };
  if (typeof v === "string") return { ok: true, value: v.slice(0, 64) };
  if (!isRecord(v)) return err("INVALID_INPUT", `${path} muss ein String oder ein Objekt {value, alternatives?, reason?} sein.`, { path });
  const unknown = rejectUnknownKeys(v, ["value", "alternatives", "reason"], path);
  if (unknown) return { ok: false, error: unknown };
  if (typeof v.value !== "string") return err("INVALID_INPUT", `${path}.value muss ein String sein.`, { path: `${path}.value` });
  const alternatives = v.alternatives === undefined ? undefined : Array.isArray(v.alternatives) && v.alternatives.every((a) => typeof a === "string") ? (v.alternatives as string[]).slice(0, 5).map((a) => a.slice(0, 64)) : null;
  if (alternatives === null) return err("INVALID_INPUT", `${path}.alternatives muss eine Liste von Strings sein.`, { path: `${path}.alternatives` });
  const reason = v.reason === undefined ? undefined : typeof v.reason === "string" ? v.reason.slice(0, 200) : null;
  if (reason === null) return err("INVALID_INPUT", `${path}.reason muss ein String sein.`, { path: `${path}.reason` });
  return { ok: true, value: { value: v.value.slice(0, 64), alternatives, reason } };
}

export function validateObservationInput(input: unknown): Validation<WindowObservation> {
  if (!isRecord(input)) return err("INVALID_INPUT", "Eingabe muss ein Objekt mit source und den Typenschild-Feldern sein.");
  const unknown = rejectUnknownKeys(input, Object.keys(OBSERVATION_INPUT_SCHEMA.properties), "input");
  if (unknown) return { ok: false, error: unknown };
  const source = normLowerEnum(input.source);
  const sources: ObservationSource[] = ["user_typed", "agent_image_recognition", "site_recognition"];
  if (!(sources as string[]).includes(source)) return err("INVALID_ENUM", "source muss user_typed, agent_image_recognition oder site_recognition sein.", { path: "source", allowedValues: sources });
  const out: WindowObservation = { source: source as ObservationSource };
  for (const key of ["brand", "windowType", "sizeCode", "variantCode"] as const) {
    const f = observationField(input[key], key);
    if (!f.ok) return f;
    if (f.value !== undefined) out[key] = f.value;
  }
  if (input.productionCode !== undefined && typeof input.productionCode !== "string") return err("INVALID_INPUT", "productionCode muss ein String sein.", { path: "productionCode" });
  if (!out.windowType && !out.sizeCode) return err("INVALID_INPUT", "Mindestens windowType oder sizeCode angeben.", { path: "windowType" });
  return { ok: true, value: out };
}

/** Öffentliche Darstellung einer validierten Position (für Antworten). */
export function publicPosition(p: ValidatedPosition) {
  return {
    model: p.model, modelName: WINDOWS[p.model].name, size: p.size, dimensionsCm: DIMS[p.size],
    glazing: CODE_TO_GLAZING[p.glazing], quantity: p.qty,
    shutter: p.shutter, shutterQuantity: p.shutterQty, blind: p.blind, blindQuantity: p.blindQty,
  };
}
