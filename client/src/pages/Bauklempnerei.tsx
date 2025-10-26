import ServiceDetail from "./ServiceDetail";
import bauklempnereiImage from "@assets/generated_images/Metal_roofing_craftsmanship_aa78a2e6.png";

export default function Bauklempnerei() {
  return (
    <ServiceDetail
      title="Bauklempnerei"
      subtitle="Präzise Metallarbeiten"
      description="Hochwertige Blecharbeiten sind entscheidend für die Langlebigkeit und Optik Ihres Daches. Unsere Klempner fertigen alle Bauteile maßgenau in unserer Werkstatt: Dachrinnen, Fallrohre, Verwahrungen, Kehlen und Fassadenverkleidungen. Wir arbeiten mit langlebigen Materialien wie Titanzink, Kupfer oder Edelstahl und garantieren fachgerechte Montage."
      imageUrl={bauklempnereiImage}
      imageAlt="Hochwertige Klempnerarbeiten in Zink"
      benefits={[
        "Maßgefertigte Bauteile aus eigener Werkstatt",
        "Hochwertige Materialien (Zink, Kupfer, Aluminium)",
        "Dachrinnen, Fallrohre, Verwahrungen",
        "Fassadenverkleidungen und Attiken",
        "Fachgerechte Montage und Abdichtung",
      ]}
      process={[
        "Aufmaß vor Ort",
        "Anfertigung in eigener Werkstatt",
        "Termingerechte Montage",
        "Fachgerechte Abdichtung aller Anschlüsse",
        "Endabnahme mit Kunden",
      ]}
      metaDescription="Professionelle Bauklempnerei für Dachrinnen, Verwahrungen und Fassadenverkleidungen. Maßanfertigung vom Meisterbetrieb."
    />
  );
}
