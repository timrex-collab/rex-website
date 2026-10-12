# Umsetzungsplan 10/2026: Datenschutz-Bereinigung, Typenschild-Foto und KI-Anfragen aus ChatGPT

Stand 12.10.2026. Freigegeben von Tim am 12.10.2026. Alle Pfade, Zeilen und Zahlen am 12.10.2026
um 12:40 MESZ gegen `origin/main` (`dfd1c26`) und den Netlify-Connector geprüft.

**Für spätere Claude-Sitzungen:** Dieser Plan ist der Arbeitsauftrag für die Pakete in Abschnitt 3.
Jedes Paket ist ein eigener Auftrag mit eigenem PR. Vor jedem Paket den aktuellen Stand prüfen
(`date`, `git fetch`, offene PRs, Deploy-Log in `DEPLOY-RULES.md` §10, Netlify). Neuere
ausdrückliche Anweisungen von Tim haben Vorrang. Die Regeln aus `CLAUDE.md` und
`DEPLOY-RULES.md` gelten unverändert.

## Auftrag und Ziel

- **Auftrag:** Den Plan „Remote MCP und mobile Kundenanfragen“ vom 04.10.2026 bewerten und einen
  realistischen, zu Tim passenden Umsetzungsplan erstellen. Abgeglichen mit Tims Prüfungen vom
  08.10. und 12.10.2026.
- **Ziel (Tim):** Kunden stellen in ChatGPT Anfragen, in Chat/Classic, Work, Codex und mobil, und
  Tim erhält sie. Der Preisrechner nimmt ein Foto des Typenschilds an und schickt es mit der
  Anfrage per Mail an Tim (als Link).

## Stand am 12.10.2026

- `main` steht auf `dfd1c26`, offene PRs gibt es keine.
- Nächstes 48-h-Fenster laut `DEPLOY-RULES.md` §10: **ab 14.10.2026, 01:06 MESZ**, gemessen am
  Produktionsdeploy von PR #97 (`published_at` 12.10.2026 01:05:24 MESZ).
  - PR #97 hatte das Gate verletzt (28 h 26 min nach #94). Seitdem prüft Claude vor jeder
    Merge-Angabe die Uhrzeit mit `date` und nennt ein festes Datum mit Uhrzeit.
  - Der Doku-Merge #98 hat um 01:17 MESZ ebenfalls einen Produktionsdeploy ausgelöst, aber ohne
    geänderte Dateien („All files already uploaded“). Wie bei #92, #93 und #95 zählt er nicht für
    das Fenster.
- Auf GitHub gibt es 8 Branches (`main`, die sechs VELUX-Branches D1–D6,
  `claude/trusting-gates-87xt4c`).
- Bisher gab es keine echte Rechner-Anfrage: 7 von 11 Einträgen waren leere Bot-Absendungen
  (PR #94).

## Entscheidungen Tim

- **08.10.2026:**
  - zuerst die WebMCP der Website;
  - Foto als Link in der Mail;
  - in der ersten Stufe gelten Browserwerte als unverbindlich;
  - Löschung monatlich mit Erinnerung;
  - keine Kontaktdaten im Link.
- **12.10.2026:**
  - Die Datenschutz-Nebenbefunde kommen vor P1.
  - ProvenExpert wird durch einen **statischen Link** ersetzt.
  - Der **Foto-Auftrag ist erteilt, mit Bedingungen:** Netlify-Kontingent geprüft (V1) und
    Datenschutztext von Codex gegengelesen.

## Bewertung des alten Plans (Kurzfassung)

Der Plan vom 04.10.2026 liegt nicht im Repo; hier steht nur das Ergebnis der Bewertung.

- **Richtig:** das Ziel und die Einsicht, dass „direkt aus ChatGPT, auch mobil“ einen eigenen
  Server-Endpunkt braucht. Die Website-WebMCP ist bisher nur in ChatGPT Desktop (Modus
  „Arbeiten“) nachgewiesen.
- **Zu früh und zu groß:** Infrastruktur wie eigene Datenbank, Outbox, Statusabruf,
  Betriebsansicht, OAuth, Server-PDF und Mail-Dienst. Ohne eine einzige echte Rechner-Anfrage
  ist dafür kein Bedarf belegt. Netlify Forms reicht als Eingang. Diese Bausteine stehen im
  Backlog, jeweils mit Auslöser.
- **Geändert:** Reihenfolge nach Nutzen und Risiko. Erst die Datenschutz-Nebenbefunde (B1, B2),
  dann Foto (P1) und die WebMCP-Korrektur aus Fall 4 (W1). Für den Server-Endpunkt zuerst ein
  billiger Machbarkeitsnachweis auf der Deploy-Preview (P4a); gebaut wird P4b erst nach Go.
  Öffentlich (P5) erst nach einem funktionierenden Gesamtvorgang.

---

## 1. Zielabdeckung je Stufe

| Stufe | Website (Kunde selbst) | ChatGPT Work/Codex (Desktop, Site tools) | ChatGPT Chat (Web/Desktop) | ChatGPT mobil |
|---|---|---|---|---|
| heute | Anfrage ✅, Foto ❌ | Vollständiger Vorgang am 08.10. nachgewiesen (Fall 4; Eingang bei Netlify ✅, Postfach ungeprüft). Bestätigung der Fensterzuordnung ❌ | Rex wird gefunden; Fremdpreise; keine Anfrage | wie Chat |
| nach P1 | Anfrage mit Foto ✅ | Foto nur, wenn der Kunde es selbst ins Formular legt | – | – |
| nach W1 | – | Bestätigung wird eingeholt; Link wird mitgeliefert | Link in den vorbefüllten Rechner, sofern ChatGPT ihn bildet | ebenso; WebMCP mobil **nicht nachgewiesen** |
| nach P4 (persönliches Plugin) | – | Plugin | Rex-Werte und Anfrage im Chat, **nur in Konten mit verbundenem Plugin** | abhängig von Konto und Plugin; Nachweis in P4a |
| nach P5 (öffentlich) | – | – | für Kunden auffindbar und verbindbar | ebenso |

- **Teilziel:** Bis W1 sind Website und Desktop-WebMCP abgedeckt.
- **Gesamtziel:** „Direkt aus ChatGPT, auch mobil“ braucht P4/P5.
- **Nachweis:** Es zählt nur ein vollständiger Vorgang, also Eingang in Netlify Forms **und** im
  Postfach.

## 2. Grundsätze

- **Eine Fachlogik** in `client/src/lib/velux`. Der Server-Endpunkt (P4) rechnet immer selbst neu.
- **Website bis W1:** Die Kostenschätzung entsteht im Browser und trägt den Vermerk „im Browser
  berechnet, unverbindlich“.
- **Netlify Forms ist der Anfrage-Eingang, die Mail nur Benachrichtigung.** Tim prüft den
  Spam-Bereich im Rhythmus der Lösch-Routine.
- **Datenschutztexte** liest Codex vor dem Merge gegen, wie bei #91. Das Ergebnis steht im PR. Es
  ist keine Rechtsberatung.
- **Fotos:** Claude überträgt selbst keine Fotos. Tests mit echten Fotos macht nur Tim
  (`CLAUDE.md`).
- **Kein neuer Anbieter und kein eigener Datenspeicher**, mit einer Ausnahme in P4b: Netlify Blobs
  nur für Idempotenz-Hashes, ohne Personendaten.
- **Ein atomarer Commit pro Deploy**, mit Dateigrenzen und Merge durch Tim. Den frühesten Merge
  nennt Claude nach `date` als festes Datum mit Uhrzeit.
- Keine neuen Preise oder Kosten. VELUX ausschließlich als autorisierter VELUX-Partner.

---

## 3. Pakete in Reihenfolge

### V – Vorab, ohne Deploy

1. **Netlify-Kontingent (Tim; Bedingung für P1):** In Netlify unter Team → Billing/Usage nachsehen:
   - Formulareinsendungen pro Monat;
   - Datei-Uploads: Größe pro Einsendung, Volumen bzw. Speicher pro Monat;
   - Credits.

   Ergebnis kurz notieren; Claude trägt es hier ein. Die Netlify-Seiten sind für Codex gesperrt,
   und der Connector zeigt keine Abrechnungsdaten. (Connector am 12.10.2026: Projekt auf Plan
   `nf_team_dev`, Forms aktiviert; Kontingente nicht sichtbar.)

   **Ergebnis V1:** _offen_
2. **Lösch-Routine auf monatlich (Claude):** Name und Zeitplan am 12.10.2026 umgestellt. Der
   Inhalt ist noch offen, siehe „Umgesetzt mit diesem Auftrag“.
3. **ChatGPT, persönliches Plugin (Tim; für P4):** Lässt sich ein eigener MCP-Endpunkt ohne
   Authentifizierung verbinden? Gilt das für Web, Desktop und die Handy-App?

   **Ergebnis V3:** _offen_
4. **Postfach-Eingang (Tim):** Bei der nächsten TEST-Anfrage auch die Mail im Postfach prüfen.

### B1 – Datenschutz-Bereinigung vor P1 (Stufe B, 3 Dateien; Codex-Gegenlesung)

- **ProvenExpert-Rich-Snippet entfernen** (`client/index.html`):
  - `<div class="pe-richsnippets">` (Z. 91) und das Ladeskript für
    `www.provenexpert.com/widget/richsnippet.js` (Z. 92 ff.) fallen weg.
  - Das Skript lief auf jeder Seite, lieferte aber nur `error - wrong plan(1003)`
    (`PRERENDER-CHECK.md`). Die Besucher-IP ging trotzdem an ProvenExpert.
- **ProSeal ersetzen** (`client/src/pages/Home.tsx`):
  - Das Nachladen (`useEffect`, Z. 25–62) und der Abschnitt mit `<noscript>` und
    `#proSealWidget` (ab Z. 307) fallen weg; der `useEffect`-Import wird dann überflüssig.
  - `googleStars: true` (Z. 37) gehörte zu ProvenExperts Google-Sterne-Funktion und kollidierte
    damit möglicherweise mit der Regel „kein on-site AggregateRating“.
  - Ersatz: ein eigenes Element „Bewertungen auf ProvenExpert ansehen“ als reiner Link
    (`rel="noopener noreferrer"`), ohne Fremdskript und ohne Markup.
  - Die Kennzahl „4,48 ★ ProvenExpert Bewertung“ (Z. 219–220) bleibt als Text.
- **§7 der Datenschutzerklärung berichtigen** (`client/src/pages/Datenschutz.tsx`, Z. 166 ff.):
  - Bisher heißt es: „keine externen Plugins oder Tools“.
  - Korrekt ist künftig: Google Maps auf `/kontakt` (`client/src/pages/Contact.tsx`) lädt erst
    nach Klick (2-Klick-Lösung). Dazu gehören Anbieter, übertragene Daten, Einwilligung als
    Rechtsgrundlage und die USA-Übermittlung.
  - ProvenExpert ist nur noch verlinkt.
- **Abnahme durch Claude:**
  - CI grün.
  - Im Build enthält `dist/public` kein `provenexpert.com/widget` und kein `proseal`, nur noch den
    Profil-Link.
  - Prerender-Check-Action grün.
  - Codex-Ergebnis im PR.
- **Abnahme durch Tim:** Startseite zeigt den Link statt des Siegels; Text der Datenschutzseite
  gelesen.
- **Aufwand:** ca. 0,5 Arbeitstage. Tims Zeit ca. 20 Min. plus die Codex-Gegenlesung.

### B2 – Aufräumen: Redirects und verstecktes Formular (Stufe C, 4 Dateien)

- **`client/public/_redirects` löschen.**
  - Die Datei wird ausgeliefert und verdoppelt die `firma.`-Regel aus `netlify.toml`. Die Regel in
    `netlify.toml` ist identisch, inklusive `force`, und bleibt.
  - Netlify verarbeitet heute 32 Regeln (31 aus `netlify.toml` plus diese), danach 31. Geprüft am
    Deploy `6acc18cc…`: „32 redirect rules processed“.
  - Damit gilt wieder die Regel „Redirects ausschließlich in `netlify.toml`“.
- **`public/_redirects` (Root) löschen:** veraltet, mit widersprüchlichen Zielen wie
  `/waermedaemmung → /steildach`, und nicht ausgeliefert (Vite-Root ist `client`).
- **`netlify/public/_redirects` löschen:** leer.
- **Verstecktes JSX-Formular entfernen** (`client/src/pages/VeluxPreisrechnerBochum.tsx`,
  Z. 153–164):
  - Es ist ein Überbleibsel. Netlify erkennt Formulare nur in statischen Dateien, maßgeblich ist
    seit #94 `client/public/formulare.html`.
  - Im vorgerenderten HTML für Bots taucht es trotzdem als absendbares Formular auf.
  - Kein Test greift darauf zu.
- **Abnahme durch Claude:**
  - CI grün, `dist/public` ohne `_redirects`.
  - Deploy-Zusammenfassung „31 redirect rules processed“.
  - `get-forms-for-project` führt weiter beide Formulare.
- **Abnahme durch Tim:** `firma.rex-bedachung.de/irgendwas` leitet per 301 auf www weiter.
- **Aufwand:** ca. 0,25 Arbeitstage. Tims Zeit ca. 10 Min.

### P1 – Typenschild-Foto und Herkunft (Stufe B, 7 Dateien)

**Auftrag erteilt am 12.10.2026, mit Bedingungen:**
- Die Umsetzung startet erst nach V1, wenn das Kontingent reicht.
- Gemergt wird erst nach der Codex-Gegenlesung des Datenschutztextes.

- **Foto:**
  - Optionales Feld „Foto des Typenschilds“ mit dem Hinweis „Bitte nur das Typenschild
    fotografieren – keine Personen, Hausnummern oder Innenräume“.
  - Kamera oder Galerie.
  - Im Browser verkleinert (lange Kante ca. 2.000 px, JPEG). Dabei fallen EXIF- und GPS-Daten weg,
    und die Drehung wird übernommen.
  - Ein Foto, ca. 5 MB Obergrenze. Das Netlify-Limit von 8 MB gilt für die gesamte Einsendung.
- **Versand:**
  - `FormData` (multipart).
  - In `client/public/formulare.html` kommen die Felder `<input type="file" name="typenschild">`
    und `quelle` dazu.
  - In Tims Mail erscheint das Foto als Link.
- **Fehlerwege:**
  - HEIC wird umgewandelt oder verständlich abgelehnt.
  - Langsamer Upload: Wartehinweis und Zeitlimit.
  - Fehlversand: Der mailto-Ersatzweg zeigt „Das Foto wird nicht automatisch mitgeschickt – bitte
    selbst anhängen oder nachreichen“.
- **Herkunft pro Anfrage:**
  - Optionales Auswahlfeld „Wie sind Sie auf uns aufmerksam geworden?“
  - Marke „Konfiguration per KI übernommen (unverändert/geändert)“, gebunden an
    `configSignature` (`client/src/lib/velux/export-gate.ts`) und bei „Neue Berechnung“
    zurückgesetzt. Der Session-Marker `rex.webmcp.applied` (`bridge.ts`) wird nie zurückgesetzt
    und taugt deshalb nicht.
- **Datenschutz** (`export-gate.ts`, `Datenschutz.tsx`):
  - Bild-Upload ist freiwillig.
  - Zweck: Bestimmung des Fensters.
  - Speicherung bei Netlify (Abschnitt 3); Löschung spätestens nach 3 Monaten.
  - Zugriff über Link, beschrieben nach dem Ergebnis des Link-Tests.
- **Dateien:**
  1. `client/public/formulare.html`
  2. `client/src/components/VeluxPreisrechner.tsx`
  3. neu `client/src/lib/imageUpload.ts`
  4. `client/src/lib/velux/export-gate.ts`
  5. `client/src/pages/Datenschutz.tsx`
  6. `client/src/lib/velux/bridge.ts`
  7. `scripts/velux-ui-smoke.mjs` (Testbilder werden im Skript erzeugt, kein `attached_assets`)
- **Abnahme durch Claude:**
  - CI grün.
  - Der UI-Smoke prüft:
    - Multipart-POST mit Foto;
    - Senden ohne Foto;
    - Fehlermeldung bei Übergröße;
    - Fehlversand mit Foto-Hinweis;
    - Marke wird bei „Neue Berechnung“ zurückgesetzt;
    - Export-Gate unverändert;
    - 390 px ohne Überlauf.
  - Im Build enthält `dist/public/formulare.html` die Felder `typenschild` und `quelle`.
  - Nach dem Deploy führt `get-forms-for-project` das Feld `typenschild`.
- **Abnahme durch Tim:**
  - Echte Fotos vom iPhone (auch HEIC) und von Android, darunter ein gedrehtes Bild. Ist das
    Typenschild nach der Verkleinerung lesbar?
  - Ein Test mit langsamer Verbindung.
  - **Link-Test:** Öffnet der Foto-Link ohne Netlify-Login?
  - **Löschtest:** Einzelne Einsendung samt Foto löschen; ist der Link danach ungültig?
  - Eingang im Postfach.
- **Aufwand:** 1–2 Arbeitstage. Tims Zeit ca. 1,5 h.

### W1 – WebMCP-Korrektur und Rechner-Link (ein freigegebener WebMCP-Deploy, Stufe B, 7 Dateien)

- **Bestätigungsbedarf (Befund aus Fall 4, `WEBMCP.md`):**
  - Bei `confirmation_required` enthält die Tool-Antwort eine ausdrückliche Anweisung: den Kunden
    fragen, erst danach übernehmen.
  - `rex_velux_apply_configuration_v1` übernimmt eine unbestätigte Zuordnung nur mit einem
    ausdrücklichen Bestätigungsfeld.
- **Link im Fragment, ohne Kontaktdaten:**
  - `#rechner=1&p=Modell.Größe.Verglasung.Anzahl[.Rollladen[.Anzahl]][.Rollo[.Anzahl]]`,
    optional `&f=Alter.Energie.Selbstnutzung.iSFP`.
  - Höchstens 10 Positionen, Anzahl 1–10, Zubehör höchstens so viele wie Fenster, Maximallänge
    z. B. 1.000 Zeichen.
  - Eine unbekannte Version öffnet den leeren Rechner mit Hinweis; ungültige Eingaben werfen nie.
    Das Fragment wird nach dem Lesen entfernt.
  - `rex_velux_calculate_estimate_v1` liefert `calculatorUrl` mit.
- **Dateien:**
  1. `client/src/lib/velux/tools.ts`
  2. `client/src/lib/velux/content.ts` bzw. `validate.ts` (werden beide gebraucht, sind es
     8 Dateien; Stufe B erlaubt höchstens 8)
  3. neu `client/src/lib/velux/deeplink.ts`
  4. `client/src/components/VeluxPreisrechner.tsx`
  5. `scripts/velux-estimate-check.ts`
  6. `scripts/webmcp-smoke.mjs` (Vertrag geändert)
  7. `scripts/velux-ui-smoke.mjs`
- **Abnahme:**
  - Neue Testfälle grün.
  - Live: Fall 4 wiederholen; die KI muss jetzt nachfragen.
  - Links auf Handy und PC geben dieselben Beträge wie die manuelle Eingabe.
- **Aufwand:** 2–3 Arbeitstage. Tims Zeit ca. 45 Min.
- **Optional später (P2b):** Werkzeug `rex_velux_prepare_inquiry_v1` mit `CONTACT_EXISTS`,
  `summaryId` und Kurzcode. Nur, wenn die Formularbedienung durch die KI unzuverlässig wird.

### D1 – Doku (Stufe A, ca. 5 Dateien)

- `client/public/llms.txt`, `client/public/llms-full.txt`:
  - Linkformat aus W1 beschreiben.
  - Preis-Satz in `llms-full.txt` Z. 162–164 an `llms.txt` Z. 156 angleichen („in dieser Datei“
    bewusst nicht ausgewiesen; der Rechner zeigt Schätzungen).
  - Formulierungen so wählen, dass `foerder:check` besteht.
- `WEBMCP.md`: Kompatibilitätstabelle, Fall-4-Folge.
- `DEPLOY-RULES.md`: ProvenExpert-Zeile in §14 (Z. 613); „Löschprüfung am 01.01.2027“ (Z. 340)
  wird monatlich, ebenso der Vermerk „quartalsweise“ (Z. 325–326).
- Diese Plan-Datei.
- **Ehrlich:** Die Beschreibung in `llms*.txt` garantiert nicht, dass ChatGPT den Link im normalen
  Chat bildet. Verlässlich wird es erst mit P4.

### P4 – Server-Plugin `www.rex-bedachung.de/mcp` (nötig für Chat und mobil)

- **P4a, parallel und früh:**
  - PR „NICHT MERGEN“, nur auf der Deploy-Preview, wie zuvor bei #86. Lesende Werkzeuge,
    zustandslos, SDK mit gepinnter Version, keine Authentifizierung.
  - Tim verbindet den Endpunkt als persönliches Plugin und prüft Web, Desktop und die Handy-App.
  - Außerdem prüft Tim, ob ein im Chat hochgeladenes Foto über Dateiparameter beim Werkzeug
    ankommt.
  - Ergebnis: Go/No-Go je Oberfläche.
- **P4b, nur nach Go:**
  - Werkzeuge: `prepare` und `submit` mit `summaryId`.
  - Pflicht: Neuberechnung auf dem Server; Weiterleitung serverseitig an Netlify Forms
    (`quelle=ChatGPT`).
  - Missbrauch: Aufruflimit pro IP und gesamt, Längengrenzen, keine Personendaten in Logs,
    Testmodus außerhalb von Production.
  - Doppelübermittlung nach Timeout: Idempotenz-Hash 24 h in Netlify Blobs.
  - Foto über Dateiparameter, falls P4a das bestätigt.
  - Datenschutztext für den Kanal, von Codex gegengelesen.
  - Stufe C, 2–3 Deploys.
- **Aufwand:** P4a 1–2 Arbeitstage, Tims Zeit 1–2 h. P4b 3–5 Arbeitstage, Tims Zeit 1–2 h.

### P5 – Öffentliche Veröffentlichung (erst nach funktionierendem Gesamtvorgang)

- OpenAI-Verifizierung, Prüfung und Unterlagen: Datenschutz, Support, Testfälle, Screenshots.
- Claude bereitet vor, Tim reicht ein. Die Dauer der Prüfung ist extern und offen.

### Backlog

| Baustein | Auslöser |
|---|---|
| Eigene Datenbank, Outbox, Statusabruf, Betriebsansicht | Netlify Forms reicht nachweislich nicht mehr |
| OAuth, Server-PDF, Mail-Dienst für Anhänge | Belegter Bedarf |
| Automatische Löschung per Function | Der monatliche Ablauf klappt nicht zuverlässig |
| Herkunftsfeld im Kontaktformular, P2b | Nächstes passendes Paket bzw. Bedarf |

---

## 4. Zeitachse

Frühestmögliche Termine im 48-h-Takt, keine Fertigstellungsgarantie. Die genaue Uhrzeit nennt
Claude im jeweiligen PR nach `date`.

| Wann | Was |
|---|---|
| ab sofort | V1–V4 |
| ab 14.10.2026, 01:06 MESZ | B1, nach der Codex-Gegenlesung |
| frühestens 48 h nach dem Produktionsdeploy von B1 | B2 |
| frühestens 48 h nach dem Produktionsdeploy von B2 | P1, wenn die Bedingungen erfüllt sind; sonst zuerst W1 |
| danach | W1, dann D1 |
| parallel | P4a-Preview |
| nach Go aus P4a | P4b |
| nach funktionierendem Gesamtvorgang | P5 |
| 01.11.2026 | erste monatliche Löschprüfung (Routine) |
| 16.11.2026 | Förder-Wiedervorlage (Hinweis aus `estimate:check`) |
| bis 17.12.2026 | DPF-Status von Netlify prüfen (Rezertifizierung) |
| vor 31.12.2026 | Förder-Deploy |

**Gesamtaufwand grob:** 9–15 Arbeitstage Entwicklung. Tims Zeit 6–9 h, verteilt über mehrere
Wochen. Hinzu kommen die externe Prüfung durch OpenAI und die Deploy-Abstände.

---

## Umgesetzt mit diesem Auftrag (12.10.2026)

- Diese Datei auf `claude/zealous-brown-c1mq00`, ein Commit, kein PR. Sie geht mit D1 nach `main`.
- Lösch-Routine `trig_01PfLGdHVcAzzYqYUdMGNPBC` (keine zweite Routine):
  - **Umgestellt:** Name „Netlify-Formulare: Löschfrist prüfen (monatlich)“, Zeitplan
    `CRON_TZ=Europe/Berlin 52 7 1 * *`, nächster Lauf 01.11.2026, 07:52 MEZ.
  - **Offen:** der Inhalt. Er lässt sich nur aus der Unterhaltung ändern, in die die Routine
    postet (`session_01SWh3JJ1uc9mhwhTfom8ydB`). Bis dahin zählt sie weiter Einträge älter als
    drei Monate und prüft den Spam-Bereich nicht.
  - **Soll-Inhalt:** Einträge älter als zwei Monate zählen (`kontakt`, `velux-preisrechner`, ab P1
    mit Fotos) und den Spam-Bereich prüfen; nur Zahlen und Datumsbereiche melden; löschen erst
    nach Tims Freigabe, danach den Bestand bestätigen; keine Repo-Änderungen.
- Nicht umgesetzt: B1, B2, P1, W1, D1, P4, P5. Nächster Schritt wäre B1, vorbereitet als PR mit
  Merge ab 14.10.2026, 01:06 MESZ.

## Prüfprotokoll für spätere Pakete

- `npm run check`, `npm run build`
- `estimate:check`, `faq:check` und `foerder:check` (die beiden letzten mit `--self-test`)
- Browserstrecke (`checks.yml`), Prerender-Check (`prerender-check.yml`)
- Netlify-Preview
- Codex-Gegenlesung bei Datenschutztexten
- Live-Test durch Tim
- `git show --stat HEAD`: genau die geplanten Dateien, kein `attached_assets`

## Quellen

- **Repo:**
  - `PRERENDER-CHECK.md` (Rich-Snippet „wrong plan(1003)“)
  - PR #94 (Formulare, Bots)
  - PR #96 und `WEBMCP.md` (Fall 4)
  - `DEPLOY-RULES.md` §10 (Gate-Verletzung #97, Fenster 14.10.2026)
  - `CLAUDE.md` Z. 16 (Fotoübertragung nur mit gesondertem Auftrag)
  - `VELUX-EXPORT-GATE.md` (Codex-Einschätzung zum Datenschutz, vor #91)
- **Tims Prüfungen vom 08.10. und 12.10.2026:** OpenAI Site tools, Plugins, Dateiparameter;
  Netlify Forms, Uploads, Spamfilter; MDN zu Fragmenten.
- **Web:**
  - [ProvenExpert: Google-Sterne einbinden](https://help.provenexpert.com/en/how-do-i-embed-google-stars-for-my-website)
  - [ProvenExpert: Rich Snippet](https://help.provenexpert.com/en/what-is-a-rich-snippet)
  - [ProSeal-Konfiguration mit googleStars](https://generatepress.com/forums/topic/where-to-put-provenexpert-pro-seal-code/)
  - [Google: Review-Snippet](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)
  - [Netlify Forms Setup](https://docs.netlify.com/manage/forms/setup/)
  - [Netlify-Forum: 8 MB](https://answers.netlify.com/t/the-form-request-has-a-maximum-size-limit-of-8-mb/112079)
  - [Claude-Hilfe: Connectoren](https://support.claude.com/en/articles/11176164-use-connectors-to-extend-claude-s-capabilities)
  - [OpenAI: Apps in ChatGPT](https://openai.com/index/introducing-apps-in-chatgpt/)
