// @ts-nocheck
import { useState, useCallback } from "react";
import { ChevronRight, ChevronLeft, Calculator, Home, Sun, Phone, Mail, Check, Info, ArrowRight, Shield, Droplets, Eye, Plus, Trash2, User, FileDown } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════
   PRICE DATA — VELUX UVP 2026 (alle Preise netto)
   ═══════════════════════════════════════════════════════════════════════ */

const DIMS = {CK02:"55×78",CK04:"55×98",CK06:"55×118",FK04:"66×98",FK06:"66×118",FK08:"66×140",MK04:"78×98",MK06:"78×118",MK08:"78×140",MK10:"78×160",PK06:"94×118",PK08:"94×140",PK10:"94×160",SK06:"114×118",SK08:"114×140",SK10:"114×160",UK04:"134×98",UK08:"134×140",UK10:"134×160"};

const WINDOWS = {
  GGU:{name:"Kunststoff-Schwingfenster",short:"Kunststoff Schwing",desc:"Feuchtraumgeeignet, pflegeleicht",icon:"droplets",prices:{CK02:{T:536,E:554,P:670},CK04:{T:579,E:608,P:747},CK06:{T:601,E:643,P:802},FK04:{T:601,E:643,P:802},FK06:{T:679,E:733,P:921},FK08:{T:715,E:785,P:1000},MK04:{T:651,E:704,P:886},MK06:{T:715,E:785,P:1000},MK08:{T:772,E:861,P:1110},MK10:{T:865,E:969,P:1253},PK06:{T:801,E:890,P:1145},PK08:{T:872,E:985,P:1282},PK10:{T:951,E:1083,P:1419},SK06:{T:894,E:1007,P:1309},SK08:{T:965,E:1107,P:1458},SK10:{T:1051,E:1217,P:1615},UK04:{T:894,E:1003,P:1300},UK08:{T:1058,E:1231,P:1638},UK10:{T:1230,E:1426,P:1893}}},
  GGL:{name:"Holz-Schwingfenster",short:"Holz Schwing",desc:"Natürliches Holz, weiß/klar lackiert",icon:"home",prices:{CK02:{T:413,E:440,P:546},CK04:{T:446,E:480,P:613},CK06:{T:462,E:515,P:664},FK04:{T:462,E:515,P:613},FK06:{T:523,E:589,P:765},FK08:{T:551,E:620,P:836},MK04:{T:501,E:566,P:737},MK06:{T:551,E:633,P:836},MK08:{T:595,E:697,P:932},MK10:{T:666,E:785,P:1050},PK06:{T:617,E:720,P:961},PK08:{T:672,E:780,P:1081},PK10:{T:732,E:881,P:1200},SK06:{T:688,E:817,P:1104},SK08:{T:743,E:902,P:1236},SK10:{T:809,E:994,P:1374},UK04:{T:688,E:813,P:1094},UK08:{T:815,E:1006,P:1395},UK10:{T:947,E:1164,P:1610}}},
  GPU:{name:"Kunststoff-Klapp-Schwingfenster",short:"Kunststoff Klapp-Schwing",desc:"Panoramablick, feuchtraumgeeignet",icon:"eye",prices:{CK04:{T:855,E:864,P:1023},CK06:{T:877,E:899,P:1078},FK06:{T:955,E:989,P:1197},FK08:{T:991,E:1041,P:1276},MK04:{T:927,E:960,P:1162},MK06:{T:991,E:1041,P:1276},MK08:{T:1048,E:1117,P:1386},MK10:{T:1141,E:1225,P:1529},PK06:{T:1077,E:1146,P:1421},PK08:{T:1148,E:1241,P:1558},PK10:{T:1227,E:1339,P:1695},SK06:{T:1170,E:1263,P:1585},SK08:{T:1241,E:1363,P:1734},SK10:{T:1327,E:1473,P:1891},UK08:{T:1334,E:1487,P:1914}}},
  GPL:{name:"Holz-Klapp-Schwingfenster",short:"Holz Klapp-Schwing",desc:"Panoramablick, natürliches Holz",icon:"sun",prices:{CK04:{T:722,E:741,P:889},CK06:{T:738,E:771,P:940},FK06:{T:799,E:845,P:1041},FK08:{T:827,E:889,P:1112},MK04:{T:777,E:850,P:1013},MK06:{T:827,E:889,P:1112},MK08:{T:871,E:953,P:1208},MK10:{T:942,E:1041,P:1330},PK06:{T:893,E:976,P:1237},PK08:{T:948,E:1055,P:1357},PK10:{T:1008,E:1137,P:1476},SK06:{T:964,E:1073,P:1380},SK08:{T:1019,E:1158,P:1512},SK10:{T:1085,E:1250,P:1650},UK04:{T:964,E:1050,P:1370},UK08:{T:1091,E:1262,P:1671}}}
};

const EDW = {CK02:136,CK04:144,CK06:149,FK04:149,FK06:163,FK08:168,MK04:159,MK06:168,MK08:176,MK10:201,PK06:191,PK08:201,PK10:213,SK06:201,SK08:206,SK10:228,UK04:201,UK08:218,UK10:243};

const SHUTTERS = {
  SSL:{name:"Solar-Rollladen",short:"SSL Solar",prices:{CK02:611,CK04:632,CK06:647,FK04:658,FK06:684,FK08:689,MK04:679,MK06:705,MK08:731,MK10:773,PK06:752,PK08:783,PK10:825,SK06:804,SK08:841,SK10:878,UK04:851,UK08:904,UK10:946}},
  SML:{name:"Elektro-Rollladen",short:"SML Elektro",prices:{CK02:429,CK04:450,CK06:465,FK04:476,FK06:502,FK08:507,MK04:497,MK06:523,MK08:549,MK10:591,PK06:570,PK08:601,PK10:643,SK06:622,SK08:659,SK10:696,UK04:669,UK08:722,UK10:764}}
};

const BLINDS = {
  DKL:{name:"Verdunkelungsrollo manuell",short:"DKL Manuell",prices:{CK02:80,CK04:91,CK06:101,FK04:100,FK06:111,FK08:114,MK04:105,MK06:114,MK08:117,MK10:124,PK06:122,PK08:131,PK10:143,SK06:138,SK08:146,SK10:164,UK04:146,UK08:158,UK10:176}},
  DSL:{name:"Verdunkelungsrollo solar",short:"DSL Solar",prices:{CK02:186,CK04:198,CK06:208,FK04:207,FK06:217,FK08:223,MK04:211,MK06:220,MK08:223,MK10:248,PK06:228,PK08:237,PK10:248,SK06:244,SK08:251,SK10:269,UK04:251,UK08:264,UK10:270}}
};

const LABOR = { demontage:100, einbau:300, eindeckrahmen:150, rollladen:120, rollo:50 };
const GL = { T:{l:"THERMO",code:"-70",uw:"1,3"},E:{l:"ENERGIE PLUS",code:"-66",uw:"1,0"},P:{l:"WÄRMEDÄMMUNG",code:"-67",uw:"0,88"} };
const fmt = (n) => new Intl.NumberFormat("de-DE").format(n);
let _id = 0;
const uid = () => ++_id;

const emptyPos = () => ({id:uid(),model:"",size:"",glazing:"",qty:1,shutter:"none",shutterQty:0,blind:"none",blindQty:0});

/* ═══════════════════════════════════════════════════════════════════════
   PDF GENERATION
   ═══════════════════════════════════════════════════════════════════════ */

function buildPdfHtml(details, totals, foerderung, kunde) {
  const today = new Date().toLocaleDateString("de-DE", {day:"2-digit",month:"2-digit",year:"numeric"});

  const posRows = details.map((d, i) => {
    const matLines = [
      `${d.qty}× ${d.model} ${d.size} ${GL[d.glazing].l} (UVP)|${fmt(d.wp)} € / Stk.`,
      `${d.qty}× EDW 2000 Eindeckrahmen Ziegel h/W|${fmt(d.edw)} € / Stk.`,
      d.shutterQty > 0 ? `${d.shutterQty}× ${SHUTTERS[d.shutter].name} (UVP)|${fmt(d.sp)} € / Stk.` : null,
      d.blindQty > 0 ? `${d.blindQty}× ${BLINDS[d.blind].name} Weiß (UVP)|${fmt(d.bp)} € / Stk.` : null,
    ].filter(Boolean);

    const labLines = [
      `${d.qty}× Demontage Altfenster/Erstellung Dachöffnung|ab ${fmt(LABOR.demontage)} €`,
      `${d.qty}× Fenstereinbau|ab ${fmt(LABOR.einbau)} €`,
      `${d.qty}× Eindeckrahmen-Montage|ab ${fmt(LABOR.eindeckrahmen)} €`,
      d.shutterQty > 0 ? `${d.shutterQty}× Rollladen-Montage|ab ${fmt(LABOR.rollladen)} €` : null,
      d.blindQty > 0 ? `${d.blindQty}× Rollo-Montage|ab ${fmt(LABOR.rollo)} €` : null,
    ].filter(Boolean);

    return `
      <tr class="pos-header"><td colspan="2"><strong>Position ${i+1}: ${d.qty}× ${d.model} ${d.size} (${DIMS[d.size]} cm) — ${GL[d.glazing].l}${d.shutterQty>0?` + ${d.shutterQty}× ${SHUTTERS[d.shutter].short}`:""}${d.blindQty>0?` + ${d.blindQty}× ${BLINDS[d.blind].short}`:""}</strong></td></tr>
      <tr class="sub-header"><td colspan="2">Material</td></tr>
      ${matLines.map(l=>{const[a,b]=l.split("|");return`<tr><td>${a}</td><td class="r">${b}</td></tr>`;}).join("")}
      <tr class="subtotal"><td>Material Position ${i+1}</td><td class="r">${fmt(d.matPos)} €</td></tr>
      <tr class="sub-header"><td colspan="2">Einbau</td></tr>
      ${labLines.map(l=>{const[a,b]=l.split("|");return`<tr><td>${a}</td><td class="r">${b}</td></tr>`;}).join("")}
      <tr class="subtotal"><td>Einbau Position ${i+1}</td><td class="r">ab ${fmt(d.labPos)} €</td></tr>`;
  }).join("");

  const foerderSection = totals.eligible && totals.bafaFoerder > 0 ? `
    <div class="foerder-box">
      <h3>BAFA-Förderung (BEG Einzelmaßnahme)</h3>
      <table>
        <tr><td>Förderfähige Kosten (brutto)</td><td class="r"><strong>${fmt(totals.foerderBrutto)} €</strong></td></tr>
        ${totals.foerderBrutto>totals.bafaMaxBrutto?`<tr class="muted"><td>Förderhöchstbetrag pro WE/Jahr</td><td class="r">${fmt(totals.bafaMaxBrutto)} €</td></tr>`:""}
        <tr><td>Fördersatz</td><td class="r"><strong>${totals.hasIsfp?"20% (15% + 5% iSFP-Bonus)":"15%"}</strong></td></tr>
        <tr><td><strong>Geschätzter BAFA-Zuschuss</strong></td><td class="r foerder-amount">− ${fmt(totals.bafaFoerder)} €</td></tr>
      </table>
      <p class="small" style="margin-top:8px"><strong>KfW Ergänzungskredit 358/359:</strong> Nach BAFA-Zusage ist zusätzlich ein zinsvergünstigter Kredit bis 120.000 € pro WE möglich.</p>
      <p class="small"><strong>Fachplanung:</strong> 50% Zuschuss für den Energieeffizienz-Experten (bis 5.000 € bei EFH) — separater Fördertopf.</p>
      ${!totals.hasIsfp?`<p class="small"><strong>Tipp:</strong> Mit einem iSFP (Eigenanteil ca. 400–500 €) steigt der Fördersatz auf 20% und der Höchstbetrag auf 60.000 €.</p>`:""}
      ${totals.hasIneligible?`<p class="small" style="color:#92400e"><strong>Hinweis:</strong> Positionen mit THERMO-Verglasung (Uw 1,3) sind nicht förderrelevant. Die BEG-Förderung erfordert Uw ≤ 1,0 W/m²K.</p>`:""}
      <table class="total-table" style="margin-top:10px;border-top:1px solid #a7f3d0;padding-top:8px">
        <tr><td>Gesamtkosten brutto (inkl. MwSt.)</td><td class="r">${fmt(totals.totalBrutto)} €</td></tr>
        <tr><td>BAFA-Zuschuss</td><td class="r"><strong>− ${fmt(totals.bafaFoerder)} €</strong></td></tr>
        <tr><td><strong>Ihre tatsächliche Investition</strong></td><td class="r"><strong>ab ${fmt(totals.investitionBrutto)} €</strong></td></tr>
      </table>
    </div>
    ${!totals.hasIsfp&&totals.steuerBonus>0?`
    <div class="foerder-box" style="background:#eff6ff;border-color:#bfdbfe;margin-top:12px">
      <h3 style="color:#1d4ed8">Empfehlung: Steuerbonus §35c EStG</h3>
      <p style="font-size:10px;color:#1e40af;margin-bottom:8px">Ohne Energieberater und iSFP ist der Steuerbonus oft die bessere Wahl: <strong>20% Steuerermäßigung</strong> — 5 Prozentpunkte mehr als BAFA ohne iSFP. Kein Energieeffizienz-Experte nötig, weniger Aufwand.</p>
      <table>
        <tr><td>Steuerermäßigung gesamt (20%)</td><td class="r"><strong>${fmt(totals.steuerBonus)} €</strong></td></tr>
        <tr class="muted"><td>Jahr 1 (7%) / Jahr 2 (7%) / Jahr 3 (6%)</td><td class="r">${fmt(totals.steuerJahr1)} / ${fmt(totals.steuerJahr2)} / ${fmt(totals.steuerJahr3)} €</td></tr>
        <tr><td><strong>Effektive Investition mit Steuerbonus</strong></td><td class="r"><strong>ab ${fmt(totals.investitionSteuer)} €</strong></td></tr>
      </table>
      <p class="small" style="margin-top:6px;color:#1e40af"><strong>Voraussetzungen:</strong> Selbstgenutztes Wohneigentum, Gebäude ≥ 10 Jahre alt, Fachunternehmen. Nicht kombinierbar mit BAFA für dieselbe Maßnahme.</p>
    </div>`:""}` : totals.eligible ? `
    <div class="foerder-box" style="background:#f8fafc;border-color:#e2e8f0">
      <p style="font-size:10px;color:#475569">Keine förderrelevanten Positionen vorhanden. Für die BEG-Förderung (BEG EM) ist eine Verglasung mit Uw ≤ 1,0 W/m²K erforderlich (ENERGIE PLUS oder WÄRMEDÄMMUNG).</p>
    </div>` : "";

  const kundeSection = kunde.name ? `
    <div class="kunde-box">
      <h3>Kontaktdaten</h3>
      <table>
        <tr><td>Name</td><td>${kunde.name}</td></tr>
        ${kunde.strasse?`<tr><td>Adresse</td><td>${kunde.strasse}${kunde.plz||kunde.ort?`, ${kunde.plz} ${kunde.ort}`:""}</td></tr>`:""}
        ${kunde.email?`<tr><td>E-Mail</td><td>${kunde.email}</td></tr>`:""}
        ${kunde.telefon?`<tr><td>Telefon</td><td>${kunde.telefon}</td></tr>`:""}
        ${kunde.nachricht?`<tr><td>Anmerkung</td><td>${kunde.nachricht}</td></tr>`:""}
      </table>
    </div>` : "";

  return `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"><title>VELUX Kostenschätzung — Rex Bedachungs GmbH</title>
<style>
  @page{size:A4;margin:20mm 18mm 25mm 18mm}*{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,"Segoe UI",Helvetica,Arial,sans-serif;font-size:11px;line-height:1.5;color:#1a1a1a}
  .page{max-width:700px;margin:0 auto;padding:20px}
  @media print{.page{padding:0;max-width:none}.no-print{display:none!important}}
  .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #1e293b;padding-bottom:16px;margin-bottom:20px}
  .header-left h1{font-size:16px;font-weight:700;color:#1e293b}.header-left p{font-size:10px;color:#64748b;margin-top:2px}
  .header-right{text-align:right;font-size:10px;color:#475569;line-height:1.6}.header-right strong{color:#1e293b}
  .doc-title{font-size:14px;font-weight:700;color:#1e293b;margin-bottom:4px}.doc-meta{font-size:10px;color:#64748b;margin-bottom:20px}
  table{width:100%;border-collapse:collapse;font-size:11px}td{padding:4px 8px;vertical-align:top}.r{text-align:right;white-space:nowrap}
  .pos-header td{background:#1e293b;color:white;padding:6px 8px;font-size:11px}
  .sub-header td{background:#f1f5f9;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#64748b;padding:4px 8px;border-top:1px solid #e2e8f0}
  .subtotal td{border-top:1px solid #cbd5e1;font-weight:600;padding-top:6px}
  .muted td{color:#94a3b8;font-size:10px}
  .total-section{background:#f8fafc;border:2px solid #e2e8f0;border-radius:8px;padding:14px;margin-top:20px}
  .total-table{margin-top:4px}.total-table td{padding:3px 8px}
  .total-table .grand td{border-top:2px solid #1e293b;padding-top:8px;font-size:13px;font-weight:700}
  .total-table .mwst td{color:#64748b;font-size:10px}.total-table .brutto td{font-size:12px;font-weight:600;color:#334155}
  .foerder-box{background:#ecfdf5;border:1px solid #a7f3d0;border-radius:8px;padding:14px;margin-top:16px}
  .foerder-box h3{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#047857;margin-bottom:8px}
  .foerder-box .small{font-size:9px;color:#059669}.foerder-amount{font-size:14px;font-weight:700;color:#047857}
  .kunde-box{border:1px solid #e2e8f0;border-radius:8px;padding:14px;margin-top:16px}
  .kunde-box h3{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#475569;margin-bottom:8px}
  .kunde-box td:first-child{color:#64748b;width:100px}
  .disclaimer{margin-top:20px;padding:12px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;font-size:9px;color:#92400e;line-height:1.5}
  .disclaimer strong{display:block;margin-bottom:2px}
  .footer{margin-top:20px;padding-top:12px;border-top:1px solid #e2e8f0;text-align:center;font-size:9px;color:#94a3b8}.footer strong{color:#475569}
  .print-btn{display:block;margin:20px auto;padding:12px 32px;background:#1e293b;color:white;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer}.print-btn:hover{background:#334155}
</style></head><body>
<div class="page">
  <div class="no-print" style="text-align:center;padding:10px;background:#f0f9ff;border-radius:8px;margin-bottom:16px;font-size:12px;color:#1e40af">
    Klicken Sie auf <strong>"Als PDF speichern"</strong> im Druckdialog, um das Dokument herunterzuladen.
  </div>
  <div class="header">
    <div class="header-left"><h1>Rex Bedachungs GmbH</h1><p>Dachdecker-Meisterbetrieb · autorisierter VELUX-Partner · Seit 1984</p></div>
    <div class="header-right"><strong>Rex Bedachungs GmbH</strong><br>Paulinenstraße 22<br>44799 Bochum<br>Tel: 0234 / 58 31 00<br>info@rex-bedachung.de</div>
  </div>
  <div class="doc-title">VELUX Dachfenster — Unverbindliche Kostenschätzung</div>
  <div class="doc-meta">Erstellt am ${today} · Einzelpreise netto, Bruttobeträge separat ausgewiesen · Materialpreise = VELUX UVP 2026</div>
  ${kundeSection}
  <table style="margin-top:16px">${posRows}</table>
  <div class="total-section">
    <table class="total-table">
      <tr><td>Material gesamt (UVP netto)</td><td class="r">${fmt(totals.totalMat)} €</td></tr>
      <tr><td>Einbaukosten gesamt (netto)</td><td class="r">ab ${fmt(totals.totalLab)} €</td></tr>
      <tr class="grand"><td>Gesamtkosten netto</td><td class="r">ab ${fmt(totals.totalNetto)} €</td></tr>
      <tr class="mwst"><td>zzgl. 19% MwSt.</td><td class="r">${fmt(totals.mwst)} €</td></tr>
      <tr class="brutto"><td>Gesamtkosten brutto (inkl. MwSt.)</td><td class="r">ab ${fmt(totals.totalBrutto)} €</td></tr>
    </table>
  </div>
  ${foerderSection}
  <div class="disclaimer">
    <strong>Hinweis zu den angegebenen Preisen:</strong>
    Alle Material- und Einbaupreise in dieser Kostenschätzung sind Nettopreise (ohne MwSt.). Die Gesamtübersicht weist zusätzlich die Bruttobeträge inkl. 19% MwSt. aus. Unverbindliche Kostenschätzung auf Basis der VELUX UVP 2026. Einbaukosten sind Mindestpreise und variieren je nach baulichen Gegebenheiten. Fördermittel vorbehaltlich Bewilligung durch BAFA bzw. KfW. Ihr persönliches Angebot kann abweichen.
  </div>
  <div class="footer"><strong>Rex Bedachungs GmbH</strong> · Paulinenstraße 22 · 44799 Bochum · Tel: 0234 / 58 31 00 · www.rex-bedachung.de</div>
  <button class="no-print print-btn" onclick="window.print()">PDF speichern / Drucken</button>
</div></body></html>`;
}

/* ═══════════════════════════════════════════════════════════════════════
   UI COMPONENTS
   ═══════════════════════════════════════════════════════════════════════ */

function Ico({type,className="w-5 h-5"}){const m={droplets:Droplets,eye:Eye,sun:Sun};const C=m[type]||Home;return <C className={className}/>;}

function Steps({step}){
  const s=["Konfiguration","Förderung","Ergebnis"];
  return(
    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
      {s.map((l,i)=>(
        <div key={i} className="flex items-center gap-1 sm:gap-2">
          <div className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${i+1===step?"bg-slate-800 text-white shadow-lg":i+1<step?"bg-emerald-100 text-emerald-800":"bg-slate-100 text-slate-400"}`}>
            {i+1<step?<Check className="w-3.5 h-3.5"/>:<span className="w-5 h-5 flex items-center justify-center text-xs">{i+1}</span>}
            <span className="hidden sm:inline">{l}</span>
          </div>
          {i<2&&<ChevronRight className="w-4 h-4 text-slate-300"/>}
        </div>))}
    </div>);
}

function QtyPicker({value,max,onChange,label}){
  return(
    <div className="flex items-center gap-2 mt-2 ml-1">
      <span className="text-[10px] text-slate-400">{label}:</span>
      <div className="flex items-center border border-slate-200 rounded overflow-hidden">
        <button onClick={()=>onChange(Math.max(1,value-1))} className="px-2 py-0.5 text-slate-500 hover:bg-slate-50 text-xs font-bold">−</button>
        <span className="px-2.5 py-0.5 font-bold text-slate-800 bg-slate-50 min-w-[1.8rem] text-center text-xs">{value}</span>
        <button onClick={()=>onChange(Math.min(max,value+1))} className="px-2 py-0.5 text-slate-500 hover:bg-slate-50 text-xs font-bold">+</button>
      </div>
      <span className="text-[10px] text-slate-400">von {max}</span>
    </div>);
}

function PosCard({pos,onChange,onRemove,index,canRemove}){
  const {model,size,glazing,qty,shutter,shutterQty,blind,blindQty}=pos;
  const sizes=model?Object.keys(WINDOWS[model].prices):[];
  const glazings=model&&size?Object.keys(WINDOWS[model].prices[size]||{}):[];
  const shutterOpts=size?Object.keys(SHUTTERS).filter(s=>size in SHUTTERS[s].prices):[];
  const blindOpts=size?Object.keys(BLINDS).filter(b=>size in BLINDS[b].prices):[];

  let sub=0;
  if(model&&size&&glazing){
    const wp=WINDOWS[model].prices[size]?.[glazing]||0;
    const edw=EDW[size]||0;
    const sp=shutter!=="none"&&shutterQty>0?SHUTTERS[shutter]?.prices[size]||0:0;
    const bp=blind!=="none"&&blindQty>0?BLINDS[blind]?.prices[size]||0:0;
    const matFenster=(wp+edw)*qty + sp*shutterQty + bp*blindQty;
    const labFenster=(LABOR.demontage+LABOR.einbau+LABOR.eindeckrahmen)*qty + (sp?LABOR.rollladen*shutterQty:0) + (bp?LABOR.rollo*blindQty:0);
    sub=matFenster+labFenster;
  }

  return(
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <span className="text-sm font-bold text-slate-700">Position {index+1}</span>
        <div className="flex items-center gap-3">
          {sub>0&&<span className="text-xs font-semibold text-slate-500">ab {fmt(sub)} € netto</span>}
          {canRemove&&<button onClick={onRemove} className="text-slate-400 hover:text-red-500 transition-colors p-1"><Trash2 className="w-4 h-4"/></button>}
        </div>
      </div>
      <div className="p-4 space-y-5">
        {/* Model */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Fenstertyp</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(WINDOWS).map(([k,w])=>(
              <button key={k} onClick={()=>onChange({...pos,model:k,size:"",glazing:"",shutter:"none",shutterQty:0,blind:"none",blindQty:0})}
                className={`text-left p-3 rounded-xl border-2 transition-all ${model===k?"border-slate-800 bg-slate-50":"border-slate-200 hover:border-slate-300"}`}>
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${model===k?"bg-slate-800 text-white":"bg-slate-100 text-slate-400"}`}><Ico type={w.icon} className="w-4 h-4"/></div>
                  <div><div className="font-bold text-xs text-slate-900">{k}</div><div className="text-[10px] text-slate-500 leading-tight">{w.short}</div></div>
                </div>
              </button>))}
          </div>
        </div>
        {/* Size */}
        {model&&(<div className="animate-fadeIn"><label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Größe (B×H in cm)</label>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">{sizes.map(s=>(
            <button key={s} onClick={()=>onChange({...pos,size:s,glazing:"",shutter:"none",shutterQty:0,blind:"none",blindQty:0})}
              className={`p-2 rounded-lg border text-center transition-all ${size===s?"border-slate-800 bg-slate-800 text-white":"border-slate-200 text-slate-700 hover:border-slate-400"}`}>
              <div className="font-mono text-[11px] font-bold">{s}</div><div className="text-[9px] opacity-75">{DIMS[s]}</div>
            </button>))}</div></div>)}
        {/* Glazing */}
        {model&&size&&(<div className="animate-fadeIn"><label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Verglasung</label>
          <div className="grid grid-cols-3 gap-2">{glazings.map(g=>(
            <button key={g} onClick={()=>onChange({...pos,glazing:g})}
              className={`p-3 rounded-xl border-2 text-left transition-all ${glazing===g?"border-slate-800 bg-slate-50":"border-slate-200 hover:border-slate-300"}`}>
              <div className="font-semibold text-xs">{GL[g].l}</div><div className="text-[10px] text-slate-400 mt-0.5">Uw {GL[g].uw} W/m²K</div>
              <div className="font-bold text-sm mt-1.5">{fmt(WINDOWS[model].prices[size][g])} €</div>
            </button>))}</div></div>)}
        {/* EDW */}
        {model&&size&&glazing&&EDW[size]&&(
          <div className="animate-fadeIn bg-slate-50 rounded-lg px-3 py-2 flex justify-between items-center text-sm">
            <span className="text-slate-600 text-xs">EDW 2000 Eindeckrahmen Ziegel h/W (inkl. BDX+BFX)</span>
            <span className="font-semibold text-slate-800">{fmt(EDW[size])} €</span>
          </div>)}
        {/* Qty + Accessories */}
        {model&&size&&glazing&&(
          <div className="animate-fadeIn space-y-4">
            {/* Window Qty */}
            <div className="flex items-center gap-4">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Anzahl Fenster</label>
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                <button onClick={()=>onChange({...pos,qty:Math.max(1,qty-1),shutterQty:Math.min(shutterQty,Math.max(1,qty-1)),blindQty:Math.min(blindQty,Math.max(1,qty-1))})} className="px-3 py-1.5 text-slate-600 hover:bg-slate-50 font-bold">−</button>
                <span className="px-4 py-1.5 font-bold text-slate-900 bg-slate-50 min-w-[2.5rem] text-center text-sm">{qty}</span>
                <button onClick={()=>onChange({...pos,qty:Math.min(10,qty+1)})} className="px-3 py-1.5 text-slate-600 hover:bg-slate-50 font-bold">+</button>
              </div>
            </div>
            {/* Shutter */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Rollladen</label>
              <div className="flex flex-wrap gap-2">
                <button onClick={()=>onChange({...pos,shutter:"none",shutterQty:0})}
                  className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${shutter==="none"?"border-slate-800 bg-slate-800 text-white":"border-slate-200 text-slate-600 hover:border-slate-300"}`}>Keiner</button>
                {shutterOpts.map(s=>(<button key={s} onClick={()=>onChange({...pos,shutter:s,shutterQty:shutter===s?shutterQty:qty})}
                  className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${shutter===s?"border-slate-800 bg-slate-800 text-white":"border-slate-200 text-slate-600 hover:border-slate-300"}`}>{SHUTTERS[s].short} <span className="opacity-70 ml-1">{fmt(SHUTTERS[s].prices[size])} €</span></button>))}
              </div>
              {shutter!=="none"&&shutterQty>0&&(
                <QtyPicker value={shutterQty} max={qty} onChange={v=>onChange({...pos,shutterQty:v})} label="Anzahl Rollläden"/>
              )}
            </div>
            {/* Blind */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Verdunkelungsrollo <span className="normal-case font-normal text-slate-400">(Stoff: Standard Weiß)</span></label>
              <div className="flex flex-wrap gap-2">
                <button onClick={()=>onChange({...pos,blind:"none",blindQty:0})}
                  className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${blind==="none"?"border-slate-800 bg-slate-800 text-white":"border-slate-200 text-slate-600 hover:border-slate-300"}`}>Keins</button>
                {blindOpts.map(b=>(<button key={b} onClick={()=>onChange({...pos,blind:b,blindQty:blind===b?blindQty:qty})}
                  className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${blind===b?"border-slate-800 bg-slate-800 text-white":"border-slate-200 text-slate-600 hover:border-slate-300"}`}>{BLINDS[b].short} <span className="opacity-70 ml-1">{fmt(BLINDS[b].prices[size])} €</span></button>))}
              </div>
              {blind!=="none"&&blindQty>0&&(
                <QtyPicker value={blindQty} max={qty} onChange={v=>onChange({...pos,blindQty:v})} label="Anzahl Rollos"/>
              )}
            </div>
          </div>)}
      </div>
    </div>);
}

/* ─── Steps ──────────────────────────────────────────────────── */

function Step1({positions,setPositions}){
  const update=(i,p)=>setPositions(ps=>ps.map((x,j)=>j===i?p:x));
  const remove=(i)=>setPositions(ps=>ps.filter((_,j)=>j!==i));
  const add=()=>setPositions(ps=>[...ps,emptyPos()]);
  return(<div className="space-y-4">
    {positions.map((p,i)=>(<PosCard key={p.id} pos={p} index={i} onChange={np=>update(i,np)} onRemove={()=>remove(i)} canRemove={positions.length>1}/>))}
    <button onClick={add} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-all text-sm font-semibold"><Plus className="w-4 h-4"/> Weitere Fenstergröße hinzufügen</button>
  </div>);
}

function Step2({foerderung,setFoerderung}){
  const qs=[{key:"altbau",label:"Ist das Gebäude älter als 5 Jahre?",hint:"Grundvoraussetzung für BAFA- und KfW-Förderung"},{key:"sanierung",label:"Erfolgt der Einbau im Rahmen einer energetischen Sanierung?",hint:"Fensteraustausch mit verbessertem Uw-Wert"},{key:"isfp",label:"Liegt ein individueller Sanierungsfahrplan (iSFP) vor?",hint:"Erhöht den Fördersatz um 5 Prozentpunkte und die max. förderfähigen Kosten"}];
  return(<div className="space-y-5">
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3"><Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5"/><div className="text-sm text-blue-800"><span className="font-semibold">Fördermittel-Check:</span> Wir prüfen BAFA-Einzelmaßnahme (BEG EM) und KfW-Ergänzungskredit und zeigen Ihnen die beste Option.</div></div>
    {qs.map((q,i)=>(<div key={q.key} className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="font-semibold text-slate-800 mb-1">{i+1}. {q.label}</div><div className="text-xs text-slate-500 mb-4">{q.hint}</div>
      <div className="flex gap-3">{["ja","nein"].map(v=>(<button key={v} onClick={()=>setFoerderung(f=>({...f,[q.key]:v}))}
        className={`px-6 py-2.5 rounded-lg border-2 font-semibold text-sm transition-all ${foerderung[q.key]===v?v==="ja"?"border-emerald-600 bg-emerald-50 text-emerald-800":"border-slate-400 bg-slate-50 text-slate-700":"border-slate-200 text-slate-500 hover:border-slate-300"}`}>{v==="ja"?"Ja":"Nein"}</button>))}</div>
    </div>))}
  </div>);
}

/* ─── Calc ────────────────────────────────────────────────────── */

function calcDetails(positions){
  return positions.map(p=>{
    const wp=WINDOWS[p.model].prices[p.size][p.glazing];
    const edw=EDW[p.size]||0;
    const sp=p.shutter!=="none"&&p.shutterQty>0?SHUTTERS[p.shutter]?.prices[p.size]||0:0;
    const bp=p.blind!=="none"&&p.blindQty>0?BLINDS[p.blind]?.prices[p.size]||0:0;
    const matPos=(wp+edw)*p.qty + sp*p.shutterQty + bp*p.blindQty;
    const labPos=(LABOR.demontage+LABOR.einbau+LABOR.eindeckrahmen)*p.qty + (sp?LABOR.rollladen*p.shutterQty:0) + (bp?LABOR.rollo*p.blindQty:0);
    return {...p,wp,edw,sp,bp,matPos,labPos};
  });
}

/* ─── Step 3 ──────────────────────────────────────────────────── */

function Step3({positions,foerderung}){
  const [kunde,setKunde]=useState({name:"",email:"",telefon:"",strasse:"",plz:"",ort:"",nachricht:""});
  const [pdfGenerated,setPdfGenerated]=useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const setK=(k,v)=>setKunde(c=>({...c,[k]:v}));

  const details=calcDetails(positions);
  const totalMat=details.reduce((s,d)=>s+d.matPos,0);
  const totalLab=details.reduce((s,d)=>s+d.labPos,0);
  const totalNetto=totalMat+totalLab;
  const mwst=Math.round(totalNetto*0.19);
  const totalBrutto=totalNetto+mwst;
  const totalFenster=details.reduce((s,d)=>s+d.qty,0);

  // ─── Förderung nach BEG EM (BAFA Einzelmaßnahme) ─────────────────
  // Nur Fenster mit Uw ≤ 1,0 W/(m²·K) sind förderrelevant → ENERGIE PLUS + WÄRMEDÄMMUNG, NICHT THERMO
  const eligible=foerderung.altbau==="ja"&&foerderung.sanierung==="ja";
  const hasIsfp=foerderung.isfp==="ja";
  const bafaRate=eligible?(hasIsfp?0.20:0.15):0;
  const bafaMaxBrutto=hasIsfp?60000:30000; // Cap pro WE/Jahr auf Bruttokosten

  // Förderfähige Positionen: nur ENERGIE (E) oder ENERGIE PLUS (P)
  const eligibleDetails=details.filter(d=>d.glazing==="E"||d.glazing==="P");
  const ineligibleDetails=details.filter(d=>d.glazing==="T");
  const hasIneligible=ineligibleDetails.length>0;
  const foerderNetto=eligibleDetails.reduce((s,d)=>s+d.matPos+d.labPos,0);
  const foerderBrutto=Math.round(foerderNetto*1.19);
  const bafaBasis=Math.min(foerderBrutto,bafaMaxBrutto);
  const bafaFoerder=eligible&&foerderBrutto>0?Math.round(bafaBasis*bafaRate):0;

  // §35c EStG: 20% Steuerermäßigung über 3 Jahre (7%+7%+6%), kein Energieberater nötig
  // Voraussetzung: selbstgenutztes Wohneigentum, Gebäude ≥ 10 Jahre alt
  const steuerBasis=Math.min(totalBrutto,200000);
  const steuerBonus=eligible?Math.round(steuerBasis*0.20):0;
  const steuerJahr1=eligible?Math.round(steuerBasis*0.07):0;
  const steuerJahr2=eligible?Math.round(steuerBasis*0.07):0;
  const steuerJahr3=eligible?Math.round(steuerBasis*0.06):0;

  // BAFA-Zuschuss ist Direktzahlung an Kunden — wird vom Brutto abgezogen, MwSt ändert sich nicht
  const investitionBrutto=totalBrutto-bafaFoerder;
  const investitionSteuer=totalBrutto-steuerBonus;
  const kundeValid=kunde.name.trim().length>1&&(kunde.email.trim().includes("@")||kunde.telefon.trim().length>5);
  const totals={totalMat,totalLab,totalNetto,mwst,totalBrutto,eligible,hasIsfp,bafaRate,bafaMaxBrutto,bafaFoerder,foerderBrutto,foerderNetto,hasIneligible,investitionBrutto,steuerBonus,steuerJahr1,steuerJahr2,steuerJahr3,investitionSteuer};

  const handlePdf=useCallback(()=>{
    const html=buildPdfHtml(details,totals,foerderung,kunde);
    const w=window.open("","_blank");
    if(w){w.document.write(html);w.document.close();}
    setPdfGenerated(true);
  },[details,totals,foerderung,kunde]);

  const buildMailto=useCallback(()=>{
    const posText=details.map((d,i)=>{
      let t=`\nPos. ${i+1}: ${d.qty}x ${d.model} ${d.size} (${DIMS[d.size]} cm) ${GL[d.glazing].l}`;
      if(d.shutterQty>0)t+=` + ${d.shutterQty}x ${SHUTTERS[d.shutter].short}`;
      if(d.blindQty>0)t+=` + ${d.blindQty}x ${BLINDS[d.blind].short}`;
      t+=`\n  Material: ${fmt(d.matPos)} EUR | Einbau: ab ${fmt(d.labPos)} EUR`;
      return t;}).join("");
    const ft=eligible&&bafaFoerder>0?`\n\nMoegl. BAFA-Foerderung (${Math.round(bafaRate*100)}%): ca. ${fmt(bafaFoerder)} EUR\nFoerderfaehige Bruttokosten: ${fmt(foerderBrutto)} EUR\nIhre tatsaechliche Investition: ab ${fmt(investitionBrutto)} EUR`:"";
    const ad=kunde.strasse?`\nStrasse: ${kunde.strasse}`:"";
    const po=(kunde.plz||kunde.ort)?`\nPLZ/Ort: ${kunde.plz} ${kunde.ort}`:"";
    const subject=encodeURIComponent(`Angebotsanfrage VELUX Dachfenster – ${kunde.name.trim()}`);
    const body=encodeURIComponent(`Guten Tag,\n\nich moechte ein unverbindliches Angebot anfragen.\nDie detaillierte Kostenschaetzung ist als PDF beigefuegt.\n${posText}\n\nGesamt: ab ${fmt(totalNetto)} EUR netto (${fmt(totalBrutto)} EUR brutto inkl. MwSt.)${ft}\n\nKontaktdaten:\nName: ${kunde.name}${ad}${po}\nE-Mail: ${kunde.email}\nTelefon: ${kunde.telefon}${kunde.nachricht?`\nAnmerkung: ${kunde.nachricht}`:""}\n\nMit freundlichen Gruessen\n${kunde.name}`);
    return`mailto:info@rex-bedachung.de?subject=${subject}&body=${body}`;
  },[details,totals,eligible,bafaRate,bafaFoerder,foerderBrutto,investitionBrutto,totalNetto,totalBrutto,kunde]);

  const buildKonfigText = () => {
    return details.map((d, i) =>
      `Pos ${i+1}: ${d.qty}× ${d.model} ${d.size} (${DIMS[d.size]} cm) ${GL[d.glazing].l}` +
      (d.shutterQty > 0 ? ` + ${d.shutterQty}× ${SHUTTERS[d.shutter].short}` : "") +
      (d.blindQty > 0 ? ` + ${d.blindQty}× ${BLINDS[d.blind].short}` : "") +
      ` → ab ${fmt(d.matPos + d.labPos)} € netto`
    ).join("\n") +
    `\n\nGesamt netto: ab ${fmt(totalNetto)} €` +
    `\nGesamt brutto: ab ${fmt(totalBrutto)} €` +
    (bafaFoerder > 0 ? `\nBAFA-Zuschuss: −${fmt(bafaFoerder)} € (${hasIsfp ? "20%" : "15%"})` : "") +
    (bafaFoerder > 0 ? `\nInvestition nach Förderung: ab ${fmt(investitionBrutto)} €` : "") +
    `\nFörder-Check: Altbau=${foerderung.altbau}, Sanierung=${foerderung.sanierung}, iSFP=${foerderung.isfp}`;
  };

  const handleSubmitAndPdf = async () => {
    setSubmitting(true);
    setSubmitError(false);

    const formData = new URLSearchParams();
    formData.append("form-name", "velux-preisrechner");
    formData.append("bot-field", "");
    formData.append("name", kunde.name);
    formData.append("email", kunde.email);
    formData.append("telefon", kunde.telefon);
    formData.append("strasse", kunde.strasse);
    formData.append("plz", kunde.plz);
    formData.append("ort", kunde.ort);
    formData.append("nachricht", kunde.nachricht);
    formData.append("konfiguration", buildKonfigText());

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });
      if (res.ok) {
        setSubmitSuccess(true);
        handlePdf();
      } else {
        throw new Error("Submit failed");
      }
    } catch {
      setSubmitError(true);
      const subject = encodeURIComponent("VELUX Preisrechner – Anfrage von " + kunde.name);
      const body = encodeURIComponent(
        `Name: ${kunde.name}\nE-Mail: ${kunde.email}\nTelefon: ${kunde.telefon}\n` +
        `Adresse: ${kunde.strasse}, ${kunde.plz} ${kunde.ort}\n\n` +
        `Konfiguration:\n${buildKonfigText()}\n\nNachricht: ${kunde.nachricht}`
      );
      window.location.href = `mailto:info@rex-bedachung.de?subject=${subject}&body=${body}`;
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-800/20 focus:border-slate-800 transition-all";

  return(
    <div className="space-y-5">
      {/* Config Summary */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-2 text-slate-300 text-xs font-medium uppercase tracking-wider mb-4"><Calculator className="w-4 h-4"/> Ihre Konfiguration — {totalFenster} Fenster</div>
        <div className="space-y-2.5">{details.map((d,i)=>(
          <div key={i} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span className="font-bold">{d.qty}× {d.model} {d.size}</span>
            <span className="text-slate-300 text-xs">{DIMS[d.size]} cm · {GL[d.glazing].l}</span>
            {d.shutterQty>0&&<span className="text-[10px] bg-white/10 px-2 py-0.5 rounded">{d.shutterQty}× {SHUTTERS[d.shutter].short}</span>}
            {d.blindQty>0&&<span className="text-[10px] bg-white/10 px-2 py-0.5 rounded">{d.blindQty}× {BLINDS[d.blind].short}</span>}
          </div>))}</div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {details.map((d,i)=>(
          <div key={i} className={`p-4 ${i>0?"border-t border-slate-100":""}`}>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Position {i+1}: {d.qty}× {d.model} {d.size} {GL[d.glazing].l}</div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 mt-2">Material</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-slate-600">{d.qty}× {d.model} {d.size} {GL[d.glazing].l} (UVP)</span><span className="font-medium">{fmt(d.wp)} € / Stk.</span></div>
              <div className="flex justify-between"><span className="text-slate-600">{d.qty}× EDW 2000 Eindeckrahmen Ziegel h/W</span><span className="font-medium">{fmt(d.edw)} € / Stk.</span></div>
              {d.shutterQty>0&&<div className="flex justify-between"><span className="text-slate-600">{d.shutterQty}× {SHUTTERS[d.shutter].name} (UVP)</span><span className="font-medium">{fmt(d.sp)} € / Stk.</span></div>}
              {d.blindQty>0&&<div className="flex justify-between"><span className="text-slate-600">{d.blindQty}× {BLINDS[d.blind].name} Weiß (UVP)</span><span className="font-medium">{fmt(d.bp)} € / Stk.</span></div>}
              <div className="flex justify-between font-semibold text-slate-800 pt-0.5"><span>Material Position {i+1}</span><span>{fmt(d.matPos)} €</span></div>
            </div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 mt-3">Einbau</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">{d.qty}× Demontage Altfenster/Erstellung Dachöffnung</span><span className="text-slate-500">ab {fmt(LABOR.demontage)} €</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{d.qty}× Fenstereinbau</span><span className="text-slate-500">ab {fmt(LABOR.einbau)} €</span></div>
              <div className="flex justify-between"><span className="text-slate-500">{d.qty}× Eindeckrahmen-Montage</span><span className="text-slate-500">ab {fmt(LABOR.eindeckrahmen)} €</span></div>
              {d.shutterQty>0&&<div className="flex justify-between"><span className="text-slate-500">{d.shutterQty}× Rollladen-Montage</span><span className="text-slate-500">ab {fmt(LABOR.rollladen)} €</span></div>}
              {d.blindQty>0&&<div className="flex justify-between"><span className="text-slate-500">{d.blindQty}× Rollo-Montage</span><span className="text-slate-500">ab {fmt(LABOR.rollo)} €</span></div>}
              <div className="flex justify-between font-semibold text-slate-800 pt-0.5"><span>Einbau Position {i+1}</span><span>ab {fmt(d.labPos)} €</span></div>
            </div>
          </div>))}

        {/* Totals */}
        <div className="p-5 bg-slate-50 border-t-2 border-slate-200 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-slate-600">Material gesamt (UVP netto)</span><span className="font-semibold">{fmt(totalMat)} €</span></div>
          <div className="flex justify-between"><span className="text-slate-600">Einbaukosten gesamt (netto)</span><span className="font-semibold">ab {fmt(totalLab)} €</span></div>
          <div className="border-t border-slate-300 pt-2.5 mt-2.5 flex justify-between items-baseline">
            <span className="font-bold text-slate-900">Gesamtkosten netto</span><span className="text-xl font-bold text-slate-900">ab {fmt(totalNetto)} €</span></div>
          <div className="flex justify-between text-slate-500 text-xs"><span>zzgl. 19% MwSt.</span><span>{fmt(mwst)} €</span></div>
          <div className="flex justify-between items-baseline pb-1"><span className="font-semibold text-slate-700">Gesamtkosten brutto (inkl. MwSt.)</span><span className="text-lg font-bold text-slate-700">ab {fmt(totalBrutto)} €</span></div>

          {eligible&&(
            <div className="mt-4 space-y-3">
              {/* THERMO-Hinweis */}
              {hasIneligible&&(
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5"/>
                  <div className="text-xs text-amber-800">
                    <span className="font-semibold">Nicht förderrelevant:</span> {ineligibleDetails.length} Position(en) mit THERMO-Verglasung (Uw 1,3 W/m²K). Die BEG-Förderung erfordert Uw ≤ 1,0 W/m²K — nur ENERGIE PLUS und WÄRMEDÄMMUNG Verglasungen sind förderrelevant.
                  </div>
                </div>
              )}

              {bafaFoerder>0?(
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-3">BAFA-Förderung (BEG Einzelmaßnahme)</div>
                  <div className="space-y-1.5 text-sm mb-3">
                    <div className="flex justify-between"><span className="text-emerald-700">Förderfähige Kosten (brutto)</span><span className="font-semibold text-emerald-800">{fmt(foerderBrutto)} €</span></div>
                    {foerderBrutto>bafaMaxBrutto&&<div className="flex justify-between text-xs text-emerald-600"><span>Förderhöchstbetrag pro WE/Jahr</span><span>{fmt(bafaMaxBrutto)} €</span></div>}
                    <div className="flex justify-between"><span className="text-emerald-700">Fördersatz</span><span className="font-semibold text-emerald-800">{hasIsfp?"20% (15% + 5% iSFP-Bonus)":"15%"}</span></div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-b border-emerald-200">
                    <span className="font-bold text-emerald-900">Geschätzter BAFA-Zuschuss</span>
                    <span className="text-xl font-bold text-emerald-700">− {fmt(bafaFoerder)} €</span>
                  </div>
                  <div className="text-xs text-emerald-600 bg-emerald-100/60 rounded-lg p-2.5 mt-3 space-y-1">
                    <p><span className="font-semibold">KfW Ergänzungskredit 358/359:</span> Nach BAFA-Zusage ist zusätzlich ein zinsvergünstigter Kredit bis 120.000 € pro WE möglich. Bei Haushaltseinkommen ≤ 90.000 € besonders günstige Konditionen.</p>
                    <p><span className="font-semibold">Fachplanung:</span> 50% Zuschuss für den Energieeffizienz-Experten (bis 5.000 € bei EFH) — separater Fördertopf.</p>
                    {!hasIsfp&&<p><span className="font-semibold">Tipp:</span> Mit einem iSFP (Eigenanteil ca. 400–500 €) steigt der Fördersatz auf 20% und der Höchstbetrag auf 60.000 €.</p>}
                  </div>
                  <div className="border-t border-emerald-200 pt-3 mt-3">
                    <div className="flex justify-between items-center mb-1"><span className="text-sm text-emerald-700">Gesamtkosten brutto (inkl. MwSt.)</span><span className="text-sm text-emerald-700">{fmt(totalBrutto)} €</span></div>
                    <div className="flex justify-between items-center mb-2"><span className="text-sm text-emerald-700">BAFA-Zuschuss</span><span className="text-sm font-semibold text-emerald-700">− {fmt(bafaFoerder)} €</span></div>
                    <div className="flex justify-between items-baseline pt-2 border-t border-emerald-300">
                      <span className="font-bold text-emerald-900">Ihre tatsächliche Investition</span>
                      <span className="text-xl font-bold text-emerald-800">ab {fmt(investitionBrutto)} €</span>
                    </div>
                  </div>

                  {/* §35c Steuerbonus — Empfehlung wenn kein iSFP */}
                  {!hasIsfp&&steuerBonus>0&&(
                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">Empfehlung: Steuerbonus §35c EStG</div>
                      <p className="text-sm text-blue-800 mb-3">
                        Ohne Energieberater und iSFP ist der <strong>Steuerbonus nach §35c EStG oft die bessere Wahl</strong>: 20% Steuerermäßigung — 5 Prozentpunkte mehr als die BAFA-Förderung ohne iSFP. Kein Energieeffizienz-Experte erforderlich, kein BAFA-Antrag, weniger Aufwand.
                      </p>
                      <div className="space-y-1.5 text-sm mb-3">
                        <div className="flex justify-between"><span className="text-blue-700">Steuerermäßigung gesamt (20%)</span><span className="font-bold text-blue-800">{fmt(steuerBonus)} €</span></div>
                        <div className="flex justify-between text-xs text-blue-600"><span>Jahr 1 (7%)</span><span>{fmt(steuerJahr1)} €</span></div>
                        <div className="flex justify-between text-xs text-blue-600"><span>Jahr 2 (7%)</span><span>{fmt(steuerJahr2)} €</span></div>
                        <div className="flex justify-between text-xs text-blue-600"><span>Jahr 3 (6%)</span><span>{fmt(steuerJahr3)} €</span></div>
                      </div>
                      <div className="flex justify-between items-baseline pt-2 border-t border-blue-200">
                        <span className="font-bold text-blue-900">Effektive Investition mit Steuerbonus</span>
                        <span className="text-lg font-bold text-blue-800">ab {fmt(investitionSteuer)} €</span>
                      </div>
                      <div className="mt-3 bg-blue-100/60 rounded-lg p-2.5 text-xs text-blue-700 space-y-1">
                        <p><span className="font-semibold">Voraussetzungen:</span> Selbstgenutztes Wohneigentum, Gebäude mindestens 10 Jahre alt, Ausführung durch Fachunternehmen, unbare Bezahlung.</p>
                        <p><span className="font-semibold">Nicht kombinierbar</span> mit BAFA-Förderung für dieselbe Maßnahme — eine der beiden Optionen wählen.</p>
                      </div>
                    </div>
                  )}
                </div>
              ):(
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
                  Keine förderrelevanten Positionen vorhanden. Für die BEG-Förderung ist eine Verglasung mit Uw ≤ 1,0 W/m²K erforderlich (ENERGIE PLUS oder WÄRMEDÄMMUNG).
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5"/>
        <div className="text-xs text-amber-800 space-y-1">
          <p className="font-semibold">Hinweis zu den angegebenen Preisen:</p>
          <p>Alle Material- und Einbaupreise in dieser Kostenschätzung sind Nettopreise (ohne MwSt.). Die Gesamtübersicht weist zusätzlich die Bruttobeträge inkl. 19% MwSt. aus. Unverbindliche Kostenschätzung auf Basis der VELUX UVP 2026. Einbaukosten sind Mindestpreise und variieren je nach baulichen Gegebenheiten. Fördermittel vorbehaltlich Bewilligung durch BAFA bzw. KfW.</p>
        </div>
      </div>

      {/* Kundendaten */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2"><User className="w-4 h-4 text-slate-600"/><span className="text-sm font-bold text-slate-700">Ihre Kontaktdaten</span></div>
        <div className="p-5 space-y-4">
          <div><label className="block text-xs font-semibold text-slate-600 mb-1">Name *</label><input type="text" value={kunde.name} onChange={e=>setK("name",e.target.value)} placeholder="Vor- und Nachname" className={inputCls}/></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">E-Mail *</label><input type="email" value={kunde.email} onChange={e=>setK("email",e.target.value)} placeholder="ihre@email.de" className={inputCls}/></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Telefon</label><input type="tel" value={kunde.telefon} onChange={e=>setK("telefon",e.target.value)} placeholder="0234 / ..." className={inputCls}/></div>
          </div>
          <div><label className="block text-xs font-semibold text-slate-600 mb-1">Straße + Hausnummer</label><input type="text" value={kunde.strasse} onChange={e=>setK("strasse",e.target.value)} placeholder="Musterstraße 1" className={inputCls}/></div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">PLZ</label><input type="text" value={kunde.plz} onChange={e=>setK("plz",e.target.value)} placeholder="44799" className={inputCls} maxLength={5}/></div>
            <div className="col-span-2"><label className="block text-xs font-semibold text-slate-600 mb-1">Ort</label><input type="text" value={kunde.ort} onChange={e=>setK("ort",e.target.value)} placeholder="Bochum" className={inputCls}/></div>
          </div>
          <div><label className="block text-xs font-semibold text-slate-600 mb-1">Anmerkung <span className="font-normal text-slate-400">(optional)</span></label><textarea value={kunde.nachricht} onChange={e=>setK("nachricht",e.target.value)} rows={2} placeholder="z.B. Dachneigung, besondere Einbausituation, Wunschtermin ..." className={inputCls+" resize-none"}/></div>
          <p className="text-[10px] text-slate-400">* Pflichtfelder. Name und mindestens E-Mail oder Telefon erforderlich.</p>
        </div>
      </div>

      {/* CTAs */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="text-center">
          <div className="text-lg font-bold text-slate-900 mb-1">Angebot anfragen</div>
          <p className="text-sm text-slate-500 mb-5">Wir erhalten Ihre Konfiguration und melden uns mit einem individuellen Angebot.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {kundeValid ? (<>
            <button onClick={handleSubmitAndPdf} disabled={submitting}
              className="inline-flex items-center gap-2 bg-slate-800 text-white px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-slate-700 transition-all shadow-lg hover:shadow-xl group disabled:opacity-50 disabled:cursor-wait">
              <Mail className="w-5 h-5"/>
              {submitting ? "Wird gesendet..." : "Anfrage senden & PDF erstellen"}
              {!submitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>}
            </button>
            <button onClick={handlePdf}
              className="inline-flex items-center gap-2 bg-white text-slate-700 border-2 border-slate-300 px-6 py-3.5 rounded-xl font-semibold text-sm hover:bg-slate-50 hover:border-slate-400 transition-all">
              <FileDown className="w-4 h-4"/>Nur PDF erstellen
            </button>
          </>) : (
            <div className="inline-flex items-center gap-2 bg-slate-200 text-slate-400 px-8 py-3.5 rounded-xl font-semibold text-sm cursor-not-allowed">
              <Mail className="w-5 h-5"/>Bitte zuerst Kontaktdaten ausfüllen
            </div>
          )}
        </div>
        {submitSuccess && (
          <div className="text-center animate-fadeIn">
            <p className="text-xs text-emerald-700 bg-emerald-50 inline-block px-4 py-2 rounded-lg">
              <Check className="w-3.5 h-3.5 inline mr-1"/>Anfrage erfolgreich gesendet! Wir melden uns in Kürze.
            </p>
          </div>
        )}
        {submitError && (
          <div className="text-center animate-fadeIn">
            <p className="text-xs text-red-700 bg-red-50 inline-block px-4 py-2 rounded-lg">
              Senden fehlgeschlagen. Bitte rufen Sie uns direkt an: 0234 / 58 31 00
            </p>
          </div>
        )}
        {pdfGenerated && !submitSuccess && (
          <div className="text-center animate-fadeIn">
            <p className="text-xs text-emerald-700 bg-emerald-50 inline-block px-4 py-2 rounded-lg">
              <Check className="w-3.5 h-3.5 inline mr-1"/>PDF wurde erstellt — bitte im Druckdialog als PDF speichern.
            </p>
          </div>
        )}
        <div className="text-center pt-2">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <Phone className="w-4 h-4"/><span>Oder direkt anrufen:</span>
            <a href="tel:+49234583100" className="font-semibold text-slate-800 hover:underline">0234 / 58 31 00</a>
          </div>
        </div>
      </div>
    </div>);
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════════════════ */

export default function VeluxPreisrechner(){
  const [step,setStep]=useState(1);
  const [positions,setPositions]=useState([emptyPos()]);
  const [foerderung,setFoerderung]=useState({altbau:"",sanierung:"",isfp:""});
  const canStep1=positions.length>0&&positions.every(p=>p.model&&p.size&&p.glazing);
  const canStep2=foerderung.altbau&&foerderung.sanierung&&foerderung.isfp;

  return(
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}.animate-fadeIn{animation:fadeIn .25s ease-out}`}</style>
      <div className="bg-slate-900 text-white"><div className="max-w-3xl mx-auto px-4 py-8 sm:py-10 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-xs font-medium mb-3"><Shield className="w-3.5 h-3.5"/>Autorisierter VELUX-Partner in Bochum</div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">VELUX Dachfenster Preisrechner</h1>
        <p className="text-slate-300 mt-2 text-sm">Kosten, Eindeckrahmen und Fördermöglichkeiten berechnen</p>
      </div></div>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Steps step={step}/>
        {step===1&&<Step1 positions={positions} setPositions={setPositions}/>}
        {step===2&&<Step2 foerderung={foerderung} setFoerderung={setFoerderung}/>}
        {step===3&&<Step3 positions={positions} foerderung={foerderung}/>}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
          {step>1?<button onClick={()=>setStep(s=>s-1)} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-medium"><ChevronLeft className="w-4 h-4"/>Zurück</button>:<div/>}
          {step<3&&(<button onClick={()=>setStep(s=>s+1)} disabled={step===1?!canStep1:!canStep2}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${(step===1?canStep1:canStep2)?"bg-slate-800 text-white hover:bg-slate-700 shadow-md":"bg-slate-200 text-slate-400 cursor-not-allowed"}`}>
            {step===1?"Weiter zur Förderung":"Kosten berechnen"}<ChevronRight className="w-4 h-4"/></button>)}
          {step===3&&(<button onClick={()=>{setStep(1);setPositions([emptyPos()]);setFoerderung({altbau:"",sanierung:"",isfp:""});}}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"><Calculator className="w-4 h-4"/>Neue Berechnung</button>)}
        </div>
      </div>
    </div>);
}
