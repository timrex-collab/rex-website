import { useState } from "react";
import { Helmet } from "react-helmet";
import {
  Sun, Euro, Home, CheckCircle, XCircle, AlertTriangle,
  Phone, Mail, ChevronDown, ChevronUp, ArrowRight, Shield,
  FileCheck, Lightbulb, Info, Zap, Calendar, Hammer,
  ClipboardList, TrendingUp, Ban, Leaf,
} from "lucide-react";

// ─── Typen ───────────────────────────────────────────────────────────────────
type TrafficLight = "Pflicht" | "Prüfen" | "Nicht betroffen";
type ProjectType =
  | "Neubau Wohngebäude"
  | "Neubau Nichtwohngebäude"
  | "Dachsanierung (Bestand)"
  | "Kommunales Gebäude (Sanierung)"
  | "Parkplatz / Stellplätze"
  | "";

interface CheckResult {
  status: TrafficLight;
  reasons: string[];
  todos: string[];
}

// ─── Daten ───────────────────────────────────────────────────────────────────
const kpis = [
  { icon: <Calendar className="w-8 h-8" />, title: "Start Pflicht", val: "2026", detail: "Für Bestandsgebäude bei Dachsanierung" },
  { icon: <TrendingUp className="w-8 h-8" />, title: "Mindest-Quote", val: "30%", detail: "Der Netto- bzw. Bruttodachfläche" },
  { icon: <Ban className="w-8 h-8" />, title: "Ausnahmen", val: "10+", detail: "Bei techn./wirtsch. Unmöglichkeit" },
  { icon: <Leaf className="w-8 h-8" />, title: "Bußgeld max.", val: "5.000 €", detail: "Bei Verstoß gegen die Pflicht" },
];

const timeline = [
  { date: "01.01.2024", title: "Neubau Nichtwohngebäude", desc: "Gewerblich genutzte Neubauten (Büros, Handel, Industrie) müssen mit PV-Anlage ausgestattet werden. Stichtag: Bauantrag." },
  { date: "01.07.2024", title: "Kommunale Gebäude (Sanierung)", desc: "Gebäude im Eigentum von Städten und Gemeinden bei vollständiger Dachsanierung." },
  { date: "01.01.2025", title: "Neubau Wohngebäude", desc: "Alle neu beantragten Wohngebäude (EFH, MFH) müssen eine PV-Anlage erhalten. Stichtag: Einreichung des Bauantrags." },
  { date: "01.01.2026", title: "Bestandsgebäude – Dachsanierung", desc: "Bei vollständiger Erneuerung der Dachhaut aller Bestandsgebäude (Wohn- und Nichtwohngebäude). Stichtag: Beginn der Baumaßnahme.", highlight: true },
];

const requirements = [
  { type: "Neubau (alle)", rule: "30% der gesamten Bruttodachfläche", note: "Gesamte Dachfläche inkl. Überstände – nicht nur geeignete Fläche.", color: "bg-blue-50 border-blue-200" },
  { type: "EFH / ZFH (Sanierung)", rule: "3 kWp  oder  30% Nettofläche", note: "Ein- und Zweifamilienhäuser. Die kWp-Pauschalregel ist meist einfacher.", color: "bg-green-50 border-green-200" },
  { type: "MFH 3–5 WE (Sanierung)", rule: "4 kWp  oder  30% Nettofläche", note: "Mehrfamilienhaus mit 3 bis 5 Wohneinheiten.", color: "bg-purple-50 border-purple-200" },
  { type: "MFH 6–10 WE (Sanierung)", rule: "8 kWp  oder  30% Nettofläche", note: "Mehrfamilienhaus mit 6 bis 10 Wohneinheiten.", color: "bg-red-50 border-red-200" },
];

const exceptions = [
  "Gebäude mit Nutzfläche unter 50 m²",
  "Behelfsbauten: Gartenhäuser, Carports, Garagen",
  "Dächer aus Reet, Stroh oder Holz",
  "Glasdächer, Kunststoffplatten oder lichtdurchlässige Materialien",
  "Statische / konstruktive Unmöglichkeit der Montage",
  "Dach vollständig nach Norden ausgerichtet (nur Bestand)",
  "Keine Anbindung an das öffentliche Stromnetz",
  "Amortisationszeit länger als 25 Jahre",
  "Zusatzkosten übersteigen PV-Anschaffungskosten um > 70%",
  "Negative Netzverträglichkeitsprüfung durch Netzbetreiber",
  "Denkmalschutz (wenn PV den Auflagen widerspricht)",
  "Unbillige Härte (Befreiungsantrag erforderlich)",
];

const alternatives = [
  { icon: <Sun className="w-8 h-8 text-blue-600" />, title: "Solarthermie-Anlage", desc: "Eine Solarthermieanlage zur Wärmegewinnung wird als vollwertige Alternative anerkannt, sofern das wirtschaftliche Flächenpotenzial ausgeschöpft wird." },
  { icon: <FileCheck className="w-8 h-8 text-blue-600" />, title: "Gemietete PV-Anlage", desc: "Wer nicht kaufen möchte, kann eine gemietete Solaranlage (Leasing / Contracting) nutzen – das erfüllt die Pflicht ebenfalls vollständig." },
  { icon: <Zap className="w-8 h-8 text-purple-600" />, title: "Fassadenmontage", desc: "Module können auch an der Gebäudefassade anstatt auf dem Dach montiert werden, sofern die Mindestfläche bzw. -leistung erreicht wird." },
];

const rooferDuties = [
  { icon: <ClipboardList className="w-6 h-6 text-blue-600" />, title: "Aufklären & Beraten", text: "Als Dachdecker besteht eine aktive Hinweispflicht gegenüber Kunden bei Sanierungen ab 2026." },
  { icon: <FileCheck className="w-6 h-6 text-blue-600" />, title: "Rechtlich absichern", text: "Entscheidungen des Kunden (z. B. Inanspruchnahme einer Ausnahme) schriftlich dokumentieren und bestätigen lassen." },
  { icon: <Hammer className="w-6 h-6 text-blue-600" />, title: "Fachgerecht planen", text: "Statik prüfen. Brandschutzabstände beachten (bei Glas-Glas-Modulen in NRW oft kein Mindestabstand mehr nötig)." },
  { icon: <Shield className="w-6 h-6 text-blue-600" />, title: "Sanktionen vermeiden", text: "Bußgelder bis zu 5.000 € bei Verstößen möglich. Die Bauaufsichtsbehörde kontrolliert die Einhaltung." },
];

const faqItems = [
  { q: "Gilt die Pflicht auch, wenn ich nur einzelne Ziegel tausche?", a: "Nein. Die Solarpflicht greift nur bei vollständiger Erneuerung der Dachhaut – wenn das gesamte Dach neu eingedeckt oder abgedichtet wird. Der Austausch einzelner Dachpfannen oder Reparaturarbeiten lösen die Pflicht nicht aus." },
  { q: "Was ist der genaue Stichtag für Bestandsgebäude?", a: "Entscheidend ist der Beginn der Baumaßnahme. Wer vor dem 1. Januar 2026 angefangen hat, ist nicht betroffen – auch wenn Arbeiten ins Jahr 2026 hineinreichen. Für Neubauten gilt das Datum der Bauantragseinreichung." },
  { q: "Was ist der Unterschied zwischen Brutto- und Nettodachfläche?", a: "Bei Neubauten ist die Bruttodachfläche (inkl. Dachüberstände) die Basis für die 30%-Regel. Bei Sanierungen im Bestand zählt die Nettodachfläche – abzüglich ungeeigneter Flächen (Verschattung, Gauben, reine Nordseiten)." },
  { q: "Was passiert, wenn ich die Solarpflicht ignoriere?", a: "Die Bauaufsichtsbehörden kontrollieren die Einhaltung. Bei Verstößen droht ein Bußgeld von bis zu 5.000 €. Bei Neubauten erfolgt die Prüfung bei der Bauabnahme, bei Bestandsgebäuden durch stichprobenartige Kontrollen." },
  { q: "Gibt es Förderungen, die ich kombinieren kann?", a: "Ja! BAFA-Förderung (15–20% Zuschuss), KfW-Kredit 261 sowie der Steuerbonus nach § 35c EStG lassen sich nutzen. Die Kombination aus Pflicht und Förderung macht die Investition in den meisten Fällen wirtschaftlich sehr attraktiv." },
  { q: "Gilt die Pflicht auch für Denkmalschutzgebäude?", a: "Nur wenn die PV-Installation den denkmalschutzrechtlichen Auflagen nicht widerspricht. Andernfalls entfällt die Pflicht. Dies muss im Einzelfall mit der unteren Denkmalbehörde geprüft werden." },
  { q: "Was ist das Optimierungsgebot bei Neubauten?", a: "Bei Neubauten schreibt das Gesetz ein Optimierungsgebot vor: Schon bei der Planung soll das Dach möglichst gut für eine PV-Anlage geeignet sein. Das beeinflusst Dachneigung, -ausrichtung und Konstruktion." },
];

// ─── Schnellcheck-Logik (kein API-Key nötig) ─────────────────────────────────
function calculateResult(vorhaben: ProjectType, date: string): CheckResult | null {
  if (!vorhaben || !date) return null;
  const d = new Date(date);

  if (vorhaben === "Neubau Nichtwohngebäude") {
    if (d >= new Date("2024-01-01"))
      return { status: "Pflicht", reasons: ["Neubau Nichtwohngebäude", "Bauantrag ab 01.01.2024", "§ 42a BauO NRW greift vollumfänglich"], todos: ["Statik prüfen lassen", "30% Bruttodachfläche einplanen", "Netzanschluss mit Netzbetreiber klären", "Fördermittel BAFA/KfW prüfen"] };
    return { status: "Nicht betroffen", reasons: ["Bauantrag vor 01.01.2024", "Keine gesetzliche Pflicht"], todos: ["Freiwillige Installation prüfen", "Wirtschaftlichkeit berechnen"] };
  }

  if (vorhaben === "Neubau Wohngebäude") {
    if (d >= new Date("2025-01-01"))
      return { status: "Pflicht", reasons: ["Neubau Wohngebäude", "Bauantrag ab 01.01.2025", "Vollständig von § 42a BauO NRW betroffen"], todos: ["30% Bruttodachfläche einplanen", "Verschattungsanalyse beauftragen", "Brandschutzabstände beachten", "PV-Angebot einholen"] };
    if (d >= new Date("2024-01-01"))
      return { status: "Prüfen", reasons: ["Vor 2025 geplant", "Keine gesetzliche Pflicht", "Örtliche Satzungen ggf. prüfen"], todos: ["Lokale Bebauungspläne prüfen", "Fördermittel progres.nrw prüfen"] };
    return { status: "Nicht betroffen", reasons: ["Bauantrag vor 2024", "Keine gesetzliche Pflicht"], todos: ["Freiwillige Installation lohnt sich dennoch"] };
  }

  if (vorhaben === "Dachsanierung (Bestand)") {
    if (d >= new Date("2026-01-01"))
      return { status: "Pflicht", reasons: ["Vollständige Erneuerung der Dachhaut", "Beginn der Maßnahme ab 01.01.2026", "Sanierungspflicht greift gemäß § 42a BauO NRW"], todos: ["Option wählen: 30% Nettofläche ODER kWp-Pauschalregel", "Statik des Bestandsdachs prüfen", "Ausnahmetatbestände prüfen (Statik, Wirtschaftlichkeit)", "BAFA-Förderung beantragen (15–20% Zuschuss)"] };
    return { status: "Nicht betroffen", reasons: ["Sanierungsbeginn vor 01.01.2026", "Keine gesetzliche Pflicht"], todos: ["Freiwillige Installation empfohlen", "Dachsanierung und PV ideal kombinieren"] };
  }

  if (vorhaben === "Kommunales Gebäude (Sanierung)") {
    if (d >= new Date("2024-07-01"))
      return { status: "Pflicht", reasons: ["Kommunales Gebäude", "Dachsanierung ab 01.07.2024", "Verschärfte Pflicht für öffentliche Hand"], todos: ["Förderprogramme des Landes NRW prüfen", "Ausschreibungspflichten beachten"] };
    return { status: "Prüfen", reasons: ["Vor Juli 2024", "Freiwillige Umsetzung empfohlen"], todos: ["Frühzeitig planen"] };
  }

  if (vorhaben === "Parkplatz / Stellplätze") {
    return { status: "Prüfen", reasons: ["Pflicht ab > 35 Stellplätzen", "Gilt nur für Nichtwohngebäude", "Mindestbelegung 30% der Stellplatzfläche"], todos: ["Anzahl der Stellplätze prüfen", "Alternative: Je 5 Stellplätze einen Laubbaum pflanzen", "Wirtschaftlichkeitsberechnung erstellen"] };
  }

  return { status: "Nicht betroffen", reasons: ["Keine gesetzliche Pflicht zum gewählten Zeitpunkt"], todos: ["Freiwillige Installation prüfen"] };
}

// ─── Haupt-Komponente ─────────────────────────────────────────────────────────
export default function Solarpflicht() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [checkStep, setCheckStep] = useState(1);
  const [vorhaben, setVorhaben] = useState<ProjectType>("");
  const [date, setDate] = useState("");
  const [size, setSize] = useState("");
  const result = calculateResult(vorhaben, date);

  return (
    <>
      <Helmet>
        <title>Solarpflicht NRW 2026 | Was Eigentümer wissen müssen | Rex Bedachungs GmbH</title>
        <meta name="description" content="Ab 1. Januar 2026 gilt in NRW die Solarpflicht auch bei Dachsanierungen. Rex Bedachungs GmbH Bochum erklärt Regeln, Ausnahmen, Mindestgrößen und Schnellcheck." />
        <meta property="og:title" content="Solarpflicht NRW 2026 | Rex Bedachungs GmbH Bochum" />
        <meta property="og:description" content="Solarpflicht bei Dachsanierung in NRW ab 2026. Alle Regeln, Ausnahmen, kWp-Tabelle und interaktiver Schnellcheck." />
        <script type="application/ld+json">{`{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Solarpflicht NRW 2026",
          "description": "Informationen zur Solardachpflicht in NRW – § 42a BauO NRW, SAN-VO NRW",
          "url": "https://www.rex-bedachung.de/solarpflicht",
          "provider": {
            "@type": "RoofingContractor",
            "name": "Rex Bedachungs GmbH",
            "telephone": "0234583100",
            "address": {"@type": "PostalAddress", "streetAddress": "Paulinenstraße 22", "addressLocality": "Bochum", "postalCode": "44799"}
          }
        }`}</script>
      </Helmet>

      {/* ── Hero ── */}
      <header className="relative text-white py-20 px-4 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1c1917 60%, #1a2744 100%)" }}>
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: "radial-gradient(circle at 15% 50%, #1e40af 0%, transparent 45%), radial-gradient(circle at 85% 20%, #3b82f6 0%, transparent 40%)" }} />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1 mb-6">
            <Sun className="w-4 h-4 text-blue-300" />
            <span className="text-sm font-medium text-blue-100 uppercase tracking-wider">§ 42a BauO NRW – In Kraft seit 01.01.2026</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Solarpflicht NRW 2026:<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
              Was Eigentümer jetzt wissen müssen
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Seit dem 1. Januar 2026 gilt in NRW: Wer sein Dach vollständig saniert, muss eine Photovoltaikanlage installieren.
            Alle Regeln, Ausnahmen, Mindestgrößen – plus interaktiver Schnellcheck.
          </p>
          <a href="#schnellcheck"
            className="inline-flex items-center gap-2 text-white border border-white/30 bg-white/10 hover:bg-white/20 px-8 py-4 rounded-full transition font-bold">
            <ClipboardList className="w-5 h-5" />
            Schnellcheck starten
          </a>
        </div>
      </header>

      {/* ── Warn-Box ── */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-20 mb-16">
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-md shadow-lg flex items-start gap-4">
          <AlertTriangle className="w-10 h-10 text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-blue-900 mb-1">Betrifft Sie bei der nächsten vollständigen Dachsanierung!</h3>
            <p className="text-blue-800">Ab dem <strong>1. Januar 2026</strong> muss bei jeder vollständigen Dacherneuerung gleichzeitig eine PV-Anlage installiert werden.
              Einfache Reparaturen und der Austausch einzelner Ziegel sind <strong>nicht</strong> betroffen. Stichtag ist der <strong>Beginn der Baumaßnahme</strong>.</p>
          </div>
        </div>
      </div>

      {/* ── KPI-Kacheln ── */}
      <section className="py-10 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, idx) => (
              <div key={idx} className="bg-card rounded-md border border-border p-6 hover:shadow-md transition text-center">
                <div className="text-blue-600 flex justify-center mb-4">{kpi.icon}</div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">{kpi.title}</div>
                <div className="text-3xl font-black mb-2">{kpi.val}</div>
                <p className="text-xs text-muted-foreground leading-relaxed">{kpi.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mythos vs Fakt ── */}
      <section className="py-10 bg-muted">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-8">Mythos vs. Fakt</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 p-6 rounded-md border border-red-100">
              <div className="font-bold text-red-600 mb-3 uppercase text-sm tracking-widest">Mythos</div>
              <p className="text-foreground italic">„Die Solarpflicht gilt rückwirkend für alle Häuser – ich muss sofort eine PV-Anlage installieren."</p>
            </div>
            <div className="bg-green-50 p-6 rounded-md border border-green-100">
              <div className="font-bold text-green-700 mb-3 uppercase text-sm tracking-widest">Fakt</div>
              <p className="text-foreground font-medium">Die Pflicht ist gestaffelt. Für Bestandsgebäude gilt sie <strong>erst</strong>, wenn die Dachhaut vollständig erneuert wird – und nur wenn die Baumaßnahme ab 01.01.2026 begonnen wird.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Zeitplan ── */}
      <section id="zeitplan" className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Die gestaffelte Einführung in NRW</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Geregelt in <strong>§ 42a Landesbauordnung NRW (BauO NRW)</strong> und der <strong>Solaranlagenverordnung NRW (SAN-VO NRW)</strong>.</p>
          </div>
          <div className="space-y-4">
            {timeline.map((item, idx) => (
              <div key={idx} className={`flex gap-6 p-6 rounded-md border ${item.highlight ? "bg-blue-50 border-blue-300 shadow-md" : "bg-card border-border"}`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white ${item.highlight ? "bg-blue-600" : "bg-blue-700"}`}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-bold uppercase tracking-widest mb-1 ${item.highlight ? "text-blue-700" : "text-muted-foreground"}`}>{item.date}</div>
                  <h3 className={`font-bold text-lg mb-1 ${item.highlight ? "text-blue-900" : ""}`}>{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  {item.highlight && <span className="mt-2 inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full"><Sun className="w-3 h-3" /> Jetzt aktuell</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mindestgrößen + Flächenregel ── */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Wie groß muss die Anlage sein?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Zwei Optionen: Flächenbasiert (30%) oder Leistungsbasiert (kWp-Pauschale für Bestandsgebäude bis 10 WE).</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {requirements.map((req, idx) => (
              <div key={idx} className={`rounded-md border p-6 ${req.color}`}>
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">{req.type}</div>
                <div className="text-xl font-black mb-3 leading-snug">{req.rule}</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{req.note}</p>
              </div>
            ))}
          </div>

          {/* Brutto vs Netto Erklärung */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-card p-6 rounded-md border border-border">
              <h3 className="font-bold text-lg mb-3 text-blue-700">Bruttodachfläche (Neubauten)</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bei Neubauten ist die <strong>Bruttodachfläche</strong> (inkl. Dachüberstände) die Berechnungsbasis für die 30%-Regel. Dies gilt für die gesamte Dachfläche ohne Abzüge.
              </p>
            </div>
            <div className="bg-card p-6 rounded-md border border-border">
              <h3 className="font-bold text-lg mb-3 text-green-700">Nettodachfläche (Sanierungen)</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bei Bestandssanierungen zählt die <strong>Nettodachfläche</strong> – abzüglich ungeeigneter Flächen wie verschattete Bereiche, Gauben oder rein nördlich ausgerichtete Dachflächen.
              </p>
            </div>
          </div>

          <div className="bg-card rounded-md border border-border p-6 flex items-start gap-4">
            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <strong>Brandschutz-Update NRW:</strong> Die Abstandsregeln zu Brandwänden wurden gelockert. Bei Glas-Glas-Modulen ist oft kein Mindestabstand mehr nötig – das erhöht die nutzbare Fläche deutlich.
            </p>
          </div>
        </div>
      </section>

      {/* ── Entscheidungsfluss ── */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-10">Entscheidungslogik auf einen Blick</h2>
          <div className="bg-card border border-border rounded-md p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-blue-50 border-2 border-blue-400 p-4 rounded-md text-center w-64 font-bold">Baumaßnahme in NRW?</div>
              <div className="text-muted-foreground">↓</div>
              <div className="bg-blue-50 border-2 border-blue-400 p-4 rounded-md text-center w-64 font-bold">Neubau oder Sanierung?</div>
              <div className="flex gap-8 md:gap-32 mt-4 w-full justify-center">
                <div className="flex flex-col items-center gap-3">
                  <span className="text-sm font-bold text-blue-700">Neubau</span>
                  <div className="text-muted-foreground">↓</div>
                  <div className="bg-card border border-border text-xs text-center p-3 rounded-md w-36 shadow-sm">NWG ab 2024<br />WG ab 2025</div>
                  <div className="text-muted-foreground">↓</div>
                  <div className="bg-blue-700 text-white p-3 rounded-md font-bold text-xs text-center w-36">30% Bruttofläche</div>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <span className="text-sm font-bold text-blue-700">Dachsanierung</span>
                  <div className="text-muted-foreground">↓</div>
                  <div className="bg-card border border-border text-xs text-center p-3 rounded-md w-36 shadow-sm">Start ab 01.01.2026<br />(Dachhaut vollständig)</div>
                  <div className="text-muted-foreground">↓</div>
                  <div className="bg-blue-600 text-white p-3 rounded-md font-bold text-xs text-center w-36">30% Netto ODER kWp-Regel</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Schnellcheck ── */}
      <section id="schnellcheck" className="py-16 bg-muted">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Solar-Schnellcheck NRW</h2>
            <p className="text-muted-foreground">Prüfen Sie in 30 Sekunden, ob die Solarpflicht für Ihr Vorhaben gilt.</p>
          </div>

          {checkStep === 1 ? (
            <div className="bg-card rounded-md shadow-lg border border-border p-8">
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-lg">Ihr Vorhaben</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">Schritt 1 von 2</span>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-muted-foreground">Art des Vorhabens</label>
                  <select
                    value={vorhaben}
                    onChange={(e) => setVorhaben(e.target.value as ProjectType)}
                    className="w-full border border-border rounded-md p-3 bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Bitte wählen...</option>
                    {(["Neubau Wohngebäude", "Neubau Nichtwohngebäude", "Dachsanierung (Bestand)", "Kommunales Gebäude (Sanierung)", "Parkplatz / Stellplätze"] as ProjectType[]).map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-muted-foreground">Voraussichtlicher Bauantrag / Maßnahmenbeginn</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-border rounded-md p-3 bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 uppercase tracking-wide text-muted-foreground">Dachfläche ca. (m², optional)</label>
                  <input
                    type="number"
                    placeholder="z. B. 120"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full border border-border rounded-md p-3 bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  disabled={!vorhaben || !date}
                  onClick={() => setCheckStep(2)}
                  className="w-full bg-blue-600 text-white py-4 rounded-md font-bold text-lg hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Ergebnis anzeigen <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-6">
              {/* Ergebnis-Header */}
              <div className={`rounded-md p-8 border-l-4 shadow-lg ${
                result.status === "Pflicht" ? "bg-red-50 border-red-500" :
                result.status === "Prüfen" ? "bg-yellow-50 border-yellow-500" : "bg-green-50 border-green-500"
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl font-black ${
                    result.status === "Pflicht" ? "bg-red-500" :
                    result.status === "Prüfen" ? "bg-yellow-500" : "bg-green-500"
                  }`}>
                    {result.status === "Pflicht" ? "!" : result.status === "Prüfen" ? "?" : "✓"}
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Ihr Ergebnis</div>
                    <h3 className="text-2xl font-black">{result.status}</h3>
                  </div>
                </div>
                <ul className="space-y-2">
                  {result.reasons.map((r, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" /> {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mindestbelegung Visualisierung */}
              {result.status === "Pflicht" && (
                <div className="bg-card border border-border rounded-md p-6 shadow-sm">
                  <h3 className="font-bold mb-4">Erforderliche Mindestbelegung</h3>
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2563eb" strokeWidth="3" strokeDasharray="30, 100" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-black text-blue-700">30%</div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Mindestens <strong>30% der Dachfläche</strong> (Brutto bei Neubau, Netto bei Sanierung) müssen mit PV-Modulen belegt werden – alternativ gilt die kWp-Pauschalregel für Bestandsgebäude.
                      {size ? ` Bei Ihrer Angabe von ${size} m² wären das ca. ${Math.ceil(parseFloat(size) * 0.3)} m² PV-Fläche.` : ""}
                    </p>
                  </div>
                </div>
              )}

              {/* Nächste Schritte */}
              <div className="bg-card rounded-md border border-border p-6 shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-blue-600" /> Ihre nächsten Schritte
                </h3>
                <div className="space-y-3">
                  {result.todos.map((todo, i) => (
                    <div key={i} className="flex gap-3 p-4 rounded-md bg-muted border border-border">
                      <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-blue-600">{i + 1}</span>
                      </div>
                      <span className="text-sm font-medium">{todo}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => { setCheckStep(1); setVorhaben(""); setDate(""); setSize(""); }}
                  className="flex-1 border-2 border-blue-500 text-blue-600 font-bold py-4 rounded-md hover:bg-blue-50 transition"
                >
                  Check wiederholen
                </button>
                <a href="/kontakt" className="flex-1 bg-blue-600 text-white text-center font-bold py-4 rounded-md hover:bg-blue-700 shadow-lg transition flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /> Beratung anfragen
                </a>
              </div>
              <p className="text-xs text-center text-muted-foreground italic">Finale Prüfung durch Ihre lokale Bauaufsichtsbehörde oder einen Fachbetrieb erforderlich.</p>
            </div>
          ) : null}
        </div>
      </section>

      {/* ── Rechtliche Grundlage ── */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="bg-card rounded-md p-8 md:p-12 shadow-sm border border-border flex flex-col md:flex-row items-center gap-8">
            <div className="bg-slate-800 p-4 rounded-md text-white flex-shrink-0">
              <Shield className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Rechtliche Grundlage: § 42a BauO NRW</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Die Solarpflicht ist in der <strong>Novellierung der Landesbauordnung NRW</strong> (Oktober 2023) und der ergänzenden <strong>Solaranlagenverordnung NRW (SAN-VO NRW)</strong> geregelt.
                Sie gilt für alle geeigneten Dachflächen von Gebäuden in NRW – sowohl Wohn- als auch Nichtwohngebäude.
              </p>
              <div className="flex items-center gap-2 text-slate-700 font-bold">
                <Info className="w-5 h-5 flex-shrink-0" />
                <span>Verstöße können mit Bußgeldern von bis zu <strong>5.000 €</strong> geahndet werden.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ausnahmen ── */}
      <section className="py-16 bg-muted">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Wann greift die Pflicht nicht?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Befreiungen müssen bei der lokalen Bauordnungsbehörde beantragt und genehmigt werden.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {exceptions.map((item, idx) => (
              <div key={idx} className="bg-card rounded-md border border-border p-4 flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-6 flex items-start gap-4">
            <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              <strong>Wirtschaftlichkeitshinweis:</strong> Die durchschnittliche Amortisationszeit liegt aktuell bei <strong>10–15 Jahren</strong>.
              Eine Befreiung wegen Unwirtschaftlichkeit (Amortisationszeit &gt; 25 Jahre) wird daher selten genehmigt.
              Wir beraten Sie kostenlos zur konkreten Situation Ihres Gebäudes.
            </p>
          </div>
        </div>
      </section>

      {/* ── Alternativen ── */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Alternativen zur Kauf-PV-Anlage</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Das Gesetz lässt mehrere gleichwertige Alternativen zu – Sie müssen nicht zwingend eine eigene Anlage kaufen.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {alternatives.map((alt, idx) => (
              <div key={idx} className="bg-card p-6 rounded-md border border-border hover:shadow-md transition text-center">
                <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">{alt.icon}</div>
                <h3 className="text-lg font-bold mb-3">{alt.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{alt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dachdecker-Pflichten + Förderung ── */}
      <section className="py-16 bg-muted">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 text-white rounded-md p-8">
              <div className="bg-blue-600 w-12 h-12 rounded-md flex items-center justify-center mb-6">
                <Hammer className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-blue-100">Pflichten für Dachdecker & Fachbetriebe</h3>
              <div className="space-y-4">
                {rooferDuties.map((duty, idx) => (
                  <div key={idx} className="flex gap-3 bg-white/5 p-4 rounded-md border border-white/10">
                    <div className="flex-shrink-0 mt-0.5 text-blue-400">{duty.icon}</div>
                    <div>
                      <div className="font-bold text-sm mb-1">{duty.title}</div>
                      <p className="text-slate-400 text-xs leading-relaxed">{duty.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-md p-8">
              <h3 className="text-2xl font-bold mb-4 text-blue-900">Förderung nicht vergessen!</h3>
              <p className="text-blue-800/80 mb-6 leading-relaxed">
                Die Solarpflicht und staatliche Förderungen schließen sich nicht aus – im Gegenteil. Wer sowieso saniert,
                kann zusätzlich <strong>15–20% BAFA-Förderung</strong> beantragen, KfW-Kredite nutzen und den Steuerbonus
                nach § 35c EStG in Anspruch nehmen.
              </p>
              <div className="bg-white p-4 rounded-md border border-blue-200 mb-6">
                <div className="font-bold text-blue-900 flex items-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-blue-500" /> Dachdecker-Tipp
                </div>
                <p className="text-sm text-blue-800 italic">
                  „Kombinieren Sie die Dachsanierung, die PV-Pflicht und die Förderanträge – so holen Sie das Maximum für Ihren Kunden heraus."
                </p>
              </div>
              <a href="/foerderung"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md font-bold hover:bg-blue-700 transition">
                Zur Förderungsseite <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Häufige Fragen zur Solarpflicht</h2>
          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div key={idx} className="bg-card rounded-md border border-border overflow-hidden">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-5 text-left font-medium hover:bg-muted transition"
                >
                  <span>{item.q}</span>
                  {activeAccordion === idx
                    ? <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-4" />
                    : <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-4" />}
                </button>
                {activeAccordion === idx && (
                  <div className="p-5 pt-0 text-muted-foreground bg-muted border-t border-border">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-4 mb-16 rounded-[2rem] p-12 text-center text-white shadow-2xl"
        style={{ background: "linear-gradient(135deg, #0f172a, #1e3a8a)" }}>
        <Sun className="w-16 h-16 text-blue-300 mx-auto mb-6 opacity-80" />
        <h2 className="text-3xl md:text-5xl font-black mb-6">Dachsanierung geplant?</h2>
        <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
          Wir beraten Sie kostenlos, ob und wie die Solarpflicht für Ihr Gebäude gilt – und koordinieren die gesamte Dachsanierung fachgerecht nach GEG und ZVDH.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="/kontakt"
            className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition shadow-lg flex items-center justify-center gap-2">
            Kostenlose Beratung anfragen <ArrowRight className="w-5 h-5" />
          </a>
          <a href="tel:0234583100"
            className="bg-white/10 border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition flex items-center justify-center gap-2">
            <Phone className="w-5 h-5" /> 0234 583100
          </a>
        </div>
        <p className="mt-8 text-xs text-blue-300 opacity-70">Meisterbetrieb Rex Bedachungs GmbH · Paulinenstraße 22, 44799 Bochum</p>
      </section>

      {/* ── Disclaimer ── */}
      <div className="bg-muted border-t border-border py-8 px-4">
        <div className="max-w-4xl mx-auto text-xs text-muted-foreground text-center leading-relaxed">
          Hinweis: Alle Angaben basieren auf § 42a BauO NRW und der Solaranlagenverordnung NRW (SAN-VO NRW) in der Fassung vom Januar 2026.
          Die Inhalte dienen der allgemeinen Information und stellen keine Rechts- oder Steuerberatung dar. Gesetzliche Regelungen können sich ändern.
          Für verbindliche Auskünfte wenden Sie sich an Ihre lokale Bauordnungsbehörde. Der Schnellcheck ersetzt keine fachliche Planung.
        </div>
      </div>
    </>
  );
}
