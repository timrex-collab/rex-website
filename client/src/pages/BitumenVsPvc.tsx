import { useState } from "react";
import { Helmet } from "react-helmet";
import OrganizationSchema from "@/components/OrganizationSchema";
import AuthorSchema from "@/components/AuthorSchema";
import Breadcrumb from "@/components/Breadcrumb";
import { CheckCircle, ChevronDown, ChevronUp, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const vergleich = [
  { kriterium: "Hauptanwendung", bitumen: "Dachflächen ab 20 m², Sanierung Bestand", pvc: "Terrassen, Balkone, kleine Sonderflächen" },
  { kriterium: "Lebensdauer", bitumen: "25–35 Jahre", pvc: "20–30 Jahre" },
  { kriterium: "Anschlüsse", bitumen: "Einschweißen, robust und dauerhaft", pvc: "Kaltverschweißt, sauberes Fugenbild" },
  { kriterium: "Begehbarkeit", bitumen: "Hoch (mechanisch belastbar)", pvc: "Mittel (abhängig vom System)" },
  { kriterium: "UV-Beständigkeit", bitumen: "Sehr hoch", pvc: "Gut (mit geeigneter Deckschicht)" },
  { kriterium: "Befestigung", bitumen: "Vollflächig verschweißt (zweilagig)", pvc: "Mechanisch, verklebt oder ballastiert" },
  { kriterium: "Optik Abschlüsse", bitumen: "Massiv und kompakt", pvc: "Präzise, sichtbar sauber" },
  { kriterium: "Recyclierbarkeit", bitumen: "Eingeschränkt", pvc: "PVC recyclierbar (Bauder-Programm)" },
];

const preisfaktoren = [
  { faktor: "Fläche & Dachform", detail: "Quadratmeter, Attikaabschlüsse, Kehlen, Gefälleausbildung" },
  { faktor: "Systemwahl & Aufbaudicke", detail: "Bitumen oder PVC, Dämmstärke für BEG-Anforderung (U ≤ 0,14 W/(m²·K))" },
  { faktor: "Untergrundqualität", detail: "Feuchteschäden, Altaufbau abfräsen, Schüttgefälle oder Gefälleplatten" },
  { faktor: "Anschlüsse & Details", detail: "Anzahl Kehlen, Dachabläufe, Lichtkuppeln, Aufkantungen, Wandanschlüsse" },
  { faktor: "Zugang & Gerüst", detail: "Kran, Materialaufzug, Gerüststandzeit" },
  { faktor: "Förderung & BEG", detail: "Bei U ≤ 0,14: bis zu 20 % BAFA-Zuschuss (mit iSFP), förderfähig als Gebäudehülle" },
];

const faqItems = [
  {
    question: "Wann ist Bitumen die bessere Wahl gegenüber PVC?",
    answer: "Bei großflächigen Dächern ab ca. 30 m², Hauptdächern und Sanierungen älterer Aufbauten. Bitumen ist mechanisch belastbarer, hat eine höhere UV-Resistenz und wird zweilagig verschweißt – das ergibt ein sehr robustes, langlebiges Ergebnis. Wir setzen Bitumen standardmäßig ein, wenn kein besonderer Grund für PVC spricht. Mehr zur vollständigen Flachdachsanierung unter /flachdach-bochum.",
  },
  {
    question: "Für welche Flächen empfehlen Sie PVC?",
    answer: "PVC eignet sich besonders für Balkone, Terrassen und kleine Flächen mit vielen Anschlüssen im Sichtbereich. Die Kaltverschweißung ergibt ein saubereres Fugenbild, und bei Detailanschlüssen an Türschwellen oder Brüstungen lässt sich PVC präziser einpassen. Wir setzen hier überwiegend Bauder und Wolfin ein.",
  },
  {
    question: "Wird Flachdachdämmung staatlich gefördert?",
    answer: "Ja – wenn der U-Wert auf ≤ 0,14 W/(m²·K) verbessert wird, fördert die BAFA bis zu 15 % der Bruttokosten, mit iSFP-Bonus bis zu 20 % – bis zu einem Förderhöchstbetrag von 60.000 € pro Wohneinheit. Wir beraten Sie zur Förderfähigkeit bei der Vor-Ort-Besichtigung. Details unter /foerderung.",
  },
  {
    question: "Kann Bitumen direkt auf PVC verlegt werden oder umgekehrt?",
    answer: "Nein – beide Systeme sind nicht direkt miteinander verträglich. Bei einer Systemänderung muss der Altaufbau vollständig entfernt werden. Das wird bei der Inspektion festgestellt und im Angebot berücksichtigt.",
  },
  {
    question: "Ist ein Gründachaufbau auf beiden Systemen möglich?",
    answer: "Ja – sowohl auf Bitumenbahnen als auch auf PVC-Membranen kann ein extensiver Gründachaufbau erfolgen, sofern die Wurzelschutzeignung des Materials zertifiziert ist. Bauder bietet für beide Systeme wurzelfeste Varianten an. Mehr zum Thema unter /gruendach-dachbegrunung-bochum.",
  },
  {
    question: "Wann lohnt sich eine vollständige Dachsanierung statt Reparatur?",
    answer: "Als Faustregel gilt: Bei einer Abdichtung älter als 20 Jahre oder wenn mehr als 20 % der Fläche Schäden zeigen, rechnet sich eine Komplettsanierung wirtschaftlicher. Eine Sanierung ermöglicht zudem die BAFA-Förderung. Mehr dazu unter /dachsanierung-bochum.",
  },
];

const schemaJson = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Bitumen oder PVC Flachdach – Entscheidungshilfe für Bochumer Eigentümer",
  "author": { "@id": "https://www.rex-bedachung.de/#author" },
  "publisher": { "@id": "https://www.rex-bedachung.de/#organization" },
  "url": "https://www.rex-bedachung.de/bitumen-vs-pvc-flachdach-bochum",
  "description": "Bitumen oder PVC auf dem Flachdach? Rex Bedachungs GmbH Bochum erklärt wann welches System sinnvoll ist – mit Vergleich, Systemaufbau, Preisfaktoren und Förderhinweisen.",
});

export default function BitumenVsPvc() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Bitumen oder PVC Flachdach Bochum | Entscheidungshilfe – Rex Bedachung</title>
        <meta
          name="description"
          content="Bitumen oder PVC auf dem Flachdach? Rex Bedachungs GmbH Bochum erklärt den Unterschied und wann welches System sinnvoll ist. Mit Vergleich, Systemaufbau und Förderhinweisen."
        />
        <link rel="canonical" href="https://www.rex-bedachung.de/bitumen-vs-pvc-flachdach-bochum" />
        <meta property="og:title" content="Bitumen oder PVC Flachdach Bochum – Vergleich & Entscheidungshilfe | Rex Bedachungs GmbH" />
        <meta property="og:description" content="Bitumen oder PVC auf dem Flachdach? Entscheidungshilfe mit Systemvergleich, Preisfaktoren und BAFA-Förderhinweisen von Rex Bedachungs GmbH Bochum." />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/dach-hintergrund-rex-bedachung.webp" />
        <meta property="og:site_name" content="Rex Bedachungs GmbH" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.rex-bedachung.de/images/dach-hintergrund-rex-bedachung.webp" />
        <script type="application/ld+json">{schemaJson}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type":"ListItem","position":1,"name":"Startseite","item":"https://www.rex-bedachung.de/"},
    {"@type":"ListItem","position":2,"name":"Flachdach Bochum","item":"https://www.rex-bedachung.de/flachdach-bochum"},
    {"@type":"ListItem","position":3,"name":"Bitumen vs. PVC","item":"https://www.rex-bedachung.de/bitumen-vs-pvc-flachdach-bochum"}
  ]
}`}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Wann ist Bitumen die bessere Wahl gegenüber PVC?",
      "acceptedAnswer": { "@type": "Answer", "text": "Bei großflächigen Dächern ab ca. 30 m², Hauptdächern und Sanierungen. Bitumen ist mechanisch belastbarer, UV-resistenter und wird zweilagig verschweißt." }
    },
    {
      "@type": "Question",
      "name": "Für welche Flächen empfehlen Sie PVC?",
      "acceptedAnswer": { "@type": "Answer", "text": "PVC für Balkone, Terrassen und kleine Flächen mit vielen Anschlüssen im Sichtbereich. Kaltverschweißung ergibt saubereres Fugenbild." }
    },
    {
      "@type": "Question",
      "name": "Wird Flachdachdämmung staatlich gefördert?",
      "acceptedAnswer": { "@type": "Answer", "text": "Ja – bei U-Wert ≤ 0,14 W/(m²·K): BAFA bis zu 20 % (mit iSFP), Förderhöchstbetrag 60.000 € pro Wohneinheit." }
    }
  ]
}`}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Flachdachabdichtung Bochum – Bitumen und PVC",
  "provider": { "@type": "RoofingContractor", "@id": "https://www.rex-bedachung.de/#organization" },
  "areaServed": { "@type": "City", "name": "Bochum" },
  "serviceType": "Flachdachabdichtung"
}`}</script>
      </Helmet>

      <OrganizationSchema />
      <AuthorSchema />
      <Breadcrumb items={[
        { label: "Startseite", href: "/" },
        { label: "Flachdach Bochum", href: "/flachdach-bochum" },
        { label: "Bitumen vs. PVC" },
      ]} />

      {/* Hero */}
      <section className="py-16 px-4 bg-muted/40">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-medium text-primary uppercase tracking-widest mb-3">Flachdach Bochum · Entscheidungshilfe</p>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
            Bitumen oder PVC auf dem Flachdach?
          </h1>
          <div className="border-l-4 border-primary pl-4 text-muted-foreground leading-relaxed">
            Für großflächige Flachdächer und Dachsanierungen empfehlen wir Bitumenbahnen – langlebig, UV-stabil und mechanisch belastbar. PVC-Membranen sind die bessere Wahl bei Terrassen, Balkonen und kleinen Flächen mit sichtbaren Anschlüssen, wo saubere Fugen und einfache Nacharbeiten zählen. Rex Bedachungs GmbH verarbeitet beide Systeme – überwiegend mit Bauder-Produkten.
          </div>
        </div>
      </section>

      {/* Vergleichsmatrix */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Systemvergleich</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left p-3 border border-border font-medium text-muted-foreground w-1/3">Kriterium</th>
                  <th className="text-left p-3 border border-border font-medium text-blue-700 bg-blue-50">Bitumen</th>
                  <th className="text-left p-3 border border-border font-medium text-emerald-700 bg-emerald-50">PVC</th>
                </tr>
              </thead>
              <tbody>
                {vergleich.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                    <td className="p-3 border border-border font-medium text-foreground">{row.kriterium}</td>
                    <td className="p-3 border border-border text-muted-foreground">{row.bitumen}</td>
                    <td className="p-3 border border-border text-muted-foreground">{row.pvc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Systemdetails */}
      <section className="py-16 px-4 bg-muted/40">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Systemaufbau im Detail</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-md p-6">
              <div className="inline-block text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded mb-3">Bitumen</div>
              <h3 className="font-bold text-foreground mb-1">Bauder PYE / PYP / APP</h3>
              <p className="text-xs text-muted-foreground italic mb-4">Empfohlen für Hauptdach und Sanierung</p>
              <ul className="space-y-1 text-sm text-muted-foreground mb-4">
                {["Untergrund prüfen", "Voranstrich", "Dampfsperre", "Wärmedämmung (z. B. Bauder PIR oder EPS)", "1. Abdichtungslage (z.B. Bauder TEC KSA DUO)", "Oberlage beschiefert (z. B. PYE PV200)"].map((s, i) => (
                  <li key={i} className="flex gap-2"><span className="text-muted-foreground">·</span>{s}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {["Elastomerbitumen PYE", "APP-Plastomer", "Kaltklebebahn", "Schweißbahn 2-lagig", "Sanierungslage", "Icopal, Soprema"].map((t, i) => (
                  <span key={i} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">{t}</span>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-md p-6">
              <div className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mb-3">PVC</div>
              <h3 className="font-bold text-foreground mb-1">Bauder PVC / Wolfin IB</h3>
              <p className="text-xs text-muted-foreground italic mb-4">Empfohlen für Terrassen &amp; Sichtanschlüsse</p>
              <ul className="space-y-1 text-sm text-muted-foreground mb-4">
                {["Dampfsperre", "Druckfeste Dämmung", "Trennvlies", "PVC-Membran mechanisch befestigt", "Optional: Kiesauflage ≥ 5 cm"].map((s, i) => (
                  <li key={i} className="flex gap-2"><span className="text-muted-foreground">·</span>{s}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {["Mechanisch befestigt", "Vollflächig verklebt", "Ballastiert (Kies)", "Begrünungsaufbau", "Wolfin, Soprema Flagon"].map((t, i) => (
                  <span key={i} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">{t}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 bg-card border border-border rounded-md p-5">
            <h3 className="font-bold text-foreground mb-3 text-sm">Technische Grenzwerte (BEG)</h3>
            <div className="grid sm:grid-cols-3 gap-3 text-sm text-muted-foreground">
              <div><span className="font-medium text-foreground">Flachdach BEG:</span> U ≤ 0,14 W/(m²·K)</div>
              <div><span className="font-medium text-foreground">GEG-Mindest:</span> 0,20 W/(m²·K)</div>
              <div><span className="font-medium text-foreground">PIR 14 cm:</span> ca. U 0,14 erreicht</div>
            </div>
          </div>
        </div>
      </section>

      {/* Preisfaktoren */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">Preisfaktoren – was den Aufwand bestimmt</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Für Flachdacharbeiten erstellen wir nach einer kostenlosen Vor-Ort-Prüfung ein individuelles Angebot. Wir erstellen eine realistische Einschätzung statt pauschaler Lockpreise.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {preisfaktoren.map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-card p-4 rounded-md border border-border">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{f.faktor}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fallstudie */}
      <section className="py-14 px-4 bg-muted/40">
        <div className="max-w-4xl mx-auto">
          <div className="border-l-[3px] border-primary bg-card p-6 rounded-r-md">
            <span className="inline-block text-[11px] font-medium uppercase tracking-widest text-primary bg-primary/10 px-3 py-0.5 rounded mb-3">Referenz</span>
            <p className="font-semibold text-foreground mb-3">Flachdachabdichtung Terrassenwohnung, Bochum-Weitmar</p>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              <span className="text-muted-foreground font-medium">System</span>
              <span>Bauder PVC, mechanisch befestigt</span>
              <span className="text-muted-foreground font-medium">Fläche</span>
              <span>38 m² Terrasse</span>
              <span className="text-muted-foreground font-medium">Grund</span>
              <span>Blasenbildung Altabdichtung, Wassereinbruch</span>
              <span className="text-muted-foreground font-medium">Leistung</span>
              <span>Vollständiger Neuaufbau, 5 Anschlüsse, 2 Abläufe</span>
              <span className="text-muted-foreground font-medium">Ergebnis</span>
              <span>Dicht, saubere Optik, Garantienachweis</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Häufige Fragen zu Bitumen und PVC
          </h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <div key={i} className="border border-border rounded-md bg-card">
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-card-foreground gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{item.question}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-5 h-5 shrink-0 text-muted-foreground" />
                    : <ChevronDown className="w-5 h-5 shrink-0 text-muted-foreground" />}
                </button>
                <div className={`overflow-hidden transition-all duration-200 ${openFaq === i ? "max-h-96" : "max-h-0"}`}>
                  <p className="px-5 pb-4 text-muted-foreground leading-relaxed text-sm">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regionen */}
      <section className="py-14 px-4 bg-muted/40">
        <div className="max-w-4xl mx-auto text-center">
          <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Flachdachabdichtung in Bochum und Umgebung</h2>
          <p className="text-muted-foreground leading-relaxed">
            Rex Bedachungs GmbH führt Flachdacharbeiten – Bitumen und PVC – in Bochum und im gesamten Ruhrgebiet aus. Herne, Castrop-Rauxel, Witten, Hattingen, Gelsenkirchen.
          </p>
        </div>
      </section>

      {/* Verwandte Leistungen */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Verwandte Leistungen &amp; Themen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/flachdach-bochum" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">Flachdach Bochum</div>
              <div className="text-sm text-gray-500">Alle Flachdachleistungen von Rex – Abdichtung, Dämmung, Wartung.</div>
            </a>
            <a href="/dachsanierung-bochum" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">Dachsanierung Bochum</div>
              <div className="text-sm text-gray-500">Komplettsanierung mit Förderberatung – Steildach und Flachdach.</div>
            </a>
            <a href="/foerderung" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">Förderung BAFA / KfW</div>
              <div className="text-sm text-gray-500">Bis zu 20 % Zuschuss für Flachdachdämmung mit U ≤ 0,14 W/(m²·K).</div>
            </a>
            <a href="/gruendach-dachbegrunung-bochum" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">Gründach Bochum</div>
              <div className="text-sm text-gray-500">Gründachaufbau auf Bitumen- und PVC-Abdichtungen möglich.</div>
            </a>
            <a href="/dachreparatur-bochum" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">Dachreparatur Bochum</div>
              <div className="text-sm text-gray-500">Undichte Abdichtung? Reparatur vor Komplettsanierung prüfen.</div>
            </a>
            <a href="/dachwartung-bochum" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">Dachwartung Bochum</div>
              <div className="text-sm text-gray-500">Regelmäßige Inspektion verlängert die Lebensdauer jeder Abdichtung.</div>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Welches System passt für Ihr Flachdach?</h2>
          <p className="text-muted-foreground mb-8">
            Wir kommen kostenlos zur Besichtigung und beraten Sie zur richtigen Systemwahl – in Bochum und dem Ruhrgebiet.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="pulse-ring cta-pulse">
              <a href="/kontakt">Vor-Ort-Termin anfragen</a>
            </Button>
            <Button asChild size="lg" variant="outline">
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
