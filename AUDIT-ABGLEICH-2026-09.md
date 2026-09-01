# Abgleich: Externer Repo-Audit (31.08.2026) ↔ Repo-Stand

**Erstellt:** 01.09.2026
**Geprüfter Repo-Stand:** `b5e6656` (= `origin/main`, Merge PR #63 am 01.09.2026 17:02 CEST)
**Audit-Stand:** `b9d2229` (31.08.2026)
**Grundlage:** `Rex_Website_Repo_Audit_20260831.md` (extern), abgeglichen gegen Quellcode, `llms*.txt`, `sitemap.xml`, Checklisten und Git-Historie.

---

## 0. Zwei Abweichungen gegenüber dem Audit — beide relevant für die Planung

### 0.1 Das Deploy-Fenster hat sich verschoben

Das Audit rechnete mit **PR #61** (30.08. 14:51 UTC) als letztem funktionalen Merge und leitete daraus das nächste Fenster am **01.09. ~16:51 CEST** ab.

Tatsächlich wurde **PR #63** am **01.09.2026 17:02 CEST** gemergt — mit sechs Client-Dateien, also funktional. Dieses Fenster ist damit verbraucht.

> **Nächstes reguläres Fenster: 03.09.2026 ab ca. 17:02 CEST.**

D37 (Rechts-/Faktenkorrektur) kann nicht heute deployt werden. Off-Site-Arbeit (D46) und Doku (D47/D48) laufen davon unberührt weiter.

### 0.2 D40 ist bereits erledigt — und zwar besser als gefordert

Das Audit listet fünf Seiten mit doppelt gepflegtem FAQ-Schema (B11/D40). PR #63 hat das abgeschlossen, bevor der Audit-Text ausgewertet wurde:

- `npm run faq:check` prüft **23 Seiten** automatisch — **0 Beanstandungen**, jedes `FAQPage.mainEntity` stammt nachweislich aus dem sichtbaren Text.
- Der Check ist als npm-Skript im Repo verankert (`scripts/faq-schema-check.mjs`), nicht nur einmalig ausgeführt.

**D40 entfällt aus der Roadmap.** Was von D40 übrig bleibt, ist das VELUX-Casing (siehe P3).

---

## 1. Bereits umgesetzt — kein Handlungsbedarf

| Audit-Punkt | Status im Repo | Beleg |
|---|---|---|
| **B11 / D40** FAQPage-Drift auf 5 Seiten | ✅ **erledigt** | `npm run faq:check`: 23/23 PASS, 0 Drift (PR #63) |
| **P1.1** Prerender-Routine | ✅ **erledigt + automatisiert** | `npm run prerender:check`, GitHub Action, Protokoll `PRERENDER-CHECK.md` §8/§9 |
| **E1.5** Meta stabil lassen | ✅ **erledigt** | 30/30 Titles ≤ 60, Descriptions ≤ 155 (GSC-Meta-1/2/3, PR #44/#52/#56) |
| **Interne Verlinkung Money-Pages** | ✅ **erledigt** | Paket 6 / PR #58 — keine Money-Page unter 3 eingehenden Links |
| **P2.2** Referenzen → Case-Studies | ✅ live (PR #25) | `References.tsx` |
| **P2.4** `areaServed` vereinheitlicht | ✅ live (PR #31–#33) | — |
| **Neue Route Dachreinigung** | ✅ gestrichen bleibt gestrichen | `DEPLOY-RULES.md` §6 |
| **JSON-LD-Syntax, Canonicals, Sitemap-200er** | ✅ sauber | Audit-Crawl 30/30 |

### Teilweise umgesetzt — Rest steht noch aus

| Audit-Punkt | Was schon passiert ist | Was noch fehlt |
|---|---|---|
| **B3** Absolute Förderzusage | PR #61/#63 haben „förderfähig" → „förderrelevant" an fünf Stellen ersetzt | `DachsanierungBochum.tsx:196` behauptet weiterhin **„wird vollständig mitgefördert"** und **„automatisch förderrelevant"**. Die Wortkorrektur hat die Absolutheit nicht beseitigt. |
| **B1** Solarpflicht-Bezugsgrößen | `Foerderung.tsx` (Z. 139, 530) und `Solarpflicht.tsx` (Z. 52, 82, 315–317) sind fachlich **korrekt**: Nettodachfläche als Bezug, Nutzfläche < 50 m² als Ausnahme | Fünf Dateien mit falscher/verkürzter Aussage (Details unter P1) |

---

## 2. To-do-Liste nach Priorität

Risikostufen und 48-h-Gate nach `DEPLOY-RULES.md`. **A** = Text/CSS/kleine UX, max. 12 Dateien · **B** = Schema/substanzielle Inhalte, max. 8 · **C** = neue Route, max. 5.

---

### P0 — sofort, ohne Deploy (läuft parallel zu allem)

#### P0.1 Externe NAP-Widersprüche korrigieren · *Audit D46 / B9 / P1.2*
**Hebel: Local SEO sehr hoch, KI-Entity-Auflösung sehr hoch. Kein Code, kein Gate.**

Das ist aktuell der größte einzelne Hebel — größer als jedes weitere On-Site-Schema.

1. **Das Telefonbuch, Paulinenstraße** — führt `0234 58 31 37` (die **Fax**nummer) als Haupttelefon. → auf `0234 583100` korrigieren.
2. **Das Telefonbuch, Friederikastraße** — alter Eintrag noch live. → löschen lassen.
3. **Dachdecker-Innung Bochum** — Firmenname „Rex Bedachung**en** GmbH" (falsch) und `58 31 26` als Fax ausgewiesen, obwohl das die **WhatsApp**-Nummer ist. → Name auf `Rex Bedachungs GmbH`, Faxangabe korrigieren, Website-Link bestätigen.
4. **Gelbe Seiten** — Kern-NAP korrekt, aber unkanonische HTTP-URL. → auf `https://www.rex-bedachung.de` umstellen.

> **Reihenfolge zwingend: erst Fehler korrigieren, dann neue Verzeichnisse anlegen.** Neue Citations auf inkonsistenter Datenbasis vervielfachen den Widerspruch.

#### P0.2 GBP vollständig belegen · *Audit C6 / G2*
`GBP-CHECKLIST.md` ist **zu 100 % offen** (kein einziger Punkt abgehakt). `CITATIONS.md`: 1× ✅ (ProvenExpert), 1× 🔄 (Innung), Rest offen.

Mindestumfang: Primärkategorie **Dachdecker**, nur real zutreffende Sekundärkategorien, Leistungen, Öffnungszeiten **inkl. Feiertagen**, echte Team-/Projektfotos, UTM-Website-Link, Bewertungsantworten.

> Der Plan muss künftig zwischen **„Dokument vorhanden"** und **„extern umgesetzt"** trennen. Aktuell belegt die Checkliste nur, dass sie existiert.

---

### P1 — Deploy 1 · Fenster **03.09.2026 ab 17:02 CEST** · Stufe B, 8 Dateien
#### „Rechts- und Faktenkorrektur" · *Audit D37*

**Ausschließlich Korrekturen. Keine Optimierungszugaben, keine neuen Zahlen, keine neuen Förderaussagen.**

| # | Datei | Fundstelle | Korrektur |
|---|---|---|---|
| 1 | `Impressum.tsx` | Z. 9, 20 | „§ 5 TMG" → **„§ 5 DDG"** (Meta-Description **und** H2) |
| 2 | `Impressum.tsx` | Z. 90–91 | „§ 7 Abs. 1 TMG", „§§ 8 bis 10 TMG" → DDG-Entsprechungen |
| 3 | `Impressum.tsx` | Z. 68–76 | EU-OS-Plattform ist seit **20.07.2025 abgeschaltet**. Abschnitt durch aktuellen, fachkundig freigegebenen Text ersetzen — **nicht nur den Link tauschen** |
| 4 | `DachPhotovoltaikBochum.tsx` | Z. 182, 298 | „Dacherneuerung ≥ 50 m²" / „ab 50 m² Dachfläche" → Bezug auf **Nettodachfläche (30 %)**, Ausnahme **Nutzfläche bis 50 m²** |
| 5 | `WannLohntSichDachsanierung.tsx` | Z. 109, 147 | „Wohngebäuden ab 50 m²" / „mindestens 50 m² Dachfläche" → dito |
| 6 | `DachsanierungBochum.tsx` | Z. 210 | „ab 50 m²" → dito |
| 7 | `DachsanierungBochum.tsx` | Z. 196 | **„wird vollständig mitgefördert" + „automatisch förderrelevant"** → „kann als notwendige Umfeldmaßnahme förderrelevant sein; verbindliche Prüfung im Einzelfall" |
| 8 | `Solarpflicht.tsx` | Z. 141 | Check gibt bei Bestandssanierung ab Stichtag direkt **„Pflicht"** aus, ohne Nutzfläche, Ausnahmetatbestände und Dach-Eignung abzufragen → Ergebnis auf **„Prüfung erforderlich"** umstellen |
| 9 | `llms.txt` | Z. 187, 274 | „≥ 50 m²" / „ab 50 m² geeigneter Dachfläche" → korrekte Bezugsgrößen |
| 10 | `llms-full.txt` | Z. 205 | „50 m² geeigneter Dachfläche" → dito |
| 11 | `sitemap.xml` | — | `lastmod` **nur** für die in PR #61 und #63 geänderten URLs nachziehen (Audit B10 — durch PR #63 sind sechs weitere Seiten betroffen) |

**Fachliche Grundlage:** SAN-VO NRW §§ 4 und 11. Die **30-%-Quote** bezieht sich bei Bestandsdächern auf die **Nettodachfläche**; die **50 m²** sind eine **Nutzflächen-Ausnahme des Gebäudes**. Beide Größen dürfen nicht vermischt werden.

**Offener Punkt, bewusst nicht in diesem Deploy:** Die Bußgeldangabe „bis 5.000 €" steht an vier Stellen (`Solarpflicht.tsx` Z. 34, 76, 83, 514) pauschal. Das Audit sagt, die SAN-VO staffelt nach Gebäudetyp. Die genauen Obergrenzen sind aus dem Repo nicht belegbar — **erst § 11 SAN-VO NRW prüfen, dann korrigieren.** Keine Zahl schätzen.

---

### P2 — Deploy 2 · ab **05.09.2026** · Stufe A, 4 Dateien
#### „Kontakt-Conversion stabilisieren" · *Audit D39*

> **Abweichung vom Audit — bewusst:** Das Audit ordnet D38 (Semantik/Schema) vor D39 ein. Ich drehe das um. D38 sind belegte, aber wirtschaftlich kleine Einzeldefekte. D39 betrifft die **wichtigste Leadroute** mit **CLS 0,922** und vier nicht verknüpften Formularfeldern. Wer zuerst repariert, wo Geld verloren geht, gewinnt zwei Tage.

| Datei | Problem | Maßnahme |
|---|---|---|
| `App.tsx` (Z. 96) | `<Suspense fallback={<div className="flex-1" />}>` — leerer Fallback ohne Höhenreservierung | Höhenstabilen Fallback einsetzen (Min-Height ≈ Viewport minus Header/Footer). **`lazy()` bleibt Pflicht** — die CLS-Lösung erfolgt über den Fallback, nicht über eager Imports |
| `Footer.tsx` (Z. 222–230) | Logo hat zwar `width/height`, aber `className="h-12 w-auto"` — die Box wird erst nach Bildladung final | Logo-Container explizit dimensionieren (feste Höhe + `aspect-ratio`) |
| `ContactForm.tsx` (Z. 20–66) | **0× `htmlFor`** im ganzen File. Vier sichtbare `<label>` ohne Verknüpfung; Inputs/Textarea ohne `id` | Je Feld `id` + passendes `htmlFor`: Name, E-Mail, Telefon, Nachricht |
| `Contact.tsx` (Z. 227–234) | Linktext „⭐ Jetzt auf Google bewerten" vs. `aria-label="Rex Bedachung auf Google bewerten"` — sichtbarer Text ist nicht im Label enthalten | `aria-label` so fassen, dass der sichtbare Text vollständig darin vorkommt (WCAG 2.5.3), oder `aria-label` entfernen |

**Pflicht nach dem Deploy:** `/kontakt` **dreimal** unter mobiler Drosselung messen. Zielwerte: CLS < 0,1, LCP < 2,5 s.

---

### P3 — Deploy 3 · ab **07.09.2026** · Stufe B, 4 Dateien
#### „Semantik, Entity-Schema, VELUX-Bezeichnung" · *Audit D38*

| Datei | Fundstelle | Maßnahme |
|---|---|---|
| `VeluxPreisrechner.tsx` | Z. 712 | Zweites `<h1>` „VELUX Dachfenster Preisrechner" → **`<h2>`**. Einzige Seite von 30 mit doppeltem H1. *(Das `<h1>` in Z. 152 steht im PDF-Template-String und ist davon nicht betroffen.)* |
| `OrganizationSchema.tsx` | Z. 25 | `"foundingYear": "1984"` → **`"foundingDate": "1984"`**. `foundingYear` ist bei Schema.org nicht definiert. Danach Rich Results Test gegen die Live-URL |
| `Home.tsx` | Z. 107 | Kartentitel „Dachfenster – VELUX & Roto **Fachbetrieb**" → **„Dachfenster – VELUX & Roto"**. „VELUX-Fachbetrieb" ist keine zulässige Bezeichnung; verbindlich ist „autorisierter VELUX-Partner" (steht im Beschreibungstext bereits korrekt) |
| `DachfensterBochum.tsx` | Z. 329 | „Ihr VELUX & Roto **Fachbetrieb** in Bochum" → gleiche Korrektur |
| *optional im selben Deploy* | 75 Treffer | VELUX-Casing: „Velux" statt „VELUX" in sichtbarem Text (`References.tsx` Z. 81, `DachfensterBochum.tsx` Z. 515–555). Route-/Komponentennamen bleiben unangetastet |

---

### P4 — Deploy 4 · ab **09.09.2026** · Stufe B, 3 Dateien
#### „Flachdach/Gründach entflechten" · *Audit D41 / G4*

Höchstes Kannibalisierungsrisiko im Repo. `FlachdachBochum.tsx` enthält **22 Gründach-Treffer** — inklusive H1 (Z. 303: „Flachdach **& Gründach** Bochum – Abdichtung, Sanierung **& Dachbegrünung**"), Intro, Angebotskatalog, eigenem Großabschnitt, FAQ, Regionalblock und Schema. Parallel existiert `/gruendach-dachbegrunung-bochum`.

- `/flachdach-bochum` führt: Abdichtung, Sanierung, Entwässerung, Dämmung, Wartung.
- Gründach bleibt dort **eine kurze Option mit Link** auf die Spezialseite.
- **Keine Seite löschen, keine zusammenführen.** Beide Routen bleiben.

---

### P5 — Deploy 5 · Stufe A, 2 Dateien
#### „llms.txt und llms-full.txt sauber trennen" · *Audit D43 / F*

Gemessen: `llms.txt` **19.476 Bytes / 290 Zeilen** — `llms-full.txt` **20.324 Bytes / 375 Zeilen**. Die Kurzfassung ist **96 % so lang** wie die Langfassung und verliert damit ihre Funktion als kuratierte Entitätsübersicht.

`llms.txt` soll nur enthalten: Unternehmensidentität, kanonische NAP-Daten, sechs Kernleistungen, die fünf wichtigsten URLs, verifizierte Entitätslinks, Aktualisierungsdatum, Link auf `llms-full.txt`.

**Zusätzlich — uneinheitliche Datenstände bereinigen:** Kopfzeile sagt „Stand: August 2026" (Z. 2), im Text steht dreimal „Stand: Juli 2026" (Z. 143, 160, 289).

---

### P6 — Deploy 6 · Stufe A · *Audit D42*
#### „Hero-Alt-Texte und mobile Bildauslieferung"

- Leere Alt-Texte prüfen: `VeluxAustausch.tsx:266`, `VeluxRolllaeden.tsx:180`, `DachPhotovoltaikBochum.tsx:163`. Hero-Bilder brauchen einen Alt-Text; rein dekorative bekommen `alt=""` **plus `aria-hidden="true"`**.
- Die drei Zustandsbilder der VELUX-Austausch-Animation: entweder konsequent dekorativ oder je ein **inhaltlich unterschiedlicher** Alt-Text. Keine identischen Keyword-Alts.
- Mobile Auslieferung verbessern bei: `flachdach-sanierung-bochum-rex-bedachung.webp`, `dachdecker-bochum-steildach-hero.webp`, `kamin-sanierung-bochum-dachdecker.webp`, `dach-hintergrund-rex-bedachung.webp`.
- **Keine Dateiumbenennung ohne Redirect** — und Redirects ausschließlich in `netlify.toml`.
- Bei >12 Dateien in zwei Batches teilen.

---

### P7 — Deploy 7 · Stufe B, max. 8 Dateien · *Audit D44 / C2*
#### „Quellen- und Prüfstandmodule auf datenreichen Seiten"

Pro Seite ein kurzer Block: **„Geprüft am: MM/JJJJ"**, 2–4 Primärquellen mit sprechendem Linktext, klare Trennung zwischen Gesetz / Förderprogramm / Herstellerwert / Rex-Erfahrungswert. Keine Garantieformulierungen.

Zuerst Primärquellenliste freigeben, dann **ein** Batch. Kandidaten: `Foerderung`, `Solarpflicht`, `DachsanierungBochum`, `DachPhotovoltaikBochum`, `GruendachBochum`, `VeluxAustausch`, `VeluxRolllaeden`.

Erfüllt gleichzeitig **P1.3** aus dem Umsetzungsplan (Redaktions-Review-Routine), der seit Monaten offen ist und dessen Lücke die Fehler unter P1 belegen.

---

### P8 — Deploy 8 · Stufe A, 4 Dateien · *Audit D45 / E1.3, E1.4*
#### „Interne Rollen stärken"

- `/leistungen` hat nur **drei** eingehende Quellen (`Home.tsx:301`, `About.tsx:267`, ein Breadcrumb in `DachfensterBochum.tsx`) — und **keinen Footer-Link**. Ein Link „Alle Leistungen" im Footer reicht.
- `/steildach-foerderung-bochum` wird aus `SteildachBochum`, `AufsparrendaemmungBochum` und `DachgaubeBochum` verlinkt — **nicht** aus `Foerderung.tsx`, `WannLohntSichDachsanierung.tsx`, `DachsanierungBochum.tsx`. Genau dort fehlt der Hub-zu-Detail-Anker.
- Kein globales Keyword-Link-Stuffing.

---

## 3. Parallelstränge ohne Deploy

### S1 — KI-Sichtbarkeit messbar machen · *Audit D47 / C4* — **Datei fehlt komplett**
`AI-VISIBILITY-MONITORING.md` existiert nicht. `UMSETZUNGSPLAN.md` P3.2 koppelt KI-Monitoring an YouTube und stellt beides zurück — **diese Kopplung auflösen.**

Quartalsweiser manueller Benchmark, 15–20 feste Fragen, dokumentiert mit Datum und Modus: Markenabfrage und NAP-Wiedergabe · „Dachdecker Bochum" · Leistungsfragen · Nennung/Verlinkung von Rex · zitierte Quell-URL · falsche Adressen/Telefonnummern/VELUX-Bezeichnungen. Vergleich ChatGPT / Perplexity / Gemini / Claude.

**Baseline vor P5 und P7 anlegen**, sonst ist deren Wirkung nicht zuzuordnen. YouTube bleibt zurückgestellt.

### S2 — Conversion-Messung · *Audit C5*
Im Client ist **kein** Ereignis-Tracking auffindbar (kein `gtag`, `dataLayer`, `plausible`). Reihenfolge: erst vorhandene Netlify-Form-Zahlen als Baseline erfassen → dann Datenschutz/Consent klären → dann **nur vier** Ereignisse messen (Telefon, WhatsApp, E-Mail, Formular). Kein Tracking-Skript vor der Consent-Prüfung.

### S3 — Dachreport-Datenbasis · *Audit D48 / P3.1*
`DACHREPORT-DATEN-2026.md` existiert nicht; nur das Konzept liegt vor. Erst 2–3 lokale Datenachsen mit Primärquelle, Erhebungszeitraum und reproduzierbarer Methodik (Gebäudebestand, PV-Zubau, Starkregen). **Kein Seitenbau ohne Daten** — ein Marketingartikel mit Bundeszahlen wäre kein Mehrwert. Danach D49 als eigener Stufe-C-Deploy.

### S4 — GSC-Messung · *Audit G3*
- Jetzt Export für die frühen Meta-Änderungen ziehen.
- Um den **25.09.2026** zweiten Export nach ≥ 4 Wochen für die späten Pakete.
- Je URL/Query Klicks, Impressionen, CTR, Position vor/nach vergleichen.
- Besonders: Dachrinne ↔ Dachwartung, Dachfenster ↔ VELUX-Austausch, Flachdach ↔ Gründach.
- **Bis dahin keine breite Title-/Description-Umschreibung.**

### S5 — Repo-Hygiene · *Audit D50 / C7 / E4* — getrennte PRs, nie mit einem SEO-Deploy vermischt
Gemessener Stand:

| Befund | Messung |
|---|---|
| Ungenutzte UI-Komponenten | **40 von 47** in `components/ui/` werden nirgends importiert; `ReferenceCard.tsx` ebenfalls |
| `attached_assets/` | **175 getrackte Dateien, 56 MB** — obwohl die Governance neue Commits dort ausschließt |
| `client/public/images` | **30 MB** |
| Redirect-Altlasten | `public/_redirects` (1.096 Bytes, im Vite-Build wirkungslos) **und** `netlify/public/_redirects` (0 Bytes) — beide widersprechen „Redirects ausschließlich über `netlify.toml`" |
| `VeluxPreisrechner.tsx` | beginnt mit `// @ts-nocheck` — ausgerechnet die rechenintensive Komponente umgeht die Typprüfung |
| Production-Dependencies | `npm audit --omit=dev`: **21 Advisories** (13 high, 6 moderate, 2 low) |

**Reihenfolge:** (1) beide `_redirects` entfernen — kleinster, klarster Schritt. (2) Ungenutzte UI-Komponenten in kleinen geprüften Batches. (3) `VeluxPreisrechner.tsx` **erst mit Tests für die Rechenlogik absichern**, dann `@ts-nocheck` abbauen — nicht gleichzeitig refactoren und Preis-/Förderlogik ändern. (4) Express-/DB-Boilerplate erst entfernen, wenn ein statischer Build-Branch **exakt dieselben** `dist/public`-Assets und Formfunktionen produziert. (5) `attached_assets/` **nicht** per Massenlöschung und **nicht** per History-Rewrite — zunächst weitere Aufnahme blockieren, Aufräumen im angekündigten Wartungsfenster.

---

## 4. Bewusst nicht anfassen

| Punkt | Begründung |
|---|---|
| **Soft-404** (B12) | SPA-Fallback liefert 200, NotFound setzt aber korrekt `noindex,nofollow`. Eine echte 404-Statuslösung griffe in die Hosting-/Prerender-Architektur ein. In GSC „Soft 404" beobachten, nur bei realen Fällen handeln |
| **robots.txt** | Crawl ist offen, alle relevanten KI-Bots explizit gelistet. Weitere User-Agent-Namen wären reines Signaling |
| **Meta-Offensive** | 30/30 eindeutig und in Länge. Vor neuer GSC-Baseline nichts umschreiben, sonst ist die August-Wirkung nicht mehr messbar |
| **Wikidata** | Erst mindestens eine unabhängige, substanziell beschreibende Quelle sichern. Handelsregister, eigene Website und einfache Verzeichnisse reichen nicht |
| **Stadtteilseiten, Kostenseiten, Gewerbeseite, Roto-Cluster** | `DEPLOY-RULES.md` §6 — bleibt gestrichen |
| **SearchAction- und on-site AggregateRating-Schema** | kein Nutzen bzw. nicht zulässig als Selbstauszeichnung |
| **Eager Imports für neue Routen** | `lazy()` bleibt Pflicht. CLS wird über den stabilen Fallback gelöst (P2) |
| **Eigenes SSR-/Puppeteer-System** | Netlify-Prerender funktioniert nachweislich. Doppelarchitektur erhöht nur das Deploy-Risiko |
| **Peter-Rex-Foto** | wartet auf echtes Asset. Kein Platzhalter, kein KI-Bild |

---

## 5. Deploy-Kalender

| Slot | Frühestens | Paket | Stufe | Dateien |
|---|---|---|:---:|---:|
| 1 | **03.09. 17:02 CEST** | P1 Rechts-/Faktenkorrektur | B | 8 |
| 2 | 05.09. | P2 Kontakt-Conversion | A | 4 |
| 3 | 07.09. | P3 Semantik/Schema/VELUX | B | 4 |
| 4 | 09.09. | P4 Flachdach/Gründach | B | 3 |
| 5 | 11.09. | P5 llms.txt trennen | A | 2 |
| 6 | 13.09. | P6 Alt-Texte/Bilder | A | ≤ 12 |
| 7 | 15.09. | P7 Quellenmodule | B | ≤ 8 |
| 8 | 17.09. | P8 interne Links | A | 4 |

Parallel und ohne Gate: **P0.1, P0.2, S1–S5.**

**Pflicht je funktionalem Deploy:** `npm run check` · `npm run build` · `npm run faq:check` · Diff der Sitemap-/Schema-Ausgabe · Preview-Crawl · mobiler Sichtcheck · Merge nur im geöffneten Fenster · danach IndexNow- und Prerender-Check.

---

## 6. Wovon dieser Abgleich nicht ausgeht

- **Kein GSC-, GBP- oder Netlify-Analytics-Zugriff.** Alle Leistungszahlen stammen aus dem im Repo dokumentierten Export bis 09.08.2026. Rankingbewegungen sind Messaufträge, keine belegten Effekte.
- **Die externen Verzeichniseinträge unter P0.1 sind Audit-Angaben.** Vor jeder Korrektur einmal selbst aufrufen und den Ist-Zustand festhalten.
- **`npm run check` und `npm run build` konnten in dieser Umgebung nicht validiert werden** — `node_modules` ist hier nicht installiert. Der Audit hat beides am 31.08. erfolgreich ausgeführt.
- **Die Bußgeldstaffelung der SAN-VO NRW ist nicht aus dem Repo belegbar.** Vor jeder Änderung § 11 SAN-VO im Original prüfen. Keine Zahl schätzen.
