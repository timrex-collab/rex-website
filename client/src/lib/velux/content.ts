/**
 * Zentrale Texte der VELUX-Kostenschätzung — einzige Quelle für UI, PDF,
 * Anfrage-Text und WebMCP-Antworten. Terminologie nach DEPLOY-RULES §6
 * („förderrelevant", „BEG-Anforderung", „Autorisierter VELUX-Partner").
 */

import { CATALOG, fmt } from "./catalog";
import { BEG, RULES, TAX35C, type FundingAnswers, type FundingEvaluation } from "./funding";

export const COMPANY = {
  name: "Rex Bedachungs GmbH",
  street: "Paulinenstraße 22",
  city: "44799 Bochum",
  phone: "0234 / 58 31 00",
  phoneHref: "tel:+49234583100",
  email: "info@rex-bedachung.de",
  web: "www.rex-bedachung.de",
  claim: "Dachdecker-Meisterbetrieb · autorisierter VELUX-Partner · Seit 1984",
} as const;

export const PAGE_URL = "https://www.rex-bedachung.de/velux-preisrechner-bochum";

/** Fachlicher Geltungsbereich der Förder-/Steuerberechnung. */
export const SCOPE_NOTE =
  "Berechnung für die erste Wohneinheit im Ein-/Zweifamilienhaus. §35c setzt Selbstnutzung voraus. Andere Gebäudefälle bitte persönlich klären.";

export const PRICE_BASIS_NOTE = `Materialpreise = ${CATALOG.name} (${CATALOG.pricesAre}, gültig ab ${CATALOG.validFrom}, Dokumentstand ${CATALOG.revision}); Einbaukosten sind Mindestpreise netto.`;

/** Quellen und Leistungsumfang: VELUX Katalog 03.09.2026; Rex Lohnpositionen. */
export const ASSUMPTIONS: readonly string[] = [
  "Eindeckrahmen EDW 2000 Ziegel h/W (inkl. BDX + BFX) je Fenster enthalten",
  "Standard-Einbautiefe angenommen; Eindeckung, Einbauhöhe und vorhandenes Innenfutter werden vor Ort geprüft – kein zugesicherter 1:1-Austausch",
  "Demontage des Altfensters einschließlich Entsorgung enthalten",
  "Einbaukosten sind Mindestpreise und hängen von Dachneigung, Zugang und Bestand ab",
  "Berechnung für die erste Wohneinheit; Selbstnutzung ist Voraussetzung nur für §35c",
];

/** Nicht im vorhandenen Rechenmodell enthaltene Leistungen. */
export const EXCLUSIONS: readonly string[] = [
  "Gerüst / Absturzsicherung",
  "Innenfutter / Innenausbau",
  "zusätzliche Dampfsperrschürze und individuelle Luftdichtheitsarbeiten",
  "SML-Steuereinheit KUX 110 bzw. passende 230-V-Integration; im Rollladenpreis nicht enthalten",
  "Elektroinstallation (z. B. für SML-Rollläden)",
  "Anfahrt, Dachzugang / Kran",
  "unvorhergesehene Arbeiten am Bestand",
];

export const DISCLAIMER =
  `Unverbindliche Kostenschätzung auf Basis der ${CATALOG.name}. Einzelpreise netto, Bruttobeträge inkl. 19 % MwSt. separat ausgewiesen. Einbaukosten sind Mindestpreise und variieren je nach baulichen Gegebenheiten. Fördermittel vorbehaltlich Bewilligung durch das BAFA bzw. Anerkennung durch das Finanzamt. Ihr persönliches Festangebot nach Vor-Ort-Begehung kann abweichen.`;

export const FUNDING_NOTES = {
  thermo:
    "Positionen mit THERMO-Verglasung (Uw 1,3 W/m²K) sind nicht förderrelevant. Die BEG-Anforderung für Dachflächenfenster ist Uw ≤ 1,0 W/m²K – im Rechner erfüllen sie die Verglasungen ENERGIE und ENERGIE PLUS.",
  kfw:
    "KfW-Ergänzungskredit 358/359: Nach BAFA-Zusage ist zusätzlich ein zinsvergünstigter Kredit bis 120.000 € pro Wohneinheit möglich.",
  fachplanung:
    "Fachplanung: 50 % Zuschuss für den Energieeffizienz-Experten auf förderrelevante Kosten bis 5.000 € bei EFH/ZFH (max. 2.500 €) – separater Fördertopf.",
  isfp:
    "Seit 21.07.2026 hebt der individuelle Sanierungsfahrplan (iSFP) die Obergrenze der förderrelevanten Kosten auf 60.000 € an; der Bonus von 5 Prozentpunkten greift nur auf den Kostenanteil über 30.000 €.",
  notCombinable:
    "BAFA-Zuschuss und Steuerermäßigung sind für dieselbe Maßnahme nicht kombinierbar – es kann nur eine der beiden Alternativen genutzt werden.",
  taxRequirements:
    "Voraussetzungen §35c EStG: selbstgenutztes Wohneigentum, Gebäude älter als 10 Jahre, Ausführung durch ein Fachunternehmen mit Bescheinigung, Rechnung und unbare Zahlung, ausreichende Einkommensteuer.",
  noRecommendation:
    "Welche Alternative wirtschaftlich besser ist, hängt von Ihrer Steuersituation und vom Antragsweg ab – wir zeigen beide Rechenwege ohne Empfehlung.",
  rounding: "Unverbindliche Rechenwerte auf volle Euro gerundet; einzeln gerundete Jahresbeträge können in Summe um 1 € vom Gesamtwert abweichen.",
} as const;

export const NEXT_STEPS: readonly string[] = [
  "Für ein verbindliches Festangebot Kontaktdaten eintragen und „Anfrage senden“ klicken – wir kommen zur Vor-Ort-Begehung.",
  `Oder direkt anrufen: ${COMPANY.phone}`,
];

// ── Förder-Labels und Förder-Check (eine Quelle für UI, PDF, Anfrage und WebMCP) ──

const pct = (r: number) => `${(r * 100).toLocaleString("de-DE", { maximumFractionDigits: 1 })} %`;

export const FUNDING_LABELS = {
  begCap: "Höchstgrenze erste Wohneinheit/Jahr",
  taxCap: "Höchstbetrag je Objekt",
  taxCapValue: `${fmt(TAX35C.maxBase * TAX35C.rate)} €`,
  taxYears: TAX35C.years.map((r, i) => `Jahr ${i + 1} (${pct(r)})`).join(" / "),
} as const;

/** Hinweise zu den Fragen des Förder-Checks (Wizard und WebMCP-Schema). */
export const FUNDING_QUESTION_HINTS = {
  buildingAge: "BEG: mindestens 5 Jahre seit Bauantrag/Bauanzeige. §35c: mehr als 10 Jahre seit Herstellungsbeginn.",
  energyRenovation: "Energetische Einzelmaßnahme an der Gebäudehülle (BEG EM)",
  ownerOccupied: "Voraussetzung für die Steuerermäßigung nach §35c EStG",
  hasIsfp: `Hebt die Obergrenze der förderrelevanten Kosten auf ${fmt(BEG.capWithIsfp)} €; +${pct(BEG.isfpBonusRate).replace(" %", "")} Prozentpunkte nur auf den Anteil über ${fmt(BEG.capWithoutIsfp)} €`,
} as const;

export const FUNDING_QUESTIONS: Record<keyof FundingAnswers, string> = {
  buildingAge: "Gebäudealter",
  energyRenovation: "Fenstertausch mit verbessertem Uw-Wert",
  ownerOccupied: "Selbstgenutztes Wohneigentum",
  hasIsfp: "iSFP vorhanden",
};

const ANSWER_LABELS: Record<string, string> = {
  under_5: "jünger als 5 Jahre", "5_to_10": "5 bis 10 Jahre", over_10: "älter als 10 Jahre",
  yes: "ja", no: "nein", unknown: "weiß ich nicht", "": "keine Angabe",
};

/** Lesbare Antworten des Förder-Checks, z. B. „Gebäudealter: älter als 10 Jahre“. */
export function fundingAnswerLines(a: FundingAnswers): string[] {
  return (Object.keys(FUNDING_QUESTIONS) as Array<keyof FundingAnswers>).map(
    (k) => `${FUNDING_QUESTIONS[k]}: ${ANSWER_LABELS[a[k]] ?? a[k]}`,
  );
}

/**
 * Förderteil für Anfrage-Formular und mailto-Ersatzweg: beide Alternativen mit
 * Betrag oder Grund, Antworten, Annahmen und Regelstand. Reiner Text, keine Rechnung.
 * Der mailto-Ersatzweg lässt die langen Annahmen weg (Längengrenzen der Mailprogramme).
 */
export function fundingSummaryLines(f: FundingEvaluation, a: FundingAnswers, opts: { withAssumptions?: boolean } = {}): string[] {
  const withAssumptions = opts.withAssumptions ?? true;
  const lines: string[] = ["Förderung (zwei Alternativen, nicht kombinierbar; Maximalwerte unter Annahmen):"];
  lines.push(f.beg
    ? `A) BEG EM (BAFA): bis zu ${fmt(f.beg.amountMax)} € (${f.beg.rateLabel}; förderrelevant brutto ${fmt(f.beg.eligibleCostsGross)} €)`
    : `A) BEG EM (BAFA): nicht ausgewiesen – ${f.begReason}`);
  lines.push(f.tax35c
    ? `B) §35c EStG: bis zu ${fmt(f.tax35c.totalMax)} € über drei Jahre (${fmt(f.tax35c.year1)} / ${fmt(f.tax35c.year2)} / ${fmt(f.tax35c.year3)} €)`
    : `B) §35c EStG: nicht ausgewiesen – ${f.tax35cReason}`);
  lines.push("Angaben im Förder-Check:", ...fundingAnswerLines(a).map((l) => `- ${l}`));
  if (withAssumptions && f.beg) lines.push(`Annahmen BEG: ${f.beg.assumptions.join("; ")}`);
  if (withAssumptions && f.tax35c) lines.push(`Annahmen §35c: ${f.tax35c.assumptions.join("; ")}`);
  if (!withAssumptions && (f.beg || f.tax35c)) lines.push("Annahmen und Voraussetzungen: siehe Preisrechner und Beratung.");
  lines.push(`Regelstand: ${RULES.beg.rulesVersion} / ${RULES.tax35c.rulesVersion}, geprüft ${RULES.beg.lastReviewedAt}`);
  return lines;
}
