import ServiceDetail from "./ServiceDetail";
import dachfensterImage from "@assets/Velux2.jpg";

export default function Dachfenster() {
  return (
    <ServiceDetail
      title="Dachfenster"
      subtitle="Mehr Licht unterm Dach"
      description="Dachfenster schaffen Tageslicht und Wohnkomfort in Dachgeschossen. Wir als Fachbetrieb der führende Hersteller, beraten Sie kompetent bei der Auswahl des passenden Fensters. Ob Schwingfenster, Klapp-Schwingfenster oder Ausstiegsfenster – wir sorgen für fachgerechten Einbau mit Sonnenschutz, Rollläden und optimaler Wärmedämmung."
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
