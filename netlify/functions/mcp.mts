/**
 * P4b, Deploy 1 – MCP-Endpunkt `/mcp` für den VELUX-Preisrechner (nur lesend).
 *
 * Grundlage: UMSETZUNGSPLAN-2026-10-KI-ANFRAGEN.md (P4) und P4B-PLAN-ENTWURF.md (Entwurf 2,
 * freigegeben für Deploy 1 am 11.11.2026). Erprobt in P4a (PR #112) auf ChatGPT Web, Classic
 * und iPhone-App.
 *
 * - Nur lesende Tools aus `client/src/lib/velux` – dieselbe Fachlogik wie WebMCP und Rechner,
 *   keine eigene Rechnung, kein Absenden, keine Kontaktdaten (Senden folgt erst mit Deploy 2).
 * - Zustandslos: pro Anfrage ein neuer Server, keine Sitzungen, keine Speicherung.
 * - Ohne Authentifizierung. Antwortet nur auf www.rex-bedachung.de, Deploy-Previews und lokal;
 *   andere Hosts (z. B. Branch-Aliase) liefern 404.
 * - Anfragen über 64 KB werden abgelehnt; Aufruflimit über die Rate-Limit-Regel unten.
 * - Unsere Anwendungslogs enthalten keine Eingaben.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { buildCalculateTool, buildOptionsTool, buildResolveTool } from "../../client/src/lib/velux/tools";

/** Höchstgröße einer Anfrage in Byte (Plan P4b, 2.1). */
export const MAX_BODY_BYTES = 64 * 1024;

export function buildServer(): Server {
  const tools = [buildOptionsTool(), buildResolveTool(), buildCalculateTool()];
  const server = new Server(
    { name: "rex-velux-preisrechner", version: "1.0.0" },
    {
      capabilities: { tools: {} },
      instructions:
        "Endpunkt der Rex Bedachungs GmbH (Bochum, autorisierter VELUX-Partner). Die Werkzeuge " +
        "berechnen eine unverbindliche Kostenschätzung für den Austausch von VELUX-Dachfenstern; " +
        "sie senden keine Anfrage ab. Für eine Anfrage öffnet der Nutzer den calculatorUrl aus der " +
        "Antwort und sendet selbst ab.",
    },
  );
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: tools.map((t) => ({
      name: t.name,
      ...(t.title ? { title: t.title } : {}),
      description: t.description,
      inputSchema: t.inputSchema as { type: "object"; [key: string]: unknown },
      ...(t.annotations ? { annotations: t.annotations } : {}),
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

/** Live-Domain, Deploy-Previews und lokale Tests; alles andere (Branch-Aliase, Permalinks) bleibt gesperrt. */
const ALLOWED_HOST = /^(www\.rex-bedachung\.de|deploy-preview-\d+--leafy-sprite-bbbfd6\.netlify\.app|localhost|127\.0\.0\.1)$/;

export function isAllowedHost(req: Request): boolean {
  try {
    return ALLOWED_HOST.test(new URL(req.url).hostname);
  } catch {
    return false;
  }
}

const json = (status: number, message: string) =>
  new Response(JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32600, message } }), {
    status,
    headers: { "content-type": "application/json" },
  });

export default async (req: Request): Promise<Response> => {
  if (!isAllowedHost(req)) return new Response("Not Found", { status: 404 });

  // Größengrenze: erst den Header, dann die tatsächliche Länge prüfen.
  const declared = Number(req.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return json(413, "Anfrage zu groß");
  let forward = req;
  if (req.method === "POST") {
    const body = await req.arrayBuffer();
    if (body.byteLength > MAX_BODY_BYTES) return json(413, "Anfrage zu groß");
    forward = new Request(req.url, { method: req.method, headers: req.headers, body });
  }

  const server = buildServer();
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  await server.connect(transport);
  try {
    return await transport.handleRequest(forward);
  } finally {
    void server.close();
  }
};

/**
 * Aufruflimit (Plan P4b, 3.1; E4 freigegeben 11.11.2026): 60 Aufrufe pro 60 s je Absender-IP.
 * Gilt für den ganzen Pfad, also auch Handshake und Tool-Liste. Ungültige Regeln lassen den Deploy
 * nicht scheitern – nach jedem Deploy im Netlify-Log prüfen, ob die Regel aktiv ist.
 */
export const config = {
  path: "/mcp",
  rateLimit: {
    windowLimit: 60,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};
