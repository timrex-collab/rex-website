#!/usr/bin/env node
// FAQPage-Drift-Check — prüft die Schema-Konvention aus DEPLOY-RULES.md §7.
//
//   npm run faq:check          Bericht über alle Seiten mit FAQPage-Schema
//   npm run faq:check -- -v    zusätzlich je Seite die Fundstellen
//   npm run faq:check -- --self-test   prüft die Erkennungslogik gegen
//                              synthetische Fälle (muss "Selbsttest bestanden" melden)
//
// Hintergrund: Google verlangt, dass ausgezeichneter Frage- und Antworttext auf
// der Seite sichtbar ist. Ein hartcodiertes FAQPage-Schema driftet zwangsläufig
// vom sichtbaren Text weg — genau das hat GSC-AUDIT-2026-08.md §8.1 gemessen.
// Die Konvention lautet deshalb: mainEntity IMMER aus dem Array erzeugen, das
// die Seite auch rendert.
//
// Der Check erkennt das strukturell, nicht am Namen: das Prüfskript des Audits
// hatte auf den Literalnamen "faqItems.map" getestet und VeluxPreisrechnerBochum
// (Array heißt dort faqData) fälschlich als hartcodiert gemeldet. Hier wird der
// Bezeichner aus dem mainEntity-Ausdruck gelesen und dagegen gehalten, ob
// dasselbe Array im JSX gerendert wird.
//
// Exit 1, sobald eine Seite ihr Schema hartcodiert oder über ein Array erzeugt,
// das die Seite nicht rendert.

import fs from "node:fs";
import path from "node:path";

const PAGES_DIR = path.join("client", "src", "pages");
const COMPONENTS_DIR = path.join("client", "src", "components");

const args = process.argv.slice(2);
const VERBOSE = args.includes("-v") || args.includes("--verbose");
const SELF_TEST = args.includes("--self-test");

// Schneidet ab einer öffnenden Klammer den balancierten Block heraus.
// Strings werden übersprungen, damit Klammern im Text nicht zählen.
function sliceBalanced(src, start) {
  const open = src[start];
  const close = { "[": "]", "{": "}", "(": ")" }[open];
  let depth = 0;
  let inStr = null;
  for (let i = start; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === "\\") i++;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") inStr = c;
    else if (c === open) depth++;
    else if (c === close && --depth === 0) return src.slice(start, i + 1);
  }
  throw new Error("unbalancierte Klammer");
}

const norm = (s) => s.replace(/\s+/g, " ").trim();

// Liest ein Array von { question, answer } bzw. { q, a } aus dem Quelltext.
function readVisibleItems(src, ident) {
  const decl = new RegExp(`const\\s+${ident}\\s*(?::[^=]+)?=\\s*\\[`).exec(src);
  if (!decl) return null;
  const literal = sliceBalanced(src, src.indexOf("[", decl.index));
  let parsed;
  try {
    parsed = eval(`(${literal})`);
  } catch {
    return null;
  }
  const flat = parsed.flatMap((entry) =>
    Array.isArray(entry?.items) ? entry.items : Array.isArray(entry?.questions) ? entry.questions : [entry],
  );
  return flat
    .map((i) => ({
      question: i?.question ?? i?.q ?? i?.frage,
      answer: i?.answer ?? i?.a ?? i?.antwort,
    }))
    .filter((i) => typeof i.question === "string" && typeof i.answer === "string");
}

// Findet den mainEntity-Ausdruck des FAQPage-Blocks.
function readFaqSchema(src) {
  const faq = src.search(/"@type":\s*"FAQPage"/);
  if (faq < 0) return null;
  const me = src.indexOf("mainEntity", faq);
  if (me < 0) return null;
  const colon = src.indexOf(":", me);
  const rest = src.slice(colon + 1);
  const offset = colon + 1 + (rest.length - rest.trimStart().length);
  if (src[offset] === "[") return { kind: "hardcoded", literal: sliceBalanced(src, offset) };
  const call = /^([A-Za-z_$][\w$]*)\s*\.\s*(map|flatMap)\s*\(/.exec(src.slice(offset));
  if (call) return { kind: "generated", ident: call[1] };
  return { kind: "unbekannt", snippet: norm(src.slice(offset, offset + 60)) };
}

// Wird dasselbe Array auch gerendert? Der Render-Aufruf steht im JSX der Komponente.
function isRendered(src, ident) {
  const body = src.slice(Math.max(0, src.search(/export default function/)));
  return new RegExp(`\\{\\s*${ident}\\s*\\.\\s*(map|flatMap|filter|slice)`).test(body);
}

function checkFile(file) {
  const src = fs.readFileSync(file, "utf8");
  const name = path.basename(file);
  const schema = readFaqSchema(src);
  if (!schema) return null;

  if (schema.kind === "generated") {
    const rendered = isRendered(src, schema.ident);
    return {
      name,
      pass: rendered,
      detail: rendered
        ? `Schema aus ${schema.ident} erzeugt und gerendert`
        : `Schema aus ${schema.ident} erzeugt — dieses Array wird aber nicht gerendert`,
    };
  }

  if (schema.kind === "unbekannt") {
    return { name, pass: false, detail: `mainEntity nicht auswertbar: ${schema.snippet}` };
  }

  // Hartcodiert — gegen den sichtbaren Text messen.
  let entries;
  try {
    entries = eval(`(${schema.literal})`);
  } catch {
    return { name, pass: false, detail: "mainEntity hartcodiert (nicht parsebar)" };
  }
  const candidates = ["faqItems", "faqData", "faqs", "faqCategories", "faqEintraege"];
  const visible = candidates.map((c) => readVisibleItems(src, c)).find(Boolean) ?? [];
  const byQuestion = new Map(visible.map((i) => [norm(i.question), norm(i.answer)]));
  const missing = [];
  const paraphrased = [];
  let exact = 0;
  for (const e of entries) {
    const q = norm(e?.name ?? "");
    const a = norm(e?.acceptedAnswer?.text ?? "");
    if (!byQuestion.has(q)) missing.push(q);
    else if (byQuestion.get(q) === a) exact++;
    else paraphrased.push(q);
  }
  return {
    name,
    pass: false,
    detail:
      `mainEntity hartcodiert — ${entries.length} Einträge, ${visible.length} sichtbar · ` +
      `${missing.length} Frage(n) nicht auf der Seite (harter Verstoß) · ` +
      `${exact} wortgleich · ${paraphrased.length} paraphrasiert (weicher Verstoß)`,
    missing,
    paraphrased,
  };
}

function selfTest() {
  const tmp = path.join(process.cwd(), ".faq-check-selftest.tsx");
  const hardcoded = `const faqItems = [
  { question: "Frage A?", answer: "Antwort A." },
];
const faqSchema = JSON.stringify({
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Frage B?", "acceptedAnswer": { "@type": "Answer", "text": "Antwort B." } }
  ],
});
export default function X() { return <>{faqItems.map((i) => i.question)}</>; }`;
  const generated = `const faqData = [
  { q: "Frage A?", a: "Antwort A." },
];
const faqSchema = JSON.stringify({
  "@type": "FAQPage",
  mainEntity: faqData.map((f) => ({ "@type": "Question", name: f.q })),
});
export default function X() { return <>{faqData.map((i) => i.q)}</>; }`;
  const orphan = generated.replace("{faqData.map((i) => i.q)}", "{null}");

  const cases = [
    ["hartcodiert", hardcoded, false],
    ["generiert (Array heißt faqData, nicht faqItems)", generated, true],
    ["generiert, aber nicht gerendert", orphan, false],
  ];
  let ok = true;
  for (const [label, source, expected] of cases) {
    fs.writeFileSync(tmp, source, "utf8");
    const result = checkFile(tmp);
    const got = result?.pass ?? null;
    const good = got === expected;
    ok &&= good;
    console.log(`${good ? "ok  " : "FEHL"}  ${label} → ${got === true ? "PASS" : "FAIL"} (erwartet ${expected ? "PASS" : "FAIL"})`);
    if (!good && result) console.log(`        ${result.detail}`);
  }
  fs.unlinkSync(tmp);
  console.log("");
  if (!ok) {
    console.log("Selbsttest fehlgeschlagen — die Erkennungslogik stimmt nicht mehr.");
    process.exit(1);
  }
  console.log("Selbsttest bestanden.");
}

if (SELF_TEST) {
  selfTest();
} else {
  const files = [PAGES_DIR, COMPONENTS_DIR]
    .filter((dir) => fs.existsSync(dir))
    .flatMap((dir) => fs.readdirSync(dir).filter((f) => f.endsWith(".tsx")).map((f) => path.join(dir, f)))
    .sort();

  const results = files.map(checkFile).filter(Boolean);
  const failed = results.filter((r) => !r.pass);

  for (const r of results) {
    console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name.padEnd(32)} ${r.detail}`);
    if (VERBOSE || !r.pass) {
      (r.missing ?? []).forEach((q) => console.log(`        ✗ nicht auf der Seite: ${q}`));
      if (VERBOSE) (r.paraphrased ?? []).forEach((q) => console.log(`        ~ paraphrasiert: ${q}`));
    }
  }

  console.log("");
  console.log(`${results.length} Seite(n) mit FAQPage-Schema, ${failed.length} beanstandet.`);
  if (failed.length > 0) {
    console.log("Fix: mainEntity aus dem gerenderten Array erzeugen (DEPLOY-RULES.md §7).");
    process.exit(1);
  }
  console.log("Keine Drift — jedes FAQPage-Schema stammt aus dem sichtbaren Text.");
}
