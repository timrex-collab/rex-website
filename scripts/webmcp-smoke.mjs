/**
 * WebMCP-Smoke-Test des VELUX-Preisrechners im echten Chrome (≥ 150).
 *
 * Läuft NICHT in der CI (dort gibt es kein WebMCP-fähiges Chrome). Gedacht für
 * den manuellen Lauf gegen eine Netlify-Preview oder `vite preview`, bei der
 * VITE_WEBMCP_ENABLED=true und VITE_WEBMCP_ORIGINS die Test-URL enthalten.
 *
 * Voraussetzungen: Node ≥ 20, `npm i -g playwright` (oder lokal), Chrome ≥ 150
 * mit aktiviertem chrome://flags/#enable-webmcp-testing – oder ein Origin-Trial-
 * Token für die Test-Origin. Der Flag-Name kann per WEBMCP_CHROME_FLAG gesetzt
 * werden (Standard: --enable-features=WebMCP; beim ersten Lauf verifizieren).
 *
 * Aufruf:
 *   node scripts/webmcp-smoke.mjs https://deploy-preview-123--leafy-sprite-bbbfd6.netlify.app
 *   SHIM=1 node scripts/webmcp-smoke.mjs http://localhost:4174   # Adapter-Test mit Shim (kein Browser-Nachweis)
 *
 * Prüft: Tools nur auf der Rechner-Route, Abmeldung bei Routenwechsel, keine
 * Duplikate, Promise-Verhalten von registerTool, calculate-Roundtrip (Goldwert),
 * Fehlerpfad, Apply mit bestätigtem UI-Commit, DRAFT_EXISTS, und dass kein Tool
 * Netzwerkverkehr auslöst.
 */
import { chromium } from "playwright";

const base = process.argv[2];
if (!base) { console.error("Basis-URL fehlt."); process.exit(2); }
const useShim = process.env.SHIM === "1";
const flag = process.env.WEBMCP_CHROME_FLAG ?? "--enable-features=WebMCP";

// Minimaler Shim: reproduziert nur die Adapter-Sicht (registerTool: Promise, Abort = abmelden).
const SHIM = `(() => {
  const tools = new Map();
  const mc = new EventTarget();
  mc.registerTool = (tool, opts = {}) => new Promise((resolve, reject) => {
    if (opts.signal?.aborted) return reject(new DOMException("aborted", "AbortError"));
    if (tools.has(tool.name)) return reject(new DOMException("duplicate tool " + tool.name, "InvalidStateError"));
    tools.set(tool.name, tool);
    opts.signal?.addEventListener("abort", () => { tools.delete(tool.name); mc.dispatchEvent(new Event("toolchange")); }, { once: true });
    mc.dispatchEvent(new Event("toolchange"));
    resolve();
  });
  mc.getTools = async () => [...tools.values()].map(t => ({ name: t.name, description: t.description, inputSchema: t.inputSchema, annotations: t.annotations }));
  mc.executeTool = async (name, input) => { const t = tools.get(name); if (!t) throw new Error("no tool " + name); const ac = new AbortController(); return t.execute(input, { signal: ac.signal }); };
  Object.defineProperty(document, "modelContext", { value: mc, configurable: true });
  window.__webmcpShim = true;
})();`;

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  channel: process.env.CHROME_PATH ? undefined : (process.env.CHROME_CHANNEL || (useShim ? undefined : "chrome")),
  args: useShim ? [] : [flag],
});
const ctx = await browser.newContext({ viewport: { width: 1200, height: 2000 } });
if (useShim) await ctx.addInitScript(SHIM);
const page = await ctx.newPage();
const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
const requests = []; page.on("request", (r) => requests.push(r.url()));
let failures = 0;
const check = (ok, msg) => { console.log(`${ok ? "✓" : "✗"} ${msg}`); if (!ok) failures++; };
const listTools = () => page.evaluate(async () => {
  const mc = document.modelContext ?? navigator.modelContext;
  if (!mc) return null;
  if (typeof mc.getTools !== "function") return "no-getTools";
  return (await mc.getTools()).map((t) => t.name).sort();
});
const call = (name, input) => page.evaluate(async ({ name, input }) => {
  const mc = document.modelContext ?? navigator.modelContext;
  if (typeof mc.executeTool !== "function") return { skipped: "executeTool nicht verfügbar – im Inspector manuell prüfen" };
  return mc.executeTool(name, input);
}, { name, input });

await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(800);
const home = await listTools();
check(home === null || home === "no-getTools" || home.length === 0, `Startseite: keine Tools registriert (${JSON.stringify(home)})`);

await page.goto(`${base}/velux-preisrechner-bochum`, { waitUntil: "domcontentloaded" });
await page.waitForSelector("#preisrechner");
await page.waitForTimeout(1500);
const onCalc = await listTools();
const expected = ["rex_velux_apply_configuration_v1", "rex_velux_calculate_estimate_v1", "rex_velux_get_options_v1", "rex_velux_resolve_existing_window_v1"];
check(Array.isArray(onCalc) && JSON.stringify(onCalc) === JSON.stringify(expected), `Rechner-Seite: genau die vier Tools registriert (${JSON.stringify(onCalc)})`);
if (onCalc === null) { console.error("document.modelContext fehlt – Flag/Token/Chrome-Version prüfen."); await browser.close(); process.exit(1); }

const before = requests.length;
const est = await call("rex_velux_calculate_estimate_v1", { positions: [{ model: "GGU", size: "MK08", glazing: "ENERGIE", quantity: 1 }], funding: { buildingAge: "over_10", energyRenovation: "yes", ownerOccupied: "yes", hasIsfp: "no" } });
if (est?.skipped) console.log("… " + est.skipped);
else {
  check(est?.ok === true && est.totals?.grossFrom === 2104 && est.funding?.begGrant?.amountMax === 316 && est.funding?.taxBonus35c?.totalMax === 421, `calculate: Goldwert 2.104 € brutto / BEG 316 € / §35c 421 € (${JSON.stringify(est?.totals)})`);
  console.log(`… calculate: Antwortgröße ${JSON.stringify(est).length} Zeichen`);
  const bad = await call("rex_velux_calculate_estimate_v1", { positions: [{ model: "GPU", size: "CK02", glazing: "ENERGIE", quantity: 1 }], funding: { buildingAge: "unknown", energyRenovation: "unknown", ownerOccupied: "unknown", hasIsfp: "unknown" } });
  check(bad?.ok === false && bad.error?.code === "INVALID_SIZE_FOR_MODEL" && Array.isArray(bad.error.allowedSizes), "calculate: ungültige Kombination liefert INVALID_SIZE_FOR_MODEL mit allowedSizes");
  const resolved = await call("rex_velux_resolve_existing_window_v1", { windowType: "GGL", sizeCode: "M08", source: "agent_image_recognition" });
  check(resolved?.status === "confirmation_required" && resolved.existingWindow?.sizeCode === "MK08", "resolve: M08 aus Bild → confirmation_required mit MK08");
  const stillNoNetwork = requests.slice(before).filter((u) => !/\.(js|css|woff2?|png|webp|svg|ico)(\?|$)/.test(u));
  check(stillNoNetwork.length === 0, `Tools lösen keinen Netzwerkverkehr aus (${stillNoNetwork.length} Requests)`);
  const applied = await call("rex_velux_apply_configuration_v1", { positions: [{ model: "GGU", size: "MK08", glazing: "ENERGIE", quantity: 1 }], funding: { buildingAge: "over_10", energyRenovation: "yes", ownerOccupied: "yes", hasIsfp: "no" } });
  check(applied?.ok === true && applied.uiApplied === true, "apply: Konfiguration übernommen (bestätigter Commit)");
  const shown = await page.locator("#preisrechner").innerText();
  check(/Kostenschätzung brutto \(inkl\. MwSt\.\)\s+ab 2\.104 €/.test(shown.replace(/\s+/g, " ")), "apply: Schritt 3 zeigt 2.104 € brutto");
  const draft = await call("rex_velux_apply_configuration_v1", { positions: [{ model: "GGL", size: "MK08", glazing: "ENERGIE", quantity: 1 }], funding: { buildingAge: "over_10", energyRenovation: "yes", ownerOccupied: "yes", hasIsfp: "no" } });
  check(draft?.ok === false && draft.error?.code === "DRAFT_EXISTS", "apply: zweiter Aufruf ohne replaceExisting → DRAFT_EXISTS");
  const postAppliedNetwork = requests.slice(before).filter((u) => !/\.(js|css|woff2?|png|webp|svg|ico)(\?|$)/.test(u));
  check(postAppliedNetwork.length === 0, "apply: weiterhin kein Netzwerkverkehr (kein Formular-Submit)");
}

await page.getByRole("link", { name: /Startseite|Rex Bedachung/i }).first().click().catch(() => page.goto(`${base}/`));
await page.waitForTimeout(800);
const after = await listTools();
check(after === null || after === "no-getTools" || after.length === 0, `Nach Routenwechsel: Tools abgemeldet (${JSON.stringify(after)})`);
await page.goto(`${base}/velux-preisrechner-bochum`, { waitUntil: "domcontentloaded" });
await page.waitForSelector("#preisrechner"); await page.waitForTimeout(1500);
const again = await listTools();
check(Array.isArray(again) && again.length === 4, `Erneuter Besuch: vier Tools, keine Duplikate (${JSON.stringify(again)})`);
check(errors.length === 0, `Keine JS-Fehler (${errors.join(" | ")})`);
await browser.close();
console.log(failures ? `\n${failures} Prüfung(en) fehlgeschlagen` : "\nAlle Prüfungen bestanden.");
process.exit(failures ? 1 : 0);
