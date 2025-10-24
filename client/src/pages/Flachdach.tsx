import ServiceDetail from "./ServiceDetail";
import flachdachImage from "@assets/generated_images/Flat_roof_installation_f99a2939.png";

export default function Flachdach() {
  return (
    <ServiceDetail
      title="Flachdach"
      subtitle="Moderne Abdichtungssysteme"
      description="Flachdächer erfordern besondere Expertise in der Abdichtung. Mit modernen Materialien und bewährten Verfahren sorgen wir für eine zuverlässige, langlebige Dachabdichtung. Ob Bitumen, Kunststoff oder EPDM – wir beraten Sie kompetent und finden die optimale Lösung für Ihr Gebäude. Auf Wunsch realisieren wir auch Gründächer oder begehbare Dachterrassen."
      imageUrl={flachdachImage}
      imageAlt="Moderne Flachdach-Abdichtung"
      benefits={[
        "Moderne Abdichtungssysteme (Bitumen, Kunststoff, EPDM)",
        "Energieeffiziente Dämmung",
        "Gründach und Dachbegrünung möglich",
        "Begehbare Dachterrassen",
        "Wartungsverträge für langfristige Sicherheit",
      ]}
      process={[
        "Bestandsaufnahme und Zustandsanalyse",
        "Beratung zu Abdichtungssystemen",
        "Fachgerechte Ausführung der Abdichtung",
        "Qualitätskontrolle und Dichtheitsprüfung",
        "Optional: Wartungsvertrag abschließen",
      ]}
      metaDescription="Professionelle Flachdach-Abdichtung und Sanierung für Wohn- und Gewerbeimmobilien. Moderne Systeme vom Meisterbetrieb."
    />
  );
}
