import { Helmet } from "react-helmet";
import Hero from "@/components/Hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shirt, GraduationCap, Euro, TrendingUp, Users, Heart } from "lucide-react";
import heroImage from "@assets/tondach_hero.png";

export default function Careers() {
  const benefits = [
    {
      icon: Euro,
      title: "Faire Bezahlung",
      description: "Leistungsgerechte Vergütung nach Tarif",
    },
    {
      icon: Shirt,
      title: "Arbeitskleidung",
      description: "Hochwertige Berufsbekleidung inklusive",
    },
    {
      icon: GraduationCap,
      title: "Weiterbildung",
      description: "Regelmäßige Schulungen und Fortbildungen",
    },
    {
      icon: TrendingUp,
      title: "Perspektiven",
      description: "Entwicklungsmöglichkeiten im Unternehmen",
    },
    {
      icon: Users,
      title: "Teamgeist",
      description: "Kollegiales Arbeitsklima",
    },
    {
      icon: Heart,
      title: "Sicherheit",
      description: "Unbefristete Arbeitsverträge",
    },
  ];

  const jobs = [
    {
      title: "Dachdecker (m/w/d)",
      type: "Vollzeit",
      description: "Wir suchen einen erfahrenen Dachdecker für unser Team. Sie sollten Erfahrung in Steildach und Flachdach mitbringen und eigenständig arbeiten können.",
      requirements: [
        "Abgeschlossene Ausbildung als Dachdecker",
        "Mehrjährige Berufserfahrung",
        "Führerschein Klasse B wünschenswert",
        "Teamfähigkeit und Zuverlässigkeit",
      ],
    },
    {
      title: "Auszubildender Dachdecker (m/w/d)",
      type: "Ausbildung",
      description: "Starte deine Karriere im Dachdeckerhandwerk! Wir bilden dich zum Dachdecker aus und begleiten dich auf deinem Weg zum Fachmann.",
      requirements: [
        "Hauptschulabschluss oder höher",
        "Handwerkliches Geschick",
        "Keine Höhenangst",
        "Motivation und Lernbereitschaft",
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Karriere - Rex Bedachungs GmbH | Jobs in Bochum</title>
        <meta name="description" content="Karriere bei Rex Bedachungs GmbH. Wir suchen Dachdecker und Auszubildende für unser Team in Bochum." />
        <meta property="og:title" content="Karriere - Rex Bedachungs GmbH" />
        <meta property="og:description" content="Werde Teil unseres Teams. Offene Stellen und Ausbildungsplätze." />
      </Helmet>

      <Hero
        title="Karriere"
        subtitle="Werde Teil unseres Teams"
        description="Wir suchen engagierte Fachkräfte und motivierte Auszubildende, die gemeinsam mit uns wachsen wollen."
        imageUrl={heroImage}
        imageAlt="Karriere bei Rex Bedachungs GmbH"
        showCTAs={false}
      />

      <section className="py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Warum Rex Bedachung?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Als moderner Meisterbetrieb bieten wir dir nicht nur einen sicheren Arbeitsplatz, 
              sondern auch echte Perspektiven für deine berufliche Zukunft.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              Offene Stellen
            </h2>
            <div className="space-y-6">
              {jobs.map((job, index) => (
                <Card key={index} className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-2xl font-semibold mb-2" data-testid={`text-job-title-${index}`}>
                        {job.title}
                      </h3>
                      <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded">
                        {job.type}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-lg text-muted-foreground mb-6">
                    {job.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Das bringst du mit:</h4>
                    <ul className="space-y-2">
                      {job.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button asChild variant="default" data-testid={`button-apply-${index}`}>
                    <Link href="/kontakt">Jetzt bewerben</Link>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
