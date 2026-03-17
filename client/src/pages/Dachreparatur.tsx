import { useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import Breadcrumb from "@/components/Breadcrumb";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  Zap,
  Droplets,
  Home,
  GitBranch,
  Wrench,
  FileText,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const heroImage = "/images/dachreparatur-bochum-rex-bedachung.webp";

const galleryImages = [
  { src: "/images/dachreparatur-bochum-rex-bedachung.webp", alt: "Dachreparatur Bochum – Rex Bedachungs GmbH" },
  { src: "/images/dach-hintergrund-rex-bedachung.webp", alt: "Dach Bochum – Rex Bedachungs GmbH" },
  { src: "/images/kamin-sanierung-bochum-dachdecker.webp", alt: "Kamin Sanierung Bochum – Dachdecker Rex Bedachung" },
];

const services = [
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Sturmschaden Reparatur Bochum",
    text: "Abgedeckte Ziegel, beschädigte Dachrinnen oder aufgerissene Abdichtungen – wir sichern Ihr Dach kurzfristig und reparieren dauerhaft. Unterstützung bei der Versicherungsabwicklung inklusive.",
    testId: "card-sturmschaden",
  },
  {
    icon: <Droplets className="w-8 h-8 text-primary" />,
    title: "Undichtes Dach abdichten",
    text: "Wasserflecken an der Decke sind ein klares Warnsignal. Wir analysieren die Schadensursache vor Ort, dichten fachgerecht ab und dokumentieren alle Maßnahmen – für Sie und Ihre Versicherung.",
    testId: "card-undicht",
  },
  {
    icon: <Home className="w-8 h-8 text-primary" />,
    title: "Ziegel & Eindeckung reparieren",
    text: "Gebrochene, verrutschte oder fehlende Dachziegel reparieren wir schnell und passgenau – egal ob Beton-, Ton- oder Betondachsteine. Für alle gängigen Hersteller und Modelle.",
    testId: "card-ziegel",
  },
  {
    icon: <GitBranch className="w-8 h-8 text-primary" />,
    title: "Dachrinnen & Fallrohre reparieren",
    text: "Verstopfte, undichte oder beschädigte Dachrinnen und Fallrohre reparieren und reinigen wir fachgerecht – inklusive Laubschutzgitter auf Wunsch.",
    testId: "card-dachrinnen",
  },
  {
    icon: <Wrench className="w-8 h-8 text-primary" />,
    title: "Kaminanschlüsse & Dachdurchdringungen",
    text: "Undichte Kaminanschlüsse, Dachdurchdringungen oder Gauben sind häufige Schadensquellen. Wir dichten alle Anschlüsse dauerhaft ab – mit Zink, Aluminium oder Kupfer.",
    testId: "card-kamin",
  },
];

const vorteile = [
  "Schnelle Schadensanalyse vor Ort",
  "Hilfe bei Sturmschäden & Versicherungsabwicklung",
  "Kurzfristiger Einsatz – auch bei Notfällen",
  "Transparentes Angebot mit Kostenaufstellung",
  "Dauerhafte und sichere Lösungen",
  "40+ Jahre Erfahrung im Ruhrgebiet",
  "Alle Dacharten & Hersteller",
];

const vorgehen = [
  "Schadensbesichtigung vor Ort",
  "Detaillierte Analyse der Schadensursache",
  "Transparentes Angebot mit Kostenaufstellung",
  "Termingerechte Durchführung der Reparatur",
  "Abschlussprüfung und Dokumentation",
  "Optional: Wartungsvertrag abschließen",
];

const reasons = [
  "Kurzfristiger Einsatz – auch bei Notfällen",
  "Alle Dacharten: Steildach, Flachdach, Dachfenster",
  "Versicherungsabwicklung auf Wunsch",
  "40+ Jahre Erfahrung in Bochum & Ruhrgebiet",
];

const faqItems = [
  {
    question: "Was kostet eine Dachreparatur in Bochum?",
    answer:
      "Die Kosten hängen von Art und Umfang des Schadens ab. Kleine Reparaturen beginnen ab ca. 150–300 €, größere Sanierungen je nach Aufwand. Wir erstellen Ihnen kostenlos ein transparentes Angebot nach Besichtigung vor Ort.",
  },
  {
    question: "Wie schnell können Sie einen Sturmschaden reparieren?",
    answer:
      "Bei dringenden Schäden reagieren wir kurzfristig. Bei akuter Gefahr sichern wir Ihr Dach provisorisch ab und führen die dauerhafte Reparatur schnellstmöglich durch.",
  },
  {
    question: "Übernimmt die Versicherung die Kosten?",
    answer:
      "Bei Sturmschäden zahlt in der Regel die Gebäudeversicherung. Wir dokumentieren den Schaden professionell und helfen bei der Abwicklung. Sprechen Sie uns an – wir beraten Sie kostenlos.",
  },
  {
    question: "Reparieren Sie alle Dacharten?",
    answer:
      "Ja – wir reparieren Steildächer mit Beton- und Tondachziegeln, Flachdächer aller Abdichtungssysteme, Dachfenster, Kaminanschlüsse, Dachrinnen und Fallrohre. Für alle gängigen Hersteller und Modelle.",
  },
  {
    question: "Bieten Sie auch Wartungsverträge an?",
    answer:
      "Ja! Mit einem Wartungsvertrag prüfen wir Ihr Dach regelmäßig und beheben kleine Mängel bevor sie zu teuren Schäden werden. Sprechen Sie uns auf unsere Wartungspakete an.",
  },
];

const schemaJson = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Dachreparatur Bochum",
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
  "description": "Dachreparatur in Bochum – Sturmschäden, undichte Dächer, Ziegel, Dachrinnen und Kaminanschlüsse. Kurzfristiger Einsatz, Versicherungsabwicklung inklusive.",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
  },
});

export default function Dachreparatur() {
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Dachreparatur Bochum – Sturmschaden &amp; schnelle Hilfe</title>
        <meta
          name="description"
          content="Dachreparatur in Bochum: Sturmschäden, Undichtigkeiten & defekte Ziegel kurzfristig beheben. Meisterbetrieb Rex Bedachung – jetzt anfragen."
        />
        <meta property="og:title" content="Dachreparatur Bochum – Sturmschaden, undichtes Dach & schnelle Hilfe | Rex Bedachungs GmbH" />
        <meta
          property="og:description"
          content="Dachreparatur Bochum ✓ Sturmschäden ✓ Undichtes Dach ✓ Kurzfristiger Einsatz ✓ Versicherungsabwicklung – Rex Bedachungs GmbH, Ihr Fachbetrieb im Ruhrgebiet."
        />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/dachreparatur-bochum-rex-bedachung.webp" />
        <meta property="og:site_name" content="Rex Bedachungs GmbH" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dachreparatur Bochum – Sturmschaden & schnelle Hilfe | Rex Bedachung" />
        <meta name="twitter:description" content="Dachreparatur Bochum ✓ Sturmschäden ✓ Undichtes Dach ✓ Kurzfristiger Einsatz ✓ Versicherungsabwicklung – Rex Bedachungs GmbH." />
        <meta name="twitter:image" content="https://www.rex-bedachung.de/images/dachreparatur-bochum-rex-bedachung.webp" />
        <link rel="canonical" href="https://www.rex-bedachung.de/dachreparatur-bochum" />
        <script type="application/ld+json">{schemaJson}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type":"ListItem","position":1,"name":"Startseite","item":"https://www.rex-bedachung.de/"},
    {"@type":"ListItem","position":2,"name":"Dachreparatur Bochum","item":"https://www.rex-bedachung.de/dachreparatur-bochum"}
  ]
}`}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Dachreparatur Bochum",
  "description": "Schnelle Dachreparatur bei Sturmschäden, Undichtigkeiten und akuten Dachproblemen in Bochum.",
  "provider": {
    "@type": "RoofingContractor",
    "@id": "https://www.rex-bedachung.de/#organization"
  },
  "areaServed": {
    "@type": "City",
    "name": "Bochum",
    "sameAs": "https://www.wikidata.org/wiki/Q2103"
  },
  "serviceType": "Dachreparatur"
}`}</script>
      </Helmet>

      <Breadcrumb items={[
        { label: "Startseite", href: "/" },
        { label: "Dachreparatur" }
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
            Dachreparatur Bochum – schnell, zuverlässig, dauerhaft
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-xl" data-testid="text-hero-subtitle">
            Sturmschäden, undichte Stellen, defekte Ziegel – wir reparieren alle Dächer kurzfristig und mit Garantie
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Button
              size="lg"
              className="cta-pulse"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-hero-anfragen"
            >
              Reparatur anfragen
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
                +49 234 583100
              </a>
            </Button>
          </div>
          <p className="text-sm text-slate-300 font-medium" data-testid="text-trust-badge">
            Kurzfristiger Einsatz &bull; 40+ Jahre Erfahrung &bull; Ruhrgebiet
          </p>
        </div>
      </section>

      {/* ── Einleitung ── */}
      <section className="py-16 px-4 bg-background" data-testid="section-einleitung">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg" data-testid="text-einleitung">
            Wenn das Dach undicht ist oder ein Sturm Schäden hinterlassen hat, zählt jede Stunde. Rex Bedachungs GmbH
            repariert Schäden an Steildächern, Flachdächern und Dachfenstern – schnell, sauber und mit transparenter
            Kostenaufstellung vor Beginn der Arbeiten. Wir helfen auch bei der Abwicklung mit Ihrer Versicherung.
          </p>
          <p className="text-sm text-slate-600 mt-4">Bei Dachschäden in Bochum und dem Ruhrgebiet bewertet die Rex Bedachungs GmbH den Schaden vor Ort und gibt ein transparentes Angebot – ohne Notdienstpauschalen, ohne versteckte Kosten.</p>
        </div>
      </section>

      {/* ── Leistungs-Sektion ── */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-leistungen">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground" data-testid="heading-leistungen">
            Unsere Reparatur-Leistungen in Bochum
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

      {/* ── Vorteile & Vorgehen ── */}
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

      {/* ── Highlight-Box Versicherung ── */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-versicherung">
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-md p-8 md:p-12 text-center"
            style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" }}
            data-testid="box-versicherung"
          >
            <FileText className="w-10 h-10 text-blue-300 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" data-testid="heading-versicherung">
              Sturmschaden? Wir helfen bei der Versicherung
            </h2>
            <p className="text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto" data-testid="text-versicherung">
              Bei Sturmschäden übernehmen viele Gebäudeversicherungen die Reparaturkosten. Wir dokumentieren den Schaden
              professionell, erstellen einen detaillierten Schadensbericht und unterstützen Sie bei der Kommunikation
              mit Ihrer Versicherung – damit Sie schnell zu Ihrem Recht kommen.
            </p>
            <Button
              size="lg"
              className="bg-blue-400 text-white border-blue-400"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-versicherung-anfragen"
            >
              Schaden melden &amp; Beratung anfragen
            </Button>
          </div>
        </div>
      </section>

      {/* ── Warum Rex ── */}
      <section className="py-16 px-4 bg-background" data-testid="section-warum-rex">
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
      <section className="py-16 px-4 bg-muted/40" data-testid="section-galerie">
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

      {/* ── FAQ ── */}
      <section className="py-16 px-4 bg-background" data-testid="section-faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground" data-testid="heading-faq">
            Häufige Fragen zur Dachreparatur in Bochum
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

      {/* ── Regionen ── */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-regionen">
        <div className="max-w-4xl mx-auto text-center">
          <MapPin className="w-8 h-8 text-primary mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground" data-testid="heading-regionen">
            Dachreparatur im gesamten Ruhrgebiet
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg" data-testid="text-regionen">
            Rex Bedachungs GmbH repariert Dächer in Bochum, Herne, Castrop-Rauxel, Witten, Hattingen, Wattenscheid,
            Gelsenkirchen und dem gesamten Ruhrgebiet – kurzfristig, zuverlässig und zu fairen Preisen.
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
              <div className="font-semibold text-gray-900 mb-1">Förderung nach Sturmschaden</div>
              <div className="text-sm text-gray-500">Sturmschäden können förderfähig sein – wir helfen bei der Antragstellung.</div>
            </a>
            <a href="/steildach-bochum" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">Steildach Sanierung</div>
              <div className="text-sm text-gray-500">Wenn die Reparatur nicht mehr reicht – komplette Steildachsanierung in Bochum.</div>
            </a>
            <a href="/bauklempnerei-bochum" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">Bauklempnerei & Dachrinnen</div>
              <div className="text-sm text-gray-500">Defekte Dachrinnen und Fallrohre schnell und fachgerecht reparieren.</div>
            </a>
          </div>
        </div>
      </section>

      {/* ── Abschluss-CTA ── */}
      <section className="py-16 px-4 bg-background" data-testid="section-cta">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground" data-testid="heading-cta">
            Interesse an Reparaturen? Jetzt Schaden melden!
          </h2>
          <p className="text-muted-foreground mb-8 text-base" data-testid="text-cta">
            Rufen Sie uns an oder schreiben Sie uns – wir melden uns kurzfristig und kommen zur
            kostenlosen Besichtigung.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="cta-pulse"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-cta-anfragen"
            >
              Reparatur anfragen
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              data-testid="button-cta-anrufen"
            >
              <a href="tel:+49234583100" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +49 234 583100
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
