import { useState } from "react";

const faqData = [
  {
    q: "Was kostet ein VELUX Dachfenster mit Einbau in Bochum?",
    a: "Die Gesamtkosten hängen von Fenstertyp, Größe, Verglasung und Zubehör ab. Ein Kunststoff-Schwingfenster (GGU) in Standardgröße MK08 mit ENERGIE-Verglasung, Eindeckrahmen und Einbau beginnt ab ca. 1.800 € netto. Klapp-Schwingfenster (GPU/GPL) liegen höher. Nutzen Sie unseren Preisrechner oben für eine individuelle Kostenschätzung."
  },
  {
    q: "Welche VELUX Verglasung ist förderfähig über die BAFA?",
    a: "Nur Verglasungen mit einem Uw-Wert von maximal 1,0 W/m²K sind über die BAFA (BEG Einzelmaßnahme) förderfähig. Bei VELUX erfüllen das die Verglasungsstufen ENERGIE (Uw 1,0) und ENERGIE PLUS (Uw 0,7). Die Standardverglasung THERMO (Uw 1,3) ist nicht förderfähig."
  },
  {
    q: "Wie hoch ist die BAFA-Förderung für neue Dachfenster?",
    a: "Der Grundfördersatz beträgt 15 % der förderfähigen Bruttokosten. Mit einem individuellen Sanierungsfahrplan (iSFP) steigt der Satz auf 20 % und der Förderhöchstbetrag verdoppelt sich von 30.000 € auf 60.000 € pro Wohneinheit und Jahr. Zusätzlich sind 50 % der Kosten für den Energieeffizienz-Experten als separater Zuschuss erhältlich."
  },
  {
    q: "Was ist der Unterschied zwischen BAFA-Zuschuss und Steuerbonus §35c?",
    a: "Der BAFA-Zuschuss (15–20 %) wird direkt ausgezahlt, erfordert aber einen Energieeffizienz-Experten und einen Antrag vor Baubeginn. Der Steuerbonus nach §35c EStG bietet 20 % Steuerermäßigung über drei Jahre (7 %/7 %/6 %), braucht keinen Energieberater, gilt aber nur für selbstgenutztes Wohneigentum ab 10 Jahren Gebäudealter. Beide Wege sind nicht für dieselbe Maßnahme kombinierbar."
  },
  {
    q: "Was ist im Einbaupreis für ein VELUX Dachfenster enthalten?",
    a: "Unsere Einbaukalkulation umfasst: Demontage des Altfensters bzw. Erstellung der Dachöffnung, Fenstereinbau mit Abdichtung und Dampfbremse, Eindeckrahmen-Montage sowie optional Rollladen- und Rollo-Montage. Die angegebenen Preise sind Mindestpreise — der tatsächliche Aufwand hängt vom Dachaufbau, der Eindeckung und dem Bestandszustand ab."
  },
  {
    q: "Welchen Eindeckrahmen brauche ich für mein VELUX Dachfenster?",
    a: "Für Dachziegel und Dachsteine bis 120 mm Profilhöhe verwenden wir standardmäßig den EDW 2000 (Ziegel hoch/Welle). Bei Flachdacheindeckungen, Schiefer oder Biberschwanz kommen andere Eindeckrahmen-Typen zum Einsatz. Den passenden Rahmen klären wir bei der Vor-Ort-Begehung — er ist in unserer Kostenschätzung bereits berücksichtigt."
  },
  {
    q: "Kann ich den KfW-Ergänzungskredit mit der BAFA-Förderung kombinieren?",
    a: "Ja. Nach der BAFA-Förderzusage können Sie zusätzlich den KfW-Ergänzungskredit (Programm 358/359) über bis zu 120.000 € pro Wohneinheit beantragen. Bei einem Haushaltseinkommen bis 90.000 € gelten besonders günstige Zinskonditionen über KfW 358 Plus."
  },
  {
    q: "Wie läuft ein Dachfenster-Austausch bei Rex Bedachungs GmbH ab?",
    a: "Nach Ihrer Anfrage vereinbaren wir einen Vor-Ort-Termin in Bochum und Umgebung, prüfen den Dachaufbau und erstellen ein verbindliches Festangebot. Bei Förderwunsch koordinieren wir den Energieeffizienz-Experten und den BAFA-Antrag. Die Montage dauert je nach Umfang 1–3 Tage. Als autorisierter VELUX-Partner verbauen wir ausschließlich Original-VELUX-Produkte."
  }
];

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);

const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

const CalcIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><line x1="8" y1="10" x2="8" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="8" y1="18" x2="8" y2="18"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);

export default function VeluxPreisrechnerPreview() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#f8fafc', minHeight: '100vh' }}>

      {/* ══════ Rechner Header ══════ */}
      <div style={{ background: '#0f172a', color: 'white', padding: '32px 16px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', padding: '6px 14px', fontSize: '12px', fontWeight: 500, marginBottom: '12px' }}>
          <ShieldIcon />
          VELUX Fachpartner in Bochum
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>VELUX Dachfenster Preisrechner</h1>
        <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '14px' }}>Kosten, Eindeckrahmen und Fördermöglichkeiten berechnen</p>
      </div>

      {/* ══════ Rechner Platzhalter ══════ */}
      <div style={{ maxWidth: '672px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '28px' }}>
          {['Konfiguration', 'Förderung', 'Ergebnis'].map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 500,
                background: i === 0 ? '#1e293b' : '#f1f5f9',
                color: i === 0 ? 'white' : '#94a3b8',
                boxShadow: i === 0 ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
              }}>
                <span style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>{i + 1}</span>
                {label}
              </div>
              {i < 2 && <ChevronIcon />}
            </div>
          ))}
        </div>

        <div style={{
          background: 'white', border: '2px dashed #cbd5e1', borderRadius: '16px',
          padding: '48px 24px', textAlign: 'center', color: '#64748b'
        }}>
          <CalcIcon />
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#334155', marginTop: '12px' }}>Interaktiver Rechner</p>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>3-Stufen-Konfigurator: Fenstertyp → Förder-Check → Ergebnis mit PDF</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
            {['GGU Kunststoff', 'GGL Holz', 'GPU Klapp-Schwing', 'GPL Holz Klapp'].map(t => (
              <span key={t} style={{ fontSize: '11px', background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', color: '#475569' }}>{t}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px', flexWrap: 'wrap' }}>
            {['THERMO Uw 1,3', 'ENERGIE Uw 1,0', 'ENERGIE PLUS Uw 0,7'].map(t => (
              <span key={t} style={{ fontSize: '11px', background: '#ecfdf5', padding: '4px 10px', borderRadius: '6px', color: '#047857' }}>{t}</span>
            ))}
          </div>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '16px' }}>Netlify Forms Submit + PDF-Erzeugung + BAFA/§35c-Berechnung</p>
        </div>
      </div>

      {/* ══════ Statischer Content-Block ══════ */}
      <div style={{ background: 'white', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '672px', margin: '0 auto', padding: '48px 16px' }}>

          {/* Direktantwort */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '19px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>Was kostet ein VELUX Dachfenster mit Einbau?</h2>
            <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: 1.7 }}>
              Die Gesamtkosten für ein VELUX Dachfenster setzen sich aus dem Fensterpreis, Eindeckrahmen, optionalem Zubehör (Rollladen, Verdunkelungsrollo) und den Einbaukosten zusammen. In Bochum beginnen die Kosten für ein Kunststoff-Schwingfenster mit ENERGIE-Verglasung, Eindeckrahmen und fachgerechtem Einbau ab ca. 1.800 € netto. Klapp-Schwingfenster, größere Formate oder die hochdämmende ENERGIE-PLUS-Verglasung liegen entsprechend höher. Mit unserem Preisrechner berechnen Sie Ihre individuelle Kostenschätzung — inkl. Prüfung der BAFA-Förderung und des Steuerbonus nach §35c EStG. Als autorisierter VELUX-Partner in Bochum erstellen wir nach der Kostenschätzung ein verbindliches Festangebot nach Vor-Ort-Begehung.
            </p>
          </section>

          {/* Preiszusammensetzung */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '19px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>Woraus setzt sich der Preis zusammen?</h2>
            <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: 1.7, marginBottom: '10px' }}>
              Jede Position in der Kostenschätzung enthält vier Bausteine: das Fenster selbst (VELUX UVP 2026 netto), den passenden Eindeckrahmen (EDW 2000 für Ziegeldächer), optionales Zubehör und die Einbaukosten. Die Materialpreise basieren auf der unverbindlichen Preisempfehlung von VELUX für 2026 — Ihr tatsächliches Angebot kann je nach Einkaufskonditionen abweichen.
            </p>
            <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: 1.7 }}>
              Die Einbaukosten umfassen Demontage des Altfensters oder Erstellung der Dachöffnung, den fachgerechten Fenstereinbau mit Abdichtung und Dampfbremsenanschluss, die Eindeckrahmen-Montage sowie bei Bedarf die Rollladen- und Rollo-Installation. Die angegebenen Einbaupreise sind Mindestpreise — der tatsächliche Aufwand hängt vom Dachaufbau, der vorhandenen Eindeckung und dem Bestandszustand ab.
            </p>
          </section>

          {/* Verglasung */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '19px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>Welche Verglasung ist förderfähig?</h2>
            <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: 1.7, marginBottom: '10px' }}>
              VELUX bietet drei Verglasungsstufen an: THERMO (Uw 1,3 W/m²K), ENERGIE (Uw 1,0 W/m²K) und ENERGIE PLUS (Uw 0,7 W/m²K). Für die BAFA-Förderung im Rahmen der BEG Einzelmaßnahme ist ein Uw-Wert von maximal 1,0 W/m²K vorgeschrieben — das bedeutet: nur ENERGIE und ENERGIE PLUS sind förderfähig. Die THERMO-Verglasung erfüllt zwar die GEG-Mindestanforderung, nicht aber die strengere BEG-Vorgabe.
            </p>
            {/* Verglasungstabelle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '16px' }}>
              {[
                { name: 'THERMO', uw: '1,3', foerder: false, color: '#fef3c7', border: '#fde68a', text: '#92400e', badge: 'Nicht förderfähig' },
                { name: 'ENERGIE', uw: '1,0', foerder: true, color: '#ecfdf5', border: '#a7f3d0', text: '#047857', badge: 'BAFA-förderfähig' },
                { name: 'ENERGIE PLUS', uw: '0,7', foerder: true, color: '#ecfdf5', border: '#6ee7b7', text: '#047857', badge: 'BAFA-förderfähig' }
              ].map(v => (
                <div key={v.name} style={{ background: v.color, border: `1px solid ${v.border}`, borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: v.text }}>{v.name}</div>
                  <div style={{ fontSize: '12px', color: v.text, opacity: 0.8, marginTop: '2px' }}>Uw {v.uw} W/m²K</div>
                  <div style={{ fontSize: '10px', fontWeight: 600, marginTop: '6px', color: v.text, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    {v.foerder && <CheckIcon />}
                    {v.badge}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: 1.7, marginTop: '14px' }}>
              Unser Preisrechner zeigt Ihnen automatisch, welche Positionen förderfähig sind und berechnet den geschätzten Zuschuss. Für Eigentümer ohne individuellen Sanierungsfahrplan (iSFP) prüft der Rechner zusätzlich, ob der Steuerbonus nach §35c EStG mit 20 % Steuerermäßigung die bessere Option ist.
            </p>
          </section>

          {/* Förderoptionen */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '19px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>BAFA, iSFP oder Steuerbonus — welche Förderung passt?</h2>
            <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: 1.7, marginBottom: '10px' }}>
              Drei Förderwege stehen zur Verfügung: Der BAFA-Zuschuss (15 % Grundförderung, 20 % mit iSFP) wird direkt ausgezahlt und kann mit dem KfW-Ergänzungskredit (Programm 358/359, bis 120.000 € pro Wohneinheit) kombiniert werden. Der Steuerbonus nach §35c EStG bietet 20 % Steuerermäßigung über drei Jahre ohne Energieberater, erfordert aber selbstgenutztes Wohneigentum und ein Gebäudealter ab 10 Jahren. Beide Wege sind nicht für dieselbe Maßnahme kombinierbar.
            </p>
            <a href="#" onClick={e => e.preventDefault()} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '14px', fontWeight: 600, color: '#0f172a',
              textDecoration: 'underline', textDecorationColor: '#cbd5e1', textUnderlineOffset: '3px'
            }}>
              Vollständige Förder-Checkliste (14 Schritte) →
            </a>
          </section>

          {/* FAQ */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '19px', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>Häufige Fragen zum VELUX Dachfenster-Preis</h2>
            <div>
              {faqData.map((f, i) => (
                <div key={i} style={{
                  borderBottom: i < faqData.length - 1 ? '1px solid #e2e8f0' : 'none',
                  paddingBottom: '16px', marginBottom: '16px'
                }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', marginBottom: '6px', cursor: 'pointer' }}
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}>
                    {f.q}
                  </h3>
                  <p style={{
                    fontSize: '13.5px', color: '#475569', lineHeight: 1.65,
                    maxHeight: expandedFaq === i ? '300px' : '48px',
                    overflow: 'hidden', transition: 'max-height 0.3s ease'
                  }}>
                    {f.a}
                  </p>
                  {expandedFaq !== i && (
                    <button onClick={() => setExpandedFaq(i)} style={{
                      background: 'none', border: 'none', color: '#64748b', fontSize: '12px',
                      cursor: 'pointer', padding: '4px 0', fontWeight: 500
                    }}>Mehr lesen</button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Interne Links */}
          <section style={{ borderTop: '1px solid #e2e8f0', paddingTop: '32px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>Weiterführende Informationen</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { label: 'Dachfenster-Leistungen in Bochum', url: '/dachfenster-bochum' },
                { label: 'VELUX Dachfenster austauschen', url: '/velux-dachfenster-austausch-bochum' },
                { label: 'VELUX Rollläden & Sonnenschutz', url: '/velux-dachfenster-rolllaeden-bochum' },
                { label: 'Förder-Checkliste (BAFA/KfW)', url: '/foerderung' }
              ].map(link => (
                <a key={link.url} href="#" onClick={e => e.preventDefault()} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', borderRadius: '10px',
                  border: '1px solid #e2e8f0', textDecoration: 'none',
                  fontSize: '13px', color: '#334155', fontWeight: 500,
                  transition: 'all 0.15s', cursor: 'pointer'
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <span>{link.label}</span>
                  <ArrowIcon />
                </a>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section style={{
            background: '#f8fafc', borderRadius: '16px', padding: '28px',
            textAlign: 'center', border: '1px solid #e2e8f0'
          }}>
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Individuelle Beratung in Bochum</p>
            <p style={{ fontSize: '13.5px', color: '#475569', marginBottom: '18px', lineHeight: 1.6 }}>
              Sie möchten ein persönliches Angebot? Wir prüfen Ihr Dach vor Ort und erstellen eine verbindliche Kostenschätzung — kostenlos und unverbindlich.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#" onClick={e => e.preventDefault()} style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#1e293b', color: 'white', padding: '12px 22px',
                borderRadius: '12px', fontWeight: 600, fontSize: '14px',
                textDecoration: 'none', transition: 'background 0.15s'
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#334155'}
                onMouseLeave={e => e.currentTarget.style.background = '#1e293b'}
              >
                <PhoneIcon /> 0234 / 58 31 00
              </a>
              <a href="#" onClick={e => e.preventDefault()} style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'white', color: '#334155', padding: '12px 22px',
                borderRadius: '12px', fontWeight: 600, fontSize: '14px',
                border: '2px solid #cbd5e1', textDecoration: 'none', transition: 'all 0.15s'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.background = '#f8fafc'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = 'white'; }}
              >
                Kontaktformular
              </a>
            </div>
          </section>

          {/* Schema-Info (nur für Vorschau sichtbar) */}
          <div style={{
            marginTop: '32px', padding: '14px 16px',
            background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px',
            fontSize: '12px', color: '#1e40af'
          }}>
            <strong style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Schema (im &lt;head&gt;, nicht sichtbar)</strong>
            <div style={{ marginTop: '6px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['FAQPage (8 Fragen)', 'Service', 'Article', 'BreadcrumbList'].map(s => (
                <span key={s} style={{ background: '#dbeafe', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>{s}</span>
              ))}
            </div>
            <p style={{ marginTop: '6px', fontSize: '11px', opacity: 0.8 }}>
              + Helmet: Title, Meta Description, Canonical, OG Tags, twitter:card
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
