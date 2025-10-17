import ServiceCard from '../ServiceCard';
import steildachImage from '@assets/generated_images/Pitched_roof_tiles_detail_fc192a30.png';

export default function ServiceCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <ServiceCard
        title="Steildach"
        description="Fachgerechte Eindeckung und Sanierung von Steildächern mit hochwertigen Materialien."
        imageUrl={steildachImage}
        imageAlt="Steildach mit roten Ziegeln"
        href="/leistungen/steildach"
        benefits={[
          "Alle gängigen Dachformen",
          "Hochwertige Materialien",
          "Langlebige Lösungen"
        ]}
      />
    </div>
  );
}
