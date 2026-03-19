import { useState } from "react";
import { Helmet } from "react-helmet";
import OrganizationSchema from "@/components/OrganizationSchema";
import { useLocation } from "wouter";
import Breadcrumb from "@/components/Breadcrumb";
import {
  ChevronDown,
  ChevronUp,
  Phone,
  Home,
  AlertTriangle,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqItems = [
  {
    question: "Was tun wenn das Steildach undicht ist?",
    answer:
      "Zunächst sichtbare Wasserschäden im Innenraum sichern und dokumentieren. Dann einen Fachbetrieb zur Diagnose hinzuziehen – die eigentliche Schadenstelle liegt oft weit entfernt vom sichtbaren Wassereintritt. Rex Bedachung kommt zur kostenlosen Vor-Ort-Diagnose.",
  },
  {
    question: "Kann ich ein undichtes Dach selbst reparieren?",
    answer:
      "Kleine Maßnahmen wie das Einsetzen einzelner Ersatzziegel sind möglich, aber ohne Fachkenntnis riskant. Die eigentliche Ursache bleibt oft unerkannt. Bei Dacharbeiten besteht zudem erhebliche Absturzgefahr – Fachbetrieb beauftragen ist immer die sicherere Wahl.",
  },
  {
    question: "Übernimmt die Hausratversicherung Schäden durch ein undichtes Dach?",
    answer:
      "Sturmschäden werden in der Regel von der Wohngebäudeversicherung übernommen. Schäden durch normalen Verschleiß sind typischerweise nicht versichert. Wir erstellen auf Wunsch eine Schadendokumentation für Ihre Versicherung.",
  },
  {
    question: "Wie lange dauert die Reparatur eines undichten Steildachs?",
    answer:
      "Eine lokale Reparatur (einzelne Ziegel, ein Anschluss) ist oft in einem halben bis ganzen Arbeitstag erledigt. Größere Schäden oder Teilsanierungen dauern entsprechend länger – wir nennen Ihnen den genauen Zeitrahmen im Angebot.",
  },
  {
    question: "Wie erkenne ich ob mein Steildach eine Reparatur oder Neueindeckung braucht?",
    answer:
      "Das lässt sich ohne Fachkenntnis kaum beurteilen – entscheidend sind Alter des Dachs, Zustand von Lattung und Unterspannbahn sowie die Anzahl der Schadenstellen. Rex Bedachung gibt Ihnen nach der Vor-Ort-Diagnose eine ehrliche Empfehlung.",
  },
];

const ursachenCards = [
  {
    title: "Defekte oder verrutschte Ziegel",
    text: "Gebrochene, verrutschte oder poröse Ziegel sind die häufigste Einzelursache. Oft nach Sturm oder Frost entstanden.",
  },
  {
    title: "Undichte Dachanschlüsse",
    text: "An Gauben, Schornsteinen, Dachfenstern und Ortgängen können Dichtungen und Bleche mit der Zeit versagen.",
  },
  {
    title: "Beschädigte Unterspannbahn",
    text: "Die Unterspannbahn schützt als zweite Abdichtungsebene – Risse oder Fehlstellen lassen Wasser durch.",
  },
  {
    title: "Moos- und Algenbefall",
    text: "Starker Bewuchs hält dauerhaft Feuchtigkeit und kann Ziegel durch Frost aufsprengen.",
  },
  {
    title: "Alterung und Materialermüdung",
    text: "Nach 30–40 Jahren sind Ziegel, Lattung und Unterspannbahn am Ende ihrer Lebensdauer – eine Inspektion ist dann Pflicht.",
  },
  {
    title: "Sturmschäden",
    text: "Starke Winde können Ziegel abheben, verschieben oder beschädigen – nach jedem Sturmereignis prüfen lassen.",
  },
];

const schadensbilder = [
  "Feuchte oder dunkle Flecken an Decken oder Wänden",
  "Wasserränder oder Salzausblühungen im Dachgeschoss",
  "Schimmelbildung an Dachbalken oder Wänden",
  "Muffiger Geruch im Dachgeschoss",
  "Sichtbar beschädigte oder fehlende Ziegel",
  "Nasse Dämmung oder Unterspannbahn",
];

const ablaufSchritte = [
  { nr: 1, text: "Kostenlose Vor-Ort-Diagnose und Schadensanalyse" },
  { nr: 2, text: "Schriftliche Einschätzung: Reparatur oder Neueindeckung" },
  { nr: 3, text: "Transparentes Angebot nach Aufmaß" },
  { nr: 4, text: "Schadensbeseitigung durch Meisterbetrieb" },
  { nr: 5, text: "Abschlusskontrolle und Dokumentation" },
];

export default function SteildachUndichtBochum() {
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
          { "@type": "ListItem", position: 3, name: "Steildach undicht Bochum", item: "https://www.rex-bedachung.de/steildach-undicht-bochum" },
        ],
      },
      {
        "@type": "Article",
        headline: "Steildach undicht – Ursachen, Sofortmaßnahmen und dauerhafte Lösung in Bochum",
        author: { "@type": "Organization", name: "Rex Bedachungs GmbH" },
        publisher: { "@type": "Organization", name: "Rex Bedachungs GmbH" },
        datePublished: "2026-03-17",
        url: "https://www.rex-bedachung.de/steildach-undicht-bochum",
      },
      {
        "@type": "Service",
        name: "Dachreparatur undichtes Steildach Bochum",
        serviceType: "Dachreparatur und Schadensbeseitigung",
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
        <title>Steildach undicht Bochum – Ursachen &amp; Lösung | Rex Bedachungs GmbH</title>
        <meta
          name="description"
          content="Steildach undicht in Bochum? Ursachen erkennen, Schäden richtig einschätzen, dauerhaft abdichten. Rex Bedachungs GmbH – Meisterbetrieb seit 1984."
        />
        <link rel="canonical" href="https://www.rex-bedachung.de/steildach-undicht-bochum" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Steildach undicht Bochum – Ursachen & Lösung | Rex Bedachungs GmbH" />
        <meta
          property="og:description"
          content="Steildach undicht in Bochum? Ursachen erkennen, Schäden richtig einschätzen, dauerhaft abdichten. Rex Bedachungs GmbH – Meisterbetrieb seit 1984."
        />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/tondach-hero-dachdeckung-bochum.webp" />
        <meta property="og:url" content="https://www.rex-bedachung.de/steildach-undicht-bochum" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Steildach undicht Bochum – Ursachen & Lösung | Rex Bedachungs GmbH" />
        <meta
          name="twitter:description"
          content="Steildach undicht in Bochum? Ursachen erkennen, Schäden richtig einschätzen, dauerhaft abdichten. Rex Bedachungs GmbH – Meisterbetrieb seit 1984."
        />
        <meta name="twitter:image" content="https://www.rex-bedachung.de/images/tondach-hero-dachdeckung-bochum.webp" />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>
      <OrganizationSchema />

      <Breadcrumb
        items={[
          { label: "Startseite", href: "/" },
          { label: "Steildach Bochum", href: "/steildach-bochum" },
          { label: "Steildach undicht Bochum" },
        ]}
      />

      {/* 1. Hero */}
      <section
        className="py-20 px-4 bg-gradient-to-br from-slate-900 to-red-950 text-white"
        data-testid="section-hero"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight" data-testid="heading-hero">
            Steildach undicht in Bochum – Ursachen erkennen und dauerhaft abdichten
          </h1>
          <p className="text-lg md:text-xl text-red-100 mb-6 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
            Feuchte Flecken, nasse Balken, Schimmel im Dachgeschoss – Rex Bedachungs GmbH findet die Ursache
            und behebt den Schaden dauerhaft.
          </p>
          <p className="text-sm text-red-200 mb-10" data-testid="text-hero-badge">
            Meisterbetrieb&nbsp;•&nbsp;Vor-Ort-Diagnose&nbsp;•&nbsp;Ruhrgebiet
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="pulse-ring cta-pulse font-semibold rounded-md"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-hero-schaden"
            >
              Schaden melden
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
            Undichtes Steildach – warum schnelles Handeln wichtig ist
          </h2>
          <p className="text-muted-foreground mb-4 text-base leading-relaxed">
            Ein undichtes Dach verursacht Folgeschäden, die weit über den eigentlichen Eintrittsbereich
            hinausgehen – Dachstuhl, Dämmung, Decke und Wände können betroffen sein. Je länger gewartet wird,
            desto größer der Schaden.
          </p>
          <p className="text-muted-foreground mb-5 text-base leading-relaxed">
            Alle Steildach-Leistungen und Informationen finden Sie auf unserer{" "}
            <a href="/steildach-bochum" className="text-primary font-semibold hover:underline">
              Steildach-Übersichtsseite
            </a>
            .
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 italic" data-testid="text-fact-snippet">
            Die Rex Bedachungs GmbH bewertet undichte Steildächer in Bochum und dem Ruhrgebiet vor Ort –
            transparente Einschätzung, Reparatur nur wenn nötig, Neueindeckung nur wenn sinnvoll.
          </p>
        </div>
      </section>

      {/* 3. Häufige Ursachen */}
      <section className="py-14 px-4 bg-muted/40" data-testid="section-ursachen">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
            Die häufigsten Ursachen für ein undichtes Steildach
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {ursachenCards.map((card, i) => (
              <Card key={i} data-testid={`card-ursache-${i}`}>
                <CardHeader className="flex flex-row items-start gap-3 pb-2 flex-wrap">
                  <div className="mt-1">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                  </div>
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

      {/* 4. Schadensbild erkennen */}
      <section className="py-14 px-4 bg-background" data-testid="section-schadensbild">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
            So erkennen Sie ein undichtes Steildach
          </h2>
          <ul className="space-y-3 mb-8">
            {schadensbilder.map((punkt, i) => (
              <li key={i} className="flex items-start gap-3" data-testid={`schadensbild-${i}`}>
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                <span className="text-muted-foreground text-base">{punkt}</span>
              </li>
            ))}
          </ul>
          <div
            className="flex items-start gap-3 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/40 p-4"
            data-testid="box-wichtig"
          >
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Wichtig:</strong> Feuchte Flecken innen zeigen den Schaden oft erst Wochen nach dem
              eigentlichen Wassereintritt – die tatsächliche Schadenstelle liegt häufig mehrere Meter entfernt
              vom sichtbaren Fleck.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Reparatur vs. Neueindeckung */}
      <section className="py-14 px-4 bg-muted/40" data-testid="section-reparatur-vs-neueindeckung">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
            Reparatur oder Neueindeckung – was ist sinnvoll?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <Card data-testid="card-reparatur">
              <CardHeader className="flex flex-row items-start gap-3 pb-2 flex-wrap">
                <div className="mt-1">
                  <Wrench className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-base font-semibold">Reparatur sinnvoll wenn...</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "Dach jünger als 20 Jahre",
                    "Schaden lokal begrenzt (einzelne Ziegel, ein Anschluss)",
                    "Dachstuhl und Lattung in gutem Zustand",
                    "Unterspannbahn intakt",
                  ].map((punkt, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary font-bold shrink-0">–</span>
                      {punkt}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card data-testid="card-neueindeckung">
              <CardHeader className="flex flex-row items-start gap-3 pb-2 flex-wrap">
                <div className="mt-1">
                  <Home className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-base font-semibold">Neueindeckung sinnvoll wenn...</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "Dach älter als 30–40 Jahre",
                    "Mehrere Schadenstellen gleichzeitig",
                    "Lattung oder Dachstuhl beschädigt",
                    "Gleichzeitig Dämmung geplant (GEG/Förderung)",
                  ].map((punkt, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary font-bold shrink-0">–</span>
                      {punkt}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 italic" data-testid="text-fact-reparatur">
            Rex Bedachungs GmbH empfiehlt nur, was wirklich notwendig ist – nach kostenloser Vor-Ort-Diagnose
            erhalten Sie eine ehrliche Einschätzung.
          </p>
        </div>
      </section>

      {/* 6. Ablauf */}
      <section className="py-14 px-4 bg-background" data-testid="section-ablauf">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
            So gehen wir bei einem undichten Steildach vor
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
            Häufige Fragen zum undichten Steildach in Bochum
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

      {/* 8. Verweis Dachreparatur */}
      <section className="py-14 px-4 bg-background" data-testid="section-verweis-reparatur">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Schnelle Hilfe bei Dachschäden in Bochum
          </h2>
          <p className="text-muted-foreground mb-6 text-base leading-relaxed">
            Für alle akuten Dachschäden – nicht nur am Steildach – steht Rex Bedachungs GmbH bereit.
            Alle Informationen zur Dachreparatur finden Sie hier.
          </p>
          <a
            href="/dachreparatur-bochum"
            className="block p-5 bg-muted/40 rounded-xl border border-border hover:border-primary hover:shadow-md transition-all"
            data-testid="link-dachreparatur"
          >
            <div className="font-semibold text-foreground mb-1">Dachreparatur Bochum</div>
            <div className="text-sm text-muted-foreground">
              Schadensbeseitigung an allen Dachformen – Meisterbetrieb Rex Bedachungs GmbH
            </div>
          </a>
        </div>
      </section>

      {/* 9. CTA */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-cta">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground" data-testid="heading-cta">
            Steildach undicht? Jetzt Diagnose anfragen.
          </h2>
          <p className="text-muted-foreground mb-8 text-base" data-testid="text-cta">
            Wir kommen zur kostenlosen Vor-Ort-Diagnose und geben Ihnen eine ehrliche Einschätzung –
            Reparatur nur wenn nötig.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="pulse-ring cta-pulse font-semibold rounded-md"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-cta-diagnose"
            >
              Diagnose anfragen
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
              <div className="text-sm text-gray-500 dark:text-muted-foreground">Alle Steildach-Leistungen im Überblick</div>
            </a>
            <a
              href="/dachreparatur-bochum"
              className="block p-5 bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border hover:border-primary hover:shadow-md transition-all"
              data-testid="link-cluster-dachreparatur"
            >
              <div className="font-semibold text-gray-900 dark:text-foreground mb-1">Dachreparatur Bochum</div>
              <div className="text-sm text-gray-500 dark:text-muted-foreground">Schadensbeseitigung an allen Dachformen</div>
            </a>
            <a
              href="/dachwartung-bochum"
              className="block p-5 bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border hover:border-primary hover:shadow-md transition-all"
              data-testid="link-cluster-dachwartung"
            >
              <div className="font-semibold text-gray-900 dark:text-foreground mb-1">Dachwartung Bochum</div>
              <div className="text-sm text-gray-500 dark:text-muted-foreground">Regelmäßige Inspektion verhindert teure Schäden</div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
