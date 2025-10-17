import ServiceDetail from "./ServiceDetail";
import dachwartungImage from "@assets/generated_images/Roof_maintenance_professionals_86485d78.png";

export default function Dachwartung() {
  return (
    <ServiceDetail
      title="Dachwartung"
      subtitle="Vorsorge statt Nachsorge"
      description="Regelmäßige Wartung verlängert die Lebensdauer Ihres Daches erheblich und vermeidet teure Folgeschäden. Wir prüfen Ihr Dach auf Schäden, reinigen Dachrinnen, kontrollieren Abdichtungen und beheben kleine Mängel sofort. Auf Wunsch bieten wir Wartungsverträge mit regelmäßigen Inspektionen – für Ihre Sicherheit und Werterhaltung."
      imageUrl={dachwartungImage}
      imageAlt="Professionelle Dachwartung und Inspektion"
      benefits={[
        "Regelmäßige Inspektion durch Fachleute",
        "Schadensprävention und Werterhaltung",
        "Reinigung von Dachrinnen und Kehlen",
        "Kontrolle von Abdichtungen",
        "Wartungsverträge verfügbar",
      ]}
      process={[
        "Sichtprüfung aller Dachbereiche",
        "Reinigung von Dachrinnen und Abläufen",
        "Kontrolle von Dichtungen und Anschlüssen",
        "Dokumentation mit Fotos",
        "Behebung kleiner Mängel vor Ort",
      ]}
      metaDescription="Professionelle Dachwartung und Inspektion zur Schadensprävention. Wartungsverträge vom Meisterbetrieb in Bochum."
    />
  );
}
