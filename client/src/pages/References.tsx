import { Helmet } from "react-helmet";
import Hero from "@/components/Hero";
import ReferenceCard from "@/components/ReferenceCard";
import heroImage from "@assets/tondach_hero.png";
import ref1Image from "@assets/hintergrund.jpg";
import ref2Image from "@assets/generated_images/Flat_roof_installation_f99a2939.png";
import ref3Image from "@assets/generated_images/Metal_roofing_craftsmanship_aa78a2e6.png";
import ref4Image from "@assets/generated_images/Roof_windows_installation_be212f7f.png";

export default function References() {
  const references = [
    {
      title: "Einfamilienhaus Bochum-Stiepel",
      location: "Bochum",
      service: "Steildach",
      year: "2024",
      description: "Komplette Neueindeckung mit hochwertigen Tonziegeln. Inklusive neuer Dachdämmung nach EnEV und Einbau von drei Dachfenstern.",
      imageUrl: ref1Image,
      imageAlt: "Einfamilienhaus mit neuem Steildach in Bochum-Stiepel",
    },
    {
      title: "Mehrfamilienhaus Dortmund",
      location: "Dortmund",
      service: "Flachdach",
      year: "2024",
      description: "Sanierung der Flachdach-Abdichtung mit modernem Kunststoffsystem. Aufbau einer neuen Wärmedämmung für bessere Energieeffizienz.",
      imageUrl: ref2Image,
      imageAlt: "Mehrfamilienhaus mit saniertem Flachdach",
    },
    {
      title: "Gewerbeimmobilie Essen",
      location: "Essen",
      service: "Bauklempnerei",
      year: "2023",
      description: "Komplette Erneuerung der Dachentwässerung mit maßgefertigten Zink-Dachrinnen und Fallrohren. Inklusive Fassadenverkleidung.",
      imageUrl: ref3Image,
      imageAlt: "Gewerbeimmobilie mit neuer Dachentwässerung",
    },
    {
      title: "Denkmalgeschütztes Haus Hattingen",
      location: "Hattingen",
      service: "Steildach",
      year: "2023",
      description: "Sanierung eines denkmalgeschützten Schieferdachs unter Beachtung aller Auflagen. Traditionelle Handwerkskunst mit modernen Dämmmethoden.",
      imageUrl: heroImage,
      imageAlt: "Denkmalgeschütztes Haus mit saniertem Schieferdach",
    },
    {
      title: "Wohnhaus Bochum-Querenburg",
      location: "Bochum",
      service: "Dachfenster",
      year: "2024",
      description: "Dachgeschoss-Ausbau mit Einbau von fünf großen Dachfenstern für optimale Belichtung. Perfekte Integration ins bestehende Dach.",
      imageUrl: ref4Image,
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
