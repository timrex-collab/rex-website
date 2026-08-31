# Prerender-Health-Check — Routine (P1.1)

**Warum:** Die Seite ist eine React-SPA. Vollständiges HTML (Title/Meta/H1/JSON-LD) für
Crawler & KI-Bots kommt **nicht aus dem Build**, sondern zur Laufzeit aus der **Netlify
Prerender Extension** (Edge, nur im Netlify-Dashboard konfiguriert — nicht im Repo). Fällt
sie aus, sehen Google/GPTBot/PerplexityBot nur die leere SPA-Shell → Ranking- und
GEO-Sichtbarkeit brechen weg. Das ist das größte im Audit genannte Betriebsrisiko. Dieser
Check macht einen Ausfall in 5 Minuten sichtbar.

**Kadenz:** einmal pro **Monat** + einmal **ad hoc nach jedem funktionalen Deploy**
(neue/geänderte Routen werden erst durch Prerender crawlbar).

> **Automatisiert seit 31.08.2026:** Die GitHub Action
> [`.github/workflows/prerender-check.yml`](../.github/workflows/prerender-check.yml) fährt
> genau diese Kadenz von selbst — bei jedem Merge auf `main` (reine Doku-Merges ausgenommen)
> und am 1. jedes Monats. Sie prüft zuerst offline die Soll-Titles gegen den Quelltext, wartet
> dann auf den Netlify-Deploy und lässt `scripts/prerender-check.mjs` bis zu dreimal laufen,
> bevor sie rot wird. Ein manueller Lauf bleibt jederzeit möglich — „Run workflow" in der
> Actions-UI oder lokal `npm run prerender:check`; die Anleitung dafür steht in §7.

> Der Live-HTML-Check läuft **im Browser bei Tim** — die Claude-Umgebung ist netz­gesperrt
> (`DEPLOY-RULES.md` §3). Claude liefert nur diese Checkliste + die Soll-Werte.

---

## 1. Zu prüfende URLs

**Prerender-relevant (die eigentliche Prüfung):**
1. `/` — Startseite
2. `/dachsanierung-bochum` — Hub
3. `/flachdach-bochum` — Pillar
4. `/steildach-bochum` — Pillar
5. `/dachfenster-bochum` — Pillar
6. `/dachreparatur-bochum` — Money-Page

**Statische Kontrolldateien** (werden immer direkt ausgeliefert → prüfen nur *Hosting*, nicht Prerender):
7. `/llms.txt` · 8. `/sitemap.xml` · 9. `/robots.txt`

---

## 2. Pass-Kriterien (pro Route)

Prerender **OK**, wenn der Bot im rohen HTML **alle** vier findet:

- ✅ route-spezifischer **`<title>`** (siehe Soll-Tabelle §4)
- ✅ **`<meta name="description">`** vorhanden
- ✅ genau **ein `<h1>`**
- ✅ mind. ein **`<script type="application/ld+json">`** mit `@graph` der Route

Prerender **FEHLGESCHLAGEN** (roher SPA-Shell), wenn **eines** zutrifft:

- ❌ **kein** JSON-LD, **keine** Meta-Description, **kein** `<h1>` → das ist die nackte Shell
  (der Fallback `client/index.html` enthält **nichts davon**)
- ❌ eine **Unterseite** zeigt den **generischen Startseiten-Title** `Dachdecker Bochum – Rex Bedachungs GmbH`

> **Sonderfall Startseite `/`:** Ihr Soll-Title ist identisch mit dem Fallback-Title. Auf `/`
> deshalb **nicht am Title**, sondern am **JSON-LD (`RoofingContractor`)** und am **`<h1>`** erkennen,
> ob geprerendert wird.

---

## 3. Prüfmethoden (den Prerender belegen nur Methode 3 und 4)

> **⚠ Korrigiert 31.08.2026 — die frühere Reihung war falsch.** Hier stand bis dahin,
> Methode 1 sei „am autoritativsten für Google". Das gilt für die Frage, ob Google eine
> Seite **indexieren** kann — nicht für die Frage, die dieses Dokument stellt.
> GSC-URL-Prüfung und Rich Results Test zeigen das **gerenderte** HTML, also den DOM
> **nach** JavaScript-Ausführung. Sie können deshalb gar nicht unterscheiden, ob Title und
> JSON-LD aus der Prerender-Extension kamen oder ob Googles eigener Renderer die SPA
> ausgeführt hat — beide Werkzeuge zeigten auch bei **abgeschalteter** Extension ein grünes
> Ergebnis. **Den Prerender belegt allein die rohe Serverantwort:** Methode 3 (Reiter
> *Response*), Methode 4 und `npm run prerender:check`.

**Methode 1 — Google Search Console (belegt Indexierbarkeit, *nicht* den Prerender):**
GSC → *URL-Prüfung* (Property `https://www.rex-bedachung.de/`) → URL eingeben →
*Live-URL testen* → *Gecrawlte Seite ansehen* → Tab **HTML**. Stehen dort route-spezifischer
Title und JSON-LD, ist belegt: Google **kann** die Seite so erfassen. Ob das über die
Extension lief oder über Googles eigene JS-Ausführung, sagt der Test nicht. Als
Pass/Fail-Test nach §2 damit ungeeignet, als Indexierungs-Kontrolle weiterhin nützlich.

> **Umgekehrt gilt: eine leere Shell in GSC ist *kein* Prerender-Ausfall.** GSC-URL-Prüfung
> und Rich Results Test crawlen mit dem User-Agent `Google-InspectionTool`, nicht mit
> `Googlebot`. Die Netlify-Prerender-Extension hat **keine editierbare Bot-Liste** (geprüft
> am 31.08.2026: die Extension bietet als einzigen UA-Schalter „Skip user-agents supporting
> JavaScript" — eine Ausschluss-, keine Einschlussliste; die Bot-Erkennung steckt fest in
> der Edge-Function und ist auch über die Netlify-API nicht konfigurierbar). Steht
> `Google-InspectionTool` dort nicht drauf, bekommen genau diese beiden Werkzeuge die
> Shell — der indexierende Googlebot aber trotzdem gerendertes HTML.
> **Ein solcher Befund löst keine Eskalation nach §5 aus.** Maßgeblich ist `npm run
> prerender:check`. Ob der UA auf der Liste steht, klärt ein Aufruf nach Methode 4 mit dem
> `Google-InspectionTool`-UA — reine Information, ohne Handlungsbedarf in beide Richtungen.

**Methode 2 — Rich Results Test (JSON-LD-Syntaxcheck, *kein* Prerender-Nachweis):**
`search.google.com/test/rich-results` → URL testen. Werden Typen wie *LocalBusiness/
RoofingContractor, Service, Article, FAQPage, BreadcrumbList* erkannt, ist das JSON-LD für
Google verwertbar. Das Werkzeug rendert JavaScript und nutzt denselben
`Google-InspectionTool`-UA wie Methode 1 — es trennt Prerender und Client-Rendering nicht.
„Keine Elemente" ist ein Schema-Verdacht, kein Prerender-Verdacht.

**Methode 3 — Chrome DevTools mit Bot-User-Agent (voller Check, auch KI-Bots):**
DevTools (F12) → *⋮* → *More tools* → *Network conditions* → *User agent* → Haken bei
„Use browser default" weg → Bot-UA eintragen → Seite neu laden → im *Network*-Tab die
Dokument-Anfrage anklicken → Tab **Response** (= rohes Server-HTML) → mit Strg+F auf
`<title>`, `description`, `<h1>`, `ld+json` prüfen.
- Googlebot: `Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)`
- GPTBot: `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.1; +https://openai.com/gptbot)`
- Google-InspectionTool (nur zur Diagnose, s. o.): `Mozilla/5.0 (compatible; Google-InspectionTool/1.0)`

> **Nur der Reiter *Response* zählt.** Der Reiter *Elements* zeigt den DOM nach
> JavaScript-Ausführung und beweist — wie Methode 1 — nichts über den Prerender.

**Methode 4 — lokal per curl (der maßgebliche Test)** — auf **Tims** Rechner, **nicht** in
der Claude-Umgebung:
```bash
curl -sA "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
  https://www.rex-bedachung.de/flachdach-bochum | grep -iE "<title>|ld\+json|<h1"
```
Erwartung: route-spezifischer Title **und** `application/ld+json` erscheinen.

---

## 4. Soll-Titles (Referenz)

> **⚠ Diese Tabelle ist wartungspflichtig.** Sie muss bei **jeder** Title-Änderung
> mitgezogen werden — sonst meldet der Check Fehlschläge, die keine sind. Zuletzt
> abgeglichen: **31.08.2026** gegen `main` (`63519ac`) — doppelt bestätigt: der
> `--self-test` prüft die sechs Soll-Titles maschinell gegen den Quelltext, und der
> Live-Lauf vom 31.08. (§9) hat alle sechs auch in der Server-Antwort exakt so
> vorgefunden. Seit dem letzten Abgleich haben GSC-Meta-3 (PR #56) und die
> Schema-/Terminologie-Hygiene (PR #61) zwar Titles bzw. JSON-LD angefasst, aber
> **keinen der sechs Kern-Titles**.

| URL | Soll-`<title>` | Stand |
|---|---|---|
| `/` | `Dachdecker Bochum – Rex Bedachungs GmbH` ⚠️ = Fallback → an JSON-LD/H1 erkennen | unverändert |
| `/dachsanierung-bochum` | `Dachsanierung Bochum – Komplettsanierung vom Meister` | **neu 11.08.2026** |
| `/flachdach-bochum` | `Flachdach Bochum – Abdichtung & Sanierung` | **neu 11.08.2026** |
| `/steildach-bochum` | `Steildach Bochum – Neueindeckung & Dämmung` | **neu 24.08.2026 (GSC-Meta-2)** |
| `/dachfenster-bochum` | `Dachfenster Bochum – Einbau & Austausch` | **neu 11.08.2026** |
| `/dachreparatur-bochum` | `Dachreparatur Bochum – Dach undicht? Wir helfen` | **neu 11.08.2026** |

> **Hinweis zu `&` — hängt von der Prüfmethode ab (korrigiert 24.08.2026):**
> In der **rohen Server-Antwort** (Skript, `curl`, DevTools → Network → Response,
> GSC-Quelltextansicht) steht `&amp;` — HTML verlangt das so. Nur im **DevTools-
> Elements-Panel** und im Browser-Tab erscheint das dekodierte `&`.
> Also: bei Rohtext nach `&amp;` suchen, im Elements-Panel nach `&`. Am einfachsten
> nach dem Wortteil davor oder danach suchen und das Zeichen ganz weglassen.
> `npm run prerender:check` nimmt einem das ab — es dekodiert vor dem Vergleich.

> **Weitere Titles nach GSC-Meta-1** (nicht Teil der 6 Kern-URLs, hier nur als
> Referenz für spätere Stichproben): `/solarpflicht` → `Solarpflicht NRW 2026: Gilt sie
> für mein Dach?` · `/dachrinne-bochum` → `Dachrinnenreinigung Bochum – reinigen &
> reparieren` · `/dachgaube-bochum` → `Dachgaube Bochum – Einbau, Sanierung &
> Genehmigung` · `/foerderung` → `Dach-Förderung 2026: 15 % BAFA-Zuschuss sichern` ·
> `/dachwartung-bochum` → `Dachwartung Bochum – Inspektion & Wartungsvertrag` ·
> `/gruendach-dachbegrunung-bochum` → `Gründach Bochum – Dachbegrünung vom Meisterbetrieb`

---

## 5. Wenn der Check fehlschlägt (Eskalation)

> **Vorher abgrenzen (Zusatz 31.08.2026):** Diese Eskalation gilt für einen Fehlschlag in
> der **rohen Serverantwort** — `npm run prerender:check`, Methode 3 (*Response*) oder
> Methode 4. Eine leere Shell in der GSC-URL-Prüfung oder im Rich Results Test ist **kein**
> Auslöser: beide crawlen mit `Google-InspectionTool` und rendern JavaScript (§3). Erst das
> Skript entscheidet.

Prerender liegt **nicht im Repo/`netlify.toml`**, sondern im Netlify-Dashboard → Fix passiert dort:

1. **Netlify-Dashboard** → Site `leafy-sprite-bbbfd6` → *Extensions/Integrations* → **Prerender** →
   Status prüfen (aktiv? Fehler?). Dort muss **„Enable prerendering" an** und **„Skip
   user-agents supporting JavaScript" aus** sein — der zweite Haken nimmt Googlebot,
   Bingbot und Amazonbot ausdrücklich vom Prerendering aus und würde §2 site-weit
   fehlschlagen lassen. Eine Bot-Liste zum Ergänzen bietet die Extension nicht.
2. **Netlify-Connector `get-deploy`** → letzter Deploy `state: ready`, `plugin_state: success`,
   Prerender-Function vorhanden.
3. Letzten Deploy **erneut ausführen** (Retry) und erneut prüfen.
4. Bleibt es die Shell: Netlify-Support / Extension-Doku. Claude kann als **Schadensbegrenzung**
   die Fallback-Meta in `client/index.html` erweitern — das ersetzt die Extension aber nicht.

---

## 6. Protokoll

| Datum | Methode | `/` | Sanierung | Flachdach | Steildach | Dachfenster | Reparatur | llms/sitemap/robots | Ergebnis |
|---|---|---|---|---|---|---|---|---|---|
| 11.08.2026 | Netlify-API (Stufe 1, s. u.) | — | — | — | — | — | — | — | **Infrastruktur OK, HTML-Ebene offen** |
| 18.08.2026 | Netlify-API (Stufe 1, s. u.) | — | — | — | — | — | — | — | **Infrastruktur OK, HTML-Ebene offen** |
| 20.08.2026 | Netlify-API (Stufe 1, s. u.) | — | — | — | — | — | — | — | **Infrastruktur OK, HTML-Ebene offen** |
| 22.08.2026 | Netlify-API (Stufe 1) | — | — | — | — | — | — | — | **Infrastruktur OK, HTML-Ebene offen** — Deploy `6a896439…`, `commit_ref 04535d2`, `state ready`, `plugin_state success`, Secret-Scan 664/0, IndexNow #23 + #24 `success` |
| 24.08.2026 | GitHub Actions (Teil-Check) | — | — | — | — | — | — | — | **IndexNow #25 auf `431ecbd` `success`** · Netlify-Stufe-1 **nicht geprüft** (Connector in dieser Session nicht verfügbar) |
| **24.08.2026** | **Server-Antwort mit Googlebot-UA (Stufe 2)** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | **BESTANDEN** |
| 26.08.2026 | Netlify-API (Stufe 1) + GitHub Actions | — | — | — | — | — | — | — | **Infrastruktur OK, HTML-Ebene offen** — Deploy `6a8efc52…`, `commit_ref b461b18` (Paket 6, PR #58), `state ready`, `plugin_state success`, Prerender-Function `nf-prerender-ext_prerender` vorhanden, Secret-Scan 669/0, IndexNow #28 HTTP 200 (30 URLs) · **Stufe 2 offen — bei Tim** |
| 28.08.2026 | Netlify-API (Stufe 1) + GitHub Actions | — | — | — | — | — | — | — | **Infrastruktur OK, HTML-Ebene offen** — Deploy `6a919fdb…`, `commit_ref db0dbdf` (GSC-Meta-3, PR #56), `state ready`, `plugin_state success`, Prerender-Function vorhanden, Secret-Scan 671/0, IndexNow #30 HTTP 200 (30 URLs) · **Stufe 2 offen — bei Tim** |
| 30.08.2026 | Netlify-API (Stufe 1) + GitHub Actions | — | — | — | — | — | — | — | **Infrastruktur OK, HTML-Ebene offen** — Deploy `6a944355…`, `commit_ref 60550bf` (Schema-/Terminologie-Hygiene, PR #61), `state ready`, `plugin_state success`, Prerender-Function vorhanden, Secret-Scan 673/0, IndexNow #32 HTTP 200 (30 URLs) · **Stufe 2 offen — bei Tim** |
| **31.08.2026** | **`npm run prerender:check` (Stufe 2)** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — | **BESTANDEN** — 6/6 PASS gegen Deploy `6a95312e…`, `commit_ref 63519ac`; deckt Paket 6, GSC-Meta-3 und die Schema-/Terminologie-Hygiene ab. Protokoll §9 |

> **Nachtrag 30.08.2026 — jetzt drei Deploys ohne Stufe-2-Lauf.** ✅ **Erledigt am
> 31.08.2026, siehe §9.** Nach der Schema-/Terminologie-Hygiene (PR #61) ist Stufe 1 wieder
> grün, Stufe 2 scheiterte erneut mit **6× HTTP 403 am Proxy**. Betroffen sind `FAQ.tsx`,
> `DachsanierungBochum`, `VeluxAustausch`, `GruendachBochum`, `VeluxPreisrechnerBochum` und
> `WannLohntSichDachsanierung`; die Soll-Titles in §4 und §7 bleiben unverändert gültig. Der
> Deploy ändert **JSON-LD** auf drei Seiten, und JSON-LD ist eines der vier Pass-Kriterien
> aus §2. Ein Lauf von `npm run prerender:check` deckt inzwischen drei Deploys auf einmal ab
> und wäre langsam fällig.
>
> **Korrektur (31.08.2026):** Der Satz „keine der sechs Kern-URLs aus §1" stand hier
> ursprünglich und war **falsch**. `DachsanierungBochum.tsx` ist die Komponente hinter
> `/dachsanierung-bochum` (`App.tsx`, Route `/dachsanierung-bochum`) — Kern-URL **#2**. PR #61
> hat also sehr wohl JSON-LD auf einer der sechs geprüften URLs verändert, und zwar auf dem
> Hub. Für den Pass/Fail ändert das nichts (Kriterium 4 verlangt „mindestens ein JSON-LD-Block",
> `FAQPage` und `HowTo` stehen weiter drin), aber die Begründung war zu entspannt: Der Lauf
> vom 31.08. ist der erste, der eine JSON-LD-Änderung **auf einer Kern-URL** gegenprüft.

> **Nachtrag 28.08.2026 — Stufe 2 nach GSC-Meta-3 steht ebenfalls aus.** Stufe 1 ist nach
> dem Merge von PR #56 grün (Zeile oben), Stufe 2 scheiterte erneut mit **6× HTTP 403 am
> Proxy** — dieselbe Netzsperre wie am 26.08., kein Prerender-Befund. **Die Soll-Titles in
> §4 und §7 bleiben unverändert gültig:** GSC-Meta-3 hat zwar fünf `<title>` neu gefasst,
> aber keine der sechs Kern-URLs aus §1 — betroffen sind `/bitumen-vs-pvc-flachdach-bochum`,
> `/lexikon`, `/dach-photovoltaik-bochum`, `/velux-dachfenster-austausch-bochum` und
> `/velux-dachfenster-rolllaeden-bochum`, die in diesem Dokument nicht vorkommen (geprüft).
> Damit sind zwei Deploys ohne Stufe-2-Lauf aufgelaufen — beide ohne Routen- oder
> Metadaten-Risiko für die geprüften URLs, ein Lauf bei Gelegenheit deckt beide ab.

> **Nachtrag 26.08.2026 — Stufe 2 nach Paket 6 steht aus.** Stufe 1 ist nach dem Merge von
> PR #58 grün (Zeile oben). Stufe 2 hat Claude erneut versucht (`npm run prerender:check`)
> und wie erwartet **6 von 6 URLs mit HTTP 403 am Proxy** — die Domain ist aus der
> Claude-Umgebung netzgesperrt (`DEPLOY-RULES.md` §3), das ist kein Prerender-Befund.
> Der Lauf gehört auf Tims Rechner. **Risiko diesmal gering:** Paket 6 hat weder Routen
> noch Titles noch Metadaten angefasst, nur interne Linkkarten im Body ergänzt — die
> Soll-Titles in §4 bleiben unverändert gültig.

### Der Check hat zwei Stufen

Die Trennung ist wichtig, weil nur Stufe 1 aus der Claude-Umgebung prüfbar ist
(`DEPLOY-RULES.md` §3 — die Domain ist netzgesperrt; ein `curl` als Googlebot
scheitert am Proxy mit `CONNECT tunnel failed, 403`).

**Stufe 1 — Infrastruktur (Claude, via Netlify-Connector):** Läuft die Extension
überhaupt und ist der Deploy sauber durch?

**Stufe 2 — HTML-Ebene (Tim, im Browser):** Kommt das gerenderte HTML auch wirklich
beim Bot an? Nur das ist der eigentliche Pass/Fail-Test nach §2. Methoden siehe §3.

### Protokoll Stufe 1 — 11.08.2026

Geprüft nach dem Merge von PR #44 (BEG-4 + GSC-Meta-1) und PR #45 (Doku).

| Prüfpunkt | Soll | Ist | |
|---|---|---|---|
| Deploy `state` | `ready` | `ready` | ✅ |
| `plugin_state` | `success` | `success` | ✅ |
| `commit_ref` | Merge PR #45 | `3c631ce35913ca05d7b783f311be82589c4e4e57` | ✅ |
| `branch` / `context` | `main` / `production` | `main` / `production` | ✅ |
| Prerender-Function vorhanden | ja | `nf-prerender-ext_prerender` („Netlify Prerender", Gruppe `netlify-prerender-extension`, `nodejs20.x`) | ✅ |
| `edge_functions_present` | `true` | `true` | ✅ |
| Redirect-Regeln | fehlerfrei | 32 Regeln, keine Fehler | ✅ |
| `error_message` | leer | `null` | ✅ |
| Veröffentlicht | — | 11.08.2026 08:19:19 UTC (10:19 CEST) | — |

**Ergebnis Stufe 1: bestanden.** Die Prerender-Extension ist deployed und aktiv.

**Stufe 2 steht noch aus.** Das ist der Teil, der zählt: Stufe 1 belegt nur, dass die
Function existiert — nicht, dass sie für jede Route korrektes HTML liefert. Bitte nach
§3 Methode 1 (GSC-URL-Prüfung) oder Methode 3 (DevTools mit Bot-UA) durchführen und
das Ergebnis in der Tabelle oben eintragen.

> **Besonders relevant bei diesem Lauf:** GSC-Meta-1 hat 10 Titles und Descriptions
> geändert. Diese Änderungen erreichen Google **ausschließlich** über die
> Prerender-Extension. Bleibt Stufe 2 ungeprüft, ist unbekannt, ob die neuen Snippets
> überhaupt ankommen — und der erwartete CTR-Effekt bliebe ohne erkennbare Ursache aus.

---

### Protokoll Stufe 1 — 18.08.2026

Geprüft nach dem Merge von PR #40 (ExpertenBlock-Rollout).

| Prüfpunkt | Soll | Ist | |
|---|---|---|---|
| Deploy `state` | `ready` | `ready` | ✅ |
| `plugin_state` | `success` | `success` | ✅ |
| `commit_ref` | Merge PR #40 | `aecb53c75e938d578d33a060006d35742d146f03` | ✅ |
| `branch` / `context` | `main` / `production` | `main` / `production` | ✅ |
| Prerender-Function vorhanden | ja | `nf-prerender-ext_prerender` („Netlify Prerender", Gruppe `netlify-prerender-extension`, `nodejs20.x`) | ✅ |
| `edge_functions_present` | `true` | `true` | ✅ |
| Redirect-Regeln | fehlerfrei | 32 Regeln, keine Fehler | ✅ |
| `error_message` | leer | `null` | ✅ |
| Secret-Scan | 0 Funde | 659 Dateien gescannt, 0 Treffer | ✅ |
| IndexNow-Action | `success` | Run #18 auf `aecb53c`, `success` | ✅ |
| Veröffentlicht | — | 18.08.2026 10:11:40 UTC (12:11 CEST), Deploy-Zeit 32 s | — |

**Ergebnis Stufe 1: bestanden.** Deploy `6a842fba1d71f6000807c51f`, Prerender-Extension
deployed und aktiv.

**Stufe 2 steht weiterhin aus** — seit dem ersten Lauf am 11.08.2026 unverändert offen.
Inzwischen sind drei weitere Deploys live gegangen, die ausschließlich über die
Prerender-Extension bei Google ankommen:

| Deploy | Was nur über Prerender ankommt |
|---|---|
| GSC-Meta-1 (11.08.) | 10 neue Titles + Descriptions — der erwartete CTR-Effekt |
| GSC-Schema-1 (16.08.) | `FAQPage`-Schema auf `/solarpflicht` — 31 % aller Impressionen |
| ExpertenBlock-Rollout (18.08.) | Autorenbezug und Innungs-Chip auf 13 statt 5 Seiten |

> Damit hängt inzwischen der sichtbare Ertrag von drei Deploys an einer Annahme, die
> noch nie geprüft wurde. Stufe 2 ist der einzige Test, der sie belegt — Methode 1
> (GSC-URL-Prüfung, „Live-Test" → „Gerendertes HTML") ist dafür am autoritativsten,
> weil sie zeigt, was Google tatsächlich sieht. Ein einziger Lauf über die sechs
> Kern-URLs aus §1 genügt.

---

### Protokoll Stufe 1 — 20.08.2026

Geprüft nach dem Merge von PR #49 (Paket 4a) und PR #48/#50 (Doku).

| Prüfpunkt | Soll | Ist | |
|---|---|---|---|
| Deploy `state` | `ready` | `ready` | ✅ |
| `plugin_state` | `success` | `success` | ✅ |
| `commit_ref` | Merge PR #49 | `efe40ceb1e83489e1c4e952b377c9170b00f55b6` | ✅ |
| `branch` / `context` | `main` / `production` | `main` / `production` | ✅ |
| Prerender-Function vorhanden | ja | `nf-prerender-ext_prerender` (`nodejs20.x`) | ✅ |
| `edge_functions_present` | `true` | `true` | ✅ |
| Redirect-Regeln | fehlerfrei | 32 Regeln, keine Fehler | ✅ |
| `error_message` | leer | `null` | ✅ |
| Secret-Scan | 0 Funde | 662 Dateien gescannt, 0 Treffer | ✅ |
| IndexNow-Action | `success` | Run #21 auf `efe40ce`, `success` | ✅ |
| Veröffentlicht | — | 20.08.2026 08:36:22 UTC (10:36 CEST), Deploy-Zeit 32 s | — |

**Ergebnis Stufe 1: bestanden.** Deploy `6a86bc653975c400087b6664`.

**Stufe 2 steht weiterhin aus** — offen seit dem ersten Lauf am 11.08.2026. Die Liste der
Deploys, deren Wirkung ohne diesen Test unbelegt bleibt, ist auf **vier** gewachsen:

| Deploy | Was nur über Prerender ankommt |
|---|---|
| GSC-Meta-1 (11.08.) | 10 neue Titles + Descriptions — der erwartete CTR-Effekt |
| GSC-Schema-1 (16.08.) | `FAQPage`-Schema auf `/solarpflicht` — 31 % aller Impressionen |
| ExpertenBlock-Rollout (18.08.) | Autorenbezug und Innungs-Chip auf 13 statt 5 Seiten |
| Paket 4a (20.08.) | Drei neue FAQs inklusive der Leistungsabgrenzung — genau die Antwort, die Google und KI-Assistenten zur Dachreinigungs-Frage ausspielen sollen |

> Ein einziger Lauf über die sechs Kern-URLs aus §1 nach Methode 1 (GSC-URL-Prüfung,
> „Live-Test" → „Gerendertes HTML") schließt das ab.

---

## 7. Laufzettel Stufe 2 — ausfüllfertig

Alles unten ist am Repo-Stand `04535d2` (22.08.2026) maschinell aus dem Quelltext
gezogen — nach Paket 5 erneut gegengeprüft, **alle sechs Soll-Titles unverändert gültig**. **Ein Durchgang, sechs URLs, ca. 15 Minuten.**

### Schnellster Weg: `npm run prerender:check`

Auf dem **eigenen Rechner** im Projektordner (nicht in der Claude-Umgebung — dort ist die
Domain netzgesperrt):

```bash
npm run prerender:check
```

Das Skript ruft alle sechs Kern-URLs mit Googlebot-User-Agent ab und prüft je die vier
Pass-Kriterien aus §2. Ausgabe pro Zeile `PASS`/`FAIL`, am Ende eine Zusammenfassung;
Exit-Code 1, wenn etwas fehlschlägt. `--verbose` zeigt zusätzlich die gefundenen Werte.

Das ist **Methode 4** in automatisiert: Es belegt, dass der Server einem Googlebot-UA
gerendertes HTML ausliefert — und ist damit der **einzige** Test, der den Prerender von
Googles eigener JS-Ausführung trennt (§3). Er genügt allein nach jedem Deploy. Methode 1
beantwortet eine andere Frage (kann Google die Seite indexieren) und ersetzt ihn nicht.

`npm run prerender:check -- --self-test` prüft ohne Netz, ob die Erkennungslogik stimmt und
ob die Soll-Titles im Skript noch zum Quelltext passen. Letzteres verhindert genau die
Fehlalarme, vor denen §4 warnt.

---

### Manuell (Methode 3 — wenn das Skript nicht läuft)

Chrome DevTools → `Strg+Shift+P` → „Show Network conditions" → User agent auf **Googlebot**
stellen → Seite neu laden → im *Network*-Tab die Dokument-Anfrage anklicken → Reiter
**Response** → mit `Strg+F` die drei Prüfwerte unten suchen → Ergebnis eintragen, nächste URL.

> **Reiter *Response*, nicht *Elements*.** Nur die rohe Serverantwort trennt Prerender von
> Client-Rendering. Der frühere Text an dieser Stelle empfahl den *Elements*-Reiter und die
> GSC-URL-Prüfung als „die autoritativste" Methode — beides zeigt den gerenderten DOM und
> hätte auch bei abgeschalteter Extension bestanden (korrigiert 31.08.2026, s. §3).

> **Ergänzend, nicht als Ersatz (Methode 1):** GSC → *URL-Prüfung* → „Live-Test" →
> „Gecrawlte Seite ansehen" → Reiter „HTML". Das belegt, dass Google die Seite so erfassen
> kann — nicht, dass der Prerender läuft.

### Prüfwerte je URL

Pro Zeile drei Dinge im gerenderten HTML suchen. **Alle drei müssen da sein.**

| # | URL | 1. `<title>` muss enthalten | 2. `<h1>` muss enthalten | 3. JSON-LD muss enthalten |
|---|---|---|---|---|
| 1 | `/` | `Dachdecker Bochum – Rex Bedachungs GmbH` ⚠️ | `Dachdecker Bochum – Ihr Partner rund um's Dach` | `"@type": "WebPage"` + `"@type": "BreadcrumbList"` |
| 2 | `/dachsanierung-bochum` | `Dachsanierung Bochum – Komplettsanierung vom Meister` | `Dachsanierung Bochum – Komplettsanierung vom Meisterbetrieb` | `"@type": "FAQPage"` + `"@type": "HowTo"` |
| 3 | `/flachdach-bochum` | `Flachdach Bochum – Abdichtung & Sanierung` | `Flachdach & Gründach Bochum` | `"@type": "FAQPage"` + `"@type": "OfferCatalog"` |
| 4 | `/steildach-bochum` | `Steildach Bochum – Neueindeckung & Dämmung` | `Steildach Bochum – Neueindeckung & Sanierung` | `"@type": "FAQPage"` + `"@type": "HowTo"` |
| 5 | `/dachfenster-bochum` | `Dachfenster Bochum – Einbau & Austausch` | `Dachfenster Bochum – Einbau & Austausch vom Meisterbetrieb` | `"@type": "FAQPage"` + `"@type": "Article"` |
| 6 | `/dachreparatur-bochum` | `Dachreparatur Bochum – Dach undicht? Wir helfen` | `Dachreparatur in Bochum – schnelle Hilfe bei Dachschäden` | `"@type": "FAQPage"` + `"@type": "RoofingContractor"` |

> **⚠️ Zu Zeile 1 (`/`):** Der Title der Startseite ist **identisch mit dem
> Fallback-Title** aus `index.html`. Er allein beweist gar nichts. Für `/` zählen
> deshalb **nur H1 und JSON-LD** — findest du beide, hat der Prerender gearbeitet.
> Findest du nur den Title, ist es die leere SPA-Shell und der Check ist
> **fehlgeschlagen**.

> **Zu `&` (korrigiert 24.08.2026):** In der rohen Server-Antwort steht `&amp;`, im
> DevTools-Elements-Panel `&`. Am sichersten nach dem Wort davor oder danach suchen.
> Die frühere Anleitung „immer nach `&` suchen" war falsch und hätte bei drei der
> sechs URLs einen Fehlschlag gemeldet, den es nicht gibt.

### Ergebnis eintragen

| # | URL | Title | H1 | JSON-LD | Datum |
|---|---|---|---|---|---|
| 1 | `/` | n. z. | ⬜ | ⬜ | |
| 2 | `/dachsanierung-bochum` | ⬜ | ⬜ | ⬜ | |
| 3 | `/flachdach-bochum` | ⬜ | ⬜ | ⬜ | |
| 4 | `/steildach-bochum` | ⬜ | ⬜ | ⬜ | |
| 5 | `/dachfenster-bochum` | ⬜ | ⬜ | ⬜ | |
| 6 | `/dachreparatur-bochum` | ⬜ | ⬜ | ⬜ | |

**Alle Häkchen gesetzt → Stufe 2 bestanden.** Ergebnis zusätzlich als Zeile in die
Protokoll-Tabelle in §6 eintragen.

**Ein einziges Feld ohne Häkchen → Eskalation nach §5.** Nicht „nur eine Seite" —
fällt die Extension aus, betrifft das potenziell alle Routen.

### Warum das jetzt dran ist

Vier Deploys hängen an dieser einen ungeprüften Annahme. Ihr sichtbarer Ertrag entsteht
**ausschließlich** über die Prerender-Extension:

| Deploy | Was nur über Prerender ankommt |
|---|---|
| GSC-Meta-1 (11.08.) | 10 neue Titles + Descriptions — der erwartete CTR-Effekt |
| GSC-Schema-1 (16.08.) | `FAQPage` auf `/solarpflicht` — 31 % aller Impressionen |
| ExpertenBlock-Rollout (18.08.) | Autorenbezug + Innungs-Chip auf 13 statt 5 Seiten |
| Paket 4a (20.08.) | Leistungsabgrenzung Reinigung — genau die Antwort, die ausgespielt werden soll |

Bleibt Stufe 2 offen und der erwartete CTR-Effekt aus, ist nicht unterscheidbar, ob die
Texte schlecht waren oder Google sie nie gesehen hat. Der Test kostet 15 Minuten und
trennt genau diese beiden Fälle.

---

## 8. Protokoll Stufe 2 — 24.08.2026 · **BESTANDEN**

Durchgeführt von Tim Rex in PowerShell gegen die **rohe Server-Antwort** mit
Googlebot-User-Agent. Damit ist ausgeschlossen, dass der bereits gerenderte DOM das
Ergebnis verfälscht — der Unterschied, an dem dieser Test steht und fällt.

Repo-Stand `026d49d`, Live-Deploy nach GSC-Meta-2 (PR #55).

| URL | `<h1>` | `description` | JSON-LD | `<title>` | |
|---|---:|---:|---:|---|---|
| `/` | 1 | 1 | 2 | Fallback — nicht bewertet | ✅ |
| `/dachsanierung-bochum` | 1 | 1 | 3 | Dachsanierung Bochum – Komplettsanierung vom Meister | ✅ |
| `/flachdach-bochum` | 1 | 1 | 3 | Flachdach Bochum – Abdichtung & Sanierung | ✅ |
| `/steildach-bochum` | 1 | 1 | 3 | Steildach Bochum – Neueindeckung & Dämmung | ✅ |
| `/dachfenster-bochum` | 1 | 1 | 3 | Dachfenster Bochum – Einbau & Austausch | ✅ |
| `/dachreparatur-bochum` | 1 | 1 | 7 | Dachreparatur Bochum – Dach undicht? Wir helfen | ✅ |

**Alle sechs Kern-URLs bestehen alle vier Kriterien aus §2.** Sämtliche Soll-Titles aus §4
stimmen exakt. Auf `/` zählen wie vorgesehen nur `h1` und JSON-LD — beide vorhanden, es ist
also nicht die leere Shell.

### Was das beantwortet

Die Prerender-Extension liefert Crawlern gerendertes HTML. Damit ist belegt, dass der Ertrag
der fünf Deploys, die daran hingen, bei Google überhaupt ankommen kann:

| Deploy | Nachweis im Ergebnis |
|---|---|
| GSC-Meta-1 (11.08.) | Titles kommen route-spezifisch an |
| GSC-Schema-1 (16.08.) | JSON-LD wird ausgeliefert (3–7 Blöcke je Seite) |
| ExpertenBlock-Rollout (18.08.) | im gerenderten Body enthalten |
| Paket 4a (20.08.) | dito |
| **GSC-Meta-2 (24.08.)** | `/steildach-bochum` liefert bereits den **neuen** Title „Neueindeckung & Dämmung" |

Der letzte Punkt ist der stärkste: Ein Title, der erst Stunden zuvor deployt wurde, steht
bereits in der Bot-Antwort. Die Kette Repo → Build → Deploy → Prerender → Crawler ist
durchgängig belegt, nicht nur angenommen.

### Was das *nicht* beantwortet

Der Test zeigt, was der **Server** einem Googlebot-User-Agent liefert. Ob Google die Seiten
auch tatsächlich so **indexiert**, zeigt er nicht — das ist der verbleibende Restzweifel,
deutlich kleiner als der vorherige, aber nicht null. Ihn schließt die
GSC-Indexierungsabdeckung bzw. ein GSC-Live-Test auf einer beliebigen Unterseite.

> **Korrektur 31.08.2026:** Hier stand, die GSC-URL-Prüfung sei dafür „Methode 1" im Sinne
> des besseren Tests. Sie beantwortet eine **andere** Frage als §2: Sie rendert JavaScript
> und kann Prerender und Client-Rendering nicht trennen (§3). Der Prerender-Nachweis oben
> ist damit nicht schwächer als ein GSC-Test — er ist der einzige, der die Frage überhaupt
> beantwortet. Ein GSC-Live-Test bleibt sinnvoll, aber für die Indexierungsfrage.

### Kadenz ab jetzt

`npm run prerender:check` nach jedem funktionalen Deploy. Ergebnis als Zeile in §6
eintragen. Bei einem `FAIL` gilt weiterhin die Eskalation nach §5 — ein Fehlschlag betrifft
potenziell alle Routen, nicht nur die gemeldete.

---

## 9. Protokoll Stufe 2 — 31.08.2026 · **BESTANDEN**

Durchgeführt von Tim Rex in PowerShell mit `npm run prerender:check` — dem automatisierten
Methode-4-Lauf gegen die **rohe Server-Antwort** mit Googlebot-User-Agent. Repo-Stand des
Checkouts `63519ac`, live war Netlify-Deploy `6a95312e…` auf demselben `commit_ref`
(published 07:46 UTC; PR #62 war reine Doku, das ausgelieferte HTML entspricht dem Stand
nach PR #61).

```
PASS  /                        – title  ✓ description  ✓ h1  ✓ json-ld
PASS  /dachsanierung-bochum    ✓ title  ✓ description  ✓ h1  ✓ json-ld
PASS  /flachdach-bochum        ✓ title  ✓ description  ✓ h1  ✓ json-ld
PASS  /steildach-bochum        ✓ title  ✓ description  ✓ h1  ✓ json-ld
PASS  /dachfenster-bochum      ✓ title  ✓ description  ✓ h1  ✓ json-ld
PASS  /dachreparatur-bochum    ✓ title  ✓ description  ✓ h1  ✓ json-ld
```

**6 von 6 Kern-URLs bestehen alle vier Kriterien aus §2.** Alle fünf bewertbaren Soll-Titles
aus §4 stimmen exakt; auf `/` zählen wie vorgesehen nur H1 und JSON-LD — beide vorhanden, es
ist also nicht die leere Shell.

### Was dieser Lauf abdeckt

Er schließt die drei seit dem 24.08. aufgelaufenen Deploys auf einmal:

| Deploy | Was daran über Prerender ankommen muss | Nachweis |
|---|---|---|
| Paket 6 (26.08., PR #58) | interne Linkkarten im gerenderten Body | Body wird geliefert (H1 + Description je URL) |
| GSC-Meta-3 (28.08., PR #56) | fünf neue Titles — keiner davon auf einer Kern-URL | indirekt: Title-Auslieferung funktioniert weiter |
| **Schema-/Terminologie-Hygiene (30.08., PR #61)** | **JSON-LD auf `/dachsanierung-bochum`** | **direkt: json-ld ✓ auf Kern-URL #2** |

Die letzte Zeile ist der eigentliche Zugewinn gegenüber dem Lauf vom 24.08.: Damals war
belegt, dass ein frisch deployter **Title** beim Bot ankommt. Jetzt ist zusätzlich belegt,
dass eine frisch deployte **JSON-LD-Änderung** auf einer geprüften URL ausgeliefert wird —
und genau das war die Annahme, auf der die drei ungeprüften Deploys standen.

### Was weiterhin offen bleibt

Unverändert der Restzweifel aus §8: Der Test zeigt, was der **Server** einem
Googlebot-User-Agent liefert, nicht ob Google die Seiten auch so **indexiert**. Das
beantwortet nur die GSC-URL-Prüfung (Methode 1) — einmalig, auf einer beliebigen Unterseite.
`/dachsanierung-bochum` wäre dafür der beste Kandidat, weil dort das neue Schema steht.

### Nächster fälliger Lauf

Nach dem Merge des Folgepakets zu §8 (Fenster ab **01.09.2026 ~14:51 UTC**). Das Paket
ändert JSON-LD unter anderem auf `/dachreparatur-bochum` — Kern-URL **#6**. Die Soll-Titles
bleiben unberührt, §4 und §7 brauchen dafür keine Pflege (per `--self-test` geprüft).
