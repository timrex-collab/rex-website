/**
 * Reservierter Ort für belegte WebMCP-Typergänzungen.
 * Stand 06.09.2026: document.modelContext aus webmcp-types 0.1.5 reicht für
 * die Registrierung. Kein Navigator-Fallback auf ältere Lifecycle-Verträge.
 * executeTool wird nur im Browser-Test verwendet: Chrome 152 erwartet dort
 * RegisteredTool + JSON-Text; der aktuelle Draft beschreibt ein Objekt.
 */
export {};
