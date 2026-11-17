# P5-Plan, Entwurf 4: Website-Rechner als Hauptweg, ChatGPT-Veröffentlichung zurückgestellt

Stand 17.11.2026, **zur Freigabe, noch nicht freigegeben.** Frühere Fassungen stehen im Git-Verlauf dieses
Branches: Entwurf 1 `61a47dc`, Entwurf 2 `91755df`, Entwurf 3 `f00305b`.

- **Entwurf 3** hat ergänzt: den Bereinigungspunkt in `prepare` (K1a), die genauere Einordnung der
  Prüfgrundlage und die Festlegungen zur Kurzanleitung.
- **Entwurf 4** berichtigt:
  - die falsche Aussage zur Förderfrist (Abschnitt 6)
  - die Herkunft der Empfehlungen: Die Vermerke „Tim: …“ in Entwurf 3 stammten aus Empfehlungen von Codex,
    die Tim weitergeleitet hat. Sie sind keine Freigaben von Tim.
  - die Beschreibung des Löschzeitpunkts bei Variante A

**Wer entscheidet:** Freigaben erteilt nur Tim. Die Gegenlesung durch Codex ist eine Empfehlung und ersetzt keine
Freigabe.

**Prüfgrundlage, ehrlich eingeordnet.** Geprüft am 17.11.2026 gegen `origin/main` (`c5dbcfa`, seit #117
unverändert):
- **Code gelesen:** `client/src/lib/velux/deeplink.ts`, `validate.ts`, `tools.ts`,
  `client/src/components/VeluxPreisrechner.tsx`, `export-gate.ts`, `netlify/functions/mcp.mts`,
  `client/public/llms*.txt`, `Datenschutz.tsx`.
- **Lokal ausgeführt:**
  - `estimate:check`: alle Prüfungen bestanden. Es kommen zwei Warnungen „Förderprüfung fällig“. Am
    31.12.2026 endet der im Rechner hinterlegte **Prüfstand** der Förderregeln (`validThrough`, im Code als
    „Wiedervorlage“ bezeichnet). Die Förderprogramme selbst laufen damit nicht aus, siehe Abschnitt 6.
  - `foerder:check`: keine Drift.
  - Die fünf Beispiel-Links der Kurzanleitung liefen durch den echten Parser (`parseCalculatorFragment`). Alle
    werden angenommen und lassen sich unverändert zurückbauen. Gegenproben mit unzulässiger Größe bzw. mehr
    Zubehör als Fenstern werden abgelehnt.
- **Frühere Abnahmen:** Rechner-Link W1 am 26.10.2026 auf Handy und PC (Tim); Versand über den Rechner
  laufend seit P1.
- **Nicht gemacht:** keine neue Live-Abnahme, kein Browser-Test auf der Live-Site, kein Test über WhatsApp oder
  Mail.

„Funktioniert“ heißt in diesem Plan also: Laut Code und bisherigen Abnahmen ist es vorhanden. Eine neue
vollständige Abnahme ist es nicht.

Kein Produktivcode geändert, kein PR, kein Deploy, keine Einreichung, kein Versand.

## 0. Tims Entscheidung (17.11.2026)

Der VELUX-Rechner auf der Website ist der Hauptweg für Fensteranfragen. Dafür braucht der Kunde weder ein
ChatGPT-Konto noch ein Plugin. Der Ablauf:

1. Der Kunde öffnet den Rechner über einen Link.
2. Er gibt Fenster und Ausstattung ein oder prüft die vorausgefüllten Angaben.
3. Er sieht die unverbindliche Kostenaufstellung.
4. Er ergänzt seine Kontaktdaten und prüft die Anfrage.
5. Er klickt auf der Website selbst auf „Anfrage senden“.

Der Versand nach Zustimmung in ChatGPT ist damit nicht mehr die Priorität. Die Veröffentlichung in ChatGPT wird
zum möglichen späteren Zusatzkanal. Die MCP-Anbindung samt Versandfunktion bleibt unverändert in Betrieb. Ein
KI-Assistent auf der Website ist nicht eingeplant.

---

## 1. Was bereits vorhanden ist

**Laut Code und bisherigen Abnahmen ist der gewünschte Kundenablauf auf `/velux-preisrechner-bochum`
vollständig vorhanden.** Eine neue Live-Abnahme gab es nicht, siehe Prüfgrundlage oben.

| Schritt | Umsetzung im Code | Status |
|---|---|---|
| 1 Rechner öffnen | Route vorhanden; verlinkt aus Navigation, Footer, `/dachfenster-bochum`, `/velux-austausch`, `/velux-rolllaeden` und der Scroll-Animation | live |
| 2 Fenster und Ausstattung | Schritt 1 des Rechners: Modell GGU/GGL/GPU/GPL, 19 Größen, Verglasung, Anzahl, Rollladen und Rollo mit Anzahl, bis zu 10 Positionen; Schritt 2: vier Förderfragen | live |
| 3 Kostenaufstellung | Schritt 3: Material, Einbau ab, MwSt., BEG und §35c als Alternativen, Hinweise, Enthalten/Nicht enthalten. Gerechnet wird im Browser über `client/src/lib/velux` | live |
| 4 Kontaktdaten und Prüfung | im selben Schritt: Name\*, E-Mail oder Telefon\*, Adresse, Anmerkung, Typenschild-Foto (P1), Herkunft – alles freiwillig außer den Pflichtangaben. Kostenaufstellung und Eingaben stehen auf derselben Seite über dem Button | live |
| 5 Kunde sendet selbst | Button „Anfrage senden & PDF erstellen“ erst bei gültigen Kontaktdaten; Versand an Netlify Forms `velux-preisrechner`; Fehlerweg mit Telefon und E-Mail-Entwurf; Link zu den Datenschutzhinweisen | live |

**Vorausgefüllter Link („Rechner-Link“, W1, live seit #107, am 26.10.2026 auf Handy und PC abgenommen):**

- Format: `https://www.rex-bedachung.de/velux-preisrechner-bochum#rechner=1&p=Modell.Größe.Verglasung.Anzahl[.Rollladen[.Anzahl]][.Rollo[.Anzahl]]…[&f=Alter.Energie.Selbstnutzung.iSFP]`
  Beispiel: `…#rechner=1&p=GGU.MK08.ENERGIE.1&f=over_10.yes.yes.no`
- **Übernommen werden:** je Position Modell, Größe, Verglasung und Anzahl, Rollladen (SSL/SML) mit Anzahl und
  Rollo (DKL/DSL) mit Anzahl, höchstens 10 Positionen. Die vier Förderantworten übernimmt der Link nur, wenn
  alle vier vorhanden sind.
- **Nicht übernommen werden:** Kontaktdaten, Adresse, Anmerkung, Foto und die Herkunftsangabe. Das ist so gewollt,
  denn die Konfiguration steht nur im Fragment hinter `#` und erreicht keinen Server.
- **Verhalten:** Mit Förderangaben öffnet der Rechner direkt bei der Kostenaufstellung, ohne Förderangaben bei
  den Förderfragen. Ein Hinweis sagt, dass die Angaben aus dem Link stammen und geprüft werden sollen. Ungültige Links
  oder Links einer anderen Version öffnen den leeren Rechner mit einem Hinweis. Das Fragment wird danach aus der
  Adresszeile entfernt. Über „Zurück“ kann der Kunde alles ändern.
- **In der Anfrage an Rex** steht im Feld `quelle` „Konfiguration: per Rechner-Link übernommen, unverändert“ bzw. „…,
  geändert“, wenn der Kunde danach etwas angepasst hat (`describeConfigOrigin`).
- Geprüft wird das in der CI (`estimate:check`, `velux-ui-smoke`). Format und Beispiele stehen in `llms.txt` und
  `llms-full.txt`.

**Drei Wege, sauber getrennt:**

| Weg | Wer erzeugt ihn | Was passiert | Voraussetzung beim Kunden |
|---|---|---|---|
| **Normaler Website-Link** | jeder (Website-Menü, Google-Profil, E-Mail-Signatur, WhatsApp-Antwort) | leerer Rechner, der Kunde gibt alles selbst ein | Browser |
| **Vorausgefüllter Link** | (a) Rex-Team von Hand nach dem Format oben; (b) Tim über seinen eigenen ChatGPT-Connector (`calculatorUrl` aus `rex_velux_calculate_estimate_v1`), dann per Mail oder WhatsApp an den Kunden; (c) eine KI, die das Format aus `llms.txt` liest – **möglich, aber nicht zugesagt** | Rechner mit Fenstern und gegebenenfalls Förderangaben; Kontaktdaten und Absenden macht der Kunde selbst | Browser |
| **MCP** (`/mcp`, ChatGPT-Connector) | ChatGPT im Konto mit eingerichtetem Rex-Connector | Schätzung im Chat, `calculatorUrl`, optional Versand nach Zustimmung im Chat | ChatGPT-Konto **und** eingerichteter Connector |
| **WebMCP** | KI-Anwendung mit WebMCP-Unterstützung, **während die Rechnerseite offen ist** | KI füllt den Rechner auf der Seite nach Bestätigung aus; absenden muss der Nutzer selbst | passende Anwendung, Seite geöffnet |

**Nicht zugesagt wird:** dass ein gewöhnlicher ChatGPT-Chat ohne Connector den Rechner aufruft, die Website
ausfüllt, einen gültigen Link baut oder Rex empfiehlt. Nach dem Befund vom 13.11.2026 rechnet ChatGPT ohne
Connector mit Zahlen aus Seitentexten und der Websuche (`MCP.md`).

---

## 2. Was für den Website-Kundenweg noch fehlt

**Für den Ablauf selbst fehlt nichts.** Es gibt nur zwei Lücken, beide nicht technischer Art:

1. **Wer erzeugt den vorausgefüllten Link?** Ein Kunde kommt nur dann zu einem vorausgefüllten Rechner, wenn
   vorher jemand seine Fenster kennt, zum Beispiel Rex nach einem Telefonat oder einem Typenschild-Foto per
   WhatsApp. Auf der Website gibt es dafür keine Funktion. Heute bleiben nur zwei Wege: den Link von Hand nach
   dem Format bauen oder Tims ChatGPT-Connector nutzen.
2. **Links in Messengern und In-App-Browsern:** Auf Handy und PC wurden Links in normalen Browsern abgenommen.
   Nicht gezielt geprüft ist, ob WhatsApp, Mail-Apps und In-App-Browser den Teil hinter `#` mit `&` vollständig
   übergeben. Das ist ein Test mit einer echten Nachricht an sich selbst, kein Code.

Nicht nötig: neue Seite, KI-Assistent, Änderungen an Preis- oder Förderlogik, neues Formular.

---

## 3. Empfohlene kleinste Änderung

**Stufe 0 – ohne Code (Empfehlung Claude und Codex; Freigabe durch Tim offen):**

- Claude erstellt eine interne Kurzanleitung „Rechner-Link für Kunden erstellen“ als **separates Dokument nur
  für Tim**. Sie kommt **nicht** ins Repo, weil ein öffentliches Repo für jeden lesbar ist. Auf die Website
  kommt sie auch nicht. Inhalt: Format, Größencodes, fünf geprüfte Beispiel-Links. Festlegungen:
  - Beispiel-Links enthalten **standardmäßig keine Förderantworten** (`f=`). Die beantwortet der Kunde im
    Rechner selbst, außer sie wurden vorher ausdrücklich mit ihm geklärt.
  - **Jeder Link wird vor der Übergabe geprüft:** einmal selbst öffnen. Erscheint der grüne Hinweis „Fenster
    aus dem Link übernommen“ und stimmen Modell, Größe und Zubehör? Der Rechner prüft Modell und Größe,
    Rollladen und Rollo je Größe sowie die Mengen. Ungültige Links öffnen einen leeren Rechner mit gelbem
    Hinweis.
- Tim prüft einen Link einmal über WhatsApp und einmal per Mail auf dem Handy (Abschnitt 2, Punkt 2)
  Zum Prüfen genügt es, den Link zu öffnen und Fenster und Rollläden anzusehen. **Es wird keine Anfrage
  abgesendet.**
- Den normalen Rechner-Link verwendet das Team für Antwortvorlagen, die E-Mail-Signatur und das Google-Profil.
  Das sind Tims Kanäle; Claude ändert dort nichts.

**Stufe 1 – erst bei Bedarf (Empfehlung Codex: zuerst mit wenigen geprüften Links ausprobieren, dann anhand
der tatsächlichen Nutzung entscheiden; Freigabe durch Tim offen):**

- Button „Link zu dieser Konfiguration kopieren“ in Schritt 3 des Rechners. Er nutzt das vorhandene
  `buildCalculatorUrl` und schreibt nur in die Zwischenablage, ohne Kontaktdaten, ohne Server und ohne neue
  Logik.
- Nützlich für das Rex-Team und für Kunden, die eine Konfiguration weitergeben wollen.
- Umfang: `VeluxPreisrechner.tsx`, Text in `content.ts`, ein Smoke-Test; das sind 3 Dateien, Stufe A.
- Ein eigener Deploy nach dem aktuellen 48-h-Gate.

Ich empfehle zuerst Stufe 0. Stufe 1 lohnt sich erst, wenn Links tatsächlich regelmäßig verschickt werden.

---

## 4. Zurückgestellt (ChatGPT-Veröffentlichung)

Aus Entwurf 1 entfallen bis auf Weiteres und werden **nicht** vorbereitet:

- Unternehmensverifizierung bei OpenAI, Projekt ohne EU Data Residency, Einreichungsportal
- Einreichungspaket (`p5-einreichung/`): Verzeichnistext, Testfälle, Demo-Video, Logo, Release Notes,
  Review-Hinweise
- Domain-Challenge-Datei
- Nutzungsbedingungen-Seite (war nur für die Einreichung nötig)
- Kundenanleitung zum Einrichten eines eigenen Connectors
- Verzeichnis-Link in `llms*.txt`
- die Entscheidungen E2–E6 aus Entwurf 1 (Identität, Name ohne VELUX, Nutzungsbedingungen, Länder,
  Prüfer-Anfragen)

Die V8-Ergebnisse von Codex (Abruf 15.11.2026, von Claude nicht selbst geprüft) und Entwurf 1 bleiben im
Git-Verlauf. Wird die Veröffentlichung wieder aufgenommen, prüfen wir die OpenAI-Regeln neu, weil sie sich
schnell ändern.

---

## 5. Unabhängige Korrekturen an der bestehenden MCP-Anbindung

Diese Befunde gelten unabhängig von einer Veröffentlichung, weil `/mcp` live ist und in Tims Konto genutzt wird.

| Nr. | Befund | Bewertung | Empfehlung |
|---|---|---|---|
| K1 | **Tool-Annotationen:** `submit` meldet `destructiveHint: false`, obwohl eine gesendete Anfrage nicht zurückgeholt werden kann (`mcp.mts:335`). Bei `prepare` und den drei lesenden Tools fehlen `destructiveHint` und `openWorldHint`. | Die Angaben sind falsch und können einen Client dazu bringen, weniger nachzufragen. Der eigene Schutz greift trotzdem: `userConfirmed`, Bindung an die Zusammenfassung über einen Hash, Doppelversandschutz. **Kein akutes Risiko, aber falsche Selbstauskunft.** | korrigieren: Werte nur in `mcp.mts` überschreiben, `tools.ts` bleibt, weil es auch WebMCP im Browser nutzt; `mcp-check` prüft alle drei Werte je Tool |
| K2 | **Datenschutz:** Der Abschnitt „Anfragen über ChatGPT (Rex-Plugin)“ sagt nicht, dass die Antworten des Plugins (Kostenschätzung und Zusammenfassung **mit den Kontaktdaten**) an ChatGPT zurückgehen und dort von OpenAI verarbeitet werden. | Lücke in der Transparenz für einen Kanal, der heute funktioniert. Klein, aber sachlich nötig. | ein bis zwei Sätze ergänzen, Sprunganker `id="chatgpt-plugin"`; **vor dem PR liest Codex gegen**, das Ergebnis kommt in den PR |
| K3 | `/.well-known/oauth-*` und `openid-configuration` unter `/mcp` liefern 200 mit der Startseite statt 404. | ChatGPT kommt damit zurecht. Wichtig wäre es erst für einen automatischen Tool-Scan bei einer Einreichung. | **zurückstellen**; erledigen, wenn die Veröffentlichung wieder aufgenommen wird (`netlify.toml` ist gesperrte Config, Stufe C) |
| K1a | **Bereinigung in `prepare`:** `prepare` ruft `cleanup()` auf (`mcp.mts:159`). Das löscht in Netlify Blobs Kontingent-Plätze von Vortagen und Versandvermerke, die älter als 24 h sind. Trotzdem meldet das Tool `readOnlyHint: true` (`mcp.mts:314`). | Die Einträge enthalten keine Nutzerdaten. Nach der MCP-Bedeutung („verändert seine Umgebung nicht“) ist `prepare` aber **nicht** rein lesend. Diesen Punkt hatte Entwurf 1 genannt, Entwurf 2 hat ihn ausgelassen. | siehe Varianten unten; Empfehlung: Bereinigung nur noch in `submit` |
| K4 | Der erste Aufruf einer ChatGPT-Sitzung endet mit 400, danach kommt 200. | **Ursache ungeklärt; bisher kein beobachteter Ausfall.** | **beobachten**; bei Gelegenheit im Netlify-Log klären, Codeänderung nur bei nachgewiesenem Fehler |

**K1a, Varianten:**

| Variante | Änderung | Vorteil | Nachteil |
|---|---|---|---|
| **A (Empfehlung)** | `cleanup()` nur noch in `submit`; `prepare` greift gar nicht mehr auf den Speicher zu | `prepare` ist dann tatsächlich lesend, und `readOnlyHint: true` stimmt. Vermerke und Plätze entstehen ohnehin nur in `submit`, also räumt der Aufruf auf, der sie auch erzeugt. | Gelöscht wird nur, wenn erneut über das Plugin gesendet wird. Gibt es keinen weiteren Versand, bleiben abgelaufene Einträge **ohne zeitliche Grenze** liegen. Das gilt dem Grundsatz nach schon heute, nur zählt bisher auch ein Vorbereiten als Auslöser. Die Datenschutzerklärung muss den tatsächlichen Zeitpunkt nennen (siehe K2 unten). |
| B | Bereinigung bleibt, `prepare` meldet `readOnlyHint: false` | kein Eingriff in den Ablauf | ChatGPT fragt dann womöglich schon vor dem Vorbereiten nach einer Bestätigung. Das bremst und verwischt den Unterschied zum Senden. |
| C | Alles bleibt, nur eine Begründung wird dokumentiert | kein Code | Die Selbstauskunft bleibt ungenau. Nicht empfohlen. |

**Korrekturpaket K1 + K1a + K2 (Empfehlung Claude und Codex: zusammen; Freigabe durch Tim offen):**

- **Dateien:** `netlify/functions/mcp.mts`, `scripts/mcp-check.ts`, `client/src/pages/Datenschutz.tsx`,
  `MCP.md`. Das sind 4 Dateien, Stufe C wegen des Function-Codes. Ein Deploy nach dem aktuellen 48-h-Gate.
- **Inhalt:**
  - Annotationen für alle fünf Tools, nur in `mcp.mts` überschrieben.
  - Bereinigung nach Variante A.
  - Datenschutz:
    - Rückfluss der Plugin-Antworten an ChatGPT bzw. OpenAI
    - Löschzeitpunkt genau so, wie er tatsächlich ist. Vorschlag zum Gegenlesen: „Versandvermerke, die älter
      als 24 Stunden sind, und Zähler von Vortagen werden gelöscht, sobald über das Plugin erneut eine Anfrage
      abgesendet wird. Wird keine weitere Anfrage abgesendet, bleiben sie bis dahin gespeichert; sie enthalten
      keine Angaben aus Ihrer Anfrage.“
    - Soll es eine feste Höchstdauer geben, ginge das nur mit einer zeitgesteuerten Löschung (eigene Function,
      steht im Backlog) oder mit einer manuellen Löschung in der monatlichen Lösch-Routine. Ob die Routine
      Blobs löschen kann, ist nicht geprüft. Beides gehört **nicht** ins Korrekturpaket (Entscheidung F7).
    - Anker `chatgpt-plugin`
  - `MCP.md`: Abschnitte „Speicher“ und „Offen“ nachziehen.
- **Prüfungen vor dem PR:**
  - `mcp-check` wird erweitert:
    - (a) alle drei Werte für jedes Tool
    - (b) `prepare` ruft den Speicher nicht auf (Zähl-Speicher im Test)
    - (c) `submit` räumt weiterhin auf und verhält sich unverändert, alle bisherigen 51 Prüfungen bleiben grün
  - Dazu laufen `estimate:check`, `foerder:check`, Build und CI.
  - Den Datenschutztext liest **Codex** vor dem PR gegen; das Ergebnis kommt in den PR.
- **Prüfungen auf der Deploy-Preview (Tim):**
  - Connector auf die Preview-URL, „Tools aktualisieren“.
  - Eine Anfrage vorbereiten und ablehnen: Es wird nichts gesendet.
  - Eine Anfrage vorbereiten und zustimmen: Es kommt ein Eingang mit „TEST – Preview“, den Tim danach löscht.
- **Nach dem Merge:**
  - Netlify-Deploy, CI, Rate-Limit-Regel, Formularfelder unverändert, `tools/list` live mit den neuen
    Annotationen.
  - In ChatGPT „Tools aktualisieren“.
  - Deploy-Log in `DEPLOY-RULES.md` §10 und `MCP.md`.
  - Ein Versand-Test live nur, wenn Tim das ausdrücklich will, denn er erzeugt eine echte Anfrage.

**Außerhalb dieses Plans, Entscheidung Tim, ohne Auftrag unverändert:** Auf `/velux-preisrechner-bochum` steht
„ab ca. 1.800 € netto“ zweimal, im FAQ-Schema und im Fließtext. Es ist eine feste Preisangabe neben dem Rechner.
Ohne Connector rechnet ChatGPT genau damit hoch. Ob und wie sie geändert wird, entscheidet Tim gesondert.

---

## 6. Deploys und Regeln

- Für alle späteren Deploys gelten das aktuelle 48-h-Gate (ab `published_at` des letzten Produktionsdeploys,
  vor jeder Aussage `date` und Netlify prüfen) und das Merge-Gate aus `DEPLOY-RULES.md`. Feste Termine aus
  Entwurf 1 entfallen.
- Ein Merge im neuen Monat ist wegen `__BUILD_DATE__` immer ein Produktionsdeploy. Paketänderungen zählen immer.
- Jeder Deploy ist ein eigener PR mit „Squash and merge“ durch Tim, ohne Auto-Merge. Root-Doku zählt mit.
- Nach jedem Merge prüfe ich: Netlify-Deploy, CI, die Rate-Limit-Regel, die Formularfelder
  (`get-forms-for-project`) und `/mcp` `tools/list`. Danach ergänze ich den Deploy-Log in `DEPLOY-RULES.md` §10
  und `MCP.md`.
- Mögliche Reihenfolge: (1) Stufe 0 ohne Deploy; (2) Korrekturpaket K1 + K1a + K2; (3) gegebenenfalls Stufe 1.
- **Förder-Wiedervorlage (berichtigt):**
  - Am 31.12.2026 endet der im Rechner hinterlegte Prüfstand der Förderregeln (`RULES.*.validThrough` in
    `client/src/lib/velux/funding.ts`). Die Förderprogramme laufen dann **nicht** aus. Für §35c nennt
    § 52 Abs. 35a EStG zum Beispiel Maßnahmen, die vor dem 1. Januar 2030 abgeschlossen sind. Das hat Codex am
    17.11.2026 abgerufen, ich habe es nicht selbst geprüft.
  - Die Förderregeln müssen vor Jahresende anhand aktueller amtlicher Quellen erneut geprüft werden. Danach
    werden der Prüfstand und gegebenenfalls die Berechnung aktualisiert.
  - **Ohne Aktualisierung weist der Rechner nach dem 31.12.2026 keine Förderbeträge mehr aus.** Stattdessen
    steht dort der Hinweis, die Förderung persönlich zu klären (`funding.ts`, ab Z. 198). Dasselbe gilt für
    MCP und WebMCP, weil sie dieselbe Logik nutzen.
  - Zusätzlich bricht `estimate:check` ab, sobald `validThrough` überschritten ist. Dann ist die CI für jeden
    PR rot, bis der Prüfstand nachgezogen ist.
  - Die Aktualisierung ist ein eigener Deploy, der Förderfristen nur nach Quellenprüfung verlängert. Er braucht
    ein 48-h-Fenster vor dem Jahreswechsel. Vorrang vor dem Korrekturpaket hat er, wenn sonst kein Fenster mehr
    frei bliebe oder wenn er eine falsche Zahl auf der Live-Site korrigiert.
  - Ein Merge im Dezember ist wegen `__BUILD_DATE__` in jedem Fall ein Produktionsdeploy.
- Doku nach der Freigabe: `MCP.md` („Offen“) und Umsetzungsplan-Tabelle: P5 „zurückgestellt, Website-Rechner ist
  Hauptweg (Entscheidung 17.11.2026)“. Das läuft im selben PR wie K1/K2 oder als reiner Doku-PR.

---

## 7. Entscheidungen für Tim

| Nr. | Frage | Stand 17.11.2026 |
|---|---|---|
Alle Punkte sind **offen, bis Tim entscheidet**. In der Spalte steht, wer was empfiehlt.

| Nr. | Frage | Empfehlung |
|---|---|---|
| F1 | Plan in dieser Fassung freigeben? | Codex: freigeben, sobald Förderfrist und Freigabevermerke berichtigt sind (in Entwurf 4 erledigt) |
| F2 | Kurzanleitung? | Codex und Claude: separates Dokument nur für Tim, nicht im öffentlichen Repo |
| F3 | Button „Link kopieren“? | Codex und Claude: erst bei Bedarf, zuerst mit wenigen geprüften Links ausprobieren |
| F4 | K1, K1a und K2 als ein Korrekturpaket? | Codex und Claude: ja, mit den Prüfungen aus Abschnitt 5 |
| F5 | K3 zurückstellen, K4 beobachten? | Codex und Claude: ja; K4 = „Ursache ungeklärt, bisher kein beobachteter Ausfall“ |
| F6 | K1a: Variante A (Bereinigung nur beim Absenden)? | Codex und Claude: A |
| F7 | Feste Höchstdauer für abgelaufene Blobs-Einträge (zeitgesteuerte Löschung oder Lösch-Routine)? | Claude: vorerst nein, den tatsächlichen Löschzeitpunkt offen beschreiben; bei Bedarf eigenes Paket |
| F8 | Förder-Wiedervorlage vor dem 31.12.2026 als eigenes Paket einplanen? | Claude: ja, Quellenprüfung zeitnah beginnen |

## 8. Offene Prüfungen

| Was | Wer |
|---|---|
| Vorausgefüllten Link per WhatsApp und per Mail auf dem Handy öffnen: Kommt die Konfiguration vollständig an? Nur öffnen und prüfen, nichts absenden. | Tim |
| Förderregeln anhand aktueller amtlicher Quellen erneut prüfen (BEG EM, §35c), vor dem 31.12.2026 | Claude bereitet vor, Codex liest gegen, Tim gibt frei |
| Wer im Team verschickt Links, und wie oft? Davon hängt F3 ab. | Tim |
| Vor jedem Deploy erneut `estimate:check`, `foerder:check`, `mcp-check` und Build ausführen (am 17.11.2026 lokal: die ersten beiden bestanden) | Claude, im PR |
