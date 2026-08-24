#!/usr/bin/env node
// Prerender-Health-Check Stufe 2 — automatisiert.
//
// Auf dem EIGENEN Rechner ausführen (nicht in der Claude-Umgebung, dort ist die
// Domain netzgesperrt):
//   npm run prerender:check
//
// Ruft die sechs Kern-URLs aus PRERENDER-CHECK.md §1 mit Googlebot-User-Agent ab
// und prüft die vier Pass-Kriterien aus §2: route-spezifischer <title>,
// <meta name="description">, genau ein <h1>, mindestens ein JSON-LD-Block.
//
// Das entspricht Methode 4 der Checkliste: es belegt, dass der Server einem
// Googlebot-User-Agent gerendertes HTML ausliefert. Ob Google es auch annimmt,
// zeigt zusätzlich Methode 1 (GSC-Live-Test) — einmalig sinnvoll.
//
// Flags:
//   --verbose     zeigt zu jeder URL die gefundenen Werte
//   --self-test   prüft die Erkennungslogik offline gegen client/index.html
//                 (muss FAIL ergeben) und eine synthetische Seite (muss PASS)

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE = "https://www.rex-bedachung.de";
const UA =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

// Soll-Titles aus PRERENDER-CHECK.md §4. Bei jeder Title-Änderung mitziehen.
const ROUTES = [
  { path: "/", title: "Dachdecker Bochum – Rex Bedachungs GmbH", titleIsFallback: true, page: "Home" },
  { path: "/dachsanierung-bochum", title: "Dachsanierung Bochum – Komplettsanierung vom Meister", page: "DachsanierungBochum" },
  { path: "/flachdach-bochum", title: "Flachdach Bochum – Abdichtung & Sanierung", page: "FlachdachBochum" },
  { path: "/steildach-bochum", title: "Steildach Bochum – Neueindeckung & Dämmung", page: "SteildachBochum" },
  { path: "/dachfenster-bochum", title: "Dachfenster Bochum – Einbau & Austausch", page: "DachfensterBochum" },
  { path: "/dachreparatur-bochum", title: "Dachreparatur Bochum – Dach undicht? Wir helfen", page: "Dachreparatur" },
];

const args = process.argv.slice(2);
const VERBOSE = args.includes("--verbose");

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

function inspect(html) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const descMatch = html.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i,
  );
  const h1s = html.match(/<h1[\s>]/gi) || [];
  const ldjson = html.match(/<script[^>]+type=["']application\/ld\+json["']/gi) || [];
  return {
    title: titleMatch ? decode(titleMatch[1]) : null,
    hasDesc: Boolean(descMatch && descMatch[1].trim()),
    desc: descMatch ? decode(descMatch[1]) : null,
    h1Count: h1s.length,
    ldCount: ldjson.length,
  };
}

// Pass-Kriterien aus §2. Auf "/" zählt der Title nicht: er ist identisch mit dem
// Fallback-Title aus client/index.html und beweist daher nichts.
function evaluate(route, found) {
  const checks = [
    {
      name: "title",
      ok: route.titleIsFallback ? null : found.title === route.title,
      detail: found.title ?? "(fehlt)",
    },
    { name: "description", ok: found.hasDesc, detail: found.hasDesc ? "vorhanden" : "(fehlt)" },
    { name: "h1", ok: found.h1Count === 1, detail: `${found.h1Count}x` },
    { name: "json-ld", ok: found.ldCount >= 1, detail: `${found.ldCount}x` },
  ];
  return { checks, pass: checks.every((c) => c.ok !== false) };
}

async function fetchAsBot(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function selfTest() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const shell = fs.readFileSync(
    path.join(__dirname, "..", "client", "index.html"),
    "utf8",
  );
  const shellResult = evaluate(ROUTES[1], inspect(shell));
  const good = `<html><head><title>${ROUTES[1].title}</title>
    <meta name="description" content="Beispiel">
    <script type="application/ld+json">{"@type":"Service"}</script>
    </head><body><h1>Dachsanierung Bochum</h1></body></html>`;
  const goodResult = evaluate(ROUTES[1], inspect(good));

  const shellOk = shellResult.pass === false;
  const goodOk = goodResult.pass === true;
  console.log(`Fallback-Shell wird als FAIL erkannt: ${shellOk ? "ok" : "FEHLER"}`);
  console.log(`Gerenderte Seite wird als PASS erkannt: ${goodOk ? "ok" : "FEHLER"}`);

  // Soll-Titles gegen den Quelltext halten. Ohne das meldet der Check nach jeder
  // Title-Änderung Fehlschläge, die keine sind — genau davor warnt §4.
  let drift = 0;
  for (const route of ROUTES) {
    const file = path.join(__dirname, "..", "client", "src", "pages", `${route.page}.tsx`);
    const src = fs.readFileSync(file, "utf8");
    const m = src.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const actual = m ? decode(m[1]) : "(kein <title>)";
    if (actual !== route.title) {
      drift++;
      console.log(`\nSoll-Title veraltet: ${route.path}`);
      console.log(`   Skript: ${route.title}`);
      console.log(`   Code  : ${actual}`);
    }
  }
  console.log(`Soll-Titles decken sich mit dem Quelltext: ${drift === 0 ? "ok" : `${drift} Abweichung(en)`}`);

  if (!shellOk || !goodOk || drift > 0) process.exit(1);
  console.log("\nErkennungslogik und Soll-Titles in Ordnung.");
}

async function main() {
  if (args.includes("--self-test")) return selfTest();

  console.log(`Prerender-Check Stufe 2 — ${ROUTES.length} Kern-URLs, User-Agent Googlebot\n`);
  let failed = 0;

  for (const route of ROUTES) {
    const url = BASE + route.path;
    let line;
    try {
      const found = inspect(await fetchAsBot(url));
      const { checks, pass } = evaluate(route, found);
      if (!pass) failed++;
      const parts = checks.map((c) => {
        const mark = c.ok === null ? "–" : c.ok ? "✓" : "✗";
        return `${mark} ${c.name}`;
      });
      line = `${pass ? "PASS" : "FAIL"}  ${route.path.padEnd(24)} ${parts.join("  ")}`;
      if (VERBOSE) {
        line += `\n        title: ${found.title ?? "(fehlt)"}`;
        line += `\n        desc : ${found.desc ?? "(fehlt)"}`;
      }
      if (route.titleIsFallback) {
        line += `\n        (Title auf "/" nicht bewertet — identisch mit dem Fallback aus index.html)`;
      }
    } catch (err) {
      failed++;
      line = `FAIL  ${route.path.padEnd(24)} Abruf fehlgeschlagen: ${err.message}`;
    }
    console.log(line);
  }

  console.log("");
  if (failed === 0) {
    console.log("Stufe 2 bestanden — alle Kern-URLs liefern gerendertes HTML an Googlebot.");
    console.log("Ergebnis als Zeile in PRERENDER-CHECK.md §6 eintragen.");
  } else {
    console.log(`${failed} von ${ROUTES.length} URLs fehlgeschlagen — Eskalation nach PRERENDER-CHECK.md §5.`);
    console.log("Ein Fehlschlag betrifft potenziell alle Routen, nicht nur die gemeldete.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unerwarteter Fehler:", err);
  process.exit(1);
});
