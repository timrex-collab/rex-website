import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Home, Phone } from "lucide-react";

export default function Danke() {
  return (
    <>
      <Helmet>
        <title>Vielen Dank - Rex Bedachungs GmbH</title>
        <meta name="description" content="Vielen Dank für Ihre Nachricht. Wir melden uns zeitnah bei Ihnen." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <section className="py-16 md:py-24 lg:py-32 bg-background">
        <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
          <Card className="p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 md:w-12 md:h-12 text-primary" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Vielen Dank!
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Ihre Nachricht wurde erfolgreich versendet. Wir werden uns schnellstmöglich bei Ihnen melden.
            </p>

            <div className="space-y-4 mb-8">
              <p className="text-sm md:text-base">
                In dringenden Fällen erreichen Sie uns telefonisch unter:
              </p>
              <a 
                href="tel:0234583100" 
                className="inline-flex items-center gap-2 text-lg md:text-xl font-semibold text-primary hover:underline"
                data-testid="link-phone"
              >
                <Phone className="w-5 h-5" />
                0234-583100
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg"
                data-testid="button-home"
              >
                <Link href="/">
                  <Home className="w-5 h-5 mr-2" />
                  Zur Startseite
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                data-testid="button-contact"
              >
                <Link href="/kontakt">
                  Zurück zum Kontakt
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
