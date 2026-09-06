# WebMCP für den VELUX-Preisrechner

Stand: 06.09.2026. Implementiert, standardmäßig ausgeschaltet. Nativer lokaler Nachweis mit Chrome 152.0.7977.77 hinter --enable-features=WebMCP; noch kein Produktions-Origin-Trial- oder KI-Anwendungsnachweis.

WebMCP ist ein [Community-Group-Draft vom 04.09.2026](https://webmachinelearning.github.io/webmcp/), kein verabschiedeter W3C-Standard. Die Seite stellt JavaScript-Funktionen über document.modelContext bereit. Es entsteht kein entfernter MCP-Server und keine automatische Indexierung oder Empfehlung in Suchsystemen.

## Architektur und Vertrag

webmcp.ts prüft Flag/Origin, injiziert optional ein Token und registriert asynchron. useWebMCPTool.ts bindet die Registrierung an die Komponentenlebensdauer. tools.ts und validate.ts übersetzen den Vertrag; bridge.ts übernimmt Konfigurationen in React. Fachlogik liegt ausschließlich in catalog.ts, estimate.ts, funding.ts, content.ts und dem Resolver.

| Tool | Wirkung |
|---|---|
| rex_velux_get_options_v1 | Optionen/Bedingungen; Preislisten nur über ausdrückliche Parameter |
| rex_velux_resolve_existing_window_v1 | Strukturierte Typenschildwerte, Kandidaten und Bestätigungsbedarf; keine Bildübertragung |
| rex_velux_calculate_estimate_v1 | Reine Kostenschätzung mit BEG/§35c, Annahmen und Leistungsabgrenzung |
| rex_velux_apply_configuration_v1 | Zeigt Konfiguration im Rechner; bestehender Entwurf verlangt replaceExisting=true |

Die ersten drei Tools sind als lesend markiert. Apply verändert die UI und sendet keine Anfrage. Erfolg wird nach einem React-Commit bestätigt. Mengen/Zubehör und begonnene Entwürfe werden geprüft; parallele Übernahmen/Abbrüche haben eigene Fehlercodes. Typenschildantworten sind wegen übernommener Beobachtungen als untrusted markiert. Keine Kontakte, Seriencodes oder Ergebnisse in Events/Fehlerlogs.

Schemas in validate.ts: 1–10 Positionen, 1–10 Fenster je Position, Zubehörmenge höchstens Fensteranzahl; buildingAge mit vier Alters-/Unbekannt-Werten, weitere Förderfragen yes/no/unknown. Unbekannte Schlüssel, ungültige Kombinationen und überlange Beobachtungen werden abgewiesen.

Ausgaben enthalten Brutto-/Nettosummen, Katalog-/Regelversionen, Rechenzeit, Förderalternativen mit Annahmen, Ausschlüsse und nächsten Schritt. Der estimateFingerprint ist ein deterministischer Vergleichswert (32 Bit), kein sicherer Identifikator oder Abrufschlüssel. Ohne vollständige Konfiguration und Regelstand kann daraus keine Anfrage rekonstruiert werden. Standardantwort: rund 4.000 Zeichen; Regressionstests begrenzen die Antwortgrößen.

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

## Betrieb und Folgeschritte

Verantwortlich für Fachfreigabe und Merge: Tim. Monatlich und nach Browserupdates nativen Smoke und Token-Ablauf kontrollieren. Rechtzeitig vor Ablauf erneuern, mit eigenem Deploy und 48h-Kadenz. Förderstand vor validThrough anhand amtlicher Quellen prüfen. Abgelaufene Regeln unterdrücken zur Laufzeit Förderbeträge; Kostenschätzung bleibt bedienbar. Prüffrist nicht ohne Fachprüfung verlängern.

rex:webmcp ist eine lokale Event-Schnittstelle ohne Sink/Nutzdaten und liefert keine belastbaren Nutzungsquoten. Website-Fotoerkennung, Lead-Service und Telemetrie sind separate Folgeschritte gemäß VELUX-REVIEW-2026-09-06.md. Kein kostenpflichtiges Backend und keine automatische Fotoübertragung aktiviert.
