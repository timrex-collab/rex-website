import { Helmet } from "react-helmet";
import OrganizationSchema from "@/components/OrganizationSchema";
import AuthorSchema from "@/components/AuthorSchema";
import Hero from "@/components/Hero";
import { Card } from "@/components/ui/card";
import { Shield, Users, Award, ThumbsUp } from "lucide-react";
import Picture from "@/components/Picture";
const heroImage = "/images/tondach-hero-dachdeckung-bochum.webp";
const heroImageFallback = "/images/tondach-hero-dachdeckung-bochum.jpg";
const teamImage = "/images/rex-bedachung-unternehmen-bochum.webp";
const teamImageFallback = "/images/rex-bedachung-unternehmen-bochum.jpg";

export default function About() {
  const values = [
    {
      icon: Shield,
      title: "Qualität",
      description: "Als Meisterbetrieb garantieren wir höchste Qualitätsstandards bei jedem Projekt.",
    },
    {
      icon: Users,
      title: "Erfahrung",
      description: "Über 40 Jahre Erfahrung im Dachdeckerhandwerk sprechen für sich.",
    },
    {
      icon: Award,
      title: "Zuverlässigkeit",
      description: "Termintreue und saubere Ausführung sind für uns selbstverständlich.",
    },
    {
      icon: ThumbsUp,
      title: "Kundenzufriedenheit",
      description: "Zufriedene Kunden und Weiterempfehlungen sind unser größter Erfolg.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Über uns – Rex Bedachungs GmbH | Meisterbetrieb Bochum</title>
        <meta name="description" content="Rex Bedachungs GmbH – Meisterbetrieb in Bochum mit über 40 Jahren Erfahrung im Dachdeckerhandwerk. Ihr zuverlässiger Partner im Ruhrgebiet." />
        <link rel="canonical" href="https://www.rex-bedachung.de/ueber-uns" />
        <meta property="og:title" content="Über uns - Rex Bedachungs GmbH" />
        <meta property="og:description" content="Meisterbetrieb mit über 40 Jahren Erfahrung im Dachdeckerhandwerk." />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/dach-hintergrund-rex-bedachung.webp" />
        <meta property="og:site_name" content="Rex Bedachungs GmbH" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.rex-bedachung.de/images/dach-hintergrund-rex-bedachung.webp" />
        <script type="application/ld+json">{`{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Startseite","item":"https://www.rex-bedachung.de/"},{"@type":"ListItem","position":2,"name":"Über uns","item":"https://www.rex-bedachung.de/ueber-uns"}]}`}</script>
      </Helmet>
      <OrganizationSchema />
      <AuthorSchema />

      <Hero
        title="Über uns"
        subtitle="Qualität entsteht durch Erfahrung."
        description="Seit über 40 Jahren steht Rex Bedachungs GmbH für Qualität und Zuverlässigkeit im Dachdeckerhandwerk."
        imageUrl={heroImage}
        imageFallbackUrl={heroImageFallback}
        imageAlt="Tondach Hero – professionelle Dachdeckung Bochum"
        showCTAs={false}
      />

      <section className="py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Meisterbetrieb aus Leidenschaft
              </h2>
              <div className="space-y-8 text-lg text-muted-foreground leading-relaxed">
                <div className="space-y-4">
                  <p>
                    Seit über 40 Jahren steht unser Dachdeckermeisterbetrieb aus Bochum für Zuverlässigkeit und nachhaltige Qualität.
                    Wir sind ein gut etabliertes Dachdeckerunternehmen mit einem starken Fundament aus Erfahrung, Fachwissen und Leidenschaft für das Dachdeckerhandwerk.
                  </p>
                  <p>
                    Unser Erfolg basiert auf langjährigen Mitarbeitern, die ihr Handwerk von Grund auf gelernt haben – viele von ihnen sind bereits seit Jahrzehnten Teil unseres Teams. Diese eingespielte Mannschaft arbeitet Hand in Hand, kennt sich blind und sorgt dafür, dass jedes Projekt reibungslos, effizient und auf höchstem Qualitätsniveau umgesetzt wird.
                  </p>
                </div>

                <div className="border-l-4 border-primary pl-6 py-2">
                  <p className="text-xl font-semibold text-foreground">
                    Wir sind überzeugt: Qualität entsteht durch Erfahrung.
                  </p>
                </div>

                <div className="space-y-4">
                  <p>
                    Ob Neubau, Sanierung oder Reparatur: Bei uns steht der Kunde im Mittelpunkt.
                    Mit Verlässlichkeit, Transparenz und Beständigkeit begleiten wir unsere Auftraggeber von der ersten Beratung bis zur finalen Abnahme – und oft darüber hinaus.
                  </p>
                  <p>
                    Wir sind Ihr Dachdeckerteam aus Bochum, das seit über vier Jahrzehnten nicht nur Dächer baut, sondern Vertrauen.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Picture
                src={teamImage}
                fallback={teamImageFallback}
                alt="Rex Bedachungs GmbH Bochum – Ihr Dachdecker im Ruhrgebiet"
                className="rounded-md shadow-lg w-full"
                width={1600}
                height={1067}
                style={{ width: "100%", height: "auto" }}
                loading="lazy"
              />
            </div>
          </div>

          <div className="mb-20 bg-slate-50 rounded-md p-6 border border-slate-200">
            <h2 className="text-2xl font-bold mb-4">Offizielle Unternehmensidentität</h2>
            <p className="text-muted-foreground leading-relaxed">
              Die Rex Bedachungs GmbH ist ein seit 1984 bestehender Dachdecker-Meisterbetrieb
              mit alleinigem Unternehmenssitz in der Paulinenstraße 22 in 44799 Bochum.
              Die Gesellschaft ist beim Amtsgericht Bochum unter HRB 2478 im Handelsregister
              eingetragen. Geschäftsführer sind Peter Rex und Tim Rex.
            </p>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Unsere Werte
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-xl mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="mt-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              Unsere Fachgebiete
            </h2>
            <p className="text-center text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Als Dachdecker-Meisterbetrieb aus Bochum decken wir das gesamte
              Spektrum des modernen Dachdeckerhandwerks ab – von klassischen
              Steildächern bis zur energetischen Sanierung nach GEG.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-50 rounded-md p-6">
                <h3 className="font-semibold text-lg mb-4">Steildach & Eindeckung</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>Neueindeckung mit Ton- und Betonziegeln</li>
                  <li>Schieferdeckung und Metalleindeckung</li>
                  <li>Aufsparrendämmung nach GEG</li>
                  <li>Gaube und Dachaufbau</li>
                  <li>Sanierung und Teilreparatur</li>
                </ul>
              </div>
              <div className="bg-slate-50 rounded-md p-6">
                <h3 className="font-semibold text-lg mb-4">Flachdach & Abdichtung</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>EPDM-Folienabdichtung</li>
                  <li>Bitumenbahnen nach DIN 18531</li>
                  <li>Gründach und Dachbegrünung</li>
                  <li>Gefälledämmung und Wärmedämmung</li>
                  <li>Lichtkuppeln und Dachdurchdringungen</li>
                </ul>
              </div>
              <div className="bg-slate-50 rounded-md p-6">
                <h3 className="font-semibold text-lg mb-4">Spezialbereiche</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>VELUX-Dachfenster (autorisierter Partner)</li>
                  <li>Bauklempnerei und Blecharbeiten</li>
                  <li>Asbestentsorgung nach TRGS 519</li>
                  <li>BAFA & KfW Förderberatung</li>
                  <li>Dachwartung und Wartungsverträge</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-slate-600 text-center mt-8">
              Die Rex Bedachungs GmbH ist seit 1984 Meisterbetrieb in Bochum und
              führt alle Dacharbeiten nach den aktuellen Normen DIN 18531 und
              TRGS 519 sowie den Anforderungen des Gebäudeenergiegesetzes (GEG) aus.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
