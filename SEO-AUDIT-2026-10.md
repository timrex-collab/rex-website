# SEO-Audit Oktober 2026 (claude-seo v2.4.2)

**Datum:** 14.10.2026 · **Geprüfter Stand:** `main` @ `dfd1c26` (PR #98) · **Werkzeug:**
[claude-seo](https://github.com/AgriciDaniel/claude-seo) v2.4.2 (MIT), ergänzt um Lighthouse 12.8.2

> **Reine Analyse, keine Codeänderung.** Dieses Dokument ist keine Deploy-Freigabe.
> Jede Umsetzung läuft wie gewohnt über DEPLOY-RULES (48-h-Gate, Stufen A/B/C, Merge durch Tim).

## 1. Methode und Grenzen

Die Live-Domain ist aus der Claude-Umgebung gesperrt (DEPLOY-RULES §3). Geprüft wurde deshalb
der Repo-Stand: Produktions-Build (`vite build`) lokal ausgeliefert, alle 33 Routen plus eine
404-Probe in Chromium gerendert und mit den Skill-Skripten ausgewertet (`parse_html.py`,
`content_quality.py`, `agentic_check.py`, Schema-Validator), dazu Lighthouse mobil mit
simuliertem Throttling auf fünf Kernseiten.

Daraus folgt:

- **Nicht geprüft:** HTTP-Header der Live-Site, Auslieferung durch den Netlify-Prerender,
  CrUX-Felddaten (GSC meldet ohnehin „nicht genügend Nutzungsdaten“), Rankings, Backlinks, GBP.
- **Lighthouse-Werte sind Labordaten gegen localhost.** Absolute Ladezeiten weichen vom Netlify-CDN
  ab. Belastbar sind Vergleiche und Ursachen (Layout-Shift, Bildgrößen), nicht die Sekunden.
- Hinweise des Skills, die den Projektregeln widersprechen, sind in §5 aufgeführt und **nicht**
  als Empfehlung übernommen.

## 2. Gesamtbewertung: 82 / 100

| Kategorie | Gewicht | Wert | Kurzbegründung |
|---|---:|---:|---|
| Technisches SEO | 22 % | 82 | Canonicals, Redirects, robots, Prerender sauber; `lastmod` fast überall veraltet |
| Content-Qualität | 23 % | 90 | Skill-Score 94–97 auf allen Seiten, keine Füllphrasen, starke E-E-A-T-Signale |
| On-Page | 20 % | 90 | Titles, Descriptions, H1 fehlerfrei; sechs schwach verlinkte Seiten |
| Schema | 10 % | 75 | Vollständig abgedeckt, aber eigene @graph-/@id-Konvention auf vielen Seiten nicht umgesetzt |
| Performance | 10 % | 55 | Startseite 92; Unterseiten 51–60 wegen eines systematischen Layout-Shifts |
| KI-Sichtbarkeit | 10 % | 88 | llms.txt besteht Lighthouse-Regeln, KI-Crawler erlaubt, WebMCP live |
| Bilder | 5 % | 70 | Fast alles WebP mit Alt-Text; `/referenzen` lädt 1,6 MB zu große Bilder |

Gewichtung nach Skill-Vorgabe. Die Einzelwerte sind eine begründete Einschätzung, keine Messgröße.

## 3. Was bereits sehr gut ist

- **On-Page lückenlos:** 33/33 Seiten mit eindeutigem Title (31–54 Zeichen), Description
  (120–155 Zeichen), genau einer H1 und selbstreferenzierendem Canonical. Keine Duplikate.
  `noindex` auf Datenschutz, Danke (Header) und 404 korrekt.
- **Keine defekten internen Links.** Sitemap und Routen sind deckungsgleich (30 Sitemap-URLs,
  dazu bewusst ausgenommen: `/danke`, `/datenschutz`, `/impressum`).
- **NAP konsistent:** Telefon und Adresse überall identisch, auch im Schema.
- **E-E-A-T:** Autor-Schema mit Meistertitel, ExpertenBlock, Referenzen, FAQ nach GEO-Standard.
- **KI-Readiness:** `llms.txt`/`llms-full.txt` bestehen die Lighthouse-Prüfung, robots.txt
  benennt GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot und Google-Extended ausdrücklich.
- **Verbotene Muster nicht vorhanden:** kein AggregateRating, kein SearchAction, kein
  „Notdienst“ im Schema, „zertifiziert“ nur an der erlaubten Stelle (`BitumenVsPvc`).
- **Mobil:** H1, Nutzenversprechen und CTA im ersten Bildschirm, Sticky-Leiste Anruf/WhatsApp.

## 4. Befunde nach Priorität

### HOCH

#### H1 · Layout-Shift (CLS 0,922) auf allen Unterseiten

- **Beleg:** Lighthouse mobil: CLS 0,922 auf `/flachdach-bochum`, `/dachreparatur-bochum`,
  `/velux-preisrechner-bochum`, `/referenzen` (Grenzwert „gut“: 0,1). Startseite: 0.
  Verursacher laut Lighthouse ist allein der `<footer>`.
- **Ursache:** `client/src/App.tsx:102` – der Suspense-Platzhalter `<div className="flex-1" />`
  ist leer. Beim Direktaufruf einer lazy geladenen Unterseite (der typische Einstieg aus Google)
  steht der Footer kurz unter der Navigation und wird dann um rund 11.000 px nach unten
  geschoben. Die Startseite wird nicht lazy geladen, deshalb dort kein Shift.
- **Fix (verifiziert):** Platzhalter auf `<div className="min-h-screen" />` ändern.
  In einer Testkopie gemessen:

  | Seite | CLS vorher → nachher | Performance vorher → nachher |
  |---|---|---|
  | `/flachdach-bochum` | 0,922 → 0,022 | 59 → 83 |
  | `/dachreparatur-bochum` | 0,922 → 0 | 60 → 84 |
  | `/referenzen` | 0,922 → 0 | 51 → 77 |

- **Stufe A, 1 Datei.** Die Lazy-Regel für neue Routen bleibt unberührt.

### MITTEL

#### M1 · Sitemap: `lastmod` auf 29 von 30 URLs älter als die letzte Seitenänderung

- **Beleg:** Jüngstes `lastmod` ist der 02.08.2026. Abgleich mit den Merges auf `main`, die die
  jeweilige Seitendatei geändert haben (Merge-Tag = Tag der Veröffentlichung): 29 von 30 Einträgen
  liegen davor, z. B. `/foerderung` 02.08. ↔ 12.10., `/dach-photovoltaik-bochum` 31.07. ↔ 12.10.,
  `/faq` 17.05. ↔ 25.09. Korrekt ist nur `/referenzen` (14.07., PR #25).
- **Korrektur 15.10.2026:** Die erste Fassung nannte 30 von 30. Grund war ein flacher Git-Klon,
  in dem PR #46 als ältester Commit bei jeder Datei auftauchte. Mit vollständiger Historie waren es
  zum Audit-Zeitpunkt 28 von 30 (`/referenzen` und `/kontakt` aktuell); durch PR #99 ist seit
  15.10.2026 auch `/kontakt` veraltet.
- **Warum relevant:** Google nutzt `lastmod` nur, solange es verlässlich ist. Durchgehend
  veraltete Werte entwerten das Signal, gerade nach den BEG-/Förder-Korrekturen.
- **Empfehlung:** `client/public/sitemap.xml` auf das Datum der letzten **inhaltlichen**
  Änderung je Seite setzen (nicht jeder Commit ist eine; Refactorings nicht mitzählen).
  Künftig bei jedem Content-Deploy mitziehen. **1 Datei.**

#### M2 · Schema: eigene @graph-/@id-Konvention auf vielen Seiten nicht umgesetzt

- **Beleg:** DEPLOY-RULES §7 verlangt einen `@graph` pro Datei mit `@id`-URIs.
  Umgesetzt ist das u. a. auf `/flachdach-bochum`. Dagegen:
  - **Doppelter `Service`-Knoten** auf `/dachreparatur-bochum`, `/dachwartung-bochum`,
    `/bauklempnerei-bochum`, `/gruendach-dachbegrunung-bochum`
    (z. B. `Dachreparatur.tsx:135` und `:190` – zwei Services mit abweichendem Namen und Text).
  - **Lose Blöcke ohne `@id`** (3–5 Seitenblöcke statt eines Graphen) auf 23 Seiten,
    u. a. alle VELUX-Seiten, `/sturmschaden-dach-bochum`, `/dach-photovoltaik-bochum`.
- **Empfehlung:** Pro Seite zu einem `@graph` mit `#webpage`, `#breadcrumb`, `#service`,
  `#faq`, `#article` zusammenführen, doppelte Services auflösen. `npm run faq:check` danach.
  **Stufe B, max. 8 Dateien je Deploy** → in drei Tranchen.

#### M3 · Article-Schema ohne Datumsangaben

- **Beleg:** 19 Article-Knoten; davon ohne `dateModified` 14, ohne `datePublished` 10,
  ohne `image` 15, ohne `mainEntityOfPage` 13.
- **Empfehlung:** Echte Veröffentlichungs- und Änderungsdaten ergänzen, `image` und
  `mainEntityOfPage` per `@id` verknüpfen. **Wichtig:** Kein Builddatum verwenden. Das wäre
  dieselbe Falle wie F09 beim ExpertenBlock. Sinnvoll gemeinsam mit M2.

#### M4 · Sechs Seiten mit schwacher interner Verlinkung

- **Beleg:** Alle übrigen Seiten erhalten über Navigation/Footer rund 31 interne Links.
  Nur 3–4 eingehende Links haben:
  `/leistungen`, `/velux-dachfenster-austausch-bochum`, `/velux-dachfenster-rolllaeden-bochum`,
  `/steildach-foerderung-bochum`, `/steildach-undicht-bochum`, `/bitumen-vs-pvc-flachdach-bochum`.
- **Empfehlung:** Vor allem `/velux-dachfenster-austausch-bochum` (Money-Page) und
  `/leistungen` (Übersicht) stärker anbinden, z. B. aus Footer-Leistungsliste, Dachfenster-Pillar
  und passenden FAQ-Antworten. Verlinkungsmatrix aus Rex-Standard v3.1 als Maßstab.

#### M5 · Zu geringer Farbkontrast bei CTA-Buttons

- **Beleg:** Weiße Schrift auf `#60a5fa` (Kontrast 2,54 : 1) und auf `#34d399` (1,92 : 1),
  etwa `button-foerderung-anfragen` auf Steildach/Flachdach/Dachfenster und
  `button-versicherung-anfragen` auf Dachreparatur. Im Preisrechner Hilfetexte mit 2,71 : 1.
  WCAG AA verlangt 4,5 : 1. 11 Fundstellen `bg-blue-400`/`bg-emerald-400` + `text-white`
  in 8 Seitendateien.
- **Warum relevant:** Kein direkter Rankingfaktor, aber Lesbarkeit genau an den
  Anfrage-Buttons. Betrifft Conversion und Barrierefreiheit.
- **Empfehlung:** Auf `-600`/`-700`-Töne wechseln. **Stufe A, 8 Dateien.**

#### M6 · Zu große Bilder auf `/referenzen`

- **Beleg:** Bilder mit 1.900–2.600 px Breite für ca. 400 px Anzeige. Lighthouse:
  ca. 1,6 MB vermeidbar, Seitengewicht 2,3 MB. Größter Einzelfall:
  `gruendach-extensiv-sedum-neubau-mehrfamilienhaus-bochum.webp` (690 KB).
- **Empfehlung:** Referenzbilder auf ca. 1.200 px Breite neu exportieren (Dateinamen
  beibehalten, dann keine Codeänderung). Optional `srcset` wie beim Hero-Bild.

#### M7 · LCP auf Unterseiten (Labor 4,2–4,4 s, `/referenzen` 6,9 s)

- **Beleg:** Das Hero-Bild wird erst nach dem Laden des Routen-Chunks entdeckt. Auf
  `/dachreparatur-bochum` und `/velux-preisrechner-bochum` ist der Hero ein CSS-
  `background-image`, also für den Preload-Scanner unsichtbar.
- **Empfehlung:** Hero-Bilder als `<img>` mit `fetchpriority="high"` ausgeben, wie auf der
  Startseite (dort LCP 2,9 s). Absolute Werte live prüfen (PageSpeed Insights), da localhost.

### NIEDRIG

| # | Befund | Empfehlung |
|---|---|---|
| N1 | ProvenExpert `richsnippet.js` wird auf jeder Seite nachgeladen (`client/index.html:91–101`), liefert laut `PRERENDER-CHECK.md:625` aber nur `<!-- error - wrong plan(1003)-->`. | Entfernen: toter Drittanbieter-Aufruf. Zugleich Schutz, falls ein Tarifwechsel das Widget aktiviert – es würde AggregateRating einfügen (Regelverstoß). **Erledigt durch PR #99** (live seit 15.10.2026; Rich-Snippet-Skript und ProSeal entfernt). |
| N2 | `robots.txt` sperrt `/datenschutz` und `/impressum`. Das `noindex` der Datenschutzseite kann Google deshalb nie lesen; das Impressum ist als Vertrauensseite für Crawler unsichtbar. | Wirkung gering. Kein eigener Stufe-C-Deploy; erst bei einer ohnehin nötigen robots-Änderung mit aufnehmen. |
| N3 | Unbekannte URLs liefern Status 200 (Catch-all `/* /index.html 200`), die 404-Seite setzt aber `noindex`. | Kein Handlungsbedarf. Ein echter 404 würde 33 explizite Rewrites in `netlify.toml` erfordern; Aufwand und Risiko stehen in keinem Verhältnis. |
| N4 | `HowTo`-Schema auf 5 Seiten (Skill meldet „deprecated“). | Gültiges Schema.org, Google zeigt seit 2023 nur keine Rich Results mehr. Kein Schaden; bei M2 mit entfernen oder stehen lassen. |
| N5 | Startseiten-H1 „rund um's Dach“ (`Home.tsx:193`). | Nach Duden „ums“ ohne Apostroph. Kleiner Textfix, Stufe A. |
| N6 | Mehrere Bilder ohne `width`/`height` (u. a. Photovoltaik, Dachfenster, Flachdach, Steildach). | Bei nächster Bearbeitung ergänzen; verhindert kleinere Layout-Shifts. |
| N7 | `netlify.toml` setzt außer für `/danke` keine Header (kein langes Caching für `/assets/*`, keine Sicherheits-Header). Live-Stand hier nicht prüfbar. | Live im Browser prüfen. Für die gehashten Dateien in `/assets/*` wäre `Cache-Control: public, max-age=31536000, immutable` ein sicherer Gewinn. |

## 5. Bewusst nicht übernommene Skill-Empfehlungen

| Skill-Hinweis | Warum nicht |
|---|---|
| „Inhalt ohne JavaScript fehlt“ (P0) – Server-Rendering einführen | SSR/eigener Prerender ausgeschlossen (DEPLOY-RULES §6). Live liefert der Netlify-Prerender an Crawler; der lokale Befund ist erwartbar. |
| `/.well-known/ai-catalog.json`, `api-catalog`, `agent-card.json` | Junge Spezifikationen ohne belegten Nutzen für einen lokalen Handwerksbetrieb. |
| Markdown-Auslieferung, `Content-Signal` in robots.txt | Kein bestätigter Abnehmer; Google wertet Content-Signal laut Skill selbst nicht aus. robots.txt ist zudem gesperrt. |
| Bewertungs-Markup / AggregateRating | On-site ausgeschlossen (DEPLOY-RULES §6). |

## 6. Vorschlag zur Reihenfolge

Ausgearbeitet mit Terminen, Dateilisten und Abnahmekriterien in
[`SEO-UMSETZUNGSPLAN-2026-10.html`](SEO-UMSETZUNGSPLAN-2026-10.html); die Pakete heißen dort
S1 bis S8, abgestimmt mit `UMSETZUNGSPLAN-2026-10-KI-ANFRAGEN.md`. Kurzfassung,
jeweils ein atomarer Deploy, 48-h-Gate und Merge durch Tim:

1. **H1 CLS-Fix** – 1 Datei, größter Effekt pro Zeile Code.
2. **M1 Sitemap-`lastmod`** – 1 Datei.
3. **M5 Kontrast + N5 H1-Text** – Stufe A, bis zu 9 Dateien.
4. **M6 Referenzbilder** – reine Bilddateien, gleiche Namen.
5. **M2/M3 Schema-Konsolidierung** – Stufe B in Tranchen à max. 8 Dateien.
6. **M4 Verlinkung, M7 LCP, N1** – nach Wirkungsmessung der ersten Schritte.

## 7. Für Tim im Browser zu prüfen

- PageSpeed Insights mobil für `/flachdach-bochum` vor und nach dem CLS-Fix (Nachweis Live-Effekt).
- Response-Header der Live-Site (HSTS, Cache-Control auf `/assets/*`).
- Ob der Prerender auch nutzergesteuerte KI-Abrufe bedient (`ChatGPT-User`, `Claude-User`,
  `Perplexity-User`) – analog zu den Bot-Checks in `PRERENDER-CHECK.md`.
