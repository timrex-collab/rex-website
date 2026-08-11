# GSC-Audit — Search Console × Repo-Abgleich (August 2026)

**Zweck:** Die Google-Search-Console-Daten der Property `https://www.rex-bedachung.de/`
gegen den tatsächlichen Repo-Stand halten und daraus einen priorisierten, deploy-fähigen
Backlog machen.

**Datenbasis:** GSC-CSV-Exporte vom 09.08.2026 (Zeitraum 10.02.–09.08.2026, Suchtyp Web)
· Repo-Stand `timrex-collab/rex-website` vom 11.08.2026.

> **Alle Zahlen stammen 1:1 aus den Exporten oder aus dem Repo. Nichts ist geschätzt.**
> Was nicht prüfbar war, steht in Abschnitt 7 ausdrücklich als offen.

**Governance gilt unverändert** (`DEPLOY-RULES.md`): 48-h-Gate zwischen funktionalen
Deploys · ein atomarer Commit pro Deploy · Stufen A (Text/CSS ≤ 12) / B (Schema/Content ≤ 8) /
C (Routen/gesperrte Configs ≤ 5) · `attached_assets/` nie committen · Merge nur durch Tim.

---

## 0. Basiswerte

| Zeitraum | Klicks | Impressionen | CTR | Ø Position |
|---|---:|---:|---:|---:|
| 6 Monate (10.02.–09.08.2026) | 578 | 37.000 | 1,6 % | 13,5 |
| Letzte 3 Monate | 348 | 25.795 | 1,3 % | 14,5 |
| Vorherige 3 Monate | 230 | 11.208 | 2,1 % | 11,3 |

880 Suchanfragen mit Daten · 33 Seiten mit Daten.

### Warum die CTR gefallen ist

Impressionen **+130 %**, Klicks nur **+51 %**. Das ist kein Absturz, sondern **Verdünnung**:
Die Site gewinnt massiv Sichtbarkeit für breite Informationssuchen (`dachreparatur`
+1.528 Impr., `solarpflicht nrw` +132) und für Streuverkehr weit außerhalb des
Einzugsgebiets — Soest 381 Impr., Erding 147, Rödinghausen 82, Rheinhessen ~235.
Diese Impressionen konvertieren nie und drücken CTR und Durchschnittsposition.

**Real Klicks verloren haben nur sechs Suchanfragen:**

| Suchanfrage | Klicks 3M | Klicks Vorper. | Δ | Pos. 3M | Pos. vorher |
|---|---:|---:|---:|---:|---:|
| dachdecker bochum | 6 | 12 | −6 | 11,2 | 14,5 |
| dachdecker in bochum | 0 | 2 | −2 | 11,3 | 10,1 |
| dachbegrünung bochum | 0 | 1 | −1 | 8,6 | — |
| rex bedachungen dorsten | 0 | 1 | −1 | 6,4 | 8,6 |
| dachdecker nrw | 0 | 1 | −1 | 33,5 | — |
| dachbegrünung nrw | 0 | 1 | −1 | — | — |

---

## 1. Kritischer Fund — falsche Förderzahlen live (behoben)

Nicht Teil des GSC-Auftrags, aber der wichtigste Fund des Abgleichs.

| Datei | Stelle | Problem |
|---|---|---|
| `FAQ.tsx` | Text + FAQPage-Schema | „Maximale Förderung: **12.000 €** pro Wohneinheit" — korrekt seit 21.07.2026: **10.500 €** |
| `FAQ.tsx` | Text + Schema | „mit iSFP: 20 % Zuschuss" ohne die 30.000-€-Schwelle |
| `DachsanierungBochum.tsx` | og, twitter, 3× Schema | „Bis zu 20 % BAFA-Förderung" |
| `BitumenVsPvc.tsx` | Preisfaktor, FAQ, Schema, Fördermodul | „bis zu 20 % BAFA-Zuschuss (mit iSFP)" |

Durch die iSFP-Deckelung (Nr. 8.4.2 der Richtlinie BEG EM vom 17.07.2026) greift der
5-Prozentpunkte-Bonus nur noch auf den Anteil über 30.000 €. Ein Effektivsatz von 20 %
ist damit **unter keinen Umständen mehr erreichbar** — das Maximum liegt bei 17,5 %
(15 % × 60.000 + 5 % × 30.000 = 10.500 € von 60.000 €). Beleg: `BEG-UPDATE-2026-07.md`.

BEG-1 (PR #35) und BEG-2 (PR #36) hatten diese Stellen übersehen; `FAQ.tsx` war in der
Dateiliste von BEG-1 gar nicht enthalten.

→ **Korrigiert als Deploy BEG-4, PR #44 Commit 1.** Protokoll in `DEPLOY-RULES.md` §10.

---

## 2. Stand der bestehenden SEO-Dokumente

| Dokument / Punkt | Status | Offen |
|---|---|---|
| `PRERENDER-CHECK.md` | Checkliste vollständig | **Protokoll §6 leer — nie durchgeführt** |
| `UMSETZUNGSPLAN.md` P1.1 Prerender-Routine | dokumentiert | Durchführung 🌐 |
| P1.2 NAP-Altlasten | Zielliste steht | offen 🌐 |
| P1.3 Redaktions-Review Förder-/Rechtsinfos | — | offen — hätte den 12.000-€-Fehler gefangen |
| P2.1 „Dachdeckerei Bochum" integrieren | — | ✅ erledigt in GSC-Meta-2 (`/leistungen`) |
| P2.2 Referenzen → Case-Studies | — | offen |
| P2.3 Zitierfähige Fach-FAQ | — | offen |
| P2.4 `areaServed` vereinheitlichen | — | offen, kosmetisch |
| P3.1 Dachreport Bochum | Konzept liegt vor | offen |
| `CITATIONS` / `GBP` / `BACKLINKS` / `WIKIDATA` | dokumentiert | externe Umsetzung 🌐 |

**Bewertung:** Die technische Basis ist überdurchschnittlich sauber. Was fehlt, ist fast
durchweg *Content*, nicht *Technik*.

---

## 3. Keywords Position 5–20 → Landingpage-Abdeckung

### 3.1 🔴 Lücke A — Dachreinigung: kein Content, nirgends

Die Terme **„Dachreinigung" und „Algenentfernung" kommen im gesamten Repo 0× vor** (verifiziert).

| Suchanfrage | Impr. | Pos. |
|---|---:|---:|
| dachreinigung bochum | 177 | 20,8 |
| dach reinigen bochum | 175 | 9,7 |
| professionelle dachreinigung bochum | 171 | 22,5 |
| algenentfernung dach bochum | 168 | 16,3 |
| dachreinigung firma bochum | 155 | 31,4 |
| dachreinigung in der nähe | 28 | 64,4 |
| **Cluster-Summe** | **892** | **21,7 · 0 Klicks** |

Google verteilt die Anfragen mangels passender Seite auf **8 unpassende URLs**:

| URL | Impr. | Pos. |
|---|---:|---:|
| `/` | 579 | 27,3 |
| `/dachwartung-bochum` | 541 | 23,2 |
| `/dachrinne-bochum` | 488 | 48,4 |
| `/gruendach-dachbegrunung-bochum` | 67 | 57,8 |
| `/leistungen/dachwartung` | 43 | 48,0 |
| `/flachdach-bochum` | 42 | 50,5 |
| `/dachreparatur-bochum` | 5 | 66,6 |
| `/dachsanierung-bochum` | 3 | 99,3 |

Dachreinigung steht **nicht** auf der Ausschlussliste in `DEPLOY-RULES.md` §6 — eine
eigene Serviceseite ist regelkonform (kein Stadtteil, keine Kosten-Seite, keine Gewerbeseite).

### 3.2 🟠 Lücke B — Dachrinnenreinigung: Kannibalisierung

`dachrinnenreinigung bochum` (304 Impr.) verteilt sich auf drei URLs:

| URL | Klicks | Impr. | Pos. |
|---|---:|---:|---:|
| `/dachrinne-bochum` | 1 | 218 | 17,8 |
| `/dachwartung-bochum` | 0 | 140 | 37,8 |
| `/` | 0 | 79 | 17,5 |

**Ursache im Code:** `DachwartungBochum.tsx` nennt „Dachrinnenreinigung" **7×**, die
eigentliche `DachrinnenBochum.tsx` nur **3×**. Die Wartungsseite ist stärker auf das
Keyword optimiert als die Zielseite.

Rundherum liegen weitere ~1.400 Impressionen praktisch ohne Klicks: `regenrinne reinigen
bochum` 185/8,9 · `dachrinnenreinigung firma bochum` 185/12,8 · `dachrinnenreinigung
preise bochum` 171/14,6 · `regenrinnenreinigung service bochum` 149/27,0 ·
`dachrinnenreinigung in der nähe` 135/22,0 · `wer repariert dachrinnen` 62/10,4.

### 3.3 Weitere Kannibalisierungs-Cluster (geprüft, unkritisch)

| Cluster | URLs | Befund |
|---|---:|---|
| `dachreparatur` (exakt) | 2 | `/dachreparatur-bochum` 1.567 Impr., `/` 18 — sauber |
| `dachdecker bochum` (exakt) | 5 | `/` dominiert mit 1.447 Impr.; Rest Streuung |
| `solarpflicht \| photovoltaik-pflicht \| pv pflicht` | 1 | **keine** Kannibalisierung |
| `gaube \| gauben` | 2 | `/dachgaube-bochum` 832 Impr., `/steildach-bochum` 8 |
| `förderung` | 5 | `/foerderung` 439 Impr., Rest marginal |
| `dachfenster austauschen in der nähe` | 2 | `/dachfenster-bochum` 148, `/velux-…-austausch` 22 |

### 3.4 Lokale Abdeckung

**Vorhanden:** Bochum (Kernvolumen) · NRW (Solarpflicht-Cluster) · Ruhrgebiet 93 Impr. ·
Dorsten ~180 · Wattenscheid/Langendreer 41.

**Nachbarstädte-Lücke:** Regex über herne|witten|dortmund|essen|gelsenkirchen|castrop|
hattingen|recklinghausen|herten|wanne|bergkamen|lünen|unna → **13 Suchanfragen,
92 Impressionen, 0 Klicks, Pos. 22,5**. Ohne jede Impression: Herne, Witten,
Castrop-Rauxel, Hattingen, Herten, Recklinghausen, Bergkamen, Lünen, Unna, Dortmund.

> Stadtteil- und Nachbarort-Landingpages sind per `DEPLOY-RULES.md` §6 **ausgeschlossen**.
> Der regelkonforme Weg ist P2.2 (Case-Studies mit echtem Ortsbezug).

**Streuverkehr ohne Handlungsbedarf:** Soest 381 Impr. (`gaube nachträglich einbauen soest`
226/9,8) · Rheinhessen ~235 · Erding 147 · Rödinghausen 82. Alle ~200 km entfernt, nicht
konvertierbar. `dachdecker res` (141/6,2) ist eine Tippfehler-Variante von „rex", also
faktisch branded.

### 3.5 Branded vs. non-branded

| Segment | Klicks | Impr. | CTR | Ø Pos. | Klick-Anteil |
|---|---:|---:|---:|---:|---:|
| Branded (enthält „rex") | 58 | 305 | 19,0 % | 7,1 | 10,0 % |
| Non-branded | 520 | 36.695 | 1,4 % | — | 90,0 % |

16 branded Suchanfragen. Spitzenreiter `rex bedachungen bochum` 46 Klicks / 92 Impr. /
50 % CTR / Pos. 1,0.

---

## 4. Seiten mit hohen Impressionen und schwacher CTR

| URL | Impr. | Klicks | CTR | Pos. | Befund |
|---|---:|---:|---:|---:|---|
| `/solarpflicht` | 11.583 | 66 | 0,57 % | 8,8 | **31 % aller Impressionen · kein FAQPage-Schema** |
| `/dachreparatur-bochum` | 3.881 | 10 | 0,26 % | 20,4 | Ranking-Problem, nicht Snippet-Problem |
| `/dachrinne-bochum` | 2.571 | 18 | 0,70 % | 21,3 | nur 4 interne Links |
| `/dachfenster-bochum` | 1.958 | 28 | 1,43 % | 14,6 | Description war 200 Zeichen |
| `/dachgaube-bochum` | 1.773 | 23 | 1,30 % | 16,0 | Genehmigungs-Intent fehlte im Title |
| `/foerderung` | 1.716 | 6 | 0,35 % | 16,0 | |
| `/dachwartung-bochum` | 1.621 | 2 | 0,12 % | 25,2 | **schlechteste CTR der Property** |
| `/flachdach-bochum` | 1.018 | 7 | 0,69 % | 25,7 | |
| `/gruendach-dachbegrunung-bochum` | 967 | 21 | 2,17 % | 18,0 | |
| `/leistungen` | 723 | 5 | 0,69 % | 16,3 | nur 5 interne Links |
| `/dachsanierung-bochum` | 625 | 3 | 0,48 % | 14,4 | Hub |
| `/steildach-bochum` | 600 | 2 | 0,33 % | 15,1 | |
| `/bauklempnerei-bochum` | 532 | 4 | 0,75 % | 33,4 | |

### Seiten auf Seite 1 mit **null** Klicks

| URL | Impr. | Pos. |
|---|---:|---:|
| `/sturmschaden-dach-bochum` | 296 | 19,0 |
| `/velux-preisrechner-bochum` | 249 | 11,1 |
| `/aufsparrendaemmung-bochum` | 115 | 10,6 |
| `/karriere` | 65 | 6,5 |
| `/steildach-foerderung-bochum` | 54 | 6,2 |
| `/wann-lohnt-sich-dachsanierung` | 49 | 7,1 |
| `/steildach-undicht-bochum` | 34 | 7,7 |

Hier ist das Ranking nicht das Problem — die Snippets sind es.

---

## 5. Technischer Befund

| Bereich | Ergebnis |
|---|---|
| Canonicals | ✅ 32/34; fehlen nur bei `Danke` + `not-found` (korrekt) |
| Sitemap ↔ Routen | ✅ exakt 30 = 33 Routen − 3 per robots.txt gesperrte |
| robots.txt | ✅ sauber, KI-Crawler-Allowlist breit |
| `/leistungen/dachwartung` | ✅ **kein Fehler** — 301 in `netlify.toml`; Google hält die Alt-URL nach (95 Impr., Pos. 38,2) |
| H1 | ✅ genau 1× pro Seite (8 Seiten über `Hero.tsx`) |
| Alt-Texte | ✅ 17/17 vorhanden · ⚠️ 6× identisch „Tondach Hero – professionelle Dachdeckung Bochum" |
| Schema-Abdeckung | ✅ 17× RoofingContractor, 30× BreadcrumbList, 22× FAQPage, 19× Article |
| **`/solarpflicht`** | 🔴 **kein FAQPage-Schema** trotz 22 vorhandener H2/H3-Abschnitte |
| Meta-Längen (vor GSC-Meta-1) | ⚠️ 17/34 Titles > 60 Zeichen (bis 83) · 16 Descriptions > 155 (bis 200) |
| Terminologie | ⚠️ „förderfähig" in 2 Descriptions — behoben in GSC-Meta-1 |

### Interne Verlinkung — unterverlinkte Money-Pages

GSC meldet 555 interne Links auf 26 Seiten. Gemessen am Impressionsvolumen sind
unterversorgt:

| URL | interne Links | Impr. | Pos. |
|---|---:|---:|---:|
| `/dachrinne-bochum` | 4 | 2.571 | 21,3 |
| `/dachgaube-bochum` | 5 | 1.773 | 16,0 |
| `/velux-dachfenster-austausch-bochum` | 2 | 845 | 9,0 |
| `/bitumen-vs-pvc-flachdach-bochum` | 2 | 191 | 8,4 |
| `/velux-dachfenster-rolllaeden-bochum` | 2 | 218 | 11,2 |
| `/steildach-undicht-bochum` | 2 | 34 | 7,7 |

---

## 6. Deploy-Backlog

Bei striktem 48-h-Gate rund zwei Wochen. Sortiert nach Aufwand-zu-Wirkung.

| # | Paket | Stufe | Dateien | Wirkung | Status |
|---|---|---|---:|---|---|
| 0 | **BEG-4** — falsche Förderzahlen korrigieren | B | 4 | beseitigt falsche Tatsachenbehauptung | 🔄 PR #44 |
| 1 | **GSC-Meta-1** — Meta-Offensive I, 10 Impressions-Riesen | A | 11 | **hoch** (~28.000 der 37.000 Impr.) | 🔄 PR #44 |
| 2 | **GSC-Meta-2** — Meta-Offensive II, 10 Seiten mit 0–wenig Klicks auf Seite 1; enthält P2.1 | A | ≤ 12 | hoch, geringer Aufwand | ⬜ |
| 3 | **FAQPage-Schema `/solarpflicht`** aus den 22 vorhandenen Abschnitten | B | 1–2 | **hoch** (31 % aller Impr.) | ⬜ |
| 4 | **Neue Route `/dachreinigung-bochum`** + interne Links + Sitemap | C | ≤ 5 | **hoch** (892 Impr., 0 Landingpage) | ⬜ |
| 5 | **Dachrinnenreinigung entflechten** — Content von `/dachwartung-bochum` nach `/dachrinne-bochum` | B | 2–3 | mittel–hoch | ⬜ |
| 6 | **Interne Verlinkung** der unterverlinkten Money-Pages | A | ≤ 8 | mittel | ⬜ |

**Bewusst nicht enthalten:** Stadtteil-Landingpages für Wattenscheid/Langendreer
(`DEPLOY-RULES.md` §6). Die 92 Impressionen der Nachbarstädte werden regelkonform über
P2.2 (Case-Studies mit Ortsbezug) abgedeckt.

---

## 7. Was nicht prüfbar war

Ausdrücklich offen — hier wurde nichts geraten:

- **Rezensions-Snippets.** Der Export „Darstellung in der Suche" zeigt 53 Klicks bei
  6.660 Impressionen (CTR 0,8 %, Pos. 14,38), der Verbesserungen-Report aber
  „0 gültig / 0 ungültig". Im Repo existiert **kein** `AggregateRating`- oder
  `Review`-Schema (§6 schließt AggregateRating on-site aus). Der Widerspruch ist aus
  CSV und Repo allein nicht auflösbar → GSC-Detailansicht nötig.
- **Bild-Metadaten: 3 Warnungen × 21 Elemente.** Die konkreten Warntexte stehen in
  keinem Export.
- **Indexierung: 29 indexiert / 11 nicht indexiert, 4 Ausschlussgründe.** Nur die Zahlen
  sind exportiert, nicht Gründe oder Beispiel-URLs.
- **Core Web Vitals.** GSC meldet „Nicht genügend Nutzungsdaten in den letzten 90 Tagen"
  für Mobil **und** Computer. Kein Handlungsbedarf ableitbar.
- **Prerender-Status live.** Nach `DEPLOY-RULES.md` §3 aus der Claude-Umgebung nicht
  prüfbar. Das Protokoll in `PRERENDER-CHECK.md` §6 ist leer — ein erster Lauf ist
  unabhängig von allem hier sinnvoll, weil geänderte Meta-Tags nur über die
  Prerender-Extension bei Google ankommen.
- **Interne-Link-Zähldifferenz.** GSC nennt 555 interne Links auf 26 Seiten; im Code hat
  jede der 30 indexierbaren Routen ≥ 2 Links. Zählweise nicht rekonstruierbar.

---

## Empfohlene Reihenfolge

1. **PR #44** mergen (BEG-4 + GSC-Meta-1) im regulären Fenster ab 12.08.2026 ~14:41 CEST.
2. **Prerender-Health-Check** nach `PRERENDER-CHECK.md` — kein Deploy nötig, schützt das Fundament.
3. **Paket 3** (FAQPage `/solarpflicht`) als nächster funktionaler Deploy — bestes
   Verhältnis von Aufwand zu betroffenem Impressionsvolumen.
4. **Paket 4** (`/dachreinigung-bochum`) als erster echter Content-Deploy.
5. Danach je 48 h Paket 5, 2, 6.
6. GSC nach ~4 Wochen erneut auswerten und die CTR-Entwicklung der 10 Seiten aus
   GSC-Meta-1 gegen diese Baseline halten.
