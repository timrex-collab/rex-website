# Prerender-Health-Check — Routine (P1.1)

**Warum:** Die Seite ist eine React-SPA. Vollständiges HTML (Title/Meta/H1/JSON-LD) für
Crawler & KI-Bots kommt **nicht aus dem Build**, sondern zur Laufzeit aus der **Netlify
Prerender Extension** (Edge, nur im Netlify-Dashboard konfiguriert — nicht im Repo). Fällt
sie aus, sehen Google/GPTBot/PerplexityBot nur die leere SPA-Shell → Ranking- und
GEO-Sichtbarkeit brechen weg. Das ist das größte im Audit genannte Betriebsrisiko. Dieser
Check macht einen Ausfall in 5 Minuten sichtbar.

**Kadenz:** einmal pro **Monat** + einmal **ad hoc nach jedem funktionalen Deploy**
(neue/geänderte Routen werden erst durch Prerender crawlbar).

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

## 3. Prüfmethoden (eine reicht; Methode 1 ist am autoritativsten für Google)

**Methode 1 — Google Search Console (empfohlen):**
GSC → *URL-Prüfung* (Property `https://www.rex-bedachung.de/`) → URL eingeben →
*Live-URL testen* → *Gecrawlte Seite ansehen* → Tab **HTML**. Dort muss der route-spezifische
Title **und** JSON-LD stehen. Das ist exakt, was Googlebot empfängt.

**Methode 2 — Rich Results Test (schnellster JSON-LD-Check):**
`search.google.com/test/rich-results` → URL testen. Werden Typen wie *LocalBusiness/
RoofingContractor, Service, Article, FAQPage, BreadcrumbList* erkannt → JSON-LD kommt als
Googlebot an. „Keine Elemente" → Prerender-Verdacht.

**Methode 3 — Chrome DevTools mit Bot-User-Agent (voller Check, auch KI-Bots):**
DevTools (F12) → *⋮* → *More tools* → *Network conditions* → *User agent* → Haken bei
„Use browser default" weg → Bot-UA eintragen → Seite neu laden → im *Network*-Tab die
Dokument-Anfrage anklicken → Tab **Response** (= rohes Server-HTML) → mit Strg+F auf
`<title>`, `description`, `<h1>`, `ld+json` prüfen.
- Googlebot: `Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)`
- GPTBot: `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.1; +https://openai.com/gptbot)`

**Methode 4 — lokal per curl** (auf **Tims** Rechner, **nicht** in der Claude-Umgebung):
```bash
curl -sA "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" \
  https://www.rex-bedachung.de/flachdach-bochum | grep -iE "<title>|ld\+json|<h1"
```
Erwartung: route-spezifischer Title **und** `application/ld+json` erscheinen.

---

## 4. Soll-Titles (Referenz)

> **⚠ Diese Tabelle ist wartungspflichtig.** Sie muss bei **jeder** Title-Änderung
> mitgezogen werden — sonst meldet der Check Fehlschläge, die keine sind. Zuletzt
> abgeglichen: **11.08.2026** gegen `main` nach Deploy GSC-Meta-1 (PR #44).

| URL | Soll-`<title>` | Stand |
|---|---|---|
| `/` | `Dachdecker Bochum – Rex Bedachungs GmbH` ⚠️ = Fallback → an JSON-LD/H1 erkennen | unverändert |
| `/dachsanierung-bochum` | `Dachsanierung Bochum – Komplettsanierung vom Meister` | **neu 11.08.2026** |
| `/flachdach-bochum` | `Flachdach Bochum – Abdichtung & Sanierung` | **neu 11.08.2026** |
| `/steildach-bochum` | `Steildach Bochum – Sanierung & Dämmung \| Rex Bedachung` | unverändert |
| `/dachfenster-bochum` | `Dachfenster Bochum – Einbau & Austausch` | **neu 11.08.2026** |
| `/dachreparatur-bochum` | `Dachreparatur Bochum – Dach undicht? Wir helfen` | **neu 11.08.2026** |

> **Hinweis zu `&`:** Im Quelltext stehen die Titles teils als `&amp;` (JSX-Entity).
> Im gerenderten HTML und im Browser-Tab erscheint ein einfaches `&`. Beim Prüfen
> also auf `&` suchen, nicht auf `&amp;`.

> **Weitere Titles nach GSC-Meta-1** (nicht Teil der 6 Kern-URLs, hier nur als
> Referenz für spätere Stichproben): `/solarpflicht` → `Solarpflicht NRW 2026: Gilt sie
> für mein Dach?` · `/dachrinne-bochum` → `Dachrinnenreinigung Bochum – reinigen &
> reparieren` · `/dachgaube-bochum` → `Dachgaube Bochum – Einbau, Sanierung &
> Genehmigung` · `/foerderung` → `Dach-Förderung 2026: 15 % BAFA-Zuschuss sichern` ·
> `/dachwartung-bochum` → `Dachwartung Bochum – Inspektion & Wartungsvertrag` ·
> `/gruendach-dachbegrunung-bochum` → `Gründach Bochum – Dachbegrünung vom Meisterbetrieb`

---

## 5. Wenn der Check fehlschlägt (Eskalation)

Prerender liegt **nicht im Repo/`netlify.toml`**, sondern im Netlify-Dashboard → Fix passiert dort:

1. **Netlify-Dashboard** → Site `leafy-sprite-bbbfd6` → *Extensions/Integrations* → **Prerender** →
   Status prüfen (aktiv? Fehler?).
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
| _TT.MM.JJJJ_ | GSC / DevTools | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | offen |

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
