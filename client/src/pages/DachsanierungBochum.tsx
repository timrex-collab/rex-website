import { useState } from "react";
import { Helmet } from "react-helmet";
import OrganizationSchema from "@/components/OrganizationSchema";
import AuthorSchema from "@/components/AuthorSchema";
import Breadcrumb from "@/components/Breadcrumb";
import Picture from "@/components/Picture";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  AlertTriangle,
  Clock,
  Home,
  Wrench,
  Thermometer,
  Layers,
  Square,
  Eye,
  Flame,
  Bug,
  PlusCircle,
  ArrowRight,
  ClipboardCheck,
  FileText,
  Hourglass,
  HardHat,
  BadgeCheck,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const heroImage = "/images/dach-hintergrund-rex-bedachung.webp";
const heroImageFallback = "/images/dach-hintergrund-rex-bedachung.jpg";

const warnsignale = [
  {
    icon: <Clock className="w-7 h-7 text-amber-500" />,
    title: "Alter der Eindeckung über 30 Jahre",
    text: "Tondachziegel und Betondachsteine haben eine Lebensdauer von 40–60 Jahren, bei exponierten Lagen im Ruhrgebiet oft weniger.",
    testId: "card-alter",
  },
  {
    icon: <AlertTriangle className="w-7 h-7 text-amber-500" />,
    title: "Wiederkehrende Undichtigkeiten",
    text: "Wenn Reparaturen sich häufen und die gleichen Stellen immer wieder Probleme machen, ist die Substanz erschöpft.",
    testId: "card-undicht",
  },
  {
    icon: <Thermometer className="w-7 h-7 text-amber-500" />,
    title: "Fehlende oder unzureichende Dämmung",
    text: "Häuser aus den 1950er bis 1980er Jahren in Bochum haben häufig keine oder nur minimale Dachdämmung.",
    testId: "card-daemmung-fehlt",
  },
  {
    icon: <Flame className="w-7 h-7 text-amber-500" />,
    title: "Energiekosten spürbar hoch",
    text: "Über ein ungedämmtes Dach gehen bis zu 30% der Heizenergie verloren.",
    testId: "card-energie",
  },
  {
    icon: <Bug className="w-7 h-7 text-amber-500" />,
    title: "Sichtbare Schäden am Dachstuhl",
    text: "Durchfeuchtung, Schimmel oder Holzschädlinge deuten auf strukturelle Probleme hin.",
    testId: "card-schaeden",
  },
  {
    icon: <PlusCircle className="w-7 h-7 text-amber-500" />,
    title: "Geplanter Dachgeschossausbau",
    text: "Wer Wohnraum unterm Dach schaffen will, kombiniert das sinnvoll mit einer energetischen Sanierung.",
    testId: "card-ausbau",
  },
];

const leistungen = [
  {
    icon: <Home className="w-8 h-8 text-primary" />,
    title: "Steildachsanierung",
    text: "Neueindeckung mit Tondachziegeln, Betondachsteinen oder Schiefer. Rückbau der alten Eindeckung, Lattung, Konterlattung und Unterspannbahn erneuern.",
    link: "/steildach-bochum",
    testId: "card-steildach",
  },
  {
    icon: <Thermometer className="w-8 h-8 text-primary" />,
    title: "Dachdämmung",
    text: "Aufsparrendämmung (höchste Qualität, U-Wert ~0,13), Zwischensparrendämmung oder Kombination mit Untersparrendämmung. BEG-Förder-U-Wert: 0,14 W/(m²·K).",
    link: "/aufsparrendaemmung-bochum",
    testId: "card-daemmung",
  },
  {
    icon: <Layers className="w-8 h-8 text-primary" />,
    title: "Flachdachsanierung",
    text: "Abdichtung mit Bitumen oder PVC, Gefälledämmung, Entwässerung erneuern.",
    link: "/flachdach-bochum",
    testId: "card-flachdach",
  },
  {
    icon: <Square className="w-8 h-8 text-primary" />,
    title: "Dachfenster",
    text: "Austausch oder Neueinbau von VELUX und Roto Dachfenstern. Dreifachverglasung (Uw \u2264 1,0) für BAFA-Förderfähigkeit.",
    link: "/dachfenster-bochum",
    testId: "card-dachfenster",
  },
  {
    icon: <Home className="w-8 h-8 text-primary" />,
    title: "Gauben und Dachaufbauten",
    text: "Gaubendämmung (U \u2264 0,20), Gaubenfenster, Blechverkleidung erneuern.",
    link: "/dachgaube-bochum",
    testId: "card-gauben",
  },
  {
    icon: <Wrench className="w-8 h-8 text-primary" />,
    title: "Klempnerarbeiten",
    text: "Dachrinnen, Fallrohre, Blechanschlüsse an Schornstein, Gauben und Wand komplett erneuern.",
    link: "/bauklempnerei-bochum",
    testId: "card-klempner",
  },
];

const ablaufSchritte = [
  {
    icon: <Eye className="w-7 h-7 text-primary" />,
    title: "Erstberatung und Dachinspektion",
    text: "Rex Bedachungs GmbH kommt kostenlos zu Ihnen nach Bochum. Bestandsaufnahme: Dachzustand, Dämmung, Eindeckung, Entwässerung, Dachfenster. Fotodokumentation aller Mängel und Sanierungspotenziale.",
  },
  {
    icon: <ClipboardCheck className="w-7 h-7 text-primary" />,
    title: "Energieberater einbinden",
    text: "Für die BAFA-Förderung ist ein Energieeffizienz-Experte (EEE) Pflicht. Rex Bedachung koordiniert die Zusammenarbeit mit lokalen Energieberatern in Bochum und die Erstellung des individuellen Sanierungsfahrplans (iSFP). Die Kosten für den EEE werden zu 50% gefördert.",
  },
  {
    icon: <FileText className="w-7 h-7 text-primary" />,
    title: "Angebot und Förderantrag",
    text: "Rex erstellt ein BEG-konformes Angebot mit klar getrennter Aufstellung förderfähiger und nicht förderfähiger Leistungen. Der EEE erstellt die Technische Projektbeschreibung (TPB). Wichtigste Regel: Erst Antrag stellen, dann Auftrag erteilen – sonst verfällt der Förderanspruch.",
  },
  {
    icon: <Hourglass className="w-7 h-7 text-primary" />,
    title: "BAFA-Bewilligung abwarten",
    text: "Nach Antragstellung vergehen 6–8 Wochen bis zum Zuwendungsbescheid. In dieser Zeit dürfen keine Aufträge erteilt und keine Anzahlungen geleistet werden. Der Bewilligungszeitraum beträgt 36 Monate.",
  },
  {
    icon: <HardHat className="w-7 h-7 text-primary" />,
    title: "Ausführung der Sanierung",
    text: "Gerüststellung, Rückbau, Dämmung, Neueindeckung, Dachfenster, Klempnerarbeiten, Entwässerung – alles aus einer Hand. Typische Bauzeit bei einem Einfamilienhaus: 2–4 Wochen.",
  },
  {
    icon: <BadgeCheck className="w-7 h-7 text-primary" />,
    title: "Abnahme und Fördergeld",
    text: "Gemeinsame Abnahme mit dem Eigentümer. Der EEE erstellt den Technischen Projektnachweis (TPN). Nach Einreichung des Verwendungsnachweises überweist das BAFA den Zuschuss direkt auf das Konto des Eigentümers – in der Regel innerhalb von 4–8 Wochen.",
  },
];

const preisfaktoren = [
  { title: "Dachfläche", text: "Die Quadratmeterzahl bestimmt Material- und Arbeitsaufwand. Ein typisches EFH in Bochum hat 100–150 m² Dachfläche." },
  { title: "Dachtyp", text: "Steildach und Flachdach haben unterschiedliche Konstruktionen, Materialien und Aufwände." },
  { title: "Zustand Dachstuhl", text: "Ist der Dachstuhl gesund, kann direkt saniert werden. Feuchteschäden oder Schädlingsbefall erfordern Vorarbeiten." },
  { title: "Dämmstandard", text: "Aufsparrendämmung ist aufwändiger aber hochwertiger als Zwischensparrendämmung. Der Ziel-U-Wert beeinflusst die Dämmstoffdicke und damit den Preis." },
  { title: "Eindeckungsmaterial", text: "Tondachziegel, Betondachsteine oder Schiefer haben unterschiedliche Materialpreise und Verlegeaufwände." },
  { title: "Dachfenster und Gauben", text: "Anzahl, Größe und Modell der Dachfenster sowie Gaubenarbeiten sind eigenständige Kostenpositionen." },
  { title: "Gerüst und Logistik", text: "Gerüststellung, Standzeit, Entsorgung Altmaterial, Baustelleneinrichtung." },
];

const faqItems = [
  {
    question: "Was kostet eine Dachsanierung in Bochum?",
    answer: "Eine energetische Dachsanierung in Bochum kostet je nach Dachtyp, Fläche, Dämmung und Eindeckung zwischen 150 und 350 \u20AC pro m² Dachfläche. Bei einem typischen Einfamilienhaus mit 120 m² Dachfläche liegt die Investition zwischen 18.000 und 42.000 \u20AC brutto. Mit iSFP-Bonus sind bis zu 12.000 \u20AC BAFA-Zuschuss möglich.",
  },
  {
    question: "Wie lange dauert eine Dachsanierung?",
    answer: "Die reine Bauzeit bei einem Einfamilienhaus in Bochum beträgt 2–4 Wochen. Dazu kommen 6–8 Wochen für den BAFA-Bewilligungsprozess. Von der Erstberatung bis zur Auszahlung des Zuschusses vergehen insgesamt 4–8 Monate.",
  },
  {
    question: "Wird eine Dachsanierung staatlich gefördert?",
    answer: "Ja. Über BAFA (BEG EM) erhalten Sie 15–20% Zuschuss auf alle förderfähigen Kosten. Mit individuellem Sanierungsfahrplan (iSFP) steigt der Förderhöchstbetrag auf 60.000 \u20AC pro Wohneinheit. Zusätzlich ist der KfW-Ergänzungskredit 358/359 bis 120.000 \u20AC kombinierbar.",
    link: "/foerderung",
    linkText: "Alle Förderprogramme im Detail",
  },
  {
    question: "Wann lohnt sich eine Dachsanierung statt einer Reparatur?",
    answer: "Eine Sanierung lohnt sich, wenn die Eindeckung über 25–30 Jahre alt ist, wiederkehrende Schäden auftreten, mehrere Bauteile betroffen sind oder die Dämmung fehlt. Bei einem lokalen Einzelschaden an einem intakten Dach ist eine Reparatur wirtschaftlicher.",
    link: "/dachreparatur-bochum",
    linkText: "Mehr zur Dachreparatur",
  },
  {
    question: "Muss die Neueindeckung bei einer geförderten Sanierung selbst bezahlt werden?",
    answer: "Nein. Die Neueindeckung gilt als Umfeldmaßnahme und wird vollständig mitgefördert, wenn sie im Zusammenhang mit einer energetischen Dämmmaßnahme steht. Bei Aufsparrendämmung ist die Neueindeckung zwingend notwendig und damit automatisch förderfähig.",
  },
  {
    question: "Welchen U-Wert muss die Dämmung für die Förderung erreichen?",
    answer: "Die BEG EM verlangt einen U-Wert von maximal 0,14 W/(m²·K) für Steildächer und Flachdächer – deutlich strenger als die GEG-Anforderung (0,24 bzw. 0,20). Für Gauben gilt U \u2264 0,20. Wer nur auf GEG-Niveau dämmt, verliert den gesamten Förderanspruch.",
    link: "/aufsparrendaemmung-bochum",
    linkText: "Mehr zur Aufsparrendämmung",
  },
  {
    question: "Kann Rex Bedachung auch nur eine Dachseite sanieren?",
    answer: "Ja. Auch Teilsanierungen sind technisch und fördertechnisch möglich, solange die BEG-Mindestanforderungen am sanierten Bauteil eingehalten werden. Rex Bedachungs GmbH berät vor Ort, ob Teil- oder Komplettsanierung wirtschaftlicher ist.",
  },
  {
    question: "Gilt die Solarpflicht NRW bei einer Dachsanierung?",
    answer: "Seit 01.01.2026 gilt in NRW bei grundlegender Dacherneuerung ab 50 m² die Solardachpflicht: Mindestens 30% der geeigneten Dachfläche müssen mit Photovoltaik belegt werden. Rex Bedachungs GmbH berücksichtigt diese Pflicht in der Projektplanung und kalkuliert die PV-Anforderung in das Sanierungsangebot ein.",
    link: "/solarpflicht",
    linkText: "Mehr zur Solarpflicht NRW",
  },
];

export default function DachsanierungBochum() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Dachsanierung Bochum – Komplettsanierung vom Meisterbetrieb | Rex Bedachungs GmbH</title>
        <meta name="description" content="Dachsanierung in Bochum: Rex Bedachungs GmbH saniert Steildächer, Flachdächer und Dachfenster – energetisch, förderfähig, seit 1984. Kostenlose Beratung: +49 234 583100." />
        <link rel="canonical" href="https://www.rex-bedachung.de/dachsanierung-bochum" />
        <meta property="og:title" content="Dachsanierung Bochum – Komplettsanierung vom Meisterbetrieb" />
        <meta property="og:description" content="Dachsanierung in Bochum: Steildach, Flachdach, Dämmung, Dachfenster – alles aus einer Hand. Bis zu 20% BAFA-Förderung. Rex Bedachungs GmbH." />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/dach-hintergrund-rex-bedachung.webp" />
        <meta property="og:site_name" content="Rex Bedachungs GmbH" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dachsanierung Bochum – Rex Bedachungs GmbH" />
        <meta name="twitter:description" content="Komplettsanierung Steildach & Flachdach in Bochum. Seit 1984. Bis zu 20% BAFA-Förderung. Kostenlose Beratung." />
        <meta name="twitter:image" content="https://www.rex-bedachung.de/images/dach-hintergrund-rex-bedachung.webp" />

        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://www.rex-bedachung.de/" },
            { "@type": "ListItem", "position": 2, "name": "Dachsanierung Bochum", "item": "https://www.rex-bedachung.de/dachsanierung-bochum" }
          ]
        })}</script>

        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Dachsanierung",
          "provider": {
            "@type": "RoofingContractor",
            "name": "Rex Bedachungs GmbH",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Paulinenstraße 22",
              "addressLocality": "Bochum",
              "postalCode": "44799",
              "addressCountry": "DE"
            },
            "telephone": "+49234583100",
            "url": "https://www.rex-bedachung.de"
          },
          "areaServed": {
            "@type": "City",
            "name": "Bochum"
          },
          "description": "Energetische Dachsanierung in Bochum: Steildach, Flachdach, Dämmung, Dachfenster – Komplettsanierung vom Meisterbetrieb Rex Bedachungs GmbH. Bis zu 20% BAFA-Förderung.",
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "EUR",
            "lowPrice": "150",
            "highPrice": "350",
            "unitText": "pro m² Dachfläche"
          }
        })}</script>

        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Dachsanierung Bochum – Komplettsanierung vom Meisterbetrieb",
          "author": { "@id": "https://www.rex-bedachung.de/#author" },
          "publisher": { "@id": "https://www.rex-bedachung.de/#organization" },
          "datePublished": "2026-04-11",
          "dateModified": "2026-04-11",
          "mainEntityOfPage": "https://www.rex-bedachung.de/dachsanierung-bochum"
        })}</script>

        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "Ablauf einer Dachsanierung in Bochum",
          "description": "So läuft eine energetische Dachsanierung bei Rex Bedachungs GmbH in Bochum ab – von der Erstberatung bis zur Abnahme.",
          "totalTime": "P21D",
          "estimatedCost": {
            "@type": "MonetaryAmount",
            "currency": "EUR",
            "value": "15000-50000"
          },
          "step": [
            { "@type": "HowToStep", "position": 1, "name": "Erstberatung und Dachinspektion", "text": "Rex Bedachungs GmbH kommt kostenlos zu Ihnen nach Bochum. Bestandsaufnahme: Dachzustand, Dämmung, Eindeckung, Entwässerung, Dachfenster. Fotodokumentation aller Mängel." },
            { "@type": "HowToStep", "position": 2, "name": "Energieberater einbinden", "text": "Für BAFA-Förderung ist ein Energieeffizienz-Experte (EEE) Pflicht. Wir koordinieren die Zusammenarbeit und die Erstellung des iSFP." },
            { "@type": "HowToStep", "position": 3, "name": "Angebot und Förderantrag", "text": "Rex erstellt ein BEG-konformes Angebot mit getrennter Aufstellung förderfähiger und nicht förderfähiger Leistungen. Der EEE erstellt die Technische Projektbeschreibung. Wichtig: Erst Antrag, dann Auftrag." },
            { "@type": "HowToStep", "position": 4, "name": "BAFA-Bewilligung abwarten", "text": "Nach Antragstellung vergehen 6–8 Wochen bis zum Zuwendungsbescheid. In dieser Zeit keine Aufträge erteilen oder Anzahlungen leisten." },
            { "@type": "HowToStep", "position": 5, "name": "Ausführung der Sanierung", "text": "Gerüststellung, Rückbau alte Eindeckung, Dämmung, Neueindeckung, Dachfenster, Klempnerarbeiten, Entwässerung. Dauer bei einem EFH: 2–4 Wochen." },
            { "@type": "HowToStep", "position": 6, "name": "Abnahme und Fördergeld", "text": "Gemeinsame Abnahme. Der EEE erstellt den Technischen Projektnachweis. Nach Einreichung des Verwendungsnachweises überweist das BAFA den Zuschuss – in der Regel 4–8 Wochen." }
          ]
        })}</script>

        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Was kostet eine Dachsanierung in Bochum?",
              "acceptedAnswer": { "@type": "Answer", "text": "Eine energetische Dachsanierung in Bochum kostet je nach Dachtyp, Fläche, Dämmung und Eindeckung zwischen 150 und 350 € pro m². Bei einem typischen Einfamilienhaus mit 120 m² Dachfläche liegt die Investition zwischen 18.000 und 42.000 € brutto. Mit iSFP-Bonus sind bis zu 12.000 € BAFA-Zuschuss möglich." }
            },
            {
              "@type": "Question",
              "name": "Wie lange dauert eine Dachsanierung?",
              "acceptedAnswer": { "@type": "Answer", "text": "Die reine Bauzeit bei einem Einfamilienhaus in Bochum beträgt 2–4 Wochen. Dazu kommen 6–8 Wochen für den BAFA-Bewilligungsprozess. Von der Erstberatung bis zur Auszahlung des Zuschusses vergehen insgesamt 4–8 Monate." }
            },
            {
              "@type": "Question",
              "name": "Wird eine Dachsanierung staatlich gefördert?",
              "acceptedAnswer": { "@type": "Answer", "text": "Ja. Über BAFA (BEG EM) erhalten Sie 15% Zuschuss auf alle förderfähigen Kosten – mit individuellem Sanierungsfahrplan (iSFP) steigt der Satz auf 20% bei einem Förderhöchstbetrag von 60.000 € pro Wohneinheit. Zusätzlich ist der KfW-Ergänzungskredit 358/359 bis 120.000 € kombinierbar." }
            },
            {
              "@type": "Question",
              "name": "Wann lohnt sich eine Dachsanierung statt einer Reparatur?",
              "acceptedAnswer": { "@type": "Answer", "text": "Eine Sanierung ist sinnvoll wenn: die Eindeckung über 25–30 Jahre alt ist, wiederkehrende Schäden auftreten, mehrere Bauteile betroffen sind, energetische Mängel bestehen oder die Dämmung fehlt bzw. unzureichend ist. Bei lokalen Einzelschäden an einem sonst intakten Dach ist eine Reparatur wirtschaftlicher." }
            },
            {
              "@type": "Question",
              "name": "Muss die Neueindeckung bei einer geförderten Dachsanierung mitbezahlt werden?",
              "acceptedAnswer": { "@type": "Answer", "text": "Nein – die Neueindeckung ist als Umfeldmaßnahme vollständig förderfähig, wenn sie im Zusammenhang mit einer energetischen Dämmmaßnahme steht. Bei Aufsparrendämmung ist die Neueindeckung zwingend notwendig und wird automatisch mitgefördert." }
            },
            {
              "@type": "Question",
              "name": "Welchen U-Wert muss die Dachdämmung für die Förderung erreichen?",
              "acceptedAnswer": { "@type": "Answer", "text": "Die BEG EM verlangt einen U-Wert von maximal 0,14 W/(m²·K) für Steildächer und Flachdächer. Das liegt deutlich unter der GEG-Anforderung (0,24 bzw. 0,20 W/(m²·K)). Für Gauben gilt U ≤ 0,20 W/(m²·K). Wer nur auf GEG-Niveau dämmt, verliert den gesamten Förderanspruch." }
            },
            {
              "@type": "Question",
              "name": "Kann Rex Bedachungs GmbH auch nur eine Dachseite sanieren?",
              "acceptedAnswer": { "@type": "Answer", "text": "Ja. Auch Teilsanierungen – zum Beispiel nur die Wetterseite – sind technisch und fördertechnisch möglich, solange die BEG-Mindestanforderungen am sanierten Bauteil eingehalten werden. Rex Bedachungs GmbH berät vor Ort, ob eine Teil- oder Komplettsanierung wirtschaftlicher ist." }
            },
            {
              "@type": "Question",
              "name": "Gilt die Solarpflicht NRW bei einer Dachsanierung?",
              "acceptedAnswer": { "@type": "Answer", "text": "Ja. Seit 01.01.2026 gilt in NRW bei grundlegender Dacherneuerung ab 50 m² Dachfläche die Solardachpflicht: Mindestens 30% der geeigneten Dachfläche müssen mit Photovoltaik belegt werden. Rex Bedachungs GmbH berücksichtigt diese Pflicht in der Projektplanung." }
            }
          ]
        })}</script>
      </Helmet>
      <OrganizationSchema />
      <AuthorSchema />
      <Breadcrumb items={[
        { label: "Startseite", href: "/" },
        { label: "Dachsanierung Bochum" }
      ]} />

      {/* Hero */}
      <section className="relative text-white py-24 px-4 overflow-hidden" data-testid="section-hero">
        <Picture
          src={heroImage}
          fallback={heroImageFallback}
          alt="Dachsanierung Bochum – Rex Bedachungs GmbH Komplettsanierung"
          className="absolute inset-0 w-full h-full object-cover"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30" aria-hidden="true" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6 max-w-3xl" data-testid="heading-hero">
            Dachsanierung Bochum – Komplettsanierung vom Meisterbetrieb
          </h1>
          <p className="text-base md:text-lg text-slate-200 mb-4 max-w-3xl leading-relaxed" data-testid="text-hero-intro">
            Rex Bedachungs GmbH führt energetische Dachsanierungen in Bochum und dem Ruhrgebiet durch – Steildach, Flachdach, Dämmung und Dachfenster aus einer Hand. Als Dachdecker-Meisterbetrieb mit über 40 Jahren Erfahrung saniert Rex Bedachung jährlich Dutzende Dächer im Bochumer Stadtgebiet: von der Aufsparrendämmung mit Neueindeckung bis zur Komplettsanierung mit Dachfenstern und Klempnerarbeiten.
          </p>
          <p className="text-base md:text-lg text-slate-200 mb-8 max-w-3xl leading-relaxed" data-testid="text-hero-foerderung">
            Eine energetische Dachsanierung wird 2026 über BAFA (BEG EM) mit bis zu 20% Zuschuss gefördert – bei einem Förderhöchstbetrag von 60.000 € pro Wohneinheit mit individuellem Sanierungsfahrplan. Rex Bedachungs GmbH berät kostenlos vor Ort und koordiniert den gesamten Förderprozess.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Button asChild size="lg" className="pulse-ring cta-pulse" data-testid="button-hero-beratung">
              <a href="/kontakt">Kostenlose Beratung anfragen</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="pulse-ring cta-pulse bg-white/10 border-white/40 text-white" data-testid="button-hero-anrufen">
              <a href="tel:+49234583100" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Anrufen: +49 234 583100
              </a>
            </Button>
          </div>
          <p className="text-sm text-slate-300 font-medium" data-testid="text-trust-badge">Meisterbetrieb seit 1984 · Bochum &amp; Ruhrgebiet · Kostenlose Beratung</p>
        </div>
      </section>

      {/* Wann ist eine Dachsanierung nötig? */}
      <section className="py-16 px-4 bg-background" data-testid="section-wann-noetig">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground" data-testid="heading-wann-noetig">
            Wann ist eine Dachsanierung nötig?
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-3xl mx-auto leading-relaxed" data-testid="text-wann-noetig-intro">
            Ein Dach in Bochum ist durchschnittlich 30 bis 50 Jahre alt, bevor eine Komplettsanierung wirtschaftlich sinnvoll wird. Rex Bedachungs GmbH empfiehlt eine Sanierung, wenn mehrere der folgenden Anzeichen zusammenkommen:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {warnsignale.map((w) => (
              <Card key={w.testId} data-testid={w.testId}>
                <CardHeader className="flex flex-row items-start gap-4 flex-wrap pb-2">
                  <div className="shrink-0 mt-1">{w.icon}</div>
                  <CardTitle className="text-base leading-snug">{w.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{w.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reparatur oder Sanierung? */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-reparatur-sanierung">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground" data-testid="heading-reparatur-sanierung">
            Reparatur oder Sanierung?
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-3xl mx-auto leading-relaxed" data-testid="text-reparatur-intro">
            Nicht jeder Dachschaden erfordert eine Komplettsanierung. Rex Bedachungs GmbH berät in Bochum ehrlich, welche Maßnahme wirtschaftlich sinnvoll ist.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <Card data-testid="card-reparatur">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-foreground">Reparatur sinnvoll wenn:</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "Schaden ist lokal begrenzt (einzelne Ziegel, ein Blechanschluss)",
                    "Eindeckung ist jünger als 15 Jahre",
                    "Kein strukturelles Problem am Dachstuhl",
                    "Kein energetischer Nachholbedarf",
                    "Einzelne Undichtigkeit, die sich klar lokalisieren lässt",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-muted-foreground text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card data-testid="card-sanierung">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-foreground">Sanierung sinnvoll wenn:</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "Eindeckung älter als 25–30 Jahre",
                    "Wiederkehrende Schäden an verschiedenen Stellen",
                    "Mehrere Bauteile betroffen (Eindeckung + Dämmung + Fenster)",
                    "Energetische Mängel (fehlende Dämmung, hohe Heizkosten)",
                    "Geplanter Dachgeschossausbau oder Solarpflicht-Auslösung",
                    "Dachstuhl zeigt Feuchteschäden oder Schädlingsbefall",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-muted-foreground text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <p className="text-muted-foreground text-center mt-8 max-w-3xl mx-auto text-sm leading-relaxed" data-testid="text-reparatur-fazit">
            Rex Bedachungs GmbH prüft bei jedem Vor-Ort-Termin in Bochum beide Optionen und empfiehlt die wirtschaftlich bessere Lösung – wenn eine Reparatur reicht, sagen wir das.
          </p>
          <div className="text-center mt-4">
            <Button asChild variant="outline" data-testid="link-dachreparatur">
              <a href="/dachreparatur-bochum" className="inline-flex items-center gap-2">
                Mehr zur Dachreparatur
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Was gehört zu einer Dachsanierung? */}
      <section className="py-16 px-4 bg-background" data-testid="section-leistungen">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground" data-testid="heading-leistungen">
            Was gehört zu einer Dachsanierung?
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-3xl mx-auto leading-relaxed" data-testid="text-leistungen-intro">
            Rex Bedachungs GmbH bietet in Bochum die Dachsanierung als Komplettleistung an: alle Gewerke aus einer Hand, ein Ansprechpartner, ein Angebot.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {leistungen.map((l) => (
              <Card key={l.testId} data-testid={l.testId}>
                <CardHeader className="flex flex-row items-start gap-4 flex-wrap pb-2">
                  <div className="shrink-0 mt-1">{l.icon}</div>
                  <CardTitle className="text-base leading-snug">{l.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">{l.text}</p>
                  <a href={l.link} className="text-primary text-sm font-medium inline-flex items-center gap-1" data-testid={`link-${l.testId}`}>
                    Mehr erfahren <ArrowRight className="w-3 h-3" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ablauf */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-ablauf">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground" data-testid="heading-ablauf">
            So läuft eine Dachsanierung bei Rex Bedachung ab
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-3xl mx-auto leading-relaxed" data-testid="text-ablauf-intro">
            Rex Bedachungs GmbH wickelt Dachsanierungen in Bochum in sechs klar definierten Schritten ab – von der Erstberatung bis zur Auszahlung der Fördergelder.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ablaufSchritte.map((s, i) => (
              <Card key={i} data-testid={`card-ablauf-${i + 1}`}>
                <CardHeader className="flex flex-col items-start gap-3 pb-2">
                  <div className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    {s.icon}
                  </div>
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

      {/* Was kostet eine Dachsanierung? */}
      <section className="py-16 px-4 bg-background" data-testid="section-kosten">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground" data-testid="heading-kosten">
            Was kostet eine Dachsanierung in Bochum?
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-3xl mx-auto leading-relaxed" data-testid="text-kosten-intro">
            Rex Bedachungs GmbH nennt keine pauschalen Lockpreise. Der tatsächliche Preis hängt von mehreren Faktoren ab, die erst nach einer Vor-Ort-Prüfung in Bochum realistisch eingeschätzt werden können.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {preisfaktoren.map((p, i) => (
              <Card key={i} data-testid={`card-preisfaktor-${i}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{p.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md p-6" data-testid="box-orientierung">
            <p className="text-sm text-foreground leading-relaxed">
              <span className="font-semibold">Orientierung:</span> Energetische Dachsanierungen in Bochum bewegen sich typischerweise zwischen 150 und 350 € pro m² Dachfläche – je nach Umfang. Rex Bedachungs GmbH erstellt nach kostenlosem Aufmaß ein transparentes Angebot mit vollständiger Leistungsaufstellung.
            </p>
          </div>
        </div>
      </section>

      {/* Förderung */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-foerderung">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-foreground" data-testid="heading-foerderung">
            Welche Förderung ist bei einer Dachsanierung möglich?
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-3xl mx-auto leading-relaxed" data-testid="text-foerderung-intro">
            Eine energetische Dachsanierung wird 2026 über mehrere Programme gefördert. Rex Bedachungs GmbH berät in Bochum kostenlos zur passenden Förderstrategie und koordiniert den gesamten Antragsprozess.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card data-testid="card-bafa">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">BAFA-Zuschuss (BEG EM)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>15% Grundförderung auf alle förderfähigen Bruttokosten</p>
                  <p>+5% iSFP-Bonus = insgesamt 20%</p>
                  <p>Förderhöchstbetrag: 30.000 € ohne iSFP / 60.000 € mit iSFP pro Wohneinheit</p>
                  <p>Maximaler Zuschuss: 4.500 € bzw. 12.000 € pro Wohneinheit</p>
                  <p>Voraussetzung: Gebäude mindestens 5 Jahre alt, Einbindung eines EEE</p>
                </div>
              </CardContent>
            </Card>
            <Card data-testid="card-kfw">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">KfW-Ergänzungskredit (358/359)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Zinsgünstiges Darlehen bis 120.000 € pro Wohneinheit</p>
                  <p>Beantragung nach BAFA-Förderzusage</p>
                  <p>Bei Haushaltseinkommen ≤ 90.000 € (KfW 358 Plus) besonders günstige Konditionen</p>
                  <p>Kombinierbar mit BAFA-Zuschuss</p>
                </div>
              </CardContent>
            </Card>
            <Card data-testid="card-steuerbonus">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Steuerbonus §35c EStG</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>20% der Kosten als Steuerermäßigung über 3 Jahre (7%/7%/6%)</p>
                  <p>Maximal 40.000 € Steuerermäßigung auf bis zu 200.000 € Kosten</p>
                  <p>Kein Energieberater nötig – aber nicht mit BAFA kombinierbar für dieselbe Maßnahme</p>
                  <p>Voraussetzung: Selbstgenutztes Eigentum, Gebäude mindestens 10 Jahre alt</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-6 mb-6" data-testid="box-foerder-hinweis">
            <p className="text-sm text-foreground leading-relaxed">
              <span className="font-semibold">Wichtig:</span> Der Förderantrag muss vor der Auftragserteilung gestellt und genehmigt sein. Wer zu früh unterschreibt, verliert den gesamten Förderanspruch. Rex Bedachungs GmbH stellt sicher, dass die Reihenfolge stimmt.
            </p>
          </div>
          <div className="text-center">
            <Button asChild variant="outline" data-testid="link-foerderung">
              <a href="/foerderung" className="inline-flex items-center gap-2">
                Alle Förderprogramme im Detail
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Referenzprojekt */}
      <section className="py-14 px-4 bg-background" data-testid="section-referenz">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground" data-testid="heading-referenz">
            Referenzprojekt Dachsanierung Bochum
          </h2>
          <div className="border-l-[3px] border-primary bg-card p-6 rounded-r-md" data-testid="card-referenz">
            <span className="inline-block text-[11px] font-medium uppercase tracking-widest text-primary bg-primary/10 px-3 py-0.5 rounded mb-3">Projekt aus Bochum-Weitmar</span>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <span className="text-muted-foreground font-medium">Dachtyp</span>
              <span className="text-foreground">Steildach, Satteldach</span>
              <span className="text-muted-foreground font-medium">Ort</span>
              <span className="text-foreground">Bochum-Weitmar</span>
              <span className="text-muted-foreground font-medium">Problem</span>
              <span className="text-foreground">Alte Betondachsteine (Baujahr 1972), keine Dämmung, zwei undichte VELUX-Fenster, hohe Heizkosten</span>
              <span className="text-muted-foreground font-medium">Leistung</span>
              <span className="text-foreground">Komplettsanierung mit Aufsparrendämmung (18 cm PUR/PIR), Tondachziegel-Neueindeckung, 2 neue VELUX GGU Dachfenster mit Dreifachverglasung, Dachrinnen und Fallrohre erneuert</span>
              <span className="text-muted-foreground font-medium">Material</span>
              <span className="text-foreground">PUR/PIR Aufsparrendämmung, Tondachziegel anthrazit, VELUX GGU 0066 Dreifachverglasung</span>
              <span className="text-muted-foreground font-medium">Ergebnis</span>
              <span className="text-foreground">U-Wert 0,13 W/(m²·K) – deutlich unter BEG-Anforderung. Heizenergieeinsparung ca. 30%. BAFA-Zuschuss 20% mit iSFP.</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground" data-testid="heading-faq">
            Häufige Fragen zur Dachsanierung in Bochum
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
                  <div className="px-5 pb-4">
                    <p className="text-muted-foreground leading-relaxed text-sm" data-testid={`text-faq-answer-${i}`}>
                      {item.answer}
                    </p>
                    {item.link && (
                      <a href={item.link} className="text-primary text-sm font-medium inline-flex items-center gap-1 mt-2" data-testid={`link-faq-${i}`}>
                        {item.linkText} <ArrowRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Abschluss-CTA */}
      <section className="py-16 px-4 bg-background" data-testid="section-cta-final">
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-md p-8 md:p-12 text-center"
            style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" }}
            data-testid="box-cta-final"
          >
            <MapPin className="w-10 h-10 text-blue-300 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" data-testid="heading-cta-final">
              Dachsanierung in Bochum – Jetzt kostenlos beraten lassen
            </h2>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <Button asChild size="lg" className="pulse-ring cta-pulse bg-blue-400 text-white border-blue-400" data-testid="button-cta-beratung">
                <a href="/kontakt">Kostenlose Beratung anfragen</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/40 text-white" data-testid="button-cta-anrufen">
                <a href="tel:+49234583100" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Anrufen: +49 234 583100
                </a>
              </Button>
            </div>
            <p className="text-slate-300 text-sm" data-testid="text-cta-footer">
              Rex Bedachungs GmbH · Paulinenstraße 22, 44799 Bochum · Meisterbetrieb seit 1984
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
