import { Helmet } from "react-helmet";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Phone, Shield, Award, Clock } from "lucide-react";
import heroImage from "@assets/Datei 20.10.25, 19 56 47.jpeg";
import steildachImage from "@assets/hintergrund.jpg";
import flachdachImage from "@assets/generated_images/Flat_roof_installation_f99a2939.png";
import bauklempnereiImage from "@assets/kamin_1.jpg";
import dachfensterImage from "@assets/generated_images/Roof_windows_installation_be212f7f.png";
import reparaturenImage from "@assets/stock_images/professional_roofer__9ee8341f.jpg";
import dachwartungImage from "@assets/Dachdecker bei der Inspektion der Naht_1761081506440.png";

export default function Home() {
  const services = [
    {
      title: "Steildach",
      description: "Fachgerechte Eindeckung und Sanierung von Steildächern mit hochwertigen Materialien.",
      imageUrl: steildachImage,
      imageAlt: "Steildach mit roten Ziegeln",
      href: "/leistungen/steildach",
      benefits: [
        "Alle gängigen Dachformen",
        "Hochwertige Materialien",
        "Langlebige Lösungen",
      ],
    },
    {
      title: "Flachdach",
      description: "Professionelle Abdichtung und Sanierung von Flachdächern für Wohn- und Gewerbeimmobilien.",
      imageUrl: flachdachImage,
      imageAlt: "Moderne Flachdach-Installation",
      href: "/leistungen/flachdach",
      benefits: [
        "Moderne Abdichtungssysteme",
        "Energieeffiziente Lösungen",
        "Gründach-Optionen",
      ],
    },
    {
      title: "Bauklempnerei",
      description: "Maßgefertigte Blecharbeiten für Dachrinnen, Verwahrungen und Fassadenverkleidungen.",
      imageUrl: bauklempnereiImage,
      imageAlt: "Professionelle Metallarbeiten am Dach",
      href: "/leistungen/bauklempnerei",
      benefits: [
        "Präzise Maßanfertigung",
        "Langlebige Materialien",
        "Fachgerechte Montage",
      ],
    },
    {
      title: "Dachfenster",
      description: "Professioneller Einbau von Dachfenstern für mehr Licht und Wohnkomfort im Dachgeschoss.",
      imageUrl: dachfensterImage,
      imageAlt: "Moderne Dachfenster-Installation",
      href: "/leistungen/dachfenster",
      benefits: [
        "VELUX Spezialist",
        "Fachgerechter Einbau",
        "Rollläden und Verdunkelung",
      ],
    },
    {
      title: "Reparaturen",
      description: "Schnelle und zuverlässige Reparatur von Dachschäden, Sturmschäden und undichten Stellen.",
      imageUrl: reparaturenImage,
      imageAlt: "Professionelle Dachreparatur",
      href: "/leistungen/reparaturen",
      benefits: [
        "Schnelle Schadensanalyse",
        "Unkomplizierte Hilfe",
        "Versicherungsabwicklung",
      ],
    },
    {
      title: "Dachwartung",
      description: "Regelmäßige Inspektion und Wartung zur Werterhaltung und Vermeidung kostspieliger Schäden.",
      imageUrl: dachwartungImage,
      imageAlt: "Professionelle Dachwartung und Inspektion",
      href: "/leistungen/dachwartung",
      benefits: [
        "Umfassende Inspektion",
        "Schadensprävention",
        "Langfristiger Schutz",
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Rex Bedachungs GmbH - Ihr Dach in Meisterhand | Dachdecker Bochum</title>
        <meta name="description" content="Rex Bedachungs GmbH - Professionelle Dachdeckerarbeiten im Ruhrgebiet. Meisterbetrieb mit über 20 Jahren Erfahrung für Steildach, Flachdach, Bauklempnerei und mehr." />
        <meta property="og:title" content="Rex Bedachungs GmbH - Ihr Dach in Meisterhand" />
        <meta property="og:description" content="Professionelle Dachdeckerarbeiten im Ruhrgebiet. Meisterbetrieb mit über 20 Jahren Erfahrung." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={heroImage} />
      </Helmet>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Rex Bedachungs GmbH",
          "image": heroImage,
          "description": "Professionelle Dachdeckerarbeiten im Ruhrgebiet",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Paulinenstr. 22",
            "addressLocality": "Bochum",
            "postalCode": "44799",
            "addressCountry": "DE"
          },
          "telephone": "+49234583100",
          "email": "info@rex-bedachung.de",
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "07:00",
            "closes": "17:00"
          },
          "priceRange": "€€",
          "areaServed": {
            "@type": "GeoCircle",
            "geoMidpoint": {
              "@type": "GeoCoordinates",
              "latitude": "51.4818",
              "longitude": "7.2162"
            },
            "geoRadius": "30000"
          }
        })}
      </script>

      <Hero
        title="Ihr Partner rund um's Dach"
        subtitle="Rex Bedachungs GmbH"
        description="Professionelle Dachdeckerarbeiten in Bochum und Umgebung. Steildach, Flachdach, Reparatur, Sanierung, Dachfenster und Bauklempnerei - Wir sind Ihr zuverlässiger Partner für alle Arbeiten rund um's Dach."
        imageUrl={heroImage}
        imageAlt="Modernes Dach mit roten Ziegeln in Bochum"
        showCTAs={true}
      />

      <section className="py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Meisterbetrieb</h3>
              <p className="text-sm text-muted-foreground">Qualität und Service</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">30 Jahre</h3>
              <p className="text-sm text-muted-foreground">Erfahrung im Dachhandwerk</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Schnelle Hilfe</h3>
              <p className="text-sm text-muted-foreground">Bei Notfällen und Sturmschäden</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Persönlich</h3>
              <p className="text-sm text-muted-foreground">Beratung vor Ort </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Unsere Leistungen
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Von der fachgerechten Dacheindeckung bis zur professionellen Wartung – 
              wir bieten Ihnen das komplette Leistungsspektrum rund um Ihr Dach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>

          <div className="text-center">
            <Button asChild variant="outline" size="lg" data-testid="button-all-services">
              <Link href="/leistungen">Alle Leistungen ansehen</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 lg:py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Bereit für Ihr Projekt?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-primary-foreground/90">
            Kontaktieren Sie uns für ein unverbindliches Angebot. Wir beraten Sie gerne 
            persönlich vor Ort .
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-white text-primary hover:bg-white/90 border-white"
              data-testid="button-cta-quote"
            >
              <Link href="/kontakt">Angebot anfragen</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-transparent border-white text-white hover:bg-white/10"
              data-testid="button-cta-call"
            >
              <a href="tel:0234583100" className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>0234-583100</span>
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
