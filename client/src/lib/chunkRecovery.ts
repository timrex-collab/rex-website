/**
 * Einmaliger Neustart, wenn ein Seiten-Chunk nicht geladen werden konnte.
 *
 * Ausgangslage (gemessen, Protokoll in `PRERENDER-CHECK.md` §9): Bricht der Transport
 * eines einzigen Chunks ab, wirft Vites `__vitePreload` `Failed to fetch dynamically
 * imported module` und die Route rendert nicht. Zwei GSC-Livetests am 31.08.2026
 * verloren 6 bzw. 2 von 21 Requests — beide Male blieb die Seite leer. Besucher mit
 * instabiler Verbindung trifft dasselbe.
 *
 * Warum kein einfaches „nochmal versuchen" im Code: Der Browser merkt sich einen
 * fehlgeschlagenen Modulabruf in seiner Module-Map. Ein erneutes `import()` derselben
 * URL scheitert sofort **ohne neuen Netzwerkversuch** — lokal mit Chromium
 * gegengeprüft: Beim Wiederholungsversuch ging kein einziger weiterer Request raus.
 * Nur ein vollständiger Seitenneustart verwirft diese Map.
 *
 * Deshalb Vites dafür vorgesehenes Ereignis `vite:preloadError` und ein Reload.
 * Gegen Endlosschleifen sichert ein Zeitstempel in `sessionStorage`: Innerhalb des
 * Sperrfensters wird **nicht** erneut geladen — dann übernimmt die
 * `ChunkErrorBoundary` und zeigt eine bedienbare Fehlerseite. Später in derselben
 * Sitzung bekommt ein neuer Ausfall wieder einen Versuch.
 */

const RELOAD_MARKER = "rex:chunk-reload";

/** Innerhalb dieser Spanne wird nicht erneut neu geladen. */
const RELOAD_COOLDOWN_MS = 60_000;

export function installChunkRecovery() {
  if (typeof window === "undefined") return;

  window.addEventListener("vite:preloadError", (event) => {
    let lastReload = Number.NaN;
    try {
      lastReload = Number(sessionStorage.getItem(RELOAD_MARKER));
    } catch {
      // sessionStorage gesperrt (Privatmodus, Bot ohne Storage): ohne Schleifenschutz
      // lieber gar nicht neu laden. Die Boundary fängt den Fall sichtbar ab.
      return;
    }

    const inCooldown = Number.isFinite(lastReload) && Date.now() - lastReload < RELOAD_COOLDOWN_MS;
    if (inCooldown) return; // Zweiter Fehlschlag in Folge — die Boundary übernimmt.

    try {
      sessionStorage.setItem(RELOAD_MARKER, String(Date.now()));
    } catch {
      return;
    }

    event.preventDefault(); // Vite soll den Fehler nicht zusätzlich werfen.
    window.location.reload();
  });
}
