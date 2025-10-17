import Hero from '../Hero';
import heroImage from '@assets/generated_images/Modern_roofing_hero_image_4713fc6f.png';

export default function HeroExample() {
  return (
    <Hero
      title="Ihr Dach in Meisterhand"
      subtitle="Rex Bedachungs GmbH"
      description="Professionelle Dachdeckerarbeiten im Ruhrgebiet. Vom Steildach bis zur Bauklempnerei – wir sind Ihr zuverlässiger Partner für alle Arbeiten rund ums Dach."
      imageUrl={heroImage}
      imageAlt="Modernes Dach mit roten Ziegeln"
      showCTAs={true}
    />
  );
}
