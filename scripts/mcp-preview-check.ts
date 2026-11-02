/**
 * P4a – Prüfung des Vorschau-Endpunkts `/mcp` (netlify/functions/mcp.mts) ohne Netzwerk:
 * Der Handler wird direkt mit Web-Standard-Requests aufgerufen.
 *
 * Aufruf: npx tsx scripts/mcp-preview-check.ts
 *
 * Prüft: Sperre außerhalb der Previews, MCP-Handshake, Tool-Liste, Goldwert über
 * dieselbe Fachlogik (2.104 € brutto), Bestätigungsbedarf beim Typenschild,
 * Fehlerpfade und dass der Fototest keine Links oder Inhalte zurückgibt.
 */
import handler, { PHOTO_PROBE_TOOL } from "../netlify/functions/mcp.mts";

let failures = 0;
const check = (ok: boolean, msg: string) => {
  console.log(`${ok ? "✓" : "✗"} ${msg}`);
  if (!ok) failures++;
};

const PREVIEW = "https://deploy-preview-999--leafy-sprite-bbbfd6.netlify.app/mcp";
let nextId = 1;

async function rpc(method: string, params: Record<string, unknown> = {}, url = PREVIEW, context?: { deploy?: { context?: string } }) {
  const res = await handler(
    new Request(url, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json, text/event-stream", "mcp-protocol-version": "2025-06-18" },
      body: JSON.stringify({ jsonrpc: "2.0", id: nextId++, method, params }),
    }),
    context ?? { deploy: { context: "deploy-preview" } },
  );
  const text = await res.text();
  let body: any = null;
  try { body = JSON.parse(text); } catch { /* kein JSON */ }
  return { status: res.status, body, text };
}

const callTool = async (name: string, args: Record<string, unknown>) => (await rpc("tools/call", { name, arguments: args })).body?.result;

async function main() {
  // Sperre
  for (const [label, url, ctx] of [
    ["Production-Kontext", PREVIEW, { deploy: { context: "production" } }],
    ["Live-Domain", "https://www.rex-bedachung.de/mcp", { deploy: { context: "deploy-preview" } }],
    ["Branch-Alias main", "https://main--leafy-sprite-bbbfd6.netlify.app/mcp", {}],
  ] as const) {
    const r = await rpc("tools/list", {}, url, ctx);
    check(r.status === 404, `Gesperrt: ${label} → 404 (${r.status})`);
  }

  // Handshake und Tool-Liste
  const init = await rpc("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "rex-check", version: "1" } });
  check(init.status === 200 && init.body?.result?.serverInfo?.name === "rex-velux-preisrechner-preview", `initialize: Server meldet sich (${init.status})`);
  check(typeof init.body?.result?.instructions === "string" && /autorisierter VELUX-Partner/.test(init.body.result.instructions), "initialize: Hinweistext mit korrekter Partnerbezeichnung");

  const list = await rpc("tools/list");
  const names = (list.body?.result?.tools ?? []).map((t: any) => t.name);
  check(JSON.stringify(names) === JSON.stringify(["rex_velux_get_options_v1", "rex_velux_resolve_existing_window_v1", "rex_velux_calculate_estimate_v1", PHOTO_PROBE_TOOL]),
    `tools/list: genau die vier lesenden Tools (${names.join(", ")})`);
  check(!names.includes("rex_velux_apply_configuration_v1"), "tools/list: kein Apply-Tool (keine Seite, nichts zu übernehmen)");
  const probeDef = (list.body?.result?.tools ?? []).find((t: any) => t.name === PHOTO_PROBE_TOOL);
  check(JSON.stringify(probeDef?._meta?.["openai/fileParams"]) === JSON.stringify(["image"]), "Fototest: image als Dateiparameter gekennzeichnet");

  // Fachlogik
  const funding = { buildingAge: "over_10", energyRenovation: "yes", ownerOccupied: "yes", hasIsfp: "no" };
  const est = await callTool("rex_velux_calculate_estimate_v1", { positions: [{ model: "GGU", size: "MK08", glazing: "ENERGIE", quantity: 1 }], funding });
  const sc = est?.structuredContent;
  check(sc?.ok === true && sc.totals?.grossFrom === 2104 && sc.funding?.begGrant?.amountMax === 316 && sc.funding?.taxBonus35c?.totalMax === 421,
    `calculate: Goldwert 2.104 € brutto / BEG 316 € / §35c 421 € (${JSON.stringify(sc?.totals)})`);
  check(sc?.calculatorUrl === "https://www.rex-bedachung.de/velux-preisrechner-bochum#rechner=1&p=GGU.MK08.ENERGIE.1&f=over_10.yes.yes.no", "calculate: calculatorUrl auf den Live-Rechner");
  check(est?.content?.[0]?.type === "text" && JSON.parse(est.content[0].text).totals?.grossFrom === 2104, "calculate: Textinhalt entspricht structuredContent");

  const res = await callTool("rex_velux_resolve_existing_window_v1", { windowType: "GGL", sizeCode: "S10", source: "agent_image_recognition" });
  check(res?.structuredContent?.status === "confirmation_required" && /Frage den Nutzer/.test(res.structuredContent.agentInstruction ?? ""),
    "resolve: Foto-Lesart → confirmation_required mit Anweisung, den Nutzer zu fragen");

  const opts = await callTool("rex_velux_get_options_v1", {});
  check(opts?.structuredContent?.ok === true, "options: Antwort ohne Fehler");

  const bad = await callTool("rex_velux_calculate_estimate_v1", { positions: [{ model: "GPU", size: "CK02", glazing: "ENERGIE", quantity: 1 }], funding });
  check(bad?.isError === true && bad.structuredContent?.error?.code === "INVALID_SIZE_FOR_MODEL", "calculate: ungültige Kombination → isError mit Fehlercode");

  const unknown = await callTool("rex_velux_apply_configuration_v1", {});
  check(unknown?.isError === true, "Unbekanntes Tool (Apply) → isError");

  // Fototest: Form melden, nichts zurückgeben
  const secretUrl = "https://files.example.invalid/typenschild.jpg?token=GEHEIM";
  const probe = await callTool(PHOTO_PROBE_TOOL, { image: { download_url: secretUrl, file_id: "file_123", mime_type: "image/jpeg" } });
  const p = probe?.structuredContent?.image;
  check(p?.received === true && p.hasDownloadUrl === true && p.hasFileId === true && p.mimeType === "image/jpeg", "Fototest: Objekt mit Link und Datei-ID erkannt");
  check(!JSON.stringify(probe).includes("GEHEIM") && !JSON.stringify(probe).includes("files.example"), "Fototest: gibt den Link nicht zurück");
  const none = await callTool(PHOTO_PROBE_TOOL, {});
  check(none?.structuredContent?.image?.received === false, "Fototest: ohne Foto → received false");

  console.log(failures ? `\n${failures} Prüfung(en) fehlgeschlagen` : "\nAlle Prüfungen bestanden.");
  process.exit(failures ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
