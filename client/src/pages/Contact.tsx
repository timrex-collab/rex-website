import { Helmet } from "react-helmet";
import { useState } from "react";
import Hero from "@/components/Hero";
import ContactForm from "@/components/ContactForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, MessageCircle, ExternalLink } from "lucide-react";
import heroImage from "@assets/tondach_hero.png";

export default function Contact() {
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <>
      <Helmet>
        <title>Kontakt - Rex Bedachungs GmbH | Dachdecker Bochum</title>
        <meta name="description" content="Kontaktieren Sie Rex Bedachungs GmbH. Telefon: 0234-583100, E-Mail: info@rex-bedachung.de. Wir beraten Sie gerne." />
        <meta property="og:title" content="Kontakt - Rex Bedachungs GmbH" />
        <meta property="og:description" content="Nehmen Sie Kontakt mit uns auf. Wir beraten Sie gerne zu Ihrem Dachprojekt." />
      </Helmet>

      <Hero
        title="Kontakt"
        subtitle="Wir sind für Sie da"
        description="Haben Sie Fragen oder benötigen ein Angebot? Kontaktieren Sie uns – wir beraten Sie gerne persönlich."
        imageUrl={heroImage}
        imageAlt="Kontakt Rex Bedachungs GmbH"
        showCTAs={false}
      />

      <section className="py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Kontaktinformationen
              </h2>
              
              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Telefon</h3>
                    <a 
                      href="tel:0234583100" 
                      className="text-lg text-primary hover:underline"
                      data-testid="link-contact-phone"
                    >
                      0234-583100
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">E-Mail</h3>
                    <a 
                      href="mailto:info@rex-bedachung.de" 
                      className="text-lg text-primary hover:underline break-all"
                      data-testid="link-contact-email"
                    >
                      info@rex-bedachung.de
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Adresse</h3>
                    <p className="text-lg">
                      Paulinenstr. 22<br />
                      44799 Bochum
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Öffnungszeiten</h3>
                    <p className="text-lg">
                      Mo–Fr 7:00–17:00 Uhr
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">WhatsApp</h3>
                    <p className="text-lg">0234-583126</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Kontaktieren Sie uns auch gerne per WhatsApp oder Sprachnachricht
                    </p>
                  </div>
                </div>
              </div>

              <Card className="p-6">
                <div className="relative w-full" style={{ paddingBottom: '66.67%' }}>
                  {!mapLoaded ? (
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-muted rounded-md">
                      <MapPin className="w-16 h-16 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2 text-center px-4">
                        Standortkarte anzeigen
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 text-center max-w-md px-4">
                        Durch das Laden der Karte werden Daten an Google übertragen. 
                        Details finden Sie in unserer Datenschutzerklärung.
                      </p>
                      <Button
                        onClick={() => setMapLoaded(true)}
                        variant="default"
                        size="lg"
                        data-testid="button-load-map"
                      >
                        Karte laden
                      </Button>
                      <a
                        href="https://www.google.com/maps/place/Rex+Bedachungs+GmbH/@51.4623595,7.2420155,17z"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 text-sm text-primary hover:underline inline-flex items-center gap-1"
                        data-testid="link-google-maps"
                      >
                        In Google Maps öffnen <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ) : (
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.8971234567!2d7.2420155!3d51.4623595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b8e00fdd91a96d%3A0xb0e424e0f275f1b6!2sRex%20Bedachungs%20GmbH!5e0!3m2!1sde!2sde!4v1234567890123!5m2!1sde!2sde"
                      className="absolute top-0 left-0 w-full h-full rounded-md"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Standort Rex Bedachungs GmbH - Paulinenstr. 22, 44799 Bochum"
                      data-testid="map-location"
                    />
                  )}
                </div>
              </Card>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Nachricht senden
              </h2>
              <Card className="p-6 md:p-8">
                <ContactForm />
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
