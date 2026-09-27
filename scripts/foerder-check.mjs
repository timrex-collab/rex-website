#!/usr/bin/env node
// Förder-Drift-Check — findet Förderaussagen, die der zentralen Logik in
// client/src/lib/velux widersprechen oder in den Audits vom 17.09./21.09.2026
// als falsch belegt wurden.
//
//   npm run foerder:check                 Bericht über Seiten, Komponenten und llms-Dateien
//   npm run foerder:check -- --self-test  prüft die Regeln gegen synthetische Fälle
//                                         (muss "Selbsttest bestanden" melden)
//
// Geprüft wird zeilenweise gegen bekannte Falschformulierungen. Das ist bewusst
// kein Sprachverständnis: Jede Regel steht für einen konkreten, belegten Befund
// (R1–R3, PR #81–#83). Eine neue Regel braucht einen Fall im Selbsttest.
//
// Exit 1, sobald eine Regel anschlägt.

import fs from "node:fs";
import path from "node:path";

const TARGETS = [
  path.join("client", "src", "pages"),
  path.join("client", "src", "components"),
  path.join("client", "public", "llms.txt"),
  path.join("client", "public", "llms-full.txt"),
];

const SELF_TEST = process.argv.slice(2).includes("--self-test");

/** Jede Regel: id, Begründung, test(line) → true bei Verstoß. */
const RULES = [
  {
    id: "35c-kombiniert",
    why: "BEG-Zuschuss und §35c sind für dieselbe Maßnahme nicht kombinierbar (§35c Abs. 3 EStG)",
    test: (l) => /35\s?c/.test(l) && /(lassen sich (alle )?nutzen|in Anspruch nehmen|kombinier)/i.test(l)
      && !/(nicht (für dieselbe Maßnahme )?kombinierbar|nicht beides|nicht für dieselbe|nicht parallel|nicht .{0,30}kombinierbar|Alternativ)/i.test(l),
  },
  {
    id: "35c-empfehlung",
    why: "Rechner und Seiten stellen beide Wege gleichrangig und ohne Empfehlung dar",
    test: (l) => /(35\s?c|BEG|BAFA)/.test(l) && /(der|die) (bessere|stärkere) (Weg|Option|Variante)|meist günstiger|rechnerisch (oft|häufig|meist)/i.test(l),
  },
  {
    id: "35c-alter",
    why: "§35c: Gebäude älter als 10 Jahre, nicht „mindestens“ oder „ab“ 10 Jahre",
    test: (l) => /\b(mindestens|ab) 10 Jahren?\b/i.test(l) && /(35\s?c|Gebäudealter|Gebäude)/i.test(l),
  },
  {
    id: "beg-baujahr",
    why: "BEG EM setzt mindestens 5 Jahre seit Bauantrag/Bauanzeige voraus",
    test: (l) => /unabhängig vom Baujahr/i.test(l),
  },
  {
    id: "vertrag-genehmigung",
    why: "Vor dem Antrag ist ein Vertrag mit Förderbedingung zulässig; eine Genehmigung muss nicht abgewartet werden",
    test: (l) => /(gestellt und genehmigt|bevor der (Förder)?antrag genehmigt|erst Antrag,? dann Auftrag|vor jeder Vertragsunterschrift)/i.test(l),
  },
  {
    id: "beg-hoechstbetrag-je-we",
    why: "Höchstbeträge 30.000/60.000 € bzw. 4.500/10.500 € gelten für die erste Wohneinheit",
    test: (l) => /\b(10\.500|4\.500|60\.000|30\.000)\s?(€|\\u20AC|EUR)[^.;]{0,50}\b(je|pro) Wohneinheit\b/i.test(l),
  },
  {
    id: "kfw-tilgungszuschuss",
    why: "Der Ergänzungskredit 358/359 hat keinen Tilgungszuschuss",
    test: (l) => /Tilgungszuschuss/i.test(l) && /(358|359|Ergänzungskredit)/.test(l),
  },
  {
    id: "beg-ueber-kfw",
    why: "Der BEG-EM-Zuschuss für die Gebäudehülle läuft über das BAFA, nicht über KfW/Hausbank",
    test: (l) => /KfW-BEG/.test(l),
  },
  {
    id: "neubauprogramm",
    why: "KfW 297/298 ist ein Neubauprogramm und passt nicht zu Sanierungsleistungen",
    test: (l) => /297\s?\/\s?298/.test(l),
  },
  {
    id: "richtlinie-entwurf",
    why: "Maßgeblich ist die Richtlinie BEG EM vom 17.08.2026 (BAnz AT 27.08.2026 B1)",
    test: (l) => /Richtlinie[^.]{0,40}17\.07\.2026/.test(l),
  },
  {
    id: "geg",
    why: "Seit 29.07.2026 gilt das GModG; GEG nur als „vormals“ oder „Nachfolger“ im selben Satz",
    test: (l) => /\bGEG\b/.test(l) && !/(GModG|Gebäudemodernisierungsgesetz)/.test(l),
  },
  {
    id: "pdf-anhang",
    why: "Das PDF gibt es erst nach bestätigtem Versand, der Ersatzweg hat keinen Anhang",
    test: (l) => /PDF (ist )?beigef/i.test(l),
  },
];

function* files(target) {
  if (!fs.existsSync(target)) return;
  const st = fs.statSync(target);
  if (st.isFile()) { yield target; return; }
  for (const name of fs.readdirSync(target).sort()) {
    const p = path.join(target, name);
    if (fs.statSync(p).isDirectory()) yield* files(p);
    else if (/\.(tsx?|txt)$/.test(name)) yield p;
  }
}

function scan(text) {
  const hits = [];
  text.split("\n").forEach((line, i) => {
    for (const r of RULES) if (r.test(line)) hits.push({ rule: r, line: i + 1, text: line.trim() });
  });
  return hits;
}

if (SELF_TEST) {
  const cases = [
    ["35c-kombiniert", "Die BAFA-Förderung, der KfW-Kredit sowie der Steuerbonus nach § 35c EStG lassen sich nutzen.", true],
    ["35c-kombiniert", "Alternativ zum BAFA-Zuschuss kommt § 35c in Frage – für dieselbe Maßnahme nicht beides.", false],
    ["35c-kombiniert", "Beide Wege sind nicht für dieselbe Maßnahme kombinierbar (§35c).", false],
    ["35c-empfehlung", "bei einem reinen Fenstertausch ist oft § 35c der bessere Weg", true],
    ["35c-empfehlung", "Welcher Weg günstiger ist, hängt vom Einzelfall ab.", false],
    ["35c-empfehlung", "Vorteil Aufdach: höhere Leistung und meist günstiger.", false],
    ["35c-alter", "§35c: Gebäude mindestens 10 Jahre alt", true],
    ["35c-alter", "§35c: Gebäude älter als 10 Jahre", false],
    ["beg-baujahr", "gilt für Wohngebäude unabhängig vom Baujahr", true],
    ["vertrag-genehmigung", "Der Förderantrag muss vor der Auftragserteilung gestellt und genehmigt sein.", true],
    ["vertrag-genehmigung", "Vor dem Antrag nur einen Vertrag mit Förderbedingung unterschreiben.", false],
    ["beg-hoechstbetrag-je-we", "Maximaler Zuschuss: 4.500 € bzw. 10.500 € pro Wohneinheit und Jahr", true],
    ["beg-hoechstbetrag-je-we", "Darlehen bis 120.000 € pro Wohneinheit", false],
    ["beg-hoechstbetrag-je-we", "bis zu 10.500 € für die erste Wohneinheit", false],
    ["kfw-tilgungszuschuss", "Ergänzungskredit 358/359 mit Tilgungszuschuss", true],
    ["kfw-tilgungszuschuss", "BEG WG über die KfW mit Tilgungszuschüssen", false],
    ["beg-ueber-kfw", "im Rahmen der KfW-BEG förderrelevant", true],
    ["neubauprogramm", "über das KfW-Programm 297/298 (Klimafreundlicher Neubau)", true],
    ["richtlinie-entwurf", "Richtlinie BEG EM vom 17.07.2026", true],
    ["richtlinie-entwurf", "Richtlinie BEG EM vom 17.08.2026", false],
    ["geg", "GEG-Mindest: 0,20", true],
    ["geg", "Gebäudemodernisierungsgesetz (GModG, vormals GEG)", false],
    ["geg", "Das Gebäudemodernisierungsgesetz, seit Juli 2026 Nachfolger des GEG", false],
    ["pdf-anhang", "Die detaillierte Kostenschaetzung ist als PDF beigefuegt.", true],
  ];
  let bad = 0;
  for (const [id, line, expect] of cases) {
    const got = RULES.find((r) => r.id === id).test(line);
    if (got !== expect) { bad++; console.error(`✗ ${id}: erwartet ${expect ? "Treffer" : "kein Treffer"} – „${line}“`); }
  }
  const missing = RULES.filter((r) => !cases.some(([id, , e]) => id === r.id && e));
  for (const r of missing) { bad++; console.error(`✗ Regel ${r.id} ohne positiven Selbsttest-Fall`); }
  if (bad) { console.error(`\n${bad} Selbsttest-Fehler.`); process.exit(1); }
  console.log(`${cases.length} Fälle, ${RULES.length} Regeln.\nSelbsttest bestanden.`);
  process.exit(0);
}

let total = 0;
let count = 0;
for (const t of TARGETS) for (const f of files(t)) {
  count++;
  for (const h of scan(fs.readFileSync(f, "utf8"))) {
    total++;
    console.log(`FAIL  ${f}:${h.line}  [${h.rule.id}] ${h.rule.why}\n      ${h.text.slice(0, 180)}`);
  }
}
console.log(`\n${count} Datei(en) geprüft, ${total} Verstoß/Verstöße.`);
if (total) {
  console.log("Förderaussagen weichen von der zentralen Logik ab (client/src/lib/velux).");
  process.exit(1);
}
console.log("Keine Förder-Drift gefunden.");
