import { useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  AlertTriangle,
  Layers,
  Wrench,
  Thermometer,
  Leaf,
  ClipboardCheck,
  Droplets,
  Box,
  FlaskConical,
  Sheet,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const heroImage = "/images/flachdach-sanierung-bochum-rex-bedachung.webp";

const galleryImages = [
  { src: "/images/flachdach-sanierung-bochum-rex-bedachung.webp", alt: "Flachdach Sanierung Bochum – Rex Bedachungs GmbH" },
  { src: "/images/flachdach-metallverkleidung-bochum-rex-bedachung.webp", alt: "Flachdach Metallverkleidung Bochum – Rex Bedachungs GmbH" },
  { src: "/images/gruendach-bochum-dachbegruenung-experten.webp", alt: "Gründach Bochum – Dachbegrünung Experten Rex Bedachungs GmbH" },
];

const services = [
  {
    icon: <Layers className="w-8 h-8 text-primary" />,
    title: "Flachdach Neueindeckung Bochum",
    text: "Ob Neubau oder kompletter Neuaufbau – wir decken Ihr Flachdach fachgerecht ein und wählen gemeinsam das passende Abdichtungssystem für Ihr Gebäude und Budget.",
    testId: "card-neueindeckung",
    highlight: false,
  },
  {
    icon: <Wrench className="w-8 h-8 text-primary" />,
    title: "Flachdach Sanierung & Abdichtung",
    text: "Undichtes Flachdach? Wir analysieren den Schaden, sanieren fachgerecht und sorgen für eine langlebige Abdichtung – egal ob kleiner Riss oder Komplettsanierung.",
    testId: "card-sanierung",
    highlight: false,
  },
  {
    icon: <Thermometer className="w-8 h-8 text-primary" />,
    title: "Energieeffiziente Flachdach Dämmung",
    text: "Eine professionelle Flachdachdämmung senkt Ihre Heizkosten spürbar und wird staatlich gefördert. Wir beraten Sie zu allen Möglichkeiten und übernehmen die komplette Umsetzung.",
    testId: "card-daemmung",
    highlight: false,
  },
  {
    icon: <Leaf className="w-8 h-8 text-primary" />,
    title: "Gründach & Dachbegrünung Bochum",
    text: "Verwandeln Sie Ihr Flachdach in ein Gründach – extensiv (pflegeleicht, Sedum & Moos) oder intensiv (Dachgarten, begehbar). Inklusive Wurzelschutzfolie, Drainageschicht und fachgerechter Abdichtung. Gründächer verbessern die Dämmung, verlängern die Dachabdichtung und werden mit KfW gefördert.",
    testId: "card-gruendach",
    highlight: true,
  },
  {
    icon: <ClipboardCheck className="w-8 h-8 text-primary" />,
    title: "Wartungsverträge für langfristige Sicherheit",
    text: "Regelmäßige Kontrolle verhindert teure Schäden. Wir prüfen Abdichtung, Entwässerung und Dämmung – und beheben kleine Mängel direkt vor Ort.",
    testId: "card-wartung",
    highlight: false,
  },
];

const vorteile = [
  "Moderne Abdichtungssysteme (Bitumen, Kunststoff, EPDM)",
  "Energieeffiziente Dämmung",
  "Gründach und Dachbegrünung",
  "Dachterrassen und Balkone",
  "Wartungsverträge für langfristige Sicherheit",
  "Kostenloses Aufmaß vor Ort",
  "Gründach extensiv & intensiv – Bochum & Ruhrgebiet",
  "Dachbegrünung nach FLL-Richtlinien",
];

const vorgehen = [
  "Bestandsaufnahme und Zustandsanalyse",
  "Beratung zu Abdichtungssystemen",
  "Fachgerechte Ausführung und Abdichtung",
  "Qualitätskontrolle und Dichtheitsprüfung",
  "Optional: Wartungsvertrag abschließen",
];

const systems = [
  {
    icon: <Droplets className="w-8 h-8 text-primary" />,
    title: "Bitumenbahn",
    text: "Bewährtes Abdichtungssystem – langlebig, wirtschaftlich und ideal für Flachdächer aller Größen.",
    testId: "card-system-bitumen",
  },
  {
    icon: <Sheet className="w-8 h-8 text-primary" />,
    title: "EPDM-Folie",
    text: "Hochelastische Gummidachbahn – besonders langlebig und ideal für anspruchsvolle Geometrien.",
    testId: "card-system-epdm",
  },
  {
    icon: <FlaskConical className="w-8 h-8 text-primary" />,
    title: "Flüssigkunststoff",
    text: "Nahtlose Abdichtung für komplexe Dachformen, Balkone und Terrassen – sofort belastbar.",
    testId: "card-system-fluessig",
  },
  {
    icon: <Box className="w-8 h-8 text-primary" />,
    title: "Kunststoff/PVC",
    text: "Leicht, langlebig und recyclebar – ideal für große Flächen und Industriebauten.",
    testId: "card-system-pvc",
  },
];

const reasons = [
  "Alle Abdichtungssysteme aus einer Hand",
  "Kostenloses Aufmaß vor Ort in Bochum",
  "20+ Jahre Erfahrung im Ruhrgebiet",
  "Kostenlose Beratung & Förderantrag",
];

const faqItems = [
  {
    question: "Was kostet eine Flachdachsanierung in Bochum?",
    answer:
      "Die Kosten hängen von Fläche, Zustand und gewähltem Abdichtungssystem ab. Orientierung: Abdichtung ab ca. 40–80 €/m², Komplettsanierung mit Dämmung ab ca. 80–150 €/m². Wir erstellen Ihnen kostenlos ein genaues Aufmaß und transparentes Angebot.",
  },
  {
    question: "Wie lange hält eine Flachdachabdichtung?",
    answer:
      "Je nach System halten moderne Abdichtungen 20–30 Jahre. Mit regelmäßiger Wartung deutlich länger.",
  },
  {
    question: "Welche Abdichtungssysteme verwenden Sie?",
    answer:
      "Wir arbeiten mit allen gängigen Systemen: Bitumenbahn, EPDM-Folie, Flüssigkunststoff und Kunststoffdachbahnen (PVC/TPO). Wir empfehlen das optimale System für Ihr Gebäude.",
  },
  {
    question: "Kann ich mein Flachdach fördern lassen?",
    answer:
      "Ja! Bei Sanierungen mit verbesserter Dämmung können Sie über BAFA oder KfW bis zu 20% der Kosten zurückbekommen. Wir übernehmen auf Wunsch die komplette Antragstellung.",
  },
  {
    question: "Kann man ein Flachdach begrünen oder als Terrasse nutzen?",
    answer:
      "Ja! Wir realisieren sowohl extensive als auch intensive Begrünung sowie begehbare Dachterrassen – inklusive Wurzelschutz, Drainage und fachgerechter Abdichtung.",
  },
  {
    question: "Was kostet ein Gründach in Bochum?",
    answer:
      "Ein extensives Gründach kostet in der Regel 50–100 €/m², ein intensives Gründach 100–200 €/m² – jeweils inklusive Abdichtung, Wurzelschutz und Substrat. Wir erstellen Ihnen kostenlos ein Aufmaß und Angebot.",
  },
  {
    question: "Wird ein Gründach in Bochum gefördert?",
    answer:
      "Ja! Gründächer werden über KfW-Programme sowie teilweise durch städtische Förderprogramme der Stadt Bochum unterstützt. Zusätzlich senkt ein Gründach langfristig die Niederschlagswassergebühren. Wir beraten Sie kostenlos zu allen Fördermöglichkeiten.",
  },
];

const schemaJson = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Flachdach Sanierung Bochum",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Rex Bedachungs GmbH",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bochum",
    },
  },
  "areaServed": "Bochum, Ruhrgebiet",
  "description": "Flachdach Neueindeckung, Sanierung, Abdichtung, Dämmung und Begrünung – alle Systeme",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Flachdach & Gründach Leistungen",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Gründach & Dachbegrünung Bochum – extensiv und intensiv",
          "description": "Fachgerechte Dachbegrünung in Bochum – extensiv und intensiv, inklusive Wurzelschutz, Drainage und KfW-Förderberatung",
        },
      },
    ],
  },
});

export default function FlachdachBochum() {
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Flachdach &amp; Gründach Bochum | Rex Bedachungs GmbH</title>
        <meta
          name="description"
          content="Flachdach & Gründach Bochum ✓ Dachbegrünung extensiv & intensiv ✓ Alle Abdichtungssysteme ✓ Kostenloses Aufmaß ✓ BAFA/KfW-Förderung – Rex Bedachungs GmbH Bochum."
        />
        <meta property="og:title" content="Flachdach & Gründach Bochum – Sanierung, Abdichtung & Dachbegrünung | Rex Bedachungs GmbH" />
        <meta
          property="og:description"
          content="Flachdach & Gründach Bochum ✓ Dachbegrünung extensiv & intensiv ✓ Alle Abdichtungssysteme ✓ Kostenloses Aufmaß ✓ BAFA/KfW-Förderung – Rex Bedachungs GmbH, Ihr Fachbetrieb im Ruhrgebiet."
        />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/flachdach-sanierung-bochum-rex-bedachung.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Flachdach & Gründach Bochum | Rex Bedachung" />
        <meta name="twitter:description" content="Flachdach & Gründach Bochum ✓ Dachbegrünung ✓ Alle Abdichtungssysteme ✓ BAFA/KfW-Förderung – Rex Bedachungs GmbH." />
        <meta name="twitter:image" content="https://www.rex-bedachung.de/images/flachdach-sanierung-bochum-rex-bedachung.webp" />
        <link rel="canonical" href="https://www.rex-bedachung.de/flachdach-bochum" />
        <script type="application/ld+json">{schemaJson}</script>
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
            Flachdach &amp; Gründach Bochum – Abdichtung, Sanierung &amp; Dachbegrünung vom Fachbetrieb
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-xl" data-testid="text-hero-subtitle">
            Ob Flachdach, Gründach oder Dachbegrünung – wir finden die optimale Lösung für Ihr Gebäude in Bochum
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Button
              size="lg"
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
            20+ Jahre Erfahrung &bull; Kostenloses Aufmaß &bull; Ruhrgebiet
          </p>
        </div>
      </section>

      {/* ── Einleitung ── */}
      <section className="py-16 px-4 bg-background" data-testid="section-einleitung">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg" data-testid="text-einleitung">
            Flachdächer erfordern besondere Expertise in der Abdichtung. Mit modernen Materialien und bewährten
            Verfahren sorgen wir für eine zuverlässige, langlebige Dachabdichtung. Ob Bitumen, Kunststoff oder EPDM –
            wir beraten Sie kompetent und finden die optimale Lösung für Ihr Gebäude. Besonders gefragt in Bochum:
            Gründächer und Dachbegrünung – extensiv für pflegeleichte Begrünung oder intensiv für begehbare Dachgärten.
            Alles inklusive Wurzelschutz, Drainage und BAFA/KfW-Förderung.
          </p>
        </div>
      </section>

      {/* ── Leistungs-Sektion ── */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-leistungen">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground" data-testid="heading-leistungen">
            Unsere Flachdach-Leistungen in Bochum
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <Card
                key={s.testId}
                data-testid={s.testId}
                className={s.highlight ? "border-primary ring-1 ring-primary" : ""}
              >
                <CardHeader className="flex flex-row items-start gap-4 flex-wrap pb-2">
                  <div className="shrink-0 mt-1">{s.icon}</div>
                  <div className="flex flex-col gap-1 flex-1">
                    <CardTitle className="text-lg leading-snug">{s.title}</CardTitle>
                    {s.highlight && (
                      <Badge className="self-start" data-testid="badge-besonders-gefragt">
                        Besonders gefragt
                      </Badge>
                    )}
                  </div>
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

      {/* ── Abdichtungssysteme ── */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-systeme">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground" data-testid="heading-systeme">
            Alle Abdichtungssysteme aus einer Hand
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto" data-testid="text-systeme">
            Wir arbeiten mit allen gängigen Systemen und empfehlen Ihnen die optimale Lösung für Ihr Gebäude und Budget.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {systems.map((s) => (
              <Card key={s.testId} data-testid={s.testId}>
                <CardHeader className="flex flex-col items-start gap-3 pb-2">
                  <div className="shrink-0">{s.icon}</div>
                  <CardTitle className="text-base leading-snug">{s.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gründach Bochum Sektion ── */}
      <section className="py-16 px-4 bg-background" data-testid="section-gruendach">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground" data-testid="heading-gruendach">
            Gründach Bochum – Dachbegrünung vom Fachbetrieb
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto" data-testid="text-gruendach-intro">
            Ein Gründach ist mehr als Optik – es ist eine Investition in Energieeffizienz, Langlebigkeit und
            Nachhaltigkeit. Rex Bedachungs GmbH realisiert Gründächer in Bochum und dem gesamten Ruhrgebiet –
            fachgerecht, termingerecht und mit vollständiger Förderberatung.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <Card data-testid="card-gruendach-extensiv">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Extensive Dachbegrünung</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Leicht, pflegeleicht, ideal für große Flächen. Typische Bepflanzung: Sedum, Gräser, Kräuter.
                  Aufbaugewicht: 60–150 kg/m².
                </p>
              </CardContent>
            </Card>
            <Card data-testid="card-gruendach-intensiv">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Intensive Dachbegrünung</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Begehbarer Dachgarten mit Sträuchern und Stauden. Höheres Aufbaugewicht, statische Prüfung
                  erforderlich. Wir übernehmen Planung und Ausführung komplett.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="flex items-start gap-4" data-testid="item-gruendach-benefit-0">
              <Thermometer className="w-8 h-8 text-primary shrink-0 mt-1" aria-hidden="true" />
              <div>
                <p className="font-semibold text-foreground text-sm">Verbessert Wärme- &amp; Schalldämmung</p>
                <p className="text-muted-foreground text-sm mt-1">Natürliche Isolationsschicht für mehr Effizienz</p>
              </div>
            </div>
            <div className="flex items-start gap-4" data-testid="item-gruendach-benefit-1">
              <Droplets className="w-8 h-8 text-primary shrink-0 mt-1" aria-hidden="true" />
              <div>
                <p className="font-semibold text-foreground text-sm">Reduziert Regenwasserableitung</p>
                <p className="text-muted-foreground text-sm mt-1">Entlastet die Kanalisation und spart Gebühren</p>
              </div>
            </div>
            <div className="flex items-start gap-4" data-testid="item-gruendach-benefit-2">
              <ShieldCheck className="w-8 h-8 text-primary shrink-0 mt-1" aria-hidden="true" />
              <div>
                <p className="font-semibold text-foreground text-sm">Verlängert Lebensdauer der Dachabdichtung um bis zu 30 Jahre</p>
                <p className="text-muted-foreground text-sm mt-1">Schutz vor UV-Strahlung und Temperaturschwankungen</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Förderungs-Sektion ── */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-foerderung">
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-md p-8 md:p-12 text-center"
            style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" }}
            data-testid="box-foerderung"
          >
            <AlertTriangle className="w-10 h-10 text-blue-300 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" data-testid="heading-foerderung">
              Bis zu 20% Förderung durch BAFA &amp; KfW
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4 max-w-2xl mx-auto" data-testid="text-foerderung">
              Flachdachsanierungen mit verbesserter Dämmung werden vom Staat großzügig gefördert. Wir beraten Sie
              kostenlos zu allen Fördermöglichkeiten und übernehmen auf Wunsch die komplette Antragstellung.
            </p>
            <p className="text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto" data-testid="text-foerderung-gruendach">
              Gründächer werden zusätzlich über das KfW-Programm 297/298 (Klimafreundlicher Neubau) sowie durch
              städtische Förderprogramme der Stadt Bochum bezuschusst. Wir informieren Sie kostenlos über alle
              aktuellen Möglichkeiten.
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
            Häufige Fragen zum Flachdach in Bochum
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

      {/* ── Regionale Abdeckung ── */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-region">
        <div className="max-w-4xl mx-auto text-center">
          <MapPin className="w-10 h-10 text-primary mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground" data-testid="heading-region">
            Gründach &amp; Flachdach Bochum – Ruhrgebiet weit tätig
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg" data-testid="text-region">
            Rex Bedachungs GmbH ist Ihr Fachbetrieb für Flachdach und Gründach in Bochum, Herne, Castrop-Rauxel,
            Witten, Hattingen, Wattenscheid und dem gesamten Ruhrgebiet. Ob Flachdachabdichtung, Dachsanierung
            oder Dachbegrünung – wir sind Ihr zuverlässiger Partner rund ums Dach.
          </p>
        </div>
      </section>

      {/* ── Abschluss-CTA ── */}
      <section className="py-16 px-4 bg-background" data-testid="section-cta">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground" data-testid="heading-cta">
            Interesse an Flachdach? Jetzt kostenlos Aufmaß vereinbaren!
          </h2>
          <p className="text-muted-foreground mb-8 text-base" data-testid="text-cta">
            Rufen Sie uns an oder schreiben Sie uns – wir kommen zu Ihnen, messen kostenlos auf und erstellen ein transparentes Angebot.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-cta-aufmass"
            >
              Kostenloses Aufmaß anfragen
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
