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
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  },
  {
    icon: <Wrench className="w-8 h-8 text-primary" />,
    title: "Flachdach Sanierung & Abdichtung",
    text: "Undichtes Flachdach? Wir analysieren den Schaden, sanieren fachgerecht und sorgen für eine langlebige Abdichtung – egal ob kleiner Riss oder Komplettsanierung.",
    testId: "card-sanierung",
  },
  {
    icon: <Thermometer className="w-8 h-8 text-primary" />,
    title: "Energieeffiziente Flachdach Dämmung",
    text: "Eine professionelle Flachdachdämmung senkt Ihre Heizkosten spürbar und wird staatlich gefördert. Wir beraten Sie zu allen Möglichkeiten und übernehmen die komplette Umsetzung.",
    testId: "card-daemmung",
  },
  {
    icon: <Leaf className="w-8 h-8 text-primary" />,
    title: "Gründach & Dachterrassen Bochum",
    text: "Verwandeln Sie Ihr Flachdach in eine grüne Oase oder begehbare Terrasse – inklusive Wurzelschutzfolie, Drainageschicht und fachgerechter Abdichtung.",
    testId: "card-gruendach",
  },
  {
    icon: <ClipboardCheck className="w-8 h-8 text-primary" />,
    title: "Wartungsverträge für langfristige Sicherheit",
    text: "Regelmäßige Kontrolle verhindert teure Schäden. Wir prüfen Abdichtung, Entwässerung und Dämmung – und beheben kleine Mängel direkt vor Ort.",
    testId: "card-wartung",
  },
];

const vorteile = [
  "Moderne Abdichtungssysteme (Bitumen, Kunststoff, EPDM)",
  "Energieeffiziente Dämmung",
  "Gründach und Dachbegrünung",
  "Dachterrassen und Balkone",
  "Wartungsverträge für langfristige Sicherheit",
  "Kostenloses Aufmaß vor Ort",
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
});

export default function FlachdachBochum() {
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Flachdach Bochum – Sanierung, Abdichtung &amp; Neueindeckung | Rex Bedachungs GmbH</title>
        <meta
          name="description"
          content="Flachdach Bochum ✓ Alle Abdichtungssysteme ✓ Sanierung & Neueindeckung ✓ Kostenloses Aufmaß ✓ BAFA/KfW-Förderung – Rex Bedachungs GmbH, Ihr Fachbetrieb im Ruhrgebiet."
        />
        <meta property="og:title" content="Flachdach Bochum – Sanierung, Abdichtung & Neueindeckung | Rex Bedachungs GmbH" />
        <meta
          property="og:description"
          content="Flachdach Bochum – alle Abdichtungssysteme aus einer Hand. Sanierung, Neueindeckung, Dämmung & Gründach mit kostenlosem Aufmaß und Förderberatung."
        />
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
            Flachdach Bochum – Abdichtung, Sanierung &amp; Neueindeckung vom Fachbetrieb
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-xl" data-testid="text-hero-subtitle">
            Ob Bitumen, EPDM oder Flüssigkunststoff – wir finden die optimale Lösung für Ihr Gebäude
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
            wir beraten Sie kompetent und finden die optimale Lösung für Ihr Gebäude. Auf Wunsch realisieren wir auch
            Gründächer oder begehbare Dachterrassen – inklusive BAFA/KfW-Förderung.
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
              Bis zu 20% Förderung durch BAFA &amp; KfW
            </h2>
            <p className="text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto" data-testid="text-foerderung">
              Flachdachsanierungen mit verbesserter Dämmung werden vom Staat großzügig gefördert. Wir beraten Sie
              kostenlos zu allen Fördermöglichkeiten und übernehmen auf Wunsch die komplette Antragstellung.
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
      <section className="py-16 px-4 bg-muted/40" data-testid="section-faq">
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
