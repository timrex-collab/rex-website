import { Helmet } from "react-helmet";
import Hero from "@/components/Hero";
import ReferenceCard from "@/components/ReferenceCard";
import heroImage from "@assets/tondach_hero.png";
import ref1Image from "@assets/Gründach1.jpg";
import gruendach2 from "@assets/Gründach2.jpg";
import gruendach3 from "@assets/Gruendach3.jpg";
import ref2Image from "@assets/generated_images/Flat_roof_installation_f99a2939.png";
import ref3Image from "@assets/generated_images/Metal_roofing_craftsmanship_aa78a2e6.png";
import ref4Image from "@assets/generated_images/Roof_windows_installation_be212f7f.png";
import tondach1 from "@assets/Tondach1.png";
import tondach2 from "@assets/Tondach2.png";
import tondach4 from "@assets/Tondach4.jpg";
import tondach6 from "@assets/Tondach6.jpg";
import tondach7 from "@assets/Tondach7.jpg";
import entwaesserung1 from "@assets/Entwaesserung1.jpg";
import velux1 from "@assets/Velux1_1761088286795.png";

export default function References() {
  const references = [
    {
      title: "Einfamilienhaus Bochum Weitmar",
      location: "Bochum",
      service: "Gründach",
      year: "2021",
      description: "Gründach mit extensiver Dachbegrünung. Aufbau einer neuen Wärmedämmung für bessere Energieeffizienz.",
      imageUrls: [ref1Image, gruendach3],
      imageAlt: "Einfamilienhaus mit Gründach in Bochum-Weitmar",
    },
    {
      title: "Neubaugebiet Hattingen",
      location: "Hattingen",
      service: "Steildach",
      year: "2022",
      description: "Steil- und Zeltdächer mit Tondachziegeln und hochwertigen Zinkblechen.",
      imageUrls: [tondach4, tondach6, tondach7, entwaesserung1],
      imageAlt: "Neubaugebiet mit Steildächern und Tondachziegeln",
    },
    {
      title: "Gründach mit Photovoltaik",
      location: "Bochum",
      service: "Bauklempnerei",
      year: "2020",
      description: "Gründach mit extensiver Dachbegrünung und Photovoltaikmodulen.",
      imageUrl: gruendach2,
      imageAlt: "Gründach mit Photovoltaik",
    },
    {
      title: "Velux Dachfenster Sanierung Bochum",
      location: "Bochum",
      service: "Dachfenster",
      year: "2025",
      description: "Lichtlösung Raum.  Mehr Raumgewinn und Kopffreiheit durch Kombi-Aufkeilrahmen. Mit Solar-Rollläden für Hitzeschutz und Verdunkelung.",
      imageUrl: velux1,
      imageAlt: "Velux Dachfenster Sanierung Bochum",
    },
    {
      title: "Wohnhaus Bochum-Querenburg",
      location: "Bochum",
      service: "Dachfenster",
      year: "2024",
      description: "Komplettsanierung mit Erstellung von zwei großen Dachgauben",
      imageUrls: [tondach2, tondach1],
      imageAlt: "Wohnhaus mit neuen Dachfenstern",
    },
    {
      title: "Lagerhalle Witten",
      location: "Witten",
      service: "Flachdach",
      year: "2023",
      description: "Neuabdichtung einer 800m² großen Flachdachfläche mit Bitumenbahnen. Inklusive Gründach-Aufbau für besseres Mikroklima.",
      imageUrl: ref2Image,
      imageAlt: "Lagerhalle mit neuem Flachdach und Gründach",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Referenzen - Rex Bedachungs GmbH | Dachdecker Bochum</title>
        <meta name="description" content="Unsere erfolgreich abgeschlossenen Dachprojekte im Ruhrgebiet. Steildach, Flachdach und mehr vom Meisterbetrieb." />
        <meta property="og:title" content="Referenzen - Rex Bedachungs GmbH" />
        <meta property="og:description" content="Überzeugen Sie sich von unserer Arbeit. Referenzprojekte aus Bochum und Umgebung." />
      </Helmet>

      <Hero
        title="Referenzen"
        subtitle="Unsere Projekte sprechen für sich"
        description="Überzeugen Sie sich von der Qualität unserer Arbeit. Hier finden Sie eine Auswahl erfolgreich abgeschlossener Projekte im Ruhrgebiet."
        imageUrl={heroImage}
        imageAlt="Erfolgreich abgeschlossene Dachprojekte"
        showCTAs={false}
      />

      <section className="py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {references.map((reference, index) => (
              <ReferenceCard key={index} {...reference} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
