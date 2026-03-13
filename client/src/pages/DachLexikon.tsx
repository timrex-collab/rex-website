import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Search, Book, ShieldCheck } from "lucide-react";
import Hero from "@/components/Hero";
const heroImage = "/images/tondach-hero-dachdeckung-bochum.webp";

const terms = [
  {
    term: "Asbestsanierung (TRGS 519)",
    definition:
      "Der fachgerechte Rückbau und die Entsorgung von asbesthaltigen Dach- und Fassadenprodukten (z. B. Eternit). Wir arbeiten streng nach den Technischen Regeln für Gefahrstoffe (TRGS 519), um maximale Sicherheit für Bewohner und Umwelt zu gewährleisten.",
    category: "Sicherheit",
    anchor: "asbest",
  },
  {
    term: "Attika",
    definition:
      "Die Aufmauerung am Rand eines Flachdachs. Eine fachgerechte Attika-Abdeckung aus Zink oder Aluminium schützt die Fassade vor Feuchtigkeit und sorgt für einen sauberen optischen Abschluss.",
    category: "Flachdach",
    anchor: "attika",
  },
  {
    term: "Aufsparrendämmung",
    definition:
      "Die effizienteste Methode der Wärmedämmung nach GEG. Die Dämmschicht wird lückenlos oberhalb der Sparren verlegt. Wichtig: Aufgrund des Zusatzgewichts und der veränderten Aufbauhöhe ist hierbei immer eine Prüfung der Statik und der Anschlusshöhen erforderlich.",
    category: "Energetik",
    anchor: "aufsparrendaemmung",
  },
  {
    term: "Bauklempnerei",
    definition:
      "Die handwerkliche Bearbeitung von Feinblechen (Zink, Kupfer, Aluminium). Dazu gehören Dachrinnen, Fallrohre, Kamineinfassungen und Stehfalzdächer. Präzise Metallanschlüsse sind das Herzstück eines dauerhaft regendichten Daches.",
    category: "Metallbau",
    anchor: "bauklempnerei",
  },
  {
    term: "Betondachsteine vs. Tondachziegel",
    definition:
      "Tondachziegel sind ein Naturprodukt aus gebranntem Ton, während Betondachsteine aus Zement und Sand bestehen. Beide bieten hervorragenden Schutz, unterscheiden sich aber in Ästhetik, Gewicht und Langlebigkeit.",
    category: "Steildach",
    anchor: "dachziegel",
  },
  {
    term: "Bitumenschweißbahn",
    definition:
      "Der bewährte Standard der Flachdachabdichtung. In mehreren Lagen verschweißt, bildet Bitumen eine robuste, wasserdichte Schicht. Wir verwenden ausschließlich hochfertige, polymerverstärkte Bahnen nach DIN-Norm.",
    category: "Flachdach",
    anchor: "bitumen",
  },
  {
    term: "Dachentwässerung vs. Notentwässerung",
    definition:
      "Die reguläre Dachentwässerung leitet Regenwasser in die Kanalisation. Die Notentwässerung ist ein zweites, völlig unabhängiges System (Speier oder Rohrsystem), das bei extremem Starkregen das Wasser direkt ins Freie ableitet, um eine statische Überlastung und den Einsturz des Daches zu verhindern.",
    category: "Entwässerung",
    anchor: "notentwaesserung",
  },
  {
    term: "Dampfbremse vs. Dampfsperre",
    definition:
      "Funktionale Schichten zur Regulierung der Feuchtigkeit in der Dachkonstruktion. Eine Dampfbremse lässt kontrolliert Feuchtigkeit diffundieren, während eine Dampfsperre den Durchgang von Wasserdampf fast vollständig stoppt. Die korrekte Wahl ist entscheidend zur Vermeidung von Schimmelbildung.",
    category: "Bauphysik",
    anchor: "dampfbremse",
  },
  {
    term: "EPDM-Dichtungsbahn",
    definition:
      "Ein synthetischer Kautschuk für Flachdächer. EPDM ist extrem elastisch (bis 400%), UV-beständig und hat eine Lebenserwartung von über 50 Jahren. Oft wird es in großen Planen verlegt, was das Risiko von Nahtundichtigkeiten minimiert.",
    category: "Flachdach",
    anchor: "epdm",
  },
  {
    term: "First",
    definition:
      "Die oberste, waagerechte Schnittlinie von zwei Dachflächen. Eine fachgerechte Firstausbildung (trocken verlegt mit Firstrollen) garantiert die notwendige Hinterlüftung der Dachkonstruktion und schützt vor Flugschnee.",
    category: "Steildach",
    anchor: "first",
  },
  {
    term: "Flüssigkunststoff-Abdichtung",
    definition:
      "Eine flüssig aufzubringende Harz-Beschichtung für nahtlose, gummielastische Oberflächen. Ideal für extrem komplizierte Details wie Balkonanschlüsse, Lichtkuppeln oder Durchdringungen, wo Bahnenware an ihre Grenzen stößt.",
    category: "Abdichtung",
    anchor: "fluessigkunststoff",
  },
  {
    term: "Gebäudeenergiegesetz (GEG)",
    definition:
      "Das GEG schreibt verbindliche energetische Mindeststandards vor. Es regelt, wie stark ein Dach gedämmt werden muss, wenn mehr als 10% der Fläche saniert werden. Wir beraten Sie zu den gesetzlichen Pflichten und Fördermöglichkeiten.",
    category: "Energetik",
    anchor: "geg",
  },
  {
    term: "Gründach (Dachbegrünung)",
    definition:
      "Eine ökologische Schicht aus Pflanzen auf dem Flachdach. Es dient als Hitzeschutz, hält Regenwasser zurück und schützt die Abdichtung. Achtung: Ein Gründach erfordert aufgrund der hohen Eigenlast der wassergesättigten Erde zwingend einen statischen Nachweis.",
    category: "Ökologie",
    anchor: "gruendach",
  },
  {
    term: "Kaltdach vs. Warmdach",
    definition:
      "Zwei unterschiedliche Konstruktionsprinzipien. Das Kaltdach ist belüftet (Luftschicht zwischen Dämmung und Deckung), das Warmdach ist unbelüftet (Dämmung direkt unter der Abdichtung). Jedes System hat spezifische Anforderungen an die Dampfbremse.",
    category: "Bauphysik",
    anchor: "warmdach",
  },
  {
    term: "Kamineinfassung",
    definition:
      "Der Übergang zwischen Dachfläche und Schornstein. Diese muss handwerklich präzise aus Metall (Zink/Kupfer) gefertigt werden. Fehler in diesem Bereich führen fast unweigerlich zu Feuchtigkeitsschäden im Gebälk.",
    category: "Metallbau",
    anchor: "kamineinfassung",
  },
  {
    term: "Lichtkuppel / Flachdachfenster",
    definition:
      "Elemente zur Belichtung und Belüftung von flach geneigten Dächern. Moderne Lichtkuppeln bieten heute hervorragende Dämmwerte und können auch als RWA-Anlagen (Rauch- und Wärmeabzug) dienen.",
    category: "Flachdach",
    anchor: "lichtkuppel",
  },
  {
    term: "Ortgang",
    definition:
      "Der seitliche Abschluss des Daches am Giebel. Er verbindet die Traufe mit dem First und schützt die Dachkonstruktion vor seitlichem Regen und Windlasten.",
    category: "Steildach",
    anchor: "ortgang",
  },
  {
    term: "PVC-Dichtungsbahn",
    definition:
      "Eine einlagige Abdichtung aus Polyvinylchlorid. PVC-Bahnen sind leicht, wirtschaftlich und werden per Heißluft nahtlos verschweißt. Ideal für mechanisch befestigte Systeme auf großen Industrie-Flachdächern.",
    category: "Flachdach",
    anchor: "pvc",
  },
  {
    term: "Traufe",
    definition:
      "Die untere Tropfkante des Daches, an der das Regenwasser in die Dachrinne geleitet wird. Ein sauberer Traufabschluss mit Traufblech verhindert Feuchtigkeitsschäden an der Holzkonstruktion.",
    category: "Steildach",
    anchor: "traufe",
  },
  {
    term: "Wartungsvertrag",
    definition:
      "Eine regelmäßige Überprüfung des Daches (meist jährlich). Wartung ist essenziell für den Erhalt des Versicherungsschutzes bei Sturmschäden und verhindert teure Folgeschäden durch rechtzeitige Reparatur kleiner Mängel.",
    category: "Service",
    anchor: "wartung",
  },
  {
    term: "Windsogsicherung",
    definition:
      "Maßnahmen zur Sicherung der Dachdeckung gegen Abheben durch Windkräfte. Hierbei kommen spezielle Sturmklammern (Haken) zum Einsatz, deren Anzahl und Position nach den ZVDH-Fachregeln und den lokalen Windzonen berechnet werden müssen.",
    category: "Sicherheit",
    anchor: "windsog",
  },
  {
    term: "ZVDH-Fachregeln",
    definition:
      "Das Regelwerk des Zentralverbands des Deutschen Dachdeckerhandwerks. Die Einhaltung dieser Regeln garantiert höchste Ausführungsqualität und ist die Basis für jeden rechtssicheren Gewährleistungsanspruch.",
    category: "Sicherheit",
    anchor: "zvdh",
  },
];

export default function DachLexikon() {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      name: "Dachdecker Fachlexikon - Rex Bedachungs GmbH",
      description:
        "Umfangreiches Glossar für Dachdecker-Fachbegriffe vom Meisterbetrieb aus Bochum. Erklärt Bauphysik, Materialien und Regelwerke.",
      hasDefinedTerm: terms.map((item) => ({
        "@type": "DefinedTerm",
        name: item.term,
        description: item.definition,
        url: `https://www.rex-bedachung.de/lexikon#${item.anchor}`,
      })),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const filteredTerms = terms
    .sort((a, b) => a.term.localeCompare(b.term))
    .filter(
      (item) =>
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <>
      <Helmet>
        <title>Dach-Lexikon – Fachwissen vom Meisterbetrieb Bochum</title>
        <meta
          name="description"
          content="Dachdecker-Fachlexikon vom Meisterbetrieb: Bauphysik, Materialien und Regelwerke rund ums Dach verständlich erklärt – Rex Bedachungs GmbH Bochum."
        />
        <link rel="canonical" href="https://www.rex-bedachung.de/lexikon" />
        <meta property="og:title" content="Dach-Lexikon – Fachwissen vom Meisterbetrieb | Rex Bedachungs GmbH" />
        <meta
          property="og:description"
          content="Unser Dachdecker-Fachlexikon erklärt alle wichtigen Begriffe rund ums Dach: Bauphysik, Materialien, Regelwerke und mehr."
        />
      </Helmet>

      <Hero
        title="Dach-Lexikon"
        subtitle="Fachwissen vom Meisterbetrieb"
        description="Ihr Experten-Ratgeber der Rex Bedachungs GmbH für Bochum und das Ruhrgebiet."
        imageUrl={heroImage}
        imageAlt="Tondach Hero – professionelle Dachdeckung Bochum"
        showCTAs={false}
      />

      <section className="py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">

          <div className="flex items-center gap-3 mb-8">
            <Book className="h-7 w-7 text-primary flex-shrink-0" />
            <p className="text-muted-foreground">
              {terms.length} Fachbegriffe erklärt – durchsuchen Sie unser Glossar.
            </p>
          </div>

          <div className="relative mb-10">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 border border-border rounded-md bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-base transition-colors"
              placeholder="Nach Begriffen suchen (z.B. Windsog, GEG, EPDM)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-lexikon-search"
            />
          </div>

          <div className="grid gap-4">
            {filteredTerms.length > 0 ? (
              filteredTerms.map((item, index) => (
                <div
                  key={index}
                  id={item.anchor}
                  className="bg-card border border-border rounded-md p-6"
                  data-testid={`card-term-${item.anchor}`}
                >
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-3">
                    {item.category}
                  </span>
                  <h2 className="text-lg font-bold text-foreground mb-2">
                    {item.term}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {item.definition}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Keine Begriffe zu &ldquo;{searchTerm}&rdquo; gefunden. Kontaktieren Sie uns für eine Fachberatung!
              </div>
            )}
          </div>

          <div className="mt-12 p-6 bg-card border border-border rounded-md">
            <div className="flex items-start gap-4">
              <ShieldCheck className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-base font-bold text-foreground mb-2">
                  Meister-Hinweis zu Sicherheit &amp; Haftung
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Dieses Lexikon dient der Information. Bauvorhaben am Dach sind hochkomplex. Bei Eingriffen in die{" "}
                  <strong className="text-foreground">Statik</strong> (z.B. Gründach, Aufsparrendämmung), der Berechnung der{" "}
                  <strong className="text-foreground">Windsogsicherung</strong> oder{" "}
                  <strong className="text-foreground">energetischen GEG-Nachweisen</strong> ist zwingend eine individuelle
                  Fachberatung sowie ggf. die Hinzuziehung eines Statikers oder Energieberaters erforderlich.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-8 bg-card border border-border rounded-md text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              Noch Fragen?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Wir beraten Sie persönlich zu allen Fachthemen rund ums Dach und erstellen Ihnen ein individuelles Angebot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:0234583100"
                className="inline-flex items-center justify-center gap-2 min-h-9 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground border border-primary-border hover-elevate active-elevate-2"
                data-testid="button-call-lexikon"
              >
                <span>0234-583100</span>
              </a>
              <a
                href="/kontakt"
                className="inline-flex items-center justify-center gap-2 min-h-9 px-4 py-2 rounded-md text-sm font-medium border border-border bg-card text-card-foreground hover-elevate active-elevate-2"
                data-testid="link-contact-lexikon"
              >
                Kontaktformular
              </a>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
