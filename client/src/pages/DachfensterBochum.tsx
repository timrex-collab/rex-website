import { useState } from "react";
import { Helmet } from "react-helmet";
import OrganizationSchema from "@/components/OrganizationSchema";
import { useLocation } from "wouter";
import Breadcrumb from "@/components/Breadcrumb";
import Picture from "@/components/Picture";
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
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const heroImage = "/images/velux-dachfenster-einbau-bochum-fachbetrieb.webp";
const heroImageFallback = "/images/velux-dachfenster-einbau-bochum-fachbetrieb.jpg";
const galleryImages = [
  { src: "/images/velux-dachfenster-bochum-typ2.webp", fallback: "/images/velux-dachfenster-bochum-typ2.jpg", alt: "VELUX Dachfenster Typ 2 – Bochum" },
  { src: "/images/velux-dachfenster-einbau-bochum-fachbetrieb.webp", fallback: heroImageFallback, alt: "Dachfenster Einbau Bochum – Rex Bedachungs GmbH Fachbetrieb" },
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
  {
    question: "Brauche ich für ein Dachfenster eine Baugenehmigung?",
    answer:
      "Der reine Austausch eines bestehenden Dachfensters ist in den meisten Fällen genehmigungsfrei – vorausgesetzt, das Erscheinungsbild des Dachs wird nicht wesentlich verändert. Beim Neueinbau zusätzlicher Fenster hängt die Genehmigungspflicht von der Gemeinde und dem Bebauungsplan ab. Rex Bedachungs GmbH berät Sie kostenlos zum genauen Ablauf in Bochum.",
  },
  {
    question: "Gibt es Förderung für den Einbau von Dachfenstern?",
    answer:
      "Ja – wenn im Zuge des Dachfenstereinbaus eine GEG-konforme Dämmung am Eindeckrahmen oder der Laibung ausgeführt wird, kann die Maßnahme über BAFA (BEG Einzelmaßnahme) mit bis zu 15 % gefördert werden. Zusätzlich ist ein KfW-Kredit möglich. Wir beraten Sie kostenlos zu allen aktuellen Fördermöglichkeiten.",
  },
  {
    question: "Kann ein altes VELUX-Fenster 1:1 ersetzt werden?",
    answer:
      "In der Regel ja – VELUX bietet für ältere Modelle passende Austauschfenster an, die ohne großen Eingriff in die Dachkonstruktion eingebaut werden können. Der Austausch ist meist in einem halben bis ganzen Arbeitstag erledigt. Als anerkannter VELUX-Fachbetrieb findet Rex Bedachungs GmbH die passende Lösung für Ihr Fenster.",
  },
];

const schemaJson = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Dachfenster Einbau Bochum",
  "provider": {
    "@type": "RoofingContractor",
    "@id": "https://www.rex-bedachung.de/#organization",
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
        <title>Dachfenster Bochum – Einbau & Austausch | Rex Bedachung</title>
        <meta
          name="description"
          content="Dachfenster in Bochum einbauen oder ersetzen? Rex Bedachung montiert Velux & Fakro – inkl. Dämmung und Anschlussabdichtung. Angebot anfragen."
        />
        <meta property="og:title" content="Dachfenster Bochum – VELUX & Roto Einbau | Rex Bedachungs GmbH" />
        <meta
          property="og:description"
          content="VELUX-Fachbetrieb für Dachfenster in Bochum. Neueinbau, Austausch & Reparatur – mit Förderberatung."
        />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/velux-dachfenster-einbau-bochum-fachbetrieb.webp" />
        <meta property="og:site_name" content="Rex Bedachungs GmbH" />
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
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Dachfenster Einbau und Austausch",
  "description": "Einbau, Austausch und Wartung von Dachfenstern aller Marken in Bochum – inkl. Velux.",
  "provider": {
    "@type": "RoofingContractor",
    "@id": "https://www.rex-bedachung.de/#organization"
  },
  "areaServed": {
    "@type": "City",
    "name": "Bochum"
  },
  "serviceType": "Dachfenstereinbau"
}`}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Was kostet ein Dachfenster Einbau in Bochum?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Die Kosten variieren je nach Modell und Aufwand. Ein einfacher Austausch beginnt ab ca. 1.000 Euro, ein Standard-Austausch (GGL/GGU/GPU) ab ca. 1.500 Euro, Premium-/Integra-Modelle ab ca. 1.800 Euro."
      }
    },
    {
      "@type": "Question",
      "name": "Wie lange dauert der Einbau eines Dachfensters?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ein Austausch ist in der Regel an einem halben Tag erledigt. Ein Neueinbau dauert je nach Dachkonstruktion 1–2 Tage."
      }
    },
    {
      "@type": "Question",
      "name": "Kann ich Förderung für neue Dachfenster bekommen?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ja! Beim Austausch gegen energieeffiziente Modelle können Sie über BAFA oder KfW bis zu 15% der Kosten fördern lassen. Wir beraten Sie kostenlos dazu."
      }
    },
    {
      "@type": "Question",
      "name": "Welche Dachfenster-Marken verbauen Sie?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Wir sind VELUX-Fachbetrieb und verbauen zusätzlich Roto Dachfenster in allen Ausführungen."
      }
    },
    {
      "@type": "Question",
      "name": "Brauche ich für ein Dachfenster eine Baugenehmigung?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Der reine Austausch eines bestehenden Dachfensters ist in den meisten Fällen genehmigungsfrei – vorausgesetzt, das Erscheinungsbild des Dachs wird nicht wesentlich verändert. Beim Neueinbau zusätzlicher Fenster hängt die Genehmigungspflicht von der Gemeinde und dem Bebauungsplan ab. Rex Bedachungs GmbH berät Sie kostenlos zum genauen Ablauf in Bochum."
      }
    },
    {
      "@type": "Question",
      "name": "Gibt es Förderung für den Einbau von Dachfenstern?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ja – wenn im Zuge des Dachfenstereinbaus eine GEG-konforme Dämmung am Eindeckrahmen oder der Laibung ausgeführt wird, kann die Maßnahme über BAFA (BEG Einzelmaßnahme) mit bis zu 15 % gefördert werden. Zusätzlich ist ein KfW-Kredit möglich. Wir beraten Sie kostenlos zu allen aktuellen Fördermöglichkeiten."
      }
    },
    {
      "@type": "Question",
      "name": "Kann ein altes VELUX-Fenster 1:1 ersetzt werden?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "In der Regel ja – VELUX bietet für ältere Modelle passende Austauschfenster an, die ohne großen Eingriff in die Dachkonstruktion eingebaut werden können. Der Austausch ist meist in einem halben bis ganzen Arbeitstag erledigt. Als anerkannter VELUX-Fachbetrieb findet Rex Bedachungs GmbH die passende Lösung für Ihr Fenster."
      }
    }
  ]
}`}</script>
      </Helmet>
      <OrganizationSchema />

      <Breadcrumb items={[
        { label: "Startseite", href: "/" },
        { label: "Leistungen", href: "/leistungen" },
        { label: "Dachfenster" }
      ]} />

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
            Dachfenster Bochum – Einbau &amp; Austausch vom Meisterbetrieb
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-xl" data-testid="text-hero-subtitle">
            Neueinbau, Austausch und Reparatur – schnell, sauber, mit Förderung
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Button
              size="lg"
              className="pulse-ring cta-pulse"
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
              <a href="tel:+49234583100" className="flex items-center gap-2">
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
                <Picture
                  src={img.src}
                  fallback={img.fallback}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Referenz-Galerie ── */}
      <section className="py-12 bg-slate-50 dark:bg-muted/40 px-4" data-testid="section-referenz-galerie">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-foreground mb-8" data-testid="heading-referenz-galerie">
            VELUX Dachfenster – Unsere Referenzen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <figure>
              <img
                src="/images/velux-dachfenster-3er-kombination-steildach-bochum.webp"
                alt="VELUX Dachfenster 3er-Kombination auf anthrazitem Steildach – Rex Bedachungs GmbH Bochum"
                width="1920"
                height="1561"
                loading="lazy"
                className="w-full rounded-md object-cover"
                data-testid="img-referenz-3er-kombination"
              />
              <figcaption className="mt-2 text-sm text-slate-500 dark:text-muted-foreground">
                VELUX 3er-Kombination · Anthrazit-Steildach · Bochum 2024
              </figcaption>
            </figure>
            <figure>
              <img
                src="/images/velux-dachfenster-doppelanlage-einbau-tonziegel-bochum.webp"
                alt="VELUX Dachfenster Doppelanlage Einbau auf Tonziegel-Steildach – Rex Bedachungs GmbH Bochum"
                width="1920"
                height="1470"
                loading="lazy"
                className="w-full rounded-md object-cover"
                data-testid="img-referenz-doppelanlage"
              />
              <figcaption className="mt-2 text-sm text-slate-500 dark:text-muted-foreground">
                VELUX Doppelanlage · Tonziegel · Bochum 2024
              </figcaption>
            </figure>
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
              className="rounded-md p-6 md:p-8 cursor-pointer hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" }}
              onClick={() => setLocation("/velux-dachfenster-austausch-bochum")}
              data-testid="card-cluster-austausch"
            >
              <div className="flex items-center gap-2 mb-3">
                <RefreshCw className="w-5 h-5 text-blue-300" aria-hidden="true" />
                <h3 className="font-semibold text-lg text-white">
                  Velux Dachfenster Austausch Bochum
                </h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Altes Velux Fenster austauschen lassen – Modellvergleich GGL, GGU, GPU und Integra, 
                Preise ab 1.000 €, 7-Schritte-Ablauf und kostenlose Beratung vor Ort.
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-blue-300 mb-4">
                <span className="flex items-center gap-1"><BarChart3 className="w-3.5 h-3.5" aria-hidden="true" />Preisvergleich</span>
                <span className="flex items-center gap-1"><ListChecks className="w-3.5 h-3.5" aria-hidden="true" />Schritt-für-Schritt</span>
                <span className="flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />Modellvergleich</span>
              </div>
              <span className="text-blue-300 text-sm font-medium flex items-center gap-1">
                Zum Austausch-Guide <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </span>
            </div>
            <div
              className="rounded-md p-6 md:p-8 cursor-pointer hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" }}
              onClick={() => setLocation("/velux-dachfenster-rolllaeden-bochum")}
              data-testid="card-cluster-rolllaeden"
            >
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-blue-300" aria-hidden="true" />
                <h3 className="font-semibold text-lg text-white">
                  Velux Außenrollladen Bochum – SSL Solar nachrüsten
                </h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Bis zu 94% Hitzeschutz durch Außenrollladen – SSL Solar kabellos nachrüsten, 
                Vergleich SSL vs. SML, Montage von innen ab ca. 700 €.
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-blue-300 mb-4">
                <span className="flex items-center gap-1"><BarChart3 className="w-3.5 h-3.5" aria-hidden="true" />Preisvergleich</span>
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5" aria-hidden="true" />SSL vs. SML</span>
                <span className="flex items-center gap-1"><Wrench className="w-3.5 h-3.5" aria-hidden="true" />Montage von innen</span>
              </div>
              <span className="text-blue-300 text-sm font-medium flex items-center gap-1">
                Zum Rollladen-Guide <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stadtteile ── */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-stadtteile">
        <div className="max-w-4xl mx-auto text-center">
          <MapPin className="w-8 h-8 text-primary mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Dachfenster-Einbau in Bochum – alle Stadtteile
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-6">
            Rex Bedachungs GmbH montiert und tauscht Dachfenster in allen Bochumer Stadtteilen – von Wiemelhausen und
            Stiepel über Weitmar, Querenburg und Altenbochum bis nach Steinkuhl und Ehrenfeld.
            Kurze Wege, schnelle Termine, saubere Ausführung vom Meisterbetrieb.
          </p>
          <p className="text-sm text-slate-600">
            Als Dachdecker-Meisterbetrieb aus Bochum führt die Rex Bedachungs GmbH Dachfensterarbeiten seit 1984
            im gesamten Stadtgebiet durch – autorisierter VELUX-Partner mit über 40 Jahren Erfahrung im Ruhrgebiet.
          </p>
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
              <a href="tel:+49234583100" className="flex items-center gap-2">
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
