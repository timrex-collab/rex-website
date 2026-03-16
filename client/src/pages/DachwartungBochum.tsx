import { useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  Search,
  Droplets,
  Shield,
  FileText,
  Calendar,
  Home,
  Building2,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const heroImagePath = "/images/dachdecker-inspektion-dachwartung-bochum.webp";
const heroImage = heroImagePath;

const services = [
  {
    icon: <Search className="w-8 h-8 text-primary" />,
    title: "Dachinspektion & Sichtprüfung Bochum",
    text: "Unsere Fachleute prüfen alle Dachbereiche systematisch – Eindeckung, Anschlüsse, Abdichtungen, Dachrinnen, Kehlen und Durchdringungen. Dokumentation mit Fotos, damit Sie genau sehen was wir sehen.",
    testId: "card-inspektion",
  },
  {
    icon: <Droplets className="w-8 h-8 text-primary" />,
    title: "Dachrinnen & Abläufe reinigen",
    text: "Verstopfte Dachrinnen und Abläufe sind die häufigste Ursache für Wasserschäden an Fassade und Fundament. Wir reinigen gründlich, prüfen auf Undichtigkeiten und montieren auf Wunsch Laubschutzgitter.",
    testId: "card-dachrinnen",
  },
  {
    icon: <Shield className="w-8 h-8 text-primary" />,
    title: "Dichtigkeitskontrolle & Anschlüsse",
    text: "Wir kontrollieren alle Abdichtungen, Kaminanschlüsse, Gaubenanschlüsse und Dachdurchdringungen auf Dichtigkeit. Kleine Mängel beheben wir direkt vor Ort – ohne extra Termin, ohne Mehrkosten.",
    testId: "card-dichtigkeit",
  },
  {
    icon: <FileText className="w-8 h-8 text-primary" />,
    title: "Dokumentation mit Fotos",
    text: "Nach jeder Wartung erhalten Sie einen detaillierten Bericht mit Fotos aller geprüften Bereiche. So haben Sie stets den Überblick über den Zustand Ihres Daches – ideal auch für Versicherungen und Eigentümernachweise.",
    testId: "card-dokumentation",
  },
  {
    icon: <Calendar className="w-8 h-8 text-primary" />,
    title: "Wartungsvertrag – planen statt reagieren",
    text: "Mit unserem Wartungsvertrag kümmern wir uns regelmäßig um Ihr Dach – jährlich oder halbjährlich. Sie erhalten Terminplanung, Priorität bei Reparaturen und vergünstigte Konditionen. Für Hausverwaltungen und Eigentümer mehrerer Objekte besonders empfehlenswert.",
    testId: "card-wartungsvertrag",
  },
];

const vorteile = [
  "Regelmäßige Inspektion durch Fachleute",
  "Schadensprävention und Werterhaltung",
  "Reinigung von Dachrinnen und Kehlen",
  "Kontrolle aller Abdichtungen und Anschlüsse",
  "Sofortbehebung kleiner Mängel vor Ort",
  "Fotodokumentation nach jeder Wartung",
  "Wartungsverträge – jährlich oder halbjährlich",
  "Günstigere Konditionen bei Folgereparaturen",
];

const vorgehen = [
  "Sichtprüfung aller Dachbereiche",
  "Reinigung von Dachrinnen und Abläufen",
  "Kontrolle von Dichtungen und Anschlüssen",
  "Sofortbehebung kleiner Mängel vor Ort",
  "Dokumentation mit Fotos",
  "Übergabe des Wartungsberichts",
];

const kostenKarten = [
  {
    icon: <Home className="w-8 h-8 text-primary" />,
    title: "Einfamilienhaus",
    text: "Inspektion, Dachrinnenreinigung und Dichtigkeitskontrolle ab ca. 150–250 \u20AC. Exakter Preis nach Aufmaß und Dachgröße. Kostenloses Angebot auf Anfrage.",
    testId: "card-kosten-efh",
  },
  {
    icon: <Building2 className="w-8 h-8 text-primary" />,
    title: "Mehrfamilienhaus",
    text: "Je nach Größe und Anzahl der Wohneinheiten ab ca. 250–500 \u20AC. Für Hausverwaltungen bieten wir Rahmenverträge mit vergünstigten Konditionen.",
    testId: "card-kosten-mfh",
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-primary" />,
    title: "Was Sie sparen",
    text: "Eine nicht erkannte Undichtigkeit kann innerhalb einer Saison Schäden von 5.000–30.000 \u20AC verursachen. Regelmäßige Wartung kostet ein Bruchteil davon.",
    testId: "card-kosten-sparen",
  },
];

const faqItems = [
  {
    question: "Wie oft sollte ein Dach gewartet werden?",
    answer:
      "Experten empfehlen eine Inspektion mindestens einmal jährlich – idealerweise im Herbst vor der Regenzeit. Bei älteren Dächern oder nach Sturmereignissen ist eine zusätzliche Kontrolle sinnvoll.",
  },
  {
    question: "Was kostet ein Wartungsvertrag?",
    answer:
      "Die Kosten hängen von Dachgröße und Leistungsumfang ab. Wir erstellen Ihnen ein individuelles Angebot. Als Richtwert: Einfamilienhäuser ab ca. 120–200 \u20AC pro Jahr inklusive Reinigung und Inspektion.",
  },
  {
    question: "Beheben Sie Mängel direkt bei der Wartung?",
    answer:
      "Ja – kleine Mängel wie lose Ziegel, defekte Anschlüsse oder verstopfte Abläufe beheben wir direkt vor Ort, ohne extra Termin. Größere Schäden dokumentieren wir und erstellen Ihnen sofort ein Angebot.",
  },
  {
    question: "Ist Dachwartung für Vermieter Pflicht?",
    answer:
      "Eine gesetzliche Pflicht zur regelmäßigen Dachwartung besteht nicht überall, jedoch sind Eigentümer zur Verkehrssicherungspflicht verpflichtet – das schließt die Instandhaltung des Daches ein. Bei Schäden durch unterlassene Wartung kann die Versicherung Leistungen kürzen.",
  },
  {
    question: "Bieten Sie Wartungsverträge für Hausverwaltungen an?",
    answer:
      "Ja – wir betreuen mehrere Hausverwaltungen und WEGs im Ruhrgebiet mit individuellen Rahmenverträgen. Feste Ansprechpartner, Priorität bei Reparaturen, vergünstigte Konditionen und zentrale Dokumentation für alle Objekte.",
  },
];

const schemaJson = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Dachwartung Bochum",
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
  "description": "Dachwartung in Bochum – jährliche Dachinspektion, Dachrinnenreinigung, Dichtigkeitskontrolle und Wartungsverträge für Privat und Hausverwaltungen.",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
  },
});

export default function DachwartungBochum() {
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Dachwartung Bochum – Inspektion &amp; Wartungsvertrag</title>
        <meta
          name="description"
          content="Dachwartung Bochum ✓ Jährliche Dachinspektion ✓ Dachrinnenreinigung ✓ Wartungsverträge ✓ Fotodokumentation – Rex Bedachungs GmbH, Fachbetrieb im Ruhrgebiet."
        />
        <meta property="og:title" content="Dachwartung Bochum – Dachinspektion, Dachrinnenreinigung & Wartungsvertrag | Rex Bedachungs GmbH" />
        <meta
          property="og:description"
          content="Dachwartung Bochum ✓ Jährliche Dachinspektion ✓ Dachrinnenreinigung ✓ Wartungsverträge ✓ Fotodokumentation – Rex Bedachungs GmbH, Ihr Fachbetrieb im Ruhrgebiet."
        />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/dachdecker-inspektion-dachwartung-bochum.webp" />
        <meta property="og:site_name" content="Rex Bedachungs GmbH" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dachwartung Bochum – Inspektion & Wartungsvertrag | Rex Bedachung" />
        <meta name="twitter:description" content="Dachwartung Bochum ✓ Jährliche Dachinspektion ✓ Dachrinnenreinigung ✓ Wartungsverträge – Rex Bedachungs GmbH." />
        <meta name="twitter:image" content="https://www.rex-bedachung.de/images/dachdecker-inspektion-dachwartung-bochum.webp" />
        <link rel="canonical" href="https://www.rex-bedachung.de/dachwartung-bochum" />
        <script type="application/ld+json">{schemaJson}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type":"ListItem","position":1,"name":"Startseite","item":"https://www.rex-bedachung.de/"},
    {"@type":"ListItem","position":2,"name":"Dachwartung Bochum","item":"https://www.rex-bedachung.de/dachwartung-bochum"}
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
            Dachwartung Bochum – Schäden erkennen bevor sie teuer werden
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-xl" data-testid="text-hero-subtitle">
            Regelmäßige Inspektion, Dachrinnenreinigung und Dichtigkeitskontrolle – für die Sicherheit und Werterhaltung Ihres Gebäudes
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Button
              size="lg"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-hero-wartungsvertrag"
            >
              Wartungsvertrag anfragen
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
            Wartungsverträge verfügbar &bull; Dokumentation mit Fotos &bull; 40+ Jahre Erfahrung
          </p>
        </div>
      </section>

      {/* Einleitung */}
      <section className="py-16 px-4 bg-background" data-testid="section-einleitung">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg" data-testid="text-einleitung">
            Regelmäßige Wartung verlängert die Lebensdauer Ihres Daches erheblich und vermeidet teure Folgeschäden. Wir prüfen Ihr Dach auf Schäden, reinigen Dachrinnen, kontrollieren Abdichtungen und beheben kleine Mängel sofort. Auf Wunsch bieten wir Wartungsverträge mit regelmäßigen Inspektionen – für Ihre Sicherheit und Werterhaltung. Ein gewartetes Dach spart langfristig ein Vielfaches seiner Wartungskosten.
          </p>
        </div>
      </section>

      {/* Leistungskarten */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-leistungen">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground" data-testid="heading-leistungen">
            Unsere Wartungsleistungen in Bochum
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

      {/* Highlight-Box Wartungsvertrag */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-wartungsvertrag">
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-md p-8 md:p-12 text-center"
            style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" }}
            data-testid="box-wartungsvertrag"
          >
            <Calendar className="w-10 h-10 text-blue-300 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" data-testid="heading-wartungsvertrag">
              Wartungsvertrag – einmal abschließen, dauerhaft sorgenfrei
            </h2>
            <p className="text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto" data-testid="text-wartungsvertrag">
              Mit einem Wartungsvertrag bei Rex Bedachungs GmbH haben Sie immer einen festen Ansprechpartner für Ihr Dach. Wir planen die Termine im Voraus, erinnern Sie rechtzeitig und reagieren bei akuten Schäden bevorzugt. Besonders geeignet für Hausverwaltungen, Wohnungseigentümergemeinschaften und Eigentümer mehrerer Objekte.
            </p>
            <Button
              size="lg"
              className="bg-blue-400 text-white border-blue-400"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-wartungsvertrag-anfragen"
            >
              Wartungsvertrag anfragen
            </Button>
          </div>
        </div>
      </section>

      {/* Kosten-Sektion */}
      <section className="py-16 px-4 bg-background" data-testid="section-kosten">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground" data-testid="heading-kosten">
            Was kostet Dachwartung in Bochum?
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto" data-testid="text-kosten-subtitle">
            Kleine Investition – große Wirkung
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {kostenKarten.map((k) => (
              <Card key={k.testId} data-testid={k.testId}>
                <CardHeader className="flex flex-col items-start gap-3 pb-2">
                  <div className="shrink-0">{k.icon}</div>
                  <CardTitle className="text-base leading-snug">{k.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{k.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground" data-testid="heading-faq">
            Häufige Fragen zur Dachwartung in Bochum
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
              Dachwartung im gesamten Ruhrgebiet
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed text-base" data-testid="text-regionen">
            Rex Bedachungs GmbH übernimmt Dachwartung und Dachinspektionen in Bochum, Herne, Castrop-Rauxel, Witten, Hattingen, Wattenscheid, Gelsenkirchen und dem gesamten Ruhrgebiet – zuverlässig, termingerecht und mit vollständiger Dokumentation.
          </p>
        </div>
      </section>

      {/* Abschluss-CTA */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-cta">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground" data-testid="heading-cta">
            Interesse an Dachwartung? Jetzt anfragen!
          </h2>
          <p className="text-muted-foreground mb-8 text-base" data-testid="text-cta">
            Kostenloses Erstgespräch – wir melden uns zeitnah.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-cta-wartungsvertrag"
            >
              Wartungsvertrag anfragen
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
