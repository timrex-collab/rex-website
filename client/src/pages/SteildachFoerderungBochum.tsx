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
  AlertTriangle,
  Users,
  TrendingDown,
  Award,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqItems = [
  {
    question: "Welche Förderung gibt es für die Steildachsanierung?",
    answer:
      "Über BAFA (BEG Einzelmaßnahme) sind bis zu 20 % der förderfähigen Kosten als Zuschuss möglich. Zusätzlich kann ein KfW-Kredit (Programm 261) beantragt werden. Beide Programme sind kombinierbar.",
  },
  {
    question: "Muss ich den Antrag selbst stellen?",
    answer:
      "Den BAFA-Antrag stellt der Eigentümer über das BAFA-Portal. Rex Bedachung bereitet alle notwendigen Unterlagen vor und begleitet Sie durch den Prozess. Wichtig: Antrag vor Auftragsvergabe stellen.",
  },
  {
    question: "Welche Dämmmaßnahmen am Steildach sind förderfähig?",
    answer:
      "Aufsparrendämmung und Zwischensparrendämmung sind förderfähig, wenn sie GEG-konforme U-Werte erreichen. Die reine Neueindeckung ohne Dämmung ist nicht förderfähig.",
  },
  {
    question: "Kann ich BAFA und KfW kombinieren?",
    answer:
      "Ja – BAFA-Zuschuss und KfW-Kredit können für dieselbe Maßnahme kombiniert werden. Die genauen Bedingungen prüfen wir gemeinsam in der Beratung.",
  },
  {
    question: "Gilt die Förderung auch für ältere Häuser?",
    answer:
      "Ja – die BEG-Förderung gilt für bestehende Wohngebäude unabhängig vom Baujahr. Entscheidend ist, dass die Mindestanforderungen ans Dämmniveau nach GEG eingehalten werden.",
  },
];

const bafaCards = [
  {
    icon: <CheckCircle className="w-6 h-6 text-primary" />,
    title: "Bis zu 20 % Zuschuss",
    text: "Offizieller Fördersatz auf die förderfähigen Kosten der Dämmmaßnahme – unabhängig von der Höhe der Investition.",
  },
  {
    icon: <Home className="w-6 h-6 text-primary" />,
    title: "Förderfähige Maßnahmen",
    text: "Aufsparrendämmung und Zwischensparrendämmung sind förderfähig, wenn GEG-konforme U-Werte erreicht werden.",
  },
  {
    icon: <AlertTriangle className="w-6 h-6 text-primary" />,
    title: "Antrag vor Auftragsvergabe",
    text: "Der BAFA-Antrag muss zwingend vor Beginn der Maßnahme gestellt werden – Rex Bedachung begleitet Sie dabei.",
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: "Kostenlose Beratung",
    text: "Wir übernehmen die Vorbereitung aller Unterlagen und begleiten Sie durch den Antragsprozess.",
  },
];

const kfwItems = [
  {
    icon: <TrendingDown className="w-6 h-6 text-primary" />,
    title: "KfW-Programm 261",
    text: "Zinsgünstiger Kredit für energetische Einzelmaßnahmen am Gebäude – beantragbar über die Hausbank.",
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-primary" />,
    title: "Kombinierbar mit BAFA",
    text: "BAFA-Zuschuss und KfW-Kredit lassen sich für dieselbe Maßnahme kombinieren.",
  },
  {
    icon: <Award className="w-6 h-6 text-primary" />,
    title: "Tilgungszuschuss möglich",
    text: "Bei Erreichen bestimmter Effizienzstandards ist ein zusätzlicher Tilgungszuschuss möglich.",
  },
];

const ablaufSchritte = [
  { nr: 1, text: "Kostenloses Beratungsgespräch vor Ort" },
  { nr: 2, text: "Prüfung der Förderfähigkeit Ihrer Maßnahme" },
  { nr: 3, text: "Vorbereitung der BAFA-/KfW-Unterlagen" },
  { nr: 4, text: "Antragstellung vor Auftragsvergabe" },
  { nr: 5, text: "Ausführung und Fachunternehmererklärung" },
];

export default function SteildachFoerderungBochum() {
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
          { "@type": "ListItem", "position": 3, "name": "Steildach Förderung Bochum", "item": "https://www.rex-bedachung.de/steildach-foerderung-bochum" },
        ],
      },
      {
        "@type": "Article",
        "headline": "Steildach Förderung Bochum – BAFA, KfW und GEG 2026",
        "author": { "@id": "https://www.rex-bedachung.de/#author" },
        "publisher": { "@id": "https://www.rex-bedachung.de/#organization" },
        "datePublished": "2026-03-17",
        "url": "https://www.rex-bedachung.de/steildach-foerderung-bochum",
      },
      {
        "@type": "Service",
        "name": "Förderberatung Steildach Bochum",
        "serviceType": "Förderberatung energetische Dachsanierung",
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
        <title>Steildach Förderung Bochum – BAFA &amp; KfW 2026 | Rex Bedachung</title>
        <meta
          name="description"
          content="Steildach sanieren und Förderung nutzen: BAFA bis 20 %, KfW-Kredit, GEG-konforme Dämmung. Rex Bedachungs GmbH berät kostenlos in Bochum."
        />
        <link rel="canonical" href="https://www.rex-bedachung.de/steildach-foerderung-bochum" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Steildach Förderung Bochum – BAFA & KfW 2026 | Rex Bedachung" />
        <meta
          property="og:description"
          content="Steildach sanieren und Förderung nutzen: BAFA bis 20 %, KfW-Kredit, GEG-konforme Dämmung. Rex Bedachungs GmbH berät kostenlos in Bochum."
        />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/tondach-hero-dachdeckung-bochum.webp" />
        <meta property="og:url" content="https://www.rex-bedachung.de/steildach-foerderung-bochum" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Steildach Förderung Bochum – BAFA & KfW 2026 | Rex Bedachung" />
        <meta
          name="twitter:description"
          content="Steildach sanieren und Förderung nutzen: BAFA bis 20 %, KfW-Kredit, GEG-konforme Dämmung. Rex Bedachungs GmbH berät kostenlos in Bochum."
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
          { label: "Steildach Förderung Bochum" },
        ]}
      />

      {/* 1. Hero */}
      <section
        className="py-20 px-4 bg-gradient-to-br from-slate-900 to-blue-950 text-white"
        data-testid="section-hero"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight" data-testid="heading-hero">
            Steildach Förderung Bochum – BAFA &amp; KfW 2026
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-6 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
            Energetische Steildachsanierung wird staatlich gefördert – wir beraten Sie kostenlos,
            welche Programme für Ihr Projekt passen.
          </p>
          <p className="text-sm text-blue-200 mb-10" data-testid="text-hero-badge">
            Meisterbetrieb&nbsp;•&nbsp;Kostenlose Förderberatung&nbsp;•&nbsp;Ruhrgebiet
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="pulse-ring cta-pulse font-semibold rounded-md"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-hero-beratung"
            >
              Förderberatung anfragen
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
            Warum wird die Dachsanierung staatlich gefördert?
          </h2>
          <p className="text-muted-foreground mb-4 text-base leading-relaxed">
            Das Gebäudeenergiegesetz (GEG) verpflichtet Eigentümer bei ohnehin anfallender Dachsanierung zur
            energetischen Mindestdämmung. Der Staat fördert diese Investition, weil energetisch sanierte Gebäude
            einen wesentlichen Beitrag zu den Klimazielen leisten – weniger Heizenergie, geringere CO₂-Emissionen.
            Für Eigentümer entsteht daraus eine Kombination aus gesetzlicher Pflicht und konkretem Förderanreiz.
          </p>
          <p className="text-muted-foreground mb-5 text-base leading-relaxed">
            Alle Informationen zur Steildachsanierung finden Sie auf unserer{" "}
            <a href="/steildach-bochum" className="text-primary font-semibold hover:underline">
              Steildach-Hauptseite
            </a>
            .
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 italic">
            Bei Steildachsanierungen in Bochum stellt die Rex Bedachungs GmbH sicher, dass alle Dämmmaßnahmen
            GEG-konform ausgeführt werden – Voraussetzung für BAFA-Förderung und KfW-Kredit.
          </p>
        </div>
      </section>

      {/* 3. BAFA */}
      <section className="py-14 px-4 bg-muted/40" data-testid="section-bafa">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
            BAFA-Förderung für Steildach – Bundesförderung BEG
          </h2>
          <p className="text-muted-foreground mb-8 text-base">
            Die Bundesförderung für effiziente Gebäude (BEG) des BAFA ist das wichtigste Zuschussprogramm für
            energetische Steildachsanierungen.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            {bafaCards.map((card, i) => (
              <Card key={i} data-testid={`card-bafa-${i}`}>
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
          <div className="flex items-start gap-3 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/40 p-4">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Wichtig:</strong> Der BAFA-Antrag muss vor Beginn der Maßnahme gestellt werden.
              Rex Bedachung stellt sicher, dass alle Voraussetzungen erfüllt sind.
            </p>
          </div>
        </div>
      </section>

      {/* 4. KfW */}
      <section className="py-14 px-4 bg-background" data-testid="section-kfw">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
            KfW-Kredit für Steildachsanierung
          </h2>
          <p className="text-muted-foreground mb-8 text-base">
            Ergänzend zum BAFA-Zuschuss können Sie einen zinsgünstigen KfW-Kredit für die Dachsanierung beantragen.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {kfwItems.map((item, i) => (
              <Card key={i} data-testid={`card-kfw-${i}`}>
                <CardHeader className="flex flex-row items-start gap-3 pb-2 flex-wrap">
                  <div className="mt-1">{item.icon}</div>
                  <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. GEG */}
      <section className="py-14 px-4 bg-muted/40" data-testid="section-geg">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-5 text-foreground">
            GEG 2026 – Pflicht und Fördervoraussetzung
          </h2>
          <p className="text-muted-foreground mb-4 text-base leading-relaxed">
            Das Gebäudeenergiegesetz schreibt beim Steildach einen Mindest-U-Wert für Dachflächen vor. Bei einer
            ohnehin anfallenden Neueindeckung ist die gleichzeitige Dämmung auf dieses Niveau gesetzlich
            verpflichtend – unabhängig vom Eigentümerwunsch.
          </p>
          <p className="text-muted-foreground mb-4 text-base leading-relaxed">
            Förderung setzt GEG-konforme Ausführung voraus. Eine reine Neueindeckung ohne Dämmung ist nicht
            förderfähig – nur Dämmmaßnahmen berechtigen zur BAFA- und KfW-Förderung.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 italic">
            Bei Steildachsanierungen in Bochum stellt die Rex Bedachungs GmbH sicher, dass alle Dämmmaßnahmen
            GEG-konform ausgeführt werden – Voraussetzung für BAFA-Förderung und KfW-Kredit.
          </p>
        </div>
      </section>

      {/* 6. Ablauf */}
      <section className="py-14 px-4 bg-background" data-testid="section-ablauf">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
            So läuft die Förderberatung bei Rex Bedachung ab
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
            Häufige Fragen zur Steildach-Förderung
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
            Kostenlose Förderberatung anfragen
          </h2>
          <p className="text-muted-foreground mb-8 text-base" data-testid="text-cta">
            Wir prüfen, welche Förderung für Ihr Steildachprojekt in Frage kommt – kostenlos und unverbindlich.
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
              <div className="text-sm text-gray-500 dark:text-muted-foreground">Alle Steildach-Leistungen im Überblick.</div>
            </a>
            <a
              href="/aufsparrendaemmung-bochum"
              className="block p-5 bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border hover:border-primary hover:shadow-md transition-all"
              data-testid="link-cluster-aufsparren"
            >
              <div className="font-semibold text-gray-900 dark:text-foreground mb-1">Aufsparrendämmung Bochum</div>
              <div className="text-sm text-gray-500 dark:text-muted-foreground">Die effektivste Dämmvariante – Ablauf und Förderung erklärt.</div>
            </a>
            <a
              href="/foerderung"
              className="block p-5 bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border hover:border-primary hover:shadow-md transition-all"
              data-testid="link-cluster-foerderung"
            >
              <div className="font-semibold text-gray-900 dark:text-foreground mb-1">Alle Förderprogramme</div>
              <div className="text-sm text-gray-500 dark:text-muted-foreground">BAFA &amp; KfW für alle Dachmaßnahmen im Überblick.</div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
