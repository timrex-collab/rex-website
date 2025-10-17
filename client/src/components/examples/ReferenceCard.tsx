import ReferenceCard from '../ReferenceCard';
import referenceImage from '@assets/generated_images/Modern_roofing_hero_image_4713fc6f.png';

export default function ReferenceCardExample() {
  return (
    <div className="p-8 max-w-md">
      <ReferenceCard
        title="Einfamilienhaus Bochum-Stiepel"
        location="Bochum"
        service="Steildach"
        year="2024"
        description="Komplette Neueindeckung mit hochwertigen Tonziegeln. Inklusive neuer Dachdämmung und Dachfenster."
        imageUrl={referenceImage}
        imageAlt="Einfamilienhaus mit neuem Dach"
      />
    </div>
  );
}
