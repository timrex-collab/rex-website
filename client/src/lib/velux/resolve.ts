/**
 * Deterministischer Resolver für Bestandsfenster aus Typenschild-Angaben.
 *
 * Eingabe sind ausschließlich strukturierte Einzelwerte (kein Bild, kein
 * OCR-Rohtext) — egal ob vom Nutzer getippt, von der KI des Kunden erkannt oder
 * vom Website-Foto-Service geliefert. Ausgabe ist ein Status mit Kandidaten,
 * Warnungen und dem nächsten Schritt. Der Resolver enthält keine Preislogik
 * und speichert nichts.
 *
 * Regeln:
 * - `resolved` nur, wenn Typ und Größe kataloggültig, eindeutig und ohne
 *   Alternativen sind UND die Quelle `user_typed` ist.
 * - Alt-Codes (M08, 308, 047 …) werden nie stillschweigend umgeschlüsselt →
 *   höchstens `confirmation_required` mit dem aktuellen Äquivalent.
 * - Erkennungen aus Bildern (`agent_image_recognition`, `site_recognition`)
 *   enden immer mindestens bei `confirmation_required`.
 * - Fremdhersteller, Zubehör- und Flachdach-Typenschilder → `unsupported_product`.
 * - Alt-/Sondertypen und nicht kalkulierbare Größen → `manual_review`.
 * - Nicht lesbare Werte → `new_photo_required` (Bildquelle) bzw.
 *   `confirmation_required` (Nutzereingabe).
 * - Produktions-/Seriencodes werden entgegengenommen, aber weder ausgewertet
 *   noch zurückgegeben (Datenminimierung).
 * - Die Verglasung des Bestandsfensters ist nie die Zielverglasung.
 */

import { DIMS, SIZE_CODES, sizesForModel, type ModelCode, type SizeCode } from "./catalog";
import {
  LEGACY_CATALOG_VERSION, OTHER_BRANDS, findLegacySize, findWindowType, isSupportedModel, looksLikeCurrentSizeCode,
  type Generation, type MappingStatus,
} from "./legacyCatalog";

export type ObservationSource = "user_typed" | "agent_image_recognition" | "site_recognition";

export interface FieldObservation {
  value: string;
  /** Alternative Lesarten unsicherer Zeichen (z. B. ["M08", "MO8"]). */
  alternatives?: string[];
  reason?: string;
}

export interface WindowObservation {
  brand?: string | FieldObservation;
  windowType?: string | FieldObservation;
  sizeCode?: string | FieldObservation;
  /** Ausführungskennziffer (z. B. "0070"); nur informativ. */
  variantCode?: string | FieldObservation;
  /** Produktions-/Seriencode: wird ignoriert und nie zurückgegeben. */
  productionCode?: string;
  source: ObservationSource;
}

export type ResolveStatus = "resolved" | "confirmation_required" | "new_photo_required" | "manual_review" | "unsupported_product";
export type FieldCatalogStatus = "exact" | "legacy_equivalent" | "ambiguous" | "unsupported" | "unknown" | "missing";

export interface ResolvedField {
  value: string | null;
  alternatives: string[];
  catalogStatus: FieldCatalogStatus;
  uncertaintyReason: string | null;
  needsUserConfirmation: boolean;
}

export interface ResolvedExistingWindow {
  windowType: ModelCode;
  sizeCode: SizeCode;
  dimensionsCm: string;
  legacySize: string | null;
  generation: Generation;
  mapping: MappingStatus;
}

export interface WindowCandidate {
  windowType: ModelCode;
  sizeCode: SizeCode;
  label: string;
  via: string;
}

export interface ResolveResult {
  status: ResolveStatus;
  existingWindow: ResolvedExistingWindow | null;
  candidates: WindowCandidate[];
  fields: { brand: ResolvedField; windowType: ResolvedField; sizeCode: ResolvedField };
  warnings: string[];
  nextStep: string;
  catalogVersion: string;
  source: ObservationSource;
}

const MAX_LEN = 24;

function obs(v: string | FieldObservation | undefined): { value: string; alternatives: string[]; reason: string | null } {
  if (v === undefined || v === null) return { value: "", alternatives: [], reason: null };
  if (typeof v === "string") return { value: v, alternatives: [], reason: null };
  return {
    value: typeof v.value === "string" ? v.value : "",
    alternatives: Array.isArray(v.alternatives) ? v.alternatives.filter((a): a is string => typeof a === "string") : [],
    reason: typeof v.reason === "string" ? v.reason : null,
  };
}

/** Großschreibung, Leer-/Trennzeichen entfernen, Länge begrenzen. */
export function normalizeCode(raw: string): string {
  return raw.normalize("NFKC").toUpperCase().replace(/[\s\-_./]+/g, "").slice(0, MAX_LEN);
}

/** Typische OCR-Verwechslungen als zusätzliche Kandidaten (nie stillschweigend angewendet). */
export function ocrVariants(code: string): string[] {
  const out = new Set<string>();
  const swaps: Array<[RegExp, string]> = [[/O/g, "0"], [/0/g, "O"], [/I/g, "1"], [/1/g, "I"], [/S/g, "5"], [/5/g, "S"], [/B/g, "8"], [/8/g, "B"]];
  for (const [re, to] of swaps) {
    const v = code.replace(re, to);
    if (v !== code) out.add(v);
  }
  return Array.from(out);
}

interface SizeLookup {
  current: SizeCode | null;
  catalogStatus: FieldCatalogStatus;
  legacySize: string | null;
  generation: Generation;
  mapping: MappingStatus | null;
  reason: string | null;
}

function lookupSize(code: string): SizeLookup {
  if (!code) return { current: null, catalogStatus: "missing", legacySize: null, generation: "unknown", mapping: null, reason: "Größencode fehlt." };
  const entry = findLegacySize(code);
  if (entry) {
    return { current: entry.currentEquivalent, catalogStatus: entry.mapping === "exact" ? "exact" : "legacy_equivalent", legacySize: entry.legacySize, generation: entry.generation, mapping: entry.mapping, reason: entry.mapping === "exact" ? null : `Alt-Code ${code} (${describeGeneration(entry.generation)}) entspricht heute ${entry.currentEquivalent} – bitte bestätigen.` };
  }
  if (looksLikeCurrentSizeCode(code)) {
    return { current: null, catalogStatus: "unsupported", legacySize: null, generation: "2013_plus", mapping: "unsupported", reason: `Größe ${code} ist ein gültiger VELUX-Code, im Preisrechner aber nicht kalkulierbar.` };
  }
  if (/^[CFMPSU]\d{2}$/.test(code) || /^[123468]\d{2}$/.test(code)) {
    return { current: null, catalogStatus: "unsupported", legacySize: code, generation: /^\d/.test(code) ? "1991_2001" : "2001_2013", mapping: "unsupported", reason: `Alt-Code ${code} hat kein kalkulierbares Äquivalent im Preisrechner.` };
  }
  return { current: null, catalogStatus: "unknown", legacySize: null, generation: "unknown", mapping: null, reason: `Größencode „${code}“ nicht erkannt.` };
}

export function describeGeneration(g: Generation): string {
  return { pre_1991: "vor 1991", "1991_2001": "1991–2001", "2001_2013": "2001–2013", "2013_plus": "ab 2013", unknown: "Generation unbekannt" }[g];
}

export function resolveExistingWindow(input: WindowObservation): ResolveResult {
  const source: ObservationSource = input.source === "agent_image_recognition" || input.source === "site_recognition" ? input.source : "user_typed";
  const fromImage = source !== "user_typed";
  const warnings: string[] = [];
  const candidates: WindowCandidate[] = [];

  // ── Fenstertyp ───────────────────────────────────────────────────────
  const typeObs = obs(input.windowType);
  const typeCode = normalizeCode(typeObs.value);
  const typeAlts = Array.from(new Set(typeObs.alternatives.map(normalizeCode).filter((a) => a && a !== typeCode)));
  const typeField: ResolvedField = { value: typeCode || null, alternatives: typeAlts, catalogStatus: "unknown", uncertaintyReason: typeObs.reason, needsUserConfirmation: false };
  const typeEntry = typeCode ? findWindowType(typeCode) : undefined;

  // ── Größe ────────────────────────────────────────────────────────────
  const sizeObs = obs(input.sizeCode);
  const sizeCode = normalizeCode(sizeObs.value);
  const sizeAlts = Array.from(new Set(sizeObs.alternatives.map(normalizeCode).filter((a) => a && a !== sizeCode)));
  const sizeLookup = lookupSize(sizeCode);
  const sizeField: ResolvedField = { value: sizeCode || null, alternatives: sizeAlts, catalogStatus: sizeLookup.catalogStatus, uncertaintyReason: sizeObs.reason ?? sizeLookup.reason, needsUserConfirmation: false };
  // Alternativen (inkl. OCR-Verwechslungen) als Kandidaten, nie als Ergebnis
  const altSizeHits = [...sizeAlts, ...(sizeLookup.current ? [] : ocrVariants(sizeCode))]
    .map((a) => ({ a, l: lookupSize(a) }))
    .filter(({ l }) => l.current !== null);

  // ── Hersteller ───────────────────────────────────────────────────────
  const brandObs = obs(input.brand);
  const brand = normalizeCode(brandObs.value);
  const brandField: ResolvedField = { value: brand || null, alternatives: brandObs.alternatives.map(normalizeCode), catalogStatus: "unknown", uncertaintyReason: brandObs.reason, needsUserConfirmation: false };
  if (brand && OTHER_BRANDS.some((b) => brand.includes(b))) {
    brandField.catalogStatus = "unsupported";
    return finish("unsupported_product", null, `Hersteller ${brand} erkannt – der Preisrechner kalkuliert nur VELUX-Dachfenster. Für andere Hersteller bitte Beratung anfragen.`);
  }
  if (brand.includes("VELUX")) brandField.catalogStatus = "exact";
  else if (!brand) { brandField.catalogStatus = "missing"; warnings.push("Hersteller nicht angegeben – VELUX angenommen."); }
  else { warnings.push(`Hersteller „${brand}“ nicht eindeutig – VELUX angenommen.`); }



  if (!typeCode) {
    typeField.catalogStatus = "missing";
  } else if (typeEntry && typeEntry.supported) {
    typeField.catalogStatus = "exact";
  } else if (typeEntry && typeEntry.category !== "roof_window") {
    typeField.catalogStatus = "unsupported";
    return finish("unsupported_product", null, `${typeCode} ist ${typeEntry.label} – ${typeEntry.note ?? "kein Dachfenster"} Bitte das Typenschild des Fensters selbst verwenden (oben am Flügel, bei geöffnetem Fenster).`);
  } else if (typeEntry) {
    typeField.catalogStatus = "unsupported";
    warnings.push(`${typeCode} (${typeEntry.label}): ${typeEntry.note ?? "nicht automatisch kalkulierbar."}`);
  } else if (/^G[A-Z]{2}$/.test(typeCode) || /^V[A-Z]{1,2}$/.test(typeCode)) {
    typeField.catalogStatus = "unknown";
    warnings.push(`Fenstertyp „${typeCode}“ ist im Katalog nicht hinterlegt.`);
  } else {
    typeField.catalogStatus = "unknown";
  }
  const supportedTypeAlts = typeAlts.filter(isSupportedModel);

  // ── Kombination ──────────────────────────────────────────────────────
  const modelForCandidates: ModelCode[] = isSupportedModel(typeCode) ? [typeCode] : supportedTypeAlts;
  const addCandidate = (m: ModelCode, s: SizeCode, via: string) => {
    if (!sizesForModel(m).includes(s)) return;
    if (candidates.some((c) => c.windowType === m && c.sizeCode === s)) return;
    candidates.push({ windowType: m, sizeCode: s, label: `${m} ${s} (${DIMS[s]} cm)`, via });
  };
  for (const m of modelForCandidates) {
    if (sizeLookup.current) addCandidate(m, sizeLookup.current, sizeLookup.catalogStatus === "exact" ? "Typenschild" : `Alt-Code ${sizeCode}`);
    for (const { a, l } of altSizeHits) addCandidate(m, l.current as SizeCode, `Lesart ${a}`);
  }

  if (typeField.catalogStatus === "missing" || sizeField.catalogStatus === "missing") {
    const missing = [typeField.catalogStatus === "missing" ? "Fenstertyp" : null, sizeField.catalogStatus === "missing" ? "Größencode" : null].filter(Boolean).join(" und ");
    typeField.needsUserConfirmation = sizeField.needsUserConfirmation = true;
    return finish(fromImage ? "new_photo_required" : "confirmation_required", null, `${missing} fehlt. ${fromImage ? "Bitte ein neues, scharfes Foto des Typenschilds aufnehmen (oben am Flügel, bei geöffnetem Fenster)." : "Bitte die Angaben vom Typenschild ergänzen oder das Fenster manuell konfigurieren."}`);
  }
  if (typeField.catalogStatus === "unknown" || sizeField.catalogStatus === "unknown") {
    typeField.needsUserConfirmation = sizeField.needsUserConfirmation = true;
    if (candidates.length > 0) return finish("confirmation_required", null, `Angaben nicht eindeutig lesbar. Mögliche Fenster: ${candidates.map((c) => c.label).join(", ")}. Bitte bestätigen oder korrigieren.`);
    return finish(fromImage ? "new_photo_required" : "manual_review", null, fromImage ? "Typenschild nicht eindeutig lesbar – bitte ein neues Foto aufnehmen oder die Codes manuell eingeben." : "Angaben konnten keinem VELUX-Fenster zugeordnet werden – wir prüfen das manuell; die Anfrage ist trotzdem möglich.");
  }
  if (typeField.catalogStatus === "unsupported" || sizeField.catalogStatus === "unsupported") {
    typeField.needsUserConfirmation = sizeField.needsUserConfirmation = true;
    return finish("manual_review", null, "Fenster erkannt, aber nicht automatisch kalkulierbar (Alt-/Sondertyp oder Sondergröße). Wir prüfen das manuell – die Anfrage ist trotzdem möglich.");
  }

  // Ab hier: Typ unterstützt, Größe exact oder legacy_equivalent
  const model = typeCode as ModelCode;
  const current = sizeLookup.current as SizeCode;
  if (!sizesForModel(model).includes(current)) {
    sizeField.needsUserConfirmation = true;
    return finish("manual_review", null, `${model} ist in der Größe ${current} im Preisrechner nicht kalkulierbar – wir prüfen das manuell.`);
  }
  const existing: ResolvedExistingWindow = { windowType: model, sizeCode: current, dimensionsCm: DIMS[current], legacySize: sizeLookup.legacySize, generation: sizeLookup.generation, mapping: sizeLookup.mapping ?? "exact" };
  addCandidate(model, current, sizeLookup.catalogStatus === "exact" ? "Typenschild" : `Alt-Code ${sizeCode}`);

  const hasAlternatives = typeAlts.length > 0 || sizeAlts.length > 0;
  const isLegacy = sizeLookup.catalogStatus === "legacy_equivalent";
  if (isLegacy) { sizeField.needsUserConfirmation = true; warnings.push(sizeLookup.reason as string); }
  if (fromImage) { typeField.needsUserConfirmation = sizeField.needsUserConfirmation = true; }
  if (hasAlternatives) { typeField.needsUserConfirmation = typeAlts.length > 0; sizeField.needsUserConfirmation = sizeField.needsUserConfirmation || sizeAlts.length > 0; }

  if (!fromImage && !isLegacy && !hasAlternatives) {
    return finish("resolved", existing, `Bestandsfenster ${model} ${current} (${DIMS[current]} cm) erkannt. Jetzt Zielmodell, neue Verglasung und Zubehör wählen – die alte Verglasung wird nicht übernommen.`);
  }
  return finish("confirmation_required", existing, `Bitte bestätigen: ${model} ${current} (${DIMS[current]} cm)${isLegacy ? ` – erkannt aus Alt-Code ${sizeCode} (${describeGeneration(sizeLookup.generation)})` : ""}${candidates.length > 1 ? `. Weitere Lesarten: ${candidates.slice(1).map((c) => c.label).join(", ")}` : ""}. Danach Zielverglasung und Zubehör wählen.`);

  function finish(status: ResolveStatus, existingWindow: ResolvedExistingWindow | null, nextStep: string): ResolveResult {
    return { status, existingWindow, candidates, fields: { brand: brandField, windowType: typeField, sizeCode: sizeField }, warnings, nextStep, catalogVersion: LEGACY_CATALOG_VERSION, source };
  }
}

/** Alle im Preisrechner kalkulierbaren Größen (für Rückfragen des Agenten). */
export function supportedSizes(): SizeCode[] {
  return [...SIZE_CODES];
}
