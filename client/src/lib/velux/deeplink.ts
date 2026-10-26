/**
 * Rechner-Link: Konfiguration im URL-Fragment, ohne Kontaktdaten (W1).
 *
 * Format (Version 1):
 *   #rechner=1&p=Modell.Größe.Verglasung.Anzahl[.Rollladen[.Anzahl]][.Rollo[.Anzahl]]&p=…[&f=Alter.Energie.Selbstnutzung.iSFP]
 *   z. B. #rechner=1&p=GGU.MK08.ENERGIE.1&f=over_10.yes.yes.no
 *
 * - Eine `p` je Position (höchstens 10), Werte wie im WebMCP-Vertrag v1
 *   (Verglasung THERMO | ENERGIE | ENERGIE_PLUS, Rollladen SSL | SML, Rollo DKL | DSL).
 *   Fehlt die Zubehör-Anzahl, gilt eine je Fenster.
 * - `f` ist optional; ohne `f` beantwortet der Nutzer die Förderfragen selbst.
 * - Geprüft wird über dieselben Validatoren wie bei den WebMCP-Tools
 *   (validate.ts): Mengen 1–10, Zubehör höchstens so viele wie Fenster,
 *   Größe passend zum Modell. Keine eigene Preis- oder Förderlogik.
 * - Das Fragment verlässt den Browser nicht (kein Server-Log); der Rechner
 *   entfernt es nach dem Lesen aus der Adresszeile.
 * - `parseCalculatorFragment` wirft nie: unbekannte Version und ungültige
 *   Eingaben ergeben einen Status, mit dem der Rechner leer startet und einen
 *   Hinweis zeigt.
 */

import { PAGE_URL } from "./content";
import type { ValidatedPosition } from "./estimate";
import type { FundingAnswers } from "./funding";
import { CODE_TO_GLAZING, MAX_POSITIONS, validateFunding, validatePosition } from "./validate";

export const CALCULATOR_LINK_VERSION = "1";
export const CALCULATOR_LINK_MAX_LENGTH = 1000;

export type CalculatorLink =
  | { status: "none" }
  | { status: "ok"; positions: ValidatedPosition[]; funding: FundingAnswers | null }
  | { status: "unsupported_version" }
  | { status: "invalid"; reason: string };

const SHUTTER_TOKENS = ["SSL", "SML"];
const BLIND_TOKENS = ["DKL", "DSL"];

const isComplete = (f: FundingAnswers | null | undefined): f is FundingAnswers =>
  Boolean(f && f.buildingAge && f.energyRenovation && f.ownerOccupied && f.hasIsfp);

function encodePosition(p: ValidatedPosition): string {
  const parts = [p.model, p.size, CODE_TO_GLAZING[p.glazing], String(p.qty)];
  if (p.shutter !== "none") parts.push(p.shutter, String(p.shutterQty));
  if (p.blind !== "none") parts.push(p.blind, String(p.blindQty));
  return parts.join(".");
}

/** Fragment ohne „#“. Förderantworten nur, wenn alle vier beantwortet sind. */
export function buildCalculatorFragment(positions: ValidatedPosition[], funding?: FundingAnswers | null): string {
  const parts = [`rechner=${CALCULATOR_LINK_VERSION}`, ...positions.map((p) => `p=${encodePosition(p)}`)];
  if (isComplete(funding)) parts.push(`f=${[funding.buildingAge, funding.energyRenovation, funding.ownerOccupied, funding.hasIsfp].join(".")}`);
  return parts.join("&");
}

export function buildCalculatorUrl(positions: ValidatedPosition[], funding?: FundingAnswers | null): string {
  return `${PAGE_URL}#${buildCalculatorFragment(positions, funding)}`;
}

/** Eine Position aus „Modell.Größe.Verglasung.Anzahl[.Rollladen[.Anzahl]][.Rollo[.Anzahl]]“. */
function parsePosition(token: string, index: number): { ok: true; value: ValidatedPosition } | { ok: false; reason: string } {
  const label = `Position ${index + 1}`;
  const parts = token.split(".");
  if (parts.length < 4) return { ok: false, reason: `${label}: Modell, Größe, Verglasung und Anzahl erforderlich.` };
  const [model, size, glazing, quantity, ...rest] = parts;
  const raw: Record<string, unknown> = { model, size, glazing, quantity };
  let i = 0;
  const isCount = (v: string | undefined) => v !== undefined && /^\d{1,2}$/.test(v);
  if (rest[i] !== undefined && SHUTTER_TOKENS.includes(rest[i].toUpperCase())) {
    raw.shutter = rest[i++];
    if (isCount(rest[i])) raw.shutterQuantity = rest[i++];
  }
  if (rest[i] !== undefined && BLIND_TOKENS.includes(rest[i].toUpperCase())) {
    raw.blind = rest[i++];
    if (isCount(rest[i])) raw.blindQuantity = rest[i++];
  }
  if (i < rest.length) return { ok: false, reason: `${label}: unerwartete Angabe.` };
  const v = validatePosition(raw, label);
  return v.ok ? { ok: true, value: v.value } : { ok: false, reason: v.error.message };
}

/** Liest das Fragment (mit oder ohne „#“). Wirft nie. */
export function parseCalculatorFragment(hash: unknown): CalculatorLink {
  try {
    if (typeof hash !== "string") return { status: "none" };
    const s = hash.startsWith("#") ? hash.slice(1) : hash;
    if (!s.includes("rechner=")) return { status: "none" };
    if (s.length > CALCULATOR_LINK_MAX_LENGTH) return { status: "invalid", reason: "Link zu lang." };
    const params = new URLSearchParams(s);
    const version = params.get("rechner");
    if (version === null) return { status: "none" };
    if (version !== CALCULATOR_LINK_VERSION) return { status: "unsupported_version" };
    const tokens = params.getAll("p");
    if (tokens.length === 0) return { status: "invalid", reason: "Keine Position angegeben." };
    if (tokens.length > MAX_POSITIONS) return { status: "invalid", reason: `Höchstens ${MAX_POSITIONS} Positionen.` };
    const positions: ValidatedPosition[] = [];
    for (let i = 0; i < tokens.length; i++) {
      const p = parsePosition(tokens[i], i);
      if (!p.ok) return { status: "invalid", reason: p.reason };
      positions.push(p.value);
    }
    let funding: FundingAnswers | null = null;
    const f = params.get("f");
    if (f !== null) {
      const parts = f.split(".");
      if (parts.length !== 4) return { status: "invalid", reason: "Förderangaben unvollständig." };
      const [buildingAge, energyRenovation, ownerOccupied, hasIsfp] = parts;
      const v = validateFunding({ buildingAge, energyRenovation, ownerOccupied, hasIsfp });
      if (!v.ok) return { status: "invalid", reason: v.error.message };
      funding = v.value;
    }
    return { status: "ok", positions, funding };
  } catch {
    return { status: "invalid", reason: "Link nicht lesbar." };
  }
}
