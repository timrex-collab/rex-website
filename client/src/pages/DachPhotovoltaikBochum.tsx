import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import OrganizationSchema from "@/components/OrganizationSchema";
import AuthorSchema from "@/components/AuthorSchema";
import Breadcrumb from "@/components/Breadcrumb";
import {
  Sun, CheckCircle, ChevronDown, ChevronUp,
  Phone, Search, Wrench, Zap, ArrowRight, MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const leistungen = [
  {
    icon: <Search className="w-7 h-7 text-primary" />,
    titel: "Dachcheck & PV-Tauglichkeit",
    text: "Kostenlose Vor-Ort-Prüfung: Tragfähigkeit, Ausrichtung, Verschattung, Zustand der Eindeckung. Wir beurteilen, ob Braas PV Premium (Turmalin/Tegalit) oder Aufdach-PV die bessere Lösung ist.",
  },
  {
    icon: <Wrench className="w-7 h-7 text-primary" />,
    titel: "Dacherneuerung als PV-Basis",
    text: "Falls nötig, sanieren wir Ihr Dach als stabile Grundlage – Steildach und Flachdach. Bei Braas PV Premium wird die Neueindeckung direkt mit PV-Elementen kombiniert.",
  },
  {
    icon: <Zap className="w-7 h-7 text-primary" />,
    titel: "Kabeldurchführungen vorbereiten",
    text: "Rex bereitet alle dachseitigen Durchführungen fachgerecht vor – wetterfest und normgerecht. Der Elektrofachbetrieb schließt Wechselrichter und Einspeisung an.",
  },
];

const ablaufSchritte = [
  { titel: "Kostenlosen Dachcheck anfragen", desc: "Rex prüft vor Ort: Dachzustand, Ausrichtung, Eignung für Braas PV Premium oder Aufdach-PV, Solardachpflicht-Relevanz." },
  { titel: "Angebot Dachsanierung + PV-Vorbereitung", desc: "Transparentes Angebot: Dachsanierung, Braas PV Premium Montage (falls gewählt) und Kabeldurchführungen – alles in einem Dokument." },
  { titel: "Rex montiert Dach + PV-Dachfläche", desc: "Neueindeckung mit Braas PV Premium oder klassische Sanierung mit vorbereiteten PV-Durchführungen – fachgerecht, wetterfest, dokumentiert." },
  { titel: "Elektrofachbetrieb übernimmt Anschluss", desc: "Auf Wunsch empfehlen wir 1KOMMA5° für Elektroinstallation, Wechselrichter und Netzeinspeisung. Sie kontaktieren den Fachbetrieb direkt." },
];

const faqItems = [
  {
    question: "Was ist Braas PV Premium und für welche Modelle ist es verfügbar?",
    answer: "Braas PV Premium ist eine dachintegrierte Photovoltaik-Lösung: PV-Elemente ersetzen herkömmliche Dachziegel oder Dachsteine – kein separates Gestell, keine sichtbaren Aufbauten. Bei Rex ist PV Premium für die Braas-Modelle Turmalin (Dachziegel) und Tegalit (Dachstein) verfügbar. Rex liefert und montiert die PV-Dachfläche, der Elektroanschluss erfolgt durch einen Fachbetrieb.",
  },
  {
    question: "Ab wann gilt die NRW-Solardachpflicht und was passiert bei Verstoß?",
    answer: "Seit dem 01.01.2026 muss bei grundlegender Dacherneuerung ab 50 m² Nutzfläche mindestens 30 % der geeigneten Dachfläche mit PV belegt werden. Ausnahmen sind bei fehlender Statik, Denkmalschutz oder wirtschaftlicher Unzumutbarkeit möglich. Bei Verstoß droht ein Bußgeld – die genaue Höhe regelt die zuständige Baubehörde.",
  },
  {
    question: "Übernimmt Rex auch den Elektroanschluss der PV-Anlage?",
    answer: "Nein. Rex übernimmt Lieferung und Montage der PV-Dachfläche (Braas PV Premium) sowie die fachgerechte Vorbereitung aller Kabeldurchführungen. Den Elektroanschluss – Wechselrichter, Verkabelung, Netzeinspeisung – übernimmt ein Elektrofachbetrieb. Auf Wunsch empfehlen wir 1KOMMA5°.",
  },
  {
    question: "Muss das Dach vor der PV-Montage saniert werden?",
    answer: "Nicht immer. Ist das Dach jünger als 15 Jahre und in gutem Zustand, kann die PV-Anlage direkt montiert werden. Bei älteren oder schadhaften Dächern empfehlen wir dringend eine Sanierung vorher – sonst muss die PV-Anlage zum Dachdecken wieder abgebaut werden. Beim kostenlosen Dachcheck beurteilen wir das für Sie.",
  },
  {
    question: "Kann ich Dachsanierung und PV-Förderung kombinieren?",
    answer: "Ja. Die Dachsanierung wird über BEG EM (BAFA) mit bis zu 20 % Zuschuss gefördert. Die PV-Anlage läuft separat über KfW 270 und die EEG-Einspeisevergütung. Beide Programme sind kombinierbar – nur das PV-Pflichtmaß der NRW-Solardachpflicht wird nicht zusätzlich bezuschusst.",
  },
  {
    question: "Was unterscheidet Braas PV Premium von einer normalen Aufdach-Anlage?",
    answer: "Braas PV Premium ist in die Dachfläche integriert – die PV-Elemente ersetzen herkömmliche Ziegel oder Steine. Optisch unauffällig, keine Aufbauten auf dem Dach. Eine konventionelle Aufdach-Anlage wird auf Gestellen über der bestehenden Eindeckung montiert. Vorteil Aufdach: höhere Maximalleistung pro Quadratmeter und meist günstiger. Vorteil PV Premium: Ästhetik und kombinierter Arbeitsschritt bei Dacherneuerung.",
  },
];

const serviceSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Dach & Photovoltaik Bochum – Braas PV Premium und Aufdach-PV",
  "provider": {
    "@type": "RoofingContractor",
    "@id": "https://www.rex-bedachung.de/#organization",
    "name": "Rex Bedachungs GmbH",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Paulinenstraße 22",
      "addressLocality": "Bochum",
      "postalCode": "44799",
      "addressCountry": "DE",
    },
    "telephone": "+49-234-583100",
  },
  "areaServed": ["Bochum", "Herne", "Castrop-Rauxel", "Witten", "Hattingen", "Gelsenkirchen"],
  "description": "Dach für Photovoltaik vorbereiten in Bochum: Braas PV Premium (Turmalin, Tegalit) als dachintegrierte Lösung oder Vorbereitung für Aufdach-PV. Rex Bedachungs GmbH – Meisterbetrieb seit 1984.",
  "serviceType": "Dach Photovoltaik Vorbereitung",
});

export default function DachPhotovoltaikBochum() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Dach & Photovoltaik Bochum – Braas PV Premium & Aufdach-PV | Rex Bedachung</title>
        <meta name="description" content="Dach für Photovoltaik vorbereiten in Bochum: Braas PV Premium (Turmalin, Tegalit) dachintegriert oder Aufdach-PV mit 1KOMMA5°. Kostenloser Dachcheck – Rex Bedachungs GmbH." />
        <link rel="canonical" href="https://www.rex-bedachung.de/dach-photovoltaik-bochum" />
        <meta property="og:title" content="Dach & Photovoltaik Bochum – Braas PV Premium & Aufdach-PV | Rex Bedachungs GmbH" />
        <meta property="og:description" content="Dach für Photovoltaik vorbereiten in Bochum: Braas PV Premium dachintegriert oder Aufdach-PV. Kostenloser Dachcheck – Meisterbetrieb seit 1984." />
        <meta property="og:url" content="https://www.rex-bedachung.de/dach-photovoltaik-bochum" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/braas-pv-premium-turmalin.webp" />
        <meta property="og:site_name" content="Rex Bedachungs GmbH" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.rex-bedachung.de/images/braas-pv-premium-turmalin.webp" />
        <script type="application/ld+json">{serviceSchema}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type":"ListItem","position":1,"name":"Startseite","item":"https://www.rex-bedachung.de/"},
    {"@type":"ListItem","position":2,"name":"Dachsanierung Bochum","item":"https://www.rex-bedachung.de/dachsanierung-bochum"},
    {"@type":"ListItem","position":3,"name":"Dach & Photovoltaik","item":"https://www.rex-bedachung.de/dach-photovoltaik-bochum"}
  ]
}`}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type":"Question","name":"Was ist Braas PV Premium und für welche Modelle ist es verfügbar?","acceptedAnswer":{"@type":"Answer","text":"Braas PV Premium ist eine dachintegrierte Photovoltaik-Lösung: PV-Elemente ersetzen herkömmliche Dachziegel oder Dachsteine. Bei Rex verfügbar für die Modelle Turmalin (Dachziegel) und Tegalit (Dachstein)."}},
    {"@type":"Question","name":"Ab wann gilt die NRW-Solardachpflicht und was passiert bei Verstoß?","acceptedAnswer":{"@type":"Answer","text":"Seit 01.01.2026 bei Dacherneuerung ab 50 m²: mindestens 30 % der geeigneten Dachfläche mit PV. Bei Verstoß droht ein Bußgeld."}},
    {"@type":"Question","name":"Übernimmt Rex auch den Elektroanschluss der PV-Anlage?","acceptedAnswer":{"@type":"Answer","text":"Nein. Rex montiert die PV-Dachfläche und bereitet Kabeldurchführungen vor. Den Elektroanschluss übernimmt ein Fachbetrieb – auf Wunsch empfehlen wir 1KOMMA5°."}},
    {"@type":"Question","name":"Muss das Dach vor der PV-Montage saniert werden?","acceptedAnswer":{"@type":"Answer","text":"Nicht immer. Bei Dächern älter als 15 Jahre oder mit Schäden empfehlen wir eine Sanierung vorher. Beim kostenlosen Dachcheck beurteilen wir das."}},
    {"@type":"Question","name":"Kann ich Dachsanierung und PV-Förderung kombinieren?","acceptedAnswer":{"@type":"Answer","text":"Ja. Dachsanierung über BEG EM mit bis zu 20 % Zuschuss, PV-Anlage über KfW 270 und EEG-Einspeisevergütung. Beide Programme kombinierbar."}},
    {"@type":"Question","name":"Was unterscheidet Braas PV Premium von einer normalen Aufdach-Anlage?","acceptedAnswer":{"@type":"Answer","text":"PV Premium ist in die Dachfläche integriert – optisch unauffällig. Aufdach-Anlagen werden auf Gestellen montiert und bieten höhere Maximalleistung pro Quadratmeter."}}
  ]
}`}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Dach für Photovoltaik vorbereiten – Ablauf",
  "step": [
    {"@type":"HowToStep","position":1,"name":"Dachcheck anfragen","text":"Rex prüft vor Ort Dachzustand, Ausrichtung und Eignung für Braas PV Premium oder Aufdach-PV."},
    {"@type":"HowToStep","position":2,"name":"Angebot erhalten","text":"Transparentes Angebot für Dachsanierung, PV Premium Montage und Kabeldurchführungen."},
    {"@type":"HowToStep","position":3,"name":"Dach + PV-Fläche montieren","text":"Rex montiert Neueindeckung mit Braas PV Premium oder bereitet Dach für Aufdach-PV vor."},
    {"@type":"HowToStep","position":4,"name":"Elektroanschluss","text":"Elektrofachbetrieb übernimmt Wechselrichter, Verkabelung und Netzeinspeisung."}
  ]
}`}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Dach & Photovoltaik Bochum – Braas PV Premium und Aufdach-PV",
  "author": {"@id": "https://www.rex-bedachung.de/#author"},
  "publisher": {"@id": "https://www.rex-bedachung.de/#organization"},
  "url": "https://www.rex-bedachung.de/dach-photovoltaik-bochum"
}`}</script>
      </Helmet>

      <OrganizationSchema />
      <AuthorSchema />
      <Breadcrumb items={[
        { label: "Startseite", href: "/" },
        { label: "Dachsanierung Bochum", href: "/dachsanierung-bochum" },
        { label: "Dach & Photovoltaik" },
      ]} />

      {/* Hero */}
      <section className="relative text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/braas-pv-premium-turmalin.webp')" }} aria-hidden="true" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)", opacity: 0.82 }} aria-hidden="true" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1 mb-6">
            <Sun className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium text-blue-100 uppercase tracking-wider">Photovoltaik Bochum</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 max-w-3xl">
            Dach & Photovoltaik Bochum – Braas PV Premium und Aufdach-PV
          </h1>
          <p className="text-lg text-slate-300 mb-4 max-w-2xl leading-relaxed">
            Rex Bedachungs GmbH bietet zwei Wege zur Solaranlage: dachintegrierte PV mit Braas PV Premium für die Modelle Turmalin und Tegalit – Lieferung und Montage durch Rex. Für konventionelle Aufdach-Anlagen empfehlen wir den PV-Fachbetrieb 1KOMMA5°.
          </p>
          <p className="text-sm text-slate-400 mb-8">
            NRW-Solardachpflicht ab 2026: Bei Dacherneuerung ≥ 50 m² ist PV Pflicht – wir klären das beim kostenlosen Dachcheck.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-slate-100">
              <a href="/kontakt" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Kostenlosen Dachcheck anfragen
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white">
              <a href="tel:+49234583100" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +49 234 583100
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Zwei Wege */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Zwei Wege zur Solaranlage</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">Je nach Dachtyp, Budget und optischen Ansprüchen bieten wir zwei Lösungen – beide beginnen mit einem kostenlosen Dachcheck durch Rex.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border-2 border-primary rounded-xl overflow-hidden">
              <img src="/images/braas-pv-premium-turmalin.webp" alt="Braas PV Premium Turmalin – dachintegrierte Photovoltaik" className="w-full h-48 object-cover" />
              <div className="p-6">
                <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-0.5 rounded mb-3">Rex-Eigenleistung</span>
                <h3 className="text-xl font-bold mb-3">Braas PV Premium</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> PV integriert in Dachziegel/-stein</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> Optisch unauffällig – keine Aufbauten</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> Verfügbar für Turmalin und Tegalit</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> Rex liefert + montiert den Dachteil</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> Ideal bei Dacherneuerung</li>
                </ul>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="w-full h-48 bg-slate-200 flex items-center justify-center">
                <Sun className="w-12 h-12 text-slate-400" />
              </div>
              <div className="p-6">
                <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground bg-muted px-3 py-0.5 rounded mb-3">Partnerempfehlung</span>
                <h3 className="text-xl font-bold mb-3">Konventionelle Aufdach-PV</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> Module auf Unterkonstruktion montiert</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> Maximale Leistung pro Fläche</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> Alle Dachtypen (Steildach + Flachdach)</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> Empfohlener Partner: 1KOMMA5°</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" /> Nachrüstung auch ohne Sanierung</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Braas PV Premium Detail */}
      <section className="py-16 px-4 bg-muted/40">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Braas PV Premium – dachintegrierte Solaranlage</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">PV-Elemente ersetzen herkömmliche Dachziegel oder Dachsteine – kein separates Gestell, keine Aufbauten. Rex liefert und montiert die Braas PV Premium Fläche als Teil der Dacheindeckung.</p>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <img src="/images/braas-pv-premium-turmalin.webp" alt="Braas PV Premium Turmalin Dachziegel" className="w-full h-52 object-cover" />
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2">Braas Turmalin</h3>
                <p className="text-sm text-muted-foreground">Dachziegel mit integrierter PV-Technologie. Hochwertige Keramikoptik, gleichzeitig Stromerzeugung. Ideal für sichtbare Dachflächen.</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <img src="/images/braas-pv-premium-tegalit.webp" alt="Braas PV Premium Tegalit Dachstein" className="w-full h-52 object-cover" />
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2">Braas Tegalit</h3>
                <p className="text-sm text-muted-foreground">Dachstein mit integrierter PV-Technologie. Flache, moderne Optik. Bewährt für großflächige Satteldächer.</p>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-start gap-4">
              <Zap className="w-8 h-8 text-primary shrink-0" />
              <div>
                <h3 className="font-bold mb-2">Elektroanschluss separat</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Rex montiert den Dachteil und bereitet Kabeldurchführungen vor. Wechselrichter und Einspeisung übernimmt ein Elektrofachbetrieb – auf Wunsch empfehlen wir 1KOMMA5°.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1KOMMA5° Partner */}
      <section className="py-14 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Für Aufdach-PV empfehlen wir 1KOMMA5°</h2>
          <div className="bg-card border border-border rounded-xl p-6 flex items-start gap-5">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
              <Sun className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">1KOMMA5°</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Für konventionelle Aufdach-Solaranlagen empfehlen wir den PV-Fachbetrieb 1KOMMA5°. Rex übernimmt die Dachvorbereitung – Prüfung, Sanierung und Kabeldurchführungen. Die Planung, Installation und den Elektroanschluss der PV-Anlage kontaktieren Sie direkt bei 1KOMMA5°.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solardachpflicht */}
      <section className="py-16 px-4 bg-muted/40">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">NRW-Solardachpflicht ab 2026 – was gilt für Sie?</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">Seit dem 01.01.2026 gilt in Nordrhein-Westfalen: Bei grundlegender Dacherneuerung mit einer Nutzfläche ab 50 m² müssen mindestens 30 % der geeigneten Dachfläche mit Photovoltaik belegt werden.</p>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold mb-2">Wann greift die Pflicht?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Bei Dacherneuerung ab 50 m² Dachfläche seit 01.01.2026. Ausnahmen möglich bei fehlender Statik, Denkmalschutz oder wirtschaftlicher Unzumutbarkeit.</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold mb-2">Was Rex dabei klärt</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Beim kostenlosen Dachcheck prüfen wir, ob Ihre Maßnahme die Solardachpflicht auslöst und welche PV-Lösung sinnvoll ist. Braas PV Premium zählt als Erfüllung der Pflicht.</p>
            </div>
          </div>
          <p className="mt-5 text-sm">
            <Link href="/solarpflicht" className="text-primary underline hover:no-underline">Mehr zur NRW-Solardachpflicht →</Link>
          </p>
        </div>
      </section>

      {/* Was Rex übernimmt */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Was Rex für Sie übernimmt</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {leistungen.map((l, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6">
                <div className="mb-3">{l.icon}</div>
                <h3 className="font-bold text-foreground mb-2">{l.titel}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{l.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ablauf */}
      <section className="py-16 px-4 bg-muted/40">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Typischer Ablauf – vom Dachcheck zur Solaranlage</h2>
          <p className="text-muted-foreground mb-8">Vier Schritte bis zur fertigen PV-Anlage auf Ihrem Dach:</p>
          <div className="space-y-4">
            {ablaufSchritte.map((s, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-card border border-border rounded-xl">
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">{i + 1}</span>
                <div>
                  <p className="font-semibold text-foreground mb-1">{s.titel}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planungsbeispiel */}
      <section className="py-14 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Planungsbeispiel aus Bochum</h2>
          <div className="border-l-[3px] border-primary bg-card p-6 rounded-r-xl">
            <span className="inline-block text-[11px] font-medium uppercase tracking-widest text-primary bg-primary/10 px-3 py-0.5 rounded mb-3">Planungsbeispiel – kein konkreter Auftrag</span>
            <p className="font-semibold text-foreground mb-3">EFH Bochum-Langendreer, Baujahr 1977</p>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <span className="text-muted-foreground font-medium">Objekt</span>
              <span>Satteldach 130 m², Braas Tegalit-Eindeckung</span>
              <span className="text-muted-foreground font-medium">Ausgangslage</span>
              <span>Eindeckung 45 Jahre alt, Dämmung unzureichend, Solardachpflicht greift</span>
              <span className="text-muted-foreground font-medium">Rex-Leistung</span>
              <span>Neueindeckung Braas Tegalit mit PV Premium auf Südseite (22 PV-Steine), Aufsparrendämmung, Kabeldurchführungen vorbereitet</span>
              <span className="text-muted-foreground font-medium">Elektroanschluss</span>
              <span>Durch 1KOMMA5° – Wechselrichter, Einspeisung, Inbetriebnahme</span>
              <span className="text-muted-foreground font-medium">Ergebnis</span>
              <span>Solardachpflicht erfüllt, gedämmtes Dach, PV optisch in Dachfläche integriert</span>
            </div>
          </div>
        </div>
      </section>

      {/* Förderung */}
      <section className="py-14 px-4 bg-muted/40">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Förderung – was greift hier?</h2>
          <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-xl p-7">
            <h3 className="text-lg font-bold mb-3">Dachsanierung + PV: doppelt förderbar</h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-3">Die energetische Dachsanierung ist über BEG EM (BAFA) als Einzelmaßnahme förderfähig – bis zu 20 % Zuschuss, maximal 12.000 € pro Wohneinheit mit iSFP. Die PV-Anlage selbst wird separat gefördert: KfW 270 und EEG-Einspeisevergütung. Beide Förderungen sind kombinierbar.</p>
            <p className="text-blue-200 text-sm leading-relaxed mb-4">Das PV-Pflichtmaß der NRW-Solardachpflicht wird als gesetzliche Vorgabe grundsätzlich nicht zusätzlich bezuschusst.</p>
            <Link href="/foerderung" className="inline-flex items-center gap-1 text-blue-200 hover:text-white text-sm underline">
              Alle Fördermöglichkeiten im Überblick <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Häufige Fragen zu Dach & Photovoltaik</h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div key={i} className="border border-border rounded-xl bg-card">
                <button className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-card-foreground gap-4" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                  <span>{item.question}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 shrink-0 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 shrink-0 text-muted-foreground" />}
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${openFaq === i ? "max-h-96" : "max-h-0"}`}>
                  <p className="px-5 pb-4 text-muted-foreground leading-relaxed text-sm">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Region */}
      <section className="py-14 px-4 bg-muted/40">
        <div className="max-w-4xl mx-auto text-center">
          <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Dach & Photovoltaik im gesamten Ruhrgebiet</h2>
          <p className="text-muted-foreground leading-relaxed">Rex Bedachungs GmbH bereitet Dächer für Photovoltaik vor – in Bochum, Herne, Castrop-Rauxel, Witten, Hattingen und Gelsenkirchen. Braas PV Premium oder Aufdach-Vorbereitung, inklusive kostenlosem Dachcheck.</p>
        </div>
      </section>

      {/* Verwandte Leistungen */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Verwandte Leistungen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <a href="/dachsanierung-bochum" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">Dachsanierung Bochum</div>
              <div className="text-sm text-gray-500">Komplettsanierung – oft der erste Schritt vor PV.</div>
            </a>
            <a href="/steildach-bochum" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">Steildach Bochum</div>
              <div className="text-sm text-gray-500">Neueindeckung, Dämmung – die Basis für PV Premium.</div>
            </a>
            <a href="/flachdach-bochum" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">Flachdach Bochum</div>
              <div className="text-sm text-gray-500">Abdichtung und Aufständerung für Flachdach-PV.</div>
            </a>
            <a href="/solarpflicht" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">NRW-Solardachpflicht</div>
              <div className="text-sm text-gray-500">Alle Details zur Pflicht und Ausnahmen.</div>
            </a>
            <a href="/foerderung" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">Förderung</div>
              <div className="text-sm text-gray-500">BEG EM, KfW, iSFP-Bonus im Überblick.</div>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Dach + PV planen? Kostenloser Dachcheck.</h2>
          <p className="text-muted-foreground mb-8">Wir prüfen Ihr Dach auf PV-Tauglichkeit, beraten zu Braas PV Premium und bereiten alles für die Solaranlage vor – kostenlos und unverbindlich.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <a href="/kontakt" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Kostenlosen Dachcheck anfragen
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="tel:+49234583100" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Jetzt anrufen
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
