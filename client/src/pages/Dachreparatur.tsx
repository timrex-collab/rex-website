import { useState } from "react";
import { Helmet } from "react-helmet";
import OrganizationSchema from "@/components/OrganizationSchema";
import AuthorSchema from "@/components/AuthorSchema";
import Breadcrumb from "@/components/Breadcrumb";
import Picture from "@/components/Picture";
import {
  AlertTriangle,
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
const heroImageFallback = "/images/dachreparatur-bochum-rex-bedachung.jpg";

const galleryImages = [
  { src: "/images/dachreparatur-bochum-rex-bedachung.webp", fallback: "/images/dachreparatur-bochum-rex-bedachung.jpg", alt: "Dachreparatur Bochum – Rex Bedachungs GmbH" },
  { src: "/images/dach-hintergrund-rex-bedachung.webp", fallback: "/images/dach-hintergrund-rex-bedachung.jpg", alt: "Dach Bochum – Rex Bedachungs GmbH" },
  { src: "/images/kamin-sanierung-bochum-dachdecker.webp", fallback: "/images/kamin-sanierung-bochum-dachdecker.jpg", alt: "Kamin Sanierung Bochum – Dachdecker Rex Bedachung" },
];

const services = [
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Sturmschaden Reparatur Bochum",
    text: "Abgedeckte Ziegel oder aufgerissene Abdichtungen – wir sichern Ihr Dach kurzfristig und reparieren dauerhaft. Versicherungsabwicklung inklusive.",
    link: "/sturmschaden-dach-bochum",
    linkLabel: "Zur Sturmschaden-Seite →",
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
      "Die Kosten hängen von Art und Umfang des Schadens ab – Preis nach Aufmaß und Schadensumfang. Wir erstellen Ihnen kostenlos ein transparentes Angebot nach Vor-Ort-Diagnose.",
  },
  {
    question: "Wie schnell können Sie einen Sturmschaden reparieren?",
    answer:
      "Bei dringenden Schäden reagieren wir kurzfristig. Bei akuter Gefahr sichern wir Ihr Dach provisorisch ab und führen die dauerhafte Reparatur schnellstmöglich durch. Alle Informationen zu Notsicherung, Versicherungsabwicklung und Schadensumfang finden Sie auf unserer Sturmschaden-Seite.",
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
  "name": "Dachreparatur Bochum – Schnelle Hilfe bei Dachschäden",
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
  "areaServed": ["Bochum", "Wiemelhausen", "Stiepel", "Weitmar", "Querenburg", "Altenbochum", "Steinkuhl", "Ehrenfeld", "Langendreer", "Wattenscheid", "Herne", "Castrop-Rauxel", "Witten", "Hattingen", "Gelsenkirchen"],
  "description": "Dachreparatur in Bochum – Sturmschäden, undichte Dächer, Ziegel, Dachrinnen und Kaminanschlüsse. Kurzfristiger Einsatz, Versicherungsabwicklung inklusive.",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
  },
});

export default function Dachreparatur() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Dachreparatur Bochum | Schnelle Hilfe bei undichtem Dach</title>
        <meta
          name="description"
          content="Dach undicht, Sturmschaden oder Ziegel gebrochen? Rex Bedachungs GmbH behebt Dachschäden in Bochum schnell und dauerhaft – Meisterbetrieb seit 1984. Jetzt anfragen."
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
    "name": "Bochum"
  },
  "serviceType": "Dachreparatur"
}`}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Was kostet eine Dachreparatur in Bochum?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Die Kosten hängen von Art und Umfang des Schadens ab. Wir erstellen kostenlos ein transparentes Angebot nach Vor-Ort-Diagnose."
      }
    },
    {
      "@type": "Question",
      "name": "Wie schnell können Sie einen Sturmschaden reparieren?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Bei dringenden Schäden reagieren wir kurzfristig. Bei akuter Gefahr sichern wir Ihr Dach provisorisch ab und führen die dauerhafte Reparatur schnellstmöglich durch."
      }
    },
    {
      "@type": "Question",
      "name": "Übernimmt die Versicherung die Kosten?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Bei Sturmschäden zahlt in der Regel die Gebäudeversicherung. Wir dokumentieren den Schaden professionell und helfen bei der Abwicklung."
      }
    },
    {
      "@type": "Question",
      "name": "Reparieren Sie alle Dacharten?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ja – Steildächer, Flachdächer, Dachfenster, Kaminanschlüsse, Dachrinnen und Fallrohre. Für alle gängigen Hersteller und Modelle."
      }
    },
    {
      "@type": "Question",
      "name": "Bieten Sie auch Wartungsverträge an?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ja! Mit einem Wartungsvertrag prüfen wir Ihr Dach regelmäßig und beheben kleine Mängel bevor sie zu teuren Schäden werden."
      }
    }
  ]
}`}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Dachreparatur Bochum – Schnelle Hilfe bei undichtem Dach",
  "author": { "@id": "https://www.rex-bedachung.de/#author" },
  "publisher": { "@id": "https://www.rex-bedachung.de/#organization" },
  "url": "https://www.rex-bedachung.de/dachreparatur-bochum"
}`}</script>
      </Helmet>
      <OrganizationSchema />
      <AuthorSchema />

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
            Dachreparatur in Bochum – schnelle Hilfe bei Dachschäden
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-xl" data-testid="text-hero-subtitle">
            Sturmschäden, undichte Stellen, defekte Ziegel – wir reparieren alle Dächer kurzfristig und mit Garantie
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Button
              asChild
              size="lg"
              className="pulse-ring cta-pulse"
              data-testid="button-hero-anfragen"
            >
              <a href="/kontakt">Reparatur anfragen</a>
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

      {/* ── Schadensbilder ── */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-schadensbilder">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground">
            Welcher Dachschaden liegt vor?
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            Erkennen Sie Ihr Schadensbild – wir beheben es dauerhaft.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                titel: "Dach undicht",
                text: "Feuchte Flecken an der Decke oder nasse Balken – wir finden die Schadenstelle und beheben sie dauerhaft.",
              },
              {
                titel: "Dachziegel verrutscht oder gebrochen",
                text: "Einzelne oder mehrere beschädigte Ziegel lassen Wasser ein – schnelle Reparatur verhindert Folgeschäden.",
              },
              {
                titel: "Flachdach undicht",
                text: "Blasen, Risse oder Nahtschäden in der Abdichtung – wir reparieren EPDM, Bitumen und Folienabdichtungen.",
              },
              {
                titel: "Kaminanschluss undicht",
                text: "Undichte Anschlussbleche am Schornstein sind eine häufige Schadensursache – fachgerechte Abdichtung inklusive.",
              },
              {
                titel: "Dachrinne beschädigt",
                text: "Verstopfte, gerissene oder durchhängende Dachrinnen leiten Wasser falsch ab – Reparatur oder Austausch.",
              },
              {
                titel: "Sturmschaden & Hagelschaden",
                text: "Nach Sturmereignissen prüfen wir das gesamte Dach auf Schäden und erstellen eine Dokumentation für Ihre Versicherung.",
              },
              {
                titel: "Feuchtigkeit im Dachgeschoss",
                text: "Schimmel oder Feuchte im Dachgeschoss deutet auf Undichtigkeiten hin – wir lokalisieren die Ursache vor Ort.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 bg-card rounded-md border border-border"
                data-testid={`item-schadensbild-${i}`}
              >
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-foreground text-sm">{item.titel}</p>
                  <p className="text-muted-foreground text-sm mt-1">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
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
                  {s.link && (
                    <a href={s.link} className="inline-block mt-3 text-sm font-medium text-primary hover:underline">
                      {s.linkLabel}
                    </a>
                  )}
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
              asChild
              size="lg"
              className="bg-blue-400 text-white border-blue-400"
              data-testid="button-versicherung-anfragen"
            >
              <a href="/sturmschaden-dach-bochum">Zur Sturmschaden-Seite →</a>
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

      {/* Preisfaktoren */}
      <section className="py-14 px-4 bg-muted/40" data-testid="section-preisfaktoren">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Was kostet eine Dachreparatur?</h2>
          <p className="text-muted-foreground mb-6 text-base leading-relaxed">
            Die Kosten richten sich nach Art und Umfang des Schadens. Richtwerte für häufige Reparaturen:
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {[
              "Einzelne Ziegel austauschen: ab niedrigem dreistelligem Bereich",
              "Dachrinne partiell reparieren: ab ca. 150–300 €",
              "Kaminanschluss erneuern: Preis nach Schadensumfang",
              "Sturmschaden-Reparatur: Preis nach Befund",
              "Flachdach-Abdichtung (Einzelstelle): ab ca. 200–500 €",
              "Notsicherung bei akutem Schaden: Aufwand nach Einsatz",
            ].map((faktor, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-card p-4 rounded-md border border-border">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">{faktor}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-600">
            Transparentes Angebot vor Beginn der Arbeiten – keine versteckten Kosten, keine Notdienstpauschalen.
          </p>
        </div>
      </section>

      {/* Fallstudie */}
      <section className="py-14 px-4 bg-background" data-testid="section-fallstudie">
        <div className="max-w-4xl mx-auto">
          <div className="border-l-[3px] border-primary bg-card p-6 rounded-r-md">
            <span className="inline-block text-[11px] font-medium uppercase tracking-widest text-primary bg-primary/10 px-3 py-0.5 rounded mb-3">Projekt aus Bochum</span>
            <p className="font-semibold text-foreground mb-3">Kaminanschluss-Reparatur in Bochum-Steinkuhl</p>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              <span className="text-muted-foreground font-medium">Ausgangslage</span>
              <span>MFH, chronisch undichter Kaminanschluss, wiederkehrende Wasserflecken im Obergeschoss</span>
              <span className="text-muted-foreground font-medium">Lösung</span>
              <span>Kaminanschluss komplett erneuert mit Titanzink-Einfassung, Unterspannbahn im Anschlussbereich repariert</span>
              <span className="text-muted-foreground font-medium">Ergebnis</span>
              <span>Seit 2 Jahren kein Wassereintritt mehr</span>
            </div>
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
            Rex Bedachungs GmbH führt Dachreparaturen im gesamten Bochumer Stadtgebiet durch – in Wiemelhausen, Stiepel,
            Weitmar, Querenburg, Altenbochum, Steinkuhl, Ehrenfeld, Langendreer und Wattenscheid. Auch im direkten Umland
            sind wir für Sie da: Herne, Castrop-Rauxel, Witten, Hattingen und Gelsenkirchen.
          </p>
          <p className="text-sm text-slate-600 text-center mt-6">
            Bei Dachschäden in Bochum bewertet die Rex Bedachungs GmbH den Schaden vor Ort und gibt eine ehrliche
            Einschätzung – Reparatur nur wenn nötig, Neueindeckung nur wenn sinnvoll. Auf Wunsch unterstützen wir bei
            der Schadensdokumentation für Ihre Versicherung.
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
            <a href="/sturmschaden-dach-bochum" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">Sturmschaden Dach Bochum</div>
              <div className="text-sm text-gray-500">Notsicherung, Schadensdokumentation und Versicherungsabwicklung nach Sturmereignissen.</div>
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
              asChild
              size="lg"
              className="pulse-ring cta-pulse"
              data-testid="button-cta-anfragen"
            >
              <a href="/kontakt">Reparatur anfragen</a>
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
