#!/usr/bin/env node
// IndexNow bulk submit — permanenter Post-Deploy-Schritt.
//
// Nach jedem funktionalen PRODUCTION-Deploy einmal ausführen:
//   npm run indexnow:submit
//
// Liest client/public/sitemap.xml, extrahiert alle indexierbaren URLs (ohne
// die noindex-Routen) und meldet sie in einem Bulk-POST an die IndexNow-API.
// Mit `--dry-run` wird nur die Payload ausgegeben, ohne zu senden.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HOST = "www.rex-bedachung.de";
const KEY = "5bc5e3a3ecc3b983c8f83a2095f8a299";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

// noindex / Disallow-Routen — nie submitten (fehlen ohnehin in der Sitemap).
const EXCLUDED_PATHS = ["/danke", "/datenschutz", "/impressum"];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sitemapPath = path.join(__dirname, "..", "client", "public", "sitemap.xml");

function extractUrls(xml) {
  const urls = [];
  const re = /<loc>\s*([^<\s]+)\s*<\/loc>/g;
  let m;
  while ((m = re.exec(xml)) !== null) urls.push(m[1].trim());

  const seen = new Set();
  return urls.filter((u) => {
    if (seen.has(u)) return false;
    seen.add(u);
    let pathname;
    try {
      pathname = new URL(u).pathname.replace(/\/+$/, "") || "/";
    } catch {
      return false;
    }
    return !EXCLUDED_PATHS.includes(pathname);
  });
}

const dryRun = process.argv.includes("--dry-run");
const urlList = extractUrls(fs.readFileSync(sitemapPath, "utf8"));

console.log(`IndexNow submit → host=${HOST}`);
console.log(`keyLocation: ${KEY_LOCATION}`);
console.log(`URLs to submit: ${urlList.length}`);

if (urlList.length === 0) {
  console.error("✗ Keine indexierbaren URLs in sitemap.xml gefunden — Abbruch.");
  process.exit(1);
}

const payload = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };

if (dryRun) {
  console.log("\n[dry-run] Es wird nichts gesendet. Payload:");
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

try {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  const body = await res.text().catch(() => "");
  if (res.ok || res.status === 202) {
    console.log(`✓ Erfolg — HTTP ${res.status} (${urlList.length} URLs gemeldet).`);
  } else {
    console.error(`✗ Fehlgeschlagen — HTTP ${res.status}: ${body}`);
    process.exit(1);
  }
} catch (err) {
  console.error(`✗ Request-Fehler: ${err.message}`);
  process.exit(1);
}
