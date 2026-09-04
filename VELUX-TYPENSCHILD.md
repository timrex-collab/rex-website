# VELUX-Typenschild: Katalog und Resolver

**Stand:** 04.09.2026 · **Code:** `client/src/lib/velux/legacyCatalog.ts`, `client/src/lib/velux/resolve.ts` · **Tests:** `npm run estimate:check` (Abschnitte „Typenschild-Katalog" und „Resolver")

## Zweck

Kunden sollen ihr Bestandsfenster über das Typenschild angeben können — getippt, aus der KI des Kunden (WebMCP, PR-2a) oder später per Foto auf der Website (PR-P2). Der **Resolver** prüft solche Angaben deterministisch gegen einen **versionierten Katalog** und liefert einen klaren Status. Er enthält keine Preislogik, speichert nichts und verarbeitet **kein Bild und keinen OCR-Rohtext** — nur strukturierte Einzelwerte.

Bestandsfenster (`ResolvedExistingWindow`) und Zielkonfiguration (`ReplacementConfiguration`) sind getrennte Objekte: Das Typenschild liefert Fenstertyp und Größe als **Vorschlag**; Zielmodell, neue Verglasung und Zubehör werden immer ausdrücklich gewählt. **Eine alte Verglasung wird nie als neue übernommen, und eine alte Scheibenkennziffer begründet nie Förderfähigkeit.**

## Was auf dem Typenschild steht

Oben am Flügelrahmen, sichtbar bei geöffnetem Fenster. Beispiel: `GGL MK04 306621 03BF01N`

| Feld | Beispiel | Verwendung im Resolver |
|---|---|---|
| Fenstertyp | GGL | Katalog `WINDOW_TYPES` (unterstützt: GGU, GGL, GPU, GPL) |
| Größencode | MK04 | Katalog `LEGACY_SIZES` (aktuell / Alt-Generationen) |
| Ausführungskennziffer | 0070 | nur informativ, nie Zielverglasung |
| Produktions-/Seriencode | 306621 03BF01N | wird **ignoriert und nie zurückgegeben** (Datenminimierung) |

## Größencode-Generationen

| Generation | Format | Beispiel | Mapping |
|---|---|---|---|
| ab 2013 | zwei Buchstaben + zwei Ziffern | MK08 | `exact` (nur Codes aus `catalog.ts`) |
| 2001–2013 | ein Buchstabe + zwei Ziffern | M08 | `legacy_equivalent` → MK08 |
| 1991–2001 | drei Ziffern (1=C, 2=F, 3=M, 4=P, 6=S, 8=U) | 308 | `legacy_equivalent` → MK08 |
| vor 1991 | uneinheitlich | 047, Y47 | `legacy_equivalent` → MK08 (nur belegte Einzelfälle), sonst manuelle Prüfung |

Buchstabe = Breitenklasse (C 55 · F 66 · M 78 · P 94 · S 114 · U 134 cm), Ziffern = Höhenklasse (02 78 · 04 98 · 06 118 · 08 140 · 10 160 cm). Gültige K-Codes außerhalb des Preisrechners (z. B. CK01, MK12, PK25) gelten als `unsupported` → manuelle Prüfung.

## Status-Modell

| Status | Bedeutung | Nächster Schritt |
|---|---|---|
| `resolved` | Typ und Größe kataloggültig, eindeutig, ohne Alternativen, **Quelle: Nutzereingabe** | Zielkonfiguration wählen |
| `confirmation_required` | Alt-Code, Bild-Quelle oder alternative Lesarten | Kunde bestätigt/korrigiert den Kandidaten |
| `new_photo_required` | Bildquelle, Wert nicht lesbar | neues Foto oder manuelle Eingabe |
| `manual_review` | Alt-/Sondertyp, Sondergröße, Kombination nicht kalkulierbar | Anfrage möglich, Büro prüft |
| `unsupported_product` | Fremdhersteller, Rollladen-/Rollo-/Eindeckrahmen-/Flachdach-Typenschild | Hinweis, ggf. richtiges Schild |

Grundsätze: kein stilles historisches Mapping · Bildquellen enden nie bei `resolved` · Modell-Confidence ersetzt keine Bestätigung · pro Feld werden Wert, Alternativen, Katalogstatus, Unsicherheitsgrund und Bestätigungsbedarf zurückgegeben · typische OCR-Verwechslungen (0/O, 1/I, 5/S, 8/B) werden nur als **Kandidaten** angeboten.

## Verifikation durch den Betrieb (offen)

Alle Alt-Code-Einträge tragen `verification: "public_tables"` (Seed aus VELUX-Größenraster Dokument 7061 und Händlertabellen). Bevor ein Eintrag auf `"verified"` gesetzt wird, bitte gegen die VELUX-Größentabelle prüfen:

- [ ] Buchstabencodes 2001–2013 (C02 … U10 → CK02 … UK10)
- [ ] Dreistellige Codes 1991–2001 (102 … 810)
- [ ] Vor-1991-Einzelfälle 047 / Y47 → MK08; weitere belegte Codes ergänzen
- [ ] Liste der Alt-/Sondertypen (GHL/GHU → GPL/GPU, GZL → GGL, VL/VU/VE) und ihre Hinweise

Unabhängig von der Verifikation bleibt jeder Alt-Code bestätigungspflichtig. Bei Änderungen: `LEGACY_CATALOG_VERSION` hochzählen, Tests laufen lassen.

## Geplante Nutzung

- **PR-2a:** WebMCP-Tool `rex_velux_resolve_existing_window_v1` (read-only) ruft `resolveExistingWindow()` mit den von der Kunden-KI erkannten Einzelwerten auf.
- **PR-P2:** Website-Foto → Recognition-Function liefert Einzelwerte → derselbe Resolver → Bestätigungs-UX in Schritt 1 des Rechners.
