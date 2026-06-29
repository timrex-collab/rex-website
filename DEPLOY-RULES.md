# Rex Bedachung — Deploy-Regelwerk & Projektstand

**Verbindliche Projekt-Governance** · Repo: `timrex-collab/rex-website` (Branch `main`, public) · Live: https://www.rex-bedachung.de/

> **Changelog — Claude-Code-Anpassung (17.06.2026):** Dieses Dokument ist die in
> das Repo überführte, an den Claude-Code-Workflow angepasste Fassung des
> bisherigen Briefings. Geändert wurden ausschließlich die workflow-/tooling-
> abhängigen Teile (Abschnitte 3, 5, 9, 14) sowie das Deploy-Log (Abschnitt 10).
> Alle inhaltlichen Regeln (48h-Gate, Deploy-Stufen, atomare Commits,
> `attached_assets`-Ausschluss, Content-/Schema-/Terminologie-Konventionen)
> gelten **unverändert**.

---

## 0. Zweck
Vollständiger Kontext für das SEO/GEO-Optimierungsprojekt: nicht verhandelbare
Deploy-Regeln, Content-/Schema-Konventionen, Umsetzungsstand und Roadmap.
Ziel: lokale Suchdominanz und maximale Sichtbarkeit in KI-Suchmaschinen für
Dach-Keywords in Bochum und im Ruhrgebiet.

> **Workflow-Kern (neu, siehe Abschnitt 14):** Claude Code pusht **nie auf `main`**.
> Es committet auf den Feature-Branch, öffnet einen Pull Request, Netlify baut
> einen Deploy-Preview, **Tim merged**. Der Merge ist das bewusste Freigabe-Gate
> (ersetzt den früheren Replit-Push-Button als Sicherung).

---

## 1. Betrieb & Stammdaten (canonical — nie abweichen)

| Feld | Wert |
|---|---|
| Firma | Rex Bedachungs GmbH (Meisterbetrieb seit 1984) |
| Geschäftsführer | Tim Rex (Dachdeckermeister) |
| Co-Geschäftsführer | Peter Rex (Gründer, **kein** Meistertitel) |
| Adresse | Paulinenstraße 22, 44799 Bochum |
| GPS | 51.46262° N / 7.24442° E |
| Telefon | +49 234 583100 |
| Fax | +49 234 583137 |
| WhatsApp | https://wa.me/49234583126 |
| Öffnungszeiten | Mo–Fr 07:00–17:00 Uhr |
| HRB | 2478 |
| USt-IdNr. | DE124085752 |
| VELUX-Status | „Autorisierter VELUX-Partner" (**nie** „zertifiziert" / „Fachbetrieb") |
| Facebook | https://www.facebook.com/rexbedachung |
| Instagram | https://www.instagram.com/rexbedachung |

NAP-konsistent über alle Seiten, Schemas und Citations (Name/Adresse/Telefon identisch).

---

## 2. Tech-Stack & Infrastruktur
- **Frontend:** React + TypeScript + Vite · **Routing:** Wouter · **Styling:** Tailwind · **SEO/Head:** react-helmet
- **Hosting:** Netlify (Site-ID `leafy-sprite-bbbfd6`), Auto-Deploy bei Push auf `main`
- **Prerendering:** Netlify Prerender Extension (Edge, Dashboard-konfiguriert) — liefert vollständiges HTML inkl. Schema an Crawler/KI-Agenten. **Kein eigener Puppeteer-/SSG-Prerender** (Doppelstruktur-Risiko). Siehe Kommentar in `netlify.toml`.
- **Architektur:** SPA. Ein `curl` auf eine Route liefert nur die `index.html`-Shell, nicht den gerenderten Routeninhalt.

---

## 3. Repository & Verifikation  *(für Claude Code angepasst)*
Claude Code verifiziert **nicht** per `curl` oder `raw.githubusercontent` (Cache-Fallstricke). Stattdessen:

- **Aktueller Dateistand:** GitHub-MCP `get_file_contents` (liefert Commit-/Blob-SHA, kein Cache-Problem) bzw. lokal `git show <hash> -- <pfad>`.
- **Live-Stand:** Netlify-Connector `get-deploy` → `commit_ref`, `state: ready`, `plugin_state: success`, vorhandene Prerender-Function.
- **Live-HTML der Domain** ist aus der Claude-Umgebung blockiert (Netzwerk-Policy). Verifikation läuft daher über Repo + Netlify-API, **nicht** über die Domain. Wenn ein echter HTML-/Bot-Check nötig ist, übernimmt das Tim im Browser (DevTools / Bot-User-Agent).

---

## 4. Deploy-Disziplin (NON-NEGOTIABLE)
> **Warum:** März 2026 — 87+ Änderungen in 4 Tagen → Ranking-Verlust. Die Disziplin existiert genau deswegen.

1. **48 Stunden Pflicht-Pause zwischen jedem Deploy.** Keine Ausnahme.
2. **Ein atomarer Commit pro Deploy.**
3. **`attached_assets/` wird NIE committet.**
4. **Redirects ausschließlich in `netlify.toml`.**
5. **`robots.txt` ist gesperrt** — Änderungen nur als Stufe-C-Deploy.

### Deploy-Stufen (Datei-Obergrenzen)
| Stufe | Inhalt | Max. Dateien |
|---|---|---|
| **A** | Text / CSS | ≤ 12 |
| **B** | Schema / Content | ≤ 8 |
| **C** | Neue Routen / gesperrte Configs (`robots.txt` etc.) | ≤ 5 |

> **Hinweis:** Reine Doku-Dateien im Repo-Root (z. B. diese Datei) verändern die
> Site-Ausgabe (`dist/public`) nicht und tragen kein Ranking-Risiko; sie sollten
> dennoch als sauberer PR laufen.

---

## 5. Pre-Push-/Pre-Merge-Protokoll  *(für Claude Code angepasst)*
1. **Deployfenster-Check:** ≥ 48 h seit dem letzten Merge auf `main`.
2. **Feature-Branch auf `main` ausrichten** (`git fetch origin main` + ff/reset), damit der PR-Diff exakt die geplanten Änderungen zeigt.
3. **Diff prüfen** (`git show --stat HEAD` / PR-`get_files`) → exakt die geplanten Dateien, nichts sonst. Kein `attached_assets`.
4. **PR öffnen, Netlify-Preview abwarten.** Claude verifiziert den Preview-/Post-Merge-Stand über den Netlify-Connector (kein curl).
5. **Merge ausschließlich durch Tim.** Kein Direct-Push auf `main`, kein Auto-Merge.

---

## 6. Content-Regeln (firm)
### Preise — grundsätzlich keine definitiven Preise. Erlaubte Ausnahmen:
- VELUX-Preisstufen auf `VeluxAustausch` / `DachfensterBochum` / `VeluxPreisrechnerBochum`
- Offizielle BAFA-/KfW-Förderprozentsätze auf `Foerderung`
- Gesetzliches Bußgeld auf `Solarpflicht`
- `priceRange`-Schema auf `Home`

### Weitere Preis-Tabus
- Keine konkreten Kredit-/Hypothekenzinsen (NRW.BANK, KfW) — nur auf Zinssatz-Seiten verweisen.
- Keine iSFP-Eigenanteil-Zahlen.

### Terminologie (verbindlich)
- **„förderrelevant"** statt „förderfähig".
- **KfW 358/359 Ergänzungskredit** (nicht KfW 261).
- **„BEG-Anforderung / BEG requirements reference"** (nicht „BAFA-Anforderung").
- **„Autorisierter VELUX-Partner"** — nie „zertifiziert" / „Fachbetrieb".
  - Einzige erlaubte „zertifiziert"-Stellen: `BitumenVsPvc.tsx` (FLL Wurzelschutz), `Foerderung.tsx` (zertifizierter Energieeffizienz-Experte).
- **Kein „Notdienst"** im Dachreparatur-Schema.

### Verifizierte VELUX Uw-/g-Werte (maßgeblich = Preisrechner Modell B, live seit 06/2026)
| Stufe | Mapping | Uw | g | förderrelevant (BAFA Uw ≤ 1,0) |
|---|---|---|---|---|
| THERMO | xx70 | 1,3 | 0,46 | **nein** |
| ENERGIE | xx84 | 1,0 | 0,46 | ja |
| ENERGIE PLUS | xx66 | 1,0 | 0,44 | ja |

> ENERGIE und ENERGIE PLUS haben **beide Uw 1,0** — Unterschied ist der **g-Wert**
> (sommerlicher Hitzeschutz). WÄRMEDÄMMUNG (−67) und SCHALLSCHUTZ (−62) sind aus
> Rechner UND Seite entfernt. Anzeige: „Uw · g". Preise = VELUX UVP ab 01.07.2026.
> **Altlast behoben:** Der frühere fälschliche „Uw 0,7"-Eintrag für ENERGIE PLUS
> in `llms.txt`/`llms-full.txt` ist korrigiert (CC-Fix, PR #9, live seit 19.06.2026).

### Explizit ausgeschlossen (nicht vorschlagen)
SSR-/Framework-Migration · Stadtteil-Seiten · separate Kosten-Seiten · Gewerbeseiten · SearchAction-Schema · AggregateRating on-site · EPDM-Vergleiche · Notdienst-Seite · Roto-spezifische Cluster-Seiten · eigener Puppeteer-/SSG-Prerender.

---

## 7. Schema-Konventionen (etabliert ab D30)
- **@id-URIs:** global `#organization`, `#website`, `#author`, `#webpage`; seitenbezogen `#service`, `#article`, `#primaryimage`, `#logo` etc.
- **Pro Datei alle JSON-LD-Blöcke zu einem `@graph` konsolidieren.**
- **`faqItems.map()` für FAQPage** (verhindert Drift Schema ↔ UI).
- **Inline-`RoofingContractor`-Blöcke durch `@id`-Referenz auf `#organization` ersetzen.**
- **New-Page-Checklist:** BreadcrumbList-Schema im Helmet prüfen; fehlt es → flaggen + Snippet anbieten.

---

## 8. Rex-Standard v3.1 (alle Service-Seiten)
- **Content:** Direktantwort ≤ 120 Wörter · Bochum-verankert · Service-Definition · Entscheidungslogik · Fachbegriffe erklärt · Preislogik-Modul · ≥ 1 Referenz · 6–10 zitierfähige FAQs · 3–5 Links laut Verlinkungsmatrix.
- **Technik:** H-Struktur · 4-fach-Schema · Meta/OG.
- **Pflicht-H-Sequenz:** `H1 → Direktantwort → Leistung → Wann → Ablauf → Preis → Referenz → FAQ → Links`
- **Hierarchie:** Hub `/dachsanierung-bochum`; Pillars Flachdach · Steildach · Dachfenster; Cluster = übrige Service-Seiten.
- **FAQ-Standard (GEO):** H2 = exakte Nutzerfrage → 2–3 Sätze direkte Antwort → ergänzende Info / interner Link. Kein Marketing-Filler.

### CTA-Typ je Seite
| Seite | CTA |
|---|---|
| Sturmschaden | „Jetzt anrufen" (tel:) |
| Dachreparatur | „Reparatur anfragen" |
| Flachdach / Steildach | „Vor-Ort-Termin" |
| Dachsanierung | „Kostenlose Beratung" |
| Dachwartung | „Wartungstermin" |
| Dämmung / Gaube | „Angebot anfragen" |
| Ratgeber / Cluster | interner Link + Formular darunter |

---

## 9. Arbeitsweise & Review  *(für Claude Code angepasst)*
- **Claude Code editiert direkt** im Repo (kein „downloadbarer `.md`-Prompt für den Replit-Agent" mehr). Der `.md`-Prompt-Mechanismus bleibt nur für Aufgaben gültig, die bewusst weiter über Replit laufen (Hybrid-Workflow).
- **Idempotente, atomare Änderungen**; vor Content-Deploys **Fact-Checking** (Web-Recherche), Output gegen das Live-Repo gegenprüfen.
- **Review-Pass** (Second-Model): Feedback gegen das Live-Repo verifizieren; False Positives dokumentieren statt blind übernehmen.

---

## 10. Deploy-Historie & aktueller Stand
**D1–D35 live ✅ · CC1–CC3 live ✅ · CC-Fix live ✅ · D36 live ✅ · D-IndexNow live ✅ · D-Sitemap-Refresh live ✅ · Repo-Fix live ✅ (Claude-Code-Deploys).**

| Deploy | Inhalt | Status |
|---|---|---|
| D1–D33 | diverse SEO/GEO/Schema/Content-Schritte | ✅ live |
| D34 | `Foerderung.tsx` `@graph`-Konsolidierung | ✅ live |
| D35 | PageSpeed-Mobile (62 → 95); `richsnippet.js` deferred; `.cta-pulse` entfernt | ✅ live |
| **CC1** (PR #4) | statische Meta-Fallbacks `index.html` + Prerender-Doku `netlify.toml` | ✅ live |
| **CC2** (PR #5) | Bild-Sitemap `sitemap.xml` + ImageObject-Schema `OrganizationSchema.tsx` | ✅ live |
| **CC3** (PR #6) | `llms-full.txt` + Verweis aus `llms.txt` | ✅ live (Uw-/Terminologie-Altlast durch CC-Fix korrigiert) |
| **CC-Fix** (PR #9) | Korrektur `llms.txt` + `llms-full.txt`: ENERGIE PLUS **Uw 1,0** (statt 0,7) · „förderrelevant"/„BEG" statt „förderfähig"/„BAFA-förderfähig" · „Notdienst" entschärfen | ✅ live (gemergt 19.06.2026 ~20:37 UTC) |
| D36-Content | `Foerderung.tsx`: BEG-vs-GEG-Tabelle, Solardachpflicht-Alert, iSFP-Hebel, NRW-Kombi-Block, FAQ 11–13, Hub-Link | ✅ live (über Replit-Hybrid, Commits `0c56007` / `744d5a9`; nicht als nummerierter Deploy protokolliert) |
| **D36** (Claude Code) | `Foerderung.tsx` Article-Image-Schema-Fix (`ImageObject` `#primaryimage`, `@id`-Referenz in Article + WebPage) + Content-Audit (VELUX-Tier-Altlast bereinigt, Terminologie förderrelevant/BEG) · `DEPLOY-RULES.md`-Abgleich | ✅ live (PR #10, gemergt 22.06.2026 ~06:44 UTC) |
| **D-IndexNow** | IndexNow-Key-Datei `client/public/5bc5e3a3…f8a299.txt` + Submit-Skript `scripts/indexnow-submit.mjs` (`npm run indexnow:submit`): Bulk-POST der 30 indexierbaren Sitemap-URLs an `api.indexnow.org`. Manuell als permanenter Post-Deploy-Schritt (kein Build-Plugin, keine Env-Var). | ✅ live (PR #11, gemergt 26.06.2026 ~10:17 UTC; Submit HTTP 202) |
| **D-Sitemap-Refresh** | `client/public/sitemap.xml`: 29 `lastmod`-Werte auf die echten letzten Änderungsdaten (git-verifiziert, Route→Datei gegen `App.tsx` geprüft) gesetzt — bessere Recrawl-Priorität für Google/Bing, u. a. die 5 GSC-offenen Routen | ✅ live (PR #12, gemergt 29.06.2026 ~13:02 UTC; Submit HTTP 200) |
| **Repo-Fix** | leere 0-Byte-Datei `name="contact"` (Windows-ungültiger Pfad — `"` verboten; blockierte `git clone`/checkout auf Windows) entfernt; vom Build nicht referenziert, keine Production-Auswirkung | ✅ live (PR #13, gemergt 29.06.2026; reines Housekeeping) |

> **Cadence-Hinweis (29.06.2026):** Das 48h-Gate gilt strikt. Letzte funktionale
> Merges: D-IndexNow 26.06. ~10:17 UTC, D-Sitemap-Refresh 29.06. ~13:02 UTC
> (Repo-Fix 29.06. = reines Housekeeping, nicht gate-relevant). Nächstes
> funktionales Fenster frühestens ~01.07. ~13:02 UTC. Wirkung in GSC/Bing beobachten.

> **Permanenter Post-Deploy-Schritt (IndexNow):** Nach jedem funktionalen
> Production-Deploy einmal `npm run indexnow:submit` ausführen — meldet die
> 30 indexierbaren Sitemap-URLs an IndexNow. Bewusst manuell: kein Build-Plugin,
> keine GitHub-Action, keine Env-Var (passt zur Merge-only-Disziplin).

### Separat live: VELUX Preisrechner Modell B (06/2026 ✅) — siehe Uw-/g-Tabelle Abschnitt 6.

---

## 11. GEO / Off-Site-Arbeit (in Arbeit)
- **Bing Webmaster Tools:** CNAME verifiziert. Sitemap `…/sitemap.xml` eingereicht (26.06.2026, Status **Success**, 30 URLs erkannt, erster Crawl 27.06.). Hinweis: veralteter `firma.rex-bedachung.de/sitemap.xml`-Eintrag (301→www, redundant — zählt dieselben 30 URLs doppelt) kann im Bing-Dashboard entfernt werden.
- **IndexNow:** Key-Datei + Submit-Skript `scripts/indexnow-submit.mjs` umgesetzt (D-IndexNow). Permanenter Post-Deploy-Schritt: `npm run indexnow:submit` nach jedem funktionalen Production-Deploy.
- ✅ **robots.txt** (gesperrt, Stufe C): keine offenen Punkte. `Disallow: /impressum` ist live seit 27.05.2026 (Commit `ead75b0`); die KI-Crawler-Allow-Liste ist bereits breit (GPTBot, ClaudeBot, Claude-Web, Google-Extended, PerplexityBot, anthropic-ai, OAI-SearchBot). Eine Erweiterung um neuere 2026er-Agents (ChatGPT-User, Applebot-Extended, Meta-ExternalAgent, CCBot …) wäre reines Signaling — `User-agent: *` setzt bereits `Allow: /` — und ist bewusst zurückgestellt.

---

## 12. Offene Housekeeping-Punkte
- ✅ **`netlify.toml`:** verwaister `[[edge_functions]]`-og-inject-Eintrag — erledigt; nicht mehr in der Datei vorhanden (verifiziert 29.06.2026).
- ✅ **`index.html`:** `<link rel="preload">` Hero-Image — verifiziert, **kein Altlast** (29.06.2026): `dachdecker-bochum-steildach-hero.webp` ist das aktuelle Homepage-LCP-Bild (`Home.tsx` `heroImage`; og:/twitter:/primaryImage identisch). Korrektes LCP-Preload mit `fetchpriority="high"` — bleibt unverändert.
- **`About.tsx`:** Peter-Rex-Foto (Platzhalter) — wartet auf Asset (externe Abhängigkeit, kein Code-Task).
- ✅ **CC-Fix** (Uw/Terminologie) erledigt (PR #9, 19.06.2026), siehe Abschnitt 10.

---

## 13. Roadmap
- ✅ CC-Fix → ✅ D36 → ✅ D-IndexNow → ✅ D-Sitemap-Refresh → ✅ Repo-Fix.
- KI-Sichtbarkeits-Monitoring (ChatGPT, Perplexity, Gemini, Claude).
- Off-Site-Citation-Building (NAP-Konsistenz) · Google Business Profile · Wikidata-Entity.
- „Dachreport Bochum" (zitierfähiger Datencontent, Konzept) · YouTube als GEO-Kanal.
- Backlinks: VELUX-Händlerverzeichnis · HWK Dortmund / ZVDH · lokale Partner · Presse-Outreach.
- GSC-Indexierung der 5 Routen (`/dachreparatur-bochum`, `/dachwartung-bochum`, `/dachgaube-bochum`, `/bauklempnerei-bochum`, `/velux-preisrechner-bochum`): **Indexierung am 29.06.2026 angefordert** (URL-Prüfung), unterstützt durch frisches `lastmod` aus D-Sitemap-Refresh. Status in GSC beobachten — bei „Gecrawlt, nicht indexiert" Hebel beim Inhalt/interner Verlinkung.
- ✅ **Schutz-/Tippfehlerdomain `rex-bedachungen.de`** (mit „en") — erledigt 17.06.2026. Sauberer http-**301-Redirect** auf `https://www.rex-bedachung.de/` via `.htaccess` (DomainFactory-cPanel, DocumentRoot `/root_old/htm_rex-bedachungen.de`, **separate Infra von Netlify**). Alte 2011er-Inhalte gelöscht; nur `.htaccess` + `.user.ini` verbleiben; `/.well-known/` vom Redirect ausgenommen. **Kein SSL-Zert** (bewusst, AutoSSL im DF-Tarif nicht verfügbar), **„Force HTTPS" bleibt AUS** — sonst Zert-Warnung statt Redirect. Caveat: `https://`-Direkteingabe zeigt in HTTPS-First-Browsern eine Zert-Warnung statt des Redirects (akzeptiert, ~0 Traffic). Registrierung beider Domains bis **Mitte 2027** mit Auto-Verlängerung — **kein Handlungsbedarf**.

---

## 14. Tools & Workflow für Claude Code
| Tool | Zweck / Status |
|---|---|
| GitHub MCP (`timrex-collab/rex-website`) | Lesen/Schreiben via Claude-GitHub-App (Schreibrecht erteilt 17.06.2026) |
| Netlify-Connector (`leafy-sprite-bbbfd6`) | Deploy-/Build-Status, Prerender-Verifikation |
| Replit Agent | Code-Ausführung (Hybrid); kann nicht pushen |
| Google Search Console | URL-Prefix `https://www.rex-bedachung.de/` |
| Bing Webmaster Tools | CNAME verifiziert; Sitemap eingereicht (Success, 30 URLs, 26.06.2026) |
| Rich Results Test | Schema-Verifikation |
| ProvenExpert | Review-Widget (4,48★, 13 Bewertungen), deferred seit D35 |
| IndexNow | Key-Datei + Submit-Skript (`npm run indexnow:submit`); manueller Post-Deploy-Schritt |
| `rex-bedachungen.de` | 301-Redirect via `.htaccess` (separate Infra) |

### Sicherungs-Mechanismus (löst die frühere „Replit kann nicht pushen"-Bremse ab)
- Claude Code committet auf Feature-Branch `claude/stoic-knuth-7a72qd`, öffnet **PR**, Netlify baut **Preview**. **Tim merged.**
- **Kein Direct-Push auf `main`, kein Auto-Merge.** Der Merge durch Tim ist das 48h-/Freigabe-Gate.
- 48h-Gate, Stufen-Obergrenzen, atomare Commits, `attached_assets`-Ausschluss gelten unverändert.
- Hybrid: strukturelle/Schema-/Datei-Änderungen über Claude Code; visuelles/Layout-Probing über Replit. Nicht gleichzeitig auf derselben Datei arbeiten (Merge-Konflikte).

---

## Kernprinzip
Langsam, atomar, verifiziert: ein Deploy pro 48 h, eine saubere Commit-Diff, jede
Änderung gegen das Live-Repo geprüft, Merge nur durch Tim — die Disziplin
existiert, weil 87 Änderungen in 4 Tagen einmal das Ranking gekostet haben.
