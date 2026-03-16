import { useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import {
  CheckCircle, ChevronDown, ChevronUp, Phone,
  Sun, Zap, Wind, Thermometer, Volume2, Shield,
  Smartphone, Wrench, MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const heroImage = "/images/velux-dachfenster-einbau-bochum-fachbetrieb.webp";

const vorteilCards = [
  {
    icon: <Sun className="w-8 h-8 text-primary" />,
    title: "Bis zu 94 % Hitzeschutz",
    text: "Der Außenrollladen stoppt Sonnenwärme vor dem Glas – bis zu 94 % Hitzeschutz, deutlich effektiver als jedes Innenrollo.",
    testId: "card-vorteil-hitze",
  },
  {
    icon: <Thermometer className="w-8 h-8 text-primary" />,
    title: "Kein Stromanschluss nötig",
    text: "Der SSL wird komplett solar betrieben – der integrierte Akku speichert genug Energie für zuverlässigen Betrieb auch bei Bewölkung und nachts.",
    testId: "card-vorteil-solar",
  },
  {
    icon: <Volume2 className="w-8 h-8 text-primary" />,
    title: "Schallschutz: Straßenlärm reduzieren",
    text: "Geschlossene Außenrollläden dämpfen Außengeräusche spürbar – ideal für Schlafzimmer an vielbefahrenen Straßen in Bochum.",
    testId: "card-vorteil-schall",
  },
  {
    icon: <Shield className="w-8 h-8 text-primary" />,
    title: "Einbruchschutz durch stabile Lamellen",
    text: "Die Aluminium-Lamellen des Velux Außenrollladens bieten zusätzlichen mechanischen Schutz gegen Einbruchversuche über das Dachfenster.",
    testId: "card-vorteil-einbruch",
  },
  {
    icon: <Smartphone className="w-8 h-8 text-primary" />,
    title: "Steuerung per VELUX App & Fernbedienung",
    text: "Bequem per Fernbedienung oder VELUX App steuern – auch von unterwegs. Zeitprogramme sorgen für automatische Beschattung.",
    testId: "card-vorteil-app",
  },
  {
    icon: <Wind className="w-8 h-8 text-primary" />,
    title: "Windsensor stoppt automatisch bei Sturm",
    text: "Der integrierte Windsensor fährt den Rollladen bei Sturm automatisch hoch – Schutz vor Beschädigung ohne manuellen Eingriff.",
    testId: "card-vorteil-wind",
  },
];

const comparisonRows = [
  { label: "Stromanschluss", ssl: "Nein (Solar)", sml: "Ja (220 V)" },
  { label: "Steuerung", ssl: "Fernbedienung / App", sml: "KUX 110 + Schalter" },
  { label: "Montage", ssl: "Von innen, ca. 2 Std.", sml: "Von innen + Elektriker" },
  { label: "Preis (Produkt)", ssl: "Ab ca. 536 \u20AC", sml: "Ab ca. 420 \u20AC + KUX 120 \u20AC" },
  { label: "Geeignet für", ssl: "Nachrüstung", sml: "Neubau / vorh. Anschluss" },
];

const ablaufSteps = [
  { name: "Kostenloses Aufmaß & Beratung vor Ort", text: "Rex Bedachungs GmbH kommt zu Ihnen – Fenstergröße, Typ und Einbausituation werden geprüft. Sie erhalten ein verbindliches Festpreisangebot." },
  { name: "Modell & Größe auswählen", text: "Gemeinsam wählen wir den passenden Rollladen – in den meisten Fällen empfehlen wir den SSL Solar für kabellose Nachrüstung." },
  { name: "Lieferung & Montage von innen", text: "Der SSL wird komplett von innen montiert – kein Gerüst nötig. Die Montage dauert ca. 2 Stunden pro Fenster." },
  { name: "Funktionstest & Einweisung", text: "Gemeinsamer Test aller Funktionen, Einrichtung der Fernbedienung und auf Wunsch der VELUX App – erst wenn alles läuft, ist der Auftrag abgeschlossen." },
];

const faqItems = [
  {
    question: "Was kostet ein Velux SSL Solar-Rollladen inkl. Montage in Bochum?",
    answer: "Der SSL kostet je nach Fenstergröße ab ca. 536 \u20AC (Produkt) zzgl. Montage durch Rex Bedachungs GmbH. Gesamtkosten inkl. Einbau ab ca. 700\u2013900 \u20AC. Nach kostenlosem Aufmaß vor Ort erhalten Sie ein verbindliches Festpreisangebot.",
  },
  {
    question: "Kann der SSL auf mein bestehendes Velux Fenster nachgerüstet werden?",
    answer: "In den meisten Fällen ja \u2013 der SSL ist speziell für die Nachrüstung entwickelt und benötigt keinen Stromanschluss. Für ältere Fenster vor Mitte 2000 wird das Montageset ZOZ 253 benötigt. Rex Bedachungs GmbH prüft das kostenlos beim Aufmaß.",
  },
  {
    question: "Funktioniert der SSL auch bei bewölktem Himmel und nachts?",
    answer: "Ja. Der integrierte Hochleistungsakku speichert genug Energie für zuverlässigen Betrieb bei Bewölkung und in der Nacht \u2013 auch im Ruhrgebiets-Herbst.",
  },
  {
    question: "Was ist der Unterschied zwischen SSL und SML?",
    answer: "Der SSL ist solar-betrieben und braucht keinen Stromanschluss. Der SML benötigt 220V und zusätzlich die Steuereinheit KUX 110 (ca. 120 \u20AC) \u2013 damit sind beide preislich ähnlich. Für Nachrüstungen empfehlen wir klar den SSL, da keine Elektrikerarbeiten nötig sind.",
  },
  {
    question: "Ist der Außenrollladen wirklich besser als ein innenliegendes Verdunkelungsrollo?",
    answer: "Ja, deutlich. Der Außenrollladen SSL erreicht bis zu 94 % Hitzeschutz, weil er die Wärme vor dem Glas stoppt. Ein Innenrollo lässt die Wärme erst durch das Glas und erreicht nur 20\u201340 % Wirkungsgrad.",
  },
];

const faqSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Was kostet ein Velux SSL Solar-Rollladen inkl. Montage in Bochum?",
      "acceptedAnswer": { "@type": "Answer", "text": "Der SSL kostet je nach Fenstergröße ab ca. 536 € (Produkt) zzgl. Montage durch Rex Bedachungs GmbH. Gesamtkosten inkl. Einbau ab ca. 700–900 €. Nach kostenlosem Aufmaß vor Ort erhalten Sie ein verbindliches Festpreisangebot." }
    },
    {
      "@type": "Question",
      "name": "Kann der SSL auf mein bestehendes Velux Fenster nachgerüstet werden?",
      "acceptedAnswer": { "@type": "Answer", "text": "In den meisten Fällen ja – der SSL ist speziell für die Nachrüstung entwickelt und benötigt keinen Stromanschluss. Für ältere Fenster vor Mitte 2000 wird das Montageset ZOZ 253 benötigt. Rex Bedachungs GmbH prüft das kostenlos beim Aufmaß." }
    },
    {
      "@type": "Question",
      "name": "Funktioniert der SSL auch bei bewölktem Himmel und nachts?",
      "acceptedAnswer": { "@type": "Answer", "text": "Ja. Der integrierte Hochleistungsakku speichert genug Energie für zuverlässigen Betrieb bei Bewölkung und in der Nacht – auch im Ruhrgebiets-Herbst." }
    },
    {
      "@type": "Question",
      "name": "Was ist der Unterschied zwischen SSL und SML?",
      "acceptedAnswer": { "@type": "Answer", "text": "Der SSL ist solar-betrieben und braucht keinen Stromanschluss. Der SML benötigt 220V und zusätzlich die Steuereinheit KUX 110 (ca. 120 €) – damit sind beide preislich ähnlich. Für Nachrüstungen empfehlen wir klar den SSL, da keine Elektrikerarbeiten nötig sind." }
    },
    {
      "@type": "Question",
      "name": "Ist der Außenrollladen wirklich besser als ein innenliegendes Verdunkelungsrollo?",
      "acceptedAnswer": { "@type": "Answer", "text": "Ja, deutlich. Der Außenrollladen SSL erreicht bis zu 94% Hitzeschutz, weil er die Wärme vor dem Glas stoppt. Ein Innenrollo lässt die Wärme erst durch das Glas und erreicht nur 20–40% Wirkungsgrad." }
    }
  ]
});

const serviceSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Velux Außenrollladen Montage Bochum",
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
  "description": "Montage und Nachrüstung von Velux Außenrollläden in Bochum – SSL Solar, SML Elektro, von innen montierbar, VELUX-Fachbetrieb.",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "EUR",
    "price": "700",
    "availability": "https://schema.org/InStock",
  },
});

const breadcrumbSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://www.rex-bedachung.de/" },
    { "@type": "ListItem", "position": 2, "name": "Dachfenster Bochum", "item": "https://www.rex-bedachung.de/dachfenster-bochum" },
    { "@type": "ListItem", "position": 3, "name": "Velux Außenrollladen Bochum", "item": "https://www.rex-bedachung.de/velux-dachfenster-rolllaeden-bochum" }
  ]
});

export default function VeluxRolllaeden() {
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Velux Außenrollladen Bochum – SSL Solar nachrüsten | Rex Bedachung</title>
        <meta
          name="description"
          content="Velux Außenrollladen Bochum ✓ SSL Solar kabellos nachrüsten ✓ Bis zu 94% Hitzeschutz ✓ Ab ca. 700 € ✓ VELUX-Fachbetrieb – Rex Bedachungs GmbH."
        />
        <meta property="og:title" content="Velux Außenrollladen Bochum – SSL Solar nachrüsten | Rex Bedachung" />
        <meta property="og:description" content="Velux Außenrollladen Bochum ✓ SSL Solar kabellos nachrüsten ✓ Bis zu 94% Hitzeschutz ✓ Ab ca. 700 € ✓ VELUX-Fachbetrieb – Rex Bedachungs GmbH." />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/velux-dachfenster-einbau-bochum-fachbetrieb.webp" />
        <meta property="og:site_name" content="Rex Bedachungs GmbH" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Velux Außenrollladen Bochum – SSL Solar nachrüsten | Rex Bedachung" />
        <meta name="twitter:description" content="Velux Außenrollladen Bochum ✓ SSL Solar kabellos nachrüsten ✓ Bis zu 94% Hitzeschutz ✓ Ab ca. 700 € ✓ VELUX-Fachbetrieb – Rex Bedachungs GmbH." />
        <meta name="twitter:image" content="https://www.rex-bedachung.de/images/velux-dachfenster-einbau-bochum-fachbetrieb.webp" />
        <link rel="canonical" href="https://www.rex-bedachung.de/velux-dachfenster-rolllaeden-bochum" />
        <script type="application/ld+json">{faqSchema}</script>
        <script type="application/ld+json">{serviceSchema}</script>
        <script type="application/ld+json">{breadcrumbSchema}</script>
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
            Velux Au&szlig;enrollladen Bochum – SSL Solar nachr&uuml;sten
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-xl" data-testid="text-hero-subtitle">
            Bis zu 94 % Hitzeschutz, kabellos solar betrieben, von innen in ca. 2 Std. montierbar – Ihr VELUX-Fachbetrieb in Bochum
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Button
              size="lg"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-hero-beratung"
            >
              Kostenlose Beratung
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
                Jetzt anrufen: 0234 583100
              </a>
            </Button>
          </div>
          <p className="text-sm text-slate-300 font-medium" data-testid="text-trust-badge">
            VELUX-Fachbetrieb &bull; Kostenloser Aufma&szlig;-Service &bull; Montage ab ca. 700 &euro;
          </p>
        </div>
      </section>

      {/* ── Einleitungstext ── */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-einleitung">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg" data-testid="text-einleitung">
            Im Sommer wird es unter dem Dach schnell unerträglich heiß – ein innenliegendes Rollo reicht oft nicht aus. Der Velux SSL Solar-Außenrollladen stoppt die Hitze bereits vor dem Glas und erreicht bis zu 94 % Hitzeschutz. Rex Bedachungs GmbH ist VELUX-Fachbetrieb in Bochum und rüstet den SSL kabellos nach – komplett von innen montiert, in ca. 2 Stunden pro Fenster, ab ca. 700 &euro; inkl. Einbau.
          </p>
        </div>
      </section>

      {/* ── Vorteile ── */}
      <section className="py-16 px-4 bg-background" data-testid="section-vorteile">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground" data-testid="heading-vorteile">
            Warum ein Velux Au&szlig;enrollladen?
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-3xl mx-auto" data-testid="text-vorteile-intro">
            Der Velux Außenrollladen bietet weit mehr als nur Sonnenschutz – von Hitzeschutz über Schallschutz bis zur smarten Steuerung per App.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {vorteilCards.map((v) => (
              <Card key={v.testId} data-testid={v.testId}>
                <CardHeader className="flex flex-row items-start gap-4 flex-wrap pb-2">
                  <div className="shrink-0 mt-1">{v.icon}</div>
                  <CardTitle className="text-lg leading-snug">{v.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{v.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── SSL vs SML Vergleich ── */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-vergleich">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground" data-testid="heading-vergleich">
            SSL Solar vs. SML Elektro – Welcher passt zu Ihnen?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card data-testid="card-ssl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sun className="w-5 h-5 text-primary" />
                  SSL Solar
                </CardTitle>
                <Badge className="mt-2" data-testid="badge-ssl">Empfohlen f&uuml;r Nachr&uuml;stung</Badge>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Kein Stromanschluss nötig</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Solar-Akku für Betrieb bei Nacht &amp; Wolken</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Montage komplett von innen</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Inkl. Fernbedienung &amp; App-Steuerung</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Keine Elektrikerarbeiten</li>
                </ul>
              </CardContent>
            </Card>

            <Card data-testid="card-sml">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  SML Elektro
                </CardTitle>
                <Badge variant="secondary" className="mt-2" data-testid="badge-sml">F&uuml;r Neubauten</Badge>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />220 V Stromanschluss erforderlich</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Steuereinheit KUX 110 nötig (ca. 120 &euro;)</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Montage von innen + Elektriker</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Günstigerer Produktpreis</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Ideal bei vorhandenem Stromanschluss</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="overflow-x-auto" data-testid="table-vergleich">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Merkmal</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">SSL Solar</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">SML Elektro</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-b-0" data-testid={`row-vergleich-${i}`}>
                    <td className="py-3 px-4 font-medium text-foreground">{row.label}</td>
                    <td className="py-3 px-4 text-muted-foreground">{row.ssl}</td>
                    <td className="py-3 px-4 text-muted-foreground">{row.sml}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-6" data-testid="text-vergleich-hinweis">
            Rex Bedachungs GmbH berät Sie kostenlos – wir empfehlen das Modell, das zu Ihrem Fenster und Ihrer Situation passt.
          </p>
        </div>
      </section>

      {/* ── Preise ── */}
      <section className="py-16 px-4 bg-background" data-testid="section-preise">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground" data-testid="heading-preise">
            Velux SSL Rollladen – Kosten in Bochum
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-3xl mx-auto" data-testid="text-preise-intro">
            Realistische Preisrahmen inkl. Montage durch Rex Bedachungs GmbH – nach kostenlosem Aufmaß erhalten Sie ein verbindliches Festpreisangebot.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20" data-testid="card-preis-standard">
              <CardHeader>
                <CardTitle className="text-lg">Kleine Fenster</CardTitle>
                <p className="text-2xl font-bold text-foreground mt-2" data-testid="text-preis-standard">ab 700 &euro;</p>
                <p className="text-sm text-muted-foreground">inkl. Montage</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Fenstergr&ouml;&szlig;e bis 78 &times; 98 cm</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />SSL Solar-Rollladen</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Inkl. Fernbedienung</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Montage von innen</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary" data-testid="card-preis-mittel">
              <CardHeader>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <CardTitle className="text-lg">Mittlere Fenster</CardTitle>
                  <Badge data-testid="badge-haeufigste">H&auml;ufigste Variante</Badge>
                </div>
                <p className="text-2xl font-bold text-foreground mt-2" data-testid="text-preis-mittel">ab 850 &euro;</p>
                <p className="text-sm text-muted-foreground">inkl. Montage</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Fenstergr&ouml;&szlig;e bis 94 &times; 118 cm</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />SSL Solar-Rollladen</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Inkl. Fernbedienung &amp; App</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Montage von innen</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-800 dark:border-blue-700 bg-blue-900/10 dark:bg-blue-900/30" data-testid="card-preis-premium">
              <CardHeader>
                <CardTitle className="text-lg">Gro&szlig;e / Sondergr&ouml;&szlig;en</CardTitle>
                <p className="text-2xl font-bold text-foreground mt-2" data-testid="text-preis-premium">ab 1.000 &euro;</p>
                <p className="text-sm text-muted-foreground">inkl. Montage</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />&Uuml;bergr&ouml;&szlig;en &amp; Sonderma&szlig;e</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />SSL Solar-Rollladen</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Inkl. Fernbedienung &amp; App</li>
                  <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />Ggf. Adapterset f&uuml;r &auml;ltere Fenster</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="rounded-md border border-border p-6 bg-muted/40" data-testid="box-preishinweis">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Hinweis:</strong> Alle Preise sind Richtwerte inkl. Montage. Nach kostenlosem Aufmaß vor Ort erhalten Sie ein verbindliches Festpreisangebot von Rex Bedachungs GmbH – ohne versteckte Zusatzkosten.
            </p>
          </div>
        </div>
      </section>

      {/* ── Ablauf ── */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-ablauf">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground" data-testid="heading-ablauf">
            Ablauf: SSL Nachr&uuml;stung in 4 Schritten
          </h2>
          <div className="space-y-6">
            {ablaufSteps.map((step, i) => (
              <div key={i} className="flex gap-4" data-testid={`step-ablauf-${i}`}>
                <div className="flex-shrink-0 w-10 h-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">{step.name}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
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
                <p className="font-semibold text-foreground mb-1">VELUX-Fachbetrieb</p>
                <p className="text-sm text-muted-foreground leading-relaxed">Rex Bedachungs GmbH ist VELUX-Fachbetrieb – mit direktem Zugriff auf alle aktuellen Modelle, Zubehör und Ersatzteile.</p>
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
                <p className="font-semibold text-foreground mb-1">Faire, transparente Preise</p>
                <p className="text-sm text-muted-foreground leading-relaxed">Kein Nachtragsaufwand: Das Angebot von Rex Bedachungs GmbH enthält alle Leistungen – transparent und verbindlich kalkuliert.</p>
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
            Häufige Fragen zum Velux Außenrollladen
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
            Velux Au&szlig;enrollladen Montage im gesamten Ruhrgebiet
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg flex items-center justify-center gap-2 flex-wrap" data-testid="text-regionen">
            <MapPin className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
            Rex Bedachungs GmbH montiert Velux Außenrollläden in Bochum, Herne, Castrop-Rauxel, Witten, Hattingen, Wattenscheid, Altenbochum, Ehrenfeld, Langendreer und dem gesamten Ruhrgebiet – termingerecht, zuverlässig und zu fairen Preisen.
          </p>
        </div>
      </section>

      {/* ── Abschluss-CTA ── */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-cta">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground" data-testid="heading-cta">
            Jetzt Velux Au&szlig;enrollladen in Bochum nachr&uuml;sten
          </h2>
          <p className="text-muted-foreground mb-8 text-base" data-testid="text-cta">
            Kostenloser Vor-Ort-Termin – wir melden uns zeitnah.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <Button
              size="lg"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-cta-beratung"
            >
              Jetzt Beratungsgespr&auml;ch vereinbaren
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              data-testid="button-cta-anrufen"
            >
              <a href="tel:0234583100" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                0234 583100 anrufen
              </a>
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => setLocation("/dachfenster-bochum")}
            data-testid="button-pillar-link"
          >
            Alle Dachfenster-Leistungen in Bochum &rarr;
          </Button>
        </div>
      </section>
    </>
  );
}
