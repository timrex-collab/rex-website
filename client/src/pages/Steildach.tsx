import ServiceDetail from "./ServiceDetail";
import steildachImage from "@assets/hintergrund.jpg";

export default function Steildach() {
  return (
    <ServiceDetail
      title="Steildach"
      subtitle="Fachgerechte Dacheindeckung"
      description="Als Meisterbetrieb bieten wir Ihnen professionelle Steildacharbeiten für Neubauten und Sanierungen. Ob Satteldach, Walmdach oder Mansarddach – wir beherrschen alle gängigen Dachformen und arbeiten mit hochwertigen Materialien wie Ton-, Beton- oder Schieferziegeln. Unsere erfahrenen Dachdecker sorgen für eine fachgerechte Ausführung nach den neuesten Standards und gewährleisten so die Langlebigkeit Ihres Daches."
      imageUrl={steildachImage}
      imageAlt="Professionelles Steildach mit roten Tonziegeln"
      benefits={[
        "Alle gängigen Dachformen (Sattel-, Walm-, Mansarddach)",
        "Hochwertige Materialien von führenden Herstellern",
        "Fachgerechte Dämmung für optimalen Wärmeschutz",
        "Langlebige Konstruktionen mit Gewährleistung",
        "Schnelle und saubere Ausführung",
      ]}
      process={[
        "Kostenlose Vor-Ort-Besichtigung und Beratung",
        "Detaillierte Planung und transparentes Angebot",
        "Professionelle Ausführung durch Meisterbetrieb",
        "Abschlusskontrolle und Übergabe",
        "Dokumentation und Gewährleistung",
      ]}
      metaDescription="Professionelle Steildach-Eindeckung und Sanierung in Bochum und Umgebung. Meisterbetrieb mit Erfahrung für alle Dachformen."
    />
  );
}
