import { useState } from "react";
import { Helmet } from "react-helmet";
import OrganizationSchema from "@/components/OrganizationSchema";
import AuthorSchema from "@/components/AuthorSchema";
import ExpertenBlock from "@/components/ExpertenBlock";
import Breadcrumb from "@/components/Breadcrumb";
import {
  Euro, FileCheck, Lightbulb, ShieldCheck, ArrowRight,
  CheckCircle, CheckCircle2, Info, ChevronDown, ChevronUp,
  AlertTriangle, Phone, Mail, ThermometerSun, Home,
} from "lucide-react";
const grants = [
  {
    provider: "BAFA (BEG EM)",
    title: "Einzelmaßnahmen",
    description: "Ideal für Dachdämmung oder den Austausch von Dachfenstern.",
    amount: "15% – 20% Zuschuss",
    benefit: "Direkter Cash-Zuschuss auf Ihr Konto.",
    tags: ["Dämmung", "Fenster", "iSFP-Bonus"],
  },
  {
    provider: "KFW-ERGÄNZUNGSKREDIT 358/359",
    title: "Nach BAFA-Zusage",
    description: "Zinsgünstiges Darlehen nach BAFA-Förderzusage. Bei Haushaltseinkommen ≤ 90.000 € (KfW 358 Plus) besonders günstige Konditionen. Kombinierbar mit BAFA-Zuschuss.",
    amount: "Bis zu 120.000 € pro Wohneinheit",
    benefit: "Zinsgünstiges Darlehen nach BAFA-Förderzusage.",
    tags: ["Einzelmaßnahmen", "Zinsgünstig"],
  },
  {
    provider: "Finanzamt (§ 35c EStG)",
    title: "Steuerbonus",
    description: "Energetische Sanierung direkt von der Steuer absetzen.",
    amount: "20% der Kosten",
    benefit: "Über 3 Jahre direkt von der Steuerschuld abziehbar.",
    tags: ["Ohne Energieberater", "Eigennutzung"],
  },
  {
    provider: "NRW.BANK",
    title: <>NRW.BANK.<br />Gebäudesanierung</>,
    description: "Zinsgünstiges Annuitätendarlehen für energetische Sanierung inkl. Dachdämmung und Dachfenster. Zinsbindung über gesamte Laufzeit. Antragstellung über Ihre Hausbank, zwingend vor Maßnahmenbeginn.",
    amount: "2.500 – 150.000 €",
    benefit: "Landesdarlehen NRW mit günstigen Zinsen.",
    tags: ["Kombinierbar mit BEG EM", "NRW"],
  },
];

const benefits = [
  {
    icon: <ThermometerSun className="w-12 h-12 text-blue-900" />,
    title: "Perfektes Raumklima",
    description: "Keine Sauna im Sommer, keine Eisbox im Winter. Genießen Sie das ganze Jahr über angenehme Temperaturen unter dem Dach.",
  },
  {
    icon: <Euro className="w-12 h-12 text-blue-900" />,
    title: "Energie sparen",
    description: "Sparen Sie bis zu 30% Heizenergie durch moderne Dämmung und senken Sie nachhaltig Ihre Nebenkosten.",
  },
  {
    icon: <Home className="w-12 h-12 text-blue-900" />,
    title: "Wertsteigerung",
    description: "Ein saniertes Dach steigert den Wohnkomfort und den Immobilienwert – eine Investition, die sich doppelt auszahlt.",
  },
];

const steps = [
  {
    title: "Erstberatung",
    desc: "Wir prüfen Ihr Dach vor Ort in Bochum auf Sanierungspotenziale und klären, welche Förderprogramme passen.",
  },
  {
    title: "Energieberater",
    desc: "Ein zertifizierter EEE erstellt den technischen Projektbericht. 50% der Experten-Kosten werden ebenfalls gefördert!",
  },
  {
    title: "Antragstellung",
    desc: "Wichtig: Der Antrag muss gestellt und genehmigt sein, bevor wir den ersten Nagel einschlagen.",
  },
  {
    title: "Umsetzung",
    desc: "Rex Bedachung führt die Arbeiten fachgerecht nach GEG- und ZVDH-Vorgaben aus – Sie erhalten Ihr Geld.",
  },
];

const faqItems = [
  {
    question: "Was ist, wenn ich keinen Energie-Experten will? (Steuerbonus)",
    answer: "Es gibt eine Alternative: Den Steuerbonus (§ 35c EStG). Hier können Sie 20% der Kosten über 3 Jahre von der Steuer absetzen. Dafür ist kein Energie-Effizienz-Experte nötig, aber Sie erhalten das Geld zeitversetzt, nicht sofort. Sie müssen sich für EINEN Weg entscheiden.",
  },
  {
    question: "Kostet der Energie-Experte extra?",
    answer: "Ja, aber der Staat übernimmt 50% dieser Kosten! Dadurch lohnt sich die professionelle Begleitung fast immer, da der Experte sicherstellt, dass der Antrag korrekt gestellt wird und Sie die maximale Förderung erhalten.",
  },
  {
    question: "Welche Velux-Fenster werden gefördert?",
    answer: "Alle Velux-Fenster mit einem U-Wert von 1,0 oder besser werden gefördert. Moderne Velux-Modelle erfüllen diese Anforderung problemlos. Als VELUX-Fachbetrieb beraten wir Sie gerne zu den passenden Modellen.",
  },
  {
    question: "Wie hoch ist die maximale Fördersumme?",
    answer: "Die förderfähigen Kosten betragen maximal 30.000 € pro Wohneinheit (mit iSFP: 60.000 €). Der maximale Zuschuss beträgt damit 4.500 € (ohne iSFP) bzw. 12.000 € (mit iSFP) pro Wohneinheit.",
  },
  {
    question: "Gilt die Förderung auch für reine Dachsanierungen (nicht nur Fenster)?",
    answer: "Ja! Die BAFA-Förderung gilt für alle energetischen Einzelmaßnahmen: Dachdämmung, Dachfenster, Fassadendämmung und mehr. Das GEG schreibt dabei Mindestdämmwerte vor (U-Wert max. 0,24 W/m²K) – wir stellen sicher, dass Ihr Dach diese Anforderungen erfüllt.",
  },
];

function FoerderdetailsBlock() {
  const [activeTab, setActiveTab] = useState<"fenster" | "daemmung">("fenster");

  const fensterItems = {
    yes: [
      "Dachfenster mit U-Wert 1,0 oder besser (Dreifachverglasung)",
      "Fachgerechter, luftdichter Einbau inkl. Laibung",
      "Eindeckrahmen & Dämmset je Fenster",
      "Außenliegender Hitzeschutz (Rollladen, Jalousie) mit automatischer Steuerung",
      "Innenfutter / Laibungsverkleidung",
    ],
    no: [
      "VELUX THERMO (Uw 1,3) – nicht förderfähig",
      "Innenliegender Sonnenschutz – nicht förderfähig",
    ],
    note: "Förderfähig: VELUX ENERGIE (Uw 1,0) und ENERGIE PLUS – alle Modelle mit Uw ≤ 1,0.",
    req: "Förderfähig wenn Uw ≤ 1,0 W/(m²·K)",
  };

  const daemmungItems = {
    yes: [
      "Aufsparrendämmung (PUR/PIR, Holzfaser) inkl. Neueindeckung",
      "Zwischensparrendämmung inkl. Dampfbremse",
      "Flachdachdämmung (Steildach und Flachdach U ≤ 0,14 W/(m²·K))",
      "Gerüst, Entsorgung, Baustelleneinrichtung (Umfeldmaßnahmen)",
      "Energieberater (EEE) zu 50 % gefördert",
    ],
    no: [
      "Reine Neueindeckung ohne Dämmung – nicht förderfähig",
      "Nur GEG-Niveau (U 0,24) – kein Förderanspruch",
    ],
    note: "BEG-Mindestanforderung: U ≤ 0,14 W/(m²·K) – deutlich strenger als GEG (0,24). Gilt für Steildach und Flachdach gleichermaßen.",
    req: "Förderfähig wenn U ≤ 0,14 W/(m²·K)",
  };

  const items = activeTab === "fenster" ? fensterItems : daemmungItems;

  return (
    <div className="bg-card rounded-md shadow-lg overflow-hidden border border-border">
      <div className="flex flex-col lg:flex-row">
        {/* Linke Spalte – Förderhöhe */}
        <div className="lg:w-1/2 bg-blue-50 p-8 lg:p-10 flex flex-col justify-start border-r border-border">
          <p className="text-xs text-blue-600 font-medium mb-4 uppercase tracking-wider">
            Gilt für alle energetischen Maßnahmen an der Gebäudehülle (BEG EM)
          </p>
          <h3 className="text-2xl font-bold mb-1 text-blue-900">Wie viel gibt es konkret?</h3>
          <div className="text-7xl font-extrabold text-blue-900 mb-1 tracking-tight">15%</div>
          <p className="text-base mb-6 text-blue-800">Basisförderung auf alle förderfähigen Kosten</p>
          <div className="bg-white rounded-md p-5 border border-blue-100 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-bold text-blue-900">+5%</span>
              <span className="font-semibold text-lg">iSFP-Bonus</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Der individuelle Sanierungsfahrplan verdoppelt den Förderhöchstbetrag von 30.000 auf 60.000 € pro Wohneinheit und erhöht den Fördersatz auf 20 %. Eigenanteil ca. 400–500 €, typischer Mehrvorteil 3.000–8.000 €.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-md p-4 border border-gray-200 text-center">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Ohne iSFP</p>
              <p className="text-2xl font-bold text-gray-900">30.000 €</p>
              <p className="text-xs text-gray-500 mt-0.5">max. pro WE / Jahr</p>
              <p className="text-sm font-bold text-blue-900 mt-2">→ max. 4.500 € Zuschuss</p>
              <p className="text-xs text-gray-400">(15 % von 30.000 €)</p>
            </div>
            <div className="bg-white rounded-md p-4 border-2 border-blue-500 text-center relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-0.5 rounded-full">EMPFOHLEN</span>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Mit iSFP</p>
              <p className="text-2xl font-bold text-gray-900">60.000 €</p>
              <p className="text-xs text-gray-500 mt-0.5">max. pro WE / Jahr</p>
              <p className="text-sm font-bold text-blue-900 mt-2">→ max. 12.000 € Zuschuss</p>
              <p className="text-xs text-gray-400">(20 % von 60.000 €)</p>
            </div>
          </div>
        </div>

        {/* Rechte Spalte – Was wird gefördert */}
        <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col">
          <h3 className="text-lg font-bold mb-4 text-foreground">Was wird konkret gefördert?</h3>

          {/* Tabs */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setActiveTab("fenster")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium border transition ${
                activeTab === "fenster"
                  ? "bg-blue-50 text-blue-800 border-blue-300"
                  : "bg-muted text-muted-foreground border-border hover:bg-card"
              }`}
            >
              Dachfenster
            </button>
            <button
              onClick={() => setActiveTab("daemmung")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium border transition ${
                activeTab === "daemmung"
                  ? "bg-blue-50 text-blue-800 border-blue-300"
                  : "bg-muted text-muted-foreground border-border hover:bg-card"
              }`}
            >
              Dachdämmung
            </button>
          </div>

          <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">{items.req}</p>

          {/* Förderfähig */}
          <ul className="space-y-2 mb-4">
            {items.yes.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Nicht förderfähig */}
          <ul className="space-y-2 mb-4">
            {items.no.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500 font-bold text-base leading-none">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Hinweis */}
          <div className="mt-auto bg-muted rounded-md p-3 text-xs text-muted-foreground">
            {items.note}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Foerderung() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>BAFA &amp; KfW Förderung Dach Bochum | Rex Bedachung</title>
        <meta
          name="description"
          content="Förderung für Dachsanierung in NRW: BAFA & KfW-Zuschüsse für Dämmung & Fenster. Rex Bedachung berät zu allen aktuellen Förderprogrammen."
        />
        <link rel="canonical" href="https://www.rex-bedachung.de/foerderung" />
        <meta property="og:title" content="BAFA & KfW Förderung Dachsanierung | Rex Bedachungs GmbH Bochum" />
        <meta property="og:description" content="Bis zu 20% staatliche Förderung für Dachsanierung & Velux-Fenster. Wir begleiten Sie als Meisterbetrieb durch den Förderdschungel." />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/dach-hintergrund-rex-bedachung.webp" />
        <meta property="og:site_name" content="Rex Bedachungs GmbH" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.rex-bedachung.de/images/dach-hintergrund-rex-bedachung.webp" />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "BAFA & KfW Förderung für Dacharbeiten in Bochum",
            "author": { "@id": "https://www.rex-bedachung.de/#author" },
            "publisher": { "@id": "https://www.rex-bedachung.de/#organization" },
            "name": "BAFA & KfW Förderung für Dachsanierung Bochum",
            "description": "Staatliche Förderung für Dachsanierung und Velux-Dachfenster bei Rex Bedachungs GmbH Bochum",
            "url": "https://www.rex-bedachung.de/foerderung",
            "provider": {
              "@type": "RoofingContractor",
              "name": "Rex Bedachungs GmbH",
              "telephone": "+49 234 583100",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Paulinenstraße 22",
                "addressLocality": "Bochum",
                "postalCode": "44799"
              }
            }
          }
        `}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://www.rex-bedachung.de/" },
            { "@type": "ListItem", "position": 2, "name": "Förderung", "item": "https://www.rex-bedachung.de/foerderung" }
          ]
        })}</script>
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "GovernmentService",
            "name": "BAFA & KfW Förderberatung Dach Bochum",
            "provider": {
              "@id": "https://www.rex-bedachung.de/#organization"
            },
            "serviceOutput": "Zuschüsse und Förderung für energetische Dachsanierung",
            "audience": {
              "@type": "Audience",
              "audienceType": "Hauseigentümer und Vermieter in Bochum und Umgebung"
            },
            "areaServed": {
              "@type": "City",
              "name": "Bochum"
            }
          }
        `}</script>
      </Helmet>
      <OrganizationSchema />
      <AuthorSchema />

      <Breadcrumb items={[
        { label: "Startseite", href: "/" },
        { label: "Förderung & Zuschüsse" }
      ]} />

      {/* ── Hero (Gemini-Gradient + mein Hintergrundbild) ── */}
      <header
        className="relative text-white py-20 px-4 overflow-hidden"
        style={{ background: "linear-gradient(to right, #0f172a, #1e3a8a)" }}
      >
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/dachsanierung-bochum.png')" }}
        />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1 mb-6">
            <Euro className="w-4 h-4 text-blue-300" />
            <span className="text-sm font-medium text-blue-100 uppercase tracking-wider">Förder-Update 2026</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Dachsanierung in Bochum:<br />
            <span className="text-blue-400">Staatliche Zuschüsse clever nutzen</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Sparen Sie bis zu 20% der Sanierungskosten durch BAFA und KfW. Wir begleiten Sie als Meisterbetrieb durch den Förderdschungel.
          </p>
        </div>
      </header>

      <ExpertenBlock normen={["BAFA BEG EM", "KfW 358/359", "§35c EStG", "NRW.BANK"]} />

      {/* ── Grant Cards – überlappen den Hero (Gemini-Stil) ── */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-20 mb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {grants.map((g, i) => (
            <div key={i} className="bg-card rounded-md shadow-xl p-8 border border-border hover:border-blue-300 transition group">
              <div className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-widest">{g.provider}</div>
              <h2 className="text-2xl font-bold mb-4 group-hover:text-blue-700 transition-colors break-words">{g.title}</h2>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">{g.description}</p>
              <div className="bg-blue-50 rounded-md p-4 mb-6">
                <div className="text-xs text-blue-500 font-semibold mb-1 uppercase">Förderhöhe</div>
                <div className="text-2xl font-black text-blue-900">{g.amount}</div>
              </div>
              <div className="flex items-start gap-2 text-sm mb-6">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{g.benefit}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {g.tags.map((tag, j) => (
                  <span key={j} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded font-bold uppercase">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center mt-6 max-w-3xl mx-auto">
          Für Komplettsanierungen zum Effizienzhaus gibt es den KfW-Kredit 261 (bis 150.000 €) — das ist ein separates Programm und nicht mit BEG-Einzelmaßnahmen kombinierbar.
        </p>
      </div>


      {/* ── Benefits (nur meine Version hat das) ── */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Warum sich der Austausch lohnt</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Ein Fenstertausch ist mehr als nur Glas – es ist ein Upgrade für Ihr Leben.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((b, idx) => (
              <div key={idx} className="bg-card p-8 rounded-md border border-border hover:shadow-md transition text-center">
                <div className="bg-muted rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">{b.icon}</div>
                <h3 className="text-xl font-bold mb-3">{b.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GEG Info Box (beide hatten das) ── */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="bg-card rounded-md p-8 md:p-12 shadow-sm border border-border flex flex-col md:flex-row items-center gap-8">
            <div className="bg-blue-600 p-4 rounded-md text-white flex-shrink-0">
              <ShieldCheck className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Das Gebäudeenergiegesetz (GEG) 2026</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Das GEG schreibt bei größeren Sanierungen Mindestdämmwerte vor (U-Wert max. 0,24 W/m²K). Wir sorgen dafür, dass Ihr neues Dach nicht nur die gesetzlichen Anforderungen erfüllt, sondern diese für maximale Effizienz sogar übertrifft.
              </p>
              <p className="text-sm text-slate-600">Für energetische Dachsanierungen in Bochum sind über BAFA und KfW Förderungen von bis zu 20 % der Investitionskosten möglich – Rex Bedachung berät kostenlos zur passenden Fördermaßnahme.</p>
              <div className="flex items-center gap-2 text-blue-600 font-bold">
                <Info className="w-5 h-5" />
                <span>Wichtig: Ohne Einhaltung der GEG-Werte gibt es keine Förderung!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Förderdetails mit Tabs ── */}
      <section className="py-16 bg-muted">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <FoerderdetailsBlock />
        </div>
      </section>

      {/* ── Rechenbeispiel ── */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 md:p-8 border border-blue-100 mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Konkretes Beispiel: 4 Dachfenster austauschen</h3>
            <p className="text-gray-600 mb-6">EFH Baujahr 1985, 4 alte Dachfenster (Uw ~2,5) → Austausch gegen VELUX Klapp-Schwingfenster mit Dreifachverglasung (Uw = 1,0) + Elektro-Außenrollläden.</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-blue-100">
                <span className="text-gray-700">Gesamtkosten (Fenster + Einbau + Zubehör)</span>
                <span className="font-bold text-gray-900">ca. 15.300 €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-blue-100">
                <span className="text-gray-700">BAFA-Zuschuss mit iSFP (20%)</span>
                <span className="font-bold text-green-700">− 3.060 €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-blue-100">
                <span className="text-gray-700">EEE-Zuschuss (50% von ca. 1.200 €)</span>
                <span className="font-bold text-green-700">− 600 €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-blue-100">
                <span className="text-gray-700">iSFP-Eigenanteil</span>
                <span className="font-bold text-red-600">+ 500 €</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-blue-900 text-white rounded-lg px-4 mt-2">
                <span className="font-semibold">Tatsächliche Investition</span>
                <span className="text-xl font-bold">ca. 12.140 €</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">Ohne iSFP: 15.300 € − 2.298 € BAFA = ca. 13.000 €. Der iSFP spart hier ca. 860 € zusätzlich bei nur 500 € Eigenanteil.</p>
          </div>
        </div>
      </section>

      {/* ── Förder-Checkliste ── */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Vom Erstgespräch bis zur Auszahlung</h2>
          <p className="text-muted-foreground text-center mb-4 max-w-2xl mx-auto">
            Der BAFA-Förderantrag muss <strong>vor</strong> Vertragsabschluss gestellt sein. Ein vorzeitiger Maßnahmenbeginn führt zum vollständigen Förderverlust.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-700 p-4 rounded-r-md mb-8 max-w-3xl mx-auto">
            <p className="text-sm text-blue-800 font-medium">
              Wichtigste Regel: BAFA-Antrag stellen → Eingangsbestätigung abwarten → erst dann Vertrag unterschreiben oder Anzahlung leisten.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse bg-card rounded-md overflow-hidden border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left p-3 border border-border font-medium text-muted-foreground w-8">#</th>
                  <th className="text-left p-3 border border-border font-medium text-muted-foreground">Schritt</th>
                  <th className="text-left p-3 border border-border font-medium text-muted-foreground w-32">Zeitrahmen</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { n: 1, step: "Erstinteresse", desc: "Eigentümer äußert Sanierungswunsch", zeit: "Tag 0", highlight: false },
                  { n: 2, step: "Erstberatung", desc: "Förderfähigkeit prüfen: Gebäudealter ≥ 5 Jahre? Eigentümer?", zeit: "Tag 1–7", highlight: false },
                  { n: 3, step: "Energieberater (EEE) einbinden", desc: "Sofort starten – größter Engpass mit 3–8 Wochen Wartezeit", zeit: "Tag 7–14", highlight: true },
                  { n: 4, step: "iSFP / Energieberatung", desc: "EEE erstellt Sanierungsfahrplan – sichert +5 % Bonus und 60.000 € Förderhöchstbetrag", zeit: "Woche 3–8", highlight: false },
                  { n: 5, step: "BEG-konformes Angebot", desc: "Rex erstellt Angebot mit Trennung förderfähig / nicht förderfähig, U-Wert-Nachweis, auflösender Bedingung", zeit: "Woche 4–9", highlight: false },
                  { n: 6, step: "Technische Projektbeschreibung (TPB)", desc: "EEE erstellt TPB mit allen technischen Daten für den Antrag", zeit: "Woche 5–10", highlight: false },
                  { n: 7, step: "BAFA-Antrag stellen", desc: "Eigentümer beantragt online unter bafa.de – TPB-ID eingeben. Kein Vertrag vorher!", zeit: "Woche 6–11", highlight: true },
                  { n: 8, step: "Eingangsbestätigung", desc: "BAFA bestätigt Eingang des Antrags", zeit: "1–2 Wochen", highlight: false },
                  { n: 9, step: "Zuwendungsbescheid", desc: "BAFA genehmigt Förderung – ab jetzt kann der Vertrag rechtssicher unterzeichnet werden", zeit: "6–8 Wochen", highlight: true },
                  { n: 10, step: "Auftragserteilung", desc: "Formaler Vertrag mit Rex Bedachungs GmbH", zeit: "Nach Bescheid", highlight: false },
                  { n: 11, step: "Ausführung", desc: "Baumaßnahme durch Rex – Rechnung mit Trennung förderfähig / nicht förderfähig", zeit: "1–4 Wochen", highlight: false },
                  { n: 12, step: "Technischer Projektnachweis (TPN)", desc: "EEE erstellt TPN nach Abschluss der Maßnahme", zeit: "Nach Abschluss", highlight: false },
                  { n: 13, step: "Verwendungsnachweis", desc: "Eigentümer reicht Rechnungen und TPN beim BAFA ein – unbare Bezahlung Pflicht", zeit: "Nach TPN", highlight: false },
                  { n: 14, step: "Auszahlung", desc: "BAFA überweist Zuschuss direkt auf das Konto des Eigentümers", zeit: "4–8 Wochen", highlight: true },
                ].map((row) => (
                  <tr key={row.n} className={row.highlight ? "bg-blue-50" : (row.n % 2 === 0 ? "bg-muted/30" : "bg-card")}>
                    <td className="p-3 border border-border text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${row.highlight ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"}`}>
                        {row.n}
                      </span>
                    </td>
                    <td className="p-3 border border-border">
                      <p className="font-semibold text-foreground">{row.step}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">{row.desc}</p>
                    </td>
                    <td className="p-3 border border-border text-muted-foreground text-xs whitespace-nowrap">
                      {row.zeit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-6 max-w-xl mx-auto">
            <div className="bg-muted rounded-md p-4 text-center">
              <p className="text-xs text-muted-foreground font-medium">Gesamtdauer typisch</p>
              <p className="text-xl font-bold text-foreground mt-1">4–8 Monate</p>
            </div>
            <div className="bg-muted rounded-md p-4 text-center">
              <p className="text-xs text-muted-foreground font-medium">Bewilligungszeitraum</p>
              <p className="text-xl font-bold text-foreground mt-1">36 Monate ab Bescheid</p>
            </div>
          </div>
          <div className="mt-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md max-w-3xl mx-auto">
            <p className="text-sm text-amber-800">
              <strong>Häufigster Fehler:</strong> Vertrag oder Anzahlung <em>vor</em> BAFA-Antragstellung = vorzeitiger Maßnahmenbeginn = vollständiger Förderverlust.
            </p>
          </div>
        </div>
      </section>

      {/* ── 4 Schritte + Warn-Box ── */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="bg-blue-50 border-l-4 border-blue-900 p-6 rounded-r-md mb-12 flex items-start gap-4">
            <AlertTriangle className="w-10 h-10 text-blue-900 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Die wichtigste Regel: Erst Antrag, dann Auftrag!</h3>
              <p className="text-blue-800">Unterschreiben Sie keinen Handwerkervertrag, bevor der Förderantrag genehmigt ist. Wer zu früh unterschreibt, verliert den Anspruch auf Förderung!</p>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">In 4 Schritten zum geförderten Dach</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-card p-6 rounded-md border border-border h-full">
                  <div className="text-4xl font-black text-muted mb-4">0{idx + 1}</div>
                  <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Energieberater + Steuerbonus (beide hatten das) ── */}
      <section className="py-16 bg-muted">
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900 text-white rounded-md p-8 flex flex-col justify-between">
              <div>
                <div className="bg-blue-500 w-12 h-12 rounded-md flex items-center justify-center mb-6">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-blue-100">Energieeffizienz-Experte (EEE)</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Für BAFA und KfW ist die Einbindung eines Energieeffizienz-Experten (EEE) Pflicht. Wir arbeiten eng mit lokalen Experten in Bochum zusammen und koordinieren den gesamten Prozess für Sie. Die Experten-Kosten werden zu 50% gefördert!
                </p>
              </div>
              <div className="text-sm font-medium border-t border-slate-700 pt-4 flex justify-between">
                <span>Expertise-Partner in Bochum</span>
                <span className="text-blue-400">Verfügbar</span>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-md p-8">
              <h3 className="text-2xl font-bold mb-4 text-blue-900">Steuervorteil nach § 35c EStG</h3>
              <p className="text-blue-800/70 mb-4 leading-relaxed">
                Für Selbstnutzer gibt es eine attraktive Alternative zur BAFA-Förderung: Wer keinen Energieberater einbinden möchte, kann 20% der Sanierungskosten (bis zu 40.000 € pro Objekt) direkt über 3 Jahre von der Steuerschuld abziehen.
              </p>
              <p className="text-blue-800/70 mb-6 leading-relaxed text-sm">
                §35c ist besonders vorteilhaft wenn: die Gesamtkosten 60.000 € pro Wohneinheit übersteigen, kein Energieberater gewünscht ist, die BAFA-Antragsfrist verpasst wurde oder eine hohe Steuerlast vorliegt. Maximal 40.000 € Steuerermäßigung auf bis zu 200.000 € Kosten pro Objekt. Voraussetzung: Gebäude mindestens 10 Jahre alt (bei BEG EM genügen 5 Jahre).
              </p>
              <div className="p-4 bg-white rounded-md border border-blue-200">
                <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Dachdecker-Tipp
                </h4>
                <p className="text-sm text-blue-800 italic">
                  „Diese Variante ist oft unbürokratischer, erfordert aber eine Bescheinigung nach amtlichem Muster durch uns als Fachbetrieb."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ (nur meine Version) ── */}
      <section className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Häufige Fragen zur Förderung</h2>
          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div key={idx} className="bg-card rounded-md border border-border overflow-hidden">
                <button
                  onClick={() => setActiveAccordion(activeAccordion === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-5 text-left font-medium hover:bg-muted transition"
                >
                  <span>{item.question}</span>
                  {activeAccordion === idx
                    ? <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-4" />
                    : <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-4" />
                  }
                </button>
                {activeAccordion === idx && (
                  <div className="p-5 pt-0 text-muted-foreground bg-muted border-t border-border">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verwandte Leistungen */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Unsere geförderten Leistungen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/steildach-bochum" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">Steildach Sanierung</div>
              <div className="text-sm text-gray-500">Energetische Steildachsanierung mit Aufsparrendämmung – BAFA-förderfähig.</div>
            </a>
            <a href="/flachdach-bochum" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">Flachdach Abdichtung</div>
              <div className="text-sm text-gray-500">Flachdachdämmung und Abdichtung – mit KfW-Förderung kombinierbar.</div>
            </a>
            <a href="/dachreparatur-bochum" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">Dachreparatur</div>
              <div className="text-sm text-gray-500">Sturmschäden und dringende Reparaturen – schnell und zuverlässig.</div>
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA (Gemini-Gradient-Design – viel stärker als meine Version) ── */}
      <section
        className="mx-4 mb-16 rounded-[2rem] p-12 text-center text-white shadow-2xl"
        style={{ background: "linear-gradient(135deg, #1d4ed8, #1e3a8a)" }}
      >
        <h2 className="text-3xl md:text-5xl font-black mb-6">Starten Sie jetzt Ihren Förder-Check</h2>
        <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
          Wir prüfen kostenlos vor Ort, welche Maßnahmen an Ihrem Objekt in Bochum sinnvoll sind und welche Fördertöpfe wir für Sie anzapfen können.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/kontakt"
            className="pulse-ring cta-pulse bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition shadow-lg flex items-center justify-center gap-2"
          >
            Kostenlose Beratung anfragen
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href="tel:+49234583100"
            className="bg-blue-800/50 border border-blue-400/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-800/70 transition flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5" />
            +49 234 583100
          </a>
        </div>
        <p className="mt-8 text-xs text-blue-300 opacity-70">Meisterbetrieb Rex Bedachungs GmbH · Paulinenstraße 22, 44799 Bochum</p>
      </section>

      {/* ── Disclaimer (Gemini hatte den vollständigeren) ── */}
      <div className="bg-muted border-t border-border py-8 px-4">
        <div className="max-w-4xl mx-auto text-xs text-muted-foreground text-center leading-relaxed">
          Hinweis: Alle Angaben zu Förderungen dienen der Information und stellen keine Rechts- oder Steuerberatung dar. Förderbedingungen können sich kurzfristig ändern. Die Einbindung eines Statikers sowie eines zertifizierten Energieeffizienz-Experten ist je nach Maßnahme gesetzlich vorgeschrieben.
        </div>
      </div>
    </>
  );
}
