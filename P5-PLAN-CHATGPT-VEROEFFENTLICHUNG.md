# P5-Plan, Entwurf 2: Website-Rechner als Hauptweg, ChatGPT-Veröffentlichung zurückgestellt

Stand 17.11.2026, **zur Freigabe, noch nicht freigegeben.** Ersetzt Entwurf 1 vom 15.11.2026 (`61a47dc`, im
Git-Verlauf dieses Branches).

Geprüft am 17.11.2026 gegen `origin/main` (`c5dbcfa`, seit #117 unverändert): `client/src/lib/velux/deeplink.ts`,
`tools.ts`, `client/src/components/VeluxPreisrechner.tsx`, `export-gate.ts`, `netlify/functions/mcp.mts`,
`client/public/llms*.txt`, `Datenschutz.tsx`. In diesem Schritt wurde kein Produktivcode geändert. Es gibt
keinen PR, keinen Deploy, keine Einreichung und keinen Versand. `estimate:check` lief hier nicht, weil
`node_modules` in dieser Umgebung fehlt.

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

**Der gewünschte Kundenablauf funktioniert heute vollständig auf `/velux-preisrechner-bochum`.**

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

**Stufe 0 – ohne Code (empfohlen als Start):**

- Claude erstellt eine einseitige interne Kurzanleitung „Rechner-Link für Kunden erstellen“: Format,
  Größencodes, fünf fertige Beispiel-Links für häufige Fälle, Hinweis „Förderangaben nur, wenn der Kunde sie
  genannt hat“. Die Datei liegt im Repo-Root oder nur bei Tim. Sie geht nicht auf die Website.
- Tim prüft einen Link einmal über WhatsApp und einmal per Mail auf dem Handy (Abschnitt 2, Punkt 2).
- Den normalen Rechner-Link verwendet das Team für Antwortvorlagen, die E-Mail-Signatur und das Google-Profil.
  Das sind Tims Kanäle; Claude ändert dort nichts.

**Stufe 1 – nur falls Stufe 0 im Alltag zu umständlich ist (Entscheidung Tim):**

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
| K4 | Der erste Aufruf einer ChatGPT-Sitzung endet mit 400, danach kommt 200. | Ohne funktionale Wirkung. | **beobachten**; bei Gelegenheit im Netlify-Log klären, Codeänderung nur bei echtem Fehler |

**Vorschlag:** K1 und K2 in **einem** Deploy, also `mcp.mts`, `scripts/mcp-check.ts`, `Datenschutz.tsx` und
`MCP.md`. Das sind 4 Dateien, Stufe C, weil Function-Code betroffen ist. Lieber getrennt? Dann zwei Deploys mit
jeweils 48 h Abstand. Nach dem Merge in ChatGPT „Tools aktualisieren“ und einen Versand-Test (P4) einmal
wiederholen.

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
- Mögliche Reihenfolge: (1) Stufe 0 ohne Deploy; (2) K1 und K2; (3) gegebenenfalls Stufe 1. Ein Förder-Deploy
  aus der Wiedervorlage von `estimate:check` geht vor, wenn er eine falsche Zahl auf der Live-Site korrigiert.
- Doku nach der Freigabe: `MCP.md` („Offen“) und Umsetzungsplan-Tabelle: P5 „zurückgestellt, Website-Rechner ist
  Hauptweg (Entscheidung 17.11.2026)“. Das läuft im selben PR wie K1/K2 oder als reiner Doku-PR.

---

## 7. Entscheidungen für Tim

| Nr. | Frage | Vorschlag |
|---|---|---|
| F1 | Plan in dieser Form freigeben (Website-Rechner Hauptweg, Veröffentlichung zurückgestellt)? | ja |
| F2 | Stufe 0: interne Kurzanleitung für Rechner-Links erstellen? Wo soll sie liegen (Repo oder nur bei dir)? | ja; Repo-Root, nicht auf der Website |
| F3 | Stufe 1 (Button „Link kopieren“) jetzt oder erst bei Bedarf? | erst bei Bedarf |
| F4 | K1 und K2 umsetzen, in einem Deploy? | ja, ein Deploy; K2 nach Codex-Gegenlesung |
| F5 | K3 und K4 zurückstellen bzw. beobachten? | ja |

## 8. Offene Prüfungen

| Was | Wer |
|---|---|
| Vorausgefüllten Link per WhatsApp und per Mail auf dem Handy öffnen: Kommt die Konfiguration vollständig an? | Tim |
| Wer im Team verschickt Links, und wie oft? Davon hängt F3 ab. | Tim |
| Vor einem Deploy: `estimate:check` und `foerder:check` (in dieser Umgebung nicht gelaufen) | Claude, im PR |
