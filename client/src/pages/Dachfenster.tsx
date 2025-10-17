import ServiceDetail from "./ServiceDetail";
import dachfensterImage from "@assets/generated_images/Roof_windows_installation_be212f7f.png";

export default function Dachfenster() {
  return (
    <ServiceDetail
      title="Dachfenster"
      subtitle="Mehr Licht unterm Dach"
      description="Dachfenster schaffen Tageslicht und Wohnkomfort in Dachgeschossen. Wir sind zertifizierter Fachbetrieb für führende Hersteller und beraten Sie kompetent bei der Auswahl des passenden Fensters. Ob Schwingfenster, Klapp-Schwingfenster oder Ausstiegsfenster – wir sorgen für fachgerechten Einbau mit perfekter Abdichtung und optimaler Wärmedämmung."
      imageUrl={dachfensterImage}
      imageAlt="Moderne Dachfenster-Installation"
      benefits={[
        "Markenqualität von führenden Herstellern",
        "Große Auswahl an Größen und Ausführungen",
        "Optimale Wärmedämmung",
        "Fachgerechter Einbau mit Garantie",
        "Auch Austausch alter Fenster möglich",
      ]}
      process={[
        "Beratung zur passenden Fenstergröße",
        "Auswahl des geeigneten Fenstertyps",
        "Termingerechte Lieferung",
        "Fachgerechter Einbau mit Dämmung",
        "Einweisung in die Bedienung",
      ]}
      metaDescription="Fachgerechter Einbau von Dachfenstern für mehr Licht und Wohnkomfort. Markenqualität vom Meisterbetrieb in Bochum."
    />
  );
}
