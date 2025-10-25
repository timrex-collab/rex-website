import { Helmet } from "react-helmet";
import Hero from "@/components/Hero";
import { Card } from "@/components/ui/card";
import { Shield, Users, Award, ThumbsUp } from "lucide-react";
import heroImage from "@assets/tondach_hero.png";
import teamImage from "@assets/Hintergrund Unternehmen.jpg";

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
        <title>Über uns - Rex Bedachungs GmbH | Meisterbetrieb Bochum</title>
        <meta name="description" content="Lernen Sie Rex Bedachungs GmbH kennen. Meisterbetrieb mit über 20 Jahren Erfahrung im Dachdeckerhandwerk in Bochum und Umgebung." />
        <meta property="og:title" content="Über uns - Rex Bedachungs GmbH" />
        <meta property="og:description" content="Meisterbetrieb mit über 20 Jahren Erfahrung im Dachdeckerhandwerk." />
      </Helmet>

      <Hero
        title="Über uns"
        subtitle="Qualität entsteht durch Erfahrung."
        description="Seit über 20 Jahren steht Rex Bedachungs GmbH für Qualität und Zuverlässigkeit im Dachdeckerhandwerk."
        imageUrl={heroImage}
        imageAlt="Rex Bedachungs GmbH Team"
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
              <img
                src={teamImage}
                alt="Team von Rex Bedachungs GmbH"
                className="rounded-md shadow-lg w-full"
                loading="lazy"
              />
            </div>
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
        </div>
      </section>
    </>
  );
}
