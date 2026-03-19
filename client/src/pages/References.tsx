import { Helmet } from "react-helmet";
import Hero from "@/components/Hero";
import ReferenceCard from "@/components/ReferenceCard";
const entwaesserung1 = "/images/flachdach-sanierung-bochum-rex-bedachung.webp";

const heroImage = "/images/tondach-hero-dachdeckung-bochum.webp";
const heroImageFallback = "/images/tondach-hero-dachdeckung-bochum.jpg";
const ref1Image = "/images/gruendach-intensive-begruenung-bochum.webp";
const gruendach2 = "/images/gruendach-extensive-begruenung-bochum.webp";
const gruendach3 = "/images/gruendach-bochum-dachbegruenung-experten.webp";
const tondach1 = "/images/tondach-dachziegel-bochum-typ1.webp";
const tondach1Fallback = "/images/tondach-dachziegel-bochum-typ1.jpg";
const tondach2 = "/images/tondach-dachziegel-bochum-typ2.webp";
const tondach2Fallback = "/images/tondach-dachziegel-bochum-typ2.jpg";
const tondach3 = "/images/tondach-ziegel-bochum-steildach-3.webp";
const tondach3Fallback = "/images/tondach-ziegel-bochum-steildach-3.jpg";
const tondach4 = "/images/tondach-dachziegel-bochum-typ4.webp";
const tondach4Fallback = "/images/tondach-dachziegel-bochum-typ4.jpg";
const tondach6 = "/images/tondach-dachziegel-bochum-typ6.webp";
const tondach6Fallback = "/images/tondach-dachziegel-bochum-typ6.jpg";
const tondach7 = "/images/tondach-dachziegel-bochum-typ7.webp";
const tondach7Fallback = "/images/tondach-dachziegel-bochum-typ7.jpg";
const velux1 = "/images/velux-dachfenster-einbau-bochum-typ1.webp";
const velux1Fallback = "/images/velux-dachfenster-einbau-bochum-typ1.jpg";

export default function References() {
  const references = [
    {
      title: "Velux Dachfenster Sanierung Bochum",
      location: "Bochum",
      service: "Dachfenster",
      year: "2025",
      description: "Lichtlösung Raum.  Mehr Raumgewinn und Kopffreiheit durch Kombi-Aufkeilrahmen. Mit Solar-Rollläden für Hitzeschutz und Verdunkelung.",
      imageUrl: velux1,
      imageUrlFallback: velux1Fallback,
      imageAlt: "VELUX Dachfenster Einbau Bochum – Fachbetrieb Rex",
    },
    {
      title: "Neubaugebiet Hattingen",
      location: "Hattingen",
      service: "Steildach",
      year: "2022",
      description: "Steil- und Zeltdächer mit Tondachziegeln und hochwertigen Zinkblechen.",
      imageUrls: [tondach4, tondach6, tondach7, entwaesserung1],
      imageFallbacks: [tondach4Fallback, tondach6Fallback, tondach7Fallback, undefined],
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
      imageFallbacks: [tondach2Fallback, tondach1Fallback],
      imageAlt: "Tondach Dachziegel Bochum – Steildach Qualität Rex Bedachung",
    },
    {
      title: "Einfamilienhaus Bochum Querenburg",
      location: "Bochum",
      service: "Steildach",
      year: "2019",
      description: "Steildach mit hochwertigen Tondachziegeln. Professionelle Ausführung für langlebigen Wetterschutz.",
      imageUrl: tondach3,
      imageUrlFallback: tondach3Fallback,
      imageAlt: "Tondach Dachziegel Bochum – Steildach Qualität Rex Bedachung",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Referenzen – Rex Bedachungs GmbH | Dachdecker Bochum</title>
        <meta name="description" content="Referenzprojekte von Rex Bedachungs GmbH Bochum – Steildach, Flachdach, Gründach und Bauklempnerei im Ruhrgebiet. Überzeugen Sie sich selbst." />
        <link rel="canonical" href="https://www.rex-bedachung.de/referenzen" />
        <meta property="og:title" content="Referenzen - Rex Bedachungs GmbH" />
        <meta property="og:description" content="Überzeugen Sie sich von unserer Arbeit. Referenzprojekte aus Bochum und Umgebung." />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/dach-hintergrund-rex-bedachung.webp" />
        <meta property="og:site_name" content="Rex Bedachungs GmbH" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.rex-bedachung.de/images/dach-hintergrund-rex-bedachung.webp" />
        <script type="application/ld+json">{`{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Startseite","item":"https://www.rex-bedachung.de/"},{"@type":"ListItem","position":2,"name":"Referenzen","item":"https://www.rex-bedachung.de/referenzen"}]}`}</script>
      </Helmet>

      <Hero
        title="Referenzen"
        subtitle="Unsere Projekte sprechen für sich"
        description="Überzeugen Sie sich von der Qualität unserer Arbeit. Hier finden Sie eine Auswahl erfolgreich abgeschlossener Projekte im Ruhrgebiet."
        imageUrl={heroImage}
        imageFallbackUrl={heroImageFallback}
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
