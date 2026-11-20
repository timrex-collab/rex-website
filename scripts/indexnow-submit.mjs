#!/usr/bin/env node
// IndexNow submit — permanenter Post-Deploy-Schritt.
//
// Zwei Betriebsarten:
//   npm run indexnow:submit
//     meldet alle indexierbaren Sitemap-URLs (manueller Fallback, z. B. über
//     „Run workflow“ in der Actions-UI).
//   node scripts/indexnow-submit.mjs --changed-since <git-ref>
//     meldet nur URLs, deren <lastmod> sich gegenüber <git-ref> geändert hat oder
//     die neu in der Sitemap stehen. So läuft es nach jedem Push auf main
//     (indexnow.yml, <git-ref> = Stand vor dem Push). Ohne Änderung wird nichts
//     gesendet; Doku-PRs lösen damit keine Meldung mehr aus (Paket S2).
//     Lässt sich der alte Stand nicht lesen, werden alle URLs gemeldet.
//
// Liest client/public/sitemap.xml und lässt die noindex-Routen weg.
// Mit `--dry-run` wird nur die Payload ausgegeben, ohne zu senden.

import { execFileSync } from "node:child_process";
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
const repoRoot = path.join(__dirname, "..");
const SITEMAP_REL = "client/public/sitemap.xml";
const sitemapPath = path.join(repoRoot, SITEMAP_REL);

// URL -> lastmod ("" ohne Angabe), in Sitemap-Reihenfolge, ohne Dubletten und noindex-Routen.
function extractEntries(xml) {
  const entries = new Map();
  const re = /<url>([\s\S]*?)<\/url>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const loc = /<loc>\s*([^<\s]+)\s*<\/loc>/.exec(m[1]);
    if (!loc) continue;
    const u = loc[1].trim();
    if (entries.has(u)) continue;
    let pathname;
    try {
      pathname = new URL(u).pathname.replace(/\/+$/, "") || "/";
    } catch {
      continue;
    }
    if (EXCLUDED_PATHS.includes(pathname)) continue;
    const lastmod = /<lastmod>\s*([^<\s]+)\s*<\/lastmod>/.exec(m[1]);
    entries.set(u, lastmod ? lastmod[1] : "");
  }
  return entries;
}

function readSitemapAt(ref) {
  if (!ref || /^0+$/.test(ref)) return null;
  try {
    return execFileSync("git", ["show", `${ref}:${SITEMAP_REL}`], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch {
    return null;
  }
}

const argv = process.argv.slice(2);
const sinceIdx = argv.indexOf("--changed-since");
const sinceRef = sinceIdx >= 0 ? argv[sinceIdx + 1] : undefined;
if (sinceIdx >= 0 && (!sinceRef || sinceRef.startsWith("--"))) {
  console.error("✗ --changed-since braucht einen Git-Stand (Commit, Branch oder Tag).");
  process.exit(1);
}

const current = extractEntries(fs.readFileSync(sitemapPath, "utf8"));
let urlList = [...current.keys()];

console.log(`IndexNow submit → host=${HOST}`);
console.log(`keyLocation: ${KEY_LOCATION}`);

if (urlList.length === 0) {
  console.error("✗ Keine indexierbaren URLs in sitemap.xml gefunden — Abbruch.");
  process.exit(1);
}

if (sinceIdx >= 0) {
  const oldXml = readSitemapAt(sinceRef);
  if (oldXml === null) {
    console.log(`Stand ${sinceRef} nicht lesbar — melde alle ${urlList.length} URLs.`);
  } else {
    const previous = extractEntries(oldXml);
    urlList = urlList.filter((u) => previous.get(u) !== current.get(u));
    console.log(`Geänderte lastmod-Werte seit ${sinceRef.slice(0, 12)}: ${urlList.length}`);
    if (urlList.length === 0) {
      console.log("✓ Keine geänderten Seiten — nichts zu melden.");
      process.exit(0);
    }
  }
}

console.log(`URLs to submit: ${urlList.length}`);

const dryRun = argv.includes("--dry-run");

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
