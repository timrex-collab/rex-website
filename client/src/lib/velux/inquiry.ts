/**
 * Anfrage-Inhalt des VELUX-Preisrechners – eine Fassung für Rechner und Server-Plugin (P4b).
 *
 * - `buildKonfigurationText` erzeugt das Formularfeld `konfiguration` genau so, wie der Rechner es
 *   bisher in `VeluxPreisrechner.tsx` gebaut hat (dorthin nur verschoben, Verhalten unverändert).
 * - `buildPluginInquiry` baut für das ChatGPT-Plugin den vollständigen Versandinhalt: alle
 *   Formularfelder, berechnet mit der zentralen Logik (`buildEstimate`), dazu die Rechenversion.
 *   Es rechnet nichts selbst und kennt keine eigenen Beträge.
 * - Prüfung der Kontaktdaten wie im Rechner (Name und E-Mail oder Telefon), nur mit Längengrenzen.
 */

import { BLINDS, CATALOG, DIMS, GL, SHUTTERS, fmt } from "./catalog";
import { fundingSummaryLines } from "./content";
import { buildEstimate, type PositionDetail, type QuoteTotals } from "./estimate";
import { RULES, type FundingAnswers, type FundingEvaluation } from "./funding";
import { CONTRACT_VERSION, validateEstimateInput } from "./validate";

/** Formularfeld `konfiguration` (Rechner und Plugin). */
export function buildKonfigurationText(details: PositionDetail[], totals: QuoteTotals, funding: FundingEvaluation, answers: FundingAnswers): string {
  return details.map((d, i) =>
    `Pos ${i + 1}: ${d.qty}× ${d.model} ${d.size} (${DIMS[d.size]} cm) ${GL[d.glazing].l}` +
    (d.shutterQty > 0 ? ` + ${d.shutterQty}× ${SHUTTERS[d.shutter as keyof typeof SHUTTERS].short}` : "") +
    (d.blindQty > 0 ? ` + ${d.blindQty}× ${BLINDS[d.blind as keyof typeof BLINDS].short}` : "") +
    ` → ab ${fmt(d.matPos + d.labPos)} € netto`
  ).join("\n") +
  `\n\nKostenschätzung netto: ab ${fmt(totals.totalNetto)} €` +
  `\nKostenschätzung brutto: ab ${fmt(totals.totalBrutto)} €` +
  `\n\n${fundingSummaryLines(funding, answers).join("\n")}`;
}

/** Katalog-, Regel- und Vertragsversion – ändert sich eine, passt eine alte summaryId nicht mehr. */
export function calculationVersion(): string {
  return `${CONTRACT_VERSION}/${CATALOG.revision}/${RULES.beg.rulesVersion}/${RULES.tax35c.rulesVersion}`;
}

export const INQUIRY_LIMITS = {
  name: { min: 2, max: 100 },
  email: 254,
  telefon: { min: 6, max: 40 },
  strasse: 120,
  plz: 10,
  ort: 80,
  nachricht: 2000,
  reading: 40,
} as const;

export const PHOTO_NOT_SENT = "Das Foto aus diesem Chat wird nicht an Rex übertragen.";
export const PHOTO_FOLLOW_UP = {
  email: "Sobald wir Ihnen per E-Mail geantwortet haben, können Sie das Typenschildfoto in Ihrer Antwort mitsenden.",
  phone: "Wie Sie uns das Foto nachreichen können, klären wir beim Rückruf.",
} as const;

export type WindowMatchStatus = "confirmed" | "assumed" | "none";
const MATCH_LABEL: Record<WindowMatchStatus, string> = { confirmed: "bestätigt", assumed: "vermutet", none: "keine Angabe" };

export interface InquiryContact { name: string; email: string; telefon: string; strasse: string; plz: string; ort: string }

export interface InquiryError { code: string; message: string; path?: string }
export type InquiryResult =
  | { ok: true; fields: Record<string, string>; summary: string; calcVersion: string; hasEmail: boolean }
  | { ok: false; error: InquiryError };

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const fail = (code: string, message: string, path?: string): InquiryResult => ({ ok: false, error: { code, message, ...(path ? { path } : {}) } });

function optText(raw: Record<string, unknown>, key: string, max: number, path: string): { ok: true; value: string } | { ok: false; result: InquiryResult } {
  const v = raw[key];
  if (v === undefined || v === null) return { ok: true, value: "" };
  if (typeof v !== "string") return { ok: false, result: fail("INVALID_INPUT", `${path} muss Text sein.`, path) };
  const t = v.trim();
  if (t.length > max) return { ok: false, result: fail("TOO_LONG", `${path} darf höchstens ${max} Zeichen haben.`, path) };
  return { ok: true, value: t };
}

/** Kontaktdaten wie im Rechner: Name (≥ 2 Zeichen) und E-Mail mit „@“ oder Telefon (≥ 6 Zeichen). */
export function validateContact(raw: unknown): { ok: true; value: InquiryContact } | { ok: false; result: InquiryResult } {
  if (!isRecord(raw)) return { ok: false, result: fail("INVALID_INPUT", "contact muss ein Objekt sein.", "contact") };
  const allowed = ["name", "email", "telefon", "strasse", "plz", "ort"];
  const extra = Object.keys(raw).find((k) => !allowed.includes(k));
  if (extra) return { ok: false, result: fail("UNKNOWN_FIELD", `Unbekanntes Feld contact.${extra}.`, `contact.${extra}`) };
  const out: Record<string, string> = {};
  const max: Record<string, number> = {
    name: INQUIRY_LIMITS.name.max, email: INQUIRY_LIMITS.email, telefon: INQUIRY_LIMITS.telefon.max,
    strasse: INQUIRY_LIMITS.strasse, plz: INQUIRY_LIMITS.plz, ort: INQUIRY_LIMITS.ort,
  };
  for (const k of allowed) {
    const r = optText(raw, k, max[k], `contact.${k}`);
    if (!r.ok) return r;
    out[k] = r.value;
  }
  if (out.name.length < INQUIRY_LIMITS.name.min) return { ok: false, result: fail("CONTACT_INVALID", "Bitte einen Namen angeben (mindestens 2 Zeichen).", "contact.name") };
  const hasEmail = out.email.includes("@");
  const hasPhone = out.telefon.length >= INQUIRY_LIMITS.telefon.min;
  if (!hasEmail && !hasPhone) return { ok: false, result: fail("CONTACT_INVALID", "Bitte eine E-Mail-Adresse oder eine Telefonnummer angeben.", "contact") };
  return { ok: true, value: out as unknown as InquiryContact };
}

export interface PluginInquiryOptions { testPrefix?: string }

/**
 * Baut den vollständigen Versandinhalt für eine Anfrage aus dem ChatGPT-Plugin.
 * Eingabe: { positions, funding, contact, message?, existingWindowNote?: { reading?, status } }.
 */
export function buildPluginInquiry(input: unknown, opts: PluginInquiryOptions = {}): InquiryResult {
  if (!isRecord(input)) return fail("INVALID_INPUT", "Eingabe muss ein Objekt sein.");
  const est = validateEstimateInput({ positions: input.positions, funding: input.funding });
  if (!est.ok) return { ok: false, error: est.error as InquiryError };

  const contact = validateContact(input.contact);
  if (!contact.ok) return contact.result;

  const msg = optText(input, "message", INQUIRY_LIMITS.nachricht, "message");
  if (!msg.ok) return msg.result;

  let status: WindowMatchStatus = "none";
  let reading = "";
  if (input.existingWindowNote !== undefined && input.existingWindowNote !== null) {
    const note = input.existingWindowNote;
    if (!isRecord(note)) return fail("INVALID_INPUT", "existingWindowNote muss ein Objekt sein.", "existingWindowNote");
    const extra = Object.keys(note).find((k) => k !== "reading" && k !== "status");
    if (extra) return fail("UNKNOWN_FIELD", `Unbekanntes Feld existingWindowNote.${extra}.`, `existingWindowNote.${extra}`);
    if (note.status !== "confirmed" && note.status !== "assumed" && note.status !== "none") {
      return fail("INVALID_ENUM", "existingWindowNote.status muss confirmed, assumed oder none sein.", "existingWindowNote.status");
    }
    status = note.status;
    const r = optText(note, "reading", INQUIRY_LIMITS.reading, "existingWindowNote.reading");
    if (!r.ok) return r.result;
    reading = r.value;
  }

  const { positions, funding: answers } = est.value;
  const { details, totals, funding } = buildEstimate(positions, answers);
  const calcVersion = calculationVersion();
  const c = contact.value;
  const prefix = opts.testPrefix ? `${opts.testPrefix} ` : "";

  const matchLine = status === "none"
    ? "Fensterzuordnung: keine Angabe"
    : `Fensterzuordnung: ${MATCH_LABEL[status]}${reading ? ` (Typenschild: ${reading}${status === "assumed" ? ", nicht bestätigt" : ""})` : ""}`;
  const quelle = [
    `${prefix}Aufmerksam geworden: KI-Assistent`,
    `Konfiguration: per ChatGPT-Plugin, auf dem Server neu berechnet (Rechenversion ${calcVersion})`,
    matchLine,
  ].join("\n");

  const fields: Record<string, string> = {
    "form-name": "velux-preisrechner",
    "bot-field": "",
    name: `${prefix}${c.name}`,
    email: c.email,
    telefon: c.telefon,
    strasse: c.strasse,
    plz: c.plz,
    ort: c.ort,
    nachricht: msg.value,
    konfiguration: buildKonfigurationText(details, totals, funding, answers),
    quelle,
  };

  const hasEmail = c.email.includes("@");
  const contactLines = [
    `Name: ${fields.name}`,
    c.email ? `E-Mail: ${c.email}` : null,
    c.telefon ? `Telefon: ${c.telefon}` : null,
    [c.strasse, [c.plz, c.ort].filter(Boolean).join(" ")].filter(Boolean).join(", ") || null,
  ].filter(Boolean);
  const summary = [
    "Zusammenfassung Ihrer Anfrage an Rex Bedachungs GmbH (unverbindliche Kostenschätzung):",
    "",
    fields.konfiguration,
    "",
    matchLine,
    "",
    "Kontaktdaten:",
    ...contactLines,
    msg.value ? `Nachricht: ${msg.value}` : "Nachricht: –",
    "",
    PHOTO_NOT_SENT,
  ].join("\n");

  return { ok: true, fields, summary, calcVersion, hasEmail };
}
