/**
 * Ergänzung zu `webmcp-types` (tsconfig "types"): Das Paket deklariert nur
 * `document.modelContext` (Spec seit 27.05.2026). Chromium 149 (Origin Trial)
 * stellt die API noch unter `navigator.modelContext` bereit (ab 150
 * deprecated). Der Adapter nutzt `document` zuerst und fällt auf `navigator`
 * zurück.
 */
interface Navigator {
  readonly modelContext?: WebMCP.ModelContext;
}
