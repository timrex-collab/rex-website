import { useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import OrganizationSchema from "@/components/OrganizationSchema";
import Breadcrumb from "@/components/Breadcrumb";
import Picture from "@/components/Picture";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  AlertTriangle,
  Home,
  Wrench,
  Thermometer,
  Eye,
  Droplets,
  TrendingUp,
  Building,
  ScrollText,
  SunMedium,
  Lightbulb,
} from "lucide-react";

const heroImage = "/images/dach-hintergrund-rex-bedachung.webp";

const fiveFaktoren = [
  {
    icon: <Home className="w-7 h-7 text-primary" />,
    title: "1. Alter des Dachs",
    text: "Tondachziegel halten typischerweise 40 bis 60 Jahre, Betondachsteine 30 bis 50. Ein Dach im Ruhrgebiet, das in den 1970er oder 1980er Jahren errichtet wurde, nähert sich dem Ende seiner technischen Lebensdauer. Das bedeutet nicht, dass es sofort ersetzt werden muss — aber jede Reparatur an einer alten Eindeckung ist wirtschaftlich kritisch zu prüfen.",
  },
  {
    icon: <Wrench className="w-7 h-7 text-primary" />,
    title: "2. Wiederkehrende Schäden",
    text: "Ein einzelner gerissener Ziegel ist eine Reparatur. Drei undichte Stellen pro Jahr, sich lösende Dachpappen, abrutschende Dachsteine — das ist ein Sanierungsfall. Wer mehrfach repariert hat und immer wieder neue Schäden findet, zahlt zweimal: einmal für die Punktreparaturen, einmal später für die Sanierung, die ohnehin kommt.",
  },
  {
    icon: <Thermometer className="w-7 h-7 text-primary" />,
    title: "3. Energieverbrauch und Dämmstandard",
    text: "Über ein ungedämmtes Dach gehen bis zu 30 Prozent der gesamten Heizenergie verloren (Quelle: FiW München / ZVDH). Wer im Winter über kalte Kniestöcke klagt, im Sommer ein überhitztes Dachgeschoss hat oder sieht, dass auf der Dachfläche der Schnee schneller schmilzt als beim Nachbarn, hat ein Dämmproblem.",
  },
  {
    icon: <Eye className="w-7 h-7 text-primary" />,
    title: "4. Optik, Substanz und Immobilienwert",
    text: "Ein in die Jahre gekommenes Dach wirkt sich nicht nur auf den Eindruck des Hauses aus, sondern auch auf seinen Verkehrswert. Bei jeder Immobilienbewertung ist der Dachzustand ein gewichtiger Faktor. Moos, dunkle Verfärbungen, lose oder gewellte Eindeckung sind Warnsignale, die für Kaufinteressenten klar lesbar sind.",
  },
  {
    icon: <Droplets className="w-7 h-7 text-primary" />,
    title: "5. Feuchtigkeit am Dachstuhl",
    text: "Das wichtigste, oft unterschätzte Kriterium. Sobald Feuchtigkeit das Holz erreicht — sichtbar an dunklen Flecken, modrigem Geruch im Spitzboden, sandigem Bohrmehl unter Sparren — wird Eile geboten. Holz, das einmal durchnässt war, ist nicht zuverlässig sanierbar; tragende Sparren müssen ersetzt werden.",
  },
];

const matrixRows = [
  { kriterium: "Dachalter", reparatur: "unter 25 Jahre", sanierung: "über 30 Jahre" },
  { kriterium: "Schadensumfang", reparatur: "punktuell, eine Stelle", sanierung: "mehrere Stellen, wiederkehrend" },
  { kriterium: "Dämmstandard", reparatur: "vorhanden, GEG-konform", sanierung: "keine oder unzureichend" },
  { kriterium: "Heizkosten", reparatur: "konstant", sanierung: "steigen jährlich" },
  { kriterium: "Dachstuhl", reparatur: "trocken, intakt", sanierung: "Feuchtigkeit, Holzschäden" },
  { kriterium: "Optik", reparatur: "gleichmäßig", sanierung: "Moos, Verfärbungen, lose Ziegel" },
  { kriterium: "Förderfähigkeit", reparatur: "meist nein (zu klein)", sanierung: "ja, BEG bis 20 %" },
];

const wirtschaftlichkeitFaktoren = [
  "Dachfläche und Dachform — komplexe Geometrien (Gauben, Walme, Verschnitte) erhöhen den Aufwand",
  "Dämmstandard und gewünschtes Dämmziel — GEG-Mindestmaß oder darüber hinaus",
  "Zustand des Dachstuhls und der Anschlüsse — versteckte Schäden treiben Kosten",
  "Bestehende Entwässerung und Bauklempnerei — oft sinnvoll mitzuerneuern",
  "Gerüstaufwand und Zugänglichkeit",
  "Förderfähigkeit und gewählter Förderpfad",
];

const foerderungBlocks = [
  {
    icon: <TrendingUp className="w-7 h-7 text-primary" />,
    title: "BEG-Zuschuss für die Gebäudehülle",
    text: "Die Bundesförderung effiziente Gebäude (BEG EM) bezuschusst Maßnahmen an der Dachhülle mit 15 Prozent der förderfähigen Kosten. Voraussetzungen: Antragstellung vor Beginn der Maßnahme, technische Mindestanforderungen an die Dämmung, Ausführung durch Fachbetrieb.",
  },
  {
    icon: <ScrollText className="w-7 h-7 text-primary" />,
    title: "iSFP-Bonus",
    text: "Der individuelle Sanierungsfahrplan, erstellt von einem zugelassenen Energieeffizienz-Experten, erhöht den BEG-Zuschuss um 5 Prozentpunkte und verbessert die förderfähige Obergrenze pro Wohneinheit. Für Eigentümer, die mehrere Sanierungsschritte planen, ist der iSFP nahezu immer wirtschaftlich vorteilhaft.",
  },
  {
    icon: <Building className="w-7 h-7 text-primary" />,
    title: "Fachplanung und Baubegleitung",
    text: "Werden separat von der eigentlichen Maßnahme bezuschusst — typisch zur Hälfte der Kosten. Damit wird qualitätssichernde Begleitung durch einen Energieeffizienz-Experten leichter zugänglich.",
  },
];

const wartenBlocks = [
  {
    icon: <AlertTriangle className="w-7 h-7 text-primary" />,
    title: "Schadensprogression",
    text: "Kleine Lecks bleiben selten klein. Eine undichte Stelle, die heute eine Reparatur kostet, durchnässt im nächsten Winter Dämmung und Holz — und wird zur Sanierung. Bei sichtbaren Schäden ist proaktives Handeln immer günstiger als reaktives.",
  },
  {
    icon: <ScrollText className="w-7 h-7 text-primary" />,
    title: "GEG-Nachrüstpflichten bei Eigentümerwechsel",
    text: "Das Gebäudeenergiegesetz (GEG) verpflichtet bei Eigentümerwechsel zur Nachrüstung der obersten Geschossdecke beziehungsweise des Dachs auf Mindestdämmstandard. Die Frist beträgt zwei Jahre nach Eigentümerübergang. Wer früher saniert, vermeidet Termindruck und kann förderoptimal planen.",
  },
  {
    icon: <SunMedium className="w-7 h-7 text-primary" />,
    title: "NRW-Solardachpflicht seit 01.01.2026",
    text: "In Nordrhein-Westfalen gilt seit Anfang 2026 bei grundlegender Erneuerung der Dachhaut von Wohngebäuden ab 50 m² eine Solaranlagenpflicht. Mindestens 30 Prozent der geeigneten Nettodachfläche müssen mit Photovoltaik belegt werden. Es gibt Ausnahmen bei statischer oder wirtschaftlicher Unzumutbarkeit. Wer eine Sanierung plant, sollte Photovoltaik von Anfang an mitdenken — sowohl statisch als auch in der Eindeckungsplanung.",
  },
];

const faqItems = [
  {
    question: "Ab welchem Dachalter lohnt sich eine Sanierung?",
    answer:
      "Bei Tondachziegeln ab etwa 40 Jahren, bei Betondachsteinen ab 30. Im Ruhrgebiet kommen Witterungseinflüsse dazu, die diese Spanne nach unten verschieben können.",
  },
  {
    question: "Reicht eine Reparatur oder muss saniert werden?",
    answer:
      "Bei einzelnen, klar lokalisierbaren Schäden reicht eine Reparatur. Wenn Schäden an mehreren Stellen auftreten oder wiederkehren, ist eine Sanierung wirtschaftlicher.",
  },
  {
    question: "Wie viel Heizenergie geht über ein ungedämmtes Dach verloren?",
    answer:
      "Bis zu 30 Prozent der gesamten Heizenergie eines Hauses (Quelle: FiW München / ZVDH).",
  },
  {
    question: "Was beeinflusst die Wirtschaftlichkeit einer Dachsanierung?",
    answer:
      "Entscheidend sind Dachfläche, Dachform, Dämmstandard, Zustand des Dachstuhls, Anschlüsse, Entwässerung, Gerüstaufwand und Förderfähigkeit. Eine belastbare Einschätzung entsteht erst nach Vor-Ort-Prüfung, weil Feuchtigkeit, Holzschäden, Gauben, Kamine und Dachfenster den Umfang stark verändern können.",
  },
  {
    question: "Wie viel Förderung gibt es 2026 für eine Dachsanierung?",
    answer:
      "Über die BEG EM bis zu 20 Prozent Zuschuss vom BAFA — 15 Prozent Grundförderung plus 5 Prozent iSFP-Bonus. Maximal 60.000 Euro förderfähige Kosten pro Wohneinheit und Kalenderjahr.",
  },
  {
    question: "Was ist der iSFP und warum ist er wichtig?",
    answer:
      "Der individuelle Sanierungsfahrplan wird von einem Energieeffizienz-Experten erstellt und zeigt sinnvolle Sanierungsschritte für das Gebäude. Bei förderfähigen Einzelmaßnahmen kann er den Zuschuss um 5 Prozentpunkte erhöhen und die förderfähige Obergrenze verbessern.",
  },
  {
    question: "Muss ich beim neuen Dach eine PV-Anlage einplanen?",
    answer:
      "In NRW gilt seit 01.01.2026 bei grundlegender Erneuerung der Dachhaut von Wohngebäuden mit mindestens 50 m² Dachfläche eine Solardachpflicht. Mindestens 30 Prozent der geeigneten Nettodachfläche müssen mit Photovoltaik belegt werden. Es gibt Ausnahmen, etwa bei statischer oder wirtschaftlicher Unzumutbarkeit. Photovoltaik sollte deshalb bei jeder grundlegenden Dachsanierung früh mitgedacht werden.",
  },
  {
    question: "Wann muss ich nach GEG dämmen?",
    answer:
      "Die oberste Geschossdecke zu unbeheizten Dachräumen muss bestimmte Mindestanforderungen erfüllen, wenn das Dach darüber nicht entsprechend gedämmt ist. Bei Ein- und Zweifamilienhäusern, in denen der Eigentümer bei Inkrafttreten 2002 selbst gewohnt hat, greift eine Ausnahme. Nach Eigentümerwechsel haben neue Eigentümer zwei Jahre Zeit, die Nachrüstung umzusetzen.",
  },
];

const articleSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Wann lohnt sich eine Dachsanierung?",
  "description": "Entscheidungshilfe zu Dachalter, Schäden, Dämmung, Förderung 2026 und Pflichten — vom Bochumer Meisterbetrieb.",
  "datePublished": "2026-05-08",
  "dateModified": "2026-05-08",
  "author": { "@id": "https://www.rex-bedachung.de/#author" },
  "publisher": { "@id": "https://www.rex-bedachung.de/#organization" },
  "image": "https://www.rex-bedachung.de/images/dach-hintergrund-rex-bedachung.webp",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.rex-bedachung.de/wann-lohnt-sich-dachsanierung",
  },
});

const breadcrumbSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://www.rex-bedachung.de/" },
    { "@type": "ListItem", "position": 2, "name": "Wann lohnt sich Dachsanierung", "item": "https://www.rex-bedachung.de/wann-lohnt-sich-dachsanierung" },
  ],
});

const faqSchema = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqItems.map((item) => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": { "@type": "Answer", "text": item.answer },
  })),
});

export default function WannLohntSichDachsanierung() {
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Wann lohnt sich eine Dachsanierung? | Rex Bochum</title>
        <meta
          name="description"
          content="Sanieren oder reparieren? Entscheidungshilfe zu Dachalter, Schäden, Dämmung, Förderung 2026 und Pflichten vom Meisterbetrieb aus Bochum."
        />
        <link rel="canonical" href="https://www.rex-bedachung.de/wann-lohnt-sich-dachsanierung" />
        <meta property="og:title" content="Wann lohnt sich eine Dachsanierung? | Rex Bochum" />
        <meta
          property="og:description"
          content="Sanieren oder reparieren? Entscheidungshilfe zu Dachalter, Schäden, Dämmung, Förderung 2026 und Pflichten vom Meisterbetrieb aus Bochum."
        />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/dach-hintergrund-rex-bedachung.webp" />
        <meta property="og:site_name" content="Rex Bedachungs GmbH" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wann lohnt sich eine Dachsanierung? | Rex Bochum" />
        <meta name="twitter:description" content="Sanieren oder reparieren? Entscheidungshilfe vom Bochumer Meisterbetrieb." />
        <meta name="twitter:image" content="https://www.rex-bedachung.de/images/dach-hintergrund-rex-bedachung.webp" />
        <script type="application/ld+json">{breadcrumbSchema}</script>
        <script type="application/ld+json">{articleSchema}</script>
        <script type="application/ld+json">{faqSchema}</script>
      </Helmet>
      <OrganizationSchema />
      <Breadcrumb items={[{ label: "Startseite", href: "/" }, { label: "Wann lohnt sich Dachsanierung" }]} />

      {/* Hero */}
      <section className="relative text-white py-24 px-4 overflow-hidden" data-testid="section-hero">
        <Picture
          src={heroImage}
          fallback={heroImage}
          alt="Dachsanierung Bochum – Entscheidungshilfe vom Meisterbetrieb"
          className="absolute inset-0 w-full h-full object-cover"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30" aria-hidden="true" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 max-w-3xl" data-testid="heading-hero">
            Wann lohnt sich eine Dachsanierung?
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-2xl" data-testid="text-hero-subtitle">
            Sanieren oder reparieren? Die Entscheidungshilfe vom Bochumer Meisterbetrieb — ehrlich, fachlich, ohne Verkaufsdruck.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Button
              size="lg"
              className="pulse-ring cta-pulse"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-hero-beratung"
            >
              Beratung zur Dachsanierung anfragen
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/40 text-white" data-testid="button-hero-anrufen">
              <a href="tel:+49234583100" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +49 234 583100
              </a>
            </Button>
          </div>
          <p className="text-sm text-slate-300 font-medium" data-testid="text-trust-badge">
            Meisterbetrieb • 40+ Jahre Erfahrung • Ruhrgebiet
          </p>
        </div>
      </section>

      {/* Direktantwort */}
      <section className="py-12 px-4 bg-background" data-testid="section-direktantwort">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-50 border-l-4 border-primary rounded-md p-6 md:p-8">
            <p className="text-base md:text-lg leading-relaxed text-foreground" data-testid="text-direktantwort">
              Eine Dachsanierung lohnt sich, wenn mindestens einer dieser Faktoren zutrifft: Das Dach ist über 30 Jahre alt
              und energetisch schwach, Schäden treten wiederkehrend auf, Feuchtigkeit erreicht Dämmung oder Dachstuhl, oder
              gesetzliche Pflichten werden relevant. Im Ruhrgebiet betrifft das viele Häuser aus den 1960er bis 1980er Jahren.
              2026 wird die Entscheidung zusätzlich durch BEG-Förderung, iSFP-Bonus und die NRW-Solardachpflicht bei
              vollständiger Erneuerung der Dachhaut beeinflusst. Wir prüfen Ihr Dach in Bochum vor Ort und sagen ehrlich, ob
              eine Sanierung strategisch sinnvoll ist — oder ob eine gezielte Reparatur genügt.
            </p>
          </div>
        </div>
      </section>

      {/* H2: Die 5 entscheidenden Faktoren */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-faktoren">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground" data-testid="heading-faktoren">
            Die 5 entscheidenden Faktoren
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            Welche Aspekte bei der Entscheidung zwischen Sanierung und Reparatur wirklich zählen.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {fiveFaktoren.map((f, i) => (
              <Card key={i} data-testid={`card-faktor-${i + 1}`}>
                <CardHeader className="flex flex-row items-start gap-3 pb-2">
                  <div className="shrink-0 mt-1">{f.icon}</div>
                  <h3 className="text-lg font-semibold leading-snug">{f.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8 max-w-3xl mx-auto">
            Mehr zur Komplettsanierung mit Dämmung und Eindeckung finden Sie auf unserer{" "}
            <a href="/dachsanierung-bochum" className="text-primary hover:underline">Hub-Seite zur Dachsanierung in Bochum</a>{" "}
            sowie zu spezifischen Steildach- und Flachdach-Themen unter{" "}
            <a href="/steildach-bochum" className="text-primary hover:underline">Steildach Bochum</a> und{" "}
            <a href="/flachdach-bochum" className="text-primary hover:underline">Flachdach Bochum</a>.
          </p>
        </div>
      </section>

      {/* H2: Entscheidungsmatrix */}
      <section className="py-16 px-4 bg-background" data-testid="section-matrix">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground" data-testid="heading-matrix">
            Entscheidungsmatrix: Reparatur oder Sanierung?
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            Trifft mindestens drei der rechten Kriterien zu, ist eine Sanierung in der Regel die wirtschaftlichere Entscheidung als wiederholte Reparaturen.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full bg-card border border-border rounded-md overflow-hidden">
              <thead className="bg-slate-100">
                <tr>
                  <th className="text-left p-4 font-semibold text-foreground">Kriterium</th>
                  <th className="text-left p-4 font-semibold text-foreground">Reparatur reicht</th>
                  <th className="text-left p-4 font-semibold text-foreground">Sanierung empfehlen</th>
                </tr>
              </thead>
              <tbody>
                {matrixRows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-slate-50"}>
                    <td className="p-4 font-medium text-foreground">{row.kriterium}</td>
                    <td className="p-4 text-muted-foreground">{row.reparatur}</td>
                    <td className="p-4 text-muted-foreground">{row.sanierung}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground text-center mt-8">
            Bei punktuellen Schäden ohne Dämmproblem reicht oft eine{" "}
            <a href="/dachreparatur-bochum" className="text-primary hover:underline">gezielte Dachreparatur</a> aus —
            wir sagen Ihnen vor Ort, was wirtschaftlich Sinn ergibt.
          </p>
        </div>
      </section>

      {/* H2: Wirtschaftlichkeit */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-wirtschaftlichkeit">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground" data-testid="heading-wirtschaftlichkeit">
            Wirtschaftlichkeit: Welche Faktoren kippen die Entscheidung?
          </h2>

          <div className="rounded-md p-6 md:p-8 bg-blue-50 border border-blue-100 mb-10" data-testid="card-foerderhebel">
            <h3 className="text-xl font-bold text-blue-900 mb-3">
              Förderhebel 2026: Wann die Sanierung wirtschaftlich attraktiver wird
            </h3>
            <p className="text-slate-700 leading-relaxed">
              Eine Dachsanierung mit Dämmung kann über die BEG EM förderfähig sein. Für Maßnahmen an der Gebäudehülle liegt der
              Basiszuschuss bei 15 Prozent. Mit individuellem Sanierungsfahrplan sind zusätzlich 5 Prozentpunkte möglich.
              Dadurch steigt auch die förderfähige Obergrenze pro Wohneinheit. Fachplanung und Baubegleitung werden separat
              betrachtet. Entscheidend sind Dämmstandard, technischer Zustand und Antragstellung vor Maßnahmenbeginn.
            </p>
          </div>

          <h3 className="text-lg md:text-xl font-semibold mb-4">Was die Wirtschaftlichkeit konkret beeinflusst</h3>
          <ul className="space-y-3 mb-6">
            {wirtschaftlichkeitFaktoren.map((item, i) => (
              <li key={i} className="flex items-start gap-3" data-testid={`item-wirtschaftlichkeit-${i}`}>
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground leading-relaxed">
            Eine belastbare Einschätzung entsteht erst nach Vor-Ort-Prüfung. Wir kalkulieren transparent und sagen ehrlich,
            was sich rechnet und was nicht.
          </p>
        </div>
      </section>

      {/* H2: Förderung 2026 */}
      <section className="py-16 px-4 bg-background" data-testid="section-foerderung">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground" data-testid="heading-foerderung">
            Förderung 2026 als strategischer Hebel
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            Drei Bausteine, die für Eigentümer den Unterschied machen.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {foerderungBlocks.map((block, i) => (
              <Card key={i} data-testid={`card-foerderung-${i}`}>
                <CardHeader className="flex flex-col items-start gap-3 pb-2">
                  <div className="shrink-0">{block.icon}</div>
                  <h3 className="text-base font-semibold leading-snug">{block.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{block.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div
            className="rounded-md p-8 md:p-10 flex flex-col md:flex-row items-center gap-6"
            style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" }}
            data-testid="box-foerderung-cta"
          >
            <Lightbulb className="w-10 h-10 text-blue-300 shrink-0" aria-hidden="true" />
            <div className="flex-1 text-center md:text-left">
              <p className="text-white font-semibold mb-1">Alle Förderprogramme im Überblick</p>
              <p className="text-slate-300 text-sm leading-relaxed">
                BEG EM, KfW, NRW.BANK und kommunale Programme — wir sortieren, was für Ihr Projekt passt, und übernehmen die
                Koordination mit dem Energieeffizienz-Experten.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-blue-400 text-white border-blue-400 shrink-0"
              data-testid="button-foerderung-mehr"
            >
              <a href="/foerderung">Mehr zur Förderung 2026</a>
            </Button>
          </div>
        </div>
      </section>

      {/* H2: Wann sich Warten nicht lohnt */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-warten">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground" data-testid="heading-warten">
            Wann sich Warten nicht lohnt
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            Drei Gründe, warum eine zeitnahe Entscheidung oft die wirtschaftlichere ist.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {wartenBlocks.map((block, i) => (
              <Card key={i} data-testid={`card-warten-${i}`}>
                <CardHeader className="flex flex-col items-start gap-3 pb-2">
                  <div className="shrink-0">{block.icon}</div>
                  <h3 className="text-base font-semibold leading-snug">{block.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{block.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* H2: FAQ */}
      <section className="py-16 px-4 bg-background" data-testid="section-faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground" data-testid="heading-faq">
            Häufige Fragen zur Dachsanierung
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
                <div className={`overflow-hidden transition-all duration-200 ${openFaq === i ? "max-h-96" : "max-h-0"}`}>
                  <p className="px-5 pb-4 text-muted-foreground leading-relaxed text-sm" data-testid={`text-faq-answer-${i}`}>
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-cta">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground" data-testid="heading-cta">
            Beratung zur Dachsanierung anfragen
          </h2>
          <p className="text-muted-foreground mb-8 text-base">
            Wir prüfen Ihr Dach vor Ort, analysieren Schäden und Substanz, und sagen ehrlich, ob eine Sanierung jetzt sinnvoll
            ist — oder ob eine gezielte Reparatur genügt.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              className="pulse-ring cta-pulse"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-cta-beratung"
            >
              Beratung zur Dachsanierung anfragen
            </Button>
            <Button asChild size="lg" variant="outline" data-testid="button-cta-anrufen">
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
