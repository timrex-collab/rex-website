import ServiceDetail from "./ServiceDetail";
import reparaturenImage from "@assets/stock_images/professional_roofer__9ee8341f.jpg";

export default function Reparaturen() {
  return (
    <ServiceDetail
      title="Reparaturen"
      subtitle="Schnelle Hilfe bei Dachschäden"
      description="Ob Sturmschäden, undichte Stellen oder verschlissene Dachziegel – wir reparieren Ihr Dach schnell und zuverlässig. Als erfahrener Meisterbetrieb erkennen wir Schadensursachen präzise und beheben sie fachgerecht. Kleine Reparaturen führen wir oft direkt vor Ort durch. Bei größeren Schäden beraten wir Sie kompetent über die beste Lösung – von der punktuellen Reparatur bis zur Teilsanierung."
      imageUrl={reparaturenImage}
      imageAlt="Professionelle Dachreparatur durch Fachmann"
      benefits={[
        "Schnelle Schadensanalyse durch Experten",
        "Fachgerechte Ausführung aller Arbeiten",
        "Abwicklung mit Versicherungen",
        "Notdienst bei akuten Schäden",
        "Dauerhafte und sichere Lösungen",
      ]}
      process={[
        "Kostenlose Schadensbesichtigung vor Ort",
        "Detaillierte Analyse der Schadensursache",
        "Transparentes Angebot mit Kostenaufstellung",
        "Termingerechte Durchführung der Reparatur",
        "Abschlussprüfung und Dokumentation",
      ]}
      metaDescription="Professionelle Dachreparaturen bei Sturmschäden und undichten Stellen. Schnelle Hilfe vom Meisterbetrieb in Bochum."
    />
  );
}
