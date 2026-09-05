# Umsetzungsplan September 2026 — Audit vom 05.09. und WebMCP-Ausbau

**Zweck:** Das externe Website-/Repo-Audit vom 05.09.2026 (`RexAudit20260905.md`) in eine
abarbeitbare Reihenfolge bringen, die sich mit dem laufenden WebMCP-Ausbau verträgt, statt
mit ihm zu konkurrieren.

**Stand:** 05.09.2026 · `main` = `8b79926` (PR #69) · letzter funktionaler Merge **PR #65 am
03.09.2026, 17:39 MESZ** → nächstes 48-h-Fenster ab **05.09.2026, 17:39 MESZ**.

**Löst ab:** `UMSETZUNGSPLAN.md` (Juli-Audit, abgearbeitet) und `GSC-AUDIT-2026-08.md` §6/§8
(abgearbeitet). Beide bleiben als Herkunftsnachweis stehen; neue Arbeit wird **hier** priorisiert.

**Governance unverändert** (`DEPLOY-RULES.md`): 48 h zwischen funktionalen Deploys, auch bei
Env-/Flag-Deploys · ein atomarer Commit pro Deploy · Stufen A ≤12 / B ≤8 / C ≤5 Dateien
(Log zählt mit) · `attached_assets/` nie committen · Merge nur durch Tim · Redirects nur in
`netlify.toml` · `robots.txt` gesperrt.

> **Was am 05.09. verifiziert wurde (nicht nur aus dem Audit übernommen):**
> `ExpertenBlock.tsx` zeigt `__BUILD_DATE__` als Prüfdatum · `OrganizationSchema.tsx` nutzt
> `foundingYear` · `VeluxPreisrechner.tsx:376` prüft §35c nur über „älter als 5 Jahre" +
> Sanierung, Steuerbasis = Bruttobetrag inkl. THERMO · `App.tsx:102` hat einen leeren
> Suspense-Fallback · die fünf WebMCP-Branches basieren auf `889a9e8` (PR #68) und liegen
> **6 Commits hinter `main`** (Chunk-Robustheit #65, Doku #69). **Rebase ist konfliktfrei**:
> `main` änderte seitdem nur `App.tsx`, `main.tsx`, `ChunkErrorBoundary.tsx`,
> `chunkRecovery.ts` und Dokus — nichts davon berühren die Branches. Offene PRs: keine.

**Legende:** 🧑‍💻 Claude im Repo · 🌐 Tim außerhalb des Repos · 🔁 Prozess · ⛔ Gate (Bedingung
vor Merge) · **P0** falsche Tatsachenaussage live · **P1** Conversion/Extraktion/Vertrauen ·
**P2** Hebel nach Messung/Belegen.

---

## 1. Grundidee: drei Spuren, eine Deploy-Kette

Der WebMCP-Ausbau ist **kein separates Projekt neben dem Audit**. Seine ersten beiden Schritte
(PR-1a Rechenlogik isolieren, PR-1b Steuer-/Förderlogik) **sind** die Audit-Pakete D-A02a und
D-A02b. Alles Weitere an WebMCP (Resolver, Adapter, Tools, Aktivierung) baut darauf auf und
darf erst nach dem fachlich korrekten Rechner live gehen.

Deshalb gibt es genau **eine** Deploy-Kette im 48-h-Takt. Darin wechseln sich zwei Arten von
Paketen ab, damit jedes Paket während des Wartens auf das nächste Fenster in Ruhe geprüft wird:

| Spur | Inhalt | Wer | Deploy? |
|---|---|---|---|
| **1 · Website-Pakete** | Fakten, Kontaktwege, FAQ-HTML, Layout, Links, Hygiene (D-A01, 03–08) | 🧑‍💻 vorbereiten, 🌐 mergen | ja, in der Kette |
| **2 · VELUX/WebMCP-Kette** | D-A02a → D-A02b → D-W01 → D-W02 → D-W03 → D-W04 | 🧑‍💻 Branches, 🌐 Freigaben/Tests | ja, in der Kette |
| **3 · Ohne Deploy** | NAP/GBP/GSC, Fachreviews, Katalog-Freigabe, Sicherheits-Triage, Tooling, Belege | überwiegend 🌐 | nein — jederzeit parallel |

**Optimierungsregel:** Ein Fenster bekommt abwechselnd ein Spur-1- und ein Spur-2-Paket. Fällt
ein Paket aus (Abnahme offen, Gate nicht erfüllt), rückt das nächste konfliktfreie Paket nach.
Es wird **nicht** automatisch alle 48 h veröffentlicht.

---

## 2. Prioritätenliste (Rang = Reihenfolge, nicht Termin)

| Rang | Paket | Prio | Spur | Stufe · Dateien | Abhängigkeit / Gate |
|---|---|---|---|---|---|
| 0 | **D-A00** Externe Korrekturen, Messung, Backlog | P0 | 3 | Doku, kein Deploy | sofort, parallel zu allem |
| 1 | **D-A01** Solar-/Umfeldmaßnahmen-Fakten synchronisieren | P0 | 1 | B · 8 | Fenster ab 05.09. 17:39 |
| 2 | **D-A02a** VELUX-Rechenlogik isolieren (PR-1a), Steueranzeige vorübergehend aus | P0 | 2 | B · 8 | Rebase auf `main`; ≥48 h nach A01 |
| 3 | **D-A03** Navigation, Formularlabels, Formularanker | P1 | 1 | B · 4 | keine |
| 4 | **D-A02b** Steuer-/Förderprüfung berichtigen (PR-1b selektiv) | P0 | 2 | B · 7 | ⛔ Grenzfallreview, FAQ-Text „älter als zehn Jahre" |
| 5 | **D-A07** FAQ-/Solarpflicht-Antworten im initialen HTML | P1 | 1 | B · ≤5 | nach A01 (gleiche Datei `Solarpflicht.tsx`) |
| 6 | **D-A04** Rechner-Layoutsprung (CLS 0,92) und Hero-Entdeckung | P1 | 1 | C · ≤5 | ⛔ Ursache im Preview reproduziert; nach A02b und A03 |
| 7 | **D-A05** Echter Prüfvermerk statt Builddatum | P1 | 1 | B · 6 | ⛔ Tims Fachreview mit Datum je Seite; nach A01/A07 |
| 8 | **D-W01** Typenschild-Resolver | P2 | 2 | B · 6 | ⛔ Alt-Code-Katalog fachlich freigegeben |
| 9 | **D-A08a** Kontextlinks Sanierung/Reparatur/Wartung | P1 | 1 | B · 7 | nach A01 (`WannLohntSich…`) |
| 10 | **D-W02** WebMCP-Adapterkern, Flag aus | P2 | 2 | B · 8 | nach W01; keine Paketkollision mit A11 |
| 11 | **D-A06** Impressum (DDG/ODR), Home-VELUX-Text, `foundingDate` | P1 | 1 | B · 4 | ⛔ Rechtstext geprüft |
| 12 | **D-W03** Tools, Bridge, Validator, Smoke-Test — weiterhin aus | P2 | 2 | B · 7 | ⛔ `WEBMCP.md`/README vorher als Doku-PR |
| 13 | **D-A08b** Lexikon/FAQ/Bitumen-PVC/Förderung → Leistungen | P1 | 1 | B · 5 | nach A02b, A05, A07 |
| 14 | **D-W04** Browser-/Agent-Abnahme, dann optionale Aktivierung | P2 | 2 | C · Env + Log | ⛔ Origin Trial, echter Chrome-Test, 10/10 Evals, Rollback geprobt |
| — | **D-A10** Prerender-Check auf echten Build + Kadenz | P1 | 3 | Tooling · 3 | jederzeit; kein `dist/public` |
| — | **D-A11** npm-Audit gezielt beheben | P1 | 3→1 | C · ≤5 je Paket | ⛔ Erreichbarkeit triagiert; nie mit Content mischen |
| — | **D-A09** Projektbelege, Peter-Rex-Foto, Bildgrößen | P2 | 1 | B · ≤8 | ⛔ echte Assets vorhanden |
| — | **D-A12** Suchintention Flachdach/Gründach, Förderung/Steildach-Förderung | P2 | 1 | B · 6 | ⛔ GSC-Nachweis über Wochen |
| — | **D-A13** Dachreport Bochum | P2 | 1 | C · 5 | ⛔ Datenbasis, Methodik, Quellen |

**Nicht in dieser Planung:** PR-P2 Foto-/Typenschilderkennung, PR-2b Telemetrie-Sink, PR-3
Lead-Service. Jeder braucht eine eigene fachliche und Datenschutz-Abgrenzung, bevor er einen
Platz in der Kette bekommt.

---

## 3. Deploy-Kette mit frühesten Terminen

Termine = frühestmögliches Fenster bei lückenloser Kette. Sie sind eine Obergrenze des Tempos,
keine Pflicht. Jede Zeile setzt ein grünes Preview und Tims Merge voraus.

| Slot | Frühestens (MESZ) | Paket | Spur | Warum an dieser Stelle |
|---|---|---|---|---|
| 1 | Sa 05.09., 17:39 | **D-A01** Solar/Umfeld-Fakten | 1 | Breitester Widerspruch (4 Seiten + llms); reine Text-/Datenkorrektur, kein Logikrisiko |
| 2 | Mo 07.09., 17:39 | **D-A02a** Rechenlogik isolieren | 2 | Fundament für 02b und alles WebMCP; Steueranzeige aus → falsche Zahl verschwindet 48 h früher |
| 3 | Mi 09.09., 17:39 | **D-A03** Kontaktwege | 1 | Höchster Conversion-Hebel bei kleinstem Eingriff; kollidiert mit nichts Laufendem |
| 4 | Fr 11.09., 17:39 | **D-A02b** Steuer/Förderung | 2 | Steueranzeige kehrt fachlich korrekt zurück; 02a hatte 96 h Bewährung |
| 5 | So 13.09., 17:39 | **D-A07** FAQ-HTML | 1 | Extraktionshindernis; nach A01, weil `Solarpflicht.tsx` dort schon angefasst wurde |
| 6 | Di 15.09., 17:39 | **D-A04** Rechner-CLS | 1 | Braucht das stabile Rechnermodul aus 02b und `Contact.tsx` aus A03; nur wenn Ursache im Preview belegt, sonst A05 vorziehen |
| 7 | Do 17.09., 17:39 | **D-A05** Prüfvermerk | 1 | Tims Fachreview liegt bis dahin vor (Spur 3) |
| 8 | Sa 19.09., 17:39 | **D-W01** Resolver | 2 | Nur bei freigegebenem Katalog; sonst A08a vorziehen |
| 9 | Mo 21.09., 17:39 | **D-A08a** Kontextlinks | 1 | Quick Wins 4–5; keine Kollision |
| 10 | Mi 23.09., 17:39 | **D-W02** Adapterkern | 2 | Technische Vorarbeit ohne sichtbare Änderung |
| 11 | Fr 25.09., 17:39 | **D-A06** Impressum/Home/Schema | 1 | Rechtstext-Prüfung bis dahin erledigt |
| 12 | So 27.09., 17:39 | **D-W03** Tools/Bridge | 2 | Doku vorher separat; Flag bleibt aus |
| 13 | Di 29.09., 17:39 | **D-A08b** Wissensseiten-Links | 1 | Erst jetzt, weil Rechner (02b) und FAQ-HTML (A07) live sind |
| 14+ | Oktober | **D-W04**, dann je nach Belegen A09 / A12 / A13; A11 nach Triage dazwischen | 2/1 | Alle hinter harten Gates |

**Wenn ein Slot ausfällt:** Das nächste Paket derselben Spur, das keine gemeinsame Datei mit
dem offenen Paket hat, rückt vor (siehe Kollisionskarte §4). Die Reihenfolge innerhalb der
VELUX-Kette (02a → 02b → W01 → W02 → W03 → W04) ist fix.

---

## 4. Kollisionskarte (welche Pakete sich eine Datei teilen)

Pakete mit gemeinsamer Datei laufen **nacheinander**; der spätere Branch wird erst nach dem Merge
des früheren von `main` abgezweigt oder darauf rebased. Das vermeidet Merge-Konflikte und
Doppelarbeit an derselben Stelle.

| Datei | Pakete in Reihenfolge |
|---|---|
| `C/VeluxPreisrechner.tsx` | A02a → A02b → W03 |
| `P/VeluxPreisrechnerBochum.tsx` | A02b → A04 |
| `P/Contact.tsx` | A03 → A04 |
| `P/Solarpflicht.tsx` | A01 → A07 → A05 |
| `P/DachPhotovoltaikBochum.tsx`, `P/DachsanierungBochum.tsx` | A01 → A05 |
| `P/WannLohntSichDachsanierung.tsx` | A01 → A08a |
| `P/Foerderung.tsx` | A05 → A08b → A12 |
| `P/FAQ.tsx` | A07 → A08b |
| `P/FlachdachBochum.tsx` | A08a → A12 |
| `L/velux/estimate.ts`, `scripts/velux-estimate-check.ts` | A02a → A02b → W01 → W03 |
| `package.json`, `package-lock.json`, `tsconfig.json` | A02a → W02 → A11 (A11 nie im selben Fenster wie W02) |
| `Pub/llms.txt`, `llms-full.txt`, `sitemap.xml` | A01 → (A09 / A12 / A13 nur mit echtem `lastmod`) |
| `client/src/App.tsx` | A04 → A13 |

Alles außerhalb dieser Karte (z. B. `Navigation.tsx`, `ContactForm.tsx`, `ExpertenBlock.tsx`,
`Impressum.tsx`, `Home.tsx`, `OrganizationSchema.tsx`, `DachLexikon.tsx`, `BitumenVsPvc.tsx`,
`SteildachBochum.tsx`, `AufsparrendaemmungBochum.tsx`, `GruendachBochum.tsx`,
`Dachreparatur.tsx`, alle `webmcp`-/`bridge`-/`tools`-/`validate`-Dateien) kann jederzeit
parallel in eigenen Branches vorbereitet werden.

---

## 5. Paketkarten

### D-A00 · Extern, Messung, Backlog — sofort, ohne Deploy
🌐 **Tim, diese Woche:**
- Dachdecker-Innung Bochum: Firmenname → **Rex Bedachungs GmbH**, Fax → **0234 583137**
  (583126 ist WhatsApp). Adresse und Haupttelefon stimmen bereits.
- Google Business Profile: Beschreibung „VELUX-Fachbetrieb" → **„autorisierter VELUX-Partner"**;
  angezeigte Geschäftsbezeichnung gegen die tatsächlich geführte prüfen, keinen Keyword-Anhang.
- DasTelefonbuch: Kartenpunkt gegen Paulinenstraße 22 prüfen.
- Search Console → Einstellungen → „Search generative AI": Einschluss (Standard) samt Vererbung
  kontrollieren. Kein robots-Thema.
- Lokale Kopien `Documents/rex-website` und `Documents/rex-website-main` als veraltet
  kennzeichnen; nie daraus deployen.

🌐 **Ab 08.09. — GSC-Auswertung** (entscheidet über A12 und jeden weiteren Title-Test):
- Search-generative-AI-Leistungsbericht als eigene Baseline sichern (Seite/Datum/Gerät).
- Meta-1/2/3 getrennt nach Änderungsdatum und Zielseite, ≥28 Tage, vergleichbare Zeiträume.
- Brand/non-brand, Mobil/Desktop, Region trennen; Query-Page-Paare statt Gesamt-CTR.
- Kannibalisierungs-Kriterium: dieselbe Anfrage wechselt über Wochen zwischen URLs **und**
  verliert dabei Klicks/Position. Zwei URLs mit Impressionen reichen nicht.

🌐 **KI-Baseline, klein und manuell:** fünf Fragen (Marke, Anbieterwahl, Schadensfall,
Fachinfo, Kontakt) je in ChatGPT mit Websuche, Perplexity, Gemini, Claude mit Websuche,
Google AI Overview. Je Test: Datum, Produkt, Websuche an/aus, Standort, Rex-Erwähnung,
zitierte URL, Faktenfehler. Mehrfach wiederholen. Keine Automatisierung vor brauchbarer
Baseline.

🧑‍💻 **Doku (dieser PR und Folge-PR):** dieser Plan; `CITATIONS.md` um die Spalten Feld / Ist /
Soll / Antrag / Kontrolltermin und die Innungs-Zeile ergänzen; `DEPLOY-RULES.md` §10 um den
Hinweis „Branch-Backlog: fünf WebMCP-Branches, nicht live" ergänzen.

### D-A01 · Solar-/Umfeldmaßnahmen-Fakten — P0, Stufe B, 8 Dateien
**Dateien:** `P/Solarpflicht.tsx`, `P/DachPhotovoltaikBochum.tsx`, `P/DachsanierungBochum.tsx`,
`P/WannLohntSichDachsanierung.tsx`, `Pub/llms.txt`, `Pub/llms-full.txt`, `Pub/sitemap.xml`, Log.

**Inhalt:**
- Eine freigegebene Kernaussage zur SAN-VO NRW: Ausnahme für Gebäude mit **Nutzfläche bis
  einschließlich 50 m²**; bei vollständiger Erneuerung der Dachhaut zählt die **Nettodachfläche**
  für die Flächenquote; Ausnahmen und Erfüllungsoptionen gesondert. Begriffe in Formular,
  Ergebnis und FAQ identisch.
- Solar-Check: ohne Nutzfläche und Ausnahmen kein Pflichturteil, sondern „Prüfung erforderlich".
- `DachsanierungBochum.tsx:196`: „vollständig mitgefördert"/„automatisch förderrelevant" →
  mögliche notwendige Umfeldmaßnahme einer konkret förderrelevanten Dämmmaßnahme; Anerkennung
  und Umfang prüfbar lassen. Sichtbare Antwort und FAQ-Schema gemeinsam.
- `llms*.txt`: gleiche Solar-Fakten; Modellumfang **19** statt 18 Größen; Rechner-URL eindeutig.
- `sitemap.xml`: nur die vier geänderten Seiten mit echtem `lastmod`.

**Nicht:** neue Förderhöhen, neue Solar-Landingpage, neue Preise.
**Abnahme:** `npm run check`, `build`, `faq:check`; Preview jeder der vier Routen; Begriffe
quer über die vier Seiten gegenlesen.

### D-A02a · VELUX-Rechenlogik isolieren — P0, Stufe B, 8 Dateien
**Quelle:** Branch `claude/webmcp-velux-price-calculator-106a6c` (PR-1a, `a5ff39e`), rebased auf
aktuelles `main`.
**Dateien:** `C/VeluxPreisrechner.tsx`, `L/velux/catalog.ts`, `L/velux/estimate.ts`,
`scripts/velux-estimate-check.ts`, `package.json`, `tsconfig.json`, `.github/workflows/checks.yml`, Log.

**Inhalt:** Katalog und Rechnung aus der Komponente lösen; Goldwerte in CI; UI und PDF nutzen
dieselbe Funktion. **Zusätzlich:** Ausgabe des §35c-Steuerbonus in UI, PDF und Textexport
vorübergehend deaktivieren (Hinweis „Steuerbonus wird derzeit überarbeitet"), bis 02b live ist.
Das nimmt die falsche Zahl 48 h früher vom Netz, ohne die Notfall-Klausel zu ziehen.

**Nicht:** neue Preise, keine Förderlogik ändern (das ist 02b), kein WebMCP-Code.
**Abnahme:** Goldwerte identisch zum Live-Stand für alle Modell-/Größen-/Verglasungs-
Kombinationen; UI = PDF = Export; `ChunkErrorBoundary` unverändert.

### D-A03 · Kontaktwege — P1, Stufe B, 4 Dateien
**Dateien:** `C/Navigation.tsx`, `C/ContactForm.tsx`, `P/Contact.tsx`, Log.
- Desktop-Menü erst ab Breite, in der es vollständig passt (bei 1.280 px läuft die CTA bis
  x=1436 aus), oder kompaktere Gruppierung; Leistungsmenü per Klick/Enter, Escape,
  `aria-expanded`.
- Formular: IDs, `label`/`htmlFor`, `autocomplete`, verständliche Fehlermeldungen.
- Früher Formularanker und kompakterer Einstieg auf `/kontakt` (Formular begann bei y≈2824).
- Versteckte Netlify-Formularvorlage **nicht** entfernen.

**Abnahme:** 1.024 / 1.280 / 1.440 px, Tastatur, Touch; danach interner Testversand durch Tim.

### D-A02b · Steuer-/Förderprüfung — P0, Stufe B, 7 Dateien
**Quelle:** Branch `…-1b` (`338b65b`), **selektiv** übernommen.
**Dateien:** `C/VeluxPreisrechner.tsx`, `L/velux/content.ts`, `L/velux/estimate.ts`,
`L/velux/funding.ts`, `P/VeluxPreisrechnerBochum.tsx`, `scripts/velux-estimate-check.ts`, Log.

**Inhalt:** BEG und §35c getrennt; §35c nur bei Gebäude **älter als zehn Jahre**, Eigennutzung
und Uw ≤ 1,0 W/(m²K); fehlende Angaben = „unbekannt" = keine Zusage; THERMO nie in der
§35c-Basis; beide Wege als nicht kombinierbare Szenarien ohne „Gewinner". Seitentext und
Rechner sagen dasselbe. **Vor Übernahme:** FAQ-Text „ab 10 Jahren" → „älter als zehn Jahre".

⛔ **Gate:** Grenzfalltabelle abgenommen — Alter <5 / 5–10 / >10 / unbekannt × Eigennutzung
ja/nein/unbekannt × THERMO allein / gemischt; UI = PDF.
**Nicht:** neue Preis- oder Kostendaten; kein WebMCP-Code.

### D-A07 · Antworten im initialen HTML — P1, Stufe B, ≤5 Dateien
**Dateien:** `P/FAQ.tsx`, `P/Solarpflicht.tsx`, optional `C/ui/accordion.tsx` nur falls nötig,
ein HTML-Prüfskript (Erweiterung von `scripts/faq-schema-check.mjs`), Log.
Antworttexte immer im DOM, nur visuell eingeklappt (native `details` oder persistentes
Accordion). Test prüft die tatsächliche HTML-Ausgabe, nicht nur das Schema.
**Nicht:** globale Accordion-Änderung, FAQ-Massenproduktion.

### D-A04 · Rechner-Layoutsprung — P1, Stufe C, ≤5 Dateien
**Dateien:** `client/src/App.tsx`, `P/VeluxPreisrechnerBochum.tsx`, `P/Contact.tsx`, max. ein
vorhandenes Hero-Asset, Log.
⛔ **Gate:** Im Preview per Filmstrip belegen, dass der leere Suspense-Fallback plus spät
entdecktes Hero-Bild den Footer-Sprung verursacht. Dann: Platzhalter mit reservierter Höhe
während des Routenladens, Hero-Bild früher verfügbar. `lazy()` bleibt.
**Abnahme:** ≥3 kalte mobile Lighthouse-Läufe vorher/nachher, Ziel CLS ≤ 0,1; keine
Verschlechterung auf `/` und `/kontakt`. LCP separat.
**Nicht:** eager Imports, Prerender-System, `manualChunks`.

### D-A05 · Echter Prüfvermerk — P1, Stufe B, 6 Dateien
**Dateien:** `C/ExpertenBlock.tsx`, `P/Foerderung.tsx`, `P/Solarpflicht.tsx`,
`P/DachPhotovoltaikBochum.tsx`, `P/DachsanierungBochum.tsx`, Log.
`__BUILD_DATE__`-Vermerk entfernen; optionales `reviewedAt` je Seite nur nach echtem Review;
Autor, Prüfdatum und Primärquelle bei Förder-/Rechtsinhalten zusammen. Seiten ohne Review
zeigen keinen Vermerk.
⛔ **Gate (🌐 Tim, Spur 3):** Fachreview der vier Seiten mit Datum und Quelle. Das ist
gleichzeitig der erste Lauf der Quartalsroutine (bisher P1.3, offen seit Juli).
Weitere Seiten später in Batches ≤8.

### D-A06 · Rechts-/Entitäts-Hygiene — P1, Stufe B, 4 Dateien
**Dateien:** `P/Impressum.tsx`, `P/Home.tsx`, `C/OrganizationSchema.tsx`, Log.
Impressum auf DDG (§5) und eingestellte ODR-Plattform bringen — nicht mechanisch TMG→DDG
umnummerieren, Rechtstext prüfen lassen. `Home.tsx`: „VELUX & Roto Fachbetrieb" → „VELUX &
Roto", Status separat „autorisierter VELUX-Partner". `foundingYear` → `foundingDate` nur mit
belegbarem, validatorkonformem Wert; kein erfundener Gründungstag.

### D-A08a · Kontextlinks Sanierung/Reparatur/Wartung — P1, Stufe B, 7 Dateien
| Von | Nach | Anker im Hauptinhalt |
|---|---|---|
| `SteildachBochum.tsx` | `/dachsanierung-bochum` | Absatz vollständige Erneuerung |
| `AufsparrendaemmungBochum.tsx` | `/dachsanierung-bochum` | Dämmung + Neueindeckung |
| `FlachdachBochum.tsx` | `/dachreparatur-bochum` | lokaler Schaden statt Komplettsanierung |
| `GruendachBochum.tsx` | `/dachwartung-bochum` | Pflege/Ablaufkontrolle |
| `Dachreparatur.tsx` | `/dachwartung-bochum` | vorbeugender Folgecheck |
| `WannLohntSichDachsanierung.tsx` | `/dach-photovoltaik-bochum` | Absatz gleichzeitige PV-Planung |

### D-A08b · Wissensseiten zu Leistungen — P1, Stufe B, 5 Dateien
`DachLexikon.tsx` (sechs Begriffe → Flachdach, Aufsparrendämmung, Dachrinne, Dachfenster,
Gründach, Wartung), `FAQ.tsx` (Antworten zu Schaden/Wartung/Fenstertausch → passende
Serviceziele), `BitumenVsPvc.tsx` (vier Klartextpfade → Links), `Foerderung.tsx`
(→ `/dachfenster-bochum` bzw. Rechner, erst nach 02b), Log.

### D-A10 · Prerender-Check schärfen — Tooling, kein Site-Deploy
`.github/workflows/prerender-check.yml`, `scripts/prerender-check.mjs`, `PRERENDER-CHECK.md`.
Erwarteten Build-/Asset-Fingerprint mitprüfen (180 s Wartezeit beweist nicht den richtigen
Stand); tägliche Kernprüfung, seltener volle Sitemap; zusätzliche KI-User-Agents im Abruf,
robots unangetastet. Jederzeit als eigener PR, nicht gate-relevant.

### D-A11 · Paketbefunde — Stufe C, ≤5 Dateien je Paket
Stand: 30 betroffene Pakete (16 high, 10 moderate, 4 low, 0 critical), u. a. Vite,
Express/Multer/Drizzle. Erst 🧑‍💻 Triage ohne Deploy: welche Pfade sind in Netlify Functions,
Server-Deployments oder nur in Dev erreichbar? Dann nur tatsächlich erreichbare Risiken als
eigene Pakete, kompatible Updates, **kein `npm audit fix --force`**, nie mit Content oder W02
im selben Fenster.
Nebenrepos: `Velux-Foerderung` (Gemini-Key clientseitig) vor öffentlichem Einsatz serverseitig
umbauen; `Wartung` Firestore-Regeln real prüfen. Beides außerhalb dieser Kette.

### D-A09 / D-A12 / D-A13 — nur mit Belegen
- **A09** Referenzen vertiefen (Ausgangszustand, Auswahlgrund, Zeitraum, Detailfoto, Ergebnis),
  Peter-Rex-Foto in `About.tsx`, kleine Bildvarianten für Karten (Gründach-WebP 1,28 MB,
  JPEG-Fallbacks 6,21 / 4,09 MB). ⛔ echte Assets, max. drei Bilddateien pro Paket.
- **A12** Flachdach-H1 ohne Gründach, Förderung vs. Steildach-Förderung entflechten. ⛔ nur
  nach GSC-Nachweis; keine 301-Zusammenlegung ohne Beleg.
- **A13** Dachreport Bochum: `DACHREPORT-KONZEPT.md` weiterführen, Daten und Methodik zuerst.
  Route nur mit `lazy()`.

---

## 6. WebMCP-Spur im Detail

### Was ohne Deploy sofort läuft (🧑‍💻, parallel zu Slot 1–3)
1. Alle fünf Branches auf `main` (`8b79926`) rebasen — konfliktfrei, siehe Verifikation oben.
   Ergebnis: fünf saubere, aufeinander aufbauende Branches; **kein** 26-Dateien-Merge.
2. PR-1a als D-A02a zuschneiden (8 Dateien inkl. Log) plus Steueranzeige-Abschaltung.
3. PR-1b als D-A02b zuschneiden (7 Dateien), FAQ-Text präzisieren, Grenzfalltabelle als
   Testfälle in `velux-estimate-check.ts`.
4. `WEBMCP.md` und README-Abschnitt als **eigenen Doku-PR** konsolidieren, damit W03 unter
   8 Dateien bleibt. Dabei die Vorschläge zu verkürzter Abschaltfrist/„Env-Redeploy als
   Notfall" streichen: Aktivierung und Abschaltung sind funktionale Deploys im 48-h-Takt; nur
   ein echter Live-Fehler läuft über §4 Notfall-Korrektur wie jede andere Korrektur.
5. Kompatibilitätsbehauptungen in der Doku auf das Getestete zurückführen: Shim-Test ≠
   nativer Browser-Nachweis; nicht „funktioniert mit jeder KI".

### Gates, die Tim öffnet (🌐)
| Gate | Für | Wo |
|---|---|---|
| Alt-Code-Katalog fachlich freigeben (Checkliste 2001–2013, 1991–2001, vor 1991, Alt-/Sondertypen) | W01 | `VELUX-TYPENSCHILD.md` |
| Grenzfalltabelle Steuer/Förderung abnehmen | A02b | Paketkarte A02b |
| Origin-Trial-Registrierung, Token in Netlify-Production-Env, Kalender alle 5 Wochen | W04 | `WEBMCP.md` |
| Smoke-Test in echtem Chrome (≥150, Flag oder Origin Trial), Tool-Inspector, `getTools()` | W04 | `scripts/webmcp-smoke.mjs` |
| 10 Agent-Evals mit Protokoll, Go nur bei 10/10 | W04 | Eval-Vorlage in `WEBMCP.md` |
| Instant Rollback einmal real geprobt | W04 | Netlify |

### Reihenfolge (fix)
A02a → A02b → W01 → W02 → W03 → W04. Jeder Schritt ein eigener Deploy; W02 und W03 bleiben mit
Flag aus („Dark Deploy"); W04 ist ein reiner Env-Deploy mit Log-Eintrag und gilt als Stufe C.

### Abbruchkriterien nach Aktivierung
JS-Fehler auf der Rechner-Route, Tool-ausgelöster Netzwerkverkehr, Tool-Zahl ≠ UI-Zahl,
erfundene Förderzusage im Eval, PageSpeed-Verschlechterung außerhalb des Rauschens → Flag
entfernen + Redeploy, Log-Eintrag.

---

## 7. Abnahme je funktionalem Paket (Kurzfassung)

1. Aktuelles `main`, letzter funktionaler Deploy, 48 h, vollständiger Datei-Diff; kein
   `attached_assets/`.
2. `npm run check`, `npm run build`; bei FAQ/Schema `npm run faq:check`; bei Rechner
   `npm run estimate:check` (ab 02a) mit Grenzfällen und Exporttests.
3. Preview: Route direkt laden und über Navigation öffnen; Canonical, Meta, H1, Schema, mobil,
   betroffene Kontaktwege.
4. Nach Merge: Produktionsstand identifizieren, rohe Bot-Antwort prüfen (Prerender-Action);
   bei Layoutpaketen gleiche Lighthouse-Konfiguration.
5. Technische Fehler sofort; SEO-Wirkung erst über ausreichend lange vergleichbare Daten.

---

## 8. Nicht umsetzen (aus Audit J, damit es niemand wieder vorschlägt)

Neue Preise/Kostenseiten · Stadtteil-/Gewerbe-/Roto-Seiten · „zertifiziert" im VELUX-Kontext ·
SearchAction / on-site AggregateRating · robots-Änderungen für weitere Bots · Redirects
außerhalb `netlify.toml` · eager-Routen · zweite Solar-/Förderwebsite aus den Prototypen ·
Komplettmerge des WebMCP-Branches · WebMCP als Ranking-Hebel bewerben · verkürzte Env-Deploy-
Pausen · eigene SSR/Prerender-Pipeline oder Chunk-Refactoring · flächige Title-/Description-/
lastmod-Runden · 301-Zusammenlegungen ohne GSC-Beleg · FAQ-Massenproduktion ·
Dachreinigungsseite · YouTube-Kanal / großes KI-Monitoring / Datenreport ohne Daten ·
Massenlöschung unreferenzierter Dateien oder History-Rewrite.

---

## 9. Erfolgskriterien dieser Phase

- Keine widersprüchlichen Förder-/Solar-/Steueraussagen mehr auf Website, Rechner, PDF und
  `llms*.txt` (A01, A02a/b).
- Rechner mobil stabil: CLS ≤ 0,1 in drei kalten Läufen (A04).
- Alle Hauptkontaktwege per Maus, Tastatur und Touch bedienbar; Formular mit Labels (A03).
- Vorhandene FAQ-Antworten ohne Interaktion im HTML (A07).
- Innung und GBP mit korrekten Stammdaten und Partnerbezeichnung (A00).
- WebMCP: Rechner-Logik in geteilten Modulen mit CI-Goldwerten; Adapter und Tools dunkel
  deployt; Aktivierung nur nach echtem Browser- und Agent-Nachweis (W01–W04).
- Danach: mehr qualifizierte Anfragen aus Dachsanierung, Dachfenster/VELUX, PV und Flachdach,
  getrennt gezählt nach Einstiegsseite. Ranking- oder KI-Empfehlungsgarantien folgen daraus
  nicht.

---

## 10. Fortschritt

| Paket | Status | PR / Datum | Notiz |
|---|---|---|---|
| D-A00 | 🔄 | dieser Plan | Innung, GBP, GSC-Einstellung offen (🌐) |
| D-A01 | ⬜ | | |
| D-A02a | ⬜ | | Branch `…-106a6c`, Rebase ausstehend |
| D-A03 | ⬜ | | |
| D-A02b | ⬜ | | Branch `…-1b`, selektiv |
| D-A07 | ⬜ | | |
| D-A04 | ⬜ | | Ursache im Preview belegen |
| D-A05 | ⬜ | | Fachreview 🌐 |
| D-W01 | ⬜ | | Katalog-Freigabe 🌐 |
| D-A08a | ⬜ | | |
| D-W02 | ⬜ | | |
| D-A06 | ⬜ | | Rechtstext 🌐 |
| D-W03 | ⬜ | | Doku-PR vorher |
| D-A08b | ⬜ | | |
| D-W04 | ⬜ | | Origin Trial, Chrome, Evals 🌐 |
| D-A10 | ⬜ | | jederzeit |
| D-A11 | ⬜ | | Triage zuerst |
| D-A09 / A12 / A13 | ⬜ | | Belege / GSC / Daten |

> Dieses Dokument ist reine Repo-Doku (kein `dist/public`), nicht gate-relevant. Status hier
> nach jedem Merge fortschreiben; das Deploy-Log bleibt in `DEPLOY-RULES.md` §10.
