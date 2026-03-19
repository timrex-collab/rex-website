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
const dachfensterImage = "/images/velux-dachfenster-einbau-bochum-fachbetrieb.webp";
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
      description: "Ob Satteldach, Walmdach oder Pultdach – wir decken alle Steildachformen fachgerecht neu ein oder sanieren sie dauerhaft. Als Meisterbetrieb mit 40+ Jahren Erfahrung stehen wir für Qualität, die hält.",
      imageUrl: steildachImage,
      imageUrlFallback: "/images/dach-hintergrund-rex-bedachung.jpg",
      imageAlt: "Steildach mit roten Ziegeln",
      href: "/steildach-bochum",
      benefits: [
        "Moderne Dacheindeckung",
        "Hochwertige Materialien",
        "Langlebige Lösungen",
      ],
      ctaLabel: "Mehr zu Steildach",
    },
    {
      title: "Flachdach",
      description: "Mit modernen Abdichtungssystemen wie Bitumen, PVC oder Flüssigkunststoff sorgen wir für ein langlebiges, dichtes Flachdach – kostenlos aufgemessen und auf Wunsch mit BAFA/KfW-Förderung.",
      imageUrl: flachdachImage,
      imageAlt: "Flachdach Sanierung Bochum – Rex Bedachungs GmbH Fachbetrieb",
      href: "/flachdach-bochum",
      benefits: [
        "Moderne Abdichtungssysteme",
        "Energieeffiziente Lösungen",
        "Gründach-Optionen",
      ],
    },
    {
      title: "Bauklempnerei",
      description: "Dachrinnen, Fallrohre, Wandbekleidungen und Fassadenverkleidungen – alles maßgefertigt in unserer eigenen Werkstatt in Bochum. Titanzink, Kupfer oder Aluminium: wir beraten Sie kostenlos.",
      imageUrl: bauklempnereiImage,
      imageUrlFallback: "/images/kamin-sanierung-bochum-dachdecker.jpg",
      imageAlt: "Kamin Sanierung Bochum – Dachdecker Rex Bedachung",
      href: "/bauklempnerei-bochum",
      benefits: [
        "Präzise Maßanfertigung",
        "Langlebige Materialien",
        "Fachgerechte Montage",
      ],
      ctaLabel: "Mehr zur Bauklempnerei",
    },
    {
      title: "Dachfenster – VELUX & Roto Fachbetrieb",
      description: "Als VELUX-Fachbetrieb und Roto-Spezialist übernehmen wir Neueinbau, Austausch und Reparatur von Dachfenstern – schnell, sauber und auf Wunsch mit BAFA/KfW-Förderung.",
      imageUrl: dachfensterImage,
      imageAlt: "VELUX Dachfenster Bochum – Rex Bedachungs GmbH",
      href: "/dachfenster-bochum",
      benefits: [
        "VELUX Spezialist",
        "Fachgerechter Einbau",
        "Rollläden und Verdunkelung",
      ],
      ctaLabel: "Mehr zu Dachfenstern",
    },
    {
      title: "Reparaturen",
      description: "Sturmschaden, undichte Stellen oder defekte Ziegel? Wir reparieren alle Dachschäden kurzfristig und dauerhaft – inklusive Versicherungsabwicklung und transparenter Kostenaufstellung.",
      imageUrl: reparaturenImage,
      imageUrlFallback: "/images/dachreparatur-bochum-rex-bedachung.jpg",
      imageAlt: "Dachreparatur Bochum – schnell und zuverlässig, Rex Bedachung",
      href: "/dachreparatur-bochum",
      benefits: [
        "Schnelle Schadensanalyse",
        "Unkomplizierte Hilfe",
        "Versicherungsabwicklung",
      ],
      ctaLabel: "Mehr zu Reparaturen",
    },
    {
      title: "Dachwartung",
      description: "Regelmäßige Wartung schützt Ihr Dach vor teuren Folgeschäden – wir inspizieren, reinigen und dokumentieren alles mit Fotos. Wartungsverträge für Privat und Hausverwaltungen verfügbar.",
      imageUrl: dachwartungImage,
      imageUrlFallback: "/images/dachdecker-inspektion-dachwartung-bochum.jpg",
      imageAlt: "Professionelle Dachwartung und Inspektion",
      href: "/dachwartung-bochum",
      benefits: [
        "Umfassende Inspektion",
        "Schadensprävention",
        "Langfristiger Schutz",
      ],
      ctaLabel: "Mehr zur Dachwartung",
    },
  ];

  return (
    <>
      <Helmet>
  <title>Dachdecker Bochum – Rex Bedachungs GmbH</title>
  <meta name="description" content="Meisterbetrieb für Dachdeckerei in Bochum. Steildach, Flachdach, Bauklempnerei & Dachfenster – Rex Bedachungs GmbH. Jetzt Angebot anfragen." />
  <link rel="canonical" href="https://www.rex-bedachung.de/" />
  <meta property="og:title" content="Dachdecker Bochum – Rex Bedachungs GmbH" />
  <meta property="og:description" content="Professionelle Dachdeckerarbeiten im Ruhrgebiet. Meisterbetrieb mit 40 Jahren Erfahrung." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://www.rex-bedachung.de/" />
  <meta property="og:image" content="https://www.rex-bedachung.de/images/dachdecker-bochum-steildach-hero.webp" />
  <meta property="og:site_name" content="Rex Bedachungs GmbH" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Dachdecker Bochum – Rex Bedachungs GmbH" />
  <meta name="twitter:description" content="Professionelle Dachdeckerarbeiten im Ruhrgebiet. Meisterbetrieb mit 40 Jahren Erfahrung." />
  <meta name="twitter:image" content="https://www.rex-bedachung.de/images/dachdecker-bochum-steildach-hero.webp" />
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "RoofingContractor",
      "@id": "https://www.rex-bedachung.de/#organization",
      "name": "Rex Bedachungs GmbH",
      "url": "https://www.rex-bedachung.de",
      "logo": "https://www.rex-bedachung.de/images/logo-rex-bedachungs-gmbh-bochum-2025.webp",
      "image": "https://www.rex-bedachung.de/images/dachdecker-bochum-steildach-hero.webp",
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
        "latitude": 51.46262,
        "longitude": 7.24442
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
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Steildach", "url": "https://www.rex-bedachung.de/steildach-bochum" }},
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Flachdach", "url": "https://www.rex-bedachung.de/flachdach-bochum" }},
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Bauklempnerei", "url": "https://www.rex-bedachung.de/bauklempnerei-bochum" }},
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Dachfenster", "url": "https://www.rex-bedachung.de/dachfenster-bochum" }},
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Reparaturen", "url": "https://www.rex-bedachung.de/dachreparatur-bochum" }},
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Dachwartung", "url": "https://www.rex-bedachung.de/dachwartung-bochum" }}
        ]
      },
      "sameAs": [
        "https://www.google.com/maps?cid=rex-bedachung-bochum",
        "https://www.gelbeseiten.de/rex-bedachung"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.5",
        "reviewCount": "15",
        "bestRating": "5",
        "worstRating": "1"
      }
    })}
  </script>
</Helmet>
      <Hero
        title="Dachdecker Bochum – Ihr Partner rund um's Dach"
        subtitle="Rex Bedachungs GmbH"
        description="Rex Bedachungs GmbH ist Ihr Dachdecker-Meisterbetrieb in Bochum – VELUX-Fachbetrieb, spezialisiert auf energetische Dachsanierung nach GEG, BAFA/KfW-Förderung bis 20% möglich, Flachdachabdichtung, Steildach, Reparaturen und Bauklempnerei."
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
            <p className="text-sm text-slate-600">Als Dachdecker-Meisterbetrieb aus Bochum führt die Rex Bedachungs GmbH seit 1984 Dacharbeiten im gesamten Ruhrgebiet durch – von der Steildachsanierung über Flachdachabdichtung bis zum VELUX-Fenstereinbau.</p>
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
              className="bg-white text-primary hover:bg-white/90 border-white pulse-ring"
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
              <a href="tel:+49234583100" className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>+49 234 583100</span>
              </a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
