import { useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import Breadcrumb from "@/components/Breadcrumb";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  Home,
  Thermometer,
  Layers,
  TrendingDown,
  AlertTriangle,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqItems = [
  {
    question: "Was ist der Unterschied zwischen Aufsparren- und Zwischensparrendämmung?",
    answer:
      "Bei der Aufsparrendämmung wird die Dämmschicht vollflächig auf die Sparren gelegt – ohne Unterbrechung, ohne Kältebrücken. Bei der Zwischensparrendämmung liegt die Dämmung zwischen den Sparren, die Sparren selbst bilden Kältebrücken und mindern die Gesamtwirkung.",
  },
  {
    question: "Muss das Dach für die Aufsparrendämmung komplett neu eingedeckt werden?",
    answer:
      "Ja – die Aufsparrendämmung erfordert die Demontage der bestehenden Eindeckung. Sie wird daher immer in Kombination mit einer Neueindeckung durchgeführt. Das macht sie besonders wirtschaftlich, wenn das Dach ohnehin saniert werden soll.",
  },
  {
    question: "Wird die Aufsparrendämmung gefördert?",
    answer:
      "Ja – GEG-konforme Aufsparrendämmung ist über BAFA (BEG Einzelmaßnahme) mit bis zu 20 % förderfähig. Zusätzlich ist ein KfW-Kredit (Programm 261) möglich. Rex Bedachung berät kostenlos zur Antragstellung.",
  },
  {
    question: "Verliere ich durch die Aufsparrendämmung Raumhöhe im Dachgeschoss?",
    answer:
      "Nein – das ist der entscheidende Vorteil gegenüber der Untersparrendämmung. Die Dämmschicht liegt außen auf den Sparren, der Innenraum bleibt vollständig erhalten.",
  },
  {
    question: "Wie dick muss die Dämmschicht sein?",
    answer:
      "Die erforderliche Dämmstärke hängt vom U-Wert-Ziel nach GEG und dem vorhandenen Sparrenquerschnitt ab. Rex Bedachung ermittelt die optimale Stärke im Rahmen der kostenlosen Vor-Ort-Beratung.",
  },
];

const variantenCards = [
  {
    icon: <Thermometer className="w-6 h-6 text-primary" />,
    title: "Aufsparrendämmung – empfohlen",
    text: "Dämmung über den Sparren. Keine Kältebrücken, kein Raumverlust, maximale Dämmwirkung. Ideal bei Neueindeckung oder kompletter Sanierung.",
    highlighted: true,
  },
  {
    icon: <Layers className="w-6 h-6 text-muted-foreground" />,
    title: "Zwischensparrendämmung",
    text: "Dämmung zwischen den Sparren. Wirtschaftlich, aber Kältebrücken an den Sparren unvermeidbar. Geeignet wenn keine Neueindeckung geplant ist.",
    highlighted: false,
  },
  {
    icon: <TrendingDown className="w-6 h-6 text-muted-foreground" />,
    title: "Untersparrendämmung",
    text: "Dämmung unterhalb der Sparren. Reduziert Raumhöhe im Dachgeschoss. Nur als Ergänzung zu anderen Varianten empfehlenswert.",
    highlighted: false,
  },
];

const vorteile = [
  "Vollständig wärmebrückenfreie Dämmebene",
  "Kein Verlust von Wohnfläche oder Raumhöhe",
  "Deutlich bessere Dämmwirkung als Zwischensparrendämmung",
  "GEG-konforme U-Werte problemlos erreichbar",
  "BAFA-Förderung bis zu 20 % möglich",
  "Kombination mit KfW-Kredit möglich",
  "Langlebige Konstruktion ohne Folgeschäden",
  "Ideal kombinierbar mit Neueindeckung",
];

const wannCards = [
  {
    icon: <Home className="w-6 h-6 text-primary" />,
    title: "Bei Neueindeckung",
    text: "Die Aufsparrendämmung lohnt sich besonders dann, wenn das Dach ohnehin neu eingedeckt wird – die Mehrarbeiten sind gering, der Effekt maximal.",
  },
  {
    icon: <Thermometer className="w-6 h-6 text-primary" />,
    title: "Bei hohen Heizkosten",
    text: "Bis zu 30 % der Heizenergie gehen über ein ungedämmtes Steildach verloren – Aufsparrendämmung schließt diese Lücke dauerhaft.",
  },
  {
    icon: <AlertTriangle className="w-6 h-6 text-primary" />,
    title: "Bei GEG-Pflicht",
    text: "Wer sein Steildach neu eindeckt, ist nach GEG zur Dämmung verpflichtet – die Aufsparrendämmung erfüllt die Anforderungen optimal.",
  },
  {
    icon: <Award className="w-6 h-6 text-primary" />,
    title: "Bei Dachgeschossausbau",
    text: "Wer das Dachgeschoss ausbauen möchte, profitiert doppelt – volle Raumhöhe bleibt erhalten, Wohnkomfort wird maximiert.",
  },
];

const ablaufSchritte = [
  { nr: 1, text: "Kostenlose Vor-Ort-Beratung und Dachinspektion" },
  { nr: 2, text: "Bedarfsanalyse und Auswahl der Dämmstärke nach GEG" },
  { nr: 3, text: "Transparentes Angebot nach Aufmaß" },
  { nr: 4, text: "Demontage der bestehenden Eindeckung" },
  { nr: 5, text: "Verlegung der Dämmplatten auf den Sparren" },
  { nr: 6, text: "Neueindeckung mit gewähltem Material" },
];

export default function AufsparrendaemmungBochum() {
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.rex-bedachung.de/" },
          { "@type": "ListItem", position: 2, name: "Steildach Bochum", item: "https://www.rex-bedachung.de/steildach-bochum" },
          { "@type": "ListItem", position: 3, name: "Aufsparrendämmung Bochum", item: "https://www.rex-bedachung.de/aufsparrendaemmung-bochum" },
        ],
      },
      {
        "@type": "Article",
        headline: "Aufsparrendämmung Bochum – Ablauf, Vorteile und Förderung im Überblick",
        author: { "@type": "Organization", name: "Rex Bedachungs GmbH" },
        publisher: { "@type": "Organization", name: "Rex Bedachungs GmbH" },
        datePublished: "2026-03-17",
        url: "https://www.rex-bedachung.de/aufsparrendaemmung-bochum",
      },
      {
        "@type": "Service",
        name: "Aufsparrendämmung Bochum",
        serviceType: "Dachdämmung Steildach",
        provider: { "@id": "https://www.rex-bedachung.de/#organization" },
        areaServed: { "@type": "City", name: "Bochum" },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Aufsparrendämmung Bochum – Kosten, Ablauf &amp; Förderung | Rex Bedachung</title>
        <meta
          name="description"
          content="Aufsparrendämmung in Bochum: Die effektivste Dämmvariante für Steildächer. GEG-konform, BAFA-förderfähig. Rex Bedachungs GmbH – Meisterbetrieb seit 1984."
        />
        <link rel="canonical" href="https://www.rex-bedachung.de/aufsparrendaemmung-bochum" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Aufsparrendämmung Bochum – Kosten, Ablauf & Förderung | Rex Bedachung" />
        <meta
          property="og:description"
          content="Aufsparrendämmung in Bochum: Die effektivste Dämmvariante für Steildächer. GEG-konform, BAFA-förderfähig. Rex Bedachungs GmbH – Meisterbetrieb seit 1984."
        />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/tondach-hero-dachdeckung-bochum.webp" />
        <meta property="og:url" content="https://www.rex-bedachung.de/aufsparrendaemmung-bochum" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Aufsparrendämmung Bochum – Kosten, Ablauf & Förderung | Rex Bedachung" />
        <meta
          name="twitter:description"
          content="Aufsparrendämmung in Bochum: Die effektivste Dämmvariante für Steildächer. GEG-konform, BAFA-förderfähig. Rex Bedachungs GmbH – Meisterbetrieb seit 1984."
        />
        <meta name="twitter:image" content="https://www.rex-bedachung.de/images/tondach-hero-dachdeckung-bochum.webp" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <Breadcrumb
        items={[
          { label: "Startseite", href: "/" },
          { label: "Steildach Bochum", href: "/steildach-bochum" },
          { label: "Aufsparrendämmung Bochum" },
        ]}
      />

      {/* 1. Hero */}
      <section
        className="py-20 px-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white"
        data-testid="section-hero"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight" data-testid="heading-hero">
            Aufsparrendämmung Bochum – die effektivste Dämmung für Ihr Steildach
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-6 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
            Ohne Wärmeverlust, ohne Kältebrücken, ohne Raumverlust – die Aufsparrendämmung ist die überlegene
            Lösung bei Dachsanierung oder Neueindeckung.
          </p>
          <p className="text-sm text-slate-300 mb-10" data-testid="text-hero-badge">
            Meisterbetrieb&nbsp;•&nbsp;GEG-konform&nbsp;•&nbsp;BAFA-förderfähig
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="pulse-ring cta-pulse font-semibold rounded-md"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-hero-beratung"
            >
              Beratung anfragen
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-md font-semibold border-white text-white hover:bg-white/10"
              data-testid="button-hero-telefon"
            >
              <a href="tel:+49234583100" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                0234 583100
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Einleitung */}
      <section className="py-14 px-4 bg-background" data-testid="section-einleitung">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-5 text-foreground">
            Was ist die Aufsparrendämmung?
          </h2>
          <p className="text-muted-foreground mb-4 text-base leading-relaxed">
            Bei der Aufsparrendämmung wird die Dämmschicht vollflächig auf die Dachsparren verlegt – nicht zwischen
            ihnen. Dadurch entsteht eine lückenlose Dämmebene ohne jede Unterbrechung. Kältebrücken an den Sparren
            werden vollständig eliminiert, und der Wohnraum im Dachgeschoss bleibt in seiner vollen Größe erhalten.
          </p>
          <p className="text-muted-foreground mb-5 text-base leading-relaxed">
            Alle Steildach-Leistungen finden Sie auf unserer{" "}
            <a href="/steildach-bochum" className="text-primary font-semibold hover:underline">
              Steildach-Übersichtsseite
            </a>
            .
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 italic" data-testid="text-fact-snippet">
            Die Aufsparrendämmung gilt als technisch überlegenste Dämmvariante für Steildächer – Rex Bedachungs GmbH
            führt sie in Bochum GEG-konform und BAFA-förderfähig aus.
          </p>
        </div>
      </section>

      {/* 3. Vergleich der Dämmvarianten */}
      <section className="py-14 px-4 bg-muted/40" data-testid="section-vergleich">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
            Aufsparrendämmung vs. andere Varianten
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {variantenCards.map((card, i) => (
              <Card
                key={i}
                className={card.highlighted ? "border-2 border-primary" : ""}
                data-testid={`card-variante-${i}`}
              >
                <CardHeader className="flex flex-row items-start gap-3 pb-2 flex-wrap">
                  <div className="mt-1">{card.icon}</div>
                  <CardTitle className="text-base font-semibold">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{card.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Vorteile */}
      <section className="py-14 px-4 bg-background" data-testid="section-vorteile">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
            Warum Aufsparrendämmung die beste Wahl ist
          </h2>
          <ul className="space-y-3">
            {vorteile.map((punkt, i) => (
              <li key={i} className="flex items-start gap-3" data-testid={`vorteil-${i}`}>
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground text-base">{punkt}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Wann lohnt sich die Aufsparrendämmung */}
      <section className="py-14 px-4 bg-muted/40" data-testid="section-wann">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
            Wann ist die Aufsparrendämmung die richtige Wahl?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            {wannCards.map((card, i) => (
              <Card key={i} data-testid={`card-wann-${i}`}>
                <CardHeader className="flex flex-row items-start gap-3 pb-2 flex-wrap">
                  <div className="mt-1">{card.icon}</div>
                  <CardTitle className="text-base font-semibold">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{card.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="border-l-4 border-primary bg-primary/5 p-4 rounded-r-md" data-testid="box-tipp">
            <p className="text-sm text-foreground">
              <strong>Tipp vom Fachbetrieb:</strong> Die Aufsparrendämmung in Kombination mit einer Neueindeckung ist
              die effizienteste Investition in Ihr Steildach – Rex Bedachungs GmbH berät Sie kostenlos vor Ort.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Ablauf */}
      <section className="py-14 px-4 bg-background" data-testid="section-ablauf">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
            So läuft die Aufsparrendämmung bei Rex Bedachung ab
          </h2>
          <ol className="space-y-4">
            {ablaufSchritte.map((schritt) => (
              <li key={schritt.nr} className="flex items-start gap-4" data-testid={`ablauf-step-${schritt.nr}`}>
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground font-bold text-sm shrink-0">
                  {schritt.nr}
                </span>
                <p className="text-base text-muted-foreground pt-1.5">{schritt.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="py-14 px-4 bg-muted/40" data-testid="section-faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
            Häufige Fragen zur Aufsparrendämmung in Bochum
          </h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="border border-border rounded-md bg-background"
                data-testid={`faq-item-${i}`}
              >
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-foreground gap-3"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  data-testid={`faq-toggle-${i}`}
                  aria-expanded={openFaq === i}
                >
                  <span>{item.question}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 shrink-0 text-muted-foreground" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed" data-testid={`faq-answer-${i}`}>
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-cta">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground" data-testid="heading-cta">
            Aufsparrendämmung in Bochum – jetzt beraten lassen
          </h2>
          <p className="text-muted-foreground mb-8 text-base" data-testid="text-cta">
            Wir prüfen vor Ort ob Aufsparrendämmung für Ihr Dach die richtige Lösung ist – kostenlos,
            unverbindlich und ohne Verpflichtung.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="pulse-ring cta-pulse font-semibold rounded-md"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-cta-beratung"
            >
              Beratung anfragen
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-md font-semibold"
              data-testid="button-cta-telefon"
            >
              <a href="tel:+49234583100" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                0234 583100
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* 9. Cluster-Link-Block */}
      <section className="py-12 px-4 bg-slate-50 dark:bg-muted/20" data-testid="section-cluster-links">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 dark:text-foreground mb-2">
            Weitere Informationen zum Steildach
          </h2>
          <p className="text-sm text-gray-500 dark:text-muted-foreground mb-6">
            Vertiefende Informationen rund ums Steildach in Bochum:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/steildach-bochum"
              className="block p-5 bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border hover:border-primary hover:shadow-md transition-all"
              data-testid="link-cluster-steildach"
            >
              <div className="font-semibold text-gray-900 dark:text-foreground mb-1">Steildach Bochum</div>
              <div className="text-sm text-gray-500 dark:text-muted-foreground">Alle Steildach-Leistungen im Überblick</div>
            </a>
            <a
              href="/steildach-foerderung-bochum"
              className="block p-5 bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border hover:border-primary hover:shadow-md transition-all"
              data-testid="link-cluster-foerderung"
            >
              <div className="font-semibold text-gray-900 dark:text-foreground mb-1">Steildach Förderung Bochum</div>
              <div className="text-sm text-gray-500 dark:text-muted-foreground">BAFA &amp; KfW für Steildachsanierung erklärt</div>
            </a>
            <a
              href="/foerderung"
              className="block p-5 bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border hover:border-primary hover:shadow-md transition-all"
              data-testid="link-cluster-alle-foerderung"
            >
              <div className="font-semibold text-gray-900 dark:text-foreground mb-1">Alle Förderprogramme</div>
              <div className="text-sm text-gray-500 dark:text-muted-foreground">BAFA &amp; KfW für alle Dachmaßnahmen</div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
