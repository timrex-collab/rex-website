# VELUX: Weiterarbeit und Merge mit Claude Code

Stand 06.09.2026. Repo: timrex-collab/rex-website. Einstieg: CLAUDE.md. Diese Übergabe enthält alles für Codearbeit, PR-Vorbereitung und schrittweise Übernahme; eine separate Chat-History ist dafür nicht nötig.

## 1. Verbindlicher Ausgangsstand

Sechs korrigierte Feature-Branches sind auf GitHub. Zum Übergabezeitpunkt kein PR für diese Reihe geöffnet, kein Paket gemergt, WebMCP-Produktion nicht aktiviert. Ausgangsbasis ist main 8b79926a74b8e84f75fea266c22ad265b4199e38. Dies ist ein historischer Prüfbefund, keine Aussage über einen späteren Live-Stand.

| Paket | Branch nach codex/velux-20260906- | Quellcommit | Dateien (Stufe B) |
|---|---|---|---|
| D1 | d1-core | 5dab9eaa4957cfe730f708c1b972c977d5011006 | 7 |
| D2 | d2-funding | 41ebd1dae26ae36816767f0b19f4ceb4681219e0 | 8 |
| D3 | d3-resolver | 34cc0e2ee1cf3227f31f8ab0815648c064f6cb23 | 5 |
| D4 | d4-webmcp-core | 6b43ee6bd859827b9c6766bead92b7359854b516 | 7 |
| D5 | d5-webmcp-tools | 2148fef4be6a0fb1daecabda5121538be21c513e | 8 |
| D6 | d6-checks | Nach fetch den aktuellen Head auflösen; muss genau ein Commit auf D5 sein | 8 |

Die D6-Übergabedateien sind Teil desselben atomaren D6-Commits. Seine SHA kann nicht in einer Datei dieses Commits selbst festgeschrieben werden. D6 deshalb über den Remote-Ref auflösen und gegen Elterncommit, Dateiliste und aktuellen CI-Lauf prüfen. Die maschinenlesbaren Referenzen stehen in VELUX-HANDOFF-MANIFEST.json.

Die alten claude/webmcp-velux-price-calculator-106a6c-Branches bleiben historische Referenzen. Nicht zusätzlich mergen. Kein Merge von D6 als Gesamtstack nach main und kein gemeinsames Deploy mehrerer D-Pakete.

## 2. Vollständiger Review-Stand ohne Eingriff in bestehende Arbeit

Aus einem vorhandenen lokalen Rex-Clone in PowerShell:

```powershell
git status --short
git fetch origin
git worktree add -b claude/velux-review-20260906 'C:/Users/User/Documents/Work/rex-velux-claude-review' origin/codex/velux-20260906-d6-checks
```

Claude Code anschließend in diesem neuen Ordner öffnen. Wenn Pfad/Branch bereits existieren, zuerst deren Status prüfen und weiterverwenden oder einen neuen Namen wählen; nichts löschen oder hart zurücksetzen. D6 ist der Arbeits-/Review-Stand, kein Produktions-Release-Branch.

Lesereihenfolge: CLAUDE.md → dieser Hand-off → VELUX-REVIEW-2026-09-06.md → VELUX-TYPENSCHILD.md → WEBMCP.md → Manifest. Für Codearbeit ggf. einen weiteren Branch von diesem Stand erzeugen. Jede zusätzliche Funktionsänderung braucht einen eigenen geprüften Deploy-Zuschnitt; nicht ungeprüft in bereits volle Pakete aufnehmen.

## 3. Sicherer Weg je Produktionspaket, auch nach Squash-Merges

**Empfohlen: frischer Release-Branch vom aktuellen main und genau einen Quellcommit cherry-picken.** Dadurch ist die Übernahme unabhängig davon, ob frühere PRs gesquasht oder mit anderen Commit-IDs gemergt wurden. Die sechs Quellbranches dienen als unveränderte Referenz. Ein bloßes Umstellen eines gestapelten Folge-PRs auf main nach einem Squash kann alte Commits wieder in den PR ziehen.

1. GitHub/main/Netlify aktuell lesen. Ermitteln, welche D-Pakete tatsächlich bereits übernommen und erfolgreich produziert wurden. Dazu gemergte PRs, deren Änderungen und Netlify commit_ref/publishedAt heranziehen; nicht allein Commit-Abstammung, Branchname oder diese Tabelle verwenden.
2. Nur das nächste noch offene Paket wählen. Vor Dn müssen alle Vorgänger erfolgreich in Produktion sein. Mindestens 48 Stunden seit dem letzten tatsächlichen Produktionsdeploy; zusätzlich mindestens 48 Stunden seit letztem main-Merge nach DEPLOY-RULES. Wenn sich beide Zeiten unterscheiden, den späteren Freigabezeitpunkt verwenden. Ohne Live-Nachweis keinen Merge freigeben; unabhängige Vorbereitung ist möglich.
3. Genau dieses Paket auf einen neuen Release-Branch von origin/main übernehmen. Keine sechs Cherry-Picks in einem Arbeitsgang und kein Merge des ganzen Quellbranches.

Beispiel ausschließlich für D1, aus dem Review-Clone heraus:

```powershell
git fetch origin
git worktree add -b claude/velux-d1-release 'C:/Users/User/Documents/Work/rex-velux-d1-release' origin/main
git -C 'C:/Users/User/Documents/Work/rex-velux-d1-release' cherry-pick 5dab9eaa4957cfe730f708c1b972c977d5011006
```

Für spätere Pakete Branch/Pfad und **einen** Quellcommit entsprechend ersetzen. D6-Quelle zuerst festhalten:

```powershell
$veluxD6Source = git rev-parse origin/codex/velux-20260906-d6-checks
git rev-list --count origin/codex/velux-20260906-d5-webmcp-tools..origin/codex/velux-20260906-d6-checks
git show --format=fuller --stat $veluxD6Source
```

Die Anzahl muss 1 und die Eltern-SHA die dokumentierte D5-SHA sein. Quellcommit anschließend in den konkreten PR-Text übernehmen.

4. Bei Konflikt prüfen, ob ein Vorgänger fehlt oder main andere Änderungen enthält. Konflikte fachlich auflösen oder den eigenen Cherry-Pick abbrechen; kein pauschales ours/theirs, kein fremdes Reset. Ein leerer Cherry-Pick ist Anlass, die bereits erfolgte Übernahme nachzuweisen, kein Grund für einen leeren Deploy.
5. Im Release-Worktree prüfen:

```powershell
git status --short
git rev-list --count origin/main..HEAD
git diff --name-only origin/main...HEAD
git diff --check origin/main...HEAD
npm ci
npm run check
npm run build
npm run faq:check
npm run faq:check -- --self-test
npm run estimate:check
```

Ein Commit, exakt der beabsichtigte Scope aus dem Manifest, höchstens acht Dateien. Jeden Exit-Code auswerten und bei einem Fehler nicht weiter zur Freigabe gehen. Falls main inzwischen weitergezogen ist, den Release-Stand erneut darauf ausrichten und den tatsächlichen Diff erneut prüfen.

6. Release-Branch pushen und einen Draft-PR mit base main erstellen. PR-Text aus Abschnitt 7 in eine UTF-8-Datei **außerhalb des Release-Worktrees** schreiben und mit gh pr create --draft --base main --head <Release-Branch> --title <Titel> --body-file <Datei> verwenden. Keine PR-Beschreibungsdatei zusätzlich in ein volles Paket committen. Vorher prüfen, ob für dieses Paket bereits ein passender PR existiert, und diesen bevorzugt weiterverwenden.
7. GitHub-Checks und Netlify-Preview des **aktuellen PR-Heads** prüfen. Erfolgreiche Tests alter Quellcommits sind kein Ersatz. Netlify bereit, commit_ref passend, Prerender/Build erfolgreich. Benötigte Sicht-/Botprüfung aus dem bestehenden Regelwerk durchführen; keinen eigenen Prerender hinzufügen.
8. Konkreten PR, Diff, Datei-/Commitzahl, aktuelle Checks, letztes Produktionsdatum, frühesten Mergezeitpunkt und Rollback-Ziel an Tim melden. Merge erfolgt erst nach seiner konkreten Freigabe. Kein Auto-Merge und keine automatische Kette. Squash über GitHub ist mit diesem Verfahren möglich; kein Direct-Push auf main.
9. Nach Merge den tatsächlich veröffentlichten Netlify-Commit/Bereitschaft und Rechner prüfen. Deploydatum, main-SHA, PR, Netlify-ID, Ergebnis und nächste früheste Freigabe protokollieren. Erst danach die nächste 48h-Frist beginnen. DEPLOY-RULES-Log als getrennte Root-Dokumentation pflegen, nicht als zusätzlichen Funktionscommit ins volle Paket hineinschieben; auch ein dafür ausgelöster Produktionsdeploy wird zeitlich berücksichtigt.

## 4. Prüfungen und ihre Grenzen

Alle sechs Quellstände wurden lokal mit Typecheck, Build, FAQ-Drift/Selbsttest und VELUX-Regressionen geprüft. Die komplette technische Reihe bestand [GitHub CI auf c61fcb8](https://github.com/timrex-collab/rex-website/actions/runs/34016397270). Die spätere Ergänzung dieser Übergabe verändert nur Root-Dokumentation; für den aktuellen D6-Head den neuen erfolgreichen Workflow auf GitHub prüfen. CLI: gh run list --workflow checks.yml --branch codex/velux-20260906-d6-checks --limit 5 --json headSha,status,conclusion,url.

Im ersten Linux-Lauf fehlte bufferutil im Lockfile. D4 enthält die gezielte Ergänzung; npm 10.9.4 prüft das Lockfile erfolgreich. Nicht auf ein früheres D4-Lockfile zurückwechseln. Node 22 ist CI-Referenz, lokaler nativer Nachweis erfolgte mit Chrome 152.0.7977.77. Playwright 1.62.1 und webmcp-types 0.1.5 sind exakt gepinnt.

Zusätzlich belegt: vier native Tools, gleicher Rechenwert in Tool/UI, Entwurfsschutz, Routen-Abmeldung, keine toolbedingten Netzwerkanfragen; mobile 390-px-UI, anonymes PDF, HTML-Escaping, Drucklayout und kein POST beim PDF-Test. CI wiederholt UI/PDF und Shim-/Flag-/Origin-Prüfungen und erzeugt herunterladbare Testartefakte. Lokale Protokolle sind Zusatzbelege, keine erforderliche Laufzeitabhängigkeit.

Kein Nachweis für: Token-Gültigkeit ohne Browserflag, reale Nutzung in ChatGPT/Claude/Gemini/Perplexity, Netlify-Formularzustellung, Live-Konversionen. Diese Punkte dürfen weder im PR noch im Deploy-Log als bestanden erscheinen. Keine echte Kundenanfrage allein zur technischen Prüfung versenden.

## 5. Quellen und fachliche Entscheidungen für spätere Änderungen

Der 306-seitige Benutzerkatalog ist mit dem [VELUX-Herstellerdownload](https://contenthub.velux.com/api/public/content/60a96-ceb73-2f4c8_downloadOriginal?v=8747b9ff) bytegleich. SHA-256: dc218ff67e61abf7a9f85b1c9ba202a9ae4a15d0b4c69714ce99ef3c6ef1586f. Preisgültigkeit 01.07.2026 und Dokumentstand 03.09.2026 getrennt behandeln. Neu heruntergeladene Dateien vor Verwendung auf Datum/Hash prüfen; eine abweichende neuere Fassung nicht ungeprüft als identischen Beleg behandeln.

302 vorhandene Preiswerte bestätigt; keine neue Preisfamilie. Innenrollos samt Montage aus Förderbasis entfernt. Demontage enthält nach der Rex-Lohnposition Entsorgung. SML-Steuerung und bauliche Austauschbedingungen nicht pauschal zugesagt. 047/Y47 niemals auf MK08 mappen. VU/VKU ENERGIE-AUSTAUSCH nicht mit der förderrelevanten ENERGIE-Verglasung der neuen Standardfenster gleichsetzen. Quellen und Seitenbelege stehen vollständig im Review und Typenschild-Dokument.

Die Regelprüfung endet intern am 31.12.2026. Danach keine ungeprüften Förderbeträge ausgeben; Frist nur nach erneuter amtlicher Quellenprüfung verlängern. Hersteller-Marketing ersetzt keine aktuelle Förder-Richtlinie.

Original-PDF/Excel, Volltextauszüge, ausgewählte Seitenbilder und Preisvergleichs-Arbeitsdateien bleiben lokal. Fundorte auf Tims Rechner:

- C:/Users/User/Documents/rex-website/260903_kat 5_VELUX_Gesamtkatalog_Juli_2026_DE.pdf
- C:/Claude Code/Dackdecker Assistent/Dachdecker Assistent/VELUX Komplett-Datei Excel 01.07.2026.xlsx
- C:/Users/User/Documents/Work/rex-velux-2026-09-06/ (catalog-comparison.json, compare_catalog.py, branch-checks, browser-results)

Diese Dateien sind für normale Codearbeit/Tests nicht notwendig. Für eine neue fachliche Preisprüfung offizielle aktuelle Unterlagen bzw. diese Originale verwenden. Keine Händlerkonditionen, Geschäftsunterlagen oder vollständigen Herstellerkataloge ins öffentliche Repo hochladen. Das Manifest enthält portable Prüfsummen, Fundstellen, Zähler und Prüfnachweise ohne solche Rohdaten.

## 6. Aktivierung und bewusst offene Pakete

D1–D6 aktivieren WebMCP nicht. D7 ist später ein eigener Env-Deploy: exakte Produktionsorigin, tatsächlich gültiges Trial-Token samt Ablaufdatum, nativer Test ohne Flag, zehn Agentenfälle laut WEBMCP.md, Rollback-Ziel und weitere 48 Stunden Pause. Nur Production-Context; reguläre Previews bleiben aus. Kein Token, Konto oder Anbieter muss für die jetzige Codeweiterarbeit eingerichtet werden.

Foto-MVP/PR-P2, Lead-Service/PR-3 und Telemetrie/PR-2b sind vorbereitet, aber nicht implementiert. Vor deren Umsetzung gelten die konkreten Entscheidungen zu Anbieter/Modell, Datenhaltung, Kostenlimit, atomarem Rate-Limit, Nutzerbestätigung und Zustellung aus dem Review. Nicht mit D1–D6 vermischen. Kein zugesagter universeller KI-/SEO-Effekt.

## 7. Fertige PR-Beschreibungen

Jeweils nur den Text des ausgewählten Pakets übernehmen. Vor Eröffnung um Quell-SHA, tatsächlichen Release-Head, aktuelle Check-/Preview-Links und konkret geprüften 48h-Zeitpunkt ergänzen. Die Texte setzen die Daten aus dem Manifest voraus; bei Abweichungen den Scope neu beschreiben.

### D1 – VELUX: Preislogik zentralisieren und Herstellerstand belegen

Die zuvor in der Komponente eingebetteten Preise und Berechnungen werden nach client/src/lib/velux ausgelagert. Bestehende Preiswerte bleiben gleich; Herstellerstand und Preisgültigkeit sind dokumentiert. Referenzkonfigurationen sichern unbeabsichtigte Rechenabweichungen ab.

Umfang: ein atomarer Commit, sieben Dateien, Stufe B; keine neue Route und keine WebMCP-Aktivierung. Validierung: npm ci, Typecheck, Build, FAQ-Drift/Selbsttest, estimate:check und passender Netlify-Preview. Vor Merge aktuellen 48h-Zeitpunkt bestätigen; Merge durch Tim.

### D2 – VELUX: Förderbasis, Leistungsumfang und UI/PDF korrigieren

Innenrollos einschließlich Montage erhöhen die Förderbasis nicht mehr. BEG-Staffel, §35c-Alter/Selbstnutzung und unsichere Antworten werden zentral behandelt; beide Förderwege erscheinen als getrennte Alternativen mit Annahmen. Leistungsumfang, Bruttoanzeige und Texte stimmen zwischen UI/PDF überein. Ein PDF ist ohne Kontaktpflicht möglich; Eingaben werden im Druckfenster als Text maskiert.

Voraussetzung: D1 erfolgreich übernommen. Ein Commit, acht Dateien, Stufe B. Validierung: Projektchecks sowie manuelle Referenzkonfiguration und Druckansicht; keine echte Anfrage versenden. Andere Förder-/Leistungsfälle bleiben ausdrücklich Beratungsfälle. 48h-Gate und Preview vor Merge prüfen.

### D3 – VELUX: Bestandsfenster anhand Herstellerkatalog auflösen

Der Primärquellen-Katalog ersetzt den früheren Größen-Seed. 047/Y47 wird nicht mehr fälschlich MK08 zugeordnet; unbelegte Zahlencodes werden nicht erzeugt. Alt-Codes, Bildquellen und unsichere Lesarten erfordern Bestätigung. Sondertypen und Einbausituationen bleiben fachlich zu prüfen.

Voraussetzungen: D1/D2 übernommen. Ein Commit, fünf Dateien, Stufe B. Validierung: Projektchecks, Katalog-Invarianten, Resolverfälle/Fuzz. Keine Foto-Uploadfunktion oder Datenübertragung hinzugefügt. 48h-Gate und Preview vor Merge prüfen.

### D4 – VELUX: Deaktivierten WebMCP-Adapter vorbereiten

Der Adapter prüft Flag/Origin, registriert asynchron und bindet Abmeldung an Abort. Der alte Navigator-Fallback entfällt; Fehler und Events enthalten keine Nutzdaten. Testabhängigkeiten sind exakt gebunden, das Lockfile ist mit npm 10 geprüft und vervollständigt.

Voraussetzungen: D1–D3 übernommen. Ein Commit, sieben Dateien, Stufe B. Noch keine Tools registriert. Validierung: sauberes npm ci, Typecheck, Build und Projektchecks; keine Production-Variablen setzen. 48h-Gate und Preview vor Merge prüfen.

### D5 – VELUX: Vier geprüfte WebMCP-Tools verdrahten

Optionen, Typenschild-Auflösung, Kostenschätzung und sichtbare Konfigurationsübernahme nutzen dieselbe Fachlogik wie der manuelle Rechner. Strikte Eingabeprüfung, Schutz begonnener Entwürfe und ein bestätigter UI-Commit verhindern widersprüchliche Ergebnisse. Kein Tool versendet eine Anfrage; Standardbuild und reguläre Previews bleiben aus.

Voraussetzungen: D1–D4 übernommen. Ein Commit, acht Dateien, Stufe B. Validierung: Projektchecks, nativer lokaler Chrome-Smoke und Flag-/Origin-Gegenproben. Der native Flag-Test beweist weder Produktions-Token noch KI-Anwendung. Aktivierung erfolgt später separat; 48h-Gate und Preview vor Merge prüfen.

### D6 – VELUX: Wiederholbare Browserprüfungen und Claude-Übergabe

Die CI prüft mobile Bedienung, anonymes PDF/HTML-Escaping, deaktiviertes WebMCP, aktive Shim-Tools und gesperrte Origins. Förderinformationen beginnen im Druck auf einer eigenen Seite. Wöchentliche Prüfungen erkennen fällige Förderreviews. Quellen, Betriebsplan, Claude-Einstieg, Paketmanifest und PR-Texte sind im Repo verfügbar.

Voraussetzungen: D1–D5 übernommen. Ein Commit, acht Dateien inklusive Root-Dokumentation, Stufe B. Validierung: vollständiger GitHub-Checks-Lauf auf dem aktuellen Release-Head, passende Preview und Druckansicht. Keine Produktionsaktivierung; echte Token-/Agenten-/Formularprüfungen bleiben vor den zugehörigen Freigaben offen. 48h-Gate vor Merge bestätigen.

## 8. Startauftrag zum Einfügen in Claude Code

> Lies CLAUDE.md, VELUX-HANDOFF.md und VELUX-HANDOFF-MANIFEST.json. Prüfe den aktuellen GitHub-, main- und Netlify-Stand. Bestimme das nächste noch nicht übernommene D-Paket. Bereite es auf einem isolierten Release-Branch vom aktuellen main als genau einen Commit und Draft-PR vor. Verwende die dokumentierten PR-Texte, führe alle erforderlichen Checks aus und prüfe den passenden Netlify-Preview. Beachte die Dateigrenze und die vollen 48 Stunden. Lege mir den konkreten PR mit Prüfnachweisen und frühestem Mergezeitpunkt vor. Merge erst nach meiner konkreten Freigabe; keine automatische Merge-Kette und keine WebMCP-Aktivierung. Quellen- und fachliche Korrekturen dieser Überarbeitung erhalten.
