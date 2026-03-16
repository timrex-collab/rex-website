import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { useState } from "react";
import {
  Leaf, Droplets, Thermometer, Shield, Layers, Wrench,
  CheckCircle, Phone, ArrowRight, ChevronDown, AlertCircle, Home, Zap
} from "lucide-react";

const vorteile = [
  {
    Icon: Thermometer, color: "text-orange-500", bg: "bg-orange-50 border-orange-100",
    zahl: "bis 5 °C", einheit: "kühler im Dachgeschoss",
    title: "Kühlungseffekt im Sommer",
    text: "Gründächer kühlen durch Verdunstung und Wärmepufferung. In Bochumer Dachgeschosswohnungen sinkt die Temperatur in Hitzephasen um bis zu 5 °C — das reduziert Klimaanlagenkosten spürbar.",
  },
  {
    Icon: Droplets, color: "text-blue-500", bg: "bg-blue-50 border-blue-100",
    zahl: "bis 90 %", einheit: "Niederschlag gespeichert",
    title: "Regenwasserrückhalt",
    text: "Das Gründach speichert 40–90 % des anfallenden Regenwassers und entlastet die städtische Kanalisation in Bochum erheblich — besonders bei Starkregenereignissen.",
  },
  {
    Icon: Shield, color: "text-red-500", bg: "bg-red-50 border-red-100",
    zahl: "2× länger", einheit: "Lebensdauer der Abdichtung",
    title: "Abdichtungsschutz",
    text: "Die Begrünung schützt die Abdichtung vor UV-Strahlung und Temperaturschwankungen. Statt 20 Jahre hält eine geschützte Abdichtung 40+ Jahre.",
  },
  {
    Icon: Leaf, color: "text-green-600", bg: "bg-green-50 border-green-100",
    zahl: "200+", einheit: "Tier- und Pflanzenarten",
    title: "Biodiversität & Ökologie",
    text: "Selbst ein kleines Extensivdach bietet Lebensraum für Bienen, Wildbienen, Schmetterlinge und Vögel — ökologischer Trittstein im urbanen Biotopverbund Bochums.",
  },
  {
    Icon: Zap, color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-100",
    zahl: "10–15 %", einheit: "weniger Wärmeverlust",
    title: "Wärmedämmung im Winter",
    text: "Das feuchte Substrat wirkt als Wärmepuffer und reduziert den Wärmeverlust über das Dach im Winter. In Kombination mit einer gedämmten Flachdachkonstruktion entsteht ein hocheffizientes System.",
  },
  {
    Icon: Home, color: "text-purple-500", bg: "bg-purple-50 border-purple-100",
    zahl: "+3–8 %", einheit: "Immobilienwert (geschätzt)",
    title: "Wertsteigerung der Immobilie",
    text: "Ein Gründach verbessert die Energiebilanz, die Optik und die Nachhaltigkeitsbewertung Ihres Gebäudes — besonders bei Gewerbeimmobilien und ESG-Ratings.",
  },
];

const vergleich = [
  { label: "Substratdicke",      ext: "6–15 cm",              int: "20–100 cm" },
  { label: "Aufbaulast",         ext: "80–200 kg/m²",         int: "300–1.500 kg/m²" },
  { label: "Typische Pflanzen",  ext: "Sedum, Moose, Gräser", int: "Stauden, Sträucher, Bäume" },
  { label: "Bewässerung nötig?", ext: "Nein",                  int: "Ja (automatisch)" },
  { label: "Wartungsaufwand",    ext: "1× jährlich",           int: "2–4× jährlich" },
  { label: "Begehbar?",          ext: "Nein (nur Wartung)",    int: "Ja, Dachterrasse möglich" },
  { label: "Statikprüfung?",     ext: "Selten nötig",          int: "Erforderlich" },
];

const schichten = [
  { nr: "1", Icon: Wrench, bg: "bg-slate-50 border-slate-200", title: "Tragende Dachkonstruktion", text: "Die Basis: Beton, Holz oder Stahl. Die Konstruktion muss die Zusatzlasten dauerhaft tragen. Bei intensiver Begrünung ist ein Statikgutachten Pflicht." },
  { nr: "2", Icon: Shield, bg: "bg-red-50 border-red-200", title: "Wurzelfeste Abdichtung", text: "Das Herzstück. Rex setzt ausschließlich FLL-geprüfte, wurzelfeste Abdichtungen ein (EPDM, Bitumenschweißbahn). Nur diese schützen dauerhaft vor eindringenden Pflanzenwurzeln." },
  { nr: "3", Icon: Layers, bg: "bg-orange-50 border-orange-200", title: "Schutz- & Trennlage", text: "Ein Vlies schützt die Abdichtung vor mechanischen Beschädigungen und trennt Abdichtung und Drainage sauber voneinander." },
  { nr: "4", Icon: Droplets, bg: "bg-blue-50 border-blue-200", title: "Drainageschicht", text: "Kunststoff-Noppenmatten oder Blähton leiten überschüssiges Regenwasser schnell ab und puffern gleichzeitig Wasser für Trockenperioden." },
  { nr: "5", Icon: CheckCircle, bg: "bg-yellow-50 border-yellow-200", title: "Filtervlies", text: "Verhindert, dass Feinpartikel aus dem Substrat die Drainageschicht verstopfen — ein häufig unterschätztes Detail mit großer Langzeitwirkung." },
  { nr: "6", Icon: Leaf, bg: "bg-green-50 border-green-200", title: "Vegetationssubstrat", text: "Mineralisches, leichtes Substrat (400–600 g/l) als Wachstumsmedium. Schichtdicke: 6–15 cm extensiv, 20–100 cm intensiv." },
  { nr: "7", Icon: Leaf, bg: "bg-emerald-50 border-emerald-200", title: "Vegetation", text: "Sedum-Matten, Wildkräuter, Stauden oder Bäume — auf das lokale Klima in Bochum und das Regenwassermanagement des Dachs abgestimmt." },
];

const foerderungen = [
  {
    Icon: Home, title: "Städtische Förderung Bochum",
    text: "Die Stadt Bochum fördert Dachbegrünung im Rahmen des Klimaanpassungsprogramms und Starkregenkonzepts. Antrag beim Umwelt- und Grünflächenamt — vor Baubeginn.",
    hinweis: "Antrag vor Baubeginn!",
  },
  {
    Icon: Shield, title: "KfW Bundesförderung (BEG)",
    text: "Gründächer sind im Rahmen der KfW-BEG förderfähig, wenn sie Teil einer Sanierungsmaßnahme sind. Beantragung über die Hausbank vor Baubeginn.",
    hinweis: "Vor Baubeginn über Hausbank",
  },
  {
    Icon: Leaf, title: "NRW Klimabonus",
    text: "Das Land NRW bietet Förderprogramme, die Dachbegrünung einschließen können. Die NRW.BANK berät zu aktuellen Konditionen für Eigentümer im Ruhrgebiet.",
    hinweis: "Bei NRW.BANK anfragen",
  },
  {
    Icon: Droplets, title: "Regenwassergebühr-Entlastung",
    text: "Gründächer gelten in Bochum als gedrosselte Fläche — die Niederschlagswassergebühr der Stadtwerke Bochum sinkt dauerhaft über die gesamte Lebensdauer.",
    hinweis: "Beim Stadtentwicklungsamt anfragen",
  },
];

const pflegeExtensiv = [
  { monat: "Frühjahr (März–April)", aufgabe: "Ablaufsreinigung, unerwünschte Gehölze entfernen, Gesamtkontrolle der Vegetation" },
  { monat: "Sommer (bei Bedarf)",   aufgabe: "Sichtprüfung bei Extremtrockenheit — keine Bewässerung nötig" },
  { monat: "Herbst (Oktober)",      aufgabe: "Notüberläufe von Laub befreien, kurze Vegetationskontrolle" },
];

const pflegeIntensiv = [
  { monat: "Frühjahr",  aufgabe: "Gehölzschnitt, Bewässerung starten, Unkrautentfernung, Bodenlockerung" },
  { monat: "Sommer",    aufgabe: "Bewässerung 1–2× wöchentlich, Kontrolle auf Schadinsekten" },
  { monat: "Herbst",    aufgabe: "Rückschnitt, Bewässerung einstellen, Abläufe reinigen" },
  { monat: "Winter",    aufgabe: "Sichtprüfung nach Frost — kein Enteisungsmittel verwenden" },
];

const pruefliste = [
  "Dachabläufe und Notüberläufe auf Verstopfung",
  "Abdichtung an Durchdringungen und Dachanschlüssen",
  "Vegetation auf Lücken, Schäden, Schimmelpilze",
  "Kiesrandstreifen auf Freiheit von Bewuchs",
  "Wurzelsperren und Trennlagen auf Unversehrtheit",
  "Fotodokumentation & schriftliches Protokoll",
];

const faqItems = [
  {
    q: "Kann ein Gründach auf jedem Flachdach angelegt werden?",
    a: "Für extensive Begrünung (80–200 kg/m²) reicht in den meisten Fällen die vorhandene Statik aus. Intensive Begrünung erfordert einen statischen Nachweis. Rex Bedachungs GmbH prüft das kostenlos vor Ort in Bochum — bei Bedarf koordinieren wir auch das Statikgutachten.",
  },
  {
    q: "Brauche ich eine spezielle Abdichtung für ein Gründach?",
    a: "Ja — die Abdichtung muss wurzelfest sein, da Pflanzenwurzeln normale Bitumenbahnen durchdringen können. Rex verwendet ausschließlich nach FLL-Richtlinie geprüfte, wurzelfeste Abdichtungssysteme.",
  },
  {
    q: "Was passiert mit dem Regenwasser auf einem Gründach?",
    a: "Ein Gründach speichert je nach Typ 40–90 % des Niederschlags. Überschüssiges Wasser läuft gedrosselt durch die Drainageschicht ab — erheblich langsamer als bei einem unbegrünten Betondach. Das entlastet die Bochumer Kanalisation bei Starkregenereignissen.",
  },
  {
    q: "Muss ein extensives Gründach bewässert werden?",
    a: "Nein. Sedum-Pflanzen und Wildkräuter sind trockenheitsresistent und kommen ohne Bewässerung aus. Intensive Begrünung hingegen benötigt eine automatische Bewässerungsanlage.",
  },
  {
    q: "Wie lange hält ein Gründach?",
    a: "Die Vegetation ist dauerhaft. Die Abdichtung unter dem Gründach hält durch den Schutz vor UV und Temperaturwechseln doppelt so lange — also 40+ Jahre statt 20 Jahre.",
  },
  {
    q: "Muss der Förderantrag vor oder nach dem Einbau gestellt werden?",
    a: "Immer vor Baubeginn! Das gilt für KfW-Programme ohne Ausnahme. Auch die städtische Förderung Bochum muss vor der Beauftragung beantragt werden. Rex unterstützt Sie beim Timing kostenlos.",
  },
  {
    q: "Welche Pflanzen eignen sich für extensive Begrünung?",
    a: "Sedum-Arten (Fetthenne) sind am beliebtesten: frost- und trockenheitsresistent, flachwurzelnd, pflegeleicht. Ergänzend eignen sich Moose, Wildgräser und heimische Wildkräuter.",
  },
  {
    q: "Ist ein Gründach ökologisch wirklich sinnvoll?",
    a: "Ja. Die Klimabilanz ist positiv — der CO₂-Aufwand der Herstellung wird durch Kühlungseffekte, Biodiversitätsleistungen und verlängerte Gebäudelebensdauer vielfach kompensiert. Studien zeigen eine positive Klimabilanz bereits nach 5–10 Jahren.",
  },
];

export default function GruendachBochum() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Gründach Bochum: Aufbau, Vorteile, Varianten & Förderung – der vollständige Ratgeber",
    description:
      "Alles zum Thema Gründach und Dachbegrünung in Bochum: Extensiv vs. intensiv, 7 Schichten Aufbau, Vorteile, Förderprogramme und Pflegetipps vom Flachdach-Experten Rex Bedachungs GmbH.",
    author: { "@type": "Organization", name: "Rex Bedachungs GmbH" },
    publisher: {
      "@type": "Organization",
      name: "Rex Bedachungs GmbH",
      url: "https://rex-bedachung.de",
      logo: {
        "@type": "ImageObject",
        url: "https://rex-bedachung.de/images/logo-rex-bedachungs-gmbh-bochum-2025.webp",
      },
    },
    datePublished: "2026-03-01",
    dateModified: "2026-03-01",
    mainEntityOfPage: "https://rex-bedachung.de/gruendach-dachbegrunung-bochum",
    image: "https://rex-bedachung.de/images/gruendach-bochum-dachbegruenung-experten.webp",
    about: [
      { "@type": "Thing", name: "Gründach" },
      { "@type": "Thing", name: "Dachbegrünung" },
      { "@type": "Thing", name: "Flachdach" },
    ],
    mentions: [
      { "@type": "City", name: "Bochum" },
      { "@type": "Place", name: "Ruhrgebiet" },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Gründach & Dachbegrünung",
    provider: {
      "@type": "LocalBusiness",
      name: "Rex Bedachungs GmbH",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Paulinenstraße 22",
        addressLocality: "Bochum",
        postalCode: "44799",
        addressCountry: "DE",
      },
      telephone: "+49-234-583100",
      url: "https://rex-bedachung.de",
    },
    areaServed: [
      "Bochum", "Dortmund", "Essen", "Herne",
      "Gelsenkirchen", "Witten", "Hattingen", "Ruhrgebiet",
    ],
    description:
      "Planung und Einbau von extensiven und intensiven Gründächern auf Flachdächern in Bochum und dem Ruhrgebiet.",
    serviceType: "Dachbegrünung",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://rex-bedachung.de/" },
      { "@type": "ListItem", position: 2, name: "Flachdach", item: "https://rex-bedachung.de/flachdach-bochum" },
      {
        "@type": "ListItem",
        position: 3,
        name: "Gründach & Dachbegrünung",
        item: "https://rex-bedachung.de/gruendach-dachbegrunung-bochum",
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Gründach Bochum: Aufbau, Vorteile &amp; Förderung – Dachbegrünung vom Experten | Rex Bedachungs GmbH</title>
        <meta
          name="description"
          content="Gründach in Bochum ✓ Extensiv & Intensiv ✓ 7 Schichten Aufbau ✓ bis 90 % Regenwasserrückhalt ✓ Förderprogramme 2026 ✓ Kostenlose Beratung ☎ 0234 583100"
        />
        <meta
          property="og:title"
          content="Gründach Bochum: Alles zu Aufbau, Vorteilen & Förderung der Dachbegrünung"
        />
        <meta
          property="og:description"
          content="Der vollständige Ratgeber zum Gründach in Bochum: Extensiv vs. Intensiv, 7 Schichten, Förderprogramme und Pflegetipps vom Flachdach-Experten Rex Bedachungs GmbH."
        />
        <meta property="og:image" content="https://rex-bedachung.de/images/gruendach-bochum-dachbegruenung-experten.webp" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://www.rex-bedachung.de/gruendach-dachbegrunung-bochum" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Gründach Bochum: Alles zu Aufbau, Vorteilen & Förderung"
        />
        <meta
          name="twitter:description"
          content="Extensiv vs. Intensiv, 7 Schichten, Förderprogramme 2026. Der vollständige Gründach-Ratgeber für Bochum und das Ruhrgebiet."
        />
        <meta name="twitter:image" content="https://rex-bedachung.de/images/gruendach-bochum-dachbegruenung-experten.webp" />
        <link rel="canonical" href="https://www.rex-bedachung.de/gruendach-dachbegrunung-bochum" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <section className="bg-gradient-to-br from-slate-900 to-green-950 py-20 px-4" data-testid="section-hero">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-700/30 text-green-300 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Leaf className="w-4 h-4" />
            Gründach &amp; Dachbegrünung – Rex Bedachungs GmbH, Bochum
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight" data-testid="heading-hero">
            Gründach: Alles was Sie wissen müssen —
            <br className="hidden md:block" />
            Aufbau, Vorteile, Varianten &amp; Förderung
          </h1>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
            Der vollständige Ratgeber zur Dachbegrünung in Bochum und dem Ruhrgebiet. Von der richtigen
            Variante bis zur Förderung — alles aus einer Hand.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0234583100"
              className="pulse-ring inline-flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-md transition-colors"
              data-testid="button-hero-anrufen"
            >
              <Phone className="w-5 h-5" /> 0234 583100 – Kostenlos anfragen
            </a>
            <Link href="/flachdach-bochum">
              <a className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-md transition-colors border border-white/20" data-testid="link-flachdach">
                Zur Flachdach-Übersicht <ArrowRight className="w-4 h-4" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white" data-testid="section-vorteile">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 text-center">
            7 Gründe für ein Gründach in Bochum
          </h2>
          <p className="text-slate-600 text-center mb-10 max-w-2xl mx-auto">
            Messbar in Grad Celsius, Litern Regenwasser, Jahren Lebensdauer und Euro auf der
            Abwasserrechnung der Stadtwerke Bochum.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {vorteile.map(({ Icon, color, bg, zahl, einheit, title, text }, i) => (
              <div key={i} className={`rounded-md p-5 border ${bg}`} data-testid={`card-vorteil-${i}`}>
                <Icon className={`w-8 h-8 ${color} mb-3`} />
                <div className="text-2xl font-bold text-slate-900 mb-0.5">{zahl}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wide mb-3">{einheit}</div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-50" data-testid="section-aufbau">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 text-center">
            Die 7 Schichten eines Gründachs
          </h2>
          <p className="text-slate-600 text-center mb-10 max-w-xl mx-auto">
            Jede Schicht hat eine genaue Funktion. Das Weglassen oder Falscheinbauen einer einzigen Lage
            kann das gesamte System gefährden.
          </p>
          <div className="space-y-3 mb-8">
            {schichten.map((s, i) => (
              <div key={i} className={`rounded-md p-5 border ${s.bg} flex gap-4`} data-testid={`card-schicht-${i}`}>
                <div className="w-7 h-7 rounded-full bg-slate-900 text-green-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-1">
                  {s.nr}
                </div>
                <s.Icon className="w-6 h-6 text-slate-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{s.title}</h3>
                  <p className="text-slate-700 text-sm leading-relaxed">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-red-50 border border-red-200 rounded-md p-5 flex gap-4" data-testid="box-abdichtung-hinweis">
            <Shield className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-slate-900 mb-2">
                Die Abdichtung ist das Fundament — ohne Kompromisse
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                Viele Schadensfälle bei Gründächern haben dieselbe Ursache: eine mangelhafte oder nicht
                wurzelfeste Abdichtung. Pflanzenwurzeln finden jede Schwachstelle. Rex Bedachungs GmbH
                prüft die bestehende Abdichtung vor jeder Begrünung und erneuert sie bei Bedarf — erst
                dann kommt der Gründach-Aufbau darüber.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white" data-testid="section-varianten">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 text-center">
            Extensiv oder Intensiv — welche Variante passt?
          </h2>
          <p className="text-slate-600 text-center mb-8 max-w-xl mx-auto">
            Beide Varianten begrünen Ihr Flachdach in Bochum. Der Unterschied liegt in Substratdicke,
            Pflegeaufwand und Nutzungsmöglichkeiten.
          </p>
          <div className="overflow-x-auto rounded-md shadow-sm mb-8">
            <table className="w-full text-sm border-collapse" data-testid="table-vergleich">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left p-4 font-semibold text-slate-300">Merkmal</th>
                  <th className="text-left p-4 font-semibold text-green-300">Extensiv</th>
                  <th className="text-left p-4 font-semibold text-slate-300">Intensiv</th>
                </tr>
              </thead>
              <tbody>
                {vergleich.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="p-4 font-medium text-slate-700">{row.label}</td>
                    <td className="p-4 text-green-700 font-semibold">{row.ext}</td>
                    <td className="p-4 text-slate-600">{row.int}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-md p-5 flex gap-4" data-testid="box-empfehlung">
            <CheckCircle className="w-7 h-7 text-green-700 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-900 mb-2">
                Empfehlung für Bochum: Extensiv als Einstieg
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                Für die meisten Eigentümer im Ruhrgebiet ist extensive Begrünung der sinnvollste
                Einstieg: geringe Anforderungen an die Statik, kein Bewässerungsaufwand, maximale Wirkung
                für Klimaanpassung und Dachabdichtungsschutz. Für Garagen oder Gebäude mit nachgewiesener
                Tragreserve lohnt sich ein Blick auf die intensive Variante.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-50" data-testid="section-foerderung">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 text-center">
            Förderung für Gründächer in Bochum 2026
          </h2>
          <p className="text-slate-600 text-center mb-10 max-w-2xl mx-auto">
            Mehrere Fördertöpfe lassen sich kombinieren. Wichtig: Alle Anträge müssen vor Baubeginn
            gestellt werden.
          </p>
          <div className="grid md:grid-cols-2 gap-5 mb-6">
            {foerderungen.map((f, i) => (
              <div key={i} className="bg-white rounded-md p-5 border border-slate-100" data-testid={`card-foerderung-${i}`}>
                <f.Icon className="w-8 h-8 text-slate-600 mb-3" />
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-700 text-sm leading-relaxed mb-3">{f.text}</p>
                <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-full">
                  <AlertCircle className="w-3.5 h-3.5" /> {f.hinweis}
                </span>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex gap-3" data-testid="box-foerderung-hinweis">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-slate-700 text-sm leading-relaxed">
              Förderkonditionen und Fördersätze ändern sich regelmäßig. Alle Angaben entsprechen dem
              Stand März 2026. Rex Bedachungs GmbH unterstützt Sie bei der Antragstellung kostenlos.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white" data-testid="section-pflege">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 text-center">
            Pflege &amp; Wartung: Was Ihr Gründach wirklich braucht
          </h2>
          <p className="text-slate-600 text-center mb-10 max-w-2xl mx-auto">
            Ein extensives Gründach ist pflegeleichter als ein Garten — eine jährliche Fachinspektion
            sichert die 40+-Jahre-Lebensdauer der Abdichtung.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-green-100 rounded-md flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Extensive Begrünung</h3>
                  <p className="text-green-700 text-xs font-medium">Aufwand: sehr gering</p>
                </div>
              </div>
              <div className="space-y-2">
                {pflegeExtensiv.map((item, i) => (
                  <div key={i} className="bg-green-50 border border-green-100 rounded-md p-3" data-testid={`pflege-extensiv-${i}`}>
                    <p className="font-semibold text-slate-900 text-xs mb-0.5">{item.monat}</p>
                    <p className="text-slate-600 text-xs">{item.aufgabe}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-slate-100 rounded-md flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Intensive Begrünung</h3>
                  <p className="text-slate-500 text-xs font-medium">Aufwand: wie normaler Garten</p>
                </div>
              </div>
              <div className="space-y-2">
                {pflegeIntensiv.map((item, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-100 rounded-md p-3" data-testid={`pflege-intensiv-${i}`}>
                    <p className="font-semibold text-slate-900 text-xs mb-0.5">{item.monat}</p>
                    <p className="text-slate-600 text-xs">{item.aufgabe}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-md p-5 border border-slate-200" data-testid="box-jahresinspektion">
            <div className="flex items-center gap-3 mb-4">
              <Wrench className="w-6 h-6 text-red-600" />
              <h3 className="font-bold text-slate-900">Was Rex bei der Jahresinspektion prüft</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              {pruefliste.map((punkt, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 text-sm">{punkt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 px-4 bg-green-50 border-y border-green-100" data-testid="section-region">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-semibold text-slate-900 mb-2">
            Rex Bedachungs GmbH — Ihr Gründach-Fachbetrieb im Ruhrgebiet
          </p>
          <p className="text-slate-600 text-sm mb-4">
            Paulinenstraße 22, 44799 Bochum · Kostenloser Vor-Ort-Termin in der gesamten Region:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "Bochum", "Dortmund", "Essen", "Herne",
              "Gelsenkirchen", "Witten", "Hattingen", "Recklinghausen",
            ].map((city) => (
              <span
                key={city}
                className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1.5 rounded-full"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white" data-testid="section-faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 text-center">
            Häufige Fragen zum Gründach
          </h2>
          <p className="text-slate-600 text-center mb-10">
            Die meistgestellten Fragen zur Dachbegrünung in Bochum — kompakt beantwortet.
          </p>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div key={i} className="bg-slate-50 rounded-md overflow-hidden border border-slate-100" data-testid={`faq-item-${i}`}>
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  data-testid={`button-faq-${i}`}
                >
                  <span className="font-semibold text-slate-900 pr-4">{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-slate-700 leading-relaxed text-sm bg-white" data-testid={`text-faq-answer-${i}`}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-900" data-testid="section-cta">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ihr Gründach-Angebot aus Bochum
          </h2>
          <p className="text-slate-300 mb-8 text-sm md:text-base">
            Rex Bedachungs GmbH plant und baut Gründächer im gesamten Ruhrgebiet.
            Kostenloses Beratungsgespräch und Vor-Ort-Termin auf Wunsch.
            Paulinenstraße 22 · 44799 Bochum.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0234583100"
              className="pulse-ring inline-flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 text-white font-semibold px-8 py-4 rounded-md transition-colors text-lg"
              data-testid="button-cta-anrufen"
            >
              <Phone className="w-5 h-5" /> 0234 583100
            </a>
            <Link href="/flachdach-bochum">
              <a className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-md transition-colors text-lg border border-white/20" data-testid="link-cta-flachdach">
                Flachdach &amp; Gründach <ArrowRight className="w-5 h-5" />
              </a>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
