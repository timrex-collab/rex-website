/**
 * P4a – MCP-Endpunkt `/mcp` für den VELUX-Preisrechner, NUR AUF DEPLOY-PREVIEWS.
 *
 * Zweck (UMSETZUNGSPLAN-2026-10-KI-ANFRAGEN.md, P4a): Tim verbindet den Endpunkt in
 * ChatGPT als eigenen Connector und prüft, auf welchen Oberflächen (Web, Desktop,
 * Handy-App) die Tools ankommen und ob ein im Chat hochgeladenes Foto über einen
 * Dateiparameter beim Tool ankommt. Ergebnis: Go/No-Go je Oberfläche für P4b.
 *
 * - Nur lesende Tools aus `client/src/lib/velux` – dieselbe Fachlogik wie WebMCP und
 *   Rechner, keine eigene Rechnung, kein Absenden, keine Kontaktdaten.
 * - Zustandslos: pro Anfrage ein neuer Server, keine Sitzungen, keine Speicherung.
 * - Ohne Authentifizierung, deshalb hart auf Previews begrenzt: im Production-Kontext
 *   antwortet der Endpunkt mit 404, auch wenn dieser Code versehentlich gemergt wird.
 * - Keine Protokollierung von Eingaben oder Fotos.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { buildCalculateTool, buildOptionsTool, buildResolveTool } from "../../client/src/lib/velux/tools";

/** Netlify Functions v2: nur die hier genutzten Felder des Kontexts. */
interface NetlifyContext {
  deploy?: { context?: string };
}

export const PHOTO_PROBE_TOOL = "rex_velux_photo_probe_v1";

/**
 * Prüf-Tool für den Fototest in P4a: meldet nur, IN WELCHER FORM ein Foto ankommt
 * (Typ, Feldnamen, Medientyp, ob ein Link oder eine Datei-ID dabei ist). Es lädt nichts
 * herunter, speichert nichts und gibt keine Links oder Inhalte zurück.
 */
function describeAttachment(value: unknown): Record<string, unknown> {
  if (value === undefined || value === null) return { received: false };
  if (typeof value === "string") {
    return {
      received: true,
      kind: "string",
      length: value.length,
      looksLikeUrl: /^https?:\/\//i.test(value),
      looksLikeDataUrl: /^data:/i.test(value),
    };
  }
  if (typeof value !== "object") return { received: true, kind: typeof value };
  const obj = value as Record<string, unknown>;
  const pick = (k: string) => (typeof obj[k] === "string" || typeof obj[k] === "number" ? obj[k] : undefined);
  return {
    received: true,
    kind: Array.isArray(value) ? "array" : "object",
    keys: Object.keys(obj).slice(0, 20),
    mimeType: pick("mime_type") ?? pick("mimeType") ?? pick("content_type") ?? pick("type"),
    size: pick("size") ?? pick("size_bytes"),
    hasDownloadUrl: Object.keys(obj).some((k) => /url/i.test(k) && typeof obj[k] === "string"),
    hasFileId: Object.keys(obj).some((k) => /file_?id|^id$/i.test(k)),
  };
}

const photoProbeTool = {
  name: PHOTO_PROBE_TOOL,
  title: "Fototest (nur Vorschau)",
  description:
    "NUR FÜR DEN TEST AUF DER VORSCHAU: Prüft, ob ein vom Nutzer im Chat hochgeladenes Foto " +
    "des Typenschilds über den Parameter image bei diesem Werkzeug ankommt. Meldet nur die Form " +
    "der Übergabe (Typ, Feldnamen, Medientyp), lädt das Foto nicht herunter und speichert nichts. " +
    "Nur aufrufen, wenn der Nutzer ausdrücklich den Fototest möchte und ein Foto hochgeladen hat.",
  inputSchema: {
    type: "object",
    properties: {
      image: { description: "Das vom Nutzer hochgeladene Foto (Dateiparameter)." },
      note: { type: "string", maxLength: 200, description: "Optional: kurze Notiz zum Test." },
    },
    additionalProperties: false,
  },
  annotations: { readOnlyHint: true },
  // Hinweis für ChatGPT, dass `image` ein Dateiparameter ist. Wird ignoriert, wenn unbekannt.
  _meta: { "openai/fileParams": ["image"] },
  execute: (input: unknown) => {
    const raw = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
    return { ok: true, preview: true, image: describeAttachment(raw.image), storedNothing: true };
  },
};

export function buildServer(): Server {
  const tools = [buildOptionsTool(), buildResolveTool(), buildCalculateTool(), photoProbeTool];
  const server = new Server(
    { name: "rex-velux-preisrechner-preview", version: "0.1.0" },
    {
      capabilities: { tools: {} },
      instructions:
        "Vorschau-Endpunkt der Rex Bedachungs GmbH (Bochum, autorisierter VELUX-Partner) zum Test. " +
        "Die Werkzeuge berechnen eine unverbindliche Kostenschätzung für den Austausch von VELUX-" +
        "Dachfenstern; sie senden keine Anfrage ab. Für eine Anfrage öffnet der Nutzer den " +
        "calculatorUrl aus der Antwort und sendet selbst ab.",
    },
  );
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: tools.map((t) => ({
      name: t.name,
      ...(t.title ? { title: t.title } : {}),
      description: t.description,
      inputSchema: t.inputSchema as { type: "object"; [key: string]: unknown },
      ...(t.annotations ? { annotations: t.annotations } : {}),
      ...("_meta" in t && t._meta ? { _meta: t._meta } : {}),
    })),
  }));
  server.setRequestHandler(CallToolRequestSchema, async (request, extra) => {
    const tool = tools.find((t) => t.name === request.params.name);
    if (!tool) {
      return { isError: true, content: [{ type: "text" as const, text: `Unbekanntes Werkzeug: ${request.params.name}` }] };
    }
    const result = (await tool.execute(request.params.arguments ?? {}, { signal: extra.signal } as never)) as Record<string, unknown>;
    const isError = result?.ok === false;
    return {
      ...(isError ? { isError: true } : {}),
      structuredContent: result,
      content: [{ type: "text" as const, text: JSON.stringify(result) }],
    };
  });
  return server;
}

/** Doppelte Sperre: kein Production-Kontext UND nur Preview-Hosts (oder lokale Tests). */
const ALLOWED_HOST = /^(deploy-preview-\d+--leafy-sprite-bbbfd6\.netlify\.app|localhost|127\.0\.0\.1)$/;

export function isPreviewRequest(req: Request, context?: NetlifyContext): boolean {
  if (context?.deploy?.context === "production") return false;
  try {
    return ALLOWED_HOST.test(new URL(req.url).hostname);
  } catch {
    return false;
  }
}

export default async (req: Request, context?: NetlifyContext): Promise<Response> => {
  if (!isPreviewRequest(req, context)) return new Response("Not Found", { status: 404 });
  const server = buildServer();
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  await server.connect(transport);
  try {
    return await transport.handleRequest(req);
  } finally {
    void server.close();
  }
};

export const config = { path: "/mcp" };
