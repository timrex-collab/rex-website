/**
 * Versionierter Katalog für Typenschild-Codes: Fenstertypen und Größencodes
 * über die VELUX-Generationen hinweg.
 *
 * Grundsatz: Kein stilles Umschlüsseln. Ein Alt-Code wird nie automatisch als
 * aktuelles Fenster übernommen — der Resolver (resolve.ts) liefert dafür
 * höchstens `confirmation_required` mit dem Kandidaten. Einträge, die nur aus
 * öffentlichen Händlertabellen stammen, tragen `verification: "public_tables"`;
 * vom Betrieb gegen die VELUX-Größentabelle geprüfte Einträge tragen
 * `verification: "verified"`. Beides ändert nichts daran, dass Alt-Codes immer
 * bestätigt werden müssen.
 *
 * Quellen (Seed, Stand 04.09.2026): VELUX Größenraster (Dokument 7061),
 * Händlertabellen (lichtwunder, bunse-dachfenster, home4u, dach-shop24 zu
 * Y47/047). Systematik:
 *   ab 2013      zwei Buchstaben + zwei Ziffern  (MK08)   – „K"-Generation
 *   2001–2013    ein Buchstabe + zwei Ziffern    (M08)
 *   1991–2001    drei Ziffern                    (308): 1=C, 2=F, 3=M, 4=P, 6=S, 8=U
 *   vor 1991     uneinheitlich (z. B. 047, Y47 → MK08); sonst manuelle Prüfung
 * Buchstabe = Breitenklasse (C 55 · F 66 · M 78 · P 94 · S 114 · U 134 cm),
 * Ziffern = Höhenklasse (02 78 · 04 98 · 06 118 · 08 140 · 10 160 cm).
 */

import { SIZE_CODES, type ModelCode, type SizeCode } from "./catalog";

export const LEGACY_CATALOG_VERSION = "2026-09-04.1";

export type Generation = "pre_1991" | "1991_2001" | "2001_2013" | "2013_plus" | "unknown";
export type MappingStatus = "exact" | "legacy_equivalent" | "ambiguous" | "unsupported";
export type Verification = "verified" | "public_tables" | "unverified";

export interface LegacySizeEntry {
  observedCode: string;
  generation: Generation;
  legacySize: string | null;
  currentEquivalent: SizeCode;
  mapping: MappingStatus;
  verification: Verification;
  sourceRef: string;
}

const WIDTH_LETTER: Record<string, string> = { "1": "C", "2": "F", "3": "M", "4": "P", "6": "S", "8": "U" };

function buildSizeEntries(): LegacySizeEntry[] {
  const entries: LegacySizeEntry[] = [];
  for (const current of SIZE_CODES) {
    const letter = current[0];
    const height = current.slice(2);
    entries.push({ observedCode: current, generation: "2013_plus", legacySize: null, currentEquivalent: current, mapping: "exact", verification: "verified", sourceRef: "catalog.ts (Preisrechner)" });
    entries.push({ observedCode: `${letter}${height}`, generation: "2001_2013", legacySize: `${letter}${height}`, currentEquivalent: current, mapping: "legacy_equivalent", verification: "public_tables", sourceRef: "VELUX Größenraster / Händlertabellen: Buchstabencode ohne K (2001–2013)" });
    const digit = Object.entries(WIDTH_LETTER).find(([, l]) => l === letter)?.[0];
    if (digit) {
      entries.push({ observedCode: `${digit}${height}`, generation: "1991_2001", legacySize: `${digit}${height}`, currentEquivalent: current, mapping: "legacy_equivalent", verification: "public_tables", sourceRef: "Händlertabellen: dreistelliger Code (1991–2001), erste Ziffer = Breitenklasse" });
    }
  }
  // Vor 1991 belegte Einzelfälle
  for (const code of ["047", "Y47"]) {
    entries.push({ observedCode: code, generation: "pre_1991", legacySize: code, currentEquivalent: "MK08", mapping: "legacy_equivalent", verification: "public_tables", sourceRef: "VELUX Austauschfenster VU Y47 (ersetzt Größe 47 und 047) → 78×140" });
  }
  return entries;
}

export const LEGACY_SIZES: readonly LegacySizeEntry[] = buildSizeEntries();

export function findLegacySize(observedCode: string): LegacySizeEntry | undefined {
  return LEGACY_SIZES.find((e) => e.observedCode === observedCode);
}

/** Strukturell gültiger VELUX-Größencode der K-Generation, aber nicht im Preisrechner (z. B. CK01, MK12, PK25). */
export function looksLikeCurrentSizeCode(code: string): boolean {
  return /^[BCDFMPSUY]K\d{2}$/.test(code);
}

export type ProductCategory = "roof_window" | "flat_roof" | "roller_shutter" | "blind" | "flashing" | "other";

export interface WindowTypeEntry {
  code: string;
  category: ProductCategory;
  label: string;
  /** Im Preisrechner kalkulierbar (GGU/GGL/GPU/GPL). */
  supported: boolean;
  /** Bei Alt-/Sondertypen: Hinweis für die manuelle Prüfung. */
  note: string | null;
}

export const WINDOW_TYPES: readonly WindowTypeEntry[] = [
  { code: "GGU", category: "roof_window", label: "Kunststoff-Schwingfenster", supported: true, note: null },
  { code: "GGL", category: "roof_window", label: "Holz-Schwingfenster", supported: true, note: null },
  { code: "GPU", category: "roof_window", label: "Kunststoff-Klapp-Schwingfenster", supported: true, note: null },
  { code: "GPL", category: "roof_window", label: "Holz-Klapp-Schwingfenster", supported: true, note: null },
  { code: "GHL", category: "roof_window", label: "Klapp-Schwingfenster Holz (Altprogramm)", supported: false, note: "Vorgänger-Typ; Nachfolger in der Regel GPL – Einbausituation vor Ort prüfen." },
  { code: "GHU", category: "roof_window", label: "Klapp-Schwingfenster Kunststoff (Altprogramm)", supported: false, note: "Vorgänger-Typ; Nachfolger in der Regel GPU – Einbausituation vor Ort prüfen." },
  { code: "GTL", category: "roof_window", label: "Ausstiegsfenster Holz", supported: false, note: "Sonderfunktion (Ausstieg) – manuelle Prüfung." },
  { code: "GTU", category: "roof_window", label: "Ausstiegsfenster Kunststoff", supported: false, note: "Sonderfunktion (Ausstieg) – manuelle Prüfung." },
  { code: "GXL", category: "roof_window", label: "Ausstiegsfenster (Altprogramm)", supported: false, note: "Sonderfunktion (Ausstieg) – manuelle Prüfung." },
  { code: "GZL", category: "roof_window", label: "Schwingfenster Holz (Basisprogramm)", supported: false, note: "Nachfolger in der Regel GGL – vor Ort prüfen." },
  { code: "GDL", category: "roof_window", label: "Dachbalkon / Cabrio", supported: false, note: "Sonderprodukt – manuelle Prüfung." },
  { code: "VL", category: "roof_window", label: "Schwingfenster (vor 1991)", supported: false, note: "Altgeneration vor 1991 – Größe nur nach Aufmaß bestimmbar." },
  { code: "VU", category: "roof_window", label: "Austauschfenster für Altgeneration", supported: false, note: "Austauschprogramm für Fenster vor 1991 – manuelle Prüfung." },
  { code: "VE", category: "roof_window", label: "Zusatzelement / Altprogramm", supported: false, note: "Manuelle Prüfung." },
  { code: "VFE", category: "roof_window", label: "Zusatzelement unten", supported: false, note: "Zusatzelement, kein Einzelfenster – manuelle Prüfung." },
  { code: "GIL", category: "roof_window", label: "Zusatzelement unten Holz", supported: false, note: "Zusatzelement – manuelle Prüfung." },
  { code: "GIU", category: "roof_window", label: "Zusatzelement unten Kunststoff", supported: false, note: "Zusatzelement – manuelle Prüfung." },
  { code: "CVP", category: "flat_roof", label: "Flachdach-Fenster", supported: false, note: "Flachdachprodukt – nicht im Dachfenster-Preisrechner." },
  { code: "CFP", category: "flat_roof", label: "Flachdach-Fenster (fest)", supported: false, note: "Flachdachprodukt – nicht im Dachfenster-Preisrechner." },
  { code: "CXP", category: "flat_roof", label: "Flachdach-Ausstieg", supported: false, note: "Flachdachprodukt – nicht im Dachfenster-Preisrechner." },
  { code: "SSL", category: "roller_shutter", label: "Solar-Rollladen", supported: false, note: "Typenschild eines Rollladens, nicht des Fensters." },
  { code: "SML", category: "roller_shutter", label: "Elektro-Rollladen", supported: false, note: "Typenschild eines Rollladens, nicht des Fensters." },
  { code: "SSS", category: "roller_shutter", label: "Solar-Rollladen (Altprogramm)", supported: false, note: "Typenschild eines Rollladens, nicht des Fensters." },
  { code: "DKL", category: "blind", label: "Verdunkelungsrollo manuell", supported: false, note: "Typenschild eines Rollos, nicht des Fensters." },
  { code: "DSL", category: "blind", label: "Verdunkelungsrollo solar", supported: false, note: "Typenschild eines Rollos, nicht des Fensters." },
  { code: "RFL", category: "blind", label: "Sichtschutzrollo", supported: false, note: "Typenschild eines Rollos, nicht des Fensters." },
  { code: "MHL", category: "blind", label: "Hitzeschutz-Markise", supported: false, note: "Zubehör, nicht das Fenster." },
  { code: "EDW", category: "flashing", label: "Eindeckrahmen Ziegel", supported: false, note: "Eindeckrahmen, nicht das Fenster." },
  { code: "EDZ", category: "flashing", label: "Eindeckrahmen Ziegel (flach)", supported: false, note: "Eindeckrahmen, nicht das Fenster." },
  { code: "EDL", category: "flashing", label: "Eindeckrahmen Schiefer", supported: false, note: "Eindeckrahmen, nicht das Fenster." },
  { code: "EDS", category: "flashing", label: "Eindeckrahmen Schiefer/Schindel", supported: false, note: "Eindeckrahmen, nicht das Fenster." },
];

export function findWindowType(code: string): WindowTypeEntry | undefined {
  return WINDOW_TYPES.find((t) => t.code === code);
}

export function isSupportedModel(code: string): code is ModelCode {
  return findWindowType(code)?.supported === true;
}

/** Bekannte Fremdhersteller von Dachfenstern (Typenschild eindeutig nicht VELUX). */
export const OTHER_BRANDS: readonly string[] = ["ROTO", "FAKRO", "BRAAS", "DAKEA", "OKPOL", "KEYLITE", "SKYLUX"];
