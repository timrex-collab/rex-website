import { useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  Droplets,
  Layers,
  Building2,
  Wrench,
  Award,
  Zap,
  Coins,
  Factory,
  MapPin,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const heroImage = "/images/kamin-sanierung-bochum-dachdecker.webp";

const services = [
  {
    icon: <Droplets className="w-8 h-8 text-primary" />,
    title: "Dachrinnen & Fallrohre Bochum",
    text: "Verstopfte, undichte oder veraltete Dachrinnen und Fallrohre erneuern wir komplett – maßgefertigt aus Zink, Aluminium oder Kupfer. Inklusive Laubschutzgitter auf Wunsch. Saubere Entwässerung schützt Fassade und Fundament.",
    testId: "card-dachrinnen",
  },
  {
    icon: <Layers className="w-8 h-8 text-primary" />,
    title: "Dachränder & Traufbleche",
    text: "Dachränder, Traufbleche und Ortgangbleche fertigen wir passgenau in unserer Werkstatt und montieren sie dauerhaft dicht. Saubere Abschlüsse verhindern Feuchtigkeitsschäden und geben dem Dach ein professionelles Erscheinungsbild.",
    testId: "card-dachraender",
  },
  {
    icon: <Building2 className="w-8 h-8 text-primary" />,
    title: "Wandbekleidungen & Attiken",
    text: "Fassadenbekleidungen, Attikabdeckungen und Wandanschlüsse aus Titanzink oder Aluminium – langlebig, wartungsarm und optisch hochwertig. Wir fertigen alle Teile maßgenau und montieren sie fachgerecht mit vollständiger Abdichtung.",
    testId: "card-wandbekleidungen",
  },
  {
    icon: <Wrench className="w-8 h-8 text-primary" />,
    title: "Kehlen & Dachanschlüsse",
    text: "Kehlen, Kaminanschlüsse und alle Dachdurchdringungen sind die häufigsten Schwachstellen am Dach. Wir dichten sie dauerhaft mit Zinkblech, Kupfer oder Aluminiumband ab – präzise, sauber und langlebig.",
    testId: "card-kehlen",
  },
  {
    icon: <Award className="w-8 h-8 text-primary" />,
    title: "Sonderanfertigungen & Restaurierung",
    text: "Historische Gebäude, Gauben, Türmchen oder ungewöhnliche Dachformen – wir fertigen jede Sonderlösung in unserer Werkstatt. Auch Restaurierung und Erneuerung bestehender Blecharbeiten nach Originalvorbild.",
    testId: "card-sonderanfertigungen",
  },
];

const vorteile = [
  "Maßgefertigte Bauteile aus eigener Werkstatt",
  "Hochwertige Materialien: Titanzink, Kupfer, Aluminium",
  "Dachrinnen, Fallrohre, Dachränder, Kehlen",
  "Wandbekleidungen, Attiken und Fassadenverkleidungen",
  "Fachgerechte Montage und vollständige Abdichtung",
  "Sonderanfertigungen für jede Dachform",
  "40+ Jahre Erfahrung im Ruhrgebiet",
];

const vorgehen = [
  "Aufmaß vor Ort – kostenlos und unverbindlich",
  "Anfertigung aller Bauteile in eigener Werkstatt",
  "Termingerechte Lieferung und Montage",
  "Fachgerechte Abdichtung aller Anschlüsse",
  "Endabnahme gemeinsam mit dem Kunden",
  "Dokumentation und Übergabe",
];

const materialien = [
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Titanzink",
    text: "Das langlebigste Material für Blecharbeiten – Lebensdauer 80–100 Jahre, wartungsarm, entwickelt eine edle Patina. Standard bei Rex Bedachungs GmbH.",
    testId: "card-titanzink",
  },
  {
    icon: <Coins className="w-8 h-8 text-primary" />,
    title: "Kupfer",
    text: "Zeitlos, hochwertig und extrem langlebig – Kupfer ist die Premiumoption für anspruchsvolle Gebäude und Denkmäler. Entwickelt die charakteristische Grünpatina.",
    testId: "card-kupfer",
  },
  {
    icon: <Layers className="w-8 h-8 text-primary" />,
    title: "Aluminium",
    text: "Leicht, korrosionsbeständig und wirtschaftlich – ideal für große Flächen und moderne Architektur. In allen RAL-Farben pulverbeschichtet lieferbar.",
    testId: "card-aluminium",
  },
];

const faqItems = [
  {
    question: "Was kostet eine neue Dachrinne in Bochum?",
    answer:
      "Die Kosten hängen von Material, Länge und Zugänglichkeit ab. Aluminium-Dachrinnen beginnen ab ca. 30–60 €/m inkl. Montage, Zinkrinnen ab ca. 50–90 €/m. Wir erstellen Ihnen kostenlos ein genaues Angebot nach Aufmaß vor Ort.",
  },
  {
    question: "Welches Material ist für Dachrinnen am besten?",
    answer:
      "Titanzink ist die langlebigste Wahl mit einer Lebensdauer von bis zu 80 Jahren – ideal für alle, die langfristig investieren wollen. Aluminium ist die wirtschaftliche Alternative mit sehr guter Korrosionsbeständigkeit. Wir beraten Sie kostenlos zu allen Optionen.",
  },
  {
    question: "Fertigen Sie auch Sondermaße?",
    answer:
      "Ja – alle Bauteile werden in unserer eigenen Werkstatt in Bochum maßgenau gefertigt. Ob ungewöhnliche Rinnengrößen, Sonderprofile oder historische Formen – wir produzieren alles nach Maß.",
  },
  {
    question: "Reparieren Sie auch bestehende Blecharbeiten?",
    answer:
      "Ja, wir reparieren und erneuern bestehende Dachrinnen, Fallrohre, Kehlen und Wandbekleidungen – auch partiell wenn nicht alles erneuert werden muss. Einfach Termin für eine kostenlose Besichtigung vereinbaren.",
  },
  {
    question: "Übernehmen Sie auch Arbeiten an Altbauten?",
    answer:
      "Absolut – gerade bei Altbauten und Denkmälern ist handwerkliches Können gefragt. Wir restaurieren und erneuern Blecharbeiten nach Originalvorbild und arbeiten eng mit Denkmalbehörden zusammen wenn nötig.",
  },
];

const schemaJson = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Bauklempnerei Bochum",
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
  "areaServed": ["Bochum", "Herne", "Castrop-Rauxel", "Witten", "Hattingen", "Ruhrgebiet"],
  "description": "Bauklempnerei in Bochum – maßgefertigte Dachrinnen, Fallrohre, Wandbekleidungen und Fassadenverkleidungen aus Titanzink, Kupfer und Aluminium. Eigene Werkstatt, fachgerechte Montage.",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
  },
});

export default function BauklempnereiBochum() {
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Bauklempnerei Bochum – Blecharbeiten | Rex Bedachung</title>
        <meta
          name="description"
          content="Bauklempnerei Bochum ✓ Dachrinnen & Fallrohre ✓ Titanzink, Kupfer, Aluminium ✓ Eigene Werkstatt ✓ Maßgefertigte Blecharbeiten – Rex Bedachungs GmbH."
        />
        <meta property="og:title" content="Bauklempnerei Bochum – Dachrinnen, Blecharbeiten & Fassadenverkleidung | Rex Bedachungs GmbH" />
        <meta
          property="og:description"
          content="Bauklempnerei Bochum ✓ Dachrinnen & Fallrohre ✓ Titanzink, Kupfer, Aluminium ✓ Eigene Werkstatt ✓ Maßgefertigte Blecharbeiten – Rex Bedachungs GmbH, Ihr Fachbetrieb im Ruhrgebiet."
        />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/kamin-sanierung-bochum-dachdecker.webp" />
        <meta property="og:site_name" content="Rex Bedachungs GmbH" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bauklempnerei Bochum – Blecharbeiten | Rex Bedachung" />
        <meta name="twitter:description" content="Bauklempnerei Bochum ✓ Dachrinnen & Fallrohre ✓ Titanzink, Kupfer, Aluminium ✓ Eigene Werkstatt – Rex Bedachungs GmbH." />
        <meta name="twitter:image" content="https://www.rex-bedachung.de/images/kamin-sanierung-bochum-dachdecker.webp" />
        <link rel="canonical" href="https://www.rex-bedachung.de/bauklempnerei-bochum" />
        <script type="application/ld+json">{schemaJson}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type":"ListItem","position":1,"name":"Startseite","item":"https://www.rex-bedachung.de/"},
    {"@type":"ListItem","position":2,"name":"Bauklempnerei Bochum","item":"https://www.rex-bedachung.de/bauklempnerei-bochum"}
  ]
}`}</script>
      </Helmet>

      {/* Hero */}
      <section
        className="relative text-white py-24 px-4 overflow-hidden"
        data-testid="section-hero"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImage}')` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30" aria-hidden="true" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 max-w-3xl" data-testid="heading-hero">
            Bauklempnerei Bochum – maßgefertigte Blecharbeiten vom Fachbetrieb
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-xl" data-testid="text-hero-subtitle">
            Dachrinnen, Fallrohre, Wandbekleidungen und Fassadenverkleidungen – alles aus eigener Werkstatt, präzise gefertigt und dauerhaft montiert
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Button
              size="lg"
              className="pulse-ring"
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
          <p className="text-sm text-slate-300 font-medium" data-testid="text-trust-badge">
            Eigene Werkstatt &bull; Zink, Kupfer, Aluminium &bull; 40+ Jahre Erfahrung
          </p>
        </div>
      </section>

      {/* Einleitung */}
      <section className="py-16 px-4 bg-background" data-testid="section-einleitung">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg" data-testid="text-einleitung">
            Hochwertige Blecharbeiten sind entscheidend für die Langlebigkeit und Optik Ihres Daches. Unsere Klempner fertigen alle Bauteile maßgenau in unserer eigenen Werkstatt – Dachrinnen, Fallrohre, Dachränder, Kehlen und Fassadenbekleidungen. Wir arbeiten ausschließlich mit langlebigen Materialien wie Titanzink, Kupfer und Aluminium und garantieren fachgerechte Montage mit vollständiger Abdichtung aller Anschlüsse.
          </p>
        </div>
      </section>

      {/* Leistungskarten */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-leistungen">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground" data-testid="heading-leistungen">
            Unsere Klempner-Leistungen in Bochum
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

      {/* Materialien */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-materialien">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground" data-testid="heading-materialien">
            Unsere Materialien – langlebig und bewährt
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto" data-testid="text-materialien">
            Wir verarbeiten ausschließlich Premiumqualität namhafter Hersteller
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {materialien.map((m) => (
              <Card key={m.testId} data-testid={m.testId}>
                <CardHeader className="flex flex-col items-start gap-3 pb-2">
                  <div className="shrink-0">{m.icon}</div>
                  <CardTitle className="text-base leading-snug">{m.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{m.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Highlight-Box Eigene Werkstatt */}
      <section className="py-16 px-4 bg-background" data-testid="section-werkstatt">
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-md p-8 md:p-10 flex flex-col md:flex-row items-center gap-6"
            style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" }}
            data-testid="box-werkstatt"
          >
            <Factory className="w-10 h-10 text-blue-300 shrink-0" aria-hidden="true" />
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2" data-testid="heading-werkstatt">
                Alles aus eigener Werkstatt – kein Zwischenhändler
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed" data-testid="text-werkstatt">
                Was andere einkaufen, fertigen wir selbst. Unsere Klempner produzieren alle Bauteile direkt in unserer Werkstatt in Bochum – maßgenau, schnell und ohne Aufpreis für Sondermaße. Das spart Zeit, Kosten und garantiert perfekte Passgenauigkeit.
              </p>
            </div>
            <Button
              size="lg"
              className="bg-blue-400 text-white border-blue-400 shrink-0"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-werkstatt-anfragen"
            >
              Jetzt Aufmaß anfragen
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground" data-testid="heading-faq">
            Häufige Fragen zur Bauklempnerei in Bochum
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
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="w-6 h-6 text-primary" aria-hidden="true" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="heading-regionen">
              Bauklempnerei im gesamten Ruhrgebiet
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed text-base" data-testid="text-regionen">
            Rex Bedachungs GmbH übernimmt Klempnerarbeiten in Bochum, Herne, Castrop-Rauxel, Witten, Hattingen, Wattenscheid, Gelsenkirchen und dem gesamten Ruhrgebiet – termingerecht, sauber und zu fairen Preisen.
          </p>
        </div>
      </section>

      {/* Abschluss-CTA */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-cta">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground" data-testid="heading-cta">
            Interesse an Klempnerarbeiten? Jetzt anfragen!
          </h2>
          <p className="text-muted-foreground mb-8 text-base" data-testid="text-cta">
            Kostenloses Aufmaß vor Ort – wir melden uns kurzfristig.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="pulse-ring"
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
