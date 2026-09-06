# VELUX-Rechner: Quellenprüfung, Umsetzung und Deploy-Plan

Stand: 06.09.2026. Grundlage: aktuelles main 8b79926, fünf frühere gestapelte Implementierungscommits, Integrations-PDF, Plan v3 vom 04.09.2026, relevante lokale VELUX-Unterlagen und erneut geprüfte Primärquellen. Dokumentanweisungen wurden als Planstand behandelt; maßgeblich bleiben die aktuellen Nutzerregeln.

## Ergebnis

Die vorhandenen Preise brauchen keine pauschale Aktualisierung: **302 von 302 geprüften Werten stimmen mit der Herstellerdatei gültig ab 01.07.2026 überein.** Korrigiert wurden Förderbasis, Bestandszuordnung, Leistungsabgrenzung, Druckausgabe und WebMCP-Vertrag. Keine neue Preistabelle, keine zusätzliche Produktfamilie, keine neue Route. WebMCP bleibt im ausgelieferten Standardbuild aus.

Die ursprünglichen fünf Branches sind durch eine korrigierte Reihe auf aktuellem main zu ersetzen. Nicht zusätzlich beide Reihen mergen. Insbesondere die alten 047/Y47-Zuordnungen und der pauschale Entsorgungsausschluss sind überholt. Der frühere Vorschlag, beide Adapterteile in einem Fenster zu mergen, wird nicht übernommen: volle 48 Stunden zwischen Produktionsdeploys.

## Quellen und Nachvollziehbarkeit

| Quelle | Prüfung / Verwendung |
|---|---|
| Benutzerdatei 260903_kat 5_VELUX_Gesamtkatalog_Juli_2026_DE.pdf | 306 PDF-Seiten, Text vollständig extrahiert, einschlägige Technik-/Austausch-/Preistabellen vertieft und bildlich geprüft |
| [VELUX Broschürenportal](https://www.velux.de/fachkunden/tools-technik/broschueren), [Katalogdownload](https://contenthub.velux.com/api/public/content/60a96-ceb73-2f4c8_downloadOriginal?v=8747b9ff) | Herstellerdownload bytegleich zur Benutzerdatei; Dokumentstand 03.09.2026, Preisgültigkeit ab 01.07.2026 |
| VELUX Komplett-Datei Excel 01.07.2026.xlsx | Nur Sortiment/SKU, Bezeichnung und öffentliche Nettopreise gelesen. 207 Fenster-, 19 EDW-, 38 Außenrollladen- und 38 Innenrollowerte stimmen exakt |
| [VELUX Maßübersicht 7061](https://afd-marketing.velux.com/-/media/marketing/de/dokumente/pdf/produktanleitungen/produktinformationen/dachfenster/velux-uebersicht-fensterabmessungen.pdf) | Historische Größen, ergänzend zum aktuellen Katalog |
| Rex lohnpositionen.csv und vorhandene Kalkulationsnotizen | Bestehende Position Demontage enthält Entsorgung; keine Händlerkonditionen übernommen |
| [BEG-EM-Richtlinie, KfW-Download](https://www.kfw.de/523-richtlinie) | 62 Seiten, Fassung 17.07.2026, wirksam ab 21.07.2026; insbesondere 8.3.1/8.4.2 und technische Mindestanforderungen |
| [§35c EStG](https://www.gesetze-im-internet.de/estg/__35c.html), [ESanMV](https://www.gesetze-im-internet.de/esanmv/BJNR000300020.html) | Altersbezug, Selbstnutzung, Uw-Grenze, Bescheinigung, Zahlung, Ausschlüsse und Jahresverteilung |
| [BAFA-Infoblatt förderfähige Kosten](https://www.bafa.de/SharedDocs/Downloads/DE/Energie/beg_infoblatt_foerderfaehige_kosten.pdf?__blob=publicationFile&v=30) | Abgrenzung außenliegender Verschattung/Umfeldmaßnahmen und Innenrollos |
| WebMCP-Draft, Chrome-Dokumentation, OpenAI-Hilfe | Links und konkrete Kompatibilitätsgrenzen in WEBMCP.md |

SHA-256 des Benutzer- und Herstellerkatalogs: dc218ff67e61abf7a9f85b1c9ba202a9ae4a15d0b4c69714ce99ef3c6ef1586f.

Auswertung und Vergleichsskript liegen lokal beim Arbeitsverzeichnis dieser Überarbeitung: compare_catalog.py, catalog-comparison.json, extrahierte Katalogtexte und ausgewählte Seitenbilder. Vollständige Herstellerdateien, Händlerkonditionen und andere Geschäftsunterlagen werden nicht ins öffentliche Repo übernommen. Der Quellenabgleich ist ein dokumentierter Stand, kein automatischer Datenfeed.

## Was der neue Katalog konkret ändert

Seitenangaben beziehen sich auf die gedruckte Katalogseite.

| Befund | Konsequenz für Rechner und Planung |
|---|---|
| S. 77/85/89/91: THERMO Uw 1,3; ausgewählte ENERGIE/ENERGIE PLUS Uw 1,0 | Bestehende vier manuellen Modelle und Aluminium-Standardvarianten beibehalten. Sonderausführungen nicht aus Standardwerten ableiten |
| S. 119–123: Altprogramme und Austauschmaße | 047/Y47 entfernt aus MK08-Mapping; Sonderprogramme manuell prüfen, alte Ausstiegs-/Klappfunktionen nicht automatisch ersetzen |
| S. 121: VU/VKU 0081 ENERGIE-AUSTAUSCH Uw 1,3 | Produktname ist keine Förderklassifikation; bleibt außerhalb automatischer Neukonfiguration |
| S. 123: Größenraster | 19 aktuelle + 19 Buchstaben- + 16 Zahlencodes verifiziert. Keine erfundenen Codes 106, 208, 804 |
| S. 123/125: vorhandene Innenfutter und Einbautiefen | Standard-EDW ist eine Kalkulationsannahme, keine zugesicherte Austauschlösung |
| S. 123: Innenfuttertiefe 36–44 / 45–71 / 72–94 / 95–117 / 118–148 mm | Lösung reicht je Bestand von vorhandenem EDJ über fehlenden Standardanschluss bis zu Austauschrahmen/ELX. Exakte Zuordnung vor Ort; kein automatischer EDW-Preisaufschlag |
| S. 195/202–205: SSL/SML neuer Generation | Zubehörpreis gilt für neues Fenster. Keine Nachrüstzusage neuer K-Rollläden auf Altgeneration 102–810 |
| S. 202–205: SML-Steuerung | KUX 110 bzw. passende 230-V-Integration gesondert zu prüfen; nicht im vorhandenen Rollladenpreis enthalten. Keine neue Steuerungspreisposition ergänzt |
| S. 227/229: DKL/DSL | Bleiben kaufmännisch enthalten, Material und Montage werden aus Förderbasis entfernt |
| S. 117: vereinfachte Förderwerbung | Keine pauschale 20-Prozent-Übernahme. Gesetzliche Staffelung hat Vorrang |
| Weitere Größen, elektrische Fenster, Sondermetalle, Austauschprodukte | Kein ungeprüfter Ausbau über die bestehenden 19 Größen / vier manuellen Modelle hinaus |

## Förderung und zentrale Texte

BEG: 15 Prozent auf berücksichtigte förderrelevante Ausgaben der ersten Wohneinheit; iSFP hebt die Grenze an, der Bonus greift nach der geprüften neuen Richtlinie nur oberhalb der ersten 30.000 Euro. Andere Wohneinheiten, bereits verbrauchte Jahresbudgets oder eigenständiger sommerlicher Wärmeschutz werden nicht separat berechnet. Die Software weist diese Begrenzung aus. Antrag/Vertrag mit Förderbedingung und Energieeffizienz-Experte gehören zu den Annahmen.

§35c: Dachflächenfenster Uw höchstens 1,0; Gebäude bei Durchführung mehr als zehn Jahre seit Herstellungsbeginn; Selbstnutzung und ausreichende Steuer in allen drei Jahren. Rechnung, unbare Zahlung, Fachunternehmerbescheinigung und Ausschluss von Doppelförderung sind sichtbar. Altersklassen von BEG (Bauantrag/Bauanzeige) und §35c können abweichen; dann unknown wählen und persönlich klären. Beide Alternativen bleiben gleichrangig, keine steuerliche Empfehlung.

Innenrollos inklusive Montage erhöhen weder BEG- noch §35c-Basis. Außenrollläden sind nur unter der ausdrücklich genannten Umfeldannahme des relevanten Fenstertauschs enthalten. Ein THERMO-Fenster wird nicht allein durch einen Rollladen förderrelevant. Die konkrete Anerkennung von Umfeldkosten ersetzt der Rechner nicht.

Brutto ist der primäre Ergebniswert. UI, PDF, Anfrage und Tools verwenden zentrale Texte und dieselbe Berechnung. Rundungen auf volle Euro sind erklärt. Entsorgung gehört zur bestehenden Demontageposition; „Erstellung Dachöffnung“ wird aus dieser Position entfernt, weil der gefundene Leistungsansatz diesen Umfang nicht belegt. Gerüst, Innenausbau, zusätzliche Luftdichtheitsarbeiten, Steuerung/Elektro und weitere ausgeschlossene Arbeiten sind benannt.

Regelprüfung am 06.09.2026, Wiedervorlage spätestens 31.12.2026. Nach Ablauf gibt die Software keine ungeprüften Förderbeträge aus, die reine Kostenschätzung bleibt nutzbar. CI meldet den fälligen Fachreview auch ohne neue Codeänderung. Die Frist ist eine interne Prüffrist, kein behauptetes Ende des Förderprogramms.

## UI, PDF und Technik

- Vier Förderfragen erlauben Unsicherheit; ausgewählte Antworten sind zugänglich markiert.
- Nur eine H1 auf der Seite. Manuelle UI und Toolvertrag haben dieselbe Positionsobergrenze.
- PDF ist ohne Kontaktpflicht nutzbar. Kontaktdaten werden als Text maskiert statt als HTML interpretiert; das Druckfenster hat keinen Zugriff über opener.
- Bei manuellem Versand wird das Druckfenster im Klickkontext geöffnet, damit es nicht erst nach einem asynchronen Request am Popupblocker scheitert. Die Bestätigung behauptet keine bereits gespeicherte PDF-Datei.
- Förderkarten und Summen werden beim Druck zusammengehalten. Geprüft wurden 390-px-Ansicht und echte A4-Druckausgabe.
- WebMCP hat keine eigene Preislogik, keinen Formularversand und keine Fotoübertragung. Native Chrome-Prüfung und Shim sind getrennt dokumentiert.
- Aktuelle Chunk-Fehlerbehandlung aus main bleibt erhalten. robots.txt, Routing, Redirects und Netlify-Konfiguration bleiben unverändert.

## Deploy-sichere Reihenfolge

Alle Codepakete sind Stufe B und bleiben bei höchstens acht Dateien; D3 und D6 zählen hier vorsorglich auch Root-Dokumentation mit. Jeder Schritt ist ein atomarer Commit auf dem vorherigen Branch. Nicht mehrere Schritte zu einem Produktionsdeploy bündeln. D1 frühestens nach Prüfung des letzten tatsächlichen Deploys; D2 frühestens 48 Stunden nach D1 usw. Kalendertage sind erst nach realem Netlify-Zeitpunkt festzulegen.

| D | Branch-Endung | Ziel und betroffene Dateien | Hebel / Reihenfolge |
|---|---|---|---|
| D1 | d1-core | catalog.ts, estimate.ts, VeluxPreisrechner.tsx, estimate-check, package.json, tsconfig.json, checks.yml (7) | Zentrale Preise, unveränderte Zahlen, Katalogprovenienz und Goldwerte zuerst |
| D2 | d2-funding | funding.ts, content.ts, estimate.ts, VeluxPreisrechner.tsx, VeluxPreisrechnerBochum.tsx, llms.txt, llms-full.txt, estimate-check (8) | Sachliche Förder-/Leistungskorrekturen und bessere PDF/Conversion vor KI-Kanal |
| D3 | d3-resolver | legacyCatalog.ts, resolve.ts, estimate.ts, estimate-check, VELUX-TYPENSCHILD.md (5) | Herstellergeprüfte Bestandsdaten, verhindert falsche Ersatzvorschläge |
| D4 | d4-webmcp-core | webmcp.ts, useWebMCPTool.ts, webmcp-compat.d.ts, client/.env.example, package.json, package-lock.json, tsconfig.json (7) | Adapter/Abhängigkeiten vorbereitet, noch keine Tools registriert |
| D5 | d5-webmcp-tools | tools.ts, validate.ts, bridge.ts, VeluxPreisrechner.tsx, estimate-check, webmcp-smoke.mjs, WEBMCP.md, README.md (8) | Vier geprüfte Tools verdrahtet, Produktionsflag bleibt aus |
| D6 | d6-checks | checks.yml, velux-ui-smoke.mjs, VeluxPreisrechner.tsx, .gitignore, dieser Review, CLAUDE.md, VELUX-HANDOFF.md, VELUX-HANDOFF-MANIFEST.json (8) | Wiederholbare UI-/PDF-/Flag-/Origin-Prüfung, separate Förderseite im Druck und vollständige Claude-Übergabe |
| D7 | späterer eigener Env-Deploy | Kein weiterer Funktionsumfang; nur geprüfte Production-Variablen | Erst nach echten Token-/Agententests und weiteren 48 Stunden aktivieren |

Branchpräfix: codex/velux-20260906-. Die ursprünglichen Branches bleiben als Historie bestehen. Gestapelte Diffs immer gegen den direkten Vorgänger prüfen. Beim Merge-Verfahren sicherstellen, dass pro Produktionsdeploy genau der eine nächste Commit ankommt; Basis bei Bedarf aktualisieren, keine Gesamtreihe versehentlich auf main mergen.

## Validierung und verbleibende Betriebsprüfung

Lokale Prüfungen: Typecheck, Produktionsbuild, FAQ-Drift und dessen Selbsttest, neun Referenzkonfigurationen, Fördergrenzen/Prüffrist, 54 Größencodes/39 Typen, 24 Resolverfälle plus 578 Fuzz-Kombinationen, 720 Validator-Fuzz-Eingaben, Presenter/Fingerprint/Apply-Fehlerpfade. Browser: native Chrome-Tools, Navigation/Abmeldung, Entwurfsschutz, kein toolbedingter Netzwerkverkehr; mobile Bedienung, anonymes PDF, HTML-Escaping und kein POST beim PDF-Test. Die Ergebnisse werden für jeden endgültigen Branch erneut geprüft.

Nicht als bestanden ausgeben: echte Origin-Trial-Aktivierung ohne Flag, Ende-zu-Ende-Nutzung in ChatGPT/anderen Agenten, Formularzustellung über Netlify oder Nutzerkonversionen. Dafür sind reale Umgebung und gekennzeichnete Testvorgänge erforderlich. Kein Produktionsdeploy und kein Merge sind Teil der lokalen Freigabeprüfung.

Bekannte bestehende Buildwarnungen (Browserslist-Daten/PostCSS) rechtfertigen keinen gleichzeitigen allgemeinen Dependency-Upgrade. Gesondert planen und mit eigenem Buildvergleich prüfen. Der große bestehende Rechner bleibt teilweise mit ts-nocheck markiert; vollständige Typisierung/Komponententrennung ist ein späterer eigener Refactor, keine Voraussetzung für weitere ungetestete Funktionsänderungen in diesem Deploy.

## Überholte Annahmen und bewusste Folgeschritte

**Nicht übernehmen:** alte 047/Y47-Zuordnung, aus Zahlenmustern erzeugte Größen, pauschaler Entsorgungsausschluss, generelles navigator.modelContext-Fallback, vermeintlich erfolgreicher Browsernachweis nur durch Shim, fixe Tokenlaufzeit, Freigabe aller Subdomains, Fingerprint als rekonstruierbare Anfrage, universelle KI-Kompatibilitäts-/Rankingzusage. Marketingbezeichnungen dürfen technische Werte nicht ersetzen. Garantieaussagen nicht pauschal erweitern; Registrierungsbedingungen prüfen.

**Foto-MVP (PR-P2):** separat. Vor Codefreigabe reale Typenschild-Testfälle über Generationen, schlechte Fotos und Sonderfunktionen zusammenstellen; Erfolgs-/Abbruchkriterien messen. Anbieter und tatsächlich verfügbares Modell anhand aktueller Primärquellen wählen, kein historisch genannter Modellname als sichere Verfügbarkeit. Kostenlimit, Auftragsverarbeitung, Region, Aufbewahrung einschließlich Anbieterlogs, Löschung und Einwilligung/Information festlegen. Clientseitig Größe/Metadaten reduzieren; serverseitig Typ/Größe prüfen, harte Nutzungsgrenzen und atomaren Zähler einsetzen. Öffentlich abrufbares HMAC-Token ist keine Benutzer-Authentifizierung; ein Read-then-write-Blobs-Zähler garantiert kein hartes Budget. Keine Behauptung „wird nicht gespeichert“, solange Providerretention ungeprüft ist. Ergebnis nur als strukturierte Beobachtung an bestehenden Resolver, dann Nutzerbestätigung.

**Lead-Service (PR-3):** noch nicht implementiert. Vorher Netlify-Zustellung, Spamkontrolle, Double-Submit/Idempotenz, vollständigen Konfigurationsdatensatz und Aufbewahrungsfrist festlegen. Ein prepare-Tool darf nur vorbereiten; Senden bleibt ein eigener ausdrücklicher Nutzerschritt. Fingerprint allein genügt nicht als Datensatz.

**Telemetrie (PR-2b):** noch kein Sink. Erst konkrete Betriebskennzahlen und Datenminimierung definieren; Registrierung, technischer Fehler, bestätigte UI-Übernahme unterscheiden. Keine Fotos, OCR-Texte, Kontaktwerte oder vollständige Konfigurationen protokollieren. Retention/Zugriff festlegen. Lokale Events nicht als gemessene Erfolgsquote ausgeben.

Diese Folgepakete setzen externe Entscheidungen und zusätzliche Deploys voraus. Sie werden nicht heimlich mit dem Rechner-/WebMCP-Grundpaket aktiviert. Zusätzliche Stadtteil-, Kosten-, Gewerbe- oder Roto-Clusterseiten, SearchAction und on-site AggregateRating bleiben ausgeschlossen.
