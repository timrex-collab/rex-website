import { Helmet } from "react-helmet";
import ServiceDetail from "./ServiceDetail";
const flachdachImage = "/images/flachdach-sanierung-bochum-rex-bedachung.webp";

export default function Flachdach() {
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <ServiceDetail
        title="Flachdach"
      subtitle="Moderne Abdichtungssysteme"
      description="Flachdächer erfordern besondere Expertise in der Abdichtung. Mit modernen Materialien und bewährten Verfahren sorgen wir für eine zuverlässige, langlebige Dachabdichtung. Ob Bitumen, Kunststoff oder EPDM – wir beraten Sie kompetent und finden die optimale Lösung für Ihr Gebäude. Auf Wunsch realisieren wir auch Gründächer oder begehbare Dachterrassen."
      imageUrl={flachdachImage}
      imageAlt="Flachdach Sanierung Bochum – Rex Bedachungs GmbH Fachbetrieb"
      benefits={[
        "Moderne Abdichtungssysteme (Bitumen, Kunststoff, EPDM)",
        "Energieeffiziente Dämmung",
        "Gründach und Dachbegrünung",
        "Dachterrassen und Balkone",
        "Wartungsverträge für langfristige Sicherheit",
      ]}
      process={[
        "Bestandsaufnahme und Zustandsanalyse",
        "Beratung zu Abdichtungssystemen",
        "Fachgerechte Ausführung und Abdichtung",
        "Qualitätskontrolle und Dichtheitsprüfung",
        "Optional: Wartungsvertrag abschließen",
      ]}
      metaDescription="Professionelle Flachdach-Abdichtung und Sanierung für Wohn- und Gewerbeimmobilien. Moderne Systeme vom Meisterbetrieb."
      />
    </>
  );
}
