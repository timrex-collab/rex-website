# Rex: Einstieg für Claude Code

Lies zuerst [DEPLOY-RULES.md](DEPLOY-RULES.md). Für die vorbereitete VELUX-Überarbeitung anschließend [VELUX-HANDOFF.md](VELUX-HANDOFF.md) und [VELUX-HANDOFF-MANIFEST.json](VELUX-HANDOFF-MANIFEST.json). Der Hand-off dokumentiert den Stand vom 06.09.2026; prüfe aktuelle Branches, PRs, main und Netlify vor jeder weiteren Aktion. Neuere ausdrückliche Nutzeranweisungen haben Vorrang.

## Arbeitsregeln

- Änderungen auf isolierten Feature-/Release-Branches; keinen fremden Arbeitsbaum zurücksetzen. Vor einem Wechsel Status prüfen. Kein Direct-Push auf main, kein Auto-Merge.
- Die sechs VELUX-Branches sind gestapelt. D6 enthält den gesamten Stand zur Weiterarbeit, ist aber kein einzelnes Gesamtpaket für einen Merge nach main. Das sichere Verfahren für einzelne Deploys steht im Hand-off.
- Pro Produktionsdeploy ein atomarer Commit. Mindestens 48 Stunden Abstand, gemessen am tatsächlichen Produktionsdeploy; zusätzlich das Merge-Gate aus DEPLOY-RULES prüfen. Grenzen: A höchstens 12, B höchstens 8, C höchstens 5 Dateien. Root-Dokumentation in dieser Übergabe vorsorglich mitzählen.
- Tim entscheidet über den konkreten Merge. Der Auftrag, die Weiterarbeit vorzubereiten, ist keine aktuelle Produktionsfreigabe. PRs dürfen im Rahmen der beauftragten Weiterarbeit vorbereitet werden; keine automatische Folge von Merges ausführen.
- Keine neuen Preise/Kosten ergänzen. VELUX ausschließlich als autorisierter oder anerkannter VELUX-Partner bezeichnen. Keine Stadtteil-, separaten Kosten-, Gewerbe- oder Roto-Clusterseiten; kein SearchAction und kein on-site AggregateRating.
- robots.txt nur bei zwingender, separat begründeter Notwendigkeit; Redirects ausschließlich in netlify.toml; neue Routen nur mit lazy()-Import in App.tsx. Keine attached_assets-Dateien committen.
- Förderung und Preislogik ausschließlich zentral in client/src/lib/velux pflegen. Keine eigenen Rechenwege in UI, PDF oder WebMCP. Förder-Prüffristen nicht ohne Quellenprüfung verlängern.
- WebMCP bleibt bis zum eigenen freigegebenen Aktivierungsdeploy aus. Native Browserprüfung, Origin-Trial-Tokenprüfung und Tests mit einer KI-Anwendung sind drei verschiedene Nachweise.

Vor der Übergabe bzw. PR-Freigabe die im Hand-off genannten Prüfungen ausführen. Keine Kundenanfrage versenden, Anbieter buchen, Fotos übertragen oder Produktionsvariablen setzen, solange dies nicht gesondert beauftragt ist.
