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
        subtitle="Tradition trifft Innovation"
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
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Seit der Gründung vor über 40 Jahren hat sich Rex Bedachungs GmbH als 
                  zuverlässiger Partner für professionelle Dacharbeiten im Ruhrgebiet etabliert. 
                  Was als kleiner Handwerksbetrieb begann, ist heute ein modernes Unternehmen 
                  mit erfahrenen Fachkräften und modernster Ausstattung.
                </p>
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
