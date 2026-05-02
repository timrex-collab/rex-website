import { useState } from "react";
import { Helmet } from "react-helmet";
import OrganizationSchema from "@/components/OrganizationSchema";
import AuthorSchema from "@/components/AuthorSchema";
import Breadcrumb from "@/components/Breadcrumb";
import {
  CheckCircle, ChevronDown, ChevronUp,
  Phone, Droplets, Wrench, Shield, Leaf, MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    icon: <Droplets className="w-8 h-8 text-primary" />,
    title: "Dachrinne reinigen",
    text: "Laub, Moos und Schmutz entfernen, Abläufe prüfen und durchspülen. Empfohlen mindestens einmal jährlich nach dem Laubfall.",
    testId: "card-reinigen",
  },
  {
    icon: <Wrench className="w-8 h-8 text-primary" />,
    title: "Dachrinne reparieren",
    text: "Risse, undichte Verbindungen, Lochfraß oder gelöste Haken. Partielle Instandsetzung wenn der Großteil der Rinne noch intakt ist.",
    testId: "card-reparieren",
  },
  {
    icon: <Droplets className="w-8 h-8 text-primary" />,
    title: "Dachrinne erneuern",
    text: "Kompletter Austausch inkl. Haken, Fallrohre, Bögen und Anschlüsse. Materialwahl nach Gebäude, Budget und Optik: Zink, Aluminium, Kupfer oder Kunststoff.",
    testId: "card-erneuern",
  },
  {
    icon: <Wrench className="w-8 h-8 text-primary" />,
    title: "Fallrohre & Abläufe",
    text: "Verstopfte oder beschädigte Fallrohre reinigen oder ersetzen. Anschlüsse an Grundleitung, Zisterne oder Versickerung fachgerecht herstellen.",
    testId: "card-fallrohre",
  },
  {
    icon: <Leaf className="w-8 h-8 text-primary" />,
    title: "Laubschutzgitter",
    text: "Einlegerinnen oder aufgesetzte Gitter aus Edelstahl oder Aluminium reduzieren Reinigungsaufwand dauerhaft. Mehrere Systeme verfügbar.",
    testId: "card-laubschutz",
  },
  {
    icon: <Shield className="w-8 h-8 text-primary" />,
    title: "Sturmschaden-Reparatur",
    text: "Abgehängte, verbogene oder abgerissene Rinnenabschnitte nach Sturmereignissen. Schadensdokumentation für Gebäudeversicherung auf Wunsch.",
    testId: "card-sturm",
  },
];

const preisfaktoren = [
  { faktor: "Rinnenlänge & Fallrohranzahl", detail: "Laufmeter Rinne, Innen-/Außenecken, Anzahl Fallrohre" },
  { faktor: "Materialwahl", detail: "Kunststoff → Aluminium → Zink → Kupfer (aufsteigend)" },
  { faktor: "Rinnenprofil", detail: "Halbrund, Kastenform, Trapez – je nach Bestandssystem" },
  { faktor: "Zugang & Gerüst", detail: "Leiterhöhe, Gerüstbedarf bei mehrstöckigen Gebäuden" },
  { faktor: "Zustand der Haken & Schalung", detail: "Verrottete Rinnenhaken oder Schalung müssen mitgetauscht werden" },
  { faktor: "Laubschutz", detail: "Optional: Gitter oder Einleger je nach Baumbestand" },
];

const faqItems = [
  {
    question: "Wie oft sollte ich meine Dachrinne reinigen lassen?",
    answer: "Mindestens einmal jährlich, am besten nach dem Laubfall im Herbst. Bei starkem Baumbestand auch zweimal. Verstopfte Rinnen sind von außen oft nicht erkennbar – erst wenn Wasser an der Fassade läuft, ist der Schaden meist schon entstanden.",
  },
  {
    question: "Wann lohnt sich Reparatur, wann kompletter Austausch?",
    answer: "Reparatur lohnt sich bei lokalen Schäden wie einem undichten Verbindungsstück oder einem gelösten Haken, wenn das restliche System noch intakt ist. Ist die Rinne älter als 25–30 Jahre, mehrfach geflickt oder großflächig korrodiert, rechnet sich ein Komplettaustausch wirtschaftlicher. Wir beurteilen das kostenlos vor Ort.",
  },
  {
    question: "Welches Material empfehlen Sie für eine Dachrinne in Bochum?",
    answer: "Für die meisten Wohngebäude empfehlen wir Titanzink: langlebig (40–60 Jahre), wartungsarm, passt optisch zu fast allen Eindeckungen. Aluminium ist günstiger und ebenfalls gut geeignet. Kupfer nur für Denkmalobjekte oder Premiumanwendungen. Kunststoff für Garagen und Nebengebäude.",
  },
  {
    question: "Übernimmt die Versicherung Sturmschäden an der Dachrinne?",
    answer: "Bei Sturmschäden ab Windstärke 8 übernimmt die Gebäudeversicherung in der Regel die Reparaturkosten abzüglich Selbstbeteiligung. Wir dokumentieren den Schaden professionell. Mehr dazu auf unserer Sturmschaden-Seite.",
  },
  {
    question: "Können Sie auch die Fallrohre erneuern?",
    answer: "Ja – Fallrohre, Bögen, Schellen, Abläufe und Anschlüsse an Grundleitung oder Zisterne gehören zu unserem Leistungsumfang. Bei einem Rinnenaustausch empfehlen wir, die Fallrohre gleichzeitig zu prüfen und bei Bedarf zu erneuern.",
  },
  {
    question: "Helfen Laubschutzgitter wirklich?",
    answer: "Ja, bei starkem Baumbestand deutlich. Gute Systeme reduzieren die Reinigungshäufigkeit auf alle 2–3 Jahre. Wir empfehlen nur Systeme aus Edelstahl oder Aluminium mit geprüfter Wasserführung – billige Kunststoffeinleger verstopfen selbst.",
  },
];

const schemaJson = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Dachrinne Bochum – Reinigung, Reparatur & Erneuerung",
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
  "description": "Dachrinne in Bochum reinigen, reparieren oder erneuern – Rex Bedachungs GmbH, Meisterbetrieb seit 1984. Zink, Aluminium, Kupfer, alle Befestigungssysteme, Laubschutz auf Wunsch.",
  "serviceType": "Dachentwässerung",
});

export default function DachrinnenBochum() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Dachrinne Bochum | Reinigung, Reparatur & Erneuerung – Rex Bedachung</title>
        <meta
          name="description"
          content="Dachrinne in Bochum verstopft, undicht oder beschädigt? Rex Bedachungs GmbH reinigt, repariert und erneuert – Zink, Aluminium, Kupfer. Kostenlose Besichtigung."
        />
        <link rel="canonical" href="https://www.rex-bedachung.de/dachrinne-bochum" />
        <meta property="og:title" content="Dachrinne Bochum – Reinigung, Reparatur & Erneuerung | Rex Bedachungs GmbH" />
        <meta property="og:description" content="Dachrinne in Bochum reinigen, reparieren oder erneuern lassen – alle Materialien, Laubschutz, Sturmschadenreparatur. Meisterbetrieb Rex Bedachungs GmbH." />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/dachrinne-fallrohr-bochum.webp" />
        <meta property="og:site_name" content="Rex Bedachungs GmbH" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.rex-bedachung.de/images/dachrinne-fallrohr-bochum.webp" />
        <script type="application/ld+json">{schemaJson}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type":"ListItem","position":1,"name":"Startseite","item":"https://www.rex-bedachung.de/"},
    {"@type":"ListItem","position":2,"name":"Bauklempnerei Bochum","item":"https://www.rex-bedachung.de/bauklempnerei-bochum"},
    {"@type":"ListItem","position":3,"name":"Dachrinne Bochum","item":"https://www.rex-bedachung.de/dachrinne-bochum"}
  ]
}`}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Wie oft sollte ich meine Dachrinne reinigen lassen?",
      "acceptedAnswer": { "@type": "Answer", "text": "Mindestens einmal jährlich nach dem Laubfall. Bei starkem Baumbestand auch zweimal. Verstopfte Rinnen sind von außen oft nicht erkennbar." }
    },
    {
      "@type": "Question",
      "name": "Wann lohnt sich Reparatur, wann kompletter Austausch?",
      "acceptedAnswer": { "@type": "Answer", "text": "Reparatur bei lokalen Schäden wenn das restliche System intakt ist. Bei Alter über 25–30 Jahre oder großflächiger Korrosion rechnet sich ein Komplettaustausch wirtschaftlicher." }
    },
    {
      "@type": "Question",
      "name": "Welches Material empfehlen Sie für eine Dachrinne in Bochum?",
      "acceptedAnswer": { "@type": "Answer", "text": "Für die meisten Wohngebäude Titanzink (40–60 Jahre Lebensdauer). Aluminium ist die günstigere Alternative. Kupfer für Denkmalobjekte." }
    },
    {
      "@type": "Question",
      "name": "Übernimmt die Versicherung Sturmschäden an der Dachrinne?",
      "acceptedAnswer": { "@type": "Answer", "text": "Bei Sturmschäden ab Windstärke 8 übernimmt die Gebäudeversicherung in der Regel die Kosten abzüglich Selbstbeteiligung. Wir dokumentieren den Schaden professionell." }
    },
    {
      "@type": "Question",
      "name": "Helfen Laubschutzgitter wirklich?",
      "acceptedAnswer": { "@type": "Answer", "text": "Ja, bei starkem Baumbestand deutlich. Gute Systeme aus Edelstahl oder Aluminium reduzieren die Reinigungshäufigkeit auf alle 2–3 Jahre." }
    }
  ]
}`}</script>
        <script type="application/ld+json">{`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Dachrinne Bochum – Reinigung, Reparatur & Erneuerung",
  "author": { "@id": "https://www.rex-bedachung.de/#author" },
  "publisher": { "@id": "https://www.rex-bedachung.de/#organization" },
  "url": "https://www.rex-bedachung.de/dachrinne-bochum"
}`}</script>
      </Helmet>

      <OrganizationSchema />
      <AuthorSchema />
      <Breadcrumb items={[
        { label: "Startseite", href: "/" },
        { label: "Bauklempnerei Bochum", href: "/bauklempnerei-bochum" },
        { label: "Dachrinne Bochum" },
      ]} />

      {/* Hero */}
      <section className="relative text-white py-24 px-4 overflow-hidden" data-testid="section-hero">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/dachrinne-fallrohr-bochum.webp')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30" aria-hidden="true" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 max-w-3xl">
            Dachrinne Bochum – reinigen, reparieren oder erneuern
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-xl">
            Verstopft, undicht oder nach einem Sturm beschädigt – Rex Bedachungs GmbH behebt alle Rinnenprobleme kurzfristig und dauerhaft
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <Button asChild size="lg" className="pulse-ring cta-pulse">
              <a href="tel:+49234583100" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Jetzt anrufen
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/40 text-white">
              <a href="/kontakt">Termin anfragen</a>
            </Button>
          </div>
          <p className="text-sm text-slate-300 font-medium">
            Kostenlose Besichtigung · 40+ Jahre Erfahrung · Bochum & Ruhrgebiet
          </p>
        </div>
      </section>

      {/* Einleitung */}
      <section className="py-16 px-4 bg-background" data-testid="section-einleitung">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Eine defekte oder verstopfte Dachrinne leitet Regenwasser unkontrolliert ab – das schädigt Fassade, Fundament und Kellermauerwerk, oft unbemerkt über Jahre. Rex Bedachungs GmbH reinigt, repariert und erneuert Dachrinnen und Fallrohre in Bochum: Zink, Aluminium, Kupfer und Kunststoff, alle Befestigungssysteme, Laubschutz auf Wunsch.
          </p>
          <div className="mt-6 inline-block bg-amber-50 border border-amber-200 rounded-md px-4 py-3 text-sm text-amber-800">
            Regelmäßige Reinigung im Herbst ist der günstigste Schutz vor Feuchtigkeitsschäden an Fassade und Fundament.
          </div>
        </div>
      </section>

      {/* Leistungen */}
      <section className="py-16 px-4 bg-muted/40" data-testid="section-leistungen">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Unsere Dachrinnen-Leistungen in Bochum
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <Card key={s.testId} data-testid={s.testId}>
                <CardHeader className="flex flex-row items-start gap-4 pb-2">
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

      {/* Materialübersicht */}
      <section className="py-16 px-4 bg-background" data-testid="section-materialien">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Welches Material für Ihre Dachrinne?</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { mat: "Titanzink", life: "40–60 Jahre", desc: "Klassisch, selbstpatinierend, langlebig. Standard für Steildach-Neubauten und Sanierungen. DIN EN 988.", badge: "Empfohlen" },
              { mat: "Aluminium", life: "25–35 Jahre", desc: "Leicht, korrosionsbeständig, farbig pulverbeschichtet lieferbar. Günstigere Alternative zu Zink.", badge: "" },
              { mat: "Kupfer", life: "80–100 Jahre", desc: "Premium-Material mit charakteristischer Grünpatina. Für Baudenkmal oder Premiumobjekte.", badge: "Premium" },
            ].map((m, i) => (
              <div key={i} className="bg-card border border-border rounded-md p-5">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-bold text-foreground">{m.mat}</p>
                  {m.badge && (
                    <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {m.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-medium mb-2">Lebensdauer: {m.life}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preisfaktoren */}
      <section className="py-14 px-4 bg-muted/40" data-testid="section-preisfaktoren">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Was kostet eine Dachrinne in Bochum?</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Die Kosten richten sich nach Länge, Material und Zustand. Wir erstellen nach kostenloser Vor-Ort-Prüfung ein transparentes Angebot – keine versteckten Kosten.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
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
          <p className="text-sm text-slate-600">
            Richtwerte: Aluminiumrinne ab ca. 30–60 €/m inkl. Montage, Zinkrinne ab ca. 50–90 €/m. Exakter Preis nach Aufmaß.
          </p>
        </div>
      </section>

      {/* Fallstudie */}
      <section className="py-14 px-4 bg-background" data-testid="section-fallstudie">
        <div className="max-w-4xl mx-auto">
          <div className="border-l-[3px] border-primary bg-card p-6 rounded-r-md">
            <span className="inline-block text-[11px] font-medium uppercase tracking-widest text-primary bg-primary/10 px-3 py-0.5 rounded mb-3">
              Projekt aus Bochum
            </span>
            <p className="font-semibold text-foreground mb-3">Zinkenneuerung Doppelhaushälfte, Bochum-Querenburg</p>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              <span className="text-muted-foreground font-medium">Material</span>
              <span>Titanzink, Halbrundrille 100 mm</span>
              <span className="text-muted-foreground font-medium">Umfang</span>
              <span>22 m Rinne, 3 Fallrohre, 2 Innenecken</span>
              <span className="text-muted-foreground font-medium">Problem</span>
              <span>Lochfraß, 2 abgehängte Rinnenhaken, undichter Ablauf</span>
              <span className="text-muted-foreground font-medium">Leistung</span>
              <span>Kompletter Austausch inkl. partieller Schalungserneuerung</span>
              <span className="text-muted-foreground font-medium">Ergebnis</span>
              <span>Dicht, optisch passend zur Bestandseindeckung</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-background" data-testid="section-faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Häufige Fragen zur Dachrinne in Bochum
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
      <section className="py-14 px-4 bg-muted/40" data-testid="section-regionen">
        <div className="max-w-4xl mx-auto text-center">
          <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Dachrinnen-Service im gesamten Ruhrgebiet</h2>
          <p className="text-muted-foreground leading-relaxed">
            Rex Bedachungs GmbH reinigt, repariert und erneuert Dachrinnen in Bochum und Umgebung – Herne, Castrop-Rauxel, Witten, Hattingen, Gelsenkirchen. Kurzfristige Termine, transparente Preise.
          </p>
        </div>
      </section>

      {/* Verwandte Leistungen */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Verwandte Leistungen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/bauklempnerei-bochum" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">Bauklempnerei Bochum</div>
              <div className="text-sm text-gray-500">Alle Blecharbeiten – Dachränder, Attiken, Wandanschlüsse, Kehlen.</div>
            </a>
            <a href="/dachreparatur-bochum" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">Dachreparatur Bochum</div>
              <div className="text-sm text-gray-500">Schnelle Hilfe bei allen Dachschäden – auch nach Sturm.</div>
            </a>
            <a href="/sturmschaden-dach-bochum" className="block p-5 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all">
              <div className="font-semibold text-gray-900 mb-1">Sturmschaden Dach Bochum</div>
              <div className="text-sm text-gray-500">Notsicherung, Reparatur und Versicherungsabwicklung nach Sturm.</div>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-background" data-testid="section-cta">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Dachrinne verstopft oder beschädigt?</h2>
          <p className="text-muted-foreground mb-8">
            Wir kommen kostenlos zur Besichtigung – kurzfristig, ohne versteckte Kosten.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="pulse-ring cta-pulse">
              <a href="tel:+49234583100" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Jetzt anrufen
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="/kontakt">Termin anfragen</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}