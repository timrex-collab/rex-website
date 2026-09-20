# VELUX Preisrechner: PDF-Export an die Anfrage koppeln

Stand 11.09.2026. Vorgesehen als Paket **D7**, nach D6. Entscheidung von Tim am 09.09.2026.

Ziel: Die Kostenschätzung bleibt auf der Seite sichtbar, die PDF-Zusammenfassung gibt es
erst nach abgesendeter Anfrage. Hintergrund ist der Wettbewerbsschutz — heute kann ein
Besucher eine vollständige Kostenaufstellung im Rex-Layout erzeugen, ohne eine Spur zu
hinterlassen, und damit zum Mitbewerber gehen.

## 1. Ist-Zustand (geprüft auf `main` `a9db577`, Stand D3)

`client/src/components/VeluxPreisrechner.tsx`, Komponente `Step3`:

| Weg zum PDF | Bedingung heute |
|---|---|
| Button „Nur PDF erstellen" → `handlePdf` | keine. Ohne jede Eingabe nutzbar |
| Button „Anfrage senden & PDF erstellen" → `handleSubmitAndPdf` | `kundeValid`, aber `handlePdf()` läuft **vor** dem POST |
| Browser-Direktdruck (Strg+P) auf der Ergebnisseite | keine. Kein Print-CSS auf der Seite |

Der zweite Punkt ist das eigentlich unterschätzte Loch: Wer die Kontaktdaten einträgt und
den Versand scheitern lässt — Flugmodus genügt — bekommt das PDF trotzdem.

Das PDF entsteht clientseitig: `buildPdfHtml()` erzeugt HTML, `window.open` +
`document.write`, der Nutzer wählt im Druckdialog „Als PDF speichern".

## 2. Soll-Zustand

1. Ergebnis, Positionen, Summen und Förderkarten bleiben unverändert sichtbar.
2. Die PDF-Ausgabe ist gesperrt, bis die Anfrage **bestätigt** versendet wurde.
3. Die Freischaltung gilt für die abgesendete Konfiguration, nicht dauerhaft.
4. Kein Nachteil für den Kunden: nach Freischaltung beliebig oft zu öffnen.
5. Fällt der Versand aus, bekommt der Kunde einen brauchbaren Ersatzweg
   (mailto-Fallback und Telefonnummer), aber kein PDF.

## 3. Lösung

### 3.1 Freischaltung an den bestätigten Versand binden

Nicht an ausgefüllte Felder, sondern an `res.ok` des POST:

```js
const [unlockedFor, setUnlockedFor] = useState(null);
const configSignature = useMemo(
  () => JSON.stringify({ positions, foerderung }),
  [positions, foerderung]
);
const exportUnlocked = unlockedFor !== null && unlockedFor === configSignature;
```

Ändert der Kunde nach dem Absenden die Konfiguration, schließt sich das Gate wieder. Sonst
wäre „einmal absenden, dann beliebig viele Varianten ziehen" der Umgehungsweg. Nebeneffekt:
jede ernsthafte Variante erzeugt einen eigenen Lead.

Umsetzungsdetail: Ob `Step3` beim Zurückspringen in den Wizard neu gemountet wird, ist beim
Bau zu prüfen — dann fällt der Zustand ohnehin weg, die Signatur bleibt trotzdem die
verlässlichere Absicherung.

### 3.2 Popup-Reihenfolge umdrehen, ohne den Popup-Blocker zu treffen

Ein `window.open` nach einem `await` wird von Browsern blockiert. Deshalb wird das Fenster
weiterhin im Klick geöffnet, aber zunächst nur mit einem neutralen Wartescreen; der Inhalt
kommt erst nach Bestätigung.

```js
const handleSubmitAndPdf = async () => {
  if (submitting || !kundeValid) return;
  const w = openWaitWindow();              // im Nutzerklick, sonst Blocker
  setSubmitting(true); setSubmitError(false);
  try {
    const res = await fetch("/", { method: "POST", headers: {...}, body: formData.toString() });
    if (!res.ok) throw new Error("submit failed");
    setSubmitSuccess(true);
    setUnlockedFor(configSignature);
    if (w) writePdf(w); else setPopupBlocked(true);   // Rückfallebene: Button „PDF öffnen"
  } catch {
    setSubmitError(true);
    if (w) w.close();                       // kein PDF bei fehlgeschlagenem Versand
    window.location.href = buildMailtoFallback();
  } finally { setSubmitting(false); }
};
```

`openWaitWindow` schreibt eine schlichte Seite im Rex-Layout: „Ihre Anfrage wird gesendet —
einen Moment bitte." Nach Erfolg wird derselbe Fensterhandle mit
`document.open()` / `write()` / `close()` durch das fertige PDF-HTML ersetzt.

### 3.3 „Nur PDF erstellen" ersetzen

Der Button entfällt. An seiner Stelle steht der gesperrte Zustand mit Begründung:

> **PDF-Zusammenfassung**
> Verfügbar, sobald Sie Ihre Anfrage abgeschickt haben. Sie erhalten dann die vollständige
> Kostenschätzung mit Förderübersicht zum Speichern und Ausdrucken.

Nach Freischaltung wird daraus ein aktiver Button „PDF erneut öffnen". Wichtig für die
Conversion: Der Versand wird als Gewinn dargestellt, nicht als Hürde — der Kunde sieht
vorher, was er bekommt.

### 3.4 Direktdruck der Seite entwerten

Ohne Print-CSS liefert Strg+P auf der Ergebnisseite dieselben Zahlen. Ergänzung auf
`VeluxPreisrechnerBochum`:

```css
@media print {
  .rechner-ergebnis { display: none !important; }
  .rechner-print-hinweis { display: block !important; }
}
```

Der Hinweis nennt den regulären Weg und die Telefonnummer. Das hält niemanden auf, der es
darauf anlegt, schließt aber den bequemen Ersatzweg.

### 3.5 Datenschutzhinweis

Da der Versand jetzt Voraussetzung für den Export ist, gehört unter die CTAs ein kurzer
Hinweis mit Link auf `/datenschutz`: wofür die Daten verwendet werden, dass sie der
Angebotserstellung dienen und dass keine Weitergabe erfolgt. Keine Vorab-Checkbox nötig,
aber der Hinweis muss stehen.

## 4. Was diese Lösung nicht leistet

Das PDF wird im Browser erzeugt; `buildPdfHtml` und die Preislogik liegen im ausgelieferten
JavaScript. Wer die Entwicklerwerkzeuge bedienen kann, ruft die Funktion direkt auf. Ebenso
bleiben Screenshot und Abschreiben möglich — die Zahlen sollen ja sichtbar bleiben.

Realistisches Ziel ist deshalb nicht Geheimhaltung, sondern: **der bequeme Ein-Klick-Export
ist an einen Lead gebunden.** Für die weit überwiegende Mehrheit der Besucher wirkt das
vollständig. Diese Grenze ist bewusst so dokumentiert und darf im PR nicht als dichter
Schutz beschrieben werden.

**Ausbaustufe für dichten Schutz** (eigenes Paket, deutlich größer): PDF-Erzeugung in eine
Netlify Function verlagern. Ablauf: Lead speichern → signiertes, kurzlebiges Token
zurückgeben → Function rendert das PDF serverseitig gegen dieses Token. Dann liegt weder
Layout noch Rechenweg des Exports im Client. Voraussetzungen: Preislogik serverseitig
verfügbar, Rate-Limit, Kostenrahmen, Aufbewahrungsregeln für Leads. Nicht Teil von D7.

## 5. Voraussetzung geprüft

Die Formularzustellung funktioniert (Stand 09.09.2026): Netlify-Formular
`velux-preisrechner`, 11 Submissions, letzte 08.09.2026 02:31 UTC, Honeypot aktiv. Tim hat
bestätigt, dass er alle Formulare per Mail erhalten hat. Damit darf der PDF-Export an den
Versand gekoppelt werden, ohne dass ein ungeprüfter Pfad zum Nadelöhr wird.

Offen bleibt die Ausfallvorsorge: Fällt Netlify Forms aus, greift der mailto-Fallback aus
Abschnitt 3.2. Dieser Weg ist im D7-Test mit abzudecken.

## 6. Einordnung in die D-Reihe

Die Änderung darf nach `VELUX-HANDOFF.md` §2 nicht in ein bestehendes Paket gemischt werden.
Sie braucht einen eigenen Zuschnitt.

Entscheidend für die Position: **D6 verankert das anonyme PDF als CI-Test** („Die CI prüft
mobile Bedienung, anonymes PDF/HTML-Escaping …"). Käme das Gate vor D6, führt D6 einen Test
ein, der auf `main` sofort rot ist — und der geprüfte Codex-Commit müsste angefasst werden.
Zusätzlich fasst D5 dieselbe Datei an (`VeluxPreisrechner.tsx`, 22 Zeilen).

Zuschnitt:

| | |
|---|---|
| Dateien | `client/src/components/VeluxPreisrechner.tsx`, `client/src/pages/VeluxPreisrechnerBochum.tsx`, ein neues Modul für Wartescreen und Gate-Zustand, der D6-Browsertest, diese Doku |
| Stufe | B (max. 8 Dateien) |
| Prüfungen | bestehende Projektchecks; der D6-Browsertest „anonymes PDF" wird umgedreht auf „PDF nur nach bestätigtem Versand"; neue Fälle: Versand schlägt fehl → kein PDF; Konfiguration nach Versand geändert → Gate wieder zu; Popup blockiert → Rückfallebene greift; mailto-Fallback erreichbar |
| Nicht enthalten | serverseitige PDF-Erzeugung, Lead-Speicherung außerhalb Netlify Forms, WebMCP-Aktivierung |

### Umnummerierung

`VELUX-HANDOFF.md` §6 bezeichnet die spätere WebMCP-Aktivierung bereits als „D7". Da das
Export-Gate diesen Platz einnimmt, rückt die WebMCP-Aktivierung auf **D8**. Ohne diesen
Vermerk reden beide Dokumente unter demselben Namen über verschiedene Dinge.

| Paket | Inhalt |
|---|---|
| D4 | WebMCP-Adapter, deaktiviert |
| D5 | Vier WebMCP-Tools |
| D6 | CI-Browserprüfungen |
| **D7** | **PDF-Export an die Anfrage koppeln (dieses Dokument)** |
| D8 | WebMCP-Aktivierung (in `VELUX-HANDOFF.md` §6 noch „D7") |

---

## 7. Umsetzung (18.09.2026) — **live seit 20.09.2026**

Gebaut auf Branch `claude/exciting-hypatia-1tq39w`, Basis `main` `be34af8` (nach PR #78).
Stufe B, **8 Dateien — die Obergrenze ist damit ausgeschöpft**.

> **Status: umgesetzt und live.** PR #79, gemergt am 20.09.2026 um 21:17:08 MESZ, Netlify
> `6ab03136…`, `commit_ref 682a888`, `published_at 21:17:45 MESZ`, `state ready`,
> Secret-Scan 720/0. Gate eingehalten mit 53 h 33 min. Checks-Lauf #33, IndexNow-Lauf #50
> und Prerender-Check-Lauf #12 grün. Details im Deploy-Log von `DEPLOY-RULES.md` §10.


| Datei | Änderung |
|---|---|
| `client/src/lib/velux/export-gate.ts` | **neu** — normalisierte Signatur, Wartescreen, Fenster-Handling, Gate-Texte. Keine Preis- oder Förderlogik |
| `client/src/components/VeluxPreisrechner.tsx` | Gate-Zustand, umgedrehte Popup-Reihenfolge, „Nur PDF erstellen" ersetzt, Datenschutzhinweis, sichtbarer mailto-Ersatzweg |
| `client/src/pages/VeluxPreisrechnerBochum.tsx` | Print-CSS: Ergebnis aus, Hinweis an |
| `scripts/velux-ui-smoke.mjs` | D6-Test strukturell umgebaut, sieben Gate-Fälle |
| `scripts/velux-estimate-check.ts` | Signatur- und Freischaltungsregel als Direkttest |
| `.github/workflows/checks.yml` | Schrittname an die neue Prüfung angepasst |
| `DEPLOY-RULES.md`, `VELUX-EXPORT-GATE.md` | Deploy-Log und dieses Protokoll |

### Die Signatur ist normalisiert, nicht roh serialisiert

Der Entwurf in §3.1 schlug `JSON.stringify({ positions, foerderung })` vor. Umgesetzt ist
eine normalisierte Fassung: Sie greift ausschließlich die preisbestimmenden Felder ab
(`model`, `size`, `glazing`, `qty`, `shutter`, `shutterQty`, `blind`, `blindQty`) und
sortiert die Förderantworten nach Schlüssel. Die interne Laufnummer `id` und künftige
UI-Metadaten gehen damit nicht ein — sonst würde die Freischaltung an Feldern hängen, die
mit Preis und Förderung nichts zu tun haben. `estimate:check` prüft das direkt:
Determinismus, Unempfindlichkeit gegen `id` und Schlüsselreihenfolge, und dass Verglasung,
Menge, Zubehör, eine zweite Position sowie jede geänderte Förderantwort die Signatur
tatsächlich verändern.

### Reichweite der Freischaltung — bewusstes Verhalten

Die Freischaltung lebt im lokalen Zustand von `Step3`. Diese Komponente wird nur bei
`step === 3` gerendert; wer zurück in den Wizard geht, hängt sie aus und verliert die
Freischaltung. „Nach Freischaltung beliebig oft zu öffnen" (§2.4) gilt also **innerhalb der
Ergebnisansicht**, nicht über einen Wizard-Rücksprung hinweg. Das ist gewollt: Wer
zurückgeht, ändert in aller Regel die Konfiguration, und dann müsste die Signatur das Gate
ohnehin schließen. Die Signatur bleibt die fachliche Regel, der Remount nur ihr Nebeneffekt
— eine spätere Zustandshaltung oberhalb von `Step3` würde nichts am Verhalten ändern.

### Weitere Abweichungen vom Entwurf

1. **`handlePdf` ist ganz entfallen**, nicht nur der Button. Es gibt keinen Codepfad mehr,
   der ohne Freischaltung ein PDF schreibt — `writePdfInto(window)` wird ausschließlich
   nach `res.ok` oder über „PDF erneut öffnen" aufgerufen.
2. **mailto-Fallback zusätzlich sichtbar.** Der Entwurf sah nur `window.location.href` vor.
   Da der Sprung am Browser scheitern kann und der Export jetzt am Versand hängt, steht
   derselbe Link auch in der Fehlermeldung. Dabei ersetzt der bereits vorhandene, aber
   nirgends benutzte `buildMailto()` den zweiten Mailtext im `catch`-Zweig — bisher wurden
   zwei Fassungen desselben Textes parallel gepflegt.
3. **Popup-Blocker im Test simuliert**, nicht erzwungen: ein eigener Browserkontext legt
   `window.open` stumm. Chromiums Blocker-Heuristik ist unter Playwright nicht verlässlich
   auslösbar; das Startargument `--block-new-web-contents` griff im Versuch nicht.

### Umbau des Browsertests

Der D6-Test wurde nicht an zwei Klickstellen umgedreht, sondern strukturell umgebaut. Der
Route-Handler beantwortet den Versand jetzt lokal — `200` oder `500`, steuerbar pro Fall —
statt jeden Nicht-GET abzubrechen; kein Byte verlässt den Testlauf, fremde Origins bleiben
gesperrt. Die Schlussprüfung `posts === 0` ist durch `posts === 2` ersetzt: genau die zwei
Versandversuche, keine weitere Übertragung. Die alten PDF-Prüfungen bleiben erhalten, nur
hinter dem bestätigten Versand — HTML-Escaping der Kundeneingabe, UI/PDF-Parität und das
A4-Rendering der Druckansicht.

| # | Fall | Erwartung |
|---|---|---|
| 1 | vor dem Versand | kein Export-Button, gesperrter Zustand sichtbar, Datenschutzlink vorhanden |
| 2 | Direktdruck der Seite | Ergebnis verborgen, Hinweis sichtbar, keine Beträge im Hinweis |
| 3 | Versand schlägt fehl | Wartefenster geschlossen, Gate zu, mailto-Ersatzweg sichtbar und mit Kalkulation |
| 4 | Versand bestätigt | Wartefenster wird zum vollständigen PDF, `opener` null, kein injiziertes HTML, A4-PDF erzeugt |
| 5 | erneut öffnen | identisches Dokument, kein weiterer POST |
| 6 | Konfiguration geändert | Freischaltung gilt nicht mehr |
| 7 | Popup blockiert | Freischaltung greift trotzdem, Hinweis auf „PDF erneut öffnen" |

### Prüfungen (lokal, vor der Übergabe)

| Prüfung | Ergebnis |
|---|---|
| `npm run check` | grün |
| `npm run build` | grün |
| `npm run faq:check` (+ `--self-test`) | 23 Seiten, 0 beanstandet |
| `npm run estimate:check` | alle Prüfungen bestanden — Goldwert 2.104 € brutto unverändert, Signaturregel grün |
| `velux-ui-smoke.mjs` | sieben Gate-Fälle grün |
| `webmcp-smoke.mjs` (aus, Vertrag im Shim, fremde Origin) | grün |

Die Preislogik wurde nicht angefasst; die sichtbaren Beträge ändern sich nicht. WebMCP
bleibt ausgeschaltet — kein Tool exportiert ein PDF, das Gate ist dort also nicht umgehbar.

### Offen — durch den Deploy nicht erledigt

1. **Rechtliche Einordnung des Datenschutzhinweises.** §3.5 hält fest, eine Vorab-Checkbox
   sei nicht nötig. Das ist eine rechtliche Bewertung, keine technische. Der Hinweis mit
   Link auf `/datenschutz` steht und ist gegenüber dem bisherigen Zustand in jedem Fall die
   bessere Ausgangslage; ob es dabei bleibt, gehört bestätigt. Der Punkt stand vor dem
   Merge offen und steht es weiterhin — der Deploy hat ihn nicht beantwortet.
2. **Redaktionelle Restschuld in `VELUX-HANDOFF.md` §6.** Der historische Text vom
   06.09.2026 nennt den Aktivierungsdeploy weiterhin „D7"; der Nachtrag vom 18.09.2026
   davor stellt klar, dass damit D8 gemeint ist. Bewusst nicht angefasst — die Datei gehört
   nicht zu diesem Paket, und die Dateigrenze der Stufe B ist ausgeschöpft.

### Nicht erledigt

Serverseitige PDF-Erzeugung (Abschnitt 4, „Ausbaustufe für dichten Schutz") bleibt
außerhalb von D7. Die Grenze der Lösung steht im Kopfkommentar von `export-gate.ts` und
darf im PR nicht als dichter Schutz beschrieben werden.
