/**
 * Zentrale Texte der VELUX-Kostenschätzung — einzige Quelle für UI, PDF,
 * Anfrage-Text und WebMCP-Antworten. Terminologie nach DEPLOY-RULES §6
 * („förderrelevant", „BEG-Anforderung", „Autorisierter VELUX-Partner").
 */

import { CATALOG } from "./catalog";

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
    "Positionen mit THERMO-Verglasung (Uw 1,3 W/m²K) sind nicht förderrelevant. Die BEG-Anforderung für Dachflächenfenster ist Uw ≤ 1,0 W/m²K – nur ENERGIE und ENERGIE PLUS erfüllen sie.",
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
