# P4b – Server-Plugin `www.rex-bedachung.de/mcp`, Variante A (Entwurf 2 zur Freigabe)

Stand 11.11.2026. Grundlage: `UMSETZUNGSPLAN-2026-10-KI-ANFRAGEN.md` (P4), Ergebnis P4a (PR #112),
Entscheidung Tim für Variante A (11.11.2026), Regeln aus `CLAUDE.md` und `DEPLOY-RULES.md`.
Entwurf 2 arbeitet die Codex-Gegenlesung vom 11.11.2026 ein (Abschnitt 9). Noch nicht freigegeben,
noch kein Code.

## 1. Ziel und Abgrenzung

Ein Kunde fragt in ChatGPT (Web, Classic oder iPhone-App) nach dem Austausch seines VELUX-Fensters.
Mit dem verbundenen Rex-Plugin bekommt er die Kostenschätzung aus der zentralen Logik und kann die
Anfrage **direkt im Chat** an Rex senden. Sie geht wie eine Rechner-Anfrage in das Netlify-Formular
`velux-preisrechner` und von dort per Benachrichtigung ins Postfach.

**Nicht Teil von P4b:**
- **Fotoübertragung über ChatGPT** (Variante A). ChatGPT liest das Typenschild selbst. Ein Foto kommt
  über den Rechner-Link auf der Website (P1) oder wird nach unserer Antwort nachgereicht.
- **Veröffentlichung:** keine Erwähnung in `llms*.txt`, keine Kundenanleitung. Das gehört zu P5.
- **Änderungen an WebMCP**, an der Preis- und Förderlogik und an `robots.txt` oder an Redirects.
- **Strengere Regeln im Rechnerformular:** Das wäre eine Verhaltensänderung und gehört nicht hierher.

## 2. Werkzeuge

Ein Endpunkt `/mcp` als Netlify Function, ohne Authentifizierung, SDK
`@modelcontextprotocol/sdk` 1.32.1 fest gepinnt. Aufbau wie in P4a erprobt.

| Tool | Art | Wirkung |
|---|---|---|
| `rex_velux_get_options_v1` | lesend | wie P4a |
| `rex_velux_resolve_existing_window_v1` | lesend | wie P4a, mit Rückfrage bei unsicherer Zuordnung |
| `rex_velux_calculate_estimate_v1` | lesend | wie P4a, mit `calculatorUrl` |
| `rex_velux_prepare_inquiry_v1` | lesend, speichert nichts | prüft Eingaben, rechnet auf dem Server neu und liefert die vollständige Zusammenfassung, `summaryId` und `submissionKey` |
| `rex_velux_submit_inquiry_v1` | schreibend | sendet genau die vorbereitete und bestätigte Anfrage an Netlify Forms |

Das Fototool aus P4a fällt weg.

### 2.1 Prüfung der Eingaben auf dem Server
Die Regeln sind ausdrücklich festgelegt und entsprechen dem Rechner, nur mit Längengrenzen:
- **Name:** nach `trim` mindestens 2 und höchstens 100 Zeichen.
- **Erreichbarkeit:** E-Mail mit „@“ (höchstens 254 Zeichen) **oder** Telefon mit mindestens 6
  Zeichen (höchstens 40). Wie im Rechner reicht eines von beiden.
- **Optional:** Straße höchstens 120, PLZ höchstens 10, Ort höchstens 80 Zeichen. Eine PLZ-Prüfung
  gibt es nicht, auch nicht im Rechner.
- **Nachricht:** höchstens 2.000 Zeichen.
- **Positionen und Förderantworten:** über die bestehenden Prüfungen in `client/src/lib/velux`
  (`validateEstimateInput`), höchstens 10 Positionen.
- **Angaben zum Bestandsfenster (optional):** gelesene Typenbezeichnung (höchstens 40 Zeichen)
  und Status der Zuordnung, `bestätigt`, `vermutet` oder `keine`.
- **Gesamtgröße:** Anfragen über 64 KB lehnt der Server ab.

### 2.2 `prepare`: vollständige Zusammenfassung und Bindung
`prepare` baut auf dem Server den **kompletten Versandinhalt**: alle Formularfelder in der Form, in
der sie an Netlify gehen. Das sind die Kontaktdaten, die Kundennachricht, `konfiguration` mit allen
berechneten Beträgen und `quelle` mit dem Status der Fensterzuordnung. Dazu kommt die Rechenversion
(Katalog- und Regelversion wie in `estimateFingerprint`).

Zurück gehen drei Dinge:
- **`summary`:** dieser Inhalt lesbar aufbereitet, mit Kontaktdaten, Nachricht, Positionen,
  Beträgen, Förderhinweisen und Status der Fensterzuordnung, und mit dem Satz: „Das Foto aus diesem
  Chat wird nicht an Rex übertragen.“
- **`summaryId`:** SHA-256 über den vollständigen Versandinhalt einschließlich Rechenversion und
  `submissionKey`. Das ist eine Konsistenzprüfung und kein Nachweis einer menschlichen Zustimmung,
  deshalb braucht es kein Geheimnis und keine neue Produktionsvariable.
- **`submissionKey`:** eine Zufalls-ID, nicht aus Kontaktdaten abgeleitet. Sie ist der Schlüssel
  für den Doppelversandschutz (3.2).

Dazu die Anweisung an die KI: „Zeige dem Nutzer die Zusammenfassung vollständig und sende nur, wenn
er dieser konkreten Zusammenfassung ausdrücklich zustimmt. Ändert er etwas, rufe `prepare` neu auf.“

### 2.3 `submit`: nur das Bestätigte
`submit` bekommt dieselben Eingaben, `summaryId`, `submissionKey` und `userConfirmed: true`. Der
Server baut den Versandinhalt erneut und vergleicht den Hash mit der `summaryId`. Weicht er ab, weil
sich die Eingaben, die Preise oder die Rechenversion geändert haben, gibt es **keinen Versand**,
sondern `SUMMARY_MISMATCH` mit dem Hinweis: neu vorbereiten, neu zeigen, neu zustimmen.

`userConfirmed` liefert der aufrufende Client. Der Server kann daraus nicht ablesen, ob ein Mensch
zugestimmt hat. Die Zustimmung zur konkreten Zusammenfassung bleibt Teil des Gesprächsablaufs und
wird in der Abnahme geprüft (Abschnitt 6).

### 2.4 Inhalt der Anfrage
- **`konfiguration`:** Text aus derselben Funktion wie im Rechner. Sie wird dafür aus
  `VeluxPreisrechner.tsx` nach `client/src/lib/velux/inquiry.ts` verschoben. Das Verhalten des
  Rechners bleibt gleich.
- **`quelle`**, zum Beispiel:
  ```
  Aufmerksam geworden: KI-Assistent
  Konfiguration: per ChatGPT-Plugin, auf dem Server neu berechnet (Rechenversion …)
  Fensterzuordnung: vermutet (Typenschild laut KI: GGL S10 → SK10, nicht bestätigt)
  ```
- **Kein Antworttext von ChatGPT**, nur Werte aus der zentralen Logik und die Kundennachricht.
- **Kein Foto**, `typenschild` bleibt leer.

### 2.5 Antwort nach dem Versand (E1)
- **Mit E-Mail:** „Sobald wir Ihnen per E-Mail geantwortet haben, können Sie das Typenschildfoto in
  Ihrer Antwort mitsenden.“
- **Nur Telefon:** „Wie Sie uns das Foto nachreichen können, klären wir beim Rückruf.“
- Eine automatische Kundenmail gibt es nicht.

## 3. Schutz und Betrieb

### 3.1 Aufruflimits (Rückmeldung zu V5)
- **Allgemeines Limit pro Absender-IP**, über die Rate-Limit-Regel der Function. Im Personal-Tarif
  sind höchstens zwei Regeln möglich, mit einem Zeitfenster bis 180 s. Die Regel gilt für den ganzen
  Pfad `/mcp`, also auch für Verbindungsaufbau, Tool-Liste und Berechnungen.
  - Startwert: **60 Aufrufe pro 60 s je Absender-IP**, auf dem Preview überprüft.
  - Die Aufrufe kommen aus OpenAIs Infrastruktur. Eine IP steht deshalb nicht für einen einzelnen
    Kunden, und zu strenge Werte bremsen mehrere Kunden gemeinsam aus.
  - Ungültige Regeln lassen den Deploy nicht scheitern. Deshalb wird nach jedem Deploy im Log
    geprüft, ob die Regel aktiv ist.
  - Gilt schon ab Deploy 1.
- **Höchstens 50 neue Anfragen pro Tag (Europe/Berlin),** getrennt davon und nur für `submit`.
  Umsetzung mit atomarem Anlegen in Netlify Blobs: Jeder Versand muss vor dem POST einen der Plätze
  `quota/<Datum>/01` … `/50` mit `onlyIfNew` belegen.
  - Gleichzeitige Aufrufe können denselben Platz nicht doppelt belegen. Ein einfacher Zähler, der
    sich bei parallelen Aufrufen verzählt, entfällt.
  - Ein Platz enthält nur einen Zeitstempel, keine Eingaben.
  - Sind alle Plätze belegt, kommt `DAILY_LIMIT` mit Telefonnummer und Rechner-Link.
  - Plätze von Vortagen löscht der Server nur best effort (siehe 3.3).

### 3.2 Doppelversandschutz mit festen Zuständen
Schlüssel ist der zufällige `submissionKey`, kein Hash aus Kontaktdaten. Ablauf in `submit`:
1. **Reservieren:** `idem/<submissionKey>` mit `onlyIfNew` und dem Zustand **„in Bearbeitung“**
   anlegen. Gelingt das nicht, wird nicht gesendet, sondern der vorhandene Zustand gemeldet:
   - „in Bearbeitung“: `IN_PROGRESS`, bitte nicht erneut senden
   - „übermittelt“: `ALREADY_SENT`
   - „Ausgang unklar“: `OUTCOME_UNKNOWN` (siehe unten)
2. **Tageskontingent** belegen (3.1).
3. **POST an Netlify Forms.**
4. **Ergebnis festhalten:**
   - **2xx:** Zustand **„übermittelt“**, Erfolgsmeldung.
   - **Eindeutige Ablehnung** (Antwort 4xx oder 5xx): Reservierung löschen, Meldung
     `SEND_FAILED`, neuer Versuch erlaubt.
   - **Timeout, Verbindungsabbruch oder fehlende Antwort:** Zustand **„Ausgang unklar“**. Es gibt
     **keinen automatischen Neuversand und keine Erfolgsmeldung**. Der Kunde erfährt: „Ob die
     Anfrage angekommen ist, konnten wir nicht bestätigen. Bitte nicht erneut senden, wir melden
     uns. Bei Eile: 0234 / 58 31 00.“

**Getrennte Speicherbereiche:** `rex-mcp-production` und `rex-mcp-preview`, gewählt nach
Deploy-Kontext, als dauerhafte Stores. So überleben Produktionssperren einen neuen Deploy, und
Preview-Tests berühren die Produktion nicht.

### 3.3 Aufbewahrung
Netlify Blobs kennt kein automatisches Ablaufdatum. Jeder Aufruf löscht deshalb Einträge, die älter
als 24 Stunden sind (`idem/`) beziehungsweise von Vortagen stammen (`quota/`). Das ist keine
garantierte Löschung nach genau 24 Stunden. Ruft niemand an, bleiben Einträge länger liegen. Die
monatliche Lösch-Routine prüft deshalb zusätzlich den Store. Einträge enthalten nur Zufalls-ID,
Zustand und Zeitstempel, keine Eingaben. Sie werden trotzdem nicht als „ohne Personenbezug“
beworben, weil die Zufalls-ID zeitlich mit einer Anfrage zusammenfällt.

### 3.4 Bestätigung durch ChatGPT (Rückmeldung zu V7)
`submit` ist als schreibendes Tool gekennzeichnet (`readOnlyHint: false`). Laut OpenAI-Doku fragt
ChatGPT dann standardmäßig nach. Nutzer können die Zustimmung aber für weitere Aufrufe im selben
Chat merken lassen. Eine Rückfrage bei jeder Anfrage ist deshalb nicht garantiert. Die serverseitige
Bindung (2.3) und der Gesprächsablauf (2.2) tragen die Bestätigung. Die Abnahme prüft das auf allen
drei Oberflächen (Abschnitt 6).

### 3.5 Logs, Vorschau und Versand
- **Unsere Anwendungslogs** enthalten keine Eingaben, keine Kontaktdaten und keine IP, nur
  Tool-Name, Ergebnis-Code und Dauer. Über die Protokolle der Plattform (Netlify, OpenAI) geben wir
  kein Versprechen ab.
- **Preview:** `submit` sendet echt, mit „TEST – Preview“ in `name` und `quelle`, und nutzt den
  Preview-Store.
- **Lokal und in CI:** nur Probelauf ohne Versand, Blobs durch einen Speicher im Arbeitsspeicher
  ersetzt.
- **Versand:** serverseitiger POST an die eigene Seite, `application/x-www-form-urlencoded`,
  `form-name=velux-preisrechner`, leeres `bot-field`. Ob der Versand im Formular und im Postfach
  ankommt und wie der Spamfilter reagiert, zeigt erst der Preview-Test (V6). Eine 2xx-Antwort allein
  gilt nicht als Abnahme.

## 4. Datenschutz

Neuer Absatz in `Datenschutz.tsx`, Abschnitt Preisrechner, „Anfragen über ChatGPT (Rex-Plugin)“. Er
wird vor Deploy 2 ausformuliert und von Codex gegengelesen. Inhalt:
- **Wer was erhält:** Nutzt ein Kunde in ChatGPT das Rex-Plugin, erhält die Rex-Function bei Netlify
  ausgewählte Tool-Eingaben, nämlich Fensterangaben, Förderantworten, Kontaktdaten und Nachricht.
  Die Kontaktdaten kommen **schon bei der Vorbereitung der Zusammenfassung** an, nicht erst beim
  Absenden. Sie werden dabei verarbeitet, aber nicht gespeichert.
- **Absenden:** Erst beim ausdrücklichen Absenden geht die Anfrage in das Netlify-Formular und per
  Benachrichtigung an Rex.
- **Kein Foto:** Das Foto aus dem Chat wird über diesen Weg nicht übertragen.
- **Zweck und Rechtsgrundlage:** Bearbeitung der Anfrage nach Art. 6 Abs. 1 lit. b DSGVO.
  Missbrauchsschutz (Aufruflimit nach Absender-IP bei Netlify, Doppelversandschutz) nach
  Art. 6 Abs. 1 lit. f.
- **Speicherung:** Formular und Speicherdauer wie bei den übrigen Anfragen. Zusätzlich gibt es
  kurzlebige Versandvermerke (Zufalls-ID, Zustand, Zeitstempel) bei Netlify, die in der Regel nach
  24 Stunden gelöscht werden.
- **Datenverarbeitung bei OpenAI:** OpenAI verarbeitet das Gespräch nach seinen eigenen Bedingungen.
  Das wird mit einem Satz beschrieben, nicht nur mit „in eigener Verantwortung“.
- **Logs:** „Unsere Anwendungslogs enthalten keine Eingaben.“ Kein umfassendes Versprechen über
  Plattformprotokolle.

## 5. Deploys (Stufe C, je höchstens 5 Dateien, je 48 h Abstand)

**Deploy 1: Lesender Endpunkt live (E3)**
1. `netlify/functions/mcp.mts`: die drei lesenden Tools, freigeschaltet für `www.rex-bedachung.de`
   und Deploy-Previews, 64-KB-Grenze, Rate-Limit-Regel (3.1)
2. `scripts/mcp-check.ts`: Prüfskript aus P4a ohne Fototest, mit Prüfung der Freischaltung und der
   Größengrenze
3. `.github/workflows/checks.yml`: ein CI-Schritt
4. `package.json`: SDK 1.32.1 und `@netlify/blobs` (erst in Deploy 2 genutzt)
5. `package-lock.json`

`tsconfig.json` bleibt unverändert, wenn der Typecheck die Function über den Import im Prüfskript
erfasst. Das prüfe ich vor dem PR, sonst kommt `@netlify/blobs` erst in Deploy 2.

Nach dem Deploy prüfe ich im Netlify-Log, ob die Rate-Limit-Regel aktiv ist.

Abnahme durch Tim: zweiter Connector auf `https://www.rex-bedachung.de/mcp`, Schritte 2 und 3 aus
P4a.

**Deploy 2: Anfrage senden**
1. `netlify/functions/mcp.mts`: `prepare`, `submit`, Tageskontingent, Doppelversandschutz, Stores
   nach Kontext
2. `client/src/lib/velux/inquiry.ts` (neu): Versandinhalt, `konfiguration`, `quelle`, Prüfung der
   Kontaktdaten
3. `client/src/components/VeluxPreisrechner.tsx`: nutzt `inquiry.ts`, Verhalten unverändert
   (`velux-ui-smoke` muss unverändert grün bleiben)
4. `client/src/pages/Datenschutz.tsx`: neuer Absatz (Abschnitt 4)
5. `scripts/mcp-check.ts`: Tests für Prüfung, `SUMMARY_MISMATCH` (Eingabe, Betrag, Rechenversion),
   alle Zustände aus 3.2 einschließlich zweier gleichzeitiger `submit`, Tageskontingent mit
   parallelen Aufrufen, Probelauf

Passt der zuverlässige Versandschutz nicht sauber in 5 Dateien, gibt es einen **dritten Deploy**
und **keine verkürzte Lösung**. Mögliche Aufteilung: Deploy 2 bringt `prepare` und `submit` mit
Sperre, das heißt in Produktion `NOT_ENABLED` und nur auf Previews aktiv. Deploy 3 bringt den
Datenschutztext und schaltet die Produktion frei.

**Danach:** Doku-PR mit Deploy-Log, Plan-Datei und `MCP.md`. Nur Root-Dateien, und nur im selben
Monat wie der vorige Deploy (`__BUILD_DATE__`).

## 6. Abnahme von Deploy 2 (Preview, vor dem Merge; E2)

Mit erfundenen Kundendaten und einer eigenen, erreichbaren Testadresse, auf **Web, Classic und
iPhone-App**:
1. **Normaler Versand:** Zusammenfassung vollständig sichtbar, mit Kontaktdaten, Nachricht, Status
   der Fensterzuordnung und Foto-Satz. Zustimmung, dann Versand. Danach prüfen: Formulareintrag,
   Spamordner, Postfach, Inhalt von `konfiguration` und `quelle`.
2. **Ablehnen:** Der Nutzer lehnt ab, es wird nichts gesendet.
3. **Nachträglich ändern:** Nach der Zusammenfassung etwas ändern. Es muss eine neue Zusammenfassung
   und eine neue Zustimmung kommen, ein Versand mit der alten `summaryId` scheitert.
4. **Zweite Anfrage im selben Chat:** Fragt ChatGPT erneut nach, oder gilt die gemerkte Zustimmung?
   Ergebnis protokollieren. Die Zustimmung zur konkreten Zusammenfassung muss trotzdem im Gespräch
   erfolgen.
5. **Nur Telefon, ohne E-Mail:** Der Foto-Hinweis lautet „klären wir beim Rückruf“.

Danach löscht Tim die Testeinträge. Hinzu kommen Codex-Gegenlesung des Datenschutztexts und grüne
CI.

## 7. Entscheidungen (Stand nach Codex-Empfehlung)

- **E1 Foto:** Variante (a) mit den Texten aus 2.2 und 2.5. *Empfohlen.*
- **E2 Preview-Test:** ja, wie in Abschnitt 6. *Empfohlen.*
- **E3 Deploy 1 zuerst:** ja, mit Größengrenze und Rate-Limit-Regel. *Empfohlen.*
- **E4 Limits:** 60 Aufrufe pro 60 s je Absender-IP (Startwert, auf dem Preview geprüft) und
  höchstens 50 neue Anfragen pro Tag über atomare Plätze. *Zur Freigabe.*

## 8. Offene Prüfungen

- **V5:** geklärt durch Codex, siehe 3.1.
- **V6 (Preview):** Kommt der serverseitige POST in Formular und Postfach an, und landet er nicht im
  Spam?
- **V7 (Preview):** Bestätigungsverhalten wie in Abschnitt 6, Punkte 2 bis 4.
- **V8 (für P5, nicht blockierend):** Unter welchen Bedingungen können Kunden einen eigenen
  Connector hinzufügen (Tarif, Entwicklermodus)?
- **V9 (Deploy 1):** Ist die Rate-Limit-Regel laut Deploy-Log aktiv?

## 9. Änderungen gegenüber Entwurf 1 (Codex-Gegenlesung 11.11.2026)

1. **Aufruflimit:** IP-Limit 60 pro Minute statt 5 pro Stunde. Das Tageskontingent nutzt atomare
   Plätze statt eines Zählers. Die Grenzen der Personal-Regeln sind beschrieben.
2. **`summaryId`:** bindet den vollständigen Versandinhalt mit Beträgen und Rechenversion statt nur
   der Eingaben. Die Zusammenfassung zeigt auch Kontaktdaten, Nachricht und die Fensterzuordnung.
3. **Doppelversand:** atomare Reservierung, die Zustände „in Bearbeitung“, „übermittelt“ und
   „Ausgang unklar“, keine erfundene Erfolgsmeldung, getrennte und dauerhafte Stores für Preview
   und Produktion, Löschung ausdrücklich nur best effort.
4. **Bestätigung:** Der Server kann `userConfirmed` nicht überprüfen. Die Abnahme deckt Ablehnen,
   Ändern und eine zweite Anfrage im selben Chat ab.
5. **Datenschutz:**
   - Die Kontaktdaten kommen schon bei `prepare` an.
   - Rex erhält ausgewählte Tool-Eingaben.
   - Die Versandvermerke werden nicht als „ohne Personenbezug“ bezeichnet.
   - Das Log-Versprechen gilt nur für unsere Anwendungslogs.
   - Der Schlüssel für den Doppelversandschutz ist eine Zufalls-ID statt eines Hashs aus den
     Kontaktdaten.
6. **Prüfung der Eingaben:** ausdrücklich beschrieben, entspricht dem Rechner (Name und E-Mail
   oder Telefon), ohne PLZ-Prüfung, mit Längengrenzen.
7. **Foto-Hinweis:** unterscheidet zwischen Kunden mit E-Mail und Kunden nur mit Telefon.
8. **Dritter Deploy** ist zulässig, wenn der Versandschutz sonst verkürzt würde.
