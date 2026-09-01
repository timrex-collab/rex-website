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
| `PRERENDER-CHECK.md` | Checkliste vollständig | Stufe 1 protokolliert (11.08. + 18.08.) · **Stufe 2 nie durchgeführt** 🌐 |
| `UMSETZUNGSPLAN.md` P1.1 Prerender-Routine | dokumentiert | Durchführung Stufe 2 🌐 |
| P1.2 NAP-Altlasten | Zielliste steht | offen 🌐 |
| P1.3 Redaktions-Review Förder-/Rechtsinfos | — | offen — hätte den 12.000-€-Fehler gefangen |
| P2.1 „Dachdeckerei Bochum" integrieren | — | ✅ live (PR #28, 20.07.2026 — `Home.tsx` + `Services.tsx`) |
| P2.2 Referenzen → Case-Studies | — | ✅ live (PR #25, 14.07.2026 — `References.tsx`) |
| P2.3 Zitierfähige Fach-FAQ | — | ✅ live (PR #25/#26, 14.–16.07.2026 — Flachdach, Steildach, Sturmschaden) |
| P2.4 `areaServed` vereinheitlichen | — | ✅ live (PR #31–#33, 23.–28.07.2026 — 24 Stellen in 20 Dateien) |
| P3.1 Dachreport Bochum | Konzept liegt vor | offen |
| `CITATIONS` / `GBP` / `BACKLINKS` / `WIKIDATA` | dokumentiert | externe Umsetzung 🌐 |

> **Korrektur (18.08.2026):** Die ursprüngliche Fassung dieser Tabelle war an fünf Stellen
> falsch. P2.1 wurde nicht in GSC-Meta-2 erledigt (das Paket ist bis heute nicht deployt),
> sondern in **PR #28 am 20.07.2026** — betroffen waren `Home.tsx` und `Services.tsx`, nicht
> `/leistungen` allein. P2.2, P2.3 und P2.4 standen als „offen", waren zum Zeitpunkt des
> Audits aber bereits live. Ursache: `DEPLOY-RULES.md` §10 war zwischen PR #18 und PR #47
> nicht mitgeführt worden, und das Audit hatte sich auf diese Tabelle gestützt statt auf die
> Merge-Historie. Das Deploy-Log ist seit dem 18.08.2026 vollständig rekonstruiert.

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

> ### ⛔ Korrektur 18.08.2026 — die Schlussfolgerung war falsch
>
> Die urspruengliche Fassung schloss hier: „Dachreinigung steht nicht auf der Ausschlussliste
> in `DEPLOY-RULES.md` §6 — eine eigene Serviceseite ist regelkonform." Das war eine reine
> Regelpruefung ohne Ruecksprache. **Rex Bedachung bietet Dachflaechenreinigung und
> Algenentfernung nicht an** (festgelegt von Tim Rex am 18.08.2026, jetzt als
> Leistungsabgrenzung in `DEPLOY-RULES.md` §6 verbindlich hinterlegt).
>
> Eine Landingpage haette also eine Leistung beworben, die es nicht gibt: falsche
> Kundenerwartung, Anfragen die abgesagt werden muessen, und ein Ranking, das dem Ruf mehr
> schadet als es einbringt. Die 892 Impressionen sind **nicht bedienbar** — kein
> Snippet-Problem, kein Ranking-Problem, sondern schlicht die falsche Zielgruppe.
>
> **Angeboten wird:** Dachrinnenreinigung (Rinnen, Fallrohre, Ablaeufe) sowie
> Flachdachreinigung (Gullys/Einlaeufe, Rand- und Eckbereiche) im Rahmen der Wartung.
> Genau darauf zielt der Ersatz fuer Paket 4 unten.
>
> **Merke fuer kuenftige Audits:** Bevor eine Keyword-Luecke zu einem Paket wird, gehoert
> die Frage „bieten wir das ueberhaupt an?" vor die Frage „ist das regelkonform?".

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

> **Nachmessung 18.08.2026:** Das Verhältnis steht jetzt bei **7× zu 1×**. GSC-Meta-1 hat
> die Description von `DachrinnenBochum.tsx` neu gefasst und dabei zwei der drei Nennungen
> entfernt. Die Lücke ist also größer geworden, nicht kleiner — Paket 5 gewinnt an Priorität.

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
| 0 | **BEG-4** — falsche Förderzahlen korrigieren | B | 4 | beseitigt falsche Tatsachenbehauptung | ✅ live (PR #44, 11.08.) |
| 1 | **GSC-Meta-1** — Meta-Offensive I, 10 Impressions-Riesen | A | 11 | **hoch** (~28.000 der 37.000 Impr.) | ✅ live (PR #44, 11.08.) |
| 3 | **FAQPage-Schema `/solarpflicht`** aus den vorhandenen Abschnitten | B | 1 | **hoch** (31 % aller Impr.) | ✅ live (PR #47, 16.08. — als GSC-Schema-1) |
| 2 | **GSC-Meta-2** — Meta-Offensive II, 10 Seiten mit 0–wenig Klicks auf Seite 1 | A | 11 | hoch, geringer Aufwand | ✅ live (PR #55, 24.08.) |
| 2b | **GSC-Meta-3** — die letzten 5 Seiten mit Meta-Überlängen; danach liegt keine Seite mehr über 60/155 | A | 5 | mittel | ✅ live (PR #56, 28.08. — repoweit 0 Überlängen, nachgemessen auf `db0dbdf`) |
| 4 | ~~Neue Route `/dachreinigung-bochum`~~ | — | — | — | ❌ **gestrichen 18.08.2026** — Leistung wird nicht angeboten |
| 4a | **Flachdachreinigung im Wartungsumfang sichtbar machen** — Gullys/Einlaeufe, Rand- und Eckbereiche auf `/dachwartung-bochum` und `/flachdach-bochum`; dazu eine ehrliche Abgrenzungs-FAQ („Bieten Sie Dachreinigung/Algenentfernung an?" → nein, wir reinigen Dachrinnen und Flachdach-Entwaesserung im Rahmen der Wartung) | B | 2–3 | mittel — deckt eine real angebotene Leistung ab, die auf der Site **0×** vorkommt | ✅ live (PR #49, 20.08. — Gullys/Einläufe, Rand- und Eckbereiche, Abgrenzungs-FAQ) |
| 5 | **Dachrinnenreinigung entflechten** — Content von `/dachwartung-bochum` nach `/dachrinne-bochum` | B | 2 | mittel–hoch | ✅ live (PR #52, 22.08. — Verhältnis 7:1 → 2:11) |
| 6 | **Interne Verlinkung** der unterverlinkten Money-Pages | A | 10 | mittel | ✅ live (PR #58, 26.08. — zehn Money-Pages, keine mehr unter 3 Links) |

> **Stand 18.08.2026 (nachgemessen, nicht geschätzt):** Pakete 0, 1 und 3 sind live.
> Der Hinweis „enthält P2.1" bei Paket 2 ist gestrichen — P2.1 war bereits seit PR #28
> (20.07.2026) live und gehörte nie in dieses Paket. Für die vier offenen Pakete gilt
> weiterhin die Reihenfolge unten. Verifiziert am Repo-Stand `aecb53c`:
> „Dachreinigung"/„Algenentfernung" kommen unverändert **0×** im gesamten Repo vor;
> „Dachrinnenreinigung" steht 7× auf `/dachwartung-bochum` gegen 1× auf `/dachrinne-bochum`;
> die sechs unterverlinkten Money-Pages haben weiterhin nur 2–5 eingehende interne Links.

> **Nachtrag 18.08.2026 — Paket 4 gestrichen, 4a tritt an seine Stelle.** Gemessen am
> Repo-Stand `aecb53c` kommen **„Flachdachreinigung", „Gully", „Einlauf", „Randbereich"
> und „Eckbereich" allesamt 0× vor** — die Leistung, die tatsaechlich erbracht wird, steht
> nirgends auf der Website. `/dachwartung-bochum` hat zwar eine Karte „Dachrinnen &
> Ablaeufe reinigen", benennt die Flachdach-Entwaesserung aber nicht. Das ist die echte
> Luecke: kein 892-Impressionen-Hebel, aber ehrlich, belegbar und fuer Hausverwaltungen
> (der erklaerte Wartungs-Schwerpunkt) unmittelbar relevant.

> **Nachtrag 28.08.2026 — Backlog vollständig abgearbeitet.** Mit PR #56 (GSC-Meta-3,
> gemergt 28.08. 14:49 UTC) ist die letzte offene Position dieses Abschnitts live. Alle
> Pakete sind erledigt oder bewusst gestrichen (Paket 4). Offen aus dem Audit bleibt nur
> noch die **Schema- und Terminologie-Hygiene** aus Abschnitt 8 — nächstes Fenster ab
> **30.08.2026 ~14:49 UTC**.
> **Gegenprobe auf `db0dbdf`:** über alle 35 Titles und 34 Descriptions im Repo liegt keine
> über 60 bzw. 155 Zeichen; die fünf geänderten Seiten treffen die Zahlen aus PR #56 exakt
> (T46/D148 · T47/D151 · T48/D144 · T49/D147 · T49/D149).
>
> **Nachtrag 26.08.2026 — Paket 6 live.** Mit PR #58 war das vorletzte offene Paket dieses
> Abschnitts gemergt.
>
> **Korrektur an der Messung in Abschnitt 5.** Die Link-Zahlen der Tabelle oben
> („Interne Verlinkung — unterverlinkte Money-Pages") stammen aus GSC und aus einer ersten
> Repo-Messung, die nur das Attribut `href="/x"` gesucht hat. Links aus Objekt-Literalen
> (`href: "/x"`, `link: "/x"`) — eine der Formen, in denen die Linkkarten geschrieben sind —
> fehlten darin. Neu gemessen mit einem Muster, das beide Schreibweisen **inklusive
> Leerzeichen nach dem Doppelpunkt** erfasst, lagen `/dachrinne-bochum` und
> `/dachgaube-bochum` bei **2** statt bei 4 bzw. 5 eingehenden Links,
> `/velux-preisrechner-bochum` dagegen bei 3 und damit gar nicht im Rückstand. Die Tabelle
> in Abschnitt 5 bleibt als Audit-Momentaufnahme stehen; maßgeblich ist die korrigierte
> Messung in PR #58.
>
> **Gegenprobe nach dem Merge (Repo-Stand `b461b18`):** alle zehn Zielrouten erreichen
> exakt die in PR #58 angegebenen Werte (5 · 5 · 4 · 3 · 4 · 3 · 4 · 4 · 3 · 4), und über
> alle 32 Routen liegt **keine Service- oder Money-Page** mehr unter drei kontextuellen
> Links (Footer und Navigation nicht mitgezählt).
>
> **Randbefund derselben Messung:** Unter drei Links liegen nur noch Seiten ohne
> Ranking-Ziel — `/danke` (noindex), `/impressum` (per `robots.txt` gesperrt),
> `/datenschutz`, `/karriere`, `/faq` (2) und `/lexikon` (1: nur aus `FAQ.tsx`, dazu der
> Footer). `/ueber-uns` sieht mit 1 ebenfalls dünn aus, wird aber über den `ExpertenBlock`
> von 13 Seiten verlinkt — die Messung zählt Komponenten einmal, nicht je Einbindung.
> `/lexikon` ist damit die einzige inhaltlich relevante Restlücke; kein Deploy-Anlass für
> sich, aber ein Kandidat für das nächste Content-Paket.

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
- ~~**Prerender-Status live.**~~ **✅ ERLEDIGT am 24.08.2026 — Stufe 2 bestanden.**
  Tim hat alle sechs Kern-URLs gegen die rohe Server-Antwort mit Googlebot-User-Agent
  geprüft: alle vier Kriterien erfüllt, alle Soll-Titles exakt. Protokoll in
  `PRERENDER-CHECK.md` §8. Damit ist belegt, dass der Ertrag der fünf daran hängenden
  Deploys bei Crawlern ankommen kann — am deutlichsten daran, dass `/steildach-bochum`
  bereits den erst Stunden zuvor deployten GSC-Meta-2-Title ausliefert.
  Verbleibender Restzweifel: ob Google auch so *indexiert*, zeigt nur ein GSC-Live-Test.
- **Interne-Link-Zähldifferenz.** GSC nennt 555 interne Links auf 26 Seiten; im Code hat
  jede der 30 indexierbaren Routen ≥ 2 Links. Zählweise nicht rekonstruierbar.

---

## Empfohlene Reihenfolge

*(aktualisiert 18.08.2026 — erledigte Schritte gestrichen)*

1. ~~PR #44 mergen (BEG-4 + GSC-Meta-1)~~ ✅ 11.08.2026 · ~~Paket 3 (FAQPage `/solarpflicht`)~~ ✅ 16.08.2026.
2. ~~Prerender-Check Stufe 2~~ ✅ 24.08.2026 bestanden.
3. ~~Paket 5 (Dachrinnenreinigung entflechten)~~ ✅ 22.08.2026 · ~~Paket 4a
   (Flachdachreinigung im Wartungsumfang)~~ ✅ 20.08.2026.
4. ~~Paket 2 (GSC-Meta-2)~~ ✅ 24.08.2026 · ~~Paket 6 (interne Verlinkung)~~ ✅ 26.08.2026
   (PR #58) · ~~GSC-Meta-3~~ ✅ 28.08.2026 (PR #56). Offen bleibt nur noch die **Schema- und
   Terminologie-Hygiene** aus Abschnitt 8 — Fenster ab **30.08.2026 ~14:49 UTC**.
5. GSC ab ~08.09.2026 (4 Wochen nach GSC-Meta-1) erneut auswerten und die CTR-Entwicklung
   der 10 Seiten aus GSC-Meta-1 gegen die Baseline in Abschnitt 4 halten.

---

## 8. Funde aus der Verifikation vom 22.08.2026

Bei der Kontrolle nach Paket 5 habe ich das Repo einmal vollständig auf die
`FAQPage`-Konvention aus `DEPLOY-RULES.md` §7 und auf die Terminologie-Regel aus §6
geprüft. Zwei Befunde, beide gemessen, keiner davon dringend.

### 8.1 `FAQ.tsx` — 14 Schema-Antworten, **keine einzige** deckungsgleich mit der Seite

`FAQ.tsx` ist die letzte Seite mit hartcodiertem `FAQPage`-Schema. Sie zeigt 48 Fragen an
und markiert 14 davon im Schema — eine Auswahl zu treffen ist bei einer Hub-FAQ völlig
richtig. Das Problem ist der Zustand dieser Auswahl:

| Prüfung | Ergebnis |
|---|---|
| Schema-Einträge | 14 |
| Antwort **wortgleich** mit dem sichtbaren Text | **0** |
| Antwort abweichend formuliert | 13 |
| Frage steht **gar nicht** auf der Seite | 1 — „Wie lange dauert eine Dachsanierung beim Steildach?" (die Seite fragt „…bei einem Steildach") |

**Fachlich sind die Angaben korrekt** — die BEG-Zahlen stimmen in Text und Schema
überein (BEG-4 hat beide Stellen erwischt). Es geht um die Google-Vorgabe, dass der
ausgezeichnete Frage- und Antworttext **auf der Seite sichtbar** sein muss. Ein
Schema-Eintrag, den es auf der Seite nicht gibt, verstößt hart dagegen; 13 Paraphrasen
sind ein weicher Verstoß.

**Fix:** Auswahl über ein Flag im `faqCategories`-Array kennzeichnen und das Schema daraus
generieren — dieselbe Lösung wie auf `SturmschadenDach` (PR #27), `DachwartungBochum` und
`DachrinnenBochum` (PR #49/#52). Danach ist Drift auf dieser Seite konstruktiv unmöglich.

> **Korrektur einer früheren Aussage:** `VeluxPreisrechnerBochum.tsx` hatte ich zunächst
> ebenfalls als hartcodiert gemeldet. Das war falsch — die Seite baut ihr Schema über
> `faqData.map()` und erfüllt §7. Mein Prüfskript hatte nur auf den Literalnamen
> `faqItems.map` getestet und den abweichenden Array-Namen nicht erkannt.

### 8.2 Terminologie „förderfähig" — vier Stellen gegen §6

`DEPLOY-RULES.md` §6 schreibt **„förderrelevant"** statt „förderfähig" vor. Vier Stellen
behaupten weiterhin Förderfähigkeit einer Leistung:

| Datei | Stelle |
|---|---|
| `GruendachBochum.tsx` | „Gründächer sind im Rahmen der KfW-BEG förderfähig" |
| `VeluxPreisrechnerBochum.tsx` | FAQ-Frage + H2 „Welche VELUX Verglasung ist förderfähig über die BAFA?" |
| `WannLohntSichDachsanierung.tsx` | „kann über die BEG EM förderfähig sein" |

**Nicht betroffen und bewusst unverändert:** „förderfähige Kosten", „förderfähige
Bruttokosten", „förderfähige Obergrenze" und die Überschrift „Nicht förderfähig" in
`Foerderung.tsx`, `DachsanierungBochum.tsx` und `WannLohntSichDachsanierung.tsx`. Das ist
der amtliche Begriff der BEG-Richtlinie für die anrechenbare Kostenbasis — ihn zu ersetzen
wäre sachlich falsch. Die Regel zielt auf Aussagen über *unsere Leistungen*, nicht auf das
Zitat der Rechtsgrundlage.

---

### 8.3 Umsetzung am 30.08.2026 (PR #61) — und zwei Korrekturen an §8.1/§8.2

**Live seit 30.08.2026 14:51 UTC** (Netlify `6a944355…`, `commit_ref 60550bf`, IndexNow-Run
#32 HTTP 200). Umgesetzt wurden: `FAQ.tsx` mit `schema`-Flag im `faqCategories`-Array,
`DachsanierungBochum` und `VeluxAustausch` mit `mainEntity` aus `faqItems`, sowie die vier
Terminologie-Stellen aus §8.2.

> **Korrektur 1 zu §8.1 — es war nicht eine Seite, sondern acht.** Die Aussage „`FAQ.tsx`
> ist die letzte Seite mit hartcodiertem `FAQPage`-Schema" ist falsch. Nachgemessen auf
> `f84eb5e` mit dem Kriterium „mehr als ein Literal `"@type": "Question"` je Datei"
> (ein per `.map()` erzeugtes Schema enthält es genau einmal):
>
> | Seite | Einträge | Frage nicht auf der Seite | Antwort wortgleich |
> |---|---:|---:|---:|
> | `FAQ.tsx` | 14 | 1 | 0 |
> | `DachsanierungBochum` | 8 | 3 | 1 |
> | `VeluxAustausch` | 3 | 2 | 0 |
> | `DachPhotovoltaikBochum` | 6 | 0 | 0 |
> | `VeluxRolllaeden` | 5 | 0 | 2 |
> | `Dachreparatur` | 5 | 0 | 0 |
> | `BauklempnereiBochum` | 5 | 0 | 0 |
> | `BitumenVsPvc` | 3 | 0 | 0 |
>
> Warum das Prüfskript im August danebenlag, ist dieselbe Ursache wie bei der schon in
> §8.1 protokollierten Fehlmessung: Es testete auf den Literalnamen `faqItems.map` statt
> auf die Struktur. Seiten, die ihr Schema hartcodiert **und** daneben ein `faqItems`-Array
> für die Anzeige führen, fielen deshalb durch das Raster.
>
> **Folgepaket (offen):** Die fünf Seiten mit weichen Verstößen — `DachPhotovoltaikBochum`,
> `VeluxRolllaeden`, `Dachreparatur`, `BauklempnereiBochum`, `BitumenVsPvc`. Dieselbe
> Umstellung auf `faqItems.map()`, 5 Dateien, Stufe B, ein eigener Deploy.

> **Korrektur 2 zu §8.2 — es waren fünf Stellen, nicht vier.** Die Liste oben ist
> unvollständig: `DachsanierungBochum.tsx` sagt in der FAQ-Antwort „Bei Aufsparrendämmung
> ist die Neueindeckung zwingend notwendig und damit **automatisch förderfähig**" — eine
> Aussage über eine Leistung, also derselbe Verstoß gegen §6. Sie stand nicht in der
> Audit-Liste und ist deshalb in PR #61 **nicht** mitkorrigiert worden; die Behauptung im
> PR-Text, es blieben null solche Stellen, war falsch und ist dort richtiggestellt.
> Durch die Schema-Umstellung steht der Satz seit diesem Deploy auch im JSON-LD (vorher
> stand dort die Variante „vollständig förderfähig" — live war er also ohnehin).
> **Gehört ins Folgepaket**, zusammen mit den fünf Seiten oben.

**Damit ist §8 abgeschlossen**, mit dem benannten Folgepaket als Rest. Ebenfalls offen und
bewusst nicht in PR #61: die Schreibweise „Velux" statt **VELUX** im Fließtext und in den
FAQ-Fragen von `VeluxAustausch` — durch die Schema-Umstellung wandert sie jetzt ins
JSON-LD. GSC-Meta-3 hatte die Marke nur in Titles und Descriptions vereinheitlicht. Das ist
Content-Arbeit, kein Hygiene-Fix.

---

### 8.4 Folgepaket vorbereitet (31.08.2026) — und drei Funde daneben

**Live seit 01.09.2026 15:02 UTC** (PR #63, Netlify `6a96e8f5…`, `commit_ref b5e6656`,
IndexNow-Run #36, Prerender-Check-Action Lauf #3 grün). Ein Deploy, Stufe B, 6 Dateien:
die fünf Seiten mit weicher `FAQPage`-Drift auf `faqItems.map()` plus die fünfte
„förderfähig"-Stelle auf `DachsanierungBochum`. Gate eingehalten: 48 h 11 min nach PR #61.

> **Damit ist §8 abgeschlossen — und mit ihm das gesamte Audit-Dokument.** §6-Backlog,
> §8-Hygiene und §8-Folgepaket sind live. Offen bleiben nur die drei Content-Funde unten
> (fachliche Entscheidungen, kein Deploy-Anlass) und die Wirkungsmessung: GSC ab ~08.09.2026
> erneut auswerten und die CTR der zehn Seiten aus GSC-Meta-1 gegen die Baseline in
> Abschnitt 4 halten.

Nachgemessen vor der Umstellung — die Tabelle aus §8.3, um die Antwortseite ergänzt:

| Seite | sichtbar | im Schema | Frage nicht auf der Seite | Antwort wortgleich | paraphrasiert |
|---|---:|---:|---:|---:|---:|
| `BauklempnereiBochum` | 5 | 5 | 0 | 0 | 5 |
| `Dachreparatur` | 5 | 5 | 0 | 0 | 5 |
| `DachPhotovoltaikBochum` | 6 | 6 | 0 | 0 | 6 |
| `BitumenVsPvc` | 6 | 3 | 0 | 0 | 3 |
| `VeluxRolllaeden` | 5 | 5 | 0 | 4 | 1 |

Danach hat das Repo **kein hartcodiertes `FAQPage`-Schema mehr**: 23 Seiten führen eines,
alle 23 erzeugen es aus dem gerenderten Array.

**Das Zählproblem ist beseitigt.** Beide Fehlmessungen aus §8.1 und §8.3 gingen auf
Prüfskripte zurück, die auf den Literalnamen `faqItems.map` statt auf die Struktur testeten.
`npm run faq:check` (`scripts/faq-schema-check.mjs`) liest jetzt den Bezeichner aus dem
`mainEntity`-Ausdruck und prüft zusätzlich, ob dasselbe Array im JSX gerendert wird. Gegenprobe
an drei Repo-Ständen: `dc812bb^` → 8 beanstandet (exakt die Tabelle in §8.3), `63519ac` → 5
(exakt dieses Folgepaket), danach 0. Die Regel steht als prüfbare Zeile in `DEPLOY-RULES.md` §7.

#### Drei Funde, die *nicht* in diesem Paket stecken

1. **Widersprüchliche Lebensdauer-Angaben zu Dachrinnen-Materialien.** Der Nur-Schema-Satz
   „Kupfer hält am längsten mit bis zu 30 Jahren" auf `BauklempnereiBochum` verschwindet mit
   der Umstellung — er stand direkt neben „Titanzink ist die langlebigste Wahl mit bis zu
   80 Jahren" und widersprach ihm. Der Widerspruch bleibt aber **zwischen zwei Seiten** im
   sichtbaren Text bestehen: `/bauklempnerei-bochum` nennt Titanzink „bis zu 80 Jahre",
   `/faq` nennt „Titanzink oder Aluminium … häufig 15–25 Jahre, Kupfer … bis zu 30 Jahren".
   Das ist eine fachliche Festlegung, keine Hygiene — **gehört Tim vorgelegt**, nicht still
   korrigiert. Die `/faq`-Antwort ist nicht schema-ausgezeichnet, die von
   `BauklempnereiBochum` seit diesem Paket schon.
2. **Nackte Pfade in FAQ-Antworten auf `BitumenVsPvc`.** Vier Antworten enden auf „… unter
   `/flachdach-bochum`" bzw. `/foerderung`, `/gruendach-dachbegrunung-bochum`,
   `/dachsanierung-bochum` (alle vier Routen existieren). Drei davon stehen durch dieses
   Paket erstmals im JSON-LD. Sauber wäre ein echter Link im sichtbaren Text — Content-Arbeit
   für ein späteres Paket, kein Grund, das Schema vom sichtbaren Text abweichen zu lassen.
3. **„Velux" statt VELUX** (schon in §8.3 notiert) betrifft nicht nur `VeluxAustausch`:
   `VeluxRolllaeden` schreibt die Marke in FAQ-Fragen und -Antworten ebenfalls klein — dort
   stand sie allerdings schon vor diesem Paket im Schema, die Umstellung ändert daran nichts.
