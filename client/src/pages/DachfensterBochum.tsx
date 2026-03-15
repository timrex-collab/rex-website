import { useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  Award,
  Wrench,
  RefreshCw,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  BarChart3,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const heroImage = "/images/velux-dachfenster-einbau-bochum-fachbetrieb.webp";
const galleryImages = [
  { src: "/images/velux-dachfenster-bochum-typ2.webp", alt: "VELUX Dachfenster Typ 2 – Bochum" },
  { src: "/images/velux-dachfenster-einbau-bochum-fachbetrieb.webp", alt: "Dachfenster Einbau Bochum – Rex Bedachungs GmbH Fachbetrieb" },
];

const services = [
  {
    icon: <Award className="w-8 h-8 text-primary" />,
    title: "Dachfenster Neueinbau Bochum",
    text: "Wir bauen VELUX und Roto Dachfenster fachgerecht in Ihr bestehendes Dach ein – inklusive Eindeckrahmen, Abdichtung und sauberer Innenverkleidung.",
    testId: "card-neueinbau",
  },
  {
    icon: <RefreshCw className="w-8 h-8 text-primary" />,
    title: "Altes Dachfenster austauschen",
    text: "Undicht, beschlagen oder veraltet? Wir tauschen Ihr altes Dachfenster schnell und sauber aus – oft ohne große Dacharbeiten und mit bis zu 20% Energieeinsparung.",
    testId: "card-austausch",
  },
  {
    icon: <Wrench className="w-8 h-8 text-primary" />,
    title: "Dachfenster Reparatur – schnelle Unterstützung",
    text: "Klemmt, tropft oder schließt nicht mehr richtig? Wir reparieren alle gängigen Dachfenster-Modelle – bei dringenden Fällen auch kurzfristig.",
    testId: "card-reparatur",
  },
];

const reasons = [
  "VELUX-Fachbetrieb",
  "40+ Jahre Erfahrung im Ruhrgebiet",
  "Schnelle Reaktionszeit – kurzfristige Hilfe",
  "Kostenlose Beratung & Förderantrag",
];

const faqItems = [
  {
    question: "Was kostet ein Dachfenster Einbau in Bochum?",
    answer:
      "Die Kosten variieren je nach Modell und Aufwand. Ein einfacher Austausch beginnt ab ca. 1.000 €, ein Standard-Austausch (GGL/GGU/GPU) ab ca. 1.500 €, Premium-/Integra-Modelle ab ca. 1.800 €. Die genauen Kosten ermitteln wir nach kostenlosem Aufmaß vor Ort – kein verbindlicher Preis ohne Besichtigung, aber realistische Preisrahmen als Orientierung.",
  },
  {
    question: "Wie lange dauert der Einbau eines Dachfensters?",
    answer:
      "Ein Austausch ist in der Regel an einem halben Tag erledigt. Ein Neueinbau dauert je nach Dachkonstruktion 1–2 Tage.",
  },
  {
    question: "Kann ich Förderung für neue Dachfenster bekommen?",
    answer:
      "Ja! Beim Austausch gegen energieeffiziente Modelle können Sie über BAFA oder KfW bis zu 15% der Kosten fördern lassen. Wir beraten Sie kostenlos dazu.",
  },
  {
    question: "Welche Dachfenster-Marken verbauen Sie?",
    answer:
      "Wir sind VELUX-Fachbetrieb und verbauen zusätzlich Roto Dachfenster in allen Ausführungen.",
  },
];

const schemaJson = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Dachfenster Einbau Bochum",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Rex Bedachungs GmbH",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bochum",
    },
  },
  "areaServed": "Bochum, Ruhrgebiet",
  "description": "VELUX und Roto Dachfenster – Neueinbau, Austausch und Reparatur",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
  },
});

export default function DachfensterBochum() {
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Dachfenster Bochum – VELUX Einbau | Rex Bedachung</title>
        <meta
          name="description"
          content="Dachfenster Bochum ✓ VELUX-Fachbetrieb ✓ Neueinbau & Austausch ✓ Kurzfristige Hilfe ✓ BAFA/KfW-Förderung – Rex Bedachungs GmbH, Ihr Fachbetrieb im Ruhrgebiet."
        />
        <meta property="og:title" content="Dachfenster Bochum – VELUX & Roto Einbau | Rex Bedachungs GmbH" />
        <meta
          property="og:description"
          content="VELUX-Fachbetrieb für Dachfenster in Bochum. Neueinbau, Austausch & Reparatur – mit Förderberatung."
        />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/velux-dachfenster-einbau-bochum-fachbetrieb.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dachfenster Bochum – VELUX Einbau | Rex Bedachung" />
        <meta name="twitter:description" content="Dachfenster Bochum ✓ VELUX-Fachbetrieb ✓ Neueinbau & Austausch ✓ Kurzfristige Hilfe ✓ BAFA/KfW-Förderung – Rex Bedachungs GmbH." />
        <meta name="twitter:image" content="https://www.rex-bedachung.de/images/velux-dachfenster-einbau-bochum-fachbetrieb.webp" />
        <link rel="canonical" href="https://www.rex-bedachung.de/dachfenster-bochum" />
        <script type="application/ld+json">{schemaJson}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type":"ListItem","position":1,"name":"Startseite","item":"https://www.rex-bedachung.de/"},
    {"@type":"ListItem","position":2,"name":"Dachfenster Bochum","item":"https://www.rex-bedachung.de/dachfenster-bochum"}
  ]
}`}</script>
      </Helmet>

      {/* ── Hero ── */}
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
            Dachfenster Bochum – VELUX &amp; Roto vom Fachbetrieb
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-xl" data-testid="text-hero-subtitle">
            Neueinbau, Austausch und Reparatur – schnell, sauber, mit Förderung
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Button
              size="lg"
              className="pulse-ring"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-hero-angebot"
            >
              Jetzt Angebot anfragen
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
                Jetzt anrufen
              </a>
            </Button>
          </div>
          <p className="text-sm text-slate-300 font-medium" data-testid="text-trust-badge">
            VELUX-Fachbetrieb &bull; 40+ Jahre Erfahrung &bull; Ruhrgebiet
          </p>
        </div>
      </section>

      {/* ── Leistungs-Sektion ── */}
      <section className="py-16 px-4 bg-background" data-testid="section-leistungen">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground" data-testid="heading-leistungen">
            Unsere Dachfenster-Leistungen in Bochum
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
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

      {/* ── Marken-Sektion ── */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-marken">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground" data-testid="heading-marken">
            Ihr VELUX &amp; Roto Fachbetrieb in Bochum
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg" data-testid="text-marken">
            Als VELUX-Fachbetrieb verfügen wir über umfassendes Fachwissen und direkten Zugang zu
            Originalteilen und Zubehör. Natürlich verbauen wir auch Roto Dachfenster in allen gängigen Ausführungen –
            vom einfachen Klappfenster bis zum elektrischen Dachflächenfenster mit Fernbedienung.
          </p>
        </div>
      </section>

      {/* ── Förderungs-Sektion ── */}
      <section className="py-16 px-4 bg-background" data-testid="section-foerderung">
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-md p-8 md:p-12 text-center"
            style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" }}
            data-testid="box-foerderung"
          >
            <AlertTriangle className="w-10 h-10 text-blue-300 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" data-testid="heading-foerderung">
              Bis zu 15% Förderung durch BAFA &amp; KfW
            </h2>
            <p className="text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto" data-testid="text-foerderung">
              Der Austausch alter Dachfenster gegen moderne, energieeffiziente Modelle wird staatlich gefördert. Über
              BAFA oder KfW können Sie bis zu 15% der Kosten zurückbekommen. Wir beraten Sie kostenlos zu allen
              Fördermöglichkeiten und übernehmen auf Wunsch die komplette Antragstellung.
            </p>
            <Button
              size="lg"
              className="bg-blue-400 text-white border-blue-400"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-foerderung-anfragen"
            >
              Jetzt Förderung anfragen
            </Button>
          </div>
        </div>
      </section>

      {/* ── Warum Rex ── */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-warum-rex">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground" data-testid="heading-warum-rex">
            Warum Rex Bedachungs GmbH?
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {reasons.map((reason, i) => (
              <div
                key={i}
                className="flex items-start gap-3"
                data-testid={`item-reason-${i}`}
              >
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-foreground font-medium">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bild-Galerie ── */}
      <section className="py-16 px-4 bg-background" data-testid="section-galerie">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground" data-testid="heading-galerie">
            Einblicke in unsere Arbeit
          </h2>
          <div className="grid grid-cols-2 gap-4">
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

      {/* ── FAQ ── */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground" data-testid="heading-faq">
            Häufige Fragen zu Dachfenstern in Bochum
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

      {/* ── Velux-Austausch-Teaser ── */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-velux-teaser">
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-md p-8 md:p-10 text-center"
            style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" }}
            data-testid="box-velux-teaser"
          >
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-full bg-blue-900/50 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-blue-300" aria-hidden="true" />
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3" data-testid="heading-velux-teaser">
              Velux Fenster austauschen?
            </h3>
            <p className="text-slate-300 leading-relaxed text-base md:text-lg mb-4" data-testid="text-velux-teaser">
              Speziell für den Austausch alter Velux Fenster haben wir eine eigene Seite mit Modellvergleich, Preisrahmen und Schritt-für-Schritt-Ablauf.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-300 mb-6">
              <span className="flex items-center gap-1.5"><BarChart3 className="w-4 h-4" aria-hidden="true" />Preisvergleich</span>
              <span className="flex items-center gap-1.5"><ListChecks className="w-4 h-4" aria-hidden="true" />Schritt-für-Schritt</span>
              <span className="flex items-center gap-1.5"><RefreshCw className="w-4 h-4" aria-hidden="true" />Modellvergleich</span>
            </div>
            <Button
              size="lg"
              className="bg-blue-400 text-white border-blue-400"
              onClick={() => setLocation("/velux-dachfenster-austausch-bochum")}
              data-testid="button-velux-teaser"
            >
              Zum Velux Austausch-Guide
              <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/40" data-testid="section-cluster">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground" data-testid="heading-cluster">
            Velux Dachfenster – Ratgeber & Spezialthemen
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            Alles was Sie zu Velux Dachfenstern in Bochum wissen müssen – von Austausch bis Sonnenschutz.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div
              className="bg-card border border-border rounded-md p-6 cursor-pointer hover:border-primary transition-colors"
              onClick={() => setLocation("/velux-dachfenster-austausch-bochum")}
              data-testid="card-cluster-austausch"
            >
              <h3 className="font-semibold text-lg text-foreground mb-2">
                Velux Dachfenster Austausch Bochum
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Altes Velux Fenster austauschen lassen – Modellvergleich GGL, GGU, GPU und Integra, 
                Preise ab 1.000 €, 7-Schritte-Ablauf und kostenlose Beratung vor Ort.
              </p>
              <span className="text-primary text-sm font-medium">
                Zum Austausch-Guide &rarr;
              </span>
            </div>
            <div
              className="bg-card border border-border rounded-md p-6 cursor-pointer hover:border-primary transition-colors"
              onClick={() => setLocation("/velux-dachfenster-rolllaeden-bochum")}
              data-testid="card-cluster-rolllaeden"
            >
              <h3 className="font-semibold text-lg text-foreground mb-2">
                Velux Außenrollladen Bochum – SSL Solar nachrüsten
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Bis zu 94% Hitzeschutz durch Außenrollladen – SSL Solar kabellos nachrüsten, 
                Vergleich SSL vs. SML, Montage von innen ab ca. 700 €.
              </p>
              <span className="text-primary text-sm font-medium">
                Zum Rollladen-Guide &rarr;
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Abschluss-CTA ── */}
      <section className="py-16 px-4 bg-background" data-testid="section-cta">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground" data-testid="heading-cta">
            Dachfenster in Bochum – Jetzt kostenlos beraten lassen
          </h2>
          <p className="text-muted-foreground mb-8 text-base" data-testid="text-cta">
            Rufen Sie uns an oder schreiben Sie uns – wir melden uns zeitnah.
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
                Anrufen
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
