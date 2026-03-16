import { useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import Breadcrumb from "@/components/Breadcrumb";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  AlertTriangle,
  Home,
  Wrench,
  Thermometer,
  Layers,
  MapPin,
  Square,
  TrendingDown,
  Leaf,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const heroImage = "/images/tondach-hero-dachdeckung-bochum.webp";

const galleryImages = [
  { src: "/images/tondach-ziegel-bochum-steildach-3.webp", alt: "Steildach mit Tonziegeln Bochum – Rex Bedachungs GmbH" },
  { src: "/images/tondach-dachziegel-bochum-typ1.webp", alt: "Dachziegel Bochum Typ 1 – Rex Bedachungs GmbH" },
  { src: "/images/tondach-dachziegel-bochum-typ2.webp", alt: "Dachziegel Bochum Typ 2 – Rex Bedachungs GmbH" },
];

const services = [
  {
    icon: <Home className="w-8 h-8 text-primary" />,
    title: "Steildach Neueindeckung Bochum",
    text: "Komplette Neueindeckung aller Steildachformen – Satteldach, Walmdach, Zeltdach und Pultdach. Mit Tonziegeln, Betondachsteinen oder Schiefer, fachgerecht verlegt nach DIN-Norm und mit Gewährleistung.",
    testId: "card-neueindeckung",
  },
  {
    icon: <Wrench className="w-8 h-8 text-primary" />,
    title: "Steildach Sanierung & Dachstuhl",
    text: "Sanierung von Altdächern inklusive Dachstuhlprüfung, Lattung, Unterspannbahn und Neueindeckung. Wir erkennen Schwachstellen frühzeitig und beseitigen sie dauerhaft – für ein dichtes, sicheres Dach.",
    testId: "card-sanierung",
  },
  {
    icon: <Thermometer className="w-8 h-8 text-primary" />,
    title: "Steildach Dämmung & Wärmeschutz",
    text: "Fachgerechte Zwischensparren-, Aufsparren- und Untersparrendämmung nach aktueller EnEV/GEG. Senkt Heizkosten dauerhaft und steigert den Wohnkomfort im Dachgeschoss spürbar.",
    testId: "card-daemmung",
  },
  {
    icon: <Square className="w-8 h-8 text-primary" />,
    title: "Dachgauben & Dachfenster einbauen",
    text: "Einbau und Sanierung von Dachgauben, Schleppgauben und Dachfenstern aller Hersteller – inklusive fachgerechter Eindeckung, Anschlüsse und Abdichtung rund um die Durchdringung.",
    testId: "card-gauben",
  },
  {
    icon: <Layers className="w-8 h-8 text-primary" />,
    title: "Dachrinnen, Blech & Klempnerarbeiten",
    text: "Montage und Erneuerung von Dachrinnen, Fallrohren, Traufblechen und Ortgangblechen. Wir arbeiten mit Zink, Aluminium und Kupfer – sauber, dicht und langlebig.",
    testId: "card-klempner",
  },
];

const daemmungCards = [
  {
    icon: <Thermometer className="w-8 h-8 text-primary" />,
    title: "Aufsparrendämmung – die beste Lösung",
    text: "Die Aufsparrendämmung (auch Überdämmung genannt) wird auf den Dachsparren verlegt – ohne den Wohnraum zu verkleinern. Kältebrücken werden vollständig eliminiert, die Dämmwirkung ist deutlich besser als bei Zwischen- oder Untersparrendämmung. Ideal bei Neueindeckung oder kompletter Dachsanierung.",
    testId: "card-aufsparren",
  },
  {
    icon: <Home className="w-8 h-8 text-primary" />,
    title: "Zwischensparrendämmung",
    text: "Klassische Dämmung zwischen den Dachsparren – wirtschaftlich und bewährt. Gut geeignet wenn der Dachboden ausgebaut werden soll und keine vollständige Neueindeckung geplant ist. Wir beraten Sie welches System für Ihr Dach optimal ist.",
    testId: "card-zwischensparren",
  },
  {
    icon: <TrendingDown className="w-8 h-8 text-primary" />,
    title: "Bis zu 20 % Förderung – BAFA & KfW",
    text: "Energetische Dachsanierungen werden staatlich gefördert: BAFA-Bundesförderung für effiziente Gebäude (BEG) bis 20 % der Investitionskosten. KfW-Kredit mit Niedrigzins zusätzlich möglich. Wir übernehmen die komplette Förderberatung kostenlos.",
    testId: "card-foerderung-daemmung",
  },
];

const materialien = [
  {
    title: "Tonziegel",
    text: "Natürlich, langlebig, bewährt. Tonziegel überzeugen mit über 100 Jahren Lebensdauer, natürlicher Optik und hervorragender Witterungsbeständigkeit.",
    testId: "card-tonziegel",
  },
  {
    title: "Betondachstein",
    text: "Wirtschaftlich und robust. Betondachsteine bieten eine breite Auswahl an Farben und Profilen bei hoher Stabilität und gutem Preis-Leistungs-Verhältnis.",
    testId: "card-betondachstein",
  },
  {
    title: "Schiefer & Sonderdeckungen",
    text: "Exklusiv und einzigartig. Natürschiefer und Kunstschiefer für besondere Anforderungen – repräsentativ, dauerhaft und wertsteigernd.",
    testId: "card-schiefer",
  },
];

const vorteile = [
  "Alle Dachformen: Sattel-, Walm-, Zelt- und Pultdach",
  "Hochwertige Materialien von führenden Herstellern",
  "Fachgerechte Dämmung für optimalen Wärmeschutz",
  "Langlebige Konstruktionen mit Gewährleistung",
  "Schnelle und saubere Ausführung",
  "Meisterbetrieb – 40+ Jahre Erfahrung",
  "BAFA/KfW-Förderung bei Sanierung",
];

const vorgehen = [
  "Kostenlose Vor-Ort-Besichtigung und Beratung",
  "Detaillierte Planung und transparentes Angebot",
  "Professionelle Ausführung durch Meisterbetrieb",
  "Abschlusskontrolle und Übergabe",
  "Dokumentation und Gewährleistung",
  "Optional: Wartungsvertrag abschließen",
];

const faqItems = [
  {
    question: "Was kostet eine Steildach-Neueindeckung in Bochum?",
    answer:
      "Die Kosten hängen von Dachgröße, Dachform und gewähltem Material ab. Als Richtwert: 80–180 €/m² für eine Neueindeckung mit Tonziegeln oder Betondachsteinen inklusive Lattung und Unterspannbahn. Wir erstellen kostenlos ein genaues Angebot nach Besichtigung vor Ort.",
  },
  {
    question: "Wie lange hält ein neu eingedecktes Steildach?",
    answer:
      "Tonziegel halten 60–100 Jahre, Betondachsteine 30–50 Jahre, Naturschiefer über 100 Jahre – vorausgesetzt Lattung, Unterspannbahn und Dachanschlüsse sind fachgerecht ausgeführt. Das garantieren wir als Meisterbetrieb.",
  },
  {
    question: "Wird die Steildach-Sanierung gefördert?",
    answer:
      "Ja – bei energetischer Sanierung mit Dämmung gibt es BAFA-Zuschüsse bis 20% und günstige KfW-Kredite. Wir beraten Sie kostenlos zu allen aktuellen Fördermöglichkeiten und helfen beim Antrag.",
  },
  {
    question: "Sanieren Sie auch den Dachstuhl?",
    answer:
      "Ja. Vor jeder Neueindeckung prüfen wir den Dachstuhl auf Schäden und Standfestigkeit. Balken, Pfetten und Sparren reparieren oder ersetzen wir wenn nötig – alles aus einer Hand.",
  },
  {
    question: "Wie lange dauert eine Steildach-Neueindeckung?",
    answer:
      "Ein durchschnittliches Einfamilienhaus (ca. 150 m² Dachfläche) ist in 3–5 Arbeitstagen neu eingedeckt – abhängig von Dachform, Komplexität und Wetterlage. Wir arbeiten termingerecht und zuverlässig.",
  },
];

const schemaJson = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Steildach Bochum – Neueindeckung & Sanierung",
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
  "areaServed": ["Bochum", "Herne", "Castrop-Rauxel", "Witten", "Hattingen", "Gelsenkirchen", "Ruhrgebiet"],
  "description": "Steildach Neueindeckung und Sanierung in Bochum – Satteldach, Walmdach, Pultdach, Dämmung und Klempnerarbeiten. Meisterbetrieb mit 40+ Jahren Erfahrung im Ruhrgebiet.",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
  },
});

export default function SteildachBochum() {
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Steildach Bochum – Sanierung &amp; Dämmung | Rex</title>
        <meta
          name="description"
          content="Steildach Bochum ✓ Energetische Dachsanierung ✓ Aufsparrendämmung ✓ Bis zu 20 % BAFA/KfW-Förderung ✓ Heizkosten senken – Rex Bedachungs GmbH Bochum."
        />
        <meta property="og:title" content="Steildach Bochum – Neueindeckung, Sanierung & Dämmung | Rex Bedachungs GmbH" />
        <meta
          property="og:description"
          content="Steildach & energetische Dachsanierung Bochum ✓ Aufsparrendämmung ✓ Bis zu 20 % BAFA/KfW-Förderung ✓ Heizkosten dauerhaft senken – Rex Bedachungs GmbH, Ihr Fachbetrieb im Ruhrgebiet."
        />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/tondach-hero-dachdeckung-bochum.webp" />
        <meta property="og:site_name" content="Rex Bedachungs GmbH" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Steildach Bochum – Sanierung & Dämmung | Rex Bedachung" />
        <meta name="twitter:description" content="Steildach Bochum ✓ Energetische Dachsanierung ✓ Aufsparrendämmung ✓ Bis zu 20% BAFA/KfW-Förderung – Rex Bedachungs GmbH." />
        <meta name="twitter:image" content="https://www.rex-bedachung.de/images/tondach-hero-dachdeckung-bochum.webp" />
        <link rel="canonical" href="https://www.rex-bedachung.de/steildach-bochum" />
        <script type="application/ld+json">{schemaJson}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type":"ListItem","position":1,"name":"Startseite","item":"https://www.rex-bedachung.de/"},
    {"@type":"ListItem","position":2,"name":"Steildach Bochum","item":"https://www.rex-bedachung.de/steildach-bochum"}
  ]
}`}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Steildachsanierung und Dacheindeckung",
  "description": "Steildachsanierung, Neueindeckung und energetische Dachsanierung mit Aufsparrendämmung in Bochum.",
  "provider": {
    "@type": "RoofingContractor",
    "@id": "https://www.rex-bedachung.de/#organization"
  },
  "areaServed": {
    "@type": "City",
    "name": "Bochum",
    "sameAs": "https://www.wikidata.org/wiki/Q2103"
  },
  "serviceType": "Steildachsanierung"
}`}</script>
      </Helmet>
      <Breadcrumb items={[
        { label: "Startseite", href: "/" },
        { label: "Leistungen", href: "/leistungen" },
        { label: "Steildach" }
      ]} />
      {/* Hero */}
      <section
        className="relative text-white py-24 px-4 overflow-hidden"
        data-testid="section-hero"
      >
        <img
          src={heroImage}
          alt="Steildach Neueindeckung Bochum – Rex Bedachungs GmbH"
          className="absolute inset-0 w-full h-full object-cover"
          {...{ fetchpriority: "high" } as any}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30" aria-hidden="true" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 max-w-3xl" data-testid="heading-hero">
            Steildach Bochum – Neueindeckung &amp; Sanierung vom Meisterbetrieb
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-xl" data-testid="text-hero-subtitle">
            Satteldach, Walmdach oder Pultdach – wir decken alle Dachformen fachgerecht mit Tonziegeln und Betondachsteinen neu ein
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Button
              size="lg"
              className="pulse-ring cta-pulse"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-hero-angebot"
            >
              Angebot anfragen
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/40 text-white"
              data-testid="button-hero-anrufen"
            >
              <a href="tel:0234583100" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                0234-583100
              </a>
            </Button>
          </div>
          <p className="text-sm text-slate-300 font-medium" data-testid="text-trust-badge">Meisterbetrieb • 40+ Jahre Erfahrung • Ruhrgebiet</p>
        </div>
      </section>
      {/* Einleitung */}
      <section className="py-16 px-4 bg-background" data-testid="section-einleitung">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg" data-testid="text-einleitung">
            Als Meisterbetrieb bieten wir professionelle Steildacharbeiten für Neubauten und Sanierungen in Bochum und dem
            gesamten Ruhrgebiet. Ob Satteldach, Walmdach oder Pultdach – wir beherrschen alle gängigen Dachformen und arbeiten
            mit hochwertigen Materialien wie Tonziegeln und Betondachsteinen führender Hersteller. Unsere erfahrenen Dachdecker
            sorgen für fachgerechte Ausführung nach den neuesten Standards – damit Ihr Dach Jahrzehnte hält.
          </p>
        </div>
      </section>
      {/* Leistungskarten */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-leistungen">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground" data-testid="heading-leistungen">
            Unsere Steildach-Leistungen in Bochum
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <Card key={s.testId} data-testid={s.testId}>
                <CardHeader className="flex flex-row items-start gap-4 flex-wrap pb-2">
                  <div className="shrink-0 mt-1">{s.icon}</div>
                  <CardTitle className="text-lg leading-snug">{s.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Energetische Dachsanierung */}
      <section className="py-16 px-4 bg-background" data-testid="section-daemmung">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground" data-testid="heading-daemmung">
            Energetische Dachsanierung Bochum – jetzt Heizkosten senken
          </h2>
          <p className="text-muted-foreground text-center mb-4 max-w-2xl mx-auto font-medium" data-testid="text-daemmung-subtitle">
            Ein schlecht gedämmtes Dach kostet Sie jeden Monat bares Geld – wir ändern das.
          </p>
          <p className="text-muted-foreground text-center mb-10 max-w-3xl mx-auto text-sm leading-relaxed" data-testid="text-daemmung-intro">
            Bis zu 30 % der Heizenergie eines Hauses gehen über das Dach verloren. Eine professionelle Dachdämmung ist die
            effektivste Maßnahme um den Energieverbrauch dauerhaft zu senken – und wird mit bis zu 20 % durch BAFA und KfW gefördert.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {daemmungCards.map((d) => (
              <Card key={d.testId} data-testid={d.testId}>
                <CardHeader className="flex flex-col items-start gap-3 pb-2">
                  <div className="shrink-0">{d.icon}</div>
                  <CardTitle className="text-base leading-snug">{d.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{d.text}</p>
                </CardContent>
              </Card>
            ))}
            <Card data-testid="card-vorteile-daemmung">
              <CardHeader className="flex flex-col items-start gap-3 pb-2">
                <div className="shrink-0"><Leaf className="w-8 h-8 text-primary" /></div>
                <CardTitle className="text-base leading-snug">Vorteile auf einen Blick</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    "Heizkosten dauerhaft um bis zu 30 % senken",
                    "Wohnkomfort spürbar verbessern",
                    "Immobilienwert steigern",
                    "CO\u2082-Fußabdruck reduzieren",
                    "Sommerhitze effektiv abhalten",
                    "Förderfähig nach GEG (Gebäudeenergiegesetz)",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-muted-foreground text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div
            className="rounded-md p-8 md:p-10 mt-10 flex flex-col md:flex-row items-center gap-6"
            style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" }}
            data-testid="box-tipp-daemmung"
          >
            <Lightbulb className="w-10 h-10 text-blue-300 shrink-0" aria-hidden="true" />
            <div className="flex-1 text-center md:text-left">
              <p className="text-white font-semibold mb-1" data-testid="text-tipp-title">Tipp vom Fachbetrieb</p>
              <p className="text-slate-300 text-sm leading-relaxed" data-testid="text-tipp-body">
                Die Aufsparrendämmung lohnt sich besonders dann, wenn das Dach ohnehin neu eingedeckt wird – die Mehrkosten
                sind gering, der Effekt ist maximal. Rex Bedachungs GmbH berät Sie kostenlos vor Ort.
              </p>
            </div>
            <Button
              size="lg"
              className="bg-blue-400 text-white border-blue-400 shrink-0"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-tipp-beratung"
            >
              Kostenloses Beratungsgespräch anfragen
            </Button>
          </div>
        </div>
      </section>
      {/* Materialien */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-materialien">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground" data-testid="heading-materialien">
            Hochwertige Materialien vom Fachbetrieb
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto" data-testid="text-materialien">
            Wir arbeiten ausschließlich mit Produkten führender Hersteller.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {materialien.map((m) => (
              <Card key={m.testId} data-testid={m.testId}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{m.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{m.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Vorteile & Vorgehen */}
      <section className="py-16 px-4 bg-background" data-testid="section-vorteile">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div data-testid="col-vorteile">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground" data-testid="heading-vorteile">
                Ihre Vorteile
              </h2>
              <div className="space-y-4">
                {vorteile.map((v, i) => (
                  <div key={i} className="flex items-start gap-3" data-testid={`item-vorteil-${i}`}>
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-foreground font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div data-testid="col-vorgehen">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground" data-testid="heading-vorgehen">
                Unser Vorgehen
              </h2>
              <div className="space-y-4">
                {vorgehen.map((step, i) => (
                  <div key={i} className="flex items-start gap-4" data-testid={`item-vorgehen-${i}`}>
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-foreground font-medium pt-0.5">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Förderung */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-foerderung">
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-md p-8 md:p-12 text-center"
            style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" }}
            data-testid="box-foerderung"
          >
            <AlertTriangle className="w-10 h-10 text-blue-300 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" data-testid="heading-foerderung">
              Förderung für Steildach-Sanierung in Bochum
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4 max-w-2xl mx-auto" data-testid="text-foerderung">
              Bei der energetischen Sanierung Ihres Steildachs profitieren Sie von attraktiven Förderprogrammen:
            </p>
            <p className="text-slate-300 leading-relaxed mb-4 max-w-2xl mx-auto" data-testid="text-foerderung-bafa">
              BAFA-Bundesförderung BEG – bis zu 20% der Investitionskosten bei Dämmung nach GEG-Standard.
            </p>
            <p className="text-slate-300 leading-relaxed mb-4 max-w-2xl mx-auto" data-testid="text-foerderung-kfw">
              KfW-Programm 261 – günstige Kredite für energieeffiziente Sanierungen.
            </p>
            <p className="text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto" data-testid="text-foerderung-beratung">
              Wir beraten Sie kostenlos welche Förderung für Ihr Projekt in Frage kommt – und helfen bei der Antragstellung.
            </p>
            <Button
              size="lg"
              className="bg-blue-400 text-white border-blue-400"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-foerderung-anfragen"
            >
              Förderung anfragen
            </Button>
          </div>
        </div>
      </section>
      {/* Bild-Galerie */}
      <section className="py-16 px-4 bg-background" data-testid="section-galerie">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground" data-testid="heading-galerie">
            Einblicke in unsere Arbeit
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-md aspect-video bg-muted"
                data-testid={`img-galerie-${i}`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* FAQ */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground" data-testid="heading-faq">
            Häufige Fragen zum Steildach in Bochum
          </h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div key={i} className="border border-border rounded-md bg-card" data-testid={`faq-item-${i}`}>
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-card-foreground gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  data-testid={`button-faq-${i}`}
                >
                  <span>{item.question}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-5 h-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  )}
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${openFaq === i ? "max-h-96" : "max-h-0"}`}
                >
                  <p
                    className="px-5 pb-4 text-muted-foreground leading-relaxed text-sm"
                    data-testid={`text-faq-answer-${i}`}
                  >
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Regionen */}
      <section className="py-16 px-4 bg-background" data-testid="section-regionen">
        <div className="max-w-4xl mx-auto text-center">
          <MapPin className="w-8 h-8 text-primary mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground" data-testid="heading-regionen">
            Steildach Bochum &amp; Ruhrgebiet – Ihr Meisterbetrieb
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg" data-testid="text-regionen">
            Rex Bedachungs GmbH deckt Steildächer im gesamten Ruhrgebiet neu ein – in Bochum, Herne, Castrop-Rauxel,
            Witten, Hattingen, Wattenscheid, Gelsenkirchen und Recklinghausen. Meisterbetrieb mit über 40 Jahren Erfahrung
            in der Region.
          </p>
        </div>
      </section>
      {/* Verwandte Leistungen */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Das könnte Sie auch interessieren
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/foerderung" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">BAFA & KfW Förderung</div>
              <div className="text-sm text-gray-500">Bis zu 20% Zuschuss für Ihre Dachsanierung – wir beraten Sie kostenlos.</div>
            </a>
            <a href="/bauklempnerei-bochum" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">Bauklempnerei & Dachrinnen</div>
              <div className="text-sm text-gray-500">Dachrinnen, Fallrohre und Blecharbeiten aus einer Hand.</div>
            </a>
            <a href="/dachreparatur-bochum" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">Dachreparatur Bochum</div>
              <div className="text-sm text-gray-500">Schnelle Hilfe bei Sturmschäden, undichten Stellen und defekten Ziegeln.</div>
            </a>
          </div>
        </div>
      </section>

      {/* Abschluss-CTA */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-cta">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground" data-testid="heading-cta">
            Interesse an Steildach? Jetzt kostenlos beraten lassen!
          </h2>
          <p className="text-muted-foreground mb-8 text-base" data-testid="text-cta">
            Wir kommen zur kostenlosen Besichtigung und erstellen Ihnen ein transparentes Angebot – ohne versteckte Kosten,
            ohne Verpflichtung.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="pulse-ring cta-pulse"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-cta-angebot"
            >
              Angebot anfragen
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              data-testid="button-cta-anrufen"
            >
              <a href="tel:0234583100" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                0234-583100
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
