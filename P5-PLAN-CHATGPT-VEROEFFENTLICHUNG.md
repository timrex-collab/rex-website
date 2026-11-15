# P5-Plan: Veröffentlichung des Rex-Plugins für ChatGPT (zur Freigabe)

Stand 15.11.2026, Entwurf 1 von Claude, **noch nicht freigegeben**. Grundlage: `UMSETZUNGSPLAN-2026-10-KI-ANFRAGEN.md`
(P4, P5), `MCP.md`, `DEPLOY-RULES.md` §4 und §10, V8-Ergebnis von Codex (Abruf 15.11.2026) und eine Prüfung des
Codes auf `main` (`c5dbcfa`).

Was dieser Plan ist und was nicht: Er beschreibt, welchen Weg wir nehmen, welche Unterlagen fehlen und wie die
Deploys aufgeteilt werden. Er enthält keinen Code. Umgesetzt wird erst nach Tims ausdrücklicher Freigabe, jeder Deploy
als eigener PR. Eingereicht wird nur durch Tim.

---

## 1. Bewertung des V8-Ergebnisses

**Quellenlage.** Alle OpenAI-Aussagen stammen von Codex (developers.openai.com, help.openai.com,
learn.chatgpt.com, Abruf 15.11.2026). Aus dieser Umgebung sind diese Seiten gesperrt. **Ich habe keine davon selbst
gelesen.** Was unten als OpenAI-Regel steht, ist Codex' Wiedergabe. Mit eigener Prüfung belege ich nur Aussagen über
das Rex-Repo.

**Was ich im Repo bestätigen kann:**

| Codex-Aussage | Befund im Code | Folge |
|---|---|---|
| `prepare` setzt nur `readOnlyHint` | stimmt (`netlify/functions/mcp.mts:314`) | ergänzen |
| `submit` hat `destructiveHint: false` | stimmt (`mcp.mts:335`) | auf `true`, weil der Versand nicht zurückgeholt werden kann |
| „Alle fünf Tools prüfen“ | Die drei lesenden Tools haben **nur** `readOnlyHint: true`, `resolve` zusätzlich `untrustedContentHint` (`client/src/lib/velux/tools.ts:167/183/214`). `destructiveHint` und `openWorldHint` fehlen überall. | alle fünf ergänzen |
| — (fehlt bei Codex) | `tools.ts` wird **auch von WebMCP im Browser** genutzt (`VeluxPreisrechner.tsx:16`) | Annotationen nur in `mcp.mts` überschreiben, `tools.ts` nicht anfassen. Sonst ändert sich das Browser-Bundle und WebMCP gleich mit. |
| — (fehlt bei Codex) | `prepare` räumt bei jedem Aufruf abgelaufene Blobs-Einträge auf (`MCP.md`, „Speicher“) | `readOnlyHint: true` ist vertretbar, weil keine Nutzerdaten geschrieben werden. In der Begründung steht das offen drin. |
| Datenschutz muss Datenarten, Zwecke, Empfänger, Speicherdauer und Rechte nennen | Der Abschnitt „Anfragen über ChatGPT (Rex-Plugin)“ (`Datenschutz.tsx:180 ff.`) deckt Datenarten, Zweck, Netlify, Vermerke und Rechtsgrundlage ab. Er hat **keinen Sprunganker**. Er sagt **nicht**, dass die Tool-Antworten (Zusammenfassung **mit Kontaktdaten**) an OpenAI zurückgehen. | kleine Ergänzung, Codex liest gegen |
| Nutzungsbedingungen-URL Pflicht | Rex hat **keine** Nutzungsbedingungen-Seite und keine AGB-Seite | eigene Seite = neue Route (Stufe C) |
| Support-URL | `/kontakt` ist vorhanden | reicht vermutlich, Tim bestätigt |

**Plausibel, aber nicht belegt und nicht widerspruchsfrei.** Ich übernehme das nur als Arbeitsannahme:

- **„Genau fünf positive und drei negative Testfälle“, Demo-Video und Release Notes:** so konkret, dass es aus einer
  Formularprüfung stammen dürfte. Die tatsächlichen Pflichtfelder zeigt erst das Portal. Tim macht beim ersten Öffnen
  Screenshots davon.
- **Tarife:** Laut Codex beschränkt das Help Center eigene Connectoren bei Pro auf read/fetch. **Dem widerspricht
  unsere eigene Abnahme:** Am 13.11.2026 hat der Versand aus Tims Konto in Web, Classic und iPhone funktioniert
  (`MCP.md`, Abnahmen). Dann ist Tims Konto entweder kein Pro-Konto, oder die Help-Center-Seite ist veraltet. **Tims
  Tarif ist die wichtigste offene Frage für jede Kundenanleitung.**
- **Begriff „Plugin Directory“:** Nach meinem Wissensstand (bis Mitte 2026) hieß das „Apps in ChatGPT“ mit Apps SDK.
  Eine Umbenennung ist möglich. Maßgeblich ist, was Tim im Portal sieht.
- **Begründungen für Annotationen:** Codex meldet widersprüchliche Seiten. Wir bereiten kurze Begründungen vor, das
  schadet nicht.

**Was Codex nicht geprüft hat und vor der Einreichung offen ist:**

1. **Marke „VELUX“ im Plugin-Namen:** Verzeichnisregeln verbieten üblicherweise fremde Marken im Namen ohne
   Berechtigung. Rex' eigene Regel lässt nur „autorisierter VELUX-Partner“ zu. Vorschlag: Name ohne VELUX (z. B.
   „Rex Dachfenster-Rechner“), VELUX nur in der Beschreibung als „autorisierter VELUX-Partner“. Ob VELUX die
   Verwendung im Verzeichnis erlaubt, klärt Tim gegebenenfalls über den Partnerkanal.
2. **Prüfer senden echte Anfragen.** Ohne Anmeldung landet jede Review-Anfrage in Produktion, also in Netlify Forms
   und in Tims Postfach. Lösung ohne neuen Code: In den Review-Hinweisen steht „Name: OpenAI Review“. Das
   Tageskontingent (50) bleibt als Schutz.
3. **Erster Aufruf mit 400** (`MCP.md`, Offen): kann den automatischen Tool-Scan stören. Ursache vor der Einreichung
   klären.
4. **`/.well-known/oauth-*` liefert 200 mit HTML** statt 404: Ein Scanner kann daraus „OAuth vorhanden, aber kaputt“
   schließen. Vor der Einreichung beheben (Regel in `netlify.toml`). Den Pfad der Domain-Challenge darf diese Regel
   nicht treffen.
5. **Domain-Challenge:** Pfad und Token kennt erst das Portal. Liegt die Datei unter `/.well-known/`, schützt sie die
   Regel aus Punkt 4 ausdrücklich vor dem 404.

---

## 2. Empfohlener Weg

**Ziel ist der öffentliche Verzeichniseintrag.** Eine Kundenanleitung für eigene Connectoren wird vorher **nicht** auf
die Website gestellt. Außerhalb des Verzeichnisses machen wir den Endpunkt nur maschinenlesbar bekannt (`llms*.txt`).

Warum ich hier von Codex' Empfehlung abweiche (Codex: Anleitung zuerst):

- Ein Kunde müsste im Web unter „Add custom MCP server“ einen Risikohinweis bestätigen. Auf dem Handy geht das
  Einrichten nicht. Welche Tarife den Versand erlauben, ist ungeklärt. Für Rex-Kunden ist das kaum zumutbar und
  bringt erwartbar wenige Anfragen.
- Ein öffentlicher Anleitungstext mit Tarif-Hinweisen müsste laufend gepflegt werden.
- Der Rechner auf der Website bleibt der Weg für alle. ChatGPT verweist über `calculatorUrl` sowieso dorthin.

Kommt die Einreichung nicht durch oder zieht sie sich, bleibt die Anleitung als Rückfallweg (Abschnitt 5, Deploy
P5-4b).

---

## 3. Unterlagen für die Einreichung (Claude bereitet vor, Tim reicht ein)

Alles kommt in einen Ordner `p5-einreichung/` auf dem Arbeitsbranch. Er wird **nicht** nach `main` gemergt, nur
übergeben.

| Unterlage | Inhalt | Wer |
|---|---|---|
| Verzeichnistext | Name, Untertitel, Beschreibung (DE, kurz EN falls verlangt), **ohne Preise, Rabatte und Werbeversprechen**; VELUX nur als „autorisierter VELUX-Partner“; klarer Nutzwert (Typenschild-Zuordnung, nachvollziehbare Schätzung mit BEG und §35c, Rechner-Link) | Claude, Tim prüft |
| Tool-Begründungen | je Tool `readOnlyHint` / `destructiveHint` / `openWorldHint` mit einem Satz | Claude |
| Review-Hinweise | keine Anmeldung; unverbindliche Anfrage, kein Kauf; Versand nur nach Zustimmung zur vollständigen Zusammenfassung, Hash-Bindung, Doppelversandschutz, Tageslimit, Rate-Limit; warum ohne OAuth (keine Kundenkonten, keine Daten abrufbar, nur Einweg-Versand an Rex); „Name: OpenAI Review“ | Claude |
| 5 positive Testfälle | P1 Optionen abfragen (Modelle, Größen) · P2 Typenschild „GGL S10“ → SK10 mit Rückfrage · P3 Kostenschätzung Goldwert 2.104 € / BEG 316 € / §35c 421 € mit Rechner-Link · P4 Anfrage vorbereiten, zustimmen, senden → `SENT` · P5 Zusammenfassung ändern, neu vorbereiten, senden | Claude, Werte aus `MCP.md` |
| 3 negative Testfälle | N1 Nutzer lehnt ab → kein `submit` · N2 Anfrage ohne E-Mail und Telefon → `CONTACT_INVALID`, nichts gesendet · N3 dieselbe Anfrage erneut senden → `ALREADY_SENT`, kein zweiter Eingang. Falls das Portal unter „negativ“ Fälle meint, in denen das Tool **nicht** ausgelöst werden soll: N1 Frage zu Flachdach oder einem anderen Hersteller → kein Tool-Aufruf | Claude; Einordnung prüft Tim im Portal |
| Demo-Video | Drehbuch (ca. 2 min, ChatGPT Web): P3 → P4 mit sichtbarer Zustimmung → Eingang in Netlify. Kontaktdaten nur „OpenAI Review“ | Claude Drehbuch, **Tim nimmt auf** |
| Screenshot-Liste | laut Codex keine Pflicht. Für Doku und Portal trotzdem: Schätzung, Zusammenfassung vor dem Senden, Bestätigung `SENT`, Typenschild-Rückfrage, Ablehnung | Tim |
| Logo | quadratisch, Format laut Portal; aus vorhandenem Rex-Logo | Tim liefert die Datei, Claude prüft Format |
| Release Notes | „1.0: Kostenschätzung VELUX-Dachfensteraustausch, Typenschild-Zuordnung, unverbindliche Anfrage an Rex“ | Claude |
| URLs | Website `https://www.rex-bedachung.de`, Support `/kontakt`, Datenschutz `/datenschutz#chatgpt-plugin`, Nutzungsbedingungen (neu, Abschnitt 4) | nach P5-2 |
| Länder / Sprache | Vorschlag: nur Deutschland, Deutsch | Tim entscheidet |

---

## 4. Website-Änderungen

1. **Tool-Annotationen** (`mcp.mts`): alle fünf Tools mit expliziten Werten, Overrides nur im Server.

   | Tool | readOnly | destructive | openWorld |
   |---|---|---|---|
   | get_options, resolve, calculate | true | false | false |
   | prepare | true | false | false |
   | submit | false | **true** | true |

   Dazu `mcp-check` erweitern, damit alle drei Werte für jedes Tool geprüft werden. Danach in ChatGPT
   „Tools aktualisieren“.
2. **`netlify.toml`:** `/.well-known/oauth-*` und `/.well-known/openid-configuration` liefern 404, auch unter `/mcp/…`.
   Die Challenge-Datei ist ausgenommen.
3. **400 beim ersten Aufruf:** Ursache klären (Netlify-Log, vermutlich ein `GET` oder `DELETE` ohne Session aus dem
   Streamable-HTTP-Handshake). Code ändert sich nur, wenn es tatsächlich ein Fehler ist.
4. **Datenschutz** (`Datenschutz.tsx`): Anker `id="chatgpt-plugin"`; ein Satz dazu, dass die Antworten des Plugins
   (Schätzung und Zusammenfassung mit Kontaktdaten) an ChatGPT zurückgehen und damit bei OpenAI verarbeitet werden;
   Verweis auf die Speicherdauer im Abschnitt „Speicherdauer von Anfragen“ und auf die Betroffenenrechte. **Codex
   liest gegen, das Ergebnis kommt in den PR.**
5. **Nutzungsbedingungen** (neue Seite, `lazy()` in `App.tsx`, `noindex`, nicht in der Sitemap, Link im Footer):
   kurz und sachlich – unverbindliche Schätzung, kein Vertragsschluss über das Plugin, keine Gewähr für Antworten von
   ChatGPT, Förderhinweise ohne Zusage, Verfügbarkeit, Kontakt. **Rechtlich prüft Tim oder sein Berater.** Ich
   formuliere nur einen Entwurf. Pfad z. B. `/nutzungsbedingungen` (Entscheidung Tim).
6. **`llms.txt` / `llms-full.txt`:** kurzer Abschnitt zum MCP-Endpunkt (URL, fünf Tools, Versand nur nach
   Zustimmung). Nach der Veröffentlichung kommt der Verzeichnis-Link dazu. `estimate:check` und `foerder:check`
   laufen mit, Beispiel-Links bleiben im aktuellen Format.
7. **Domain-Challenge-Datei** in `client/public/…` (Pfad und Token aus dem Portal).

Nicht Teil von P5 und unverändert ohne Auftrag: der Satz „ab ca. 1.800 € netto“ auf `/velux-preisrechner-bochum`
(Preisangabe, Entscheidung Tim). Er passt aber inhaltlich dazu: Ohne Connector rechnet ChatGPT mit genau diesem Wert
hoch (`MCP.md`).

---

## 5. Deploys nach Stufen

Jeder Deploy ist ein PR mit „Squash and merge“ durch Tim. Root-Doku (`MCP.md`, `DEPLOY-RULES.md`) zählt mit.
48 h gerechnet ab `published_at` des vorigen Produktionsdeploys. Alles im November, also kein Monatswechsel-Effekt
durch `__BUILD_DATE__`. Rutscht ein Deploy in den Dezember, ist schon der erste Merge ein Produktionsdeploy.
`formulare.html` bleibt unberührt.

| Deploy | Inhalt | Dateien | Stufe | frühestens |
|---|---|---|---|---|
| **P5-1** | Annotationen (`mcp.mts`), `scripts/mcp-check.ts`, `.well-known`-Regel (`netlify.toml`), ggf. Fix für 400, `MCP.md` | 4 | C (gesperrte Config) | 16.11.2026 00:05 MEZ |
| **P5-2** | Nutzungsbedingungen (neue Seite + `App.tsx` + Footer), Datenschutz-Ergänzung, `MCP.md` | 5 | C (neue Route) | 48 h nach P5-1; vorher Codex-Gegenlesung und Tims Rechtsprüfung |
| — | **Tim:** Identität verifizieren, Projekt anlegen, Portal öffnen, Challenge-Token holen | — | — | parallel zu P5-1/P5-2 |
| **P5-3** | Challenge-Datei, `llms.txt`, `llms-full.txt`, `MCP.md` | 4 | A/B | 48 h nach P5-2 |
| — | **Tim reicht ein** | — | — | nach P5-3 |
| **P5-4a** | nach Genehmigung: Verzeichnis-Link in `llms*.txt`, ggf. Hinweis auf der Rechnerseite, Deploy-Log | ≤ 4 | A/B | 48 h nach P5-3 und nach Veröffentlichung |
| P5-4b (Rückfall) | bei Ablehnung: Korrekturen laut Prüfbescheid, oder Kundenanleitung für eigene Connectoren | offen | offen | nach neuer Freigabe |

**Konkurrenz um Deploy-Fenster:** Die Förder-Wiedervorlage aus `estimate:check` ist am 16.11.2026 fällig, der
Förder-Deploy vor dem 31.12.2026. Ist das Ergebnis der Wiedervorlage eine falsche Zahl auf der Live-Site, geht es
vor P5 (Notfall-Korrektur prüfen). Sonst schiebe ich den Förder-Deploy zwischen P5-3 und P5-4a. Über die Reihenfolge
entscheidet Tim.

Nach jedem Merge prüfe ich: Netlify-Deploy (`state`, `commit_ref`, `published_at`), CI, Rate-Limit-Regel aktiv,
`get-forms-for-project` unverändert, `/mcp` `tools/list` live. Danach ergänze ich den Deploy-Log in
`DEPLOY-RULES.md` §10 und `MCP.md` und schreibe die Gate-Zeit für den nächsten Deploy dazu.

---

## 6. Entscheidungen für Tim

| Nr. | Frage | Vorschlag |
|---|---|---|
| E1 | Weg: Verzeichnis zuerst, Kundenanleitung nur als Rückfall? | ja |
| E2 | Veröffentlichen als „Rex Bedachungs GmbH“ (Unternehmensverifizierung) oder als Person? | GmbH |
| E3 | Plugin-Name ohne „VELUX“? | ja, z. B. „Rex Dachfenster-Rechner“ |
| E4 | Nutzungsbedingungen als eigene Seite `/nutzungsbedingungen`, `noindex`, mit Footer-Link? Wer prüft rechtlich? | ja; Prüfung Tim/Berater |
| E5 | Länder: nur Deutschland? | ja |
| E6 | Prüfer-Anfragen in Produktion mit „Name: OpenAI Review“ in Kauf nehmen? | ja |
| E7 | `destructiveHint: true` für `submit`, auch wenn ChatGPT dann vielleicht zusätzlich nachfragt? | ja (doppelte Nachfrage ist hier richtig) |
| E8 | Reihenfolge P5 und Förder-Deploy | nach dem Ergebnis der Wiedervorlage am 16.11. |

---

## 7. Offene Prüfungen

| Was | Wer | Warum |
|---|---|---|
| Welchen ChatGPT-Tarif hat Tims Konto? | Tim | erklärt den Widerspruch Pro/read-only gegenüber dem erfolgreichen Versand am 13.11. |
| OpenAI-Plattform: Organisation, Unternehmensverifizierung, Projekt **ohne EU Data Residency** | Tim | laut Codex Voraussetzung für die Einreichung |
| Portal: tatsächliche Pflichtfelder, Logo-Format, Testfall-Format, Gebühren, Challenge-Pfad (Screenshots an Claude) | Tim | V8 beruht nur auf Codex' Lesart |
| VELUX: Namensnennung im Verzeichnis zulässig? | Tim | Markenrecht, Partnerbedingungen |
| Ursache für 400 beim ersten Aufruf | Claude, in P5-1 | Tool-Scan |
| Datenschutz- und Nutzungsbedingungen-Text | Codex gegenlesen, Tim rechtlich | Pflicht-URLs |
| Nach P5-1: „Tools aktualisieren“ und P3/P4 einmal in ChatGPT Web wiederholen | Tim | geänderte Annotationen |

---

## 8. Nächster Schritt

Tim gibt den Plan frei, mit Antworten zu E1–E8 und, wenn schon bekannt, zum Tarif. Danach bereite ich P5-1 als PR vor
(Branch von aktuellem `main`, CI, Preview-Prüfung von `/mcp`). Merge frühestens am 16.11.2026 um 00:05 MEZ, vorher
prüfe ich `date`.
