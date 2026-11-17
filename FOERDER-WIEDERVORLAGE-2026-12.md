# Förder-Wiedervorlage 12/2026 – Prüfauftrag und Umsetzungsplan

Stand 17.11.2026, vorbereitet von Claude, **noch nicht freigegeben**. Auftrag von Tim vom 17.11.2026: „Förder-Wiedervorlage
vorbereiten“.

## 1. Worum es geht

- In `client/src/lib/velux/funding.ts` steht für BEG EM und §35c `lastReviewedAt: 2026-09-06` und
  `validThrough: 2026-12-31`.
- `validThrough` ist eine **interne Prüffrist**. Sie bedeutet nicht, dass ein Förderprogramm endet.
- Ab dem 01.01.2027 gilt ohne Aktualisierung:
  - Rechner, PDF, Anfrage, WebMCP und MCP zeigen **keine Förderbeträge** mehr. Stattdessen erscheint
    der Hinweis, die Förderung persönlich zu klären. Die Kostenschätzung bleibt nutzbar.
  - `estimate:check` bricht ab. Dann ist die CI für jeden PR rot.
- Regel aus `CLAUDE.md`: Förder-Prüffristen werden nicht ohne Quellenprüfung verlängert.

## 2. Quellenlage dieser Sitzung

Aus der Claude-Umgebung sind am 17.11.2026 **nicht erreichbar**: gesetze-im-internet.de, bafa.de, kfw.de,
energiewechsel.de und bundesanzeiger.de. Der Proxy bzw. die DNS-Auflösung ist gesperrt.

Die Websuche lieferte nur Ratgeberseiten, keine amtlichen Texte. Darin fand sich kein Hinweis auf geänderte
Fenster-Fördersätze zum 01.01.2027. Der WPB-Bonus ab etwa Q1 2027 gilt nach diesen Seiten nicht für Fenster.
Die Energieberatungsrichtlinie (iSFP-Förderung) soll Ende 2026 auslaufen. **Das ist keine Quellenprüfung**,
sondern nur ein Hinweis, worauf die Prüfung achten muss.

**Die Primärquellenprüfung übernimmt deshalb Codex (oder Tim). Claude prüft gegen den Code und setzt um.**

## 3. Prüfliste (je Punkt: Primärquelle, Fundstelle, Abrufdatum, Ergebnis)

### BEG EM (BAFA-Zuschuss)

| Nr. | Was im Code steht | Fundort im Code | Zu prüfen in |
|---|---|---|---|
| B1 | Grundfördersatz Gebäudehülle **15 %** | `BEG.rate` | aktuelle Richtlinie BEG EM, Nr. 8.4 |
| B2 | Förderfähige Ausgaben 1. WE **30.000 €** ohne iSFP, **60.000 €** mit iSFP | `BEG.capWithoutIsfp/capWithIsfp` | Richtlinie Nr. 8.3, BMWE-FAQ |
| B3 | iSFP-Bonus **5 Prozentpunkte nur auf den Anteil über 30.000 €** | `evaluateBeg`, `FUNDING_NOTES.isfp` | BMWE-FAQ A.3.2 bzw. Richtlinie |
| B4 | Gebäude mindestens **5 Jahre** alt (Bauantrag/Bauanzeige) | `evaluateBeg` | Richtlinie, Fördervoraussetzungen |
| B5 | Dachflächenfenster **Uw ≤ 1,0 W/m²K** | `isEligibleGlazing`, `FUNDING_NOTES.thermo` | Technische Mindestanforderungen (TMA) |
| B6 | Antrag vor Vorhabenbeginn, Vertrag mit Förderbedingung, Energieeffizienz-Experte | Annahmen in `evaluateBeg` | Richtlinie, BAFA-Merkblatt |
| B7 | Fachplanung **50 %**, förderfähig bis **5.000 €** bei EFH/ZFH (max. 2.500 €) | `FUNDING_NOTES.fachplanung` | Richtlinie Nr. 8.4.7 / 8.3.1 b |
| B8 | KfW-Ergänzungskredit **358/359** bis **120.000 €** je WE nach BAFA-Zusage | `FUNDING_NOTES.kfw` | KfW-Programmseite |
| B9 | Innenrollos nicht förderfähig; Außenrollläden nur als Umfeldmaßnahme | `eligibleCosts` | BAFA-Infoblatt förderfähige Kosten |
| B10 | **Fassung der Richtlinie:** Rechner „Richtlinie ab 21.07.2026“ (`effectiveFrom`), `llms*.txt` „Richtlinie vom 17.08.2026“, `BEG-UPDATE-2026-07.md` „vom 17.07.2026“ | `RULES.beg`, `llms*.txt` | Bundesanzeiger: gültige Fassung, Datum, Änderungen seit September |
| B11 | **Haushalt 2027 / Förderstopp:** Gibt es Änderungen, Antragsstopp oder Kürzungen ab 01.01.2027? | – | BAFA-Aktuelles, BMWE, Bundestag |
| B12 | **Energieberatungsrichtlinie (iSFP-Förderung) endet 31.12.2026?** Ein bestehender iSFP bleibt nach unserem Verständnis für den Bonus nutzbar, das ist zu bestätigen. | `FUNDING_NOTES.isfp` | BAFA Energieberatung, Richtlinie BEG EM |

### §35c EStG (Steuerermäßigung)

| Nr. | Was im Code steht | Fundort im Code | Zu prüfen in |
|---|---|---|---|
| S1 | **7 % / 7 % / 6 %** über drei Jahre, höchstens **40.000 €** (Basis 200.000 €) | `TAX35C` | § 35c Abs. 1 EStG |
| S2 | Gebäude bei Durchführung **älter als 10 Jahre** | `evaluateTax35c` | § 35c Abs. 1 |
| S3 | nur **selbstgenutztes Wohneigentum** | `evaluateTax35c` | § 35c Abs. 1 |
| S4 | Dachflächenfenster **Uw ≤ 1,0** | `isEligibleGlazing` | ESanMV Anlage |
| S5 | Fachunternehmen mit Bescheinigung nach amtlichem Muster, Rechnung, unbare Zahlung, keine Doppelförderung | Annahmen, `FUNDING_NOTES.taxRequirements` | § 35c Abs. 1, 3, 4 |
| S6 | Anwendung für Maßnahmen, die **vor dem 01.01.2030 abgeschlossen** sind | – | § 52 Abs. 35a EStG (Codex 17.11.2026: bestätigt) |
| S7 | Änderungen durch ein Jahressteuergesetz 2026 oder ein anderes Gesetz seit September? | – | BGBl., gesetze-im-internet.de |

**Ergebnis je Punkt:** bestätigt, geändert (mit neuem Wert) oder unklar. Ein unklarer Punkt bei einem Betrag
oder Satz heißt: Die Frist wird nicht verlängert, der Punkt wird geklärt.

## 4. Umsetzung nach der Quellenprüfung

**Fall A: alles bestätigt.**

| Datei | Änderung |
|---|---|
| `client/src/lib/velux/funding.ts` | `lastReviewedAt` auf das Prüfdatum und `validThrough` auf das neue Datum (Vorschlag unten), beides für BEG und §35c. `rulesVersion` bleibt gleich, weil sich die Regeln nicht ändern. Damit bleibt auch die Rechenversion der MCP-Anfragen gleich. |
| `scripts/velux-estimate-check.ts` | Ablauftest liest die Frist aus `RULES` statt fester Daten. **Bereits vorbereitet** auf diesem Branch, siehe Abschnitt 6. |
| `DEPLOY-RULES.md` §10 | Deploy-Log |
| optional `client/public/llms.txt`, `llms-full.txt` | „Stand: September 2026“ → Prüfmonat; nur nach Entscheidung F3 |

- Umfang: 3 Dateien, mit `llms*.txt` 5. Stufe B, weil es um Förderinhalt geht.
- Sichtbar ändert sich im Rechner nur „geprüft am …“. Beträge ändern sich nicht.

**Fall B: Werte haben sich geändert.**
- Eigenes Paket: Werte in `funding.ts`/`content.ts`, Goldwerte in `estimate:check` und `mcp-check`, betroffene
  Seiten (`foerder:check`). `rulesVersion` und `effectiveFrom` werden neu gesetzt.
- Läuft eine geänderte Regel schon live, greift gegebenenfalls die Notfall-Korrektur nach DEPLOY-RULES §4.
- Umfang und Stufe nach Befund. Bis dahin darf keine Frist verlängert werden.

## 5. Termine und Fenster

- Nächstes 48-h-Fenster: ab 19.11.2026 15:59 MEZ. Vor jeder Aussage `date` und Netlify prüfen.
- **Vorschlag Prüfzeitraum: 01.–05.12.2026.** Bis dahin sollte der Haushalt 2027 beschlossen sein, und es bleibt
  Puffer für Gegenlesung, Preview und 48-h-Gate vor Weihnachten.
- Ein Merge im Dezember ist wegen `__BUILD_DATE__` immer ein Produktionsdeploy.
- **Spätestens bis 29.12.2026 live.** Sonst gilt am 01.01.2027 der Zustand aus Abschnitt 1.
- Später zusätzlich: Die Wochen-CI meldet die Fälligkeit 45 Tage vor `validThrough` (`REVIEW_WARN_DAYS`).

## 6. Bereits vorbereitet (Branch `claude/foerder-wiedervorlage-2026-12`, kein PR)

- `scripts/velux-estimate-check.ts`:
  - **Bisher:** Der Ablauftest hatte `2026-12-31`/`2027-01-01` fest eingetragen. Jede Verlängerung von
    `validThrough` hätte die CI rot gemacht.
  - **Jetzt:** Der Test nimmt den letzten gültigen Tag und den ersten abgelaufenen Tag aus `RULES`.
  - Lokal geprüft am 17.11.2026: `estimate:check` grün mit dem aktuellen Stand und ebenso mit probehalber
    `validThrough 2027-03-31`; die Probe wurde zurückgenommen. `tsc` grün.
- Keine Änderung an `funding.ts`. Prüffristen werden erst nach der Quellenprüfung verschoben.

## 7. Entscheidungen für Tim

| Nr. | Frage | Vorschlag |
|---|---|---|
| F1 | Wer macht die Primärquellenprüfung? | Codex nach Prüfliste Abschnitt 3, mit Fundstelle und Abrufdatum je Punkt; Claude gleicht mit dem Code ab |
| F2 | Neue Prüffrist `validThrough` | **31.03.2027**: kurzer Zyklus, weil Haushalt 2027, mögliche WPB-Änderungen und das Ende der Energieberatungsrichtlinie in Q1 2027 fallen. Alternative 30.06.2027 (weniger Aufwand, mehr Risiko veralteter Beträge). |
| F3 | „Stand: September 2026“ in `llms*.txt` auf den Prüfmonat setzen? | ja, im selben Deploy (Text, keine neuen Zahlen) |
| F4 | Prüfzeitraum | 01.–05.12.2026, spätestens Umsetzung bis 29.12.2026 |
