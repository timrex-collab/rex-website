import { Helmet } from "react-helmet";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import heroImage from "@assets/tondach_hero.png";
import steildachImage from "@assets/hintergrund.jpg";
import flachdachImage from "@assets/generated_images/Flat_roof_installation_f99a2939.png";
import bauklempnereiImage from "@assets/kamin_1.jpg";
import dachfensterImage from "@assets/Velux2.jpg";
import reparaturenImage from "@assets/stock_images/professional_roofer__9ee8341f.jpg";
import dachwartungImage from "@assets/Dachdecker bei der Inspektion der Naht_1761081506440.png";

export default function Services() {
  const services = [
    {
      title: "Steildach",
      description: "Fachgerechte Eindeckung und Sanierung von Steildächern mit hochwertigen Materialien wie Ton-, Beton- oder Schieferziegeln.",
      imageUrl: steildachImage,
      imageAlt: "Steildach mit roten Ziegeln",
      href: "/leistungen/steildach",
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
      imageAlt: "Moderne Flachdach-Installation",
      href: "/leistungen/flachdach",
      benefits: [
        "Moderne Abdichtungssysteme",
        "Energieeffiziente Lösungen",
        "Gründach-Optionen",
      ],
    },
    {
      title: "Bauklempnerei",
      description: "Maßgefertigte Blecharbeiten für Dachrinnen, Verwahrungen, Kehlen und Fassadenverkleidungen aus Zink, Kupfer oder Edelstahl.",
      imageUrl: bauklempnereiImage,
      imageAlt: "Professionelle Metallarbeiten am Dach",
      href: "/leistungen/bauklempnerei",
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
      imageAlt: "Moderne Dachfenster-Installation",
      href: "/leistungen/dachfenster",
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
      imageAlt: "Professionelle Dachreparatur",
      href: "/leistungen/reparaturen",
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
      href: "/leistungen/dachwartung",
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
        <meta name="description" content="Umfassende Dachdeckerleistungen: Steildach, Flachdach, Bauklempnerei, Dachfenster und Dachwartung. Meisterbetrieb im Ruhrgebiet." />
        <meta property="og:title" content="Unsere Leistungen - Rex Bedachungs GmbH" />
        <meta property="og:description" content="Umfassende Dachdeckerleistungen von Ihrem Meisterbetrieb im Ruhrgebiet." />
      </Helmet>

      <Hero
        title="Unsere Leistungen"
        subtitle="Kompetenz rund ums Dach"
        description="Von der Neueindeckung über Sanierung bis zur Wartung – wir bieten Ihnen alle Leistungen aus einer Hand."
        imageUrl={heroImage}
        imageAlt="Professionelle Dacharbeiten"
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
