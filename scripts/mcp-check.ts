/**
 * P4b, Deploy 1 – Prüfung des Endpunkts `/mcp` (netlify/functions/mcp.mts) ohne Netzwerk:
 * Der Handler wird direkt mit Web-Standard-Requests aufgerufen.
 *
 * Aufruf: npx tsx scripts/mcp-check.ts
 *
 * Prüft: Freischaltung nur für Live-Domain, Deploy-Previews und lokal; Größengrenze; MCP-Handshake;
 * genau drei lesende Tools; Goldwert über dieselbe Fachlogik (2.104 € brutto); Bestätigungsbedarf
 * beim Typenschild; Fehlerpfade; Rate-Limit-Regel in der Function-Konfiguration.
 */
import handler, { MAX_BODY_BYTES, config } from "../netlify/functions/mcp.mts";

let failures = 0;
const check = (ok: boolean, msg: string) => {
  console.log(`${ok ? "✓" : "✗"} ${msg}`);
  if (!ok) failures++;
};

const LIVE = "https://www.rex-bedachung.de/mcp";
const PREVIEW = "https://deploy-preview-999--leafy-sprite-bbbfd6.netlify.app/mcp";
let nextId = 1;

async function post(url: string, body: string) {
  const res = await handler(
    new Request(url, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json, text/event-stream", "mcp-protocol-version": "2025-06-18" },
      body,
    }),
  );
  const text = await res.text();
  let parsed: any = null;
  try { parsed = JSON.parse(text); } catch { /* kein JSON */ }
  return { status: res.status, body: parsed, text };
}

const rpc = (method: string, params: Record<string, unknown> = {}, url = LIVE) =>
  post(url, JSON.stringify({ jsonrpc: "2.0", id: nextId++, method, params }));

const callTool = async (name: string, args: Record<string, unknown>) => (await rpc("tools/call", { name, arguments: args })).body?.result;

async function main() {
  // Freischaltung
  for (const [label, url] of [
    ["Branch-Alias main", "https://main--leafy-sprite-bbbfd6.netlify.app/mcp"],
    ["Netlify-Standardadresse", "https://leafy-sprite-bbbfd6.netlify.app/mcp"],
    ["Fremde Domain", "https://example.com/mcp"],
  ] as const) {
    const r = await rpc("tools/list", {}, url);
    check(r.status === 404, `Gesperrt: ${label} → 404 (${r.status})`);
  }
  for (const [label, url] of [["Live-Domain", LIVE], ["Deploy-Preview", PREVIEW]] as const) {
    const r = await rpc("tools/list", {}, url);
    check(r.status === 200, `Freigeschaltet: ${label} → 200 (${r.status})`);
  }

  // Größengrenze
  const big = await post(LIVE, JSON.stringify({ jsonrpc: "2.0", id: nextId++, method: "tools/list", params: { pad: "x".repeat(MAX_BODY_BYTES) } }));
  check(big.status === 413, `Anfrage über 64 KB → 413 (${big.status})`);

  // Aufruflimit-Regel (Plan P4b 3.1, E4)
  check(config.path === "/mcp" && config.rateLimit?.windowLimit === 60 && config.rateLimit?.windowSize === 60 &&
    JSON.stringify(config.rateLimit?.aggregateBy) === JSON.stringify(["ip", "domain"]),
    "Rate-Limit-Regel: 60 Aufrufe pro 60 s je IP");

  // Handshake und Tool-Liste
  const init = await rpc("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "rex-check", version: "1" } });
  check(init.status === 200 && init.body?.result?.serverInfo?.name === "rex-velux-preisrechner", `initialize: Server meldet sich (${init.status})`);
  check(typeof init.body?.result?.instructions === "string" && /autorisierter VELUX-Partner/.test(init.body.result.instructions),
    "initialize: Hinweistext mit korrekter Partnerbezeichnung");

  const list = await rpc("tools/list");
  const names = (list.body?.result?.tools ?? []).map((t: any) => t.name);
  check(JSON.stringify(names) === JSON.stringify(["rex_velux_get_options_v1", "rex_velux_resolve_existing_window_v1", "rex_velux_calculate_estimate_v1"]),
    `tools/list: genau die drei lesenden Tools (${names.join(", ")})`);
  check(!names.some((n: string) => /apply|submit|photo/.test(n)), "tools/list: kein Apply-, Absende- oder Fototool");

  // Fachlogik
  const funding = { buildingAge: "over_10", energyRenovation: "yes", ownerOccupied: "yes", hasIsfp: "no" };
  const est = await callTool("rex_velux_calculate_estimate_v1", { positions: [{ model: "GGU", size: "MK08", glazing: "ENERGIE", quantity: 1 }], funding });
  const sc = est?.structuredContent;
  check(sc?.ok === true && sc.totals?.grossFrom === 2104 && sc.funding?.begGrant?.amountMax === 316 && sc.funding?.taxBonus35c?.totalMax === 421,
    `calculate: Goldwert 2.104 € brutto / BEG 316 € / §35c 421 € (${JSON.stringify(sc?.totals)})`);
  check(sc?.calculatorUrl === "https://www.rex-bedachung.de/velux-preisrechner-bochum#rechner=1&p=GGU.MK08.ENERGIE.1&f=over_10.yes.yes.no",
    "calculate: calculatorUrl auf den Live-Rechner");
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

  console.log(failures ? `\n${failures} Prüfung(en) fehlgeschlagen` : "\nAlle Prüfungen bestanden.");
  process.exit(failures ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
