import { Helmet } from "react-helmet";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
const dachwartungImage = "/images/dachdecker-inspektion-dachwartung-bochum.webp";

const heroImage = "/images/tondach-hero-dachdeckung-bochum.webp";
const steildachImage = "/images/dach-hintergrund-rex-bedachung.webp";
const flachdachImage = "/images/flachdach-sanierung-bochum-rex-bedachung.webp";
const bauklempnereiImage = "/images/kamin-sanierung-bochum-dachdecker.webp";
const dachfensterImage = "/images/velux-dachfenster-einbau-bochum-fachbetrieb.webp";
const reparaturenImage = "/images/dachreparatur-bochum-rex-bedachung.webp";

export default function Services() {
  const services = [
    {
      title: "Steildach",
      description: "Fachgerechte Eindeckung und Sanierung von Steildächern mit hochwertigen Materialien wie Ton-, Beton- oder Schieferziegeln.",
      imageUrl: steildachImage,
      imageAlt: "Steildach mit roten Ziegeln",
      href: "/steildach-bochum",
      benefits: [
        "Alle gängigen Dachformen",
        "Hochwertige Materialien",
        "Langlebige Lösungen",
      ],
    },
    {
      title: "Flachdach",
      description: "Professionelle Abdichtung und Sanierung von Flachdächern für Wohn- und Gewerbeimmobilien mit modernen Systemen.",
      imageUrl: flachdachImage,
      imageAlt: "Flachdach Sanierung Bochum – Rex Bedachungs GmbH Fachbetrieb",
      href: "/flachdach-bochum",
      benefits: [
        "Moderne Abdichtungssysteme",
        "Energieeffiziente Lösungen",
        "Gründach-Optionen",
      ],
    },
    {
      title: "Bauklempnerei",
      description: "Maßgefertigte Blecharbeiten, Dachrinnen, Regenfallrohre und Wandbekleidungen",
      imageUrl: bauklempnereiImage,
      imageAlt: "Kamin Sanierung Bochum – Dachdecker Rex Bedachung",
      href: "/bauklempnerei-bochum",
      benefits: [
        "Präzise Maßanfertigung",
        "Langlebige Materialien",
        "Fachgerechte Montage",
      ],
    },
    {
      title: "Dachfenster",
      description: "Einbau und Austausch von Dachfenstern und Dachflächenfenstern für mehr Licht und Wohnkomfort unter dem Dach.",
      imageUrl: dachfensterImage,
      imageAlt: "VELUX Dachfenster Bochum – Rex Bedachungs GmbH",
      href: "/dachfenster-bochum",
      benefits: [
        "Markenqualität",
        "Fachgerechter Einbau",
        "Energieeffizient",
      ],
    },
    {
      title: "Reparaturen",
      description: "Schnelle und zuverlässige Reparatur von Dachschäden, Sturmschäden und undichten Stellen mit fachgerechter Ausführung.",
      imageUrl: reparaturenImage,
      imageAlt: "Dachreparatur Bochum – schnell und zuverlässig, Rex Bedachung",
      href: "/dachreparatur-bochum",
      benefits: [
        "Schnelle Schadensanalyse",
        "Unkomplizierte Hilfe",
        "Versicherungsabwicklung",
      ],
    },
    {
      title: "Dachwartung",
      description: "Regelmäßige Inspektion und Wartung Ihres Daches zur Vermeidung kostspieliger Schäden und Verlängerung der Lebensdauer.",
      imageUrl: dachwartungImage,
      imageAlt: "Professionelle Dachwartung",
      href: "/dachwartung-bochum",
      benefits: [
        "Schadensprävention",
        "Werterhaltung",
        "Regelmäßige Kontrolle",
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Leistungen - Rex Bedachungs GmbH | Dachdecker Bochum</title>
        <meta name="description" content="Alle Dachdeckerleistungen von Rex Bedachungs GmbH: Steildach, Flachdach, Gründach, Dachfenster, Bauklempnerei und Dachreparatur im Ruhrgebiet." />
        <link rel="canonical" href="https://www.rex-bedachung.de/leistungen" />
        <meta property="og:title" content="Dachdecker Leistungen Bochum – Rex Bedachungs GmbH" />
        <meta property="og:description" content="Umfassende Dachdeckerleistungen von Ihrem Meisterbetrieb im Ruhrgebiet." />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/dach-hintergrund-rex-bedachung.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.rex-bedachung.de/images/dach-hintergrund-rex-bedachung.webp" />
      </Helmet>

      <Hero
        title="Unsere Leistungen"
        subtitle="Kompetenz rund ums Dach"
        description="Von der Neueindeckung über Sanierung bis zur Wartung – wir bieten Ihnen alle Leistungen aus einer Hand."
        imageUrl={heroImage}
        imageAlt="Tondach Hero – professionelle Dachdeckung Bochum"
        showCTAs={false}
      />

      <section className="py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
