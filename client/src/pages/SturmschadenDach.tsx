import { useState } from "react";
import { Helmet } from "react-helmet";
import OrganizationSchema from "@/components/OrganizationSchema";
import AuthorSchema from "@/components/AuthorSchema";
import Breadcrumb from "@/components/Breadcrumb";
import {
  AlertTriangle, CheckCircle, ChevronDown, ChevronUp,
  Phone, FileText, Wind, Shield, Wrench, MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sofortmassnahmen = [
  { titel: "Notsicherung – undichte Stellen provisorisch abdecken", desc: "Folie oder Plane über beschädigte Bereiche – verhindert weiteren Wassereintritt bis zur dauerhaften Reparatur." },
  { titel: "Schaden dokumentieren – vor der Reparatur fotografieren", desc: "Fotos und Zeitstempel sichern Ihren Versicherungsanspruch. Beschädigte Teile nicht entsorgen." },
  { titel: "Versicherung informieren – Schadensmeldung einleiten", desc: "Gebäudeversicherung umgehend benachrichtigen. Rex erstellt auf Wunsch einen professionellen Schadensbericht." },
  { titel: "Fachbetrieb beauftragen – dauerhafte Reparatur planen", desc: "Nach der Notsicherung folgt die fachgerechte Instandsetzung mit Dokumentation aller Maßnahmen." },
];

const leistungen = [
  { icon: <Wind className="w-7 h-7 text-primary" />, titel: "Abgedeckte Ziegel & Eindeckung", text: "Verrutschte, abgehobene oder zerbrochene Ziegel werden passgenau ersetzt. Wir prüfen die gesamte Eindeckung auf Sturmfolgeschäden." },
  { icon: <AlertTriangle className="w-7 h-7 text-primary" />, titel: "Notsicherung & Notabdichtung", text: "Bei akuter Gefährdung sichern wir Ihr Dach noch am selben oder nächsten Werktag provisorisch ab." },
  { icon: <FileText className="w-7 h-7 text-primary" />, titel: "Schadensdokumentation für Versicherung", text: "Professioneller Schadensbericht mit Fotos, Schadensumfang und Kostenschätzung – für eine reibungslose Versicherungsabwicklung." },
  { icon: <Wrench className="w-7 h-7 text-primary" />, titel: "Dauerhafte Reparatur & Abdichtung", text: "Nach der Notsicherung erfolgt die fachgerechte Instandsetzung – Ziegel, Abdichtung, Anschlüsse, Dachrinne." },
  { icon: <Shield className="w-7 h-7 text-primary" />, titel: "Versicherungsabwicklung auf Wunsch", text: "Wir kommunizieren auf Wunsch direkt mit Ihrer Gebäudeversicherung und sorgen dafür, dass Sie schnell zu Ihrem Recht kommen." },
];

const faqItems = [
  {
    question: "Ab welcher Windstärke spricht man von einem versicherten Sturmschaden?",
    answer: "Die Gebäudeversicherung erkennt in der Regel Schäden ab Windstärke 8 (ab ca. 65 km/h) als versicherten Sturmschaden an – das entspricht dem DWD-Warnsystem Stufe 2 (markantes Wetter). Bei niedrigeren Windstärken kann dennoch ein Schaden entstehen, der aber unterschiedlich behandelt wird. Rex dokumentiert den Schaden so, dass Ihre Versicherung alle notwendigen Informationen erhält.",
  },
  {
    question: "Was tun wenn nach einem Sturm Ziegel fehlen oder das Dach undicht ist?",
    answer: "Zunächst Schaden dokumentieren (Fotos), dann Versicherung informieren. Bei drohendem Wassereintritt sofort Rex anrufen – wir sichern das Dach provisorisch ab und reparieren dauerhaft. Beschädigte Ziegel bitte nicht entsorgen – die Versicherung kann eine Inaugenscheinnahme verlangen.",
  },
  {
    question: "Übernimmt die Gebäudeversicherung die Kosten für Sturmschäden?",
    answer: "Bei Sturmschäden ab Windstärke 8 übernimmt die Gebäudeversicherung in der Regel die Reparaturkosten abzüglich der vereinbarten Selbstbeteiligung. Rex erstellt einen vollständigen Schadensbericht und unterstützt Sie bei der Kommunikation mit der Versicherung.",
  },
  {
    question: "Wie schnell können Sie nach einem Sturm kommen?",
    answer: "In der Regel kommen wir innerhalb von 24–48 Stunden für eine erste Beurteilung und Notsicherung. Bei anhaltenden Sturmlagen kann es kurze Wartezeiten geben – melden Sie sich per Telefon oder WhatsApp, damit wir Ihren Einsatz vormerken.",
  },
  {
    question: "Was kostet die Begutachtung und Notsicherung?",
    answer: "Die Schadensbegutachtung vor Ort ist kostenlos. Die Kosten für Notsicherung und Reparatur richten sich nach Schadensumfang und werden in einem transparenten Angebot aufgelistet – bevor wir mit der Arbeit beginnen. Keine versteckten Kosten.",
  },
  {
    question: "Kann ich den Sturmschaden auch ohne Versicherung reparieren lassen?",
    answer: "Ja – auch wenn keine Versicherungsleistung beansprucht wird oder die Selbstbeteiligung die Reparaturkosten übersteigt, führen wir die Reparatur fachgerecht aus. Wir beraten Sie ehrlich, ob eine Meldung an die Versicherung sich lohnt.",
  },
];

const schemaJson = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Sturmschaden Dach Bochum – Notsicherung & Reparatur",
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
  "areaServed": ["Bochum", "Herne", "Castrop-Rauxel", "Witten", "Hattingen", "Gelsenkirchen"],
  "description": "Sturmschaden am Dach in Bochum – Notsicherung, Reparatur und Schadensdokumentation für die Versicherung. Meisterbetrieb Rex Bedachungs GmbH.",
  "serviceType": "Sturmschaden Dachreparatur",
});

export default function SturmschadenDach() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Sturmschaden Dach Bochum | Notsicherung & Reparatur – Rex Bedachung</title>
        <meta
          name="description"
          content="Sturmschaden am Dach in Bochum? Rex Bedachungs GmbH sichert und repariert kurzfristig – Schadensdokumentation für die Versicherung inklusive. Meisterbetrieb seit 1984."
        />
        <link rel="canonical" href="https://www.rex-bedachung.de/sturmschaden-dach-bochum" />
        <meta property="og:title" content="Sturmschaden Dach Bochum – Notsicherung & Reparatur | Rex Bedachungs GmbH" />
        <meta property="og:description" content="Sturmschaden am Dach in Bochum – Rex Bedachungs GmbH sichert und repariert kurzfristig. Schadensdokumentation für Gebäudeversicherung inklusive." />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/sturmschaden-dach-bochum.webp" />
        <meta property="og:site_name" content="Rex Bedachungs GmbH" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.rex-bedachung.de/images/sturmschaden-dach-bochum.webp" />
        <script type="application/ld+json">{schemaJson}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type":"ListItem","position":1,"name":"Startseite","item":"https://www.rex-bedachung.de/"},
    {"@type":"ListItem","position":2,"name":"Dachreparatur Bochum","item":"https://www.rex-bedachung.de/dachreparatur-bochum"},
    {"@type":"ListItem","position":3,"name":"Sturmschaden Dach Bochum","item":"https://www.rex-bedachung.de/sturmschaden-dach-bochum"}
  ]
}`}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Ab welcher Windstärke spricht man von einem versicherten Sturmschaden?",
      "acceptedAnswer": { "@type": "Answer", "text": "Die Gebäudeversicherung erkennt in der Regel Schäden ab Windstärke 8 (ab ca. 65 km/h, DWD Warnstufe 2 markantes Wetter) als versicherten Sturmschaden an." }
    },
    {
      "@type": "Question",
      "name": "Was tun wenn nach einem Sturm Ziegel fehlen oder das Dach undicht ist?",
      "acceptedAnswer": { "@type": "Answer", "text": "Schaden fotografieren, Versicherung informieren, Rex anrufen für Notsicherung und dauerhafte Reparatur. Beschädigte Ziegel nicht entsorgen." }
    },
    {
      "@type": "Question",
      "name": "Übernimmt die Gebäudeversicherung die Kosten für Sturmschäden?",
      "acceptedAnswer": { "@type": "Answer", "text": "Bei Sturmschäden ab Windstärke 8 übernimmt die Gebäudeversicherung in der Regel die Reparaturkosten abzüglich der vereinbarten Selbstbeteiligung." }
    },
    {
      "@type": "Question",
      "name": "Wie schnell können Sie nach einem Sturm kommen?",
      "acceptedAnswer": { "@type": "Answer", "text": "In der Regel innerhalb von 24–48 Stunden für erste Beurteilung und Notsicherung." }
    },
    {
      "@type": "Question",
      "name": "Was kostet die Begutachtung und Notsicherung?",
      "acceptedAnswer": { "@type": "Answer", "text": "Die Schadensbegutachtung vor Ort ist kostenlos. Kosten für Notsicherung und Reparatur werden in einem transparenten Angebot aufgelistet, bevor wir beginnen." }
    }
  ]
}`}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Was tun bei Sturmschaden am Dach?",
  "step": [
    {"@type":"HowToStep","position":1,"name":"Notsicherung","text":"Provisorisch abdecken, weiteren Wassereintritt verhindern."},
    {"@type":"HowToStep","position":2,"name":"Dokumentieren","text":"Fotos und Zeitstempel vor der Reparatur – für die Versicherung."},
    {"@type":"HowToStep","position":3,"name":"Versicherung informieren","text":"Gebäudeversicherung umgehend benachrichtigen."},
    {"@type":"HowToStep","position":4,"name":"Fachbetrieb beauftragen","text":"Dauerhafte Reparatur durch Rex Bedachungs GmbH Bochum."}
  ]
}`}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Sturmschaden Dach Bochum – Notsicherung, Reparatur & Versicherung",
  "author": { "@id": "https://www.rex-bedachung.de/#author" },
  "publisher": { "@id": "https://www.rex-bedachung.de/#organization" },
  "url": "https://www.rex-bedachung.de/sturmschaden-dach-bochum"
}`}</script>
      </Helmet>

      <OrganizationSchema />
      <AuthorSchema />
      <Breadcrumb items={[
        { label: "Startseite", href: "/" },
        { label: "Dachreparatur", href: "/dachreparatur-bochum" },
        { label: "Sturmschaden" },
      ]} />

      {/* Hero */}
      <section
        className="relative text-white py-24 px-4 overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/sturmschaden-dach-bochum.webp')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)", opacity: 0.82 }} aria-hidden="true" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1 mb-6">
            <Wind className="w-4 h-4 text-blue-300" />
            <span className="text-sm font-medium text-blue-100 uppercase tracking-wider">Sturmschaden Bochum</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 max-w-3xl">
            Sturmschaden am Dach – Notsicherung & Reparatur in Bochum
          </h1>
          <p className="text-lg text-slate-300 mb-4 max-w-2xl leading-relaxed">
            Abgedeckte Ziegel, undichte Stellen oder beschädigte Dachrinnen nach einem Sturm? Rex Bedachungs GmbH sichert Ihr Dach kurzfristig, repariert dauerhaft und erstellt die Schadensdokumentation für Ihre Gebäudeversicherung.
          </p>
          <p className="text-sm text-slate-400 mb-8">
            Sturmschäden ab Windstärke 8 (ab ca. 65 km/h, DWD Warnstufe 2 markantes Wetter) werden von der Gebäudeversicherung in der Regel anerkannt.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="pulse-ring cta-pulse bg-white text-blue-900 hover:bg-slate-100">
              <a href="tel:+49234583100" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Jetzt anrufen
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white">
              <a href="/kontakt">Schaden melden</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Sofortmaßnahmen */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Was tun bei Sturmschaden am Dach?</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Die vier Schritte nach einem Sturmereignis – in dieser Reihenfolge:
          </p>
          <div className="space-y-4">
            {sofortmassnahmen.map((s, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-card border border-border rounded-md">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold text-foreground mb-1">{s.titel}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leistungen */}
      <section className="py-16 px-4 bg-muted/40">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Unsere Leistungen bei Sturmschäden</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leistungen.map((l, i) => (
              <div key={i} className="bg-card border border-border rounded-md p-6">
                <div className="mb-3">{l.icon}</div>
                <h3 className="font-bold text-foreground mb-2">{l.titel}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{l.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fallstudie */}
      <section className="py-14 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="border-l-[3px] border-primary bg-card p-6 rounded-r-md">
            <span className="inline-block text-[11px] font-medium uppercase tracking-widest text-primary bg-primary/10 px-3 py-0.5 rounded mb-3">
              Projekt aus Bochum
            </span>
            <p className="font-semibold text-foreground mb-3">Sturmreparatur Steildach, Bochum-Wiemelhausen</p>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              <span className="text-muted-foreground font-medium">Schaden</span>
              <span>20 Ziegel abgehoben, Teilreparatur Eindeckung 15 m²</span>
              <span className="text-muted-foreground font-medium">Selbstbeteiligung</span>
              <span>150 €, Rest von Gebäudeversicherung übernommen</span>
              <span className="text-muted-foreground font-medium">Leistung</span>
              <span>Notsicherung, Eindeckung instand gesetzt, Schadensbericht für Versicherung erstellt</span>
              <span className="text-muted-foreground font-medium">Ergebnis</span>
              <span>Versicherung hat vollständig reguliert, Dach dauerhaft dicht</span>
            </div>
          </div>
        </div>
      </section>

      {/* Preishinweis */}
      <section className="py-14 px-4 bg-muted/40">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Was kostet die Sturmreparatur?</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Die Kosten hängen vom Schadensumfang ab. Wir erstellen nach der Vor-Ort-Begutachtung ein transparentes Angebot – bevor wir mit der Arbeit beginnen. Die Begutachtung ist kostenlos.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { faktor: "Anzahl und Art der beschädigten Ziegel", detail: "Ton, Beton, Faserzement – Ersatzteile nach Hersteller" },
              { faktor: "Umfang der Eindeckungsfläche", detail: "Einzelstellen vs. größere Bereiche" },
              { faktor: "Zustand der Unterspannbahn & Lattung", detail: "Wird bei Instandsetzung geprüft" },
              { faktor: "Dachrinnen & Anschlüsse", detail: "Sturmschäden oft auch an Rinnen und Ortgängen" },
              { faktor: "Gerüstbedarf", detail: "Bei schwer zugänglichen Dachflächen erforderlich" },
              { faktor: "Notsicherung vorab", detail: "Folie oder Plane – separater Posten falls akut nötig" },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-card p-4 rounded-md border border-border">
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{f.faktor}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-600 mt-4">
            Bei versicherten Sturmschäden rechnen wir auf Wunsch direkt mit der Gebäudeversicherung ab.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Häufige Fragen zu Sturmschäden am Dach
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
                  <p className="px-5 pb-4 text-muted-foreground leading-relaxed text-sm">
                    {item.answer}
                  </p>
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
          <h2 className="text-2xl font-bold mb-4">Sturmschaden-Reparatur im gesamten Ruhrgebiet</h2>
          <p className="text-muted-foreground leading-relaxed">
            Rex Bedachungs GmbH repariert Sturmschäden in Bochum und dem Ruhrgebiet – Herne, Castrop-Rauxel, Witten, Hattingen, Gelsenkirchen. Kurzfristiger Einsatz, zuverlässige Abwicklung.
          </p>
        </div>
      </section>

      {/* Verwandte Leistungen */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Verwandte Leistungen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/dachreparatur-bochum" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">Dachreparatur Bochum</div>
              <div className="text-sm text-gray-500">Alle Dachschäden – Ziegel, Flachdach, Kaminanschlüsse, Dachrinnen.</div>
            </a>
            <a href="/dachwartung-bochum" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">Dachwartung Bochum</div>
              <div className="text-sm text-gray-500">Regelmäßige Inspektion verhindert Sturmfolgeschäden frühzeitig.</div>
            </a>
            <a href="/dachsanierung-bochum" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">Dachsanierung Bochum</div>
              <div className="text-sm text-gray-500">Wenn der Sturmschaden eine Komplettsanierung sinnvoll macht.</div>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Sturmschaden festgestellt? Jetzt anrufen.</h2>
          <p className="text-muted-foreground mb-8">
            Wir kommen zur kostenlosen Begutachtung – kurzfristig, ohne versteckte Kosten, mit Versicherungsunterstützung.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="pulse-ring cta-pulse">
              <a href="tel:+49234583100" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Jetzt anrufen
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="/kontakt">Schaden online melden</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
