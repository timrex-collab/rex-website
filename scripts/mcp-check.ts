/**
 * P4b, Deploy 1 – Prüfung des Endpunkts `/mcp` (netlify/functions/mcp.mts) ohne Netzwerk:
 * Der Handler wird direkt mit Web-Standard-Requests aufgerufen.
 *
 * Aufruf: npx tsx scripts/mcp-check.ts
 *
 * Prüft: Freischaltung nur für Live-Domain, Deploy-Previews und lokal; Größengrenze; MCP-Handshake;
 * Tool-Liste; Goldwert über dieselbe Fachlogik (2.104 € brutto); Bestätigungsbedarf beim Typenschild;
 * Fehlerpfade; Rate-Limit-Regel. Ab Deploy 2: prepare/submit mit Prüfung der Eingaben, Bindung an die
 * Zusammenfassung, allen Zuständen des Doppelversandschutzes, Tageskontingent (auch parallel),
 * Speicherfehler, Aufräumen, Modus nach Deploy-Kontext. Ohne Netzwerk, ohne echten Versand.
 */
import handler, {
  DAILY_LIMIT, MAX_BODY_BYTES, TOOL, config, createInquiryService, memoryStore, netlifyFormsSender, resolveMode, summaryIdFor,
  type KeyStore, type SendOutcome,
} from "../netlify/functions/mcp.mts";
import { buildKonfigurationText, PHOTO_FOLLOW_UP, PHOTO_NOT_SENT } from "../client/src/lib/velux/inquiry";
import { buildEstimate } from "../client/src/lib/velux/estimate";

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
  check(JSON.stringify(names) === JSON.stringify(["rex_velux_get_options_v1", "rex_velux_resolve_existing_window_v1", "rex_velux_calculate_estimate_v1", TOOL.prepare, TOOL.submit]),
    `tools/list: drei lesende Tools, prepare und submit (${names.join(", ")})`);
  check(!names.some((n: string) => /apply|photo/.test(n)), "tools/list: kein Apply- oder Fototool");
  const tdef = (n: string) => (list.body?.result?.tools ?? []).find((t: any) => t.name === n);
  check(tdef(TOOL.prepare)?.annotations?.readOnlyHint === true && tdef(TOOL.submit)?.annotations?.readOnlyHint === false,
    "Annotationen: prepare lesend, submit schreibend");
  check(JSON.stringify(tdef(TOOL.submit)?.inputSchema?.required) === JSON.stringify(["positions", "funding", "contact", "summaryId", "submissionKey", "userConfirmed"]),
    "submit verlangt summaryId, submissionKey und userConfirmed");

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

  await inquiryChecks(funding);

  console.log(failures ? `\n${failures} Prüfung(en) fehlgeschlagen` : "\nAlle Prüfungen bestanden.");
  process.exit(failures ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

// ── Deploy 2: prepare und submit ─────────────────────────────────────

const POS = [{ model: "GGU", size: "MK08", glazing: "ENERGIE", quantity: 1 }];
const CONTACT = { name: "Erika Test", email: "erika@example.invalid", telefon: "", strasse: "", plz: "44787", ort: "Bochum" };
const base = (funding: unknown, extra: Record<string, unknown> = {}) => ({
  positions: POS, funding, contact: CONTACT, message: "Bitte Rückruf vormittags.",
  existingWindowNote: { reading: "GGL S10 → SK10", status: "assumed" }, ...extra,
});

function fakeSender(outcomes: SendOutcome[], delayMs = 0) {
  const calls: Record<string, string>[] = [];
  const send = async (fields: Record<string, string>) => {
    calls.push(fields);
    if (delayMs) await new Promise((r) => setTimeout(r, delayMs));
    return outcomes.length > 1 ? outcomes.shift()! : outcomes[0];
  };
  return { send, calls };
}

async function inquiryChecks(funding: Record<string, string>) {
  // prepare über den Handler (lokal: Probelauf)
  const prep = (await callTool(TOOL.prepare, base(funding)))?.structuredContent;
  check(prep?.ok === true && /^[0-9a-f]{64}$/.test(prep.summaryId) && /^[0-9a-f-]{36}$/.test(prep.submissionKey),
    "prepare: summaryId (SHA-256) und submissionKey (UUID)");
  check(typeof prep?.summary === "string" && prep.summary.includes("ab 2.104 €") && prep.summary.includes("Erika Test") &&
    prep.summary.includes("erika@example.invalid") && prep.summary.includes("Bitte Rückruf vormittags.") &&
    prep.summary.includes("Fensterzuordnung: vermutet (Typenschild: GGL S10 → SK10, nicht bestätigt)") && !prep.summary.includes("laut KI") && prep.summary.includes(PHOTO_NOT_SENT),
    "prepare: Zusammenfassung mit Betrag, Kontaktdaten, Nachricht, Fensterzuordnung und Foto-Satz");

  // Prüfung der Eingaben (wie im Rechner, mit Längengrenzen)
  const pf = async (extra: Record<string, unknown>) => (await callTool(TOOL.prepare, base(funding, extra)))?.structuredContent?.error?.code;
  check(await pf({ contact: { name: "E" , email: "e@x.de" } }) === "CONTACT_INVALID", "prepare: Name unter 2 Zeichen → CONTACT_INVALID");
  check(await pf({ contact: { name: "Erika", email: "ohne-at" } }) === "CONTACT_INVALID", "prepare: weder E-Mail mit @ noch Telefon → CONTACT_INVALID");
  check((await callTool(TOOL.prepare, base(funding, { contact: { name: "Erika", telefon: "0234 123" } })))?.structuredContent?.ok === true,
    "prepare: Name und Telefon ohne E-Mail genügen (wie im Rechner)");
  check(await pf({ message: "x".repeat(2001) }) === "TOO_LONG", "prepare: Nachricht über 2.000 Zeichen → TOO_LONG");
  check(await pf({ existingWindowNote: { status: "vielleicht" } }) === "INVALID_ENUM", "prepare: unbekannter Zuordnungsstatus → INVALID_ENUM");
  check(await pf({ contact: { name: "Erika", email: "e@x.de", foto: "x" } }) === "UNKNOWN_FIELD", "prepare: unbekanntes Kontaktfeld → UNKNOWN_FIELD");

  // Bindung an Inhalt, Beträge und Rechenversion
  const f1 = { a: "1", konfiguration: "ab 2.104 €" };
  const id = await summaryIdFor(f1, "1/x/y/z", "00000000-0000-4000-8000-000000000001");
  check(id !== await summaryIdFor({ ...f1, konfiguration: "ab 2.105 €" }, "1/x/y/z", "00000000-0000-4000-8000-000000000001"), "summaryId ändert sich mit einem Betrag");
  check(id !== await summaryIdFor(f1, "2/x/y/z", "00000000-0000-4000-8000-000000000001"), "summaryId ändert sich mit der Rechenversion");
  check(id !== await summaryIdFor(f1, "1/x/y/z", "00000000-0000-4000-8000-000000000002"), "summaryId ändert sich mit dem submissionKey");

  // Formularfeld konfiguration = Rechner-Fassung
  const est = buildEstimate([{ model: "GGU", size: "MK08", glazing: "E", qty: 1, shutter: "none", shutterQty: 0, blind: "none", blindQty: 0 } as any], funding as any);
  const konf = buildKonfigurationText(est.details, est.totals, est.funding, funding as any);
  check(prep?.summary.includes(konf), "konfiguration: identisch mit der Fassung des Rechners");

  // Zustände mit Speicher im Arbeitsspeicher und Test-Sender (Preview-Modus)
  let n = 0;
  const key = () => `00000000-0000-4000-8000-${String(++n).padStart(12, "0")}`;
  const svc = (store: KeyStore, send: (f: Record<string, string>) => Promise<SendOutcome>, now = () => new Date("2026-11-13T12:00:00Z")) =>
    createInquiryService({ mode: "preview", store, send, now, randomKey: key });

  {
    const store = memoryStore(); const s = fakeSender(["sent"]); const service = svc(store, s.send);
    const p: any = await service.prepare(base(funding));
    const args = { ...base(funding), summaryId: p.summaryId, submissionKey: p.submissionKey };
    const noConf: any = await service.submit(args);
    check(noConf.error?.code === "CONFIRMATION_MISSING" && s.calls.length === 0, "submit ohne userConfirmed → CONFIRMATION_MISSING, kein Versand");
    const changed: any = await service.submit({ ...args, positions: [{ ...POS[0], quantity: 2 }], userConfirmed: true });
    check(changed.error?.code === "SUMMARY_MISMATCH" && s.calls.length === 0, "submit nach Änderung → SUMMARY_MISMATCH, kein Versand");
    const ok: any = await service.submit({ ...args, userConfirmed: true });
    check(ok.ok === true && ok.status === "SENT" && s.calls.length === 1 && ok.message.includes(PHOTO_FOLLOW_UP.email), "submit → SENT, ein Versand, Foto-Hinweis für E-Mail");
    const sent = s.calls[0];
    check(sent["form-name"] === "velux-preisrechner" && sent["bot-field"] === "" && !("typenschild" in sent) &&
      sent.name === "TEST – Preview Erika Test" && sent.quelle.startsWith("TEST – Preview Aufmerksam geworden: KI-Assistent") &&
      sent.quelle.includes("per ChatGPT-Plugin, auf dem Server neu berechnet") && sent.nachricht === "Bitte Rückruf vormittags.",
      "Versandinhalt: Formular, leeres bot-field, kein Foto, TEST-Kennzeichnung, quelle, Nachricht");
    const again: any = await service.submit({ ...args, userConfirmed: true });
    check(again.status === "ALREADY_SENT" && s.calls.length === 1, "zweiter submit → ALREADY_SENT, kein zweiter Versand");
  }
  {
    const store = memoryStore(); const s = fakeSender(["sent"], 50); const service = svc(store, s.send);
    const p: any = await service.prepare(base(funding));
    const args = { ...base(funding), summaryId: p.summaryId, submissionKey: p.submissionKey, userConfirmed: true };
    const [a, b]: any[] = await Promise.all([service.submit(args), service.submit(args)]);
    const codes = [a.status ?? a.error?.code, b.status ?? b.error?.code].sort();
    check(JSON.stringify(codes) === JSON.stringify(["IN_PROGRESS", "SENT"]) && s.calls.length === 1, `zwei gleichzeitige submit → einmal SENT, einmal IN_PROGRESS (${codes})`);
  }
  {
    const store = memoryStore(); const s = fakeSender(["unknown"]); const service = svc(store, s.send);
    const p: any = await service.prepare(base(funding));
    const args = { ...base(funding), summaryId: p.summaryId, submissionKey: p.submissionKey, userConfirmed: true };
    const u1: any = await service.submit(args); const u2: any = await service.submit(args);
    check(u1.error?.code === "OUTCOME_UNKNOWN" && u2.error?.code === "OUTCOME_UNKNOWN" && s.calls.length === 1 && u1.ok === false,
      "Timeout → OUTCOME_UNKNOWN, keine Erfolgsmeldung, kein Neuversand");
    check(!/wir melden uns/.test(u1.error.message) && u1.error.message.includes("0234 / 58 31 00"),
      "OUTCOME_UNKNOWN verspricht keine Rückmeldung, nennt die Telefonnummer");
  }
  {
    const store = memoryStore(); const s = fakeSender(["rejected", "sent"]); const service = svc(store, s.send);
    const p: any = await service.prepare(base(funding, { contact: { name: "Erika", telefon: "0234 123456" } }));
    const args = { ...base(funding, { contact: { name: "Erika", telefon: "0234 123456" } }), summaryId: p.summaryId, submissionKey: p.submissionKey, userConfirmed: true };
    const r1: any = await service.submit(args); const r2: any = await service.submit(args);
    check(r1.error?.code === "SEND_FAILED" && r2.status === "SENT" && s.calls.length === 2, "Ablehnung → SEND_FAILED, neuer Versuch erlaubt");
    check(r2.message.includes(PHOTO_FOLLOW_UP.phone), "nur Telefon → Foto-Hinweis „beim Rückruf“");
  }
  {
    const store = memoryStore(); const s = fakeSender(["sent"]); const service = svc(store, s.send);
    for (let i = 1; i <= DAILY_LIMIT; i++) await store.createIfNew(`quota/2026-11-13/${String(i).padStart(2, "0")}`, "{}");
    const p: any = await service.prepare(base(funding));
    const args = { ...base(funding), summaryId: p.summaryId, submissionKey: p.submissionKey, userConfirmed: true };
    const d: any = await service.submit(args);
    check(d.error?.code === "DAILY_LIMIT" && s.calls.length === 0, "Tageskontingent voll → DAILY_LIMIT, kein Versand");
    await store.delete("quota/2026-11-13/50");
    const d2: any = await service.submit(args);
    check(d2.status === "SENT", "nach DAILY_LIMIT ist die Reservierung wieder frei");
  }
  {
    const store = memoryStore(); const s = fakeSender(["sent"], 5); const service = svc(store, s.send);
    const preps: any[] = [];
    for (let i = 0; i < DAILY_LIMIT + 10; i++) preps.push(await service.prepare(base(funding)));
    const res: any[] = await Promise.all(preps.map((p) => service.submit({ ...base(funding), summaryId: p.summaryId, submissionKey: p.submissionKey, userConfirmed: true })));
    const sentCount = res.filter((r) => r.status === "SENT").length;
    const limited = res.filter((r) => r.error?.code === "DAILY_LIMIT").length;
    check(sentCount === DAILY_LIMIT && limited === 10 && s.calls.length === DAILY_LIMIT, `60 parallele Anfragen → genau ${DAILY_LIMIT} gesendet (${sentCount}/${limited})`);
  }
  {
    const broken: KeyStore = { ...memoryStore(), createIfNew: async () => { throw new Error("down"); } };
    const s = fakeSender(["sent"]); const service = svc(broken, s.send);
    const p: any = await service.prepare(base(funding));
    const r: any = await service.submit({ ...base(funding), summaryId: p.summaryId, submissionKey: p.submissionKey, userConfirmed: true });
    check(r.error?.code === "STORE_UNAVAILABLE" && s.calls.length === 0, "Speicher nicht erreichbar → STORE_UNAVAILABLE, kein Versand");
  }
  {
    const store = memoryStore(); const s = fakeSender(["sent"]); const service = svc(store, s.send);
    await store.set("quota/2026-11-12/01", "{}");
    await store.set("idem/00000000-0000-4000-8000-999999999999", JSON.stringify({ state: "sent", at: Date.parse("2026-11-12T08:00:00Z") }));
    const p: any = await service.prepare(base(funding));
    await service.submit({ ...base(funding), summaryId: p.summaryId, submissionKey: p.submissionKey, userConfirmed: true });
    const keys = await store.list("");
    check(!keys.includes("quota/2026-11-12/01") && !keys.includes("idem/00000000-0000-4000-8000-999999999999") && keys.includes(`idem/${p.submissionKey}`),
      "Aufräumen: Vortags-Kontingent und Vermerke älter als 24 h gelöscht, aktueller bleibt");
  }

  // Aufräumen schon bei prepare, ohne Versand, und ohne Obergrenze (Codex-Review #116)
  {
    const store = memoryStore(); const s = fakeSender(["sent"]); const service = svc(store, s.send);
    await store.set("quota/2026-11-10/07", "{}");
    for (let i = 0; i < 60; i++) await store.set(`idem/old-${i}`, JSON.stringify({ state: "sent", at: Date.parse("2026-11-12T08:00:00Z") }));
    await store.set("idem/fresh", JSON.stringify({ state: "sent", at: Date.parse("2026-11-13T11:00:00Z") }));
    await service.prepare(base(funding));
    const keys = await store.list("");
    check(s.calls.length === 0 && !keys.some((k) => k.startsWith("idem/old-") || k.startsWith("quota/2026-11-10")) && keys.includes("idem/fresh"),
      "Aufräumen bei prepare: 60 alte Vermerke und Vortags-Plätze gelöscht, frischer Vermerk bleibt");
  }

  // Einordnung der Antworten von Netlify Forms (Codex-Review #116, P1)
  {
    const realFetch = globalThis.fetch;
    const classify = async (impl: () => Promise<Response>) => {
      globalThis.fetch = (async () => impl()) as typeof fetch;
      try { return await netlifyFormsSender("https://example.invalid")({ a: "1" }); } finally { globalThis.fetch = realFetch; }
    };
    const r = (status: number) => async () => new Response(null, { status });
    const got = {
      ok200: await classify(r(200)), redirect303: await classify(r(303)), bad400: await classify(r(400)), limit429: await classify(r(429)),
      timeout408: await classify(r(408)), gateway502: await classify(r(502)), gateway504: await classify(r(504)),
      error500: await classify(r(500)), thrown: await classify(async () => { throw new Error("reset"); }),
    };
    check(got.ok200 === "sent" && got.redirect303 === "sent" && got.bad400 === "rejected" && got.limit429 === "rejected" &&
      got.timeout408 === "unknown" && got.gateway502 === "unknown" && got.gateway504 === "unknown" && got.error500 === "unknown" && got.thrown === "unknown",
      `Netlify-Antwort: 2xx/3xx gesendet, 4xx abgelehnt, 408/5xx/Abbruch unklar (${JSON.stringify(got)})`);
  }

  // Handler lokal: Probelauf ohne Versand
  const lp = (await callTool(TOOL.prepare, base(funding)))?.structuredContent;
  const ls = (await callTool(TOOL.submit, { ...base(funding), summaryId: lp.summaryId, submissionKey: lp.submissionKey, userConfirmed: true }))?.structuredContent;
  check(ls?.status === "SENT" && ls.dryRun === true, "Handler ohne Netlify-Kontext: Probelauf (dryRun), kein Versand");

  // Modus nach Deploy-Kontext
  const rq = (u: string) => new Request(u);
  check(resolveMode(rq("https://www.rex-bedachung.de/mcp"), { deploy: { context: "production" } }) === "production" &&
    resolveMode(rq("https://deploy-preview-9--leafy-sprite-bbbfd6.netlify.app/mcp"), { deploy: { context: "deploy-preview" } }) === "preview" &&
    resolveMode(rq("https://www.rex-bedachung.de/mcp"), {}) === "local" &&
    resolveMode(rq("https://deploy-preview-9--leafy-sprite-bbbfd6.netlify.app/mcp"), { deploy: { context: "production" } }) === "local",
    "Modus: Produktion nur mit Production-Kontext und Live-Domain, Preview nur auf Previews");
}
