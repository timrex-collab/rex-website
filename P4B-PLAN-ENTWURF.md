# P4b – Server-Plugin `www.rex-bedachung.de/mcp`, Variante A (Entwurf zur Freigabe)

Stand 11.11.2026. Grundlage: `UMSETZUNGSPLAN-2026-10-KI-ANFRAGEN.md` (P4), Ergebnis P4a (PR #112),
Entscheidung Tim vom 11.11.2026 für Variante A, Regeln aus `CLAUDE.md` und `DEPLOY-RULES.md`.
Noch nicht freigegeben, noch kein Code.

## 1. Ziel

Ein Kunde fragt in ChatGPT (Web, Classic oder iPhone-App) nach dem Austausch seines VELUX-Fensters.
Mit dem verbundenen Rex-Plugin bekommt er die Kostenschätzung aus der zentralen Logik und kann die
Anfrage **direkt im Chat** an Rex senden. Sie geht wie eine Rechner-Anfrage in das Netlify-Formular
`velux-preisrechner` und von dort per Benachrichtigung ins Postfach.

**Nicht Teil von P4b:**
- **Fotoübertragung über ChatGPT** (Variante A). ChatGPT liest das Typenschild selbst. Ein Foto kommt
  nur über den Rechner-Link auf der Website (P1) oder später per Mail.
- **Veröffentlichung:** keine Erwähnung in `llms*.txt`, keine Anleitung für Kunden. Das gehört zu P5.
- **Änderungen an WebMCP**, an der Preis- und Förderlogik und an `robots.txt` oder an Redirects.

## 2. Werkzeuge

Ein Endpunkt `/mcp` als Netlify Function, zustandslos, ohne Authentifizierung, SDK
`@modelcontextprotocol/sdk` 1.32.1 fest gepinnt. Aufbau wie in P4a erprobt.

| Tool | Art | Wirkung |
|---|---|---|
| `rex_velux_get_options_v1` | lesend | wie P4a |
| `rex_velux_resolve_existing_window_v1` | lesend | wie P4a, mit Rückfrage bei unsicherer Zuordnung |
| `rex_velux_calculate_estimate_v1` | lesend | wie P4a, mit `calculatorUrl` |
| `rex_velux_prepare_inquiry_v1` | lesend | prüft Konfiguration und Kontaktdaten, **rechnet auf dem Server neu** und liefert die Zusammenfassung und eine `summaryId` |
| `rex_velux_submit_inquiry_v1` | schreibend | sendet genau die vorbereitete Anfrage an Netlify Forms |

Das Fototool aus P4a fällt weg.

### Ablauf einer Anfrage
1. **`prepare`** bekommt:
   - Positionen und Förderantworten
   - Kontaktdaten mit denselben Feldern und Pflichtangaben wie das Rechnerformular
   - eine optionale Nachricht
   - optional die Angaben zum Bestandsfenster, also die gelesene Typenbezeichnung und den Status
     der Zuordnung: `bestätigt`, `vermutet` oder `keine`

   Daraus baut der Server mit der zentralen Logik dieselbe Zusammenfassung wie das Rechnerformular,
   dazu den `quelle`-Text. Zurück gehen beide Texte, die `summaryId` und die Anweisung an die KI:
   „Zeige dem Nutzer diese Zusammenfassung und sende nur nach seiner ausdrücklichen Zustimmung.“
2. **`submit`** bekommt dieselben Eingaben, die `summaryId` und `userConfirmed: true`. Der Server
   rechnet erneut und prüft, ob die `summaryId` zum Inhalt passt. Weicht etwas ab, gibt es keinen
   Versand und den Fehler `SUMMARY_MISMATCH`. So geht nur raus, was der Nutzer gesehen hat.
3. Bei Erfolg kommt eine Bestätigung zurück, mit dem Hinweis zum Foto (siehe E1) und dem
   `calculatorUrl`.

**Zur `summaryId`:** Sie ist ein Hash über die normalisierten Eingaben, ohne Geheimnis. Sie soll keinen
Missbrauch verhindern, denn wer senden will, kann ohnehin `prepare` aufrufen. Sie stellt nur sicher,
dass zwischen Anzeige und Versand nichts verändert wurde. Dafür braucht es **keine neue
Produktionsvariable**.

### Was in der Anfrage steht
- **`konfiguration`:** Text aus derselben Funktion wie im Rechner. Die Funktion wird dafür aus
  `VeluxPreisrechner.tsx` nach `client/src/lib/velux/inquiry.ts` verschoben, damit es nur eine
  Fassung gibt.
- **`quelle`**, zum Beispiel:
  ```
  Aufmerksam geworden: KI-Assistent
  Konfiguration: per ChatGPT-Plugin, auf dem Server neu berechnet
  Fensterzuordnung: vermutet (Typenschild laut KI: GGL S10 → SK10, nicht bestätigt)
  ```
- **Kein Antworttext von ChatGPT** gelangt in die Anfrage, nur die Werte aus der zentralen Logik und
  die Nachricht des Kunden.
- **Kein Foto**, `typenschild` bleibt leer.

## 3. Schutz und Betrieb

- **Bestätigung:** `submit` ist als schreibendes Tool gekennzeichnet (`readOnlyHint: false`). Ob
  ChatGPT dann vor dem Aufruf selbst nachfragt, prüft Tim auf dem Preview (V7). Unabhängig davon
  verlangt der Server `userConfirmed` und eine passende `summaryId`.
- **Grenzen:**
  - Längengrenzen für alle Textfelder
  - höchstens 10 Positionen
  - Prüfung von E-Mail und PLZ wie im Rechner
- **Aufruflimit für `submit`:** Vorschlag 5 pro Stunde je IP und 50 pro Tag insgesamt (E4). Umsetzung
  über die Rate-Limit-Einstellung der Netlify Function, falls im Personal-Plan verfügbar (V5). Sonst
  ein Gesamtzähler pro Stunde in Netlify Blobs, ohne IP.
- **Doppelversand nach Timeout:** Idempotenz über einen Hash der `summaryId` in Netlify Blobs,
  24 Stunden lang. Ein zweiter `submit` mit gleicher `summaryId` meldet „bereits gesendet“, ohne
  erneut zu senden. Ältere Schlüssel löscht der nächste Aufruf. Das ist die im Plan erlaubte
  Ausnahme „Netlify Blobs nur für Idempotenz-Hashes“.
- **Logs:** keine Eingaben, keine Kontaktdaten, keine IP. Protokolliert werden nur Tool-Name,
  Ergebnis-Code und Dauer.
- **Vorschau und Produktion:**
  - Auf Deploy-Previews sendet `submit` echt, aber mit dem Präfix „TEST – Preview“ in `name` und
    `quelle`, damit Tim den ganzen Weg bis ins Postfach prüfen kann. Die Einträge löscht Tim danach.
  - Lokal und in CI gibt es nur einen Probelauf ohne Versand.
- **Versand an Netlify Forms:** serverseitiger POST an die eigene Seite, `form-name=velux-preisrechner`,
  leeres `bot-field`. Ob Netlify das annimmt und wie der Spamfilter reagiert, wird auf dem Preview
  geprüft (V6).

## 4. Datenschutz

Neuer Absatz in `Datenschutz.tsx`, Abschnitt Preisrechner, „Anfragen über ChatGPT (Rex-Plugin)“:
- **Datenweg:** Der Kunde nutzt ChatGPT in eigener Verantwortung gegenüber OpenAI. Die Daten aus dem
  Chat gehen über unsere Function bei Netlify (USA, wie bisher) in das Formular.
- **Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO.
- **Kein Foto** über diesen Weg.
- **Speicherdauer:** wie bei den übrigen Anfragen.
- **IP-basiertes Aufruflimit,** falls eingesetzt: Art. 6 Abs. 1 lit. f (Missbrauchsschutz), ohne
  Speicherung im eigenen System.

Codex liest den Text vor dem Merge gegen, das Ergebnis steht im PR.

## 5. Deploys (Stufe C, je höchstens 5 Dateien, je 48 h Abstand)

**Deploy 1: Lesender Endpunkt live**
1. `netlify/functions/mcp.mts`: die drei lesenden Tools, freigeschaltet für `www.rex-bedachung.de`
   und Deploy-Previews
2. `scripts/mcp-check.ts`: Prüfskript aus P4a, ohne Fototest, mit Prüfung der Freischaltung
3. `.github/workflows/checks.yml`: ein CI-Schritt
4. `package.json`: SDK 1.32.1 und `@netlify/blobs`. Blobs wird erst in Deploy 2 genutzt, steht aber
   schon hier, damit Deploy 2 ohne Lockfile auskommt.
5. `package-lock.json`

`tsconfig.json` bleibt unverändert, wenn der Typecheck die Function über den Import im Prüfskript
erfasst. Das prüfe ich vor dem PR. Klappt es nicht, wandert die Blobs-Abhängigkeit in einen
eigenen Deploy.

Abnahme: Tim legt einen zweiten Connector auf `https://www.rex-bedachung.de/mcp` an und
wiederholt die Schritte 2 und 3 aus P4a.

**Deploy 2: Anfrage senden**
1. `netlify/functions/mcp.mts`: `prepare` und `submit`, Aufruflimit, Idempotenz,
   Vorschau-Kennzeichnung
2. `client/src/lib/velux/inquiry.ts` (neu): Texte für `konfiguration` und `quelle`, Prüfung der
   Kontaktdaten
3. `client/src/components/VeluxPreisrechner.tsx`: nutzt `inquiry.ts`, Verhalten unverändert
4. `client/src/pages/Datenschutz.tsx`: neuer Absatz
5. `scripts/mcp-check.ts`: Tests für `prepare` und `submit`, darunter Abweichung, Doppelversand,
   Grenzen und Probelauf

Vor dem Merge testet Tim auf dem Preview den ganzen Weg: Anfrage im Chat, Bestätigung, Eintrag im
Formular, Mail im Postfach, Löschen. Dazu kommen die Codex-Gegenlesung und die Prüfung, dass
`velux-ui-smoke` für den Rechner unverändert grün ist.

**Danach:** Doku-PR mit Deploy-Log, Plan-Datei und `MCP.md`. Nur Root-Dateien, ohne Änderung der
Website, aber nur im selben Monat wie der vorige Deploy (`__BUILD_DATE__`).

## 6. Entscheidungen für Tim

- **E1 Fotohinweis nach dem Versand:**
  - (a) „Ein Foto des Typenschilds können Sie als Antwort auf unsere Mail nachreichen“
    (empfohlen)
  - (b) Hinweis vor dem Versand: „Wer ein Foto mitschicken möchte, sendet die Anfrage über den
    Rechner-Link.“ Sonst entstünden zwei Anfragen.
- **E2 Vorschau-Test:** echte TEST-Einträge im Formular, die du danach löschst. Empfohlen: ja.
- **E3 Deploy 1:** Der lesende Endpunkt geht schon vor `submit` in Produktion. Empfohlen: ja, damit
  der Produktions-Connector früh geprüft werden kann. Öffentlich beworben wird er erst mit P5.
- **E4 Aufruflimits:** 5 pro Stunde je IP und 50 pro Tag insgesamt, oder andere Werte.

## 7. Offene Prüfungen

- **V5 (Codex, Netlify-Doku):** Gibt es die Rate-Limit-Einstellung für Functions im Personal-Plan?
- **V6 (Preview, Claude und Tim):** Nimmt Netlify Forms den serverseitigen POST an? Landet er im
  Spam?
- **V7 (Preview, Tim):** Fragt ChatGPT vor einem schreibenden Tool selbst nach, auf Web, Classic und
  iPhone?
- **V8 (für P5, nicht blockierend):** Unter welchen Bedingungen können Kunden einen eigenen Connector
  hinzufügen (Tarif, Entwicklermodus)? Davon hängt ab, wie breit P5 wirken kann.

## 8. Aufwand und Termine

- **Aufwand:** Deploy 1 etwa 0,5 Arbeitstage, Deploy 2 etwa 2 bis 3 Arbeitstage, dazu deine Tests
  (etwa 1 h).
- **Deploy 1:** Das 48-h-Fenster ist offen. Der frühestmögliche Termin ergibt sich nach der Freigabe
  und `date`. Achtung: Ein Merge im Dezember zählt wegen `__BUILD_DATE__` in jedem Fall als
  Produktionsdeploy.
- **Deploy 2:** frühestens 48 h nach Deploy 1, nach deinem Preview-Test und der Codex-Gegenlesung.
