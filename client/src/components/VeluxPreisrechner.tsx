// @ts-nocheck
import { useState, useCallback, useMemo } from "react";
import { ChevronRight, ChevronLeft, Calculator, Home, Sun, Phone, Mail, Check, Info, ArrowRight, Shield, Droplets, Eye, Plus, Trash2, User, FileDown } from "lucide-react";


// Preistabellen und Berechnung liegen seit PR-1a zentral in client/src/lib/velux/
// (eine Preislogik für UI, PDF, Anfrage-Text und WebMCP).
import { DIMS, WINDOWS, EDW, SHUTTERS, BLINDS, LABOR, GL, fmt, sizesForModel, shuttersForSize, blindsForSize } from "@/lib/velux/catalog";
import { calcDetails, buildEstimate } from "@/lib/velux/estimate";
import { EMPTY_FUNDING_ANSWERS, isFundingComplete, RULES } from "@/lib/velux/funding";
import { ASSUMPTIONS, COMPANY, DISCLAIMER, EXCLUSIONS, FUNDING_NOTES, PRICE_BASIS_NOTE, SCOPE_NOTE } from "@/lib/velux/content";
// WebMCP (PR-2a): Tools sind nur bei aktivem Flag + Origin-Allowlist registriert; ohne WebMCP läuft der Rechner unverändert.
import { buildVeluxTools } from "@/lib/velux/tools";
import { APPLIED_SESSION_KEY, RESULT_ANCHOR_ID, useVeluxBridge } from "@/lib/velux/bridge";
import { useWebMCPTool } from "@/hooks/useWebMCPTool";
import { emitWebMCPEvent, isWebMCPEnabled } from "@/lib/webmcp";
const deDate=(iso)=>iso.split("-").reverse().join(".");
let _id = 0;
const uid = () => ++_id;

const emptyPos = () => ({id:uid(),model:"",size:"",glazing:"",qty:1,shutter:"none",shutterQty:0,blind:"none",blindQty:0});

/* ═══════════════════════════════════════════════════════════════════════
   PDF GENERATION
   ═══════════════════════════════════════════════════════════════════════ */

function buildPdfHtml(details, totals, funding, kunde) {
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

  const rows = (r) => r.map(([a, b]) => `<tr><td>${a}</td><td class="r">${b}</td></tr>`).join("");
  const begBox = funding.beg ? `
    <div class="foerder-box">
      <h3>Alternative A – BEG EM (BAFA-Zuschuss)</h3>
      <table>
        ${rows([["Förderrelevante Kosten (brutto, nur Uw ≤ 1,0)", `<strong>${fmt(funding.beg.eligibleCostsGross)} €</strong>`], ...(funding.beg.capApplied ? [["Höchstgrenze je Wohneinheit und Jahr", `${fmt(funding.beg.cap)} €`]] : []), ["Fördersatz", `<strong>${funding.beg.rateLabel}</strong>`]])}
        <tr><td><strong>Möglicher Zuschuss (Maximalwert unter Annahmen)</strong></td><td class="r foerder-amount">bis zu ${fmt(funding.beg.amountMax)} €</td></tr>
        <tr class="muted"><td>Rechnerisch verbleibend nach maximalem Zuschuss</td><td class="r">ab ${fmt(totals.totalBrutto - funding.beg.amountMax)} €</td></tr>
      </table>
      <p class="small" style="margin-top:8px"><strong>Annahmen:</strong> ${funding.beg.assumptions.join("; ")}.</p>
      <p class="small">${FUNDING_NOTES.kfw}</p>
      <p class="small">${FUNDING_NOTES.fachplanung}</p>
      ${funding.beg.isfpBonus === 0 ? `<p class="small"><strong>Hinweis zum iSFP:</strong> ${FUNDING_NOTES.isfp}</p>` : ""}
    </div>` : `
    <div class="foerder-box" style="background:#f8fafc;border-color:#e2e8f0">
      <h3 style="color:#475569">Alternative A – BEG EM (BAFA-Zuschuss)</h3>
      <p class="small" style="color:#475569">Nicht ausgewiesen: ${funding.begReason}</p>
    </div>`;
  const taxBox = funding.tax35c ? `
    <div class="foerder-box" style="background:#eff6ff;border-color:#bfdbfe;margin-top:12px">
      <h3 style="color:#1d4ed8">Alternative B – Steuerermäßigung §35c EStG</h3>
      <table>
        ${rows([["Bemessungsgrundlage (brutto, nur Uw ≤ 1,0)", `<strong>${fmt(funding.tax35c.base)} €</strong>`], ...(funding.tax35c.capApplied ? [["Höchstbetrag je Objekt", "40.000 €"]] : []), ["Jahr 1 (7 %) / Jahr 2 (7 %) / Jahr 3 (6 %)", `${fmt(funding.tax35c.year1)} / ${fmt(funding.tax35c.year2)} / ${fmt(funding.tax35c.year3)} €`]])}
        <tr><td><strong>Mögliche Steuerermäßigung gesamt (Maximalwert unter Annahmen)</strong></td><td class="r foerder-amount" style="color:#1d4ed8">bis zu ${fmt(funding.tax35c.totalMax)} €</td></tr>
        <tr class="muted"><td>Rechnerisch verbleibend nach maximaler Ermäßigung</td><td class="r">ab ${fmt(totals.totalBrutto - funding.tax35c.totalMax)} €</td></tr>
      </table>
      <p class="small" style="margin-top:8px;color:#1e40af"><strong>Annahmen:</strong> ${funding.tax35c.assumptions.join("; ")}.</p>
      <p class="small" style="color:#1e40af">${FUNDING_NOTES.taxRequirements}</p>
    </div>` : `
    <div class="foerder-box" style="background:#f8fafc;border-color:#e2e8f0;margin-top:12px">
      <h3 style="color:#475569">Alternative B – Steuerermäßigung §35c EStG</h3>
      <p class="small" style="color:#475569">Nicht ausgewiesen: ${funding.tax35cReason}</p>
    </div>`;
  const foerderSection = `
    <div style="margin-top:16px">
      <div class="doc-title" style="font-size:12px">Fördermöglichkeiten – zwei Alternativen, nicht kombinierbar</div>
      <p class="small" style="color:#475569;margin-bottom:4px">${SCOPE_NOTE} ${FUNDING_NOTES.noRecommendation}</p>
      ${funding.ineligibleThermoPositions > 0 ? `<p class="small" style="color:#92400e"><strong>Hinweis:</strong> ${FUNDING_NOTES.thermo}</p>` : ""}
      ${begBox}
      ${taxBox}
      <p class="small" style="color:#64748b;margin-top:8px">${FUNDING_NOTES.notCombinable}</p>
      <p class="small" style="color:#94a3b8">Regelstand: ${RULES.beg.label} (Richtlinie ab ${deDate(RULES.beg.effectiveFrom)}) · ${RULES.tax35c.label} · geprüft am ${deDate(RULES.beg.lastReviewedAt)}</p>
    </div>`;

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
    <div class="header-left"><h1>${COMPANY.name}</h1><p>${COMPANY.claim}</p></div>
    <div class="header-right"><strong>${COMPANY.name}</strong><br>${COMPANY.street}<br>${COMPANY.city}<br>Tel: ${COMPANY.phone}<br>${COMPANY.email}</div>
  </div>
  <div class="doc-title">VELUX Dachfenster — Unverbindliche Kostenschätzung</div>
  <div class="doc-meta">Erstellt am ${today} · ${PRICE_BASIS_NOTE}</div>
  ${kundeSection}
  <table style="margin-top:16px">${posRows}</table>
  <div class="total-section">
    <table class="total-table">
      <tr><td>Material gesamt (UVP netto)</td><td class="r">${fmt(totals.totalMat)} €</td></tr>
      <tr><td>Einbaukosten gesamt (netto)</td><td class="r">ab ${fmt(totals.totalLab)} €</td></tr>
      <tr class="brutto"><td>Kostenschätzung netto</td><td class="r">ab ${fmt(totals.totalNetto)} €</td></tr>
      <tr class="mwst"><td>zzgl. 19 % MwSt.</td><td class="r">${fmt(totals.mwst)} €</td></tr>
      <tr class="grand"><td>Kostenschätzung brutto (inkl. MwSt.)</td><td class="r">ab ${fmt(totals.totalBrutto)} €</td></tr>
    </table>
  </div>
  ${foerderSection}
  <div class="disclaimer">
    <strong>Hinweis zu den angegebenen Preisen:</strong>
    ${DISCLAIMER}<br>
    <strong>Enthalten / angenommen:</strong> ${ASSUMPTIONS.join("; ")}.<br>
    <strong>Nicht enthalten:</strong> ${EXCLUSIONS.join(", ")}.
  </div>
  <div class="footer"><strong>${COMPANY.name}</strong> · ${COMPANY.street} · ${COMPANY.city} · Tel: ${COMPANY.phone} · ${COMPANY.web}</div>
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
  const sizes=model?sizesForModel(model):[];
  const glazings=model&&size?Object.keys(WINDOWS[model].prices[size]||{}):[];
  const shutterOpts=size?shuttersForSize(size):[];
  const blindOpts=size?blindsForSize(size):[];

  let sub=0;
  if(model&&size&&glazing){
    const d=calcDetails([pos])[0];
    sub=d.matPos+d.labPos;
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
              <div className="font-semibold text-xs">{GL[g].l}</div><div className="text-[10px] text-slate-400 mt-0.5">Uw {GL[g].uw} · g {GL[g].g}</div>
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
  const YNU=[["yes","Ja"],["no","Nein"],["unknown","Weiß ich nicht"]];
  const qs=[
    {key:"buildingAge",label:"Wie alt ist das Gebäude (Bauantrag)?",hint:"BEG EM setzt mindestens 5 Jahre voraus, die Steuerermäßigung nach §35c EStG mehr als 10 Jahre",options:[["under_5","Jünger als 5 Jahre"],["5_to_10","5 bis 10 Jahre"],["over_10","Älter als 10 Jahre"],["unknown","Weiß ich nicht"]]},
    {key:"energyRenovation",label:"Erfolgt der Einbau als Fenstertausch mit verbessertem Uw-Wert?",hint:"Energetische Einzelmaßnahme an der Gebäudehülle (BEG EM)",options:YNU},
    {key:"ownerOccupied",label:"Ist es selbstgenutztes Wohneigentum?",hint:"Voraussetzung für die Steuerermäßigung nach §35c EStG",options:YNU},
    {key:"hasIsfp",label:"Liegt ein individueller Sanierungsfahrplan (iSFP) vor?",hint:"Hebt die Obergrenze der förderrelevanten Kosten auf 60.000 €; +5 Prozentpunkte nur auf den Anteil über 30.000 €",options:YNU},
  ];
  const cls=(active,v)=>active?(v==="no"?"border-slate-400 bg-slate-50 text-slate-700":v==="unknown"?"border-amber-500 bg-amber-50 text-amber-800":"border-emerald-600 bg-emerald-50 text-emerald-800"):"border-slate-200 text-slate-500 hover:border-slate-300";
  return(<div className="space-y-5">
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3"><Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5"/><div className="text-sm text-blue-800"><span className="font-semibold">Fördermittel-Check:</span> Wir zeigen den BAFA-Zuschuss (BEG EM) und die Steuerermäßigung nach §35c EStG als zwei Alternativen – ohne Empfehlung. Unsichere Angaben einfach mit „Weiß ich nicht" beantworten; wir rechnen dann mit ausgewiesenen Annahmen. <span className="block mt-1 text-xs text-blue-700">{SCOPE_NOTE}</span></div></div>
    {qs.map((q,i)=>(<div key={q.key} className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="font-semibold text-slate-800 mb-1">{i+1}. {q.label}</div><div className="text-xs text-slate-500 mb-4">{q.hint}</div>
      <div className="flex flex-wrap gap-3">{q.options.map(([v,l])=>(<button key={v} onClick={()=>setFoerderung(f=>({...f,[q.key]:v}))}
        className={`px-5 py-2.5 rounded-lg border-2 font-semibold text-sm transition-all ${cls(foerderung[q.key]===v,v)}`}>{l}</button>))}</div>
    </div>))}
  </div>);
}

function FundingCard({title,tone,scenario,reason,rows,amountLabel,amount,remaining,notes}){
  const c=tone==="emerald"
    ?{box:"bg-emerald-50 border-emerald-200",head:"text-emerald-700",text:"text-emerald-700",strong:"text-emerald-800",amount:"text-emerald-700",note:"bg-emerald-100/60 text-emerald-700",line:"border-emerald-200"}
    :{box:"bg-blue-50 border-blue-200",head:"text-blue-700",text:"text-blue-700",strong:"text-blue-800",amount:"text-blue-700",note:"bg-blue-100/60 text-blue-700",line:"border-blue-200"};
  if(!scenario){
    return(<div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</div>
      <p className="text-xs text-slate-600"><span className="font-semibold">Nicht ausgewiesen:</span> {reason}</p>
    </div>);
  }
  return(<div className={`border rounded-xl p-4 ${c.box}`}>
    <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${c.head}`}>{title}</div>
    <div className="space-y-1.5 text-sm mb-3">{rows.map(([a,b],i)=>(<div key={i} className="flex justify-between gap-3"><span className={c.text}>{a}</span><span className={`font-semibold text-right ${c.strong}`}>{b}</span></div>))}</div>
    <div className={`flex justify-between items-center gap-3 py-2 border-t border-b ${c.line}`}><span className={`font-bold ${c.strong}`}>{amountLabel}</span><span className={`text-xl font-bold whitespace-nowrap ${c.amount}`}>bis zu {fmt(amount)} €</span></div>
    <div className={`flex justify-between gap-3 text-xs mt-2 ${c.text}`}><span>Rechnerisch verbleibend (Maximalwert unter Annahmen)</span><span className="whitespace-nowrap">ab {fmt(remaining)} €</span></div>
    <div className={`text-xs rounded-lg p-2.5 mt-3 space-y-1 ${c.note}`}>
      <p><span className="font-semibold">Annahmen:</span> {scenario.assumptions.join("; ")}.</p>
      {notes.map((n,i)=><p key={i}>{n}</p>)}
    </div>
  </div>);
}

/* ─── Step 3 ──────────────────────────────────────────────────── */

function Step3({positions,foerderung}){
  const [kunde,setKunde]=useState({name:"",email:"",telefon:"",strasse:"",plz:"",ort:"",nachricht:""});
  const [pdfGenerated,setPdfGenerated]=useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const setK=(k,v)=>setKunde(c=>({...c,[k]:v}));

  const {details,totals,funding}=buildEstimate(positions,foerderung);
  const {totalMat,totalLab,totalNetto,mwst,totalBrutto,totalFenster,hasIneligible,ineligibleCount}=totals;
  const {beg,tax35c,begReason,tax35cReason}=funding;
  const kundeValid=kunde.name.trim().length>1&&(kunde.email.trim().includes("@")||kunde.telefon.trim().length>5);

  const handlePdf=useCallback(()=>{
    const html=buildPdfHtml(details,totals,funding,kunde);
    const w=window.open("","_blank");
    if(w){w.document.write(html);w.document.close();}
    setPdfGenerated(true);
  },[details,totals,funding,kunde]);

  const buildMailto=useCallback(()=>{
    const posText=details.map((d,i)=>{
      let t=`\nPos. ${i+1}: ${d.qty}x ${d.model} ${d.size} (${DIMS[d.size]} cm) ${GL[d.glazing].l}`;
      if(d.shutterQty>0)t+=` + ${d.shutterQty}x ${SHUTTERS[d.shutter].short}`;
      if(d.blindQty>0)t+=` + ${d.blindQty}x ${BLINDS[d.blind].short}`;
      t+=`\n  Material: ${fmt(d.matPos)} EUR | Einbau: ab ${fmt(d.labPos)} EUR`;
      return t;}).join("");
    const ft=(beg?`\n\nAlternative A – BEG EM (BAFA): moeglicher Zuschuss bis zu ${fmt(beg.amountMax)} EUR (Maximalwert unter Annahmen; foerderrelevante Bruttokosten ${fmt(beg.eligibleCostsGross)} EUR)`:"")
      +(tax35c?`\nAlternative B – §35c EStG: moegliche Steuerermaessigung bis zu ${fmt(tax35c.totalMax)} EUR ueber drei Jahre`:"")
      +(beg||tax35c?`\nBeide Wege sind nicht kombinierbar.`:"");
    const ad=kunde.strasse?`\nStrasse: ${kunde.strasse}`:"";
    const po=(kunde.plz||kunde.ort)?`\nPLZ/Ort: ${kunde.plz} ${kunde.ort}`:"";
    const subject=encodeURIComponent(`Angebotsanfrage VELUX Dachfenster – ${kunde.name.trim()}`);
    const body=encodeURIComponent(`Guten Tag,\n\nich moechte ein unverbindliches Angebot anfragen.\nDie detaillierte Kostenschaetzung ist als PDF beigefuegt.\n${posText}\n\nGesamt: ab ${fmt(totalNetto)} EUR netto (${fmt(totalBrutto)} EUR brutto inkl. MwSt.)${ft}\n\nKontaktdaten:\nName: ${kunde.name}${ad}${po}\nE-Mail: ${kunde.email}\nTelefon: ${kunde.telefon}${kunde.nachricht?`\nAnmerkung: ${kunde.nachricht}`:""}\n\nMit freundlichen Gruessen\n${kunde.name}`);
    return`mailto:info@rex-bedachung.de?subject=${subject}&body=${body}`;
  },[details,beg,tax35c,totalNetto,totalBrutto,kunde]);

  const buildKonfigText = () => {
    return details.map((d, i) =>
      `Pos ${i+1}: ${d.qty}× ${d.model} ${d.size} (${DIMS[d.size]} cm) ${GL[d.glazing].l}` +
      (d.shutterQty > 0 ? ` + ${d.shutterQty}× ${SHUTTERS[d.shutter].short}` : "") +
      (d.blindQty > 0 ? ` + ${d.blindQty}× ${BLINDS[d.blind].short}` : "") +
      ` → ab ${fmt(d.matPos + d.labPos)} € netto`
    ).join("\n") +
    `\n\nKostenschätzung netto: ab ${fmt(totalNetto)} €` +
    `\nKostenschätzung brutto: ab ${fmt(totalBrutto)} €` +
    (beg ? `\nBEG EM (BAFA): bis zu ${fmt(beg.amountMax)} € (${beg.rateLabel}; förderrelevant brutto ${fmt(beg.eligibleCostsGross)} €)` : `\nBEG EM (BAFA): nicht ausgewiesen – ${begReason}`) +
    (tax35c ? `\n§35c EStG: bis zu ${fmt(tax35c.totalMax)} € (${fmt(tax35c.year1)} / ${fmt(tax35c.year2)} / ${fmt(tax35c.year3)} €)` : `\n§35c EStG: nicht ausgewiesen – ${tax35cReason}`) +
    `\nFörder-Check: Gebäudealter=${foerderung.buildingAge}, Fenstertausch=${foerderung.energyRenovation}, Selbstnutzung=${foerderung.ownerOccupied}, iSFP=${foerderung.hasIsfp}` +
    `\nRegelstand: ${RULES.beg.rulesVersion} / ${RULES.tax35c.rulesVersion}, geprüft ${RULES.beg.lastReviewedAt}`;
  };

  const handleSubmitAndPdf = async () => {
    setSubmitting(true);
    setSubmitError(false);

    try{if(sessionStorage.getItem(APPLIED_SESSION_KEY)==="1")emitWebMCPEvent({event:"cta_transition"});}catch{}
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
      <div id={RESULT_ANCHOR_ID} tabIndex={-1} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white outline-none focus-visible:ring-2 focus-visible:ring-white/60">
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
          <div className="flex justify-between pt-1"><span className="text-slate-600">Kostenschätzung netto</span><span className="font-semibold text-slate-700">ab {fmt(totalNetto)} €</span></div>
          <div className="flex justify-between text-slate-500 text-xs"><span>zzgl. 19 % MwSt.</span><span>{fmt(mwst)} €</span></div>
          <div className="border-t border-slate-300 pt-2.5 mt-2.5 flex justify-between items-baseline pb-1">
            <span className="font-bold text-slate-900">Kostenschätzung brutto (inkl. MwSt.)</span><span className="text-xl font-bold text-slate-900">ab {fmt(totalBrutto)} €</span></div>

          <div className="mt-4 space-y-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fördermöglichkeiten — zwei Alternativen, nicht kombinierbar</div>
            <p className="text-xs text-slate-500">{SCOPE_NOTE} {FUNDING_NOTES.noRecommendation}</p>
            {hasIneligible&&(
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5"/>
                <div className="text-xs text-amber-800">
                  <span className="font-semibold">Nicht förderrelevant:</span> {ineligibleCount} Position(en) mit THERMO-Verglasung. {FUNDING_NOTES.thermo}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
              <FundingCard title="Alternative A – BEG EM (BAFA-Zuschuss)" tone="emerald" scenario={beg} reason={begReason}
                rows={beg?[["Förderrelevante Kosten (brutto, nur Uw ≤ 1,0)",`${fmt(beg.eligibleCostsGross)} €`],...(beg.capApplied?[["Höchstgrenze je Wohneinheit und Jahr",`${fmt(beg.cap)} €`]]:[]),["Fördersatz",beg.rateLabel]]:[]}
                amountLabel="Möglicher BAFA-Zuschuss" amount={beg?beg.amountMax:0} remaining={beg?totalBrutto-beg.amountMax:0}
                notes={beg?[FUNDING_NOTES.kfw,FUNDING_NOTES.fachplanung,...(beg.isfpBonus===0?[`Hinweis zum iSFP: ${FUNDING_NOTES.isfp}`]:[])]:[]}/>
              <FundingCard title="Alternative B – Steuerermäßigung §35c EStG" tone="blue" scenario={tax35c} reason={tax35cReason}
                rows={tax35c?[["Bemessungsgrundlage (brutto, nur Uw ≤ 1,0)",`${fmt(tax35c.base)} €`],...(tax35c.capApplied?[["Höchstbetrag je Objekt","40.000 €"]]:[]),["Jahr 1 (7 %) / Jahr 2 (7 %) / Jahr 3 (6 %)",`${fmt(tax35c.year1)} / ${fmt(tax35c.year2)} / ${fmt(tax35c.year3)} €`]]:[]}
                amountLabel="Mögliche Steuerermäßigung gesamt" amount={tax35c?tax35c.totalMax:0} remaining={tax35c?totalBrutto-tax35c.totalMax:0}
                notes={tax35c?[FUNDING_NOTES.taxRequirements]:[]}/>
            </div>
            <p className="text-xs text-slate-500">{FUNDING_NOTES.notCombinable}</p>
            <p className="text-[10px] text-slate-400">Regelstand: {RULES.beg.label} (Richtlinie ab {deDate(RULES.beg.effectiveFrom)}) · {RULES.tax35c.label} · geprüft am {deDate(RULES.beg.lastReviewedAt)}</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5"/>
        <div className="text-xs text-amber-800 space-y-1">
          <p className="font-semibold">Hinweis zu den angegebenen Preisen:</p>
          <p>{DISCLAIMER}</p>
          <p><span className="font-semibold">Enthalten / angenommen:</span> {ASSUMPTIONS.join("; ")}.</p>
          <p><span className="font-semibold">Nicht enthalten:</span> {EXCLUSIONS.join(", ")}.</p>
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
  const [foerderung,setFoerderung]=useState(EMPTY_FUNDING_ANSWERS);
  const canStep1=positions.length>0&&positions.every(p=>p.model&&p.size&&p.glazing);
  const canStep2=isFundingComplete(foerderung);

  // WebMCP-Verdrahtung (kein Effekt ohne Flag): Bridge + vier Tools, Lebensdauer = diese Komponente
  const [announce,setAnnounce]=useState("");
  const bridge=useVeluxBridge({positions,funding:foerderung,step,setPositions,setFunding:setFoerderung,setStep,announce:setAnnounce,makeId:uid});
  const tools=useMemo(()=>buildVeluxTools(bridge),[bridge]);
  const webmcpOn=useMemo(()=>isWebMCPEnabled(),[]);
  useWebMCPTool(tools.options,webmcpOn);
  useWebMCPTool(tools.resolve,webmcpOn);
  useWebMCPTool(tools.calculate,webmcpOn);
  useWebMCPTool(tools.apply,webmcpOn);

  return(
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}.animate-fadeIn{animation:fadeIn .25s ease-out}`}</style>
      <div className="bg-slate-900 text-white"><div className="max-w-3xl mx-auto px-4 py-8 sm:py-10 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-xs font-medium mb-3"><Shield className="w-3.5 h-3.5"/>Autorisierter VELUX-Partner in Bochum</div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">VELUX Dachfenster Preisrechner</h1>
        <p className="text-slate-300 mt-2 text-sm">Kosten, Eindeckrahmen und Fördermöglichkeiten berechnen</p>
      </div></div>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div aria-live="polite" className="sr-only">{announce}</div>
        <Steps step={step}/>
        {step===1&&<Step1 positions={positions} setPositions={setPositions}/>}
        {step===2&&<Step2 foerderung={foerderung} setFoerderung={setFoerderung}/>}
        {step===3&&<Step3 positions={positions} foerderung={foerderung}/>}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
          {step>1?<button onClick={()=>setStep(s=>s-1)} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-medium"><ChevronLeft className="w-4 h-4"/>Zurück</button>:<div/>}
          {step<3&&(<button onClick={()=>setStep(s=>s+1)} disabled={step===1?!canStep1:!canStep2}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${(step===1?canStep1:canStep2)?"bg-slate-800 text-white hover:bg-slate-700 shadow-md":"bg-slate-200 text-slate-400 cursor-not-allowed"}`}>
            {step===1?"Weiter zur Förderung":"Kosten berechnen"}<ChevronRight className="w-4 h-4"/></button>)}
          {step===3&&(<button onClick={()=>{setStep(1);setPositions([emptyPos()]);setFoerderung(EMPTY_FUNDING_ANSWERS);}}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"><Calculator className="w-4 h-4"/>Neue Berechnung</button>)}
        </div>
      </div>
    </div>);
}
