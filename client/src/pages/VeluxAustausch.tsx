import { useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  Wind,
  Droplets,
  EyeOff,
  Thermometer,
  Settings,
  Calendar,
  Layers,
  Maximize,
  Zap,
  Clock,
  Shield,
  MapPin,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const heroImage = "/images/velux-dachfenster-einbau-bochum-fachbetrieb.webp";

const symptomCards = [
  {
    icon: <Wind className="w-8 h-8 text-primary" />,
    title: "Zugerscheinungen",
    text: "Kalte Luft dringt trotz geschlossenem Fenster ein – ein sicheres Zeichen für verschlissene Dichtungen oder verzogenen Rahmen.",
    testId: "card-symptom-zug",
  },
  {
    icon: <Droplets className="w-8 h-8 text-primary" />,
    title: "Undichte Anschlüsse",
    text: "Wasserflecken an der Laibung oder am Rahmen deuten auf defekte Eindeckrahmen oder schadhafte Abdichtung hin.",
    testId: "card-symptom-undicht",
  },
  {
    icon: <EyeOff className="w-8 h-8 text-primary" />,
    title: "Blindes oder beschädigtes Glas",
    text: "Beschlagenes Isolierglas, Risse oder Verfärbungen sind nicht reparierbar – ein Fenstertausch ist die einzige Lösung.",
    testId: "card-symptom-glas",
  },
  {
    icon: <Thermometer className="w-8 h-8 text-primary" />,
    title: "Veraltete Wärmedämmung",
    text: "Alte Velux Fenster erreichen moderne Uw-Werte nicht mehr. Ein Austausch senkt den Wärmeverlust um bis zu 30 %.",
    testId: "card-symptom-daemmung",
  },
  {
    icon: <Settings className="w-8 h-8 text-primary" />,
    title: "Schwergängige Bedienung",
    text: "Fenster lässt sich schwer öffnen oder schließt nicht mehr richtig – meist wirtschaftlicher austauschen als reparieren.",
    testId: "card-symptom-bedienung",
  },
  {
    icon: <Calendar className="w-8 h-8 text-primary" />,
    title: "Alter über 20 Jahre",
    text: "Ab 20–25 Jahren sind Ersatzteile oft nicht mehr lieferbar. Ein modernes Fenster spart langfristig Energie und Wartungskosten.",
    testId: "card-symptom-alter",
  },
];

const modelCards = [
  {
    icon: <Layers className="w-8 h-8 text-primary" />,
    title: "Velux GGL – Holzfenster klassisch",
    text: "Das meistgenutzte Velux Modell – Holzrahmen mit weißer Lackierung, ideal für Wohnräume mit normaler Luftfeuchtigkeit. Langlebig, gut dämmend, natürlich im Erscheinungsbild.",
    badge: "Bestseller",
    testId: "card-model-ggl",
  },
  {
    icon: <Droplets className="w-8 h-8 text-primary" />,
    title: "Velux GGU – Kunststoff für Feuchträume",
    text: "Kunststoffummantelung macht das GGU besonders widerstandsfähig gegen Feuchtigkeit – ideal für Bad, Küche oder Dachgeschoss-Nassbereiche. Pflegeleicht und langlebig.",
    badge: "Empfohlen für Bäder",
    testId: "card-model-ggu",
  },
  {
    icon: <Maximize className="w-8 h-8 text-primary" />,
    title: "Velux GPU – Klapp-Schwingfenster",
    text: "Das GPU öffnet als Klappfenster nach oben und bietet maximalen Ausblick und Bewegungsfreiheit. Ideal für niedrige Kniestöcke und Bereiche mit eingeschränktem Platz.",
    badge: "Mehr Ausblick",
    testId: "card-model-gpu",
  },
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Velux Integra – elektrisch oder solar",
    text: "Das Integra öffnet per Fernbedienung oder Smartphone – elektrisch oder solar betrieben. Ideal für schwer erreichbare Fenster und Smart-Home-Installationen.",
    badge: "Komfort & Smart Home",
    testId: "card-model-integra",
  },
];

const comparisonRows = [
  { label: "Material", ggl: "Holz", ggu: "Kunststoff", gpu: "Holz/Poly", integra: "Holz/Poly" },
  { label: "Öffnungsart", ggl: "Schwing", ggu: "Schwing", gpu: "Klapp", integra: "Schwing/Klapp" },
  { label: "Einsatzbereich", ggl: "Wohnraum", ggu: "Feuchtraum", gpu: "Niedrig KS", integra: "Überall" },
  { label: "Bedienung", ggl: "Manuell", ggu: "Manuell", gpu: "Manuell", integra: "Elektrisch" },
  { label: "Preisniveau", ggl: "●●○○", ggu: "●●○○", gpu: "●●●○", integra: "●●●●" },
];

const ablaufSteps = [
  { name: "Vor-Ort-Termin und Aufmaß", text: "Rex Bedachungs GmbH kommt kostenlos zu Ihnen – Bestandsaufnahme, Fenstertyp, Dachsituation, genaue Maße und Zugänglichkeit." },
  { name: "Modellauswahl und Beratung", text: "Gemeinsame Auswahl des passenden Velux Modells – abgestimmt auf Bedarf, Raum, Budget und technische Eignung." },
  { name: "Angebot und Terminplanung", text: "Transparentes Festpreisangebot mit vollständiger Leistungsaufstellung – kein versteckter Nachtragsaufwand." },
  { name: "Ausbau des alten Dachfensters", text: "Fachgerechter Rückbau, Schutzmaßnahmen für Wohnraum und Dachaufbau, Vorbereitung der Einbauöffnung." },
  { name: "Einbau des neuen Velux Fensters", text: "Montage, Eindeckrahmen, Dämmkragen, vollständige Abdichtung aller Anschlüsse gegen Wasser und Wärmebrücken." },
  { name: "Innenarbeiten und Anschlussdetails", text: "Innenfutter, Laibung und eventuelle Nacharbeiten – sauber und passgenau zum Bestand." },
  { name: "Funktionsprüfung und Abnahme", text: "Gemeinsame Abnahme: Öffnung, Schließung, Dichtheit, Optik – erst wenn alles stimmt, ist der Auftrag abgeschlossen." },
];

const faqItems = [
  {
    question: "Was kostet der Austausch eines Velux Dachfensters in Bochum?",
    answer: "Rex Bedachungs GmbH führt Velux Dachfenster-Austausch in Bochum ab ca. 1.800–2.400 € inkl. Einbau durch – je nach Modell, Größe und notwendigen Nebenarbeiten. Nach kostenlosem Aufmaß erhalten Sie ein verbindliches Festpreisangebot.",
  },
  {
    question: "Wie lange dauert der Austausch?",
    answer: "Ein Standard-Velux-Austausch dauert in der Regel einen Arbeitstag. Bei Zusatzarbeiten (Innenverkleidung, Integra-Elektrik) 1–2 weitere Tage.",
  },
  {
    question: "Kann ein altes Velux Fenster 1:1 ersetzt werden?",
    answer: "In vielen Fällen ja – besonders bei Velux Fenstern nach Baujahr 1980. Rex Bedachungs GmbH prüft beim Aufmaß ob ein 1:1-Austausch möglich ist oder Anpassungen am Eindeckrahmen oder Innenfutter nötig werden.",
  },
  {
    question: "Welches Modell ist besser – GGL, GGU oder GPU?",
    answer: "Das hängt vom Einsatzbereich ab: GGL für trockene Wohnräume, GGU für Feuchträume wie Bad oder Küche, GPU bei niedrigem Kniestock für mehr Ausblick. Rex Bedachungs GmbH berät Sie kostenlos vor Ort.",
  },
  {
    question: "Lohnt sich Austausch statt Reparatur?",
    answer: "Ab einem Fensteralter von 20+ Jahren und mehreren gleichzeitigen Defekten ist der Austausch meist wirtschaftlicher. Wir beraten Sie ehrlich – wenn Reparatur sinnvoller ist, sagen wir das.",
  },
  {
    question: "Muss die Innenverkleidung erneuert werden?",
    answer: "Nicht immer. Beim 1:1-Austausch auf gleiche Baugröße bleibt die Innenverkleidung meist erhalten. Bei Modellwechsel oder Größenanpassung sind Innenarbeiten nötig – das klären wir beim Aufmaß.",
  },
  {
    question: "Ist ein Austausch im bewohnten Dachgeschoss möglich?",
    answer: "Ja. Rex Bedachungs GmbH schützt Ihren Wohnraum während der Arbeiten vollständig mit Abdeckungen und Folie. In der Regel ist die Wohnung abends wieder vollständig nutzbar.",
  },
];

const howToSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Velux Dachfenster Austausch in Bochum – Ablauf von Aufmaß bis Abnahme",
  "description": "Rex Bedachungs GmbH erklärt den vollständigen Ablauf eines Velux Dachfenster-Austauschs in Bochum in 7 Schritten.",
  "totalTime": "PT8H",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "EUR",
    "value": "1800",
  },
  "step": [
    { "@type": "HowToStep", "position": 1, "name": "Vor-Ort-Termin und Aufmaß", "text": "Kostenlose Bestandsaufnahme vor Ort in Bochum – Fenstertyp, Dachsituation, genaue Maße und Zugänglichkeit." },
    { "@type": "HowToStep", "position": 2, "name": "Modellauswahl und Beratung", "text": "Gemeinsame Auswahl des passenden Velux Modells (GGL, GGU, GPU oder Integra)." },
    { "@type": "HowToStep", "position": 3, "name": "Angebot und Terminplanung", "text": "Transparentes Festpreisangebot mit vollständiger Leistungsaufstellung." },
    { "@type": "HowToStep", "position": 4, "name": "Ausbau des alten Dachfensters", "text": "Fachgerechter Rückbau mit Schutzmaßnahmen für Wohnraum und Dachaufbau." },
    { "@type": "HowToStep", "position": 5, "name": "Einbau des neuen Velux Fensters", "text": "Montage, Eindeckrahmen, Dämmkragen und vollständige Abdichtung aller Anschlüsse." },
    { "@type": "HowToStep", "position": 6, "name": "Innenarbeiten und Anschlussdetails", "text": "Innenfutter, Laibung und Nacharbeiten passgenau zum Bestand." },
    { "@type": "HowToStep", "position": 7, "name": "Funktionsprüfung und Abnahme", "text": "Gemeinsame Abnahme: Öffnung, Schließung, Dichtheit und optische Kontrolle." },
  ],
});

const faqSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Was kostet der Austausch eines Velux Dachfensters in Bochum?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Rex Bedachungs GmbH führt Velux Dachfenster-Austausch in Bochum ab ca. 1.800–2.400 € inkl. Einbau durch. Nach kostenlosem Aufmaß erhalten Sie ein verbindliches Festpreisangebot.",
      },
    },
    {
      "@type": "Question",
      "name": "Wie lange dauert ein Velux Dachfensteraustausch?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Ein Standard-Austausch dauert in der Regel einen Arbeitstag. Bei Zusatzarbeiten 1–2 weitere Tage.",
      },
    },
    {
      "@type": "Question",
      "name": "Welches Velux Modell ist das richtige für mein Dach?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "GGL für trockene Wohnräume, GGU für Feuchträume, GPU bei niedrigem Kniestock, Integra für elektrischen Komfort. Rex Bedachungs GmbH berät kostenlos vor Ort in Bochum.",
      },
    },
  ],
});

const serviceSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Velux Dachfenster Austausch Bochum",
  "provider": {
    "@type": "LocalBusiness",
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
  "description": "Velux Dachfenster Austausch in Bochum – GGL, GGU, GPU und Integra, ab 1.800 €, VELUX-zertifizierter Fachbetrieb, kostenlose Beratung und Festpreisangebot.",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "EUR",
    "price": "1800",
    "availability": "https://schema.org/InStock",
  },
});

export default function VeluxAustausch() {
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Velux Dachfenster Austausch Bochum | Rex Bedachungs GmbH</title>
        <meta
          name="description"
          content="Velux Dachfenster Austausch Bochum ✓ GGL, GGU, GPU & Integra ✓ Preise ab 1.800 € ✓ VELUX-zertifiziert ✓ Kostenlose Beratung – Rex Bedachungs GmbH Ruhrgebiet."
        />
        <link rel="canonical" href="https://www.rex-bedachung.de/velux-dachfenster-austausch-bochum" />
        <script type="application/ld+json">{howToSchema}</script>
        <script type="application/ld+json">{faqSchema}</script>
        <script type="application/ld+json">{serviceSchema}</script>
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
            Velux Dachfenster Austausch in Bochum – fachgerecht erneuern lassen
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-xl" data-testid="text-hero-subtitle">
            Austausch alter Velux Dachfenster in Bochum – inklusive Beratung, Aufmaß, Ausbau, Einbau und sauberer Abnahme
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Button
              size="lg"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-hero-beratung"
            >
              Beratung anfragen
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
            VELUX-zertifiziert &bull; Bochum &amp; Ruhrgebiet &bull; Preise ab 1.800 &euro;
          </p>
        </div>
      </section>

      {/* ── Einleitungstext ── */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-einleitung">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg" data-testid="text-einleitung">
            Rex Bedachungs GmbH ist zertifizierter Velux-Fachbetrieb in Bochum und tauscht Velux Dachfenster aller Modelle fachgerecht aus – im Bestand, ohne unnötige Nebenarbeiten, mit transparenter Kostenaufstellung vor Beginn. Ob GGL, GGU, GPU oder Integra: Wir beraten Sie kostenlos zum passenden Modell für Ihr Dach und Ihren Bedarf.
          </p>
        </div>
      </section>

      {/* ── Wann lohnt sich ein Austausch ── */}
      <section className="py-16 px-4 bg-background" data-testid="section-symptome">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground" data-testid="heading-symptome">
            Wann sich ein Velux Dachfenster Austausch lohnt
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-3xl mx-auto" data-testid="text-symptome-intro">
            Viele Dachfenster in Bochumer Bestandsgebäuden sind 20–30 Jahre alt. Ab diesem Alter lohnt sich der Austausch meist mehr als eine Reparatur – energetisch und wirtschaftlich.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {symptomCards.map((s) => (
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

      {/* ── Modellvergleich ── */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-modelle">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground" data-testid="heading-modelle">
            Velux Modelle im Vergleich – GGL, GGU, GPU und Integra
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-3xl mx-auto" data-testid="text-modelle-intro">
            Rex Bedachungs GmbH berät Sie in Bochum zu allen aktuellen Velux Modellen und empfiehlt das passende Fenster für Ihre Dachsituation und Ihren Bedarf.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {modelCards.map((m) => (
              <Card key={m.testId} data-testid={m.testId}>
                <CardHeader className="flex flex-row items-start gap-4 flex-wrap pb-2">
                  <div className="shrink-0 mt-1">{m.icon}</div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg leading-snug">{m.title}</CardTitle>
                    <Badge variant="secondary" className="mt-2" data-testid={`badge-${m.testId}`}>{m.badge}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{m.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Vergleichstabelle */}
          <div className="overflow-x-auto" data-testid="table-modellvergleich">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Merkmal</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">GGL</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">GGU</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">GPU</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Integra</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0" data-testid={`row-vergleich-${i}`}>
                    <td className="py-3 px-4 font-medium text-foreground">{row.label}</td>
                    <td className="py-3 px-4 text-muted-foreground">{row.ggl}</td>
                    <td className="py-3 px-4 text-muted-foreground">{row.ggu}</td>
                    <td className="py-3 px-4 text-muted-foreground">{row.gpu}</td>
                    <td className="py-3 px-4 text-muted-foreground">{row.integra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Preise ── */}
      <section className="py-16 px-4 bg-background" data-testid="section-preise">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground" data-testid="heading-preise">
            Was kostet ein Velux Dachfenster Austausch in Bochum?
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-3xl mx-auto" data-testid="text-preise-intro">
            Rex Bedachungs GmbH nennt realistische Preisrahmen – kein Festpreis ohne Aufmaß, aber echte Orientierung für Ihre Planung.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Standard */}
            <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20" data-testid="card-preis-standard">
              <CardHeader>
                <CardTitle className="text-lg">Standard-Austausch</CardTitle>
                <p className="text-2xl font-bold text-foreground mt-2" data-testid="text-preis-standard">ab 1.800 – 2.400 &euro;</p>
                <p className="text-sm text-muted-foreground">inkl. Einbau</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Velux GGL oder GGU</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />1:1 Austausch im Bestand</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Eindeckrahmen erneuern</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Dichtung und Anschlüsse</li>
                </ul>
              </CardContent>
            </Card>

            {/* Anpassung – hervorgehoben */}
            <Card className="border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary" data-testid="card-preis-anpassung">
              <CardHeader>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg">Austausch mit Anpassung</CardTitle>
                  <Badge data-testid="badge-haeufigste">Häufigste Variante</Badge>
                </div>
                <p className="text-2xl font-bold text-foreground mt-2" data-testid="text-preis-anpassung">ab 2.400 – 3.200 &euro;</p>
                <p className="text-sm text-muted-foreground">inkl. Einbau und Innenarbeiten</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Alle Modelle inkl. GPU</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Anpassung Innenverkleidung</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Eindeckrahmen + Dämmkragen</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Laibung neu verputzt/verkleidet</li>
                </ul>
              </CardContent>
            </Card>

            {/* Premium */}
            <Card className="border-blue-800 dark:border-blue-700 bg-blue-900/10 dark:bg-blue-900/30" data-testid="card-preis-premium">
              <CardHeader>
                <CardTitle className="text-lg">Premium / Integra</CardTitle>
                <p className="text-2xl font-bold text-foreground mt-2" data-testid="text-preis-premium">ab 3.200 – 4.500 &euro;</p>
                <p className="text-sm text-muted-foreground">inkl. Einbau und Elektroinstallation</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Velux Integra elektrisch/solar</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Verkabelung und Steuerung</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Smart-Home-Integration möglich</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Komplette Innenarbeiten</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Hinweis-Box */}
          <div className="rounded-md border border-border p-6 bg-muted/40" data-testid="box-preishinweis">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Hinweis:</span> Alle Preise sind Orientierungsrahmen für den Großraum Bochum und das Ruhrgebiet. Der genaue Preis hängt ab von Fenstertyp, Größe, Dachzugang und notwendigen Nebenarbeiten. Rex Bedachungs GmbH erstellt Ihnen nach kostenlosem Aufmaß ein verbindliches Festpreisangebot.
            </p>
          </div>
        </div>
      </section>

      {/* ── Ablauf ── */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-ablauf">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground" data-testid="heading-ablauf">
            So läuft der Velux Dachfenster Austausch ab – von Aufmaß bis Abnahme
          </h2>
          <div className="space-y-6">
            {ablaufSteps.map((step, i) => (
              <div key={i} className="flex gap-4" data-testid={`step-ablauf-${i}`}>
                <div className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <div className="pt-1">
                  <h3 className="font-semibold text-foreground mb-1">{step.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dauer ── */}
      <section className="py-16 px-4 bg-background" data-testid="section-dauer">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground" data-testid="heading-dauer">
            Wie lange dauert ein Velux Dachfensteraustausch?
          </h2>
          <div className="rounded-md border border-border p-8 bg-muted/40 flex gap-6 items-start" data-testid="box-dauer">
            <Clock className="w-10 h-10 text-primary shrink-0 mt-1" aria-hidden="true" />
            <p className="text-muted-foreground leading-relaxed">
              Ein Standard-Austausch dauert in der Regel einen Arbeitstag – von Ausbau bis Abnahme. Bei Zusatzarbeiten wie Innenverkleidung oder Elektroinstallation (Integra) können 1–2 weitere Tage anfallen. Rex Bedachungs GmbH plant termingerecht und informiert Sie vorab über den genauen Ablauf.
            </p>
          </div>
        </div>
      </section>

      {/* ── Austausch vs. Reparatur ── */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-vergleich">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground" data-testid="heading-vergleich">
            Velux Dachfenster austauschen oder reparieren?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Reparatur */}
            <Card data-testid="card-reparatur-sinnvoll">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-primary" />
                  Reparatur sinnvoll wenn:
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Fenster unter 15 Jahre alt</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Einzelner Defekt (Griff, Dichtung, Bediengestänge)</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Glas intakt, Rahmen in Ordnung</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Ersatzteile noch lieferbar</li>
                </ul>
              </CardContent>
            </Card>

            {/* Austausch */}
            <Card data-testid="card-austausch-sinnvoll">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Austausch sinnvoll wenn:
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Fenster über 20 Jahre alt</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Mehrere Defekte gleichzeitig</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Blindes Glas oder gerissener Rahmen</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Hohe Energieverluste messbar</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Ersatzteile nicht mehr lieferbar</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <p className="text-sm text-muted-foreground text-center" data-testid="text-vergleich-hinweis">
            Rex Bedachungs GmbH berät Sie ehrlich – wenn eine Reparatur wirtschaftlich sinnvoller ist, sagen wir das.
          </p>
        </div>
      </section>

      {/* ── Warum Rex ── */}
      <section className="py-16 px-4 bg-background" data-testid="section-warum-rex">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground" data-testid="heading-warum-rex">
            Warum Rex Bedachungs GmbH als Velux-Fachbetrieb in Bochum
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="flex items-start gap-3" data-testid="item-usp-0">
              <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-foreground mb-1">VELUX-zertifizierter Fachbetrieb</p>
                <p className="text-sm text-muted-foreground leading-relaxed">Rex Bedachungs GmbH ist offiziell zertifizierter Velux-Partner – mit direktem Zugriff auf alle aktuellen Modelle, Zubehör und Ersatzteile.</p>
              </div>
            </div>
            <div className="flex items-start gap-3" data-testid="item-usp-1">
              <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-foreground mb-1">Kostenlose Beratung vor Ort</p>
                <p className="text-sm text-muted-foreground leading-relaxed">Wir kommen zu Ihnen nach Bochum oder ins gesamte Ruhrgebiet – Aufmaß, Modellberatung und Angebot sind kostenlos und unverbindlich.</p>
              </div>
            </div>
            <div className="flex items-start gap-3" data-testid="item-usp-2">
              <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-foreground mb-1">Transparente Festpreise</p>
                <p className="text-sm text-muted-foreground leading-relaxed">Kein Nachtragsaufwand: Das Angebot von Rex Bedachungs GmbH enthält alle Leistungen mit Festpreisgarantie.</p>
              </div>
            </div>
            <div className="flex items-start gap-3" data-testid="item-usp-3">
              <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-foreground mb-1">Sauber und termingerecht</p>
                <p className="text-sm text-muted-foreground leading-relaxed">Schutzmaßnahmen für Ihren Wohnraum, pünktliche Fertigstellung und gemeinsame Abnahme nach jedem Auftrag.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground" data-testid="heading-faq">
            Häufige Fragen zum Velux Dachfenster Austausch
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
      <section className="py-16 px-4 bg-background" data-testid="section-regionen">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground" data-testid="heading-regionen">
            Velux Dachfenster Austausch im gesamten Ruhrgebiet
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg flex items-center justify-center gap-2 flex-wrap" data-testid="text-regionen">
            <MapPin className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
            Rex Bedachungs GmbH tauscht Velux Dachfenster in Bochum, Herne, Castrop-Rauxel, Witten, Hattingen, Wattenscheid, Altenbochum, Ehrenfeld, Langendreer und dem gesamten Ruhrgebiet aus – termingerecht, zuverlässig und zum Festpreis.
          </p>
        </div>
      </section>

      {/* ── Abschluss-CTA ── */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-cta">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground" data-testid="heading-cta">
            Jetzt Velux Dachfenster Austausch in Bochum anfragen
          </h2>
          <p className="text-muted-foreground mb-8 text-base" data-testid="text-cta">
            Kostenloser Vor-Ort-Termin – wir melden uns innerhalb von 24 Stunden.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-cta-beratung"
            >
              Beratung anfragen
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
