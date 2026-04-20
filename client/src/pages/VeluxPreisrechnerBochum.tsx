import { Helmet } from "react-helmet";
import OrganizationSchema from "@/components/OrganizationSchema";
import AuthorSchema from "@/components/AuthorSchema";
import Breadcrumb from "@/components/Breadcrumb";
import VeluxPreisrechner from "@/components/VeluxPreisrechner";
import { Phone, ArrowRight } from "lucide-react";

const faqData = [
  {
    q: "Was kostet ein VELUX Dachfenster mit Einbau in Bochum?",
    a: "Die Gesamtkosten hängen von Fenstertyp, Größe, Verglasung und Zubehör ab. Ein Kunststoff-Schwingfenster (GGU) in Standardgröße MK08 mit ENERGIE-Verglasung, Eindeckrahmen und Einbau beginnt ab ca. 1.800 € netto. Klapp-Schwingfenster (GPU/GPL) liegen höher. Nutzen Sie unseren Preisrechner oben für eine individuelle Kostenschätzung."
  },
  {
    q: "Welche VELUX Verglasung ist förderfähig über die BAFA?",
    a: "Nur Verglasungen mit einem Uw-Wert von maximal 1,0 W/m²K sind über die BAFA (BEG Einzelmaßnahme) förderfähig. Bei VELUX erfüllen das die Verglasungsstufen ENERGIE (Uw 1,0) und ENERGIE PLUS (Uw 0,7). Die Standardverglasung THERMO (Uw 1,3) ist nicht förderfähig."
  },
  {
    q: "Wie hoch ist die BAFA-Förderung für neue Dachfenster?",
    a: "Der Grundfördersatz beträgt 15 % der förderfähigen Bruttokosten. Mit einem individuellen Sanierungsfahrplan (iSFP) steigt der Satz auf 20 % und der Förderhöchstbetrag verdoppelt sich von 30.000 € auf 60.000 € pro Wohneinheit und Jahr. Zusätzlich sind 50 % der Kosten für den Energieeffizienz-Experten als separater Zuschuss erhältlich."
  },
  {
    q: "Was ist der Unterschied zwischen BAFA-Zuschuss und Steuerbonus §35c?",
    a: "Der BAFA-Zuschuss (15–20 %) wird direkt ausgezahlt, erfordert aber einen Energieeffizienz-Experten und einen Antrag vor Baubeginn. Der Steuerbonus nach §35c EStG bietet 20 % Steuerermäßigung über drei Jahre (7 %/7 %/6 %), braucht keinen Energieberater, gilt aber nur für selbstgenutztes Wohneigentum ab 10 Jahren Gebäudealter. Beide Wege sind nicht für dieselbe Maßnahme kombinierbar."
  },
  {
    q: "Was ist im Einbaupreis für ein VELUX Dachfenster enthalten?",
    a: "Unsere Einbaukalkulation umfasst: Demontage des Altfensters bzw. Erstellung der Dachöffnung, Fenstereinbau mit Abdichtung und Dampfbremse, Eindeckrahmen-Montage sowie optional Rollladen- und Rollo-Montage. Die angegebenen Preise sind Mindestpreise — der tatsächliche Aufwand hängt vom Dachaufbau, der Eindeckung und dem Bestandszustand ab."
  },
  {
    q: "Welchen Eindeckrahmen brauche ich für mein VELUX Dachfenster?",
    a: "Für Dachziegel und Dachsteine bis 120 mm Profilhöhe verwenden wir standardmäßig den EDW 2000 (Ziegel hoch/Welle). Bei Flachdacheindeckungen, Schiefer oder Biberschwanz kommen andere Eindeckrahmen-Typen zum Einsatz. Den passenden Rahmen klären wir bei der Vor-Ort-Begehung — er ist in unserer Kostenschätzung bereits berücksichtigt."
  },
  {
    q: "Kann ich den KfW-Ergänzungskredit mit der BAFA-Förderung kombinieren?",
    a: "Ja. Nach der BAFA-Förderzusage können Sie zusätzlich den KfW-Ergänzungskredit (Programm 358/359) über bis zu 120.000 € pro Wohneinheit beantragen. Bei einem Haushaltseinkommen bis 90.000 € gelten besonders günstige Zinskonditionen über KfW 358 Plus."
  },
  {
    q: "Wie läuft ein Dachfenster-Austausch bei Rex Bedachungs GmbH ab?",
    a: "Nach Ihrer Anfrage vereinbaren wir einen Vor-Ort-Termin in Bochum und Umgebung, prüfen den Dachaufbau und erstellen ein verbindliches Festangebot. Bei Förderwunsch koordinieren wir den Energieeffizienz-Experten und den BAFA-Antrag. Die Montage dauert je nach Umfang 1–3 Tage. Als autorisierter VELUX-Partner verbauen wir ausschließlich Original-VELUX-Produkte."
  }
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqData.map(f => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a }
  }))
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "VELUX Dachfenster Einbau & Austausch",
  description: "Einbau, Austausch und Beratung für VELUX Dachfenster in Bochum — inkl. Eindeckrahmen, Rollläden, Förderberatung (BAFA/KfW) und Vor-Ort-Aufmaß.",
  provider: {
    "@type": "RoofingContractor",
    "@id": "https://www.rex-bedachung.de/#organization"
  },
  areaServed: { "@type": "City", name: "Bochum" },
  serviceType: "Dachfenster-Einbau"
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.rex-bedachung.de/" },
    { "@type": "ListItem", position: 2, name: "Dachfenster", item: "https://www.rex-bedachung.de/dachfenster-bochum" },
    { "@type": "ListItem", position: 3, name: "VELUX Preisrechner", item: "https://www.rex-bedachung.de/velux-preisrechner-bochum" }
  ]
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "VELUX Dachfenster Preisrechner – Kosten und Förderung berechnen",
  description: "Berechnen Sie die Kosten für VELUX Dachfenster inkl. Eindeckrahmen, Einbau und BAFA-Förderung. Preisrechner vom autorisierten VELUX-Partner in Bochum.",
  author: {
    "@type": "Person",
    "@id": "https://www.rex-bedachung.de/#author",
    "name": "Tim Rex"
  },
  publisher: {
    "@type": "Organization",
    "@id": "https://www.rex-bedachung.de/#organization"
  },
  datePublished: "2026-04-20",
  dateModified: "2026-04-20",
  mainEntityOfPage: "https://www.rex-bedachung.de/velux-preisrechner-bochum"
};

export default function VeluxPreisrechnerBochum() {
  return (
    <>
      <Helmet>
        <title>VELUX Dachfenster Preisrechner Bochum – Kosten & Förderung | Rex Bedachungs GmbH</title>
        <meta name="description" content="VELUX Dachfenster-Kosten online berechnen: Fenstertyp, Größe, Verglasung und Einbau konfigurieren. BAFA-Förderung und Steuerbonus prüfen. Autorisierter VELUX-Partner in Bochum seit 1984." />
        <link rel="canonical" href="https://www.rex-bedachung.de/velux-preisrechner-bochum" />
        <meta property="og:title" content="VELUX Dachfenster Preisrechner – Kosten & Förderung berechnen" />
        <meta property="og:description" content="Konfigurieren Sie Ihr VELUX Dachfenster und berechnen Sie Kosten inkl. Einbau und Fördermöglichkeiten. Rex Bedachungs GmbH, Bochum." />
        <meta property="og:url" content="https://www.rex-bedachung.de/velux-preisrechner-bochum" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>
      <OrganizationSchema />
      <AuthorSchema />

      <Breadcrumb items={[
        { label: "Startseite", href: "/" },
        { label: "Dachfenster", href: "/dachfenster-bochum" },
        { label: "VELUX Preisrechner" }
      ]} />

      {/* Hidden form for Netlify detection at build time */}
      <form name="velux-preisrechner" data-netlify="true" netlify-honeypot="bot-field" hidden>
        <input name="bot-field" />
        <input name="name" />
        <input name="email" />
        <input name="telefon" />
        <input name="strasse" />
        <input name="plz" />
        <input name="ort" />
        <input name="nachricht" />
        <input name="konfiguration" />
      </form>

      {/* Rechner-Komponente */}
      <VeluxPreisrechner />

      {/* Statischer SEO-Content-Block */}
      <div className="bg-white">
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">

          {/* Direktantwort */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Was kostet ein VELUX Dachfenster mit Einbau?</h2>
            <p className="text-slate-700 leading-relaxed">
              Die Gesamtkosten für ein VELUX Dachfenster setzen sich aus dem Fensterpreis, Eindeckrahmen, optionalem Zubehör (Rollladen, Verdunkelungsrollo) und den Einbaukosten zusammen. In Bochum beginnen die Kosten für ein Kunststoff-Schwingfenster mit ENERGIE-Verglasung, Eindeckrahmen und fachgerechtem Einbau ab ca. 1.800 € netto. Klapp-Schwingfenster, größere Formate oder die hochdämmende ENERGIE-PLUS-Verglasung liegen entsprechend höher. Mit unserem Preisrechner berechnen Sie Ihre individuelle Kostenschätzung — inkl. Prüfung der BAFA-Förderung und des Steuerbonus nach §35c EStG. Als autorisierter VELUX-Partner in Bochum erstellen wir nach der Kostenschätzung ein verbindliches Festangebot nach Vor-Ort-Begehung.
            </p>
          </section>

          {/* Preiszusammensetzung */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Woraus setzt sich der Preis zusammen?</h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              Jede Position in der Kostenschätzung enthält vier Bausteine: das Fenster selbst (VELUX UVP 2026 netto), den passenden Eindeckrahmen (EDW 2000 für Ziegeldächer), optionales Zubehör und die Einbaukosten. Die Materialpreise basieren auf der unverbindlichen Preisempfehlung von VELUX für 2026 — Ihr tatsächliches Angebot kann je nach Einkaufskonditionen abweichen.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Die Einbaukosten umfassen Demontage des Altfensters oder Erstellung der Dachöffnung, den fachgerechten Fenstereinbau mit Abdichtung und Dampfbremsenanschluss, die Eindeckrahmen-Montage sowie bei Bedarf die Rollladen- und Rollo-Installation. Die angegebenen Einbaupreise sind Mindestpreise — der tatsächliche Aufwand hängt vom Dachaufbau, der vorhandenen Eindeckung und dem Bestandszustand ab.
            </p>
          </section>

          {/* Verglasung und Förderung */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Welche Verglasung ist förderfähig?</h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              VELUX bietet drei Verglasungsstufen an: THERMO (Uw 1,3 W/m²K), ENERGIE (Uw 1,0 W/m²K) und ENERGIE PLUS (Uw 0,7 W/m²K). Für die BAFA-Förderung im Rahmen der BEG Einzelmaßnahme ist ein Uw-Wert von maximal 1,0 W/m²K vorgeschrieben — das bedeutet: nur ENERGIE und ENERGIE PLUS sind förderfähig. Die THERMO-Verglasung erfüllt zwar die GEG-Mindestanforderung, nicht aber die strengere BEG-Vorgabe.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Unser Preisrechner zeigt Ihnen automatisch, welche Positionen förderfähig sind und berechnet den geschätzten Zuschuss. Für Eigentümer ohne individuellen Sanierungsfahrplan (iSFP) prüft der Rechner zusätzlich, ob der Steuerbonus nach §35c EStG mit 20 % Steuerermäßigung die bessere Option ist.
            </p>
          </section>

          {/* Förderoptionen */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">BAFA, iSFP oder Steuerbonus — welche Förderung passt?</h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              Drei Förderwege stehen zur Verfügung: Der BAFA-Zuschuss (15 % Grundförderung, 20 % mit iSFP) wird direkt ausgezahlt und kann mit dem KfW-Ergänzungskredit (Programm 358/359, bis 120.000 € pro Wohneinheit) kombiniert werden. Der Steuerbonus nach §35c EStG bietet 20 % Steuerermäßigung über drei Jahre ohne Energieberater, erfordert aber selbstgenutztes Wohneigentum und ein Gebäudealter ab 10 Jahren. Beide Wege sind nicht für dieselbe Maßnahme kombinierbar.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Unsere <a href="/foerderung" className="text-slate-900 font-semibold underline decoration-slate-300 hover:decoration-slate-800 transition-colors">vollständige Förder-Checkliste</a> führt Sie in 14 Schritten durch den Antragsprozess — von der Erstprüfung bis zur Auszahlung.
            </p>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Häufige Fragen zum VELUX Dachfenster-Preis</h2>
            <div className="space-y-6">
              {faqData.map((f, i) => (
                <div key={i}>
                  <h3 className="text-base font-semibold text-slate-800 mb-2">{f.q}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Interne Links */}
          <section className="border-t border-slate-200 pt-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Weiterführende Informationen</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "Dachfenster-Leistungen in Bochum", href: "/dachfenster-bochum" },
                { label: "VELUX Dachfenster austauschen", href: "/velux-dachfenster-austausch-bochum" },
                { label: "VELUX Rollläden & Sonnenschutz", href: "/velux-dachfenster-rolllaeden-bochum" },
                { label: "Förder-Checkliste (BAFA/KfW)", href: "/foerderung" }
              ].map(link => (
                <a key={link.href} href={link.href} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all group">
                  <span className="text-sm text-slate-700 group-hover:text-slate-900">{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 shrink-0" />
                </a>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-slate-50 rounded-2xl p-6 text-center">
            <p className="text-lg font-bold text-slate-900 mb-2">Individuelle Beratung in Bochum</p>
            <p className="text-sm text-slate-600 mb-4">Sie möchten ein persönliches Angebot? Wir prüfen Ihr Dach vor Ort und erstellen eine verbindliche Kostenschätzung — kostenlos und unverbindlich.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="tel:+49234583100" className="inline-flex items-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-slate-700 transition-all">
                <Phone className="w-4 h-4" />0234 / 58 31 00
              </a>
              <a href="/kontakt" className="inline-flex items-center gap-2 border-2 border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-semibold text-sm hover:border-slate-400 hover:bg-white transition-all">
                Kontaktformular
              </a>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
