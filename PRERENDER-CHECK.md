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

| URL | Soll-`<title>` |
|---|---|
| `/` | `Dachdecker Bochum – Rex Bedachungs GmbH` ⚠️ = Fallback → an JSON-LD/H1 erkennen |
| `/dachsanierung-bochum` | `Dachsanierung Bochum – Komplettsanierung vom Meisterbetrieb \| Rex Bedachungs GmbH` |
| `/flachdach-bochum` | `Flachdach Bochum – Abdichtung, Sanierung & Neubau \| Rex Bedachungs GmbH` |
| `/steildach-bochum` | `Steildach Bochum – Sanierung & Dämmung \| Rex Bedachung` |
| `/dachfenster-bochum` | `Dachfenster Bochum – Einbau & Austausch \| Rex Bedachung` |
| `/dachreparatur-bochum` | `Dachreparatur Bochum \| Schnelle Hilfe bei undichtem Dach` |

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
| _TT.MM.JJJJ_ | z. B. GSC | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | offen |
