import { Helmet } from "react-helmet";
import Hero from "@/components/Hero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, Phone } from "lucide-react";

interface ServiceDetailProps {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  benefits: string[];
  process: string[];
  metaDescription: string;
}

export default function ServiceDetail({
  title,
  subtitle,
  description,
  imageUrl,
  imageAlt,
  benefits,
  process,
  metaDescription,
}: ServiceDetailProps) {
  return (
    <>
      <Helmet>
        <title>{title} - Rex Bedachungs GmbH | Dachdecker Bochum</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={`${title} - Rex Bedachungs GmbH`} />
        <meta property="og:description" content={metaDescription} />
      </Helmet>

      <Hero
        title={title}
        subtitle={subtitle}
        imageUrl={imageUrl}
        imageAlt={imageAlt}
        showCTAs={false}
      />

      <section className="py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
            <Card className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">Ihre Vorteile</h2>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-base md:text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">Unser Vorgehen</h2>
              <ol className="space-y-4">
                {process.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <span className="text-base md:text-lg pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </div>

          <Card className="p-8 md:p-12 bg-card text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Interesse an {title}?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Lassen Sie sich von uns beraten. Wir erstellen Ihnen gerne 
              ein unverbindliches Angebot für Ihr Projekt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="default" size="lg" data-testid="button-service-quote">
                <Link href="/kontakt">Reparatur anfragen</Link>
              </Button>
              <Button asChild variant="outline" size="lg" data-testid="button-service-call">
                <a href="tel:0234583100" className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span>0234-583100</span>
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
