import { useEffect } from "react";
import { Helmet } from "react-helmet";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Phone, Shield, Award, Clock } from "lucide-react";

const heroImage = "/images/dachdecker-bochum-steildach-hero.webp";
const dachwartungImage = "/images/dachdecker-inspektion-dachwartung-bochum.webp";

const steildachImage = "/images/dach-hintergrund-rex-bedachung.webp";
const flachdachImage = "/images/flachdach-sanierung-bochum-rex-bedachung.webp";
const bauklempnereiImage = "/images/kamin-sanierung-bochum-dachdecker.webp";
const dachfensterImage = "/images/velux-dachfenster-bochum-typ2.webp";
const reparaturenImage = "/images/dachreparatur-bochum-rex-bedachung.webp";

export default function Home() {
  useEffect(() => {
    (window as any).loadProSeal = function () {
      (window as any).provenExpert.proSeal({
        widgetId: "0294238a-1e71-4d0d-a711-160b1a355db3",
        language: "de-DE",
        usePageLanguage: false,
        bannerColor: "#097E92",
        textColor: "#FFFFFF",
        showBackPage: true,
        showReviews: true,
        hideDate: true,
        hideName: false,
        googleStars: true,
        displayReviewerLastName: false,
        embeddedSelector: "#proSealWidget",
      });
    };

    const element = document.getElementById("proSealWidget");
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const script = document.createElement("script");
        script.src = "https://s.provenexpert.net/seals/proseal-v2.js";
        script.async = true;
        script.onload = (window as any).loadProSeal;
        document.body.appendChild(script);
        observer.disconnect();
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

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
      imageAlt: "Flachdach Sanierung Bochum – Rex Bedachungs GmbH Fachbetrieb",
      href: "/leistungen/flachdach",
      benefits: [
        "Moderne Abdichtungssysteme",
        "Energieeffiziente Lösungen",
        "Gründach-Optionen",
      ],
    },
    {
      title: "Bauklempnerei",
      description: "Maßgefertigte Blecharbeiten, Dachrinnen, Regenfallrohre und Wandbekleidungen",
      imageUrl: bauklempnereiImage,
      imageAlt: "Kamin Sanierung Bochum – Dachdecker Rex Bedachung",
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
      imageAlt: "VELUX Dachfenster Bochum – Rex Bedachungs GmbH",
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
      imageAlt: "Dachreparatur Bochum – schnell und zuverlässig, Rex Bedachung",
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
  <meta name="description" content="Rex Bedachungs GmbH – Meisterbetrieb für Steildach, Flachdach, Bauklempnerei und Dachfenster in Bochum & Ruhrgebiet. 40 Jahre Erfahrung. Jetzt Angebot anfragen!" />
  <meta property="og:title" content="Rex Bedachungs GmbH - Ihr Dach in Meisterhand" />
  <meta property="og:description" content="Professionelle Dachdeckerarbeiten im Ruhrgebiet. Meisterbetrieb mit 40 Jahren Erfahrung." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://www.rex-bedachung.de/" />
  <meta property="og:image" content={heroImage} />
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "RoofingContractor",
      "name": "Rex Bedachungs GmbH",
      "url": "https://www.rex-bedachung.de",
      "logo": "https://www.rex-bedachung.de/logo.png",
      "image": "https://www.rex-bedachung.de/og-image.jpg",
      "description": "Rex Bedachungs GmbH ist ein Dachdecker-Meisterbetrieb in Bochum mit über 40 Jahren Erfahrung. Wir bieten Steildach, Flachdach, Bauklempnerei, Dachfenster, Reparaturen und Dachwartung im gesamten Ruhrgebiet.",
      "foundingYear": "1984",
      "telephone": "+49-234-583100",
      "faxNumber": "+49-234-583137",
      "email": "info@rex-bedachung.de",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Paulinenstraße 22",
        "addressLocality": "Bochum",
        "postalCode": "44799",
        "addressRegion": "Nordrhein-Westfalen",
        "addressCountry": "DE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "51.4818",
        "longitude": "7.2162"
      },
      "areaServed": [
        { "@type": "City", "name": "Bochum" },
        { "@type": "City", "name": "Dortmund" },
        { "@type": "City", "name": "Essen" },
        { "@type": "City", "name": "Herne" },
        { "@type": "City", "name": "Witten" },
        { "@type": "City", "name": "Gelsenkirchen" },
        { "@type": "City", "name": "Recklinghausen" }
      ],
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "07:00",
          "closes": "17:00"
        }
      ],
      "priceRange": "€€",
      "currenciesAccepted": "EUR",
      "paymentAccepted": "Rechnung, Überweisung",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Dachdeckerleistungen",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Steildach", "url": "https://www.rex-bedachung.de/leistungen/steildach" }},
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Flachdach", "url": "https://www.rex-bedachung.de/leistungen/flachdach" }},
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Bauklempnerei", "url": "https://www.rex-bedachung.de/leistungen/bauklempnerei" }},
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Dachfenster", "url": "https://www.rex-bedachung.de/leistungen/dachfenster" }},
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Reparaturen", "url": "https://www.rex-bedachung.de/leistungen/reparaturen" }},
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Dachwartung", "url": "https://www.rex-bedachung.de/leistungen/dachwartung" }}
        ]
      },
      "sameAs": [
        "https://www.google.com/maps?cid=rex-bedachung-bochum",
        "https://www.gelbeseiten.de/rex-bedachung"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.4",
        "reviewCount": "12",
        "bestRating": "5"
      }
    })}
  </script>
</Helmet>
      <Hero
        title="Ihr Partner rund um's Dach"
        subtitle="Rex Bedachungs GmbH"
        description="Ihr Partner für handwerkliche Präzision im Ruhrgebiet. Wir realisieren Ihre energetische Dachsanierung nach GEG und maximieren Ihre Ersparnis durch staatliche Förderungen von BAFA und KfW. Von der fachgerechten Flachdachabdichtung bis zum zertifizierten VELUX-Fenstereinbau – wir bringen Meisterqualität auf Ihr Dach, die schützt, überzeugt und sich durch attraktive Zuschüsse bezahlt macht. Steildach, Flachdach, Reparatur, Sanierung, Dachfenster und Bauklempnerei - Wir sind Ihr zuverlässiger Partner für alle Arbeiten rund um's Dach."
        imageUrl={heroImage}
        imageAlt="Dachdecker Bochum – Rex Bedachungs GmbH Steildach"
        showCTAs={true}
      />

      <section className="py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-semibold text-lg mb-2">Meisterbetrieb</h2>
              <p className="text-sm text-muted-foreground">Mitglied der Dachdecker-Innung</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-semibold text-lg mb-2">40 Jahre</h2>
              <p className="text-sm text-muted-foreground">Erfahrung im Dachhandwerk</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-semibold text-lg mb-2">Schnelle Hilfe</h2>
              <p className="text-sm text-muted-foreground">Bei Reparaturen und Sturmschäden</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-semibold text-lg mb-2">Persönlich</h2>
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

      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 flex justify-center">
          <noscript>
            <a
              href="https://www.provenexpert.com/rex-bedachung/?utm_source=seals&utm_campaign=embedded-proseal&utm_medium=profile&utm_content=0294238a-1e71-4d0d-a711-160b1a355db3"
              target="_blank"
              rel="noopener noreferrer"
              title="Customer reviews &amp; experiences for Rex Bedachung"
            >
              More info
            </a>
          </noscript>
          <div id="proSealWidget"></div>
        </div>
      </section>

      <section className="py-16 md:py-20 lg:py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Bereit für Ihr Projekt?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-primary-foreground/90">
            Kontaktieren Sie uns für ein unverbindliches Angebot. Wir beraten Sie gerne 
            persönlich.
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
