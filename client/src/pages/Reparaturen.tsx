import ServiceDetail from "./ServiceDetail";
const reparaturenImage = "/images/dachreparatur-bochum-rex-bedachung.webp";

export default function Reparaturen() {
  return (
    <ServiceDetail
      title="Reparaturen"
      subtitle="Schnelle Hilfe bei Dachschäden"
      description="Ob Sturmschäden, undichte Stellen oder verschlissene Dachziegel – wir reparieren Ihr Dach schnell und zuverlässig. Als erfahrener Meisterbetrieb erkennen wir Schadensursachen präzise und beheben sie fachgerecht. Kleine Reparaturen führen wir oft direkt vor Ort durch. Bei größeren Schäden beraten wir Sie kompetent über die beste Lösung – von der punktuellen Reparatur bis zur Teilsanierung."
      imageUrl={reparaturenImage}
      imageAlt="Dachreparatur Bochum – schnell und zuverlässig, Rex Bedachung"
      benefits={[
        "Schnelle Schadensanalyse",
        "Hilfe bei Sturmschäden",
        "Abwicklung mit Versicherungen",
        "Kurzfristiger Einsatz",
        "Dauerhafte und sichere Lösungen",
      ]}
      process={[
        "Schadensbesichtigung vor Ort",
        "Detaillierte Analyse der Schadensursache",
        "Transparentes Angebot mit Kostenaufstellung",
        "Termingerechte Durchführung der Reparatur",
        "Abschlussprüfung und Dokumentation",
      ]}
      metaDescription="Professionelle Dachreparaturen bei Sturmschäden und undichten Stellen. Schnelle Hilfe vom Meisterbetrieb in Bochum."
      ctaButtonText="Reparatur anfragen"
    />
  );
}
