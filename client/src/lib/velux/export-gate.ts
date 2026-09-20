/**
 * D7 – Export-Gate des VELUX-Preisrechners.
 *
 * Die Kostenschätzung bleibt auf der Seite sichtbar; die PDF-Ausgabe gibt es erst
 * nach einer bestätigt versendeten Anfrage (VELUX-EXPORT-GATE.md §2/§3).
 *
 * Hier liegen ausschließlich Gate-Zustand, Fenster-Handling und die zugehörigen
 * Texte. Preis- und Förderlogik bleiben in estimate.ts / funding.ts — dieses Modul
 * rechnet nichts und kennt keine Beträge.
 *
 * Grenze, bewusst so dokumentiert (VELUX-EXPORT-GATE.md §4): Das PDF entsteht weiterhin
 * im Browser. Wer die Entwicklerwerkzeuge bedient, ruft buildPdfHtml direkt auf und
 * umgeht das Gate. Ziel ist nicht Geheimhaltung, sondern dass der bequeme
 * Ein-Klick-Export an einen Lead gebunden ist — kein dichter Schutz.
 */

export const EXPORT_GATE_TEXT = {
  lockedTitle: "PDF-Zusammenfassung",
  lockedBody:
    "Verfügbar, sobald Sie Ihre Anfrage abgeschickt haben. Sie erhalten dann die vollständige " +
    "Kostenschätzung mit Förderübersicht zum Speichern und Ausdrucken.",
  unlockedButton: "PDF erneut öffnen",
  popupBlocked:
    "Ihre Anfrage ist eingegangen. Das Druckfenster wurde vom Browser blockiert — " +
    "öffnen Sie es über „PDF erneut öffnen“.",
  privacy:
    "Ihre Angaben verwenden wir ausschließlich zur Bearbeitung dieser Anfrage und zur " +
    "Angebotserstellung. Keine Weitergabe an Dritte.",
  printHint:
    "Die Kostenschätzung erhalten Sie als PDF, sobald Sie Ihre Anfrage im Preisrechner " +
    "abgeschickt haben. Fragen beantworten wir auch telefonisch unter 0234 / 58 31 00.",
  waitHeadline: "Ihre Anfrage wird gesendet",
  waitBody: "Einen Moment bitte — das PDF öffnet sich anschließend in diesem Fenster.",
} as const;

/** Felder, die den Preis bestimmen — und nur diese gehen in die Signatur ein. */
const PRICE_RELEVANT_FIELDS = [
  "model", "size", "glazing", "qty", "shutter", "shutterQty", "blind", "blindQty",
] as const;

/**
 * Signatur der Konfiguration, für die freigeschaltet wurde.
 *
 * Ändert der Kunde nach dem Absenden etwas, passt die Signatur nicht mehr und das Gate
 * schließt sich wieder. Sonst wäre „einmal absenden, dann beliebig viele Varianten ziehen“
 * der Umgehungsweg.
 *
 * Bewusst normalisiert statt `JSON.stringify(positions)`: interne Laufnummern (`id`) und
 * künftige UI-Metadaten gehören nicht dazu — sie ändern weder Preis noch Förderung. Ebenso
 * wenig die Kontaktdaten. Förderantworten gehen nach Schlüssel sortiert ein, damit die
 * Signatur nicht von der Reihenfolge im Objekt abhängt.
 */
export function configSignature(positions: unknown, funding: unknown): string {
  const list = Array.isArray(positions) ? positions : [];
  const normalizedPositions = list.map((position) => {
    const p = (position ?? {}) as Record<string, unknown>;
    return PRICE_RELEVANT_FIELDS.map((field) => p[field] ?? null);
  });
  const answers = funding && typeof funding === "object" ? (funding as Record<string, unknown>) : {};
  const normalizedFunding = Object.keys(answers).sort().map((key) => [key, answers[key]]);
  return JSON.stringify({ positions: normalizedPositions, funding: normalizedFunding });
}

/**
 * Die Freischaltung lebt im lokalen Zustand von `Step3`. Verlässt der Kunde Schritt 3,
 * wird die Komponente ausgehängt und die Freischaltung geht verloren — „beliebig oft
 * öffnen“ gilt also innerhalb der Ergebnisansicht. Das ist gewollt: Wer zurückgeht,
 * ändert in aller Regel die Konfiguration, und dann müsste die Signatur das Gate ohnehin
 * schließen. Die Signatur bleibt die fachliche Regel, der Remount nur ihr Nebeneffekt.
 */
export function isExportUnlocked(unlockedFor: string | null, signature: string): boolean {
  return unlockedFor !== null && unlockedFor === signature;
}

function waitScreenHtml(): string {
  return `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>VELUX Kostenschätzung — Rex Bedachungs GmbH</title>
<style>
  body{margin:0;font-family:-apple-system,"Segoe UI",Helvetica,Arial,sans-serif;background:#f8fafc;color:#0f172a}
  .box{max-width:420px;margin:18vh auto 0;padding:28px;border-radius:16px;background:#fff;
       border:1px solid #e2e8f0;text-align:center}
  h1{font-size:17px;margin:0 0 8px}
  p{font-size:13px;line-height:1.6;color:#475569;margin:0}
  .firma{margin-top:18px;font-size:11px;color:#94a3b8}
</style></head><body><div class="box">
<h1>${EXPORT_GATE_TEXT.waitHeadline}</h1>
<p>${EXPORT_GATE_TEXT.waitBody}</p>
<p class="firma">Rex Bedachungs GmbH · Bochum</p>
</div></body></html>`;
}

/**
 * Öffnet das Zielfenster noch innerhalb des Nutzerklicks — ein `window.open` nach einem
 * `await` wird von Browsern blockiert. Inhalt kommt erst nach bestätigtem Versand.
 */
export function openWaitWindow(): Window | null {
  let w: Window | null = null;
  try {
    w = window.open("", "_blank");
  } catch {
    return null;
  }
  if (!w) return null;
  try {
    w.opener = null;
    w.document.open();
    w.document.write(waitScreenHtml());
    w.document.close();
  } catch {
    return null;
  }
  return w;
}

/** Ersetzt den Wartescreen durch das fertige Dokument. */
export function writeDocument(w: Window | null, html: string): boolean {
  if (!w) return false;
  try {
    w.opener = null;
    w.document.open();
    w.document.write(html);
    w.document.close();
  } catch {
    return false;
  }
  return true;
}

/** Schließt das Fenster, wenn der Versand scheitert — kein PDF ohne Lead. */
export function closeWindow(w: Window | null): void {
  try {
    w?.close();
  } catch {
    /* Fenster bereits geschlossen */
  }
}
