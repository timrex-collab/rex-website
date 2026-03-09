import { Helmet } from "react-helmet";
import Hero from "@/components/Hero";
import ReferenceCard from "@/components/ReferenceCard";
import ref2Image from "@assets/generated_images/Flat_roof_installation_f99a2939.png";
import ref3Image from "@assets/generated_images/Metal_roofing_craftsmanship_aa78a2e6.png";
import ref4Image from "@assets/generated_images/Roof_windows_installation_be212f7f.png";
import entwaesserung1 from "@assets/Entwaesserung1.jpg";

const heroImage = "/images/tondach-hero-dachdeckung-bochum.webp";
const ref1Image = "/images/gruendach-intensive-begruenung-bochum.webp";
const gruendach2 = "/images/gruendach-extensive-begruenung-bochum.webp";
const gruendach3 = "/images/gruendach-bochum-dachbegruenung-experten.webp";
const tondach1 = "/images/tondach-dachziegel-bochum-typ1.webp";
const tondach2 = "/images/tondach-dachziegel-bochum-typ2.webp";
const tondach3 = "/images/tondach-ziegel-bochum-steildach-3.webp";
const tondach4 = "/images/tondach-dachziegel-bochum-typ4.webp";
const tondach6 = "/images/tondach-dachziegel-bochum-typ6.webp";
const tondach7 = "/images/tondach-dachziegel-bochum-typ7.webp";
const velux1 = "/images/velux-dachfenster-einbau-bochum-typ1.webp";

export default function References() {
  const references = [
    {
      title: "Velux Dachfenster Sanierung Bochum",
      location: "Bochum",
      service: "Dachfenster",
      year: "2025",
      description: "Lichtlösung Raum.  Mehr Raumgewinn und Kopffreiheit durch Kombi-Aufkeilrahmen. Mit Solar-Rollläden für Hitzeschutz und Verdunkelung.",
      imageUrl: velux1,
      imageAlt: "VELUX Dachfenster Einbau Bochum – zertifizierter Fachbetrieb Rex",
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
      title: "Einfamilienhaus Bochum Weitmar",
      location: "Bochum",
      service: "Gründach",
      year: "2021",
      description: "Gründach mit extensiver Dachbegrünung. Aufbau einer neuen Wärmedämmung für bessere Energieeffizienz.",
      imageUrls: [ref1Image, gruendach3],
      imageAlt: "Gründach intensive Begrünung Bochum – Rex Bedachungs GmbH",
    },
    {
      title: "Gründach mit Photovoltaik",
      location: "Bochum",
      service: "Bauklempnerei",
      year: "2020",
      description: "Gründach mit extensiver Dachbegrünung und Photovoltaikmodulen.",
      imageUrl: gruendach2,
      imageAlt: "Gründach extensive Begrünung Bochum – Rex Bedachungs GmbH",
    },
    {
      title: "Wohnhaus Bochum-Stiepel",
      location: "Bochum",
      service: "Steildach",
      year: "2020",
      description: "Komplettsanierung mit Erstellung von zwei großen Dachgauben",
      imageUrls: [tondach2, tondach1],
      imageAlt: "Tondach Dachziegel Bochum – Steildach Qualität Rex Bedachung",
    },
    {
      title: "Einfamilienhaus Bochum Querenburg",
      location: "Bochum",
      service: "Steildach",
      year: "2019",
      description: "Steildach mit hochwertigen Tondachziegeln. Professionelle Ausführung für langlebigen Wetterschutz.",
      imageUrl: tondach3,
      imageAlt: "Tondach Dachziegel Bochum – Steildach Qualität Rex Bedachung",
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
