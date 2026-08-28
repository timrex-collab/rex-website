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

1. **48 Stunden Pflicht-Pause zwischen jedem Deploy.** Keine Ausnahme — mit genau
   einem eng definierten Vorbehalt, siehe „Notfall-Korrektur" unten.
2. **Ein atomarer Commit pro Deploy.**
3. **`attached_assets/` wird NIE committet.**
4. **Redirects ausschließlich in `netlify.toml`.**
5. **`robots.txt` ist gesperrt** — Änderungen nur als Stufe-C-Deploy.

### Notfall-Korrektur (einzige Ausnahme vom 48h-Gate)
Das Gate bremst **Optimierungs-Churn** — das ist sein Zweck und dafür gilt es
ausnahmslos. Es bremst **nicht** die Korrektur sachlich falscher Aussagen.

Das Gate darf ausgesetzt werden, wenn **alle** vier Bedingungen erfüllt sind:
1. Auf der Live-Site steht eine **nachweisbar falsche Tatsachenbehauptung** —
   typischerweise Förderbeträge, Preise, gesetzliche Pflichten oder ein Rechner,
   der falsche Zahlen ausgibt. Nicht: „suboptimal formuliert", „könnte besser ranken".
2. Der Deploy **korrigiert ausschließlich diesen Fehler**. Keine Optimierung
   huckepack, keine neuen Routen, keine `robots.txt`, keine Redirects.
3. Die Ausnahme wird **hier im Deploy-Log protokolliert**, mit Datum und Grund.
4. Danach gilt für die nächsten Deploys wieder **volle Kadenz** — keine Kette.

Begründung: Falsche Förderzahlen auf einer Handwerker-Website sind ein konkreter,
zurechenbarer Schaden (Vertrauensverlust, im Zweifel Abmahnrisiko wegen
irreführender Werbung). Das SEO-Risiko eines einzelnen zusätzlichen Merges ist
demgegenüber diffus und klein. Diese Asymmetrie — und nur sie — rechtfertigt
die Ausnahme.

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

### Leistungsabgrenzung Reinigung (verbindlich, Stand 18.08.2026)
Festgelegt von Tim Rex. Gilt fuer Seiten, Schema, `llms*.txt` und jede Keyword-Empfehlung.

| Leistung | Angeboten? |
|---|---|
| **Dachrinnenreinigung** (Rinnen, Fallrohre, Ablaeufe) | **ja** — eigenstaendig und im Wartungsumfang |
| **Flachdachreinigung** (Gullys/Einlaeufe, Rand- und Eckbereiche) | **ja** — im Rahmen der Wartung |
| Dachflaechenreinigung / Dachreinigung (Ziegel abstrahlen o. Ae.) | **nein** |
| Algenentfernung / Moosentfernung / Dachbeschichtung | **nein** |

> Die Suchnachfrage nach „Dachreinigung Bochum" ist real (892 Impressionen, s.
> `GSC-AUDIT-2026-08.md` §3.1), aber **fuer uns nicht bedienbar** — sie zielt auf eine
> Leistung, die wir nicht erbringen. Der einzige zulaessige Umgang damit ist eine
> ehrliche Abgrenzung im Text, **keine** Landingpage und **kein** Keyword-Einbau.

### Explizit ausgeschlossen (nicht vorschlagen)
SSR-/Framework-Migration · Stadtteil-Seiten · separate Kosten-Seiten · Gewerbeseiten · SearchAction-Schema · AggregateRating on-site · EPDM-Vergleiche · Notdienst-Seite · Roto-spezifische Cluster-Seiten · eigener Puppeteer-/SSG-Prerender · **Dachreinigungs-/Algenentfernungs-Seite** (Leistung wird nicht angeboten, s. Leistungsabgrenzung oben).

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
**Alle bis hier protokollierten Deploys sind live ✅** — D1–D36 · CC1–CC3 · CC-Fix ·
D-IndexNow · D-Sitemap-Refresh (1+2) · Repo-Fix · B1/B2 · Meta-Fix · P2.1–P2.4 ·
D-IndexNow-CI · Innung-Trust · BEG-1 bis BEG-4 · GSC-Meta-1 · GSC-Schema-1 ·
Interne Verlinkung · GEO-Pflege · ExpertenBlock-Rollout · Paket 4a · Paket 5 · GSC-Meta-2 ·
Paket 6 · GSC-Meta-3.

> **Stand 20.08.2026:** Die Tabelle hatte Lücken — von PR #18 bis PR #47 waren nur BEG-1,
> BEG-2, BEG-4 und GSC-Meta-1 eingetragen; 18 weitere Deploy-Zeilen (20 gemergte PRs)
> fehlten. Sie ist seit PR #48 vollständig aus der Merge-Historie von `main` rekonstruiert
> und wird ab jetzt bei jedem Deploy mitgeführt.
> Letzter funktionaler Merge: **PR #56 am 28.08.2026 14:49 UTC** → nächstes 48-h-Fenster
> öffnet **30.08.2026 ~14:49 UTC**. Damit ist der Deploy-Backlog aus `GSC-AUDIT-2026-08.md`
> §6 vollständig abgearbeitet; als Nächstes steht die Schema- und Terminologie-Hygiene aus
> §8 desselben Dokuments an. Reine Doku-/Tooling-PRs (#14–#17, #22–#24, #45, #46, #48, #50,
> #51, #53, #54, #57, #59) sind bewusst nicht als Deploy-Zeilen geführt — sie berühren den
> Build (`dist/public`) nicht und sind nicht gate-relevant.

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
| **B1** | Schema-Hygiene: Inline-`provider`-NAP auf `@id`-Referenz `#organization` konsolidiert (`BauklempnereiBochum`, `Dachreparatur`, `DachrinnenBochum`, `DachwartungBochum`, `SturmschadenDach`) | ✅ live (PR #18, gemergt 01.07.2026) |
| **Meta-Fix** | `client/index.html`: doppelte Meta-Description- und Canonical-Tags entfernt · Meta-Descriptions für `Impressum` und `Datenschutz` ergänzt | ✅ live (PR #19 + #20, gemergt 01.07.2026) |
| **B2** | Schema-Hygiene Fortsetzung von B1 auf 5 weiteren Seiten (`DachPhotovoltaikBochum`, `GruendachBochum`, `Solarpflicht`, `VeluxAustausch`, `VeluxRolllaeden`) | ✅ live (PR #21, gemergt 04.07.2026) |
| **P2.2 + P2.3-a** | `References.tsx`: Galerie → strukturierte Case-Studies („Ausgewählte Projekte im Detail": Ausgangslage · Arbeiten · Material · Ergebnis, je 2 interne Links) · `FlachdachBochum.tsx`: zwei zitierfähige Definitions-FAQ. Deckt die „lokale Autorität"-Empfehlung regelkonform ohne Doorway-Seiten ab | ✅ live (PR #25, gemergt 14.07.2026) |
| **P2.3-b** | Je eine definitorische FAQ auf `SteildachBochum.tsx` und `SturmschadenDach.tsx` (Rex-Standard v3.1, zitierfähig) | ✅ live (PR #26, gemergt 16.07.2026) |
| **Schema-Hygiene FAQ-map** | `SturmschadenDach.tsx`: hartcodiertes 40-Zeilen-`FAQPage`-Schema durch `faqItems.map()` ersetzt — UI und JSON-LD können nicht mehr auseinanderlaufen | ✅ live (PR #27, gemergt 18.07.2026) |
| **D-IndexNow-CI** | `.github/workflows/indexnow.yml`: IndexNow-Submit als GitHub Action bei jedem Push/Merge auf `main` (+ `workflow_dispatch`); danach Action-Versionen auf `checkout@v5`/`setup-node@v5`, Node 22 gehoben. Manueller Submit entfällt, Merge-only-Disziplin bleibt | ✅ live (PR #29 18.07.2026, PR #30 20.07.2026) |
| **P2.1** | „Dachdeckerei Bochum" natürlich in `Home.tsx` und `Services.tsx` integriert (je 1 Stelle, kein Keyword-Stuffing) | ✅ live (PR #28, gemergt 20.07.2026) |
| **P2.4 Batch 1–3** | `areaServed` auf allen Service-/Ratgeber-Seiten auf ein einheitliches Modell gebracht: `City`-Objekte der Kern-6 (Bochum · Herne · Castrop-Rauxel · Witten · Hattingen · Gelsenkirchen) statt gemischter String-Arrays. 24 Stellen in 20 Dateien, bewusst in Batches ≤ 8 Dateien je Deploy | ✅ live (PR #31 23.07., PR #32 25.07., PR #33 28.07.2026) |
| **Innung-Trust** | Mitgliedschaft in der Dachdecker-Innung Bochum als Vertrauensanker sichtbar gemacht: Logo `logo-dachdecker-innung-bochum.png`, Chip in `ExpertenBlock`, Blöcke in `Footer`, `Home`, `About` sowie `memberOf` in `OrganizationSchema.tsx` | ✅ live (PR #34, gemergt 31.07.2026 09:07 CEST) |
| **BEG-1** | BEG-Reform 21.07.2026: iSFP-Deckelung (max. 12.000 → 10.500 € je WE), Rechenlogik im VELUX-Preisrechner korrigiert (15 % + 5 % nur oberhalb 30.000 €), WPB-Bonus ab Q1 2027 ergänzt, GEG → GModG auf `Foerderung`; 8 Dateien + Doku. Verifiziert am Primärtext der Richtlinie BEG EM vom 17.07.2026 | ✅ live (PR #35, gemergt 31.07.2026 16:09 CEST; Netlify `6a6cacad…`, `commit_ref cd95adb`, `state ready`) — **Gate-Ausnahme, siehe Notfall-Korrektur unten** |
| **BEG-2** | „bis zu 20 %"-Förderclaims auf 8 Money-Pages → „15 % Grundförderung"; „KfW 261" → „KfW-Ergänzungskredit 358/359"; „förderfähig" → „förderrelevant"; GEG → GModG in denselben Dateien | ✅ live (PR #36, gemergt 02.08.2026 20:35 CEST; Netlify `6a6f8ddc…`, `commit_ref 1da90ed`, `state ready`) |
| **Repo-Fix** | leere 0-Byte-Datei `name="contact"` (Windows-ungültiger Pfad — `"` verboten; blockierte `git clone`/checkout auf Windows) entfernt; vom Build nicht referenziert, keine Production-Auswirkung | ✅ live (PR #13, gemergt 29.06.2026; reines Housekeeping) |
| **BEG-4** | Nachzügler der BEG-Reform vom 21.07.2026, die BEG-1/BEG-2 nicht erfasst hatten: `FAQ.tsx` „Maximale Förderung: 12.000 €" → 10.500 € (Text **und** FAQPage-Schema), iSFP-30.000-€-Schwelle ergänzt; „Bis zu 20 % BAFA-Förderung" → „15 % BAFA-Grundförderung" in `DachsanierungBochum.tsx` (og/twitter/3× Schema) und `BitumenVsPvc.tsx` (Preisfaktor, FAQ, FAQPage-Schema, Fördermodul); „förderfähig" → „förderrelevant" in denselben Sätzen | ✅ live (PR #44, Commit 1, gemergt 11.08.2026 10:18 CEST) — **keine Gate-Ausnahme beansprucht, siehe Hinweis unten** |
| **GSC-Meta-1** | Meta-Offensive I aus dem GSC-Repo-Abgleich: `<title>` und `<meta name="description">` auf den 10 impressionsstärksten Seiten neu gefasst (`Solarpflicht`, `Dachreparatur`, `DachrinnenBochum`, `DachfensterBochum`, `DachgaubeBochum`, `Foerderung`, `DachwartungBochum`, `FlachdachBochum`, `DachsanierungBochum`, `GruendachBochum`). Alle Titles ≤ 60, alle Descriptions ≤ 155 Zeichen. Betrifft ~28.000 der 37.000 Impressionen. Behebt nebenbei „förderfähig" → „förderrelevant" in zwei Descriptions | ✅ live (PR #44, Commit 2, gemergt 11.08.2026 10:18 CEST) — Stufe A, 10 Dateien |
| **BEG-3** | GModG statt GEG in 8 weiteren Dateien; Gesetzespflicht (GModG) und Förderanforderung (BEG) sprachlich sauber getrennt | ✅ live (PR #37, gemergt 04.08.2026 23:39 CEST) |
| **D-Sitemap-Refresh-2** | `client/public/sitemap.xml`: 30 `lastmod`-Werte erneut auf die git-verifizierten echten Änderungsdaten gesetzt | ✅ live (PR #38, gemergt 07.08.2026 16:14 CEST) |
| **Interne Verlinkung** | Vier Lücken im Linkgraph geschlossen (`About`, `Dachreparatur`, `DachsanierungBochum`, `GruendachBochum`, `SteildachBochum`); Autorenname im `ExpertenBlock` verlinkt jetzt auf `/ueber-uns` | ✅ live (PR #39, gemergt 10.08.2026 14:41 CEST) |
| **GEO-Pflege** | `llms.txt` + `llms-full.txt` nachgezogen (Innungsmitgliedschaft, Handwerksrolle HWK Dortmund, ZVDH-Regelwerk, englischer Entity-Klärungsblock, Abschnitt „Referenzprojekte", Stand → 08/2026) · fehlendes `AuthorSchema` ergänzt und ein hängender `#author`-Verweis auf `WannLohntSichDachsanierung` behoben | ✅ live (PR #43, gemergt 12.08.2026 09:12 CEST) |
| **GSC-Schema-1** | `Solarpflicht.tsx`: `FAQPage`-Schema aus den vorhandenen Abschnitten ergänzt und das JSON-LD der Seite zu einem `@graph` konsolidiert. Betrifft die impressionsstärkste Seite der Property (11.583 Impr. = 31 % aller Impressionen, vorher ohne FAQ-Schema) | ✅ live (PR #47, gemergt 16.08.2026 09:58 CEST) |
| **ExpertenBlock-Rollout** | `ExpertenBlock` von 5 auf 13 Serviceseiten ausgerollt, je mit seitenspezifisch passenden `normen` — damit erscheinen Autorenbezug (E-E-A-T) und Innungs-Chip auf allen relevanten Money-Pages statt nur auf fünf | ✅ live (PR #40, gemergt 18.08.2026 12:11 CEST; Netlify `6a842fba…`, `commit_ref aecb53c`, `state ready`, `plugin_state success`) |
| **Paket 4a** | Flachdachreinigung im Wartungsumfang benannt: Gullys/Einläufe sowie Rand- und Eckbereiche auf `DachwartungBochum` und `FlachdachBochum`, dazu die ehrliche Abgrenzungs-FAQ „Bieten Sie Dachreinigung oder Algenentfernung an?" → nein. Ersetzt das gestrichene Paket 4 (`/dachreinigung-bochum`). Nebenbei: hartcodiertes `FAQPage`-Schema auf `DachwartungBochum` auf `faqItems.map()` umgestellt (es war bereits gedriftet) und die fehlende Linkkarte Flachdach → Dachwartung ergänzt | ✅ live (PR #49, gemergt 20.08.2026 10:35 CEST; Netlify `6a86bc65…`, `commit_ref efe40ce`, `state ready`, `plugin_state success`) — **Gate-Unterschreitung, siehe Hinweis unten** |
| **Paket 5** | Kannibalisierung bei „dachrinnenreinigung bochum" entflochten: exakter Begriff auf `DachwartungBochum` von 7× auf 2× reduziert (Kosten-Karte, Service-Schema, og/twitter, Hero-Subline umformuliert — die Leistung bleibt benannt), auf `DachrinnenBochum` von 1× auf 11× über acht verschiedene Elemente aufgebaut, dazu Definitions-FAQ „Was gehört zu einer Dachrinnenreinigung?". `DachwartungBochum` hatte **null** interne Serviceverlinkungen — neue Section „Verwandte Leistungen" ergänzt. `FAQPage` auf `DachrinnenBochum` auf `faqItems.map()` umgestellt (nur 5 von 6 Fragen standen im Schema) | ✅ live (PR #52, gemergt 22.08.2026 10:53 CEST; Gate eingehalten: 48 h 17 min nach #49) |
| **GSC-Meta-2** | Meta-Offensive II: `<title>` und `<meta name="description"` auf den 10 Seiten neu gefasst, die auf Seite 1 ranken und trotzdem kaum Klicks holen (`SturmschadenDach`, `VeluxPreisrechnerBochum`, `AufsparrendaemmungBochum`, `Careers`, `SteildachFoerderungBochum`, `WannLohntSichDachsanierung`, `SteildachUndichtBochum`, `Services`, `SteildachBochum`, `BauklempnereiBochum`). Vier Titles waren bis 80 Zeichen lang, drei Descriptions bis 186 — sie wurden im Snippet abgeschnitten. Nebenbei eine Falschaussage korrigiert: `/karriere` warb mit „Dachdecker, **Klempner** und Auszubildende", es gibt aber nur zwei offene Stellen und keinen Klempner. Soll-Title `/steildach-bochum` im `PRERENDER-CHECK` §4 und §7 nachgezogen | ✅ live (PR #55, gemergt 24.08.2026 16:33 CEST; Gate eingehalten: 53 h 39 min nach #52) |
| **Paket 6** | Interne Verlinkung der zehn unterverlinkten Money-Pages: kontextuelle Linkkarten aus zehn Quellseiten (`SturmschadenDach`, `Dachreparatur`, `SteildachBochum`, `DachsanierungBochum`, `DachwartungBochum`, `DachPhotovoltaikBochum`, `Foerderung`, `DachfensterBochum`, `VeluxAustausch`, `VeluxRolllaeden`), drei davon mit neuer Link-Section. Danach hat **keine** Money-Page mehr unter drei eingehende kontextuelle Links; die impressionsstärksten Nachzügler `/dachrinne-bochum` (2.571 Impr.) und `/dachgaube-bochum` (1.773 Impr.) gehen von 2 auf 5. Null neue Dubletten; Grid-Spalten auf `DachsanierungBochum` und `DachPhotovoltaikBochum` an die neue Kartenzahl angepasst. Letztes offenes Paket aus `GSC-AUDIT-2026-08.md` §6 | ✅ live (PR #58, gemergt 26.08.2026 14:46 UTC / 16:46 CEST; Stufe A, 10 Dateien; Gate eingehalten: 48 h 13 min nach #55; Netlify `6a8efc52…`, `commit_ref b461b18`, `state ready`, `plugin_state success`, Secret-Scan 669/0; IndexNow-Run #28 HTTP 200, 30 URLs) |
| **GSC-Meta-3** | Abschluss der Meta-Offensive: `<title>` und `<meta name="description">` auf den letzten fünf Seiten mit Überlängen neu gefasst (`BitumenVsPvc` T70/D173 → T46/D148, `DachLexikon` T67/D145 → T47/D151, `DachPhotovoltaikBochum` T74/D171 → T48/D144, `VeluxRolllaeden` T66/D165 → T49/D149). Dazu `VeluxAustausch` ohne Überlänge, aber mit 22 von 55 Titelzeichen für den Firmennamen — neu gefasst und die Schreibweise auf **VELUX** vereinheitlicht (zwei Seiten schrieben „Velux“). **Danach liegt keine Seite im Repo mehr über 60/155.** | ✅ live (PR #56, gemergt 28.08.2026 14:49 UTC / 16:49 CEST; Stufe A, 5 Dateien; Gate eingehalten: 48 h 2 min nach #58; Netlify `6a919fdb…`, `commit_ref db0dbdf`, `state ready`, `plugin_state success`, Secret-Scan 671/0; IndexNow-Run #30 HTTP 200, 30 URLs) — **Merge durch Claude, siehe Hinweis unten** |

> **👤 Abweichung von §5.5 (28.08.2026) — Deploy GSC-Meta-3, PR #56 von Claude gemergt:**
> Abschnitt 5, Punkt 5 lautet „Merge ausschließlich durch Tim. Kein Direct-Push auf `main`,
> kein Auto-Merge." Für diesen einen Merge hat Tim die Regel **ausdrücklich ausgesetzt** und
> Claude beauftragt, das Fenster selbst abzuwarten und zu mergen. Grund: rein terminlich —
> das Fenster öffnete an einem Freitagnachmittag, und der PR lag seit dem 24.08. fertig und
> geprüft vor.
> **Was dabei unangetastet blieb:** Das 48-h-Gate selbst. Der Merge lief 48 h 2 min nach #58,
> also im regulären Fenster; es wurde **keine** Gate-Ausnahme nach Abschnitt 4 beansprucht.
> Ebenso unangetastet: kein Direct-Push auf `main` — der Weg lief wie immer über den PR.
> **Vorprüfung vor dem Merge** (16 min vor Fensteröffnung, protokolliert): `main` unverändert
> seit dem Doku-Merge #59, PR-Head `81b027b` unverändert, `mergeable_state: clean`,
> Test-Merge lokal sauber, Netlify-Preview-Checks grün. Zusätzlich wurde die Kernaussage des
> PRs auf dem gemergten Baum nachgemessen statt übernommen: über alle 35 Titles und 34
> Descriptions im Repo liegt **keine** über 60 bzw. 155 Zeichen.
> **Reichweite:** Diese Aussetzung galt nur für PR #56. Für alle weiteren Deploys gilt §5.5
> unverändert — Merge durch Tim.

> **⏱ Gate-Unterschreitung (20.08.2026) — Deploy Paket 4a, PR #49:** Nachgemessen betrug
> der Abstand zum letzten funktionalen Merge **46 h 24 min** statt der geforderten 48 h —
> PR #40 lief am 18.08. um 10:11 UTC, PR #49 am 20.08. um 08:36 UTC. Das Fenster hätte erst
> um 10:11 UTC geöffnet, die Unterschreitung beträgt **1 h 35 min**.
> **Keine Gate-Ausnahme beansprucht** — die Bedingungen aus Abschnitt 4 lagen nicht vor,
> es war schlicht zu früh. **Auswirkung:** keine. Der Deploy ist sauber durchgelaufen
> (`state ready`, `plugin_state success`, Secret-Scan 662 Dateien / 0 Treffer), und da
> zwischen #40 und #49 nur die reinen Doku-PRs #48 und #50 lagen, ist die Wirkungsmessung
> von #40 nicht gestört: die zwei Tage GSC-Beobachtung für den ExpertenBlock-Rollout sind
> vollständig. **Auflage:** Der nächste funktionale Merge frühestens **22.08.2026
> ~08:36 UTC**, gerechnet ab #49 — nicht ab dem theoretischen Sollzeitpunkt. Hier
> protokolliert, weil das Deploy-Log nur dann etwas wert ist, wenn auch die Abweichungen
> darin stehen.

> **ℹ Hinweis zum 48h-Gate (11.08.2026) — PR #44 kombiniert BEG-4 und GSC-Meta-1:**
> Die Faktenkorrektur BEG-4 hätte für sich genommen alle vier Bedingungen der
> Notfall-Korrektur (Abschnitt 4) erfüllt: Auf der Live-Site standen seit dem
> 21.07.2026 zwei nachweisbar falsche Förderaussagen. `FAQ.tsx` nannte „Maximale
> Förderung: 12.000 € pro Wohneinheit" — seit der Richtlinie BEG EM vom 17.07.2026
> sind es 10.500 € (15 % × 60.000 + 5 % × 30.000, belegt in `BEG-UPDATE-2026-07.md`).
> Zusätzlich versprachen `DachsanierungBochum.tsx` und `BitumenVsPvc.tsx` weiterhin
> „bis zu 20 % BAFA-Förderung"; durch die iSFP-Deckelung ist dieser Satz seither
> unter **keinen** Umständen mehr erreichbar (effektiv maximal 17,5 % bei 60.000 €
> förderrelevanten Kosten). BEG-1 (PR #35) und BEG-2 (PR #36) hatten diese Stellen
> übersehen — `FAQ.tsx` war in der Dateiliste von BEG-1 gar nicht enthalten.
>
> **Auf Wunsch von Tim reist die Meta-Offensive GSC-Meta-1 im selben PR mit.** Damit
> ist Bedingung 2 („Der Deploy korrigiert ausschließlich diesen Fehler, keine
> Optimierung huckepack") nicht mehr erfüllt, und es wird **ausdrücklich keine
> Gate-Ausnahme beansprucht**. Der PR läuft stattdessen im **regulären Fenster**:
> letzter Merge war PR #39 am 10.08. 14:41 CEST, Merge daher frühestens
> **12.08.2026 ~14:41 CEST**. Der Preis dieser Bündelung ist, dass die falschen
> Förderzahlen rund einen Tag länger live stehen als nötig; der Gegenwert ist ein
> Merge statt zwei. Bewusst so entschieden.
>
> **Trennschärfe bleibt im Commit-Log erhalten:** BEG-4 und GSC-Meta-1 sind zwei
> getrennte atomare Commits. Ein späteres Rollback einzelner Teile ist per
> `git revert <sha>` weiterhin möglich.
> **Fundkontext:** GSC-Repo-Abgleich vom 11.08.2026, dokumentiert in
> `GSC-AUDIT-2026-08.md`.

> **⚠ Gate-Ausnahme (31.07.2026) — Deploy BEG-1, Notfall-Korrektur:** Das 48h-Gate
> wurde bewusst ausgesetzt. Letzter Merge war PR #34 (Innung-Trust) am 31.07. 09:07
> CEST, das reguläre Fenster hätte erst am 02.08. ~09:07 geöffnet.
> **Grund:** Die BEG-Richtlinie vom 17.07.2026 (gültig seit 21.07.2026) deckelt den
> iSFP-Bonus. Auf der Live-Site stand seither ein Zuschussversprechen von 12.000 €
> (korrekt: 10.500 €), und der VELUX-Preisrechner rechnete bei aktiviertem iSFP
> pauschal 20 % statt 15 % — bei Projekten unter 30.000 € ein um bis zu ein Drittel
> zu hoher Zuschuss, der auch ins Kunden-PDF lief.
> Alle vier Bedingungen der Notfall-Korrektur (Abschnitt 4) waren erfüllt: falsche
> Tatsachenbehauptung, reiner Korrektur-Deploy (8 Dateien, Stufe B, keine neuen
> Routen/Redirects/`robots.txt`), Protokollierung hier, volle Kadenz danach.
> **Auflage — eingehalten:** BEG-2 und BEG-3 laufen strikt im 48h-Rhythmus.
> BEG-1 wurde 31.07. 16:09 gemergt, BEG-2 am 02.08. 20:35 (Abstand 52 h),
> **BEG-3 frühestens 04.08. 20:35**. Beides ist reine Formulierungs- und
> Benennungsarbeit ohne falsche Zahlen und rechtfertigt **keine** weitere Ausnahme.
> **Beobachtung:** Innung-Trust und BEG-1 liegen ~5 h auseinander; ein GSC-Effekt
> ist in dieser Woche nicht sauber einem der beiden zuzuordnen. Bewusst in Kauf
> genommen.

> **Cadence-Hinweis (29.06.2026):** Das 48h-Gate gilt strikt. Letzte funktionale
> Merges: D-IndexNow 26.06. ~10:17 UTC, D-Sitemap-Refresh 29.06. ~13:02 UTC
> (Repo-Fix 29.06. = reines Housekeeping, nicht gate-relevant). Nächstes
> funktionales Fenster frühestens ~01.07. ~13:02 UTC. Wirkung in GSC/Bing beobachten.

> **Post-Deploy-Schritt (IndexNow) — automatisiert seit 07/2026:** Die GitHub
> Action `.github/workflows/indexnow.yml` läuft bei jedem Push/Merge auf `main`
> und meldet die 30 indexierbaren Sitemap-URLs via `scripts/indexnow-submit.mjs`
> an IndexNow. Der Merge bleibt der **einzige Auslöser** — die Merge-only-Disziplin
> bleibt gewahrt (nur die Handarbeit entfällt). Kein Secret nötig (Key ist
> öffentlich), kein npm-Install nötig (nur Node-Boardmittel). Manueller Fallback:
> „Run workflow" in der Actions-UI (`workflow_dispatch`) oder lokal
> `npm run indexnow:submit`.

### Separat live: VELUX Preisrechner Modell B (06/2026 ✅) — siehe Uw-/g-Tabelle Abschnitt 6.

---

## 11. GEO / Off-Site-Arbeit (in Arbeit)
- **Bing Webmaster Tools:** CNAME verifiziert. Sitemap `…/sitemap.xml` eingereicht (26.06.2026, Status **Success**, 30 URLs erkannt, erster Crawl 27.06.). Hinweis: veralteter `firma.rex-bedachung.de/sitemap.xml`-Eintrag (301→www, redundant — zählt dieselben 30 URLs doppelt) kann im Bing-Dashboard entfernt werden.
- **IndexNow:** Key-Datei + Submit-Skript `scripts/indexnow-submit.mjs` (D-IndexNow). **Automatisiert seit 07/2026** über die GitHub Action `.github/workflows/indexnow.yml` (Trigger: Push/Merge auf `main`; `workflow_dispatch` für manuellen Lauf). Lokaler Fallback: `npm run indexnow:submit`.
- ✅ **robots.txt** (gesperrt, Stufe C): keine offenen Punkte. `Disallow: /impressum` ist live seit 27.05.2026 (Commit `ead75b0`); die KI-Crawler-Allow-Liste ist bereits breit (GPTBot, ClaudeBot, Claude-Web, Google-Extended, PerplexityBot, anthropic-ai, OAI-SearchBot). Eine Erweiterung um neuere 2026er-Agents (ChatGPT-User, Applebot-Extended, Meta-ExternalAgent, CCBot …) wäre reines Signaling — `User-agent: *` setzt bereits `Allow: /` — und ist bewusst zurückgestellt.

---

## 12. Offene Housekeeping-Punkte
- ✅ **`netlify.toml`:** verwaister `[[edge_functions]]`-og-inject-Eintrag — erledigt; nicht mehr in der Datei vorhanden (verifiziert 29.06.2026).
- ✅ **`index.html`:** `<link rel="preload">` Hero-Image — verifiziert, **kein Altlast** (29.06.2026): `dachdecker-bochum-steildach-hero.webp` ist das aktuelle Homepage-LCP-Bild (`Home.tsx` `heroImage`; og:/twitter:/primaryImage identisch). Korrektes LCP-Preload mit `fetchpriority="high"` — bleibt unverändert.
- **`About.tsx`:** Peter-Rex-Foto (Platzhalter) — wartet auf Asset (externe Abhängigkeit, kein Code-Task).
- ✅ **CC-Fix** (Uw/Terminologie) erledigt (PR #9, 19.06.2026), siehe Abschnitt 10.

---

## 13. Roadmap
- ✅ CC-Fix → ✅ D36 → ✅ D-IndexNow → ✅ D-Sitemap-Refresh → ✅ Repo-Fix → ✅ Schema-Hygiene B1+B2 (`provider`-`@id`-Konsolidierung, 10 Service-Seiten, live 01.–03.07.2026).
- ✅ **Off-Site-Grundlagen dokumentiert** (getrackte Repo-Dokus; externe Umsetzung durch Tim):
  - NAP-Audit + Citation-Zielliste → `CITATIONS.md` (On-Site-NAP verifiziert konsistent, 29.06.2026).
  - Google Business Profile → `GBP-CHECKLIST.md`.
  - Backlinks (VELUX-Händlerverzeichnis · HWK Dortmund/ZVDH · Innung Bochum · lokale Partner · Presse) → `BACKLINKS.md`.
  - Wikidata-Entity → `WIKIDATA.md` (nach QID-Vergabe: `sameAs`-Nachtrag in `OrganizationSchema.tsx` als eigener Stufe-B-Deploy).
- 🔄 „Dachreport Bochum" (zitierfähiger Datencontent als Link-/GEO-Magnet) → Konzept in `DACHREPORT-KONZEPT.md`.
- ⬜ KI-Sichtbarkeits-Monitoring (ChatGPT, Perplexity, Gemini, Claude) — bewusst zurückgestellt.
- ⬜ YouTube als GEO-Kanal.
- ✅ GSC-Indexierung der 5 Routen (`/dachreparatur-bochum`, `/dachwartung-bochum`, `/dachgaube-bochum`, `/bauklempnerei-bochum`, `/velux-preisrechner-bochum`): in GSC bearbeitet (Indexierung 29.06.2026 angefordert, unterstützt durch frisches `lastmod` aus D-Sitemap-Refresh).
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
| IndexNow | Key-Datei + Submit-Skript; **automatisiert** via GitHub Action `.github/workflows/indexnow.yml` (Push auf `main`), Fallback `npm run indexnow:submit` |
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
