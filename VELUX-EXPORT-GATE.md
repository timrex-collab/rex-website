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
