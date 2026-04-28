import { useState } from "react";
import { Helmet } from "react-helmet";
import OrganizationSchema from "@/components/OrganizationSchema";
import AuthorSchema from "@/components/AuthorSchema";
import ExpertenBlock from "@/components/ExpertenBlock";

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
  "Autorisierter VELUX-Partner",
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
      "Ja. Über BAFA (BEG Einzelmaßnahme) werden Dachfenster mit Uw ≤ 1,0 W/m²K mit 15 % Grundförderung bezuschusst — mit iSFP steigt der Satz auf 20 %. Nur VELUX ENERGIE und ENERGIE PLUS sind förderfähig, THERMO (Uw 1,3) nicht. Rex Bedachungs GmbH berät kostenlos zur Antragstellung.",
  },
  {
    question: "Welche Dachfenster-Marken verbauen Sie?",
    answer:
      "Wir sind autorisierter VELUX-Partner und verbauen zusätzlich Roto Dachfenster in allen Ausführungen.",
  },
  {
    question: "Brauche ich für ein Dachfenster eine Baugenehmigung?",
    answer:
      "Der reine Austausch eines bestehenden Dachfensters ist in den meisten Fällen genehmigungsfrei – vorausgesetzt, das Erscheinungsbild des Dachs wird nicht wesentlich verändert. Beim Neueinbau zusätzlicher Fenster hängt die Genehmigungspflicht von der Gemeinde und dem Bebauungsplan ab. Rex Bedachungs GmbH berät Sie kostenlos zum genauen Ablauf in Bochum.",
  },
  {
    question: "Gibt es Förderung für den Einbau von Dachfenstern?",
    answer:
      "Ja — Dachfenster mit Uw ≤ 1,0 W/m²K werden über BAFA (BEG Einzelmaßnahme) mit 15 % Grundförderung bezuschusst. Mit einem individuellen Sanierungsfahrplan (iSFP) steigt der Satz auf 20 % und der Förderhöchstbetrag auf 60.000 € pro Wohneinheit. Zusätzlich ist der KfW-Ergänzungskredit 358/359 kombinierbar. Rex Bedachungs GmbH berät kostenlos zu allen aktuellen Fördermöglichkeiten.",
  },
  {
    question: "Kann ein altes VELUX-Fenster 1:1 ersetzt werden?",
    answer:
      "In der Regel ja – VELUX bietet für ältere Modelle passende Austauschfenster an, die ohne großen Eingriff in die Dachkonstruktion eingebaut werden können. Der Austausch ist meist in einem halben bis ganzen Arbeitstag erledigt. Als autorisierter VELUX-Partner findet Rex Bedachungs GmbH die passende Lösung für Ihr Fenster.",
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Dachfenster Bochum – Einbau & Austausch | Rex Bedachung</title>
        <meta
          name="description"
          content="Dachfenster in Bochum einbauen oder austauschen? Rex Bedachungs GmbH montiert VELUX & Roto – inkl. Dämmung, Anschlussabdichtung und bis zu 20 % BAFA-Förderung. Autorisierter VELUX-Partner seit 1984."
        />
        <meta property="og:title" content="Dachfenster Bochum – VELUX & Roto Einbau | Rex Bedachungs GmbH" />
        <meta
          property="og:description"
          content="Autorisierter VELUX-Partner für Dachfenster in Bochum. Neueinbau, Austausch & Reparatur – mit Förderberatung."
        />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/velux-dachfenster-einbau-bochum-fachbetrieb.webp" />
        <meta property="og:site_name" content="Rex Bedachungs GmbH" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dachfenster Bochum – VELUX Einbau | Rex Bedachung" />
        <meta name="twitter:description" content="Dachfenster Bochum ✓ VELUX-Partner ✓ Neueinbau & Austausch ✓ Kurzfristige Hilfe ✓ BAFA/KfW-Förderung – Rex Bedachungs GmbH." />
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
        "text": "Ja. Über BAFA (BEG Einzelmaßnahme) werden Dachfenster mit Uw ≤ 1,0 W/m²K mit 15 % Grundförderung bezuschusst — mit iSFP steigt der Satz auf 20 %. Nur VELUX ENERGIE und ENERGIE PLUS sind förderfähig, THERMO (Uw 1,3) nicht. Rex Bedachungs GmbH berät kostenlos zur Antragstellung."
      }
    },
    {
      "@type": "Question",
      "name": "Welche Dachfenster-Marken verbauen Sie?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Wir sind autorisierter VELUX-Partner und verbauen zusätzlich Roto Dachfenster in allen Ausführungen."
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
        "text": "Ja — Dachfenster mit Uw ≤ 1,0 W/m²K werden über BAFA (BEG Einzelmaßnahme) mit 15 % Grundförderung bezuschusst. Mit iSFP steigt der Satz auf 20 % und der Förderhöchstbetrag auf 60.000 € pro Wohneinheit. Zusätzlich ist der KfW-Ergänzungskredit 358/359 kombinierbar."
      }
    },
    {
      "@type": "Question",
      "name": "Kann ein altes VELUX-Fenster 1:1 ersetzt werden?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "In der Regel ja – VELUX bietet für ältere Modelle passende Austauschfenster an, die ohne großen Eingriff in die Dachkonstruktion eingebaut werden können. Der Austausch ist meist in einem halben bis ganzen Arbeitstag erledigt. Als autorisierter VELUX-Partner findet Rex Bedachungs GmbH die passende Lösung für Ihr Fenster."
      }
    }
  ]
}`}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Dachfenster Bochum – Einbau & Austausch vom Meisterbetrieb",
  "description": "VELUX und Roto Dachfenster in Bochum: Neueinbau, Austausch und Reparatur. Autorisierter VELUX-Partner seit 1984. Bis zu 20 % BAFA-Förderung bei Uw ≤ 1,0.",
  "author": {
    "@type": "Person",
    "@id": "https://www.rex-bedachung.de/#author",
    "name": "Tim Rex"
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://www.rex-bedachung.de/#organization"
  },
  "datePublished": "2025-06-01",
  "dateModified": "2026-04-28",
  "mainEntityOfPage": "https://www.rex-bedachung.de/dachfenster-bochum"
}`}</script>
      </Helmet>
      <OrganizationSchema />
      <AuthorSchema />

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
        <Picture
          src={heroImage}
          fallback={heroImageFallback}
          alt="Einbau eines VELUX Dachfensters in ein Steildach in Bochum"
          className="absolute inset-0 w-full h-full object-cover"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30" aria-hidden="true" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 max-w-3xl" data-testid="heading-hero">
            Dachfenster Bochum – Einbau &amp; Austausch vom Meisterbetrieb
          </h1>
          <p className="text-base md:text-lg text-slate-100 mb-4 max-w-2xl leading-relaxed" data-testid="text-direktantwort">
            Rex Bedachungs GmbH baut, tauscht und repariert Dachfenster in Bochum und Umgebung. Als autorisierter VELUX-Partner prüfen wir Modell, Dämmwert, Abdichtung und Förderfähigkeit direkt am Dach. So erhalten Sie eine technisch passende Lösung für mehr Licht, bessere Wärmedämmung und dauerhaft dichte Anschlüsse.
          </p>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-xl" data-testid="text-hero-subtitle">
            Neueinbau, Austausch und Reparatur – schnell, sauber, mit Förderung
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Button
              asChild
              size="lg"
              className="pulse-ring cta-pulse"
              data-testid="button-hero-angebot"
            >
              <a href="/kontakt">Jetzt Angebot anfragen</a>
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
            VELUX-Partner &bull; 40+ Jahre Erfahrung &bull; Ruhrgebiet
          </p>
        </div>
      </section>

      <ExpertenBlock normen={["VELUX-Partner", "BEG EM Uw ≤ 1,0", "GEG 2024"]} />

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

      {/* ── VELUX-Modellblock ── */}
      <section className="py-12 px-4 bg-background" data-testid="section-velux-modelle">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground">VELUX Verglasungen im Überblick</h2>
          <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto text-sm">Nicht jede VELUX-Verglasung ist förderrelevant. Die BEG-Förderung erfordert Uw ≤ 1,0 W/(m²K).</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="border border-border rounded-xl p-4 opacity-70">
              <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded bg-red-50 text-red-700 mb-2">Nicht förderrelevant</span>
              <p className="font-semibold text-sm text-foreground">THERMO</p>
              <p className="text-xs text-muted-foreground">Verglasung -70</p>
              <p className="text-2xl font-bold text-foreground mt-1">1,3 <span className="text-xs font-normal text-muted-foreground">W/(m²K)</span></p>
              <p className="text-xs text-muted-foreground mt-1">Standard-Doppelverglasung. Erfüllt nicht die BEG-Anforderung Uw ≤ 1,0.</p>
            </div>
            <div className="border border-border rounded-xl p-4">
              <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 mb-2">Förderrelevant</span>
              <p className="font-semibold text-sm text-foreground">ENERGIE PLUS</p>
              <p className="text-xs text-muted-foreground">Verglasung -66</p>
              <p className="text-2xl font-bold text-foreground mt-1">1,0 <span className="text-xs font-normal text-muted-foreground">W/(m²K)</span></p>
              <p className="text-xs text-muted-foreground mt-1">Dreifachverglasung. Erreicht den Grenzwert Uw ≤ 1,0 — geeigneter Einstieg für energetische Maßnahmen.</p>
            </div>
            <div className="border border-border rounded-xl p-4">
              <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 mb-2">Förderrelevant</span>
              <p className="font-semibold text-sm text-foreground">SCHALLSCHUTZ</p>
              <p className="text-xs text-muted-foreground">Verglasung -62</p>
              <p className="text-2xl font-bold text-foreground mt-1">0,96 <span className="text-xs font-normal text-muted-foreground">W/(m²K)</span></p>
              <p className="text-xs text-muted-foreground mt-1">Dreifachverglasung mit erhöhtem Schallschutz. Sinnvoll an Straßen oder bei Einflugschneisen.</p>
            </div>
            <div className="border-2 border-emerald-500 rounded-xl p-4">
              <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 mb-2">Beste Dämmung</span>
              <p className="font-semibold text-sm text-foreground">WÄRMEDÄMMUNG</p>
              <p className="text-xs text-muted-foreground">Verglasung -67</p>
              <p className="text-2xl font-bold text-foreground mt-1">0,88 <span className="text-xs font-normal text-muted-foreground">W/(m²K)</span></p>
              <p className="text-xs text-muted-foreground mt-1">Bester Uw-Wert im Vergleich. Maximale Wärmedämmung für energetisch anspruchsvolle Sanierungen.</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">Quelle: VELUX Technische Werte, CE-Kennzeichnung gem. EN 14351-1.</p>
        </div>
      </section>

      {/* ── Marken-Sektion ── */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-marken">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground" data-testid="heading-marken">
            Ihr VELUX &amp; Roto Fachbetrieb in Bochum
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg" data-testid="text-marken">
            Als VELUX-Partner verfügen wir über umfassendes Fachwissen und direkten Zugang zu
            Originalteilen und Zubehör. Natürlich verbauen wir auch Roto Dachfenster in allen gängigen Ausführungen –
            vom einfachen Klappfenster bis zum elektrischen Dachflächenfenster mit Fernbedienung.
          </p>
        </div>
      </section>

      {/* ── Förderungs-Sektion ── */}
      <section className="py-16 px-4 bg-background" data-testid="section-foerderung">
        <div className="max-w-7xl mx-auto">
          {/* Preisrechner – groß, oben */}
          <div
            className="rounded-md p-8 md:p-12 text-center"
            style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" }}
            data-testid="box-preisrechner"
          >
            <BarChart3 className="w-10 h-10 text-blue-300 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" data-testid="heading-preisrechner">
              VELUX Preisrechner Bochum
            </h2>
            <p className="text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto" data-testid="text-preisrechner">
              Kosten für Ihr VELUX Dachfenster in 3 Schritten berechnen – Fenstertyp, Größe und Eindeckrahmen auswählen, sofort Preisindikation erhalten.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-blue-400 text-white border-blue-400"
              data-testid="button-preisrechner"
            >
              <a href="/velux-preisrechner-bochum">Jetzt Preis berechnen →</a>
            </Button>
          </div>

          {/* Förderung – klein, unten */}
          <div
            className="mt-8 rounded-xl p-6 text-white shadow-lg"
            style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)" }}
            data-testid="box-foerderung"
          >
            <h3 className="mb-2 text-xl font-bold" data-testid="heading-foerderung">
              Bis zu 20 % Förderung durch BAFA &amp; KfW
            </h3>
            <p className="mb-4 text-sm leading-relaxed" data-testid="text-foerderung">
              Der Austausch alter Dachfenster gegen energieeffiziente Modelle mit Uw ≤ 1,0 W/m²K wird über BAFA (BEG Einzelmaßnahme) mit 15 % Grundförderung bezuschusst — mit iSFP steigt der Satz auf 20 %. Zusätzlich ist der KfW-Ergänzungskredit (358/359) bis 120.000 € kombinierbar.
            </p>
            <a
              href="/kontakt"
              className="inline-block rounded-lg bg-white px-5 py-2 font-semibold text-blue-900 hover:bg-gray-100 transition-colors"
              data-testid="button-foerderung-anfragen"
            >
              Jetzt Förderung anfragen
            </a>
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
            <a
              href="/velux-dachfenster-austausch-bochum"
              className="rounded-md p-6 md:p-8 block hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" }}
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
            </a>
            <a
              href="/velux-dachfenster-rolllaeden-bochum"
              className="rounded-md p-6 md:p-8 block hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" }}
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
            </a>
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
              asChild
              size="lg"
              className="pulse-ring cta-pulse"
              data-testid="button-cta-angebot"
            >
              <a href="/kontakt">Angebot anfragen</a>
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
