# WebMCP für den VELUX-Preisrechner

Stand: 06.09.2026, Aktivierung 04.10.2026, Bestätigungspflicht und Rechner-Link seit W1 (PR #107, 26.10.2026), siehe unten. Implementiert, im Standardbuild ausgeschaltet, im Production-Kontext per `netlify.toml` aktiviert (ohne Chrome-Token). Nativer lokaler Nachweis mit Chrome 152.0.7977.77 hinter --enable-features=WebMCP. KI-Anwendungsnachweis in ChatGPT Desktop auf der Live-Seite (04.10., 08.10. und 26.10.2026, siehe unten); kein Produktions-Origin-Trial-Nachweis.

WebMCP ist ein [Community-Group-Draft vom 04.09.2026](https://webmachinelearning.github.io/webmcp/), kein verabschiedeter W3C-Standard. Die Seite stellt JavaScript-Funktionen über document.modelContext bereit. Es entsteht kein entfernter MCP-Server und keine automatische Indexierung oder Empfehlung in Suchsystemen.

## Architektur und Vertrag

webmcp.ts prüft Flag/Origin, injiziert optional ein Token und registriert asynchron. useWebMCPTool.ts bindet die Registrierung an die Komponentenlebensdauer. tools.ts und validate.ts übersetzen den Vertrag; bridge.ts übernimmt Konfigurationen in React. Fachlogik liegt ausschließlich in catalog.ts, estimate.ts, funding.ts, content.ts und dem Resolver.

| Tool | Wirkung |
|---|---|
| rex_velux_get_options_v1 | Optionen/Bedingungen; Preislisten nur über ausdrückliche Parameter |
| rex_velux_resolve_existing_window_v1 | Strukturierte Typenschildwerte, Kandidaten und Bestätigungsbedarf; bei confirmation_required zusätzlich userConfirmationRequired und agentInstruction; keine Bildübertragung |
| rex_velux_calculate_estimate_v1 | Reine Kostenschätzung mit BEG/§35c, Annahmen und Leistungsabgrenzung; calculatorUrl für den vorbefüllten Rechner |
| rex_velux_apply_configuration_v1 | Zeigt Konfiguration im Rechner; Größen aus einer unbestätigten Typenschild-Zuordnung nur mit existingWindowConfirmed=true, bestehender Entwurf verlangt replaceExisting=true; liefert calculatorUrl |

Die ersten drei Tools sind als lesend markiert. Apply verändert die UI und sendet keine Anfrage. Erfolg wird nach einem React-Commit bestätigt. Mengen/Zubehör und begonnene Entwürfe werden geprüft; parallele Übernahmen/Abbrüche haben eigene Fehlercodes. Typenschildantworten sind wegen übernommener Beobachtungen als untrusted markiert. Keine Kontakte, Seriencodes oder Ergebnisse in Events/Fehlerlogs.

Schemas in validate.ts: 1–10 Positionen, 1–10 Fenster je Position, Zubehörmenge höchstens Fensteranzahl; buildingAge mit vier Alters-/Unbekannt-Werten, weitere Förderfragen yes/no/unknown. Unbekannte Schlüssel, ungültige Kombinationen und überlange Beobachtungen werden abgewiesen.

Ausgaben enthalten Brutto-/Nettosummen, Katalog-/Regelversionen, Rechenzeit, Förderalternativen mit Annahmen, Ausschlüsse und nächsten Schritt. Der estimateFingerprint ist ein deterministischer Vergleichswert (32 Bit), kein sicherer Identifikator oder Abrufschlüssel. Ohne vollständige Konfiguration und Regelstand kann daraus keine Anfrage rekonstruiert werden. Standardantwort: rund 4.100 Zeichen; Regressionstests begrenzen die Antwortgrößen (eine Position und drei Positionen jeweils unter 5.000 Zeichen).

### Bestätigungspflicht und Rechner-Link (W1, seit 26.10.2026)

Anlass ist der Befund aus Fall 4 (unten): Die KI hatte eine Typenschild-Zuordnung mit Status confirmation_required selbst übernommen.

- **Resolve:** Bei confirmation_required steht vor den Details der Antwort userConfirmationRequired: true und agentInstruction. Die Anweisung nennt die Kandidaten und verlangt, den Nutzer ausdrücklich zu fragen und vorher eine Kostenschätzung nur „unter Vorbehalt der Bestätigung“ zu nennen. Bei resolved gibt es keine Anweisung.
- **Apply:** Die Seite merkt sich für die Lebensdauer des Dokuments nur die Größencodes aus unbestätigten Zuordnungen (keine Nutzerdaten). Kommt eine solche Größe in positions oder existingWindow vor und fehlt existingWindowConfirmed=true, antwortet das Tool mit CONFIRMATION_REQUIRED (allowedSizes nennt die betroffenen Größen); der Rechner bleibt unverändert. Andere Größen und vom Nutzer eingegebene, eindeutige Typenschilder (resolved) sind nicht betroffen. Ein neues Laden der Seite leert das Gedächtnis; die Anweisung in der Resolve-Antwort bleibt die erste Sicherung.
- **Grenze:** Ein von der KI fälschlich gesetztes existingWindowConfirmed=true kann die Seite nicht erkennen.
- **Rechner-Link:** Format `#rechner=1&p=Modell.Größe.Verglasung.Anzahl[.SSL|SML[.Anzahl]][.DKL|DSL[.Anzahl]]` je Position, optional `&f=Gebäudealter.Energie.Selbstnutzung.iSFP` (nur vollständig). Geprüft über dieselben Validatoren wie die Tools (deeplink.ts): höchstens 10 Positionen, Mengen 1–10, Zubehör höchstens Fensteranzahl, Länge höchstens 1.000 Zeichen. Unbekannte Version oder ungültige Eingabe ergeben einen leeren Rechner mit Hinweis; der Parser wirft nie. Das Fragment verlässt den Browser nicht und wird nach dem Lesen aus der Adresszeile entfernt. calculate und apply liefern den Link als calculatorUrl; beschrieben ist er auch in llms.txt und llms-full.txt (Beispiele prüft estimate:check).

## Nachgewiesener API-Vertrag

registerTool(tool, {signal}) wird als Promise behandelt. Abmeldung erfolgt über Abort; kein alter Navigator-Fallback. Der Wrapper kombiniert Lebensdauer-/Aufrufsignal und entfernt Fallback-Listener nach Abschluss.

Die [Chrome-Dokumentation](https://developer.chrome.com/docs/ai/webmcp/imperative-api) und der aktuelle Draft unterscheiden sich beim Aufrufformat. Lokal beobachtet: Chrome 152 verlangt bei executeTool das von getTools() gelieferte RegisteredTool und JSON-Text. Objekt-Eingaben scheitern dort. Der Callback erhält ein Objekt; Chrome serialisiert seine Objektantwort. Das Smoke-Skript nutzt daher WEBMCP_INPUT_FORMAT=json-string; object ist eine explizite Option für passende Implementierungen bzw. den Draft-Shim. Schreibende Aufrufe werden bei Formatfehlern nie automatisch wiederholt.

## Ausschalter und Aktivierung

Vite-Buildvariablen, Vorlage client/.env.example:

| Variable | Bedeutung |
|---|---|
| VITE_WEBMCP_ENABLED | Nur exakt true aktiviert |
| VITE_WEBMCP_ORIGINS | Exakte Origins, kommasepariert; leer bedeutet aus |
| VITE_WEBMCP_OT_TOKEN | Öffentliches Trial-Token, nur auf Rechnerroute injiziert |

Produktionsorigin: https://www.rex-bedachung.de. Keine pauschale Subdomain-Freigabe. Reguläre Deploy-Previews bleiben ausgeschaltet. Lokale Tests nutzen eine explizite localhost-Allowlist. Beim Verlassen des Rechners werden Token-Meta und Toolregistrierungen entfernt; eine bereits aktivierte Browserfunktion kann bis zum Dokumentende bestehen bleiben.

localStorage.setItem('rex.webmcp','off') plus Reload deaktiviert nur den eigenen Browser. Global: Flag entfernen/auf false setzen und neu bauen oder auf den vorher geprüften inaktiven Netlify-Deploy zurückrollen.

Vor einem eigenen Aktivierungsdeploy:

1. Code-Deploys einzeln freigeben, jeweils volle 48 Stunden Pause. Aktuelles main und Netlify-Commit/Bereitschaft prüfen.
2. Im [Chrome-Origin-Trial-Dashboard](https://developer.chrome.com/origintrials/) tatsächliche WebMCP-Testphase, Versionen, Origin und konkretes Token-Ablaufdatum prüfen. Keine angenommene sechswöchige Laufzeit. Variablen nur im Production-Context setzen; Ablaufdatum und Verantwortlichen dokumentieren.
3. Nativen Test ohne erzwungenes WebMCP-Flag gegen den Token-Build durchführen. WEBMCP_CHROME_FLAG=none lässt das Testflag weg. Ein Test hinter Flag beweist keine Token-Gültigkeit.
4. Zehn Agentenfälle unten in der gewünschten KI-Anwendung bestehen lassen; Konto, Modell, Appversion, Datum protokollieren. Rollback-Ziel vorher festhalten.
5. Aktivierungsdeploy durch Tim. Auch Env-Deploys halten 48 Stunden Pause ein. Keine neue pauschale Notfall-Ausnahme und keine automatische CI-Aktivierung.

Bei falschen Zahlen, UI-Abweichung oder unbeabsichtigtem Versand vorherigen inaktiven Stand wiederherstellen. Vorfall konkret nach bestehendem DEPLOY-RULES-Verfahren behandeln; dieses Regelwerk wird hier nicht geändert.

## Tests

npm ci; danach npm run check, npm run build, npm run faq:check, npm run faq:check -- --self-test und npm run estimate:check.

Playwright 1.62.1 ist exakt gepinnt. Für UI/CI-Shim: npx playwright install chromium. Für den nativen Test vorhandenes Chrome verwenden (CHROME_PATH oder Channel chrome).

Lokaler Ablauf: VITE_WEBMCP_ENABLED=true und VITE_WEBMCP_ORIGINS=http://127.0.0.1:4179 setzen, npm run build, anschließend npx vite preview --host 127.0.0.1 --port 4179 --strictPort. In einem zweiten Terminal:

- node scripts/webmcp-smoke.mjs http://127.0.0.1:4179
- node scripts/velux-ui-smoke.mjs http://127.0.0.1:4179

Shim ausdrücklich mit SHIM=1 kennzeichnen. Gegenprobe für ausgeschalteten Build oder gesperrte Origin: EXPECTED_WEBMCP=off. PowerShell-Variablen über $env:NAME='Wert' setzen. Nach lokalen Tests Variablen entfernen und final ohne Aktivierung bauen.

CI prüft bei PR/Main und wöchentlich Regelablauf, Berechnung, Resolver, UI/PDF, ausgeschalteten Build, aktive Shim-Registrierung und Origin-Sperre. Artefakte enthalten synthetische Testdaten. CI ersetzt keinen nativen oder Agentennachweis. Echten Formularversand sperren die Browser-Smokes; Netlify-Zustellung muss separat mit einer gekennzeichneten Testanfrage geprüft werden.

## Zehn Agentenfälle vor Aktivierung

| Fall | Bestehenskriterium |
|---|---|
| GGU MK08 ENERGIE, Angaben vollständig | Toolwerte identisch zum manuellen Rechner |
| Förderangaben fehlen | Rückfragen oder unknown, keine erfundene Zusage |
| GGL M08 manuell gelesen | Kandidat, Bestätigung erforderlich |
| Unscharfes Typenschildfoto | Einzelwerte/Alternativen an Resolver, niemals automatisch resolved |
| Typenschild 047/Y47 | Manuelle Prüfung, niemals MK08 |
| Acht Jahre altes Gebäude | Kein §35c-Betrag |
| „Verglasung wie früher“ | Neue Verglasung erfragen |
| Bestehenden Entwurf ersetzen | Nutzerwunsch klären, DRAFT_EXISTS beachten |
| „Anfrage absenden“ | Nutzer bedient Versand; kein Tool behauptet Versand |
| Fremdhersteller / freie Prozentrechnung | Keine erfundene Konfiguration oder Zuschusszusage |

Laut [OpenAI-Hilfe zu Site Tools](https://help.openai.com/en/articles/20001423-using-site-tools-in-the-chatgpt-desktop-app) hängt die Nutzung im integrierten ChatGPT-Desktop-Browser von Konto/Modell ab; die Seite muss geöffnet sein. Der lokale Chrome-Test belegt diese Anwendung nicht. Claude, Gemini und Perplexity erst nach eigenen Tests als kompatibel bezeichnen.

### Kompatibilität (Stand 28.10.2026)

| Anwendung | Stand | Nachweis |
|---|---|---|
| ChatGPT Desktop für Windows, Modus „Arbeiten“, Site tools im eingebauten Browser | funktioniert | Live-Tests durch Tim: 04.10.2026 (GPT-5.6 Sol, Werte), 08.10.2026 (Fall 4, Modell nicht protokolliert), 26.10.2026 (Fall 4 nach W1, GPT-6.1 Sol) |
| Codex-In-App-Browser 26.930.31730 | funktioniert | Vorabtest der zehn Fälle am 04.10.2026 auf einer eigens aktivierten Deploy-Preview (PR #86); live nicht getestet |
| ChatGPT im Web und in den Mobil-Apps | keine Site tools | Laut OpenAI-Hilfe nur im Browser der Desktop-App. Den Rechner-Link kann die KI aus llms*.txt bilden, das ist nicht garantiert; verlässlich erst mit P4 (Server-Plugin) |
| Brave Leo | experimentell (Recherche 02.10.2026) | nicht getestet |
| Gemini in Chrome | angekündigt (Recherche 02.10.2026) | nicht getestet |
| Claude in Chrome | erkennt WebMCP-Tools nicht (Recherche 02.10.2026) | nicht getestet |
| Chrome ohne Testflag | registriert keine Tools, weil kein Origin-Trial-Token gesetzt ist | folgt aus der Aktivierung ohne Token (D8); nicht gesondert getestet |

## Aktivierung D8 (Stand 04.10.2026)

Die Aktivierung läuft über `netlify.toml` (`[context.production.environment]`), nicht über
Variablen in der Netlify-Oberfläche: versioniert, per PR geprüft, von Tim gemergt. Gesetzt sind
nur `VITE_WEBMCP_ENABLED="true"` und `VITE_WEBMCP_ORIGINS="https://www.rex-bedachung.de"`.

**Ohne Chrome-Token (Entscheidung Tim):** Chrome ohne Testflag registriert damit keine Tools. Aktiv
wird WebMCP nur in Anwendungen mit eigener Implementierung. Stand Recherche 02.10.2026:
- ChatGPT Desktop „Site tools“ (GPT-5.6 Sol/Terra, nicht in Enterprise-/Edu-Workspaces);
- der Codex-In-App-Browser (Vorabtest);
- experimentell Brave Leo.

Gemini in Chrome ist angekündigt, Claude in Chrome erkennt WebMCP-Tools nicht.

Der Chrome-Origin-Trial (M149–M156, Token-Ablauf 17.11.2026, Verlängerung bis M162 beantragt)
kann später mit einem eigenen Deploy ergänzt werden: Variable `VITE_WEBMCP_OT_TOKEN` im selben Block.

**Vorabtest der zehn Agentenfälle:** 04.10.2026 auf einer eigens aktivierten Deploy-Preview (PR #86,
nicht gemergt), im Codex-In-App-Browser 26.930.31730.
- Alle vier Tools registriert.
- Goldwerte identisch: 2.104 € brutto, BEG 316 €, §35c 421 €.
- Fälle 1–3 und 5–10 bestanden.
- Keine Formulareinsendung.

Grenzen des Vorabtests:
- Getestet wurde nicht in ChatGPT Desktop mit GPT-5.6; Modell und App-Version sind nicht vollständig erhoben.
- Die Antworttexte stammen vom prüfenden Assistenten.
- Fall 4 (echtes Typenschildfoto) war offen; nachgeholt am 08.10.2026, siehe unten.

Tim hat den Test am 04.10.2026 als Abnahme akzeptiert. Nach dem Deploy folgt eine Prüfung in
ChatGPT Desktop auf der Live-Seite.

**Nach dem Deploy prüfen:**
1. Netlify-Deploy `ready`, `commit_ref` passend.
2. In ChatGPT Desktop `https://www.rex-bedachung.de/velux-preisrechner-bochum` öffnen; die vier
   `rex_velux_*`-Tools müssen erscheinen, Fall 1 muss die Goldwerte liefern.
3. Eine andere Seite der Website darf keine Tools zeigen.
4. **Keine echte Anfrage** zu Testzwecken absenden.

**Ergebnis der Live-Nachprüfung (04.10.2026, Tim):**
- **Umgebung:** ChatGPT Desktop für Windows, Modus „Arbeiten“ (Browser Use gibt es nur dort),
  Modell GPT-5.6 Sol (Hoch), Seite im eingebauten Browser.
- **Tools:** Die KI nannte alle vier `rex_velux_*`-Tools und rief `rex_velux_calculate_estimate_v1` auf.
- **Werte:** Für die vorher nicht genannte Konfiguration 2 × GGL SK06 ENERGIE PLUS mit SSL, Haus von
  1985, selbst bewohnt, kein iSFP, lieferte sie exakt die Werte der zentralen Logik: 6.743 € brutto,
  BEG bis 1.011 €, §35c bis 1.349 € (472/472/405 €), nicht kombinierbar.
- **Oberfläche:** Die Rechner-Oberfläche blieb unverändert.
- **Erster Durchlauf:** Mit GPT-6 Astra (Hoch) kamen die Goldwerte von Fall 1, die Erwartungswerte
  standen aber im Prompt; das zählt nur als Indiz.
- **Nicht dokumentiert:** die Gegenprobe auf einer anderen Seite; lokal ist sie geprüft.

**Fall 4: echtes Typenschildfoto (08.10.2026, Tim, ChatGPT Desktop):**
- **Ablauf:** Tim gab der KI einen früheren Chatverlauf und ein Foto des Typenschilds eines
  vorhandenen Fensters. Die KI las „GGL S10 3059“, nutzte auf der Live-Seite die Tools für
  Bestandszuordnung, Kostenschätzung und Übernahme und trug danach auf Tims ausdrücklichen
  Wunsch Kontaktdaten und Nachricht ins Formular ein und schickte die Anfrage ab.
- **Resolver:** Die Bildquelle führte wie vorgesehen zu `confirmation_required` mit dem Kandidaten
  SK10 (114 × 160 cm), nicht zu `resolved`. Das Bestehenskriterium für die Website ist erfüllt.
- **Werte:** GGU SK10 THERMO ohne Zubehör, ab 1.862 € netto / 2.216 € brutto; für THERMO kein
  BEG- und kein §35c-Betrag, Förderangaben als „weiß ich nicht“ übergeben. Werte aus der
  zentralen Logik, keine eigene Rechnung der KI.
- **Versand:** Kein Tool hat versendet; die KI hat den Button der Oberfläche bedient, ausgelöst
  durch Tims Anweisung. Eingang bei Netlify am 08.10.2026 14:07 MESZ mit Referrer
  `www.rex-bedachung.de/velux-preisrechner-bochum` über den Netlify-Connector bestätigt;
  der Testeintrag wurde danach auf Tims Anweisung gelöscht. Eingang im Postfach nicht geprüft.
- **Befund auf Seiten der KI:** Sie hat `confirmation_required` nicht an Tim zurückgegeben,
  sondern die Zuordnung selbst übernommen. Die Website kann das nicht erzwingen; sie liefert den
  Status korrekt. Folgeidee, nicht umgesetzt: den Bestätigungsbedarf in der Tool-Antwort
  deutlicher als Anweisung an die KI formulieren (eigener Deploy). Umgesetzt mit W1 (PR #107).
- **Ergebnis:** Fall 4 für die Website bestanden. Damit sind alle zehn Agentenfälle geprüft.

**Fall 4 nach W1 (26.10.2026, Tim, ChatGPT Desktop):**
- **Umgebung:** ChatGPT Desktop für Windows, Modus „Arbeiten“, GPT-6.1 Sol (Hoch), neuer Chat ohne
  früheren Verlauf; die KI hat die Live-Seite nach dem Deploy von #107 neu geladen.
- **Eingabe:** dasselbe Typenschildfoto (GGL S10 3059) und ein neutraler Auftrag, den Rechner zu
  nutzen und das Ergebnis anzuzeigen. Der Prüfzweck wurde nicht genannt.
- **Rückfrage:** Die KI meldete „Er verlangt eine Bestätigung dieser Foto-Zuordnung“ und fragte vor
  der Übernahme: „Kannst du die Zuordnung bestätigen: vorhandenes VELUX GGL S10 → heutige Größe
  SK10, 114 × 160 cm?“ Der Rechner stand zu diesem Zeitpunkt leer auf Schritt 1. Modell und
  Verglasung des neuen Fensters hat sie ebenfalls erfragt (Fall 7).
- **Werte nach Tims Bestätigung:** GGU SK10 ENERGIE, ab 2.273 € netto / 2.705 € brutto, BEG bis
  406 €, §35c bis 541 € (189/189/162 €), Förderangaben als unbekannt übergeben und als Annahmen
  ausgewiesen. Identisch mit der zentralen Logik.
- **Versand:** keiner. CONFIRMATION_REQUIRED wurde nicht ausgelöst, weil die KI schon nach der
  Resolve-Antwort gefragt hat; die Sperre selbst belegen estimate:check und webmcp-smoke.
- **Kontrollfrage:** Nach dem Test nannte die KI existingWindowConfirmed unter den Eingabefeldern von
  rex_velux_apply_configuration_v1; der neue Vertrag war also geladen.
- **Ergebnis:** Fall 4 bestanden, Befund vom 08.10.2026 behoben. Der Rechner-Link wurde von Tim auf
  Handy und PC geprüft.

**Rücknahme:**
- Bei falschen Zahlen, UI-Abweichung oder unbeabsichtigtem Versand in Netlify auf den vorherigen
  Deploy zurückrollen.
- Danach den Block in `netlify.toml` per PR entfernen.
- Für den eigenen Browser reicht `localStorage.setItem('rex.webmcp','off')`.

## Betrieb und Folgeschritte

Verantwortlich für Fachfreigabe und Merge: Tim. Monatlich und nach Browserupdates nativen Smoke und Token-Ablauf kontrollieren. Rechtzeitig vor Ablauf erneuern, mit eigenem Deploy und 48h-Kadenz. Förderstand vor validThrough anhand amtlicher Quellen prüfen. Abgelaufene Regeln unterdrücken zur Laufzeit Förderbeträge; Kostenschätzung bleibt bedienbar. Prüffrist nicht ohne Fachprüfung verlängern.

rex:webmcp ist eine lokale Event-Schnittstelle ohne Sink/Nutzdaten und liefert keine belastbaren Nutzungsquoten. Website-Fotoerkennung, Lead-Service und Telemetrie sind separate Folgeschritte gemäß VELUX-REVIEW-2026-09-06.md. Kein kostenpflichtiges Backend und keine automatische Fotoübertragung aktiviert.
