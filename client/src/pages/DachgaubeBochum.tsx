import { useState } from "react";
import { Helmet } from "react-helmet";
import OrganizationSchema from "@/components/OrganizationSchema";
import AuthorSchema from "@/components/AuthorSchema";
import { useLocation } from "wouter";
import Breadcrumb from "@/components/Breadcrumb";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  Home,
  Triangle,
  Square,
  Layers,
  AlertTriangle,
  MessageSquare,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqItems = [
  {
    question: "Brauche ich für eine Dachgaube eine Baugenehmigung?",
    answer:
      "In NRW ist für den Einbau einer Dachgaube in der Regel eine Baugenehmigung erforderlich. Die genauen Voraussetzungen hängen von Größe, Lage und kommunalen Bebauungsplänen ab – wir beraten Sie kostenlos dazu.",
  },
  {
    question: "Welche Dachgaube passt zu meinem Haus?",
    answer:
      "Das hängt von der Dachform, der Dachneigung und dem Baustil des Hauses ab. Schleppgauben passen zu fast allen Steildächern, Spitzgauben wirken klassisch, Kastengauben modern. Rex Bedachung berät Sie vor Ort.",
  },
  {
    question: "Kann ich eine Dachgaube nachträglich einbauen lassen?",
    answer:
      "Ja – der nachträgliche Einbau ist in den meisten Fällen möglich. Voraussetzung ist eine statische Prüfung des Dachstuhls. Wir beurteilen das kostenlos im Rahmen des Aufmaßtermins.",
  },
  {
    question: "Wird eine Dachgaube gefördert?",
    answer:
      "Wenn im Zuge des Gaubeneinbaus eine GEG-konforme Dämmung eingebaut wird, kann der Dämmanteil über BAFA oder KfW gefördert werden. Die reine Gaubenstruktur ist nicht förderfähig.",
  },
  {
    question: "Wie lange dauert der Einbau einer Dachgaube?",
    answer:
      "Je nach Typ und Größe dauert der Einbau in der Regel 3–7 Arbeitstage. Wir arbeiten termingerecht und koordinieren alle Gewerke aus einer Hand.",
  },
];

const gaubenTypen = [
  {
    icon: <Square className="w-7 h-7 text-primary" />,
    title: "Schleppgaube",
    text: "Flaches Pultdach, viel Platz, harmonisch ins Steildach integrierbar – universell einsetzbar und besonders beliebt.",
  },
  {
    icon: <Triangle className="w-7 h-7 text-primary" />,
    title: "Spitzgaube",
    text: "Klassische Dreiecksgaube, ideal für Satteldächer, zeitloser Stil der sich ins Bestandsdach einfügt.",
  },
  {
    icon: <Layers className="w-7 h-7 text-primary" />,
    title: "Fledermausgaube",
    text: "Geschwungene Form, aufwendiger in der Ausführung, besonders repräsentativ und wertsteigernd.",
  },
  {
    icon: <LayoutGrid className="w-7 h-7 text-primary" />,
    title: "Kastengaube",
    text: "Kubische Form, maximale Raumausnutzung, modernes Erscheinungsbild.",
  },
];

const leistungen = [
  "Statische Prüfung und Planung",
  "Dachstuhlarbeiten und Zimmermannarbeiten",
  "Eindeckung passend zum Bestandsdach",
  "Dachanschlüsse und Abdichtung",
  "Dachfenstereinbau optional",
  "Dämmung nach GEG",
  "Spengler- und Blecharbeiten",
];

const hinweisCards = [
  {
    icon: <AlertTriangle className="w-6 h-6 text-primary" />,
    title: "Baugenehmigung",
    text: "In NRW ist für den Einbau einer Dachgaube in der Regel eine Baugenehmigung erforderlich. Die genauen Voraussetzungen hängen von Größe, Lage und kommunalen Bebauungsplänen ab – wir beraten Sie dazu kostenlos.",
  },
  {
    icon: <AlertTriangle className="w-6 h-6 text-primary" />,
    title: "Statik",
    text: "Der Dachstuhl muss die zusätzliche Last tragen – eine statische Prüfung durch den Fachbetrieb ist Pflicht vor Baubeginn.",
  },
  {
    icon: <AlertTriangle className="w-6 h-6 text-primary" />,
    title: "Anschlüsse",
    text: "Undichte Gaubenanschlüsse sind die häufigste Fehlerquelle bei Dachgauben – fachgerechte Ausführung ist entscheidend für Langlebigkeit.",
  },
];

const ablaufSchritte = [
  { nr: 1, text: "Kostenloses Beratungsgespräch und Aufmaß vor Ort" },
  { nr: 2, text: "Planung und Angebotserstellung" },
  { nr: 3, text: "Baugenehmigung einholen (Beratung durch Rex Bedachung)" },
  { nr: 4, text: "Dachstuhlarbeiten und Rohbau der Gaube" },
  { nr: 5, text: "Eindeckung, Anschlüsse und Abdichtung" },
  { nr: 6, text: "Dachfenstereinbau (optional)" },
  { nr: 7, text: "Abnahme und Übergabe" },
];

export default function DachgaubeBochum() {
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://www.rex-bedachung.de/" },
          { "@type": "ListItem", "position": 2, "name": "Steildach Bochum", "item": "https://www.rex-bedachung.de/steildach-bochum" },
          { "@type": "ListItem", "position": 3, "name": "Dachgaube Bochum", "item": "https://www.rex-bedachung.de/dachgaube-bochum" },
        ],
      },
      {
        "@type": "Article",
        "headline": "Dachgaube Bochum – Einbau, Sanierung und Typen im Überblick",
        "author": { "@id": "https://www.rex-bedachung.de/#author" },
        "publisher": { "@id": "https://www.rex-bedachung.de/#organization" },
        "datePublished": "2026-03-17",
        "url": "https://www.rex-bedachung.de/dachgaube-bochum",
      },
      {
        "@type": "Service",
        "name": "Dachgaube einbauen Bochum",
        "serviceType": "Dachgaubeneinbau und Sanierung",
        "provider": { "@id": "https://www.rex-bedachung.de/#organization" },
        "areaServed": { "@type": "City", "name": "Bochum" },
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqItems.map((f) => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": { "@type": "Answer", "text": f.answer },
        })),
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Dachgaube Bochum – Einbau &amp; Sanierung | Rex Bedachungs GmbH</title>
        <meta
          name="description"
          content="Dachgaube einbauen oder sanieren in Bochum: Schleppgaube, Spitzgaube, Fledermausgaube, Kastengaube. Meisterbetrieb seit 1984. Angebot nach kostenlosem Aufmaß."
        />
        <link rel="canonical" href="https://www.rex-bedachung.de/dachgaube-bochum" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Dachgaube Bochum – Einbau & Sanierung | Rex Bedachungs GmbH" />
        <meta
          property="og:description"
          content="Dachgaube einbauen oder sanieren in Bochum: Schleppgaube, Spitzgaube, Fledermausgaube, Kastengaube. Meisterbetrieb seit 1984. Angebot nach kostenlosem Aufmaß."
        />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/tondach-hero-dachdeckung-bochum.webp" />
        <meta property="og:url" content="https://www.rex-bedachung.de/dachgaube-bochum" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dachgaube Bochum – Einbau & Sanierung | Rex Bedachungs GmbH" />
        <meta
          name="twitter:description"
          content="Dachgaube einbauen oder sanieren in Bochum: Schleppgaube, Spitzgaube, Fledermausgaube, Kastengaube. Meisterbetrieb seit 1984. Angebot nach kostenlosem Aufmaß."
        />
        <meta name="twitter:image" content="https://www.rex-bedachung.de/images/tondach-hero-dachdeckung-bochum.webp" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>
      <OrganizationSchema />
      <AuthorSchema />

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Startseite", href: "/" },
          { label: "Steildach Bochum", href: "/steildach-bochum" },
          { label: "Dachgaube Bochum" },
        ]}
      />

      {/* 1. Hero */}
      <section
        className="py-20 px-4 bg-gradient-to-br from-slate-900 to-slate-700 text-white"
        data-testid="section-hero"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight" data-testid="heading-hero">
            Dachgaube Bochum – Einbau &amp; Sanierung vom Meisterbetrieb
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-6 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
            Mehr Licht, mehr Raum, mehr Wohnqualität – Rex Bedachungs GmbH plant und baut Ihre Dachgaube
            fachgerecht in Bochum und dem Ruhrgebiet.
          </p>
          <p className="text-sm text-slate-400 mb-10" data-testid="text-hero-badge">
            Meisterbetrieb&nbsp;•&nbsp;Seit 1984&nbsp;•&nbsp;Ruhrgebiet
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="pulse-ring cta-pulse font-semibold rounded-md"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-hero-angebot"
            >
              Angebot anfragen
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
            Was bringt eine Dachgaube?
          </h2>
          <p className="text-muted-foreground mb-4 text-base leading-relaxed">
            Eine Dachgaube bringt mehr natürliches Licht, mehr Raumhöhe und mehr nutzbare Wohnfläche. Sie ist
            eine der wirkungsvollsten Maßnahmen zur Aufwertung eines Dachgeschosses – ohne Anbau, ohne
            Grundrissveränderung. Das steigert den Wohnwert und den Immobilienwert gleichermaßen.
          </p>
          <p className="text-muted-foreground mb-5 text-base leading-relaxed">
            Dachgauben sind Teil unserer Steildach-Leistungen –{" "}
            <a href="/steildach-bochum" className="text-primary font-semibold hover:underline">
              alle Informationen zur Steildachsanierung finden Sie hier
            </a>
            .
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 italic">
            Die Rex Bedachungs GmbH plant und baut Dachgauben in Bochum seit 1984 – inklusive fachgerechter
            Eindeckung, Anschlüsse und Abdichtung aus einer Hand.
          </p>
        </div>
      </section>

      {/* 3. Gaubentypen */}
      <section className="py-14 px-4 bg-muted/40" data-testid="section-gaubentypen">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
            Welche Dachgauben-Typen gibt es?
          </h2>
          <p className="text-muted-foreground mb-8 text-base">
            Je nach Dachform, Baustil und Raumanforderung empfehlen sich unterschiedliche Gaubentypen.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {gaubenTypen.map((typ, i) => (
              <Card key={i} data-testid={`card-gaubentyp-${i}`}>
                <CardHeader className="flex flex-row items-start gap-3 pb-2 flex-wrap">
                  <div className="mt-1">{typ.icon}</div>
                  <CardTitle className="text-base font-semibold">{typ.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{typ.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Leistungsumfang */}
      <section className="py-14 px-4 bg-background" data-testid="section-leistungsumfang">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
            Unser Leistungsumfang beim Gaubeneinbau
          </h2>
          <ul className="space-y-3">
            {leistungen.map((item, i) => (
              <li key={i} className="flex items-start gap-3" data-testid={`leistung-item-${i}`}>
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground text-base">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Worauf kommt es an */}
      <section className="py-14 px-4 bg-muted/40" data-testid="section-hinweise">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
            Was Sie beim Gaubeneinbau beachten sollten
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {hinweisCards.map((card, i) => (
              <Card key={i} data-testid={`card-hinweis-${i}`}>
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

      {/* 6. Ablauf */}
      <section className="py-14 px-4 bg-background" data-testid="section-ablauf">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
            So läuft der Gaubeneinbau ab
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

      {/* 7. Angebot-Box */}
      <section
        className="py-14 px-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white"
        data-testid="section-angebot-box"
      >
        <div className="max-w-3xl mx-auto text-center">
          <MessageSquare className="w-10 h-10 mx-auto mb-4 text-slate-300" />
          <h2 className="text-2xl md:text-3xl font-bold mb-5">
            Angebot nach kostenlosem Aufmaß
          </h2>
          <p className="text-slate-300 mb-8 text-base leading-relaxed">
            Der Preis für eine Dachgaube hängt von Typ, Größe, Eindeckmaterial und Dachstuhlsituation ab –
            eine pauschale Angabe ist nicht seriös möglich. Rex Bedachungs GmbH erstellt Ihnen nach kostenlosem
            Aufmaß ein transparentes Angebot.
          </p>
          <Button
            size="lg"
            className="pulse-ring cta-pulse font-semibold rounded-md"
            onClick={() => setLocation("/kontakt")}
            data-testid="button-angebot-aufmas"
          >
            Kostenloses Aufmaß anfragen
          </Button>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="py-14 px-4 bg-muted/40" data-testid="section-faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
            Häufige Fragen zur Dachgaube in Bochum
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

      {/* 9. CTA */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-cta">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground" data-testid="heading-cta">
            Jetzt Dachgaube planen – kostenloses Aufmaß anfragen
          </h2>
          <p className="text-muted-foreground mb-8 text-base" data-testid="text-cta">
            Wir kommen zur kostenlosen Besichtigung, prüfen die Machbarkeit und erstellen ein transparentes Angebot.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="pulse-ring cta-pulse font-semibold rounded-md"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-cta-aufmas"
            >
              Aufmaß anfragen
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

      {/* 10. Cluster-Link-Block */}
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
              <div className="text-sm text-gray-500 dark:text-muted-foreground">Alle Steildach-Leistungen im Überblick.</div>
            </a>
            <a
              href="/dachfenster-bochum"
              className="block p-5 bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border hover:border-primary hover:shadow-md transition-all"
              data-testid="link-cluster-dachfenster"
            >
              <div className="font-semibold text-gray-900 dark:text-foreground mb-1">Dachfenster Bochum</div>
              <div className="text-sm text-gray-500 dark:text-muted-foreground">VELUX-Partner für Dachfenster und Gaubeneinbau.</div>
            </a>
            <a
              href="/steildach-foerderung-bochum"
              className="block p-5 bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border hover:border-primary hover:shadow-md transition-all"
              data-testid="link-cluster-foerderung"
            >
              <div className="font-semibold text-gray-900 dark:text-foreground mb-1">Steildach Förderung Bochum</div>
              <div className="text-sm text-gray-500 dark:text-muted-foreground">BAFA &amp; KfW für Steildachsanierung und Dämmung.</div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
