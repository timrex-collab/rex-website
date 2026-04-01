import { Helmet } from "react-helmet";
import OrganizationSchema from "@/components/OrganizationSchema";
import { useState } from "react";
import Hero from "@/components/Hero";
import ContactForm from "@/components/ContactForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, MessageCircle, ExternalLink } from "lucide-react";
const heroImage = "/images/tondach-hero-dachdeckung-bochum.webp";
const heroImageFallback = "/images/tondach-hero-dachdeckung-bochum.jpg";

export default function Contact() {
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <>
      <Helmet>
        <title>Kontakt – Rex Bedachungs GmbH | Dachdecker Bochum</title>
        <meta name="description" content="Kontakt zu Rex Bedachungs GmbH Bochum – Telefon: +49 234 583100, E-Mail: info@rex-bedachung.de. Kostenloses Aufmaß und Beratung vor Ort." />
        <link rel="canonical" href="https://www.rex-bedachung.de/kontakt" />
        <meta property="og:title" content="Kontakt - Rex Bedachungs GmbH" />
        <meta property="og:description" content="Nehmen Sie Kontakt mit uns auf. Wir beraten Sie gerne zu Ihrem Dachprojekt." />
        <meta property="og:image" content="https://www.rex-bedachung.de/images/dach-hintergrund-rex-bedachung.webp" />
        <meta property="og:site_name" content="Rex Bedachungs GmbH" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kontakt – Rex Bedachungs GmbH Bochum" />
        <meta name="twitter:description" content="Jetzt Kontakt aufnehmen – Dachdecker Rex Bedachung in Bochum. Tel. +49 234 583100. Kostenlose Beratung und Angebote." />
        <meta name="twitter:image" content="https://www.rex-bedachung.de/images/dach-hintergrund-rex-bedachung.webp" />
        <script type="application/ld+json">{`{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Startseite","item":"https://www.rex-bedachung.de/"},{"@type":"ListItem","position":2,"name":"Kontakt","item":"https://www.rex-bedachung.de/kontakt"}]}`}</script>
      </Helmet>
      <OrganizationSchema />

      <Hero
        title="Kontakt"
        subtitle="Wir sind für Sie da"
        description="Haben Sie Fragen oder benötigen ein Angebot? Kontaktieren Sie uns – wir beraten Sie gerne persönlich."
        imageUrl={heroImage}
        imageFallbackUrl={heroImageFallback}
        imageAlt="Tondach Hero – professionelle Dachdeckung Bochum"
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
                      href="tel:+49234583100" 
                      className="pulse-ring cta-pulse text-lg text-primary hover:underline"
                      data-testid="link-contact-phone"
                    >
                      +49 234 583100
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

                <div className="pt-4 border-t border-border">
                  <h3 className="font-semibold mb-3">Folgen Sie uns</h3>
                  <div className="flex items-center gap-4">
                    <a
                      href="https://www.facebook.com/rexbedachung"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                      data-testid="link-contact-facebook"
                    >
                      Facebook
                    </a>
                    <a
                      href="https://www.instagram.com/rexbedachung"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                      data-testid="link-contact-instagram"
                    >
                      Instagram
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-muted rounded-xl border border-border text-center">
                <p className="font-medium mb-2">
                  Zufrieden mit unserer Arbeit?
                </p>
                <p className="text-muted-foreground text-sm mb-4">
                  Wir freuen uns über Ihre Bewertung auf Google –
                  das hilft anderen Hausbesitzern in Bochum, uns zu finden.
                </p>
                <a
                  href="https://www.google.com/maps/place/Rex+Bedachungs+GmbH/@51.4623584,7.2428438,519m/data=!3m2!1e3!4b1!4m6!3m5!1s0x47b8e00fdd91a96d:0xb0e424e0f275f1b6!8m2!3d51.4623584!4d7.2428438!16s%2Fg%2F1tfqkgvg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-background border border-border rounded-lg px-6 py-3 font-medium hover:bg-muted transition-colors shadow-sm"
                  aria-label="Rex Bedachung auf Google bewerten"
                  data-testid="link-contact-google-review"
                >
                  ⭐ Jetzt auf Google bewerten
                </a>
              </div>

              <Card className="p-6">
                <div className="relative w-full" style={{ paddingBottom: '66.67%' }}>
                  {!mapLoaded ? (
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center rounded-md px-6 text-center" style={{ backgroundColor: '#f3f4f6' }}>
                      <MapPin className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-600 mb-4 max-w-sm">
                        Karte wird von Google Maps geladen. Mit dem Laden akzeptieren Sie die Datenschutzerklärung von Google.
                      </p>
                      <Button
                        onClick={() => setMapLoaded(true)}
                        variant="default"
                        size="lg"
                        data-testid="button-load-map"
                      >
                        <MapPin className="w-4 h-4 mr-1" />
                        Google Maps laden
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
