import { Helmet } from "react-helmet";
import OrganizationSchema from "@/components/OrganizationSchema";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
const dachwartungImage = "/images/dachdecker-inspektion-dachwartung-bochum.webp";

const heroImage = "/images/tondach-hero-dachdeckung-bochum.webp";
const heroImageFallback = "/images/tondach-hero-dachdeckung-bochum.jpg";
const steildachImage = "/images/dach-hintergrund-rex-bedachung.webp";
const flachdachImage = "/images/flachdach-sanierung-bochum-rex-bedachung.webp";
const bauklempnereiImage = "/images/kamin-sanierung-bochum-dachdecker.webp";
const dachfensterImage = "/images/velux-dachfenster-einbau-bochum-fachbetrieb.webp";
const reparaturenImage = "/images/dachreparatur-bochum-rex-bedachung.webp";

export default function Services() {
  const services = [
    {
      title: "Steildach",
      description: "Fachgerechte Eindeckung und Sanierung von Steildächern mit hochwertigen Materialien wie Ton-, Beton- oder Schieferziegeln.",
      imageUrl: steildachImage,
      imageAlt: "Steildach mit roten Ziegeln",
      href: "/steildach-bochum",
      benefits: [
        "Alle gängigen Dachformen",
        "Hochwertige Materialien",
        "Langlebige Lösungen",
      ],
    },
    {
      title: "Flachdach",
      description: "Professionelle Abdichtung und Sanierung von Flachdächern für Wohn- und Gewerbeimmobilien mit modernen Systemen.",
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
      description: "Maßgefertigte Blecharbeiten, Dachrinnen, Regenfallrohre und Wandbekleidungen",
      imageUrl: bauklempnereiImage,
      imageAlt: "Kamin Sanierung Bochum – Dachdecker Rex Bedachung",
      href: "/bauklempnerei-bochum",
      benefits: [
        "Präzise Maßanfertigung",
        "Langlebige Materialien",
        "Fachgerechte Montage",
      ],
    },
    {
      title: "Dachfenster",
      description: "Einbau und Austausch von Dachfenstern und Dachflächenfenstern für mehr Licht und Wohnkomfort unter dem Dach.",
      imageUrl: dachfensterImage,
      imageAlt: "VELUX Dachfenster Bochum – Rex Bedachungs GmbH",
      href: "/dachfenster-bochum",
      benefits: [
        "Markenqualität",
        "Fachgerechter Einbau",
        "Energieeffizient",
      ],
    },
    {
      title: "Reparaturen",
      description: "Schnelle und zuverlässige Reparatur von Dachschäden, Sturmschäden und undichten Stellen mit fachgerechter Ausführung.",
      imageUrl: reparaturenImage,
      imageAlt: "Dachreparatur Bochum – schnell und zuverlässig, Rex Bedachung",
      href: "/dachreparatur-bochum",
      benefits: [
        "Schnelle Schadensanalyse",
        "Unkomplizierte Hilfe",
        "Versicherungsabwicklung",
      ],
    },
    {
      title: "Dachwartung",
      description: "Regelmäßige Inspektion und Wartung Ihres Daches zur Vermeidung kostspieliger Schäden und Verlängerung der Lebensdauer.",
      imageUrl: dachwartungImage,
      imageAlt: "Professionelle Dachwartung",
      href: "/dachwartung-bochum",
      benefits: [
        "Schadensprävention",
        "Werterhaltung",
        "Regelmäßige Kontrolle",
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Leistungen – Rex Bedachungs GmbH | Dachdecker Bochum</title>
        <meta name="description" content="Alle Dachdeckerleistungen von Rex Bedachungs GmbH: Steildach, Flachdach, Gründach, Dachfenster, Bauklempnerei und Dachreparatur im Ruhrgebiet." />
        <link rel="canonical" href="https://www.rex-bedachung.de/leistungen" />
        <meta property="og:title" content="Dachdecker Leistungen Bochum – Rex Bedachungs GmbH" />
        <meta property="og:description" content="Umfassende Dachdeckerleistungen von Ihrem Meisterbetrieb im Ruhrgebiet." />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/dach-hintergrund-rex-bedachung.webp" />
        <meta property="og:site_name" content="Rex Bedachungs GmbH" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.rex-bedachung.de/images/dach-hintergrund-rex-bedachung.webp" />
        <script type="application/ld+json">{`{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Startseite","item":"https://www.rex-bedachung.de/"},{"@type":"ListItem","position":2,"name":"Leistungen","item":"https://www.rex-bedachung.de/leistungen"}]}`}</script>
      </Helmet>
      <OrganizationSchema />

      <Hero
        title="Unsere Leistungen"
        subtitle="Kompetenz rund ums Dach"
        description="Von der Neueindeckung über Sanierung bis zur Wartung – wir bieten Ihnen alle Leistungen aus einer Hand."
        imageUrl={heroImage}
        imageFallbackUrl={heroImageFallback}
        imageAlt="Tondach Hero – professionelle Dachdeckung Bochum"
        showCTAs={false}
      />

      <section className="py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <Card className="border-primary/30 mb-12" data-testid="card-services-dachsanierung-hub">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h2 className="text-2xl font-bold">Dachsanierung</h2>
                    <Badge variant="secondary" className="text-xs">Komplettsanierung</Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Komplettsanierung aus einer Hand: Steildach, Flachdach, Dämmung, Dachfenster und mehr – inklusive Beratung zu BAFA/KfW-Förderung bis 20%.
                  </p>
                </div>
                <Button asChild variant="default" size="lg" data-testid="button-services-dachsanierung-hub">
                  <Link href="/dachsanierung-bochum" className="flex items-center gap-2">
                    Zur Dachsanierung-Übersicht
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold mb-8">Einzelleistungen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
