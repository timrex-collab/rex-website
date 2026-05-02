import { Link, useLocation } from "wouter";
import { useState, useRef } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Picture from "@/components/Picture";
const logoPath = "/images/logo-rex-bedachungs-gmbh-bochum-2025.webp";
const logoFallback = "/images/logo-rex-bedachungs-gmbh-bochum-2025.jpg";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  const serviceHub = {
    name: "Dachsanierung",
    subtitle: "Komplettsanierung",
    path: "/dachsanierung-bochum"
  };

  const services = [
    { name: "Dachsanierung", path: "/dachsanierung-bochum" },
    { name: "Steildach", path: "/steildach-bochum" },
    { name: "Flachdach", path: "/flachdach-bochum" },
    { name: "Gründach", path: "/gruendach-dachbegrunung-bochum" },
    { name: "Dachfenster", path: "/dachfenster-bochum" },
    { name: "Bauklempnerei", path: "/bauklempnerei-bochum" },
    { name: "Dachreparatur", path: "/dachreparatur-bochum" },
    { name: "Dachwartung", path: "/dachwartung-bochum" },
    { name: "Dachgaube", path: "/dachgaube-bochum" },
    { name: "Aufsparrendämmung", path: "/aufsparrendaemmung-bochum" },
    { name: "Sturmschaden", path: "/sturmschaden-dach-bochum" },
    { name: "Dachrinne", path: "/dachrinne-bochum" },
  ];

  const mainNav = [
    { name: "Startseite", path: "/" },
    { name: "Leistungen", path: "/leistungen", hasDropdown: true },
    { name: "Förderung", path: "/foerderung" },
    { name: "Solarpflicht", path: "/solarpflicht" },
    { name: "Referenzen", path: "/referenzen" },
    { name: "Über uns", path: "/ueber-uns" },
    { name: "Karriere", path: "/karriere" },
    { name: "FAQ", path: "/faq" },
    { name: "Lexikon", path: "/lexikon" },
    { name: "Kontakt", path: "/kontakt" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" aria-label="Rex Bedachungs GmbH – Zur Startseite" className="flex items-center space-x-3" data-testid="link-home">
            <Picture
              src={logoPath}
              fallback={logoFallback}
              alt="Logo Rex Bedachungs GmbH Bochum"
              className="h-12 w-auto object-contain"
              width={200}
              height={114}
              data-testid="img-header-logo"
            />
            <div className="hidden sm:block">
              <div className="font-bold text-base text-foreground whitespace-nowrap">Rex Bedachungs GmbH</div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {mainNav.map((item) => (
              <div key={item.path} className="relative">
                {item.hasDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => {
                      if (closeTimeoutRef.current) {
                        clearTimeout(closeTimeoutRef.current);
                        closeTimeoutRef.current = null;
                      }
                      setServicesOpen(true);
                    }}
                    onMouseLeave={() => {
                      closeTimeoutRef.current = window.setTimeout(() => {
                        setServicesOpen(false);
                      }, 150);
                    }}
                  >
                    <button
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                        location.startsWith("/leistungen")
                          ? "text-primary"
                          : "text-foreground hover:text-primary"
                      }`}
                      data-testid="button-services-menu"
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {servicesOpen && (
                      <div className="absolute top-full left-0 mt-0 w-56 bg-card border border-card-border rounded-md shadow-lg py-2">
                        <Link
                          href={serviceHub.path}
                          className="block px-4 py-3 text-sm font-semibold text-primary hover:bg-accent transition-colors"
                          data-testid="link-dachsanierung-hub"
                        >
                          <div>{serviceHub.name}</div>
                          <div className="text-xs text-muted-foreground font-normal">{serviceHub.subtitle}</div>
                        </Link>
                        <div className="border-t border-card-border my-1"></div>
                        {services.map((service) => (
                          <Link
                            key={service.path}
                            href={service.path}
                            className="block px-4 py-2 text-sm text-card-foreground hover:bg-accent transition-colors"
                            data-testid={`link-${service.name.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            {service.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
   
                ) : (
                  <Link
                    href={item.path}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      location === item.path
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
                    }`}
                    data-testid={`link-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              data-testid="button-call-desktop"
            >
              <a href="tel:+49234583100" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+49 234 583100</span>
              </a>
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="pulse-ring cta-pulse"
              onClick={() => setLocation("/kontakt")}
              data-testid="button-quote-desktop"
            >
              Angebot anfragen
            </Button>
          </div>

          <button
            className="lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Menu schließen" : "Menu öffnen"}
            aria-expanded={mobileMenuOpen}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-card-border">
          <div className="px-4 py-4 space-y-1">
            {mainNav.map((item) => (
              <div key={item.path}>
                {item.hasDropdown ? (
                  <div>
                    <button
                      onClick={() => setServicesOpen(!servicesOpen)}
                      className="w-full text-left px-3 min-h-[44px] rounded-md text-sm font-medium text-card-foreground flex items-center justify-between"
                      data-testid="button-services-mobile"
                    >
                      {item.name}
                      <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
                    </button>
                    {servicesOpen && (
                      <div className="ml-4 mt-1 space-y-1">
                        <Link
                          href={serviceHub.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center px-3 min-h-[44px] rounded-md text-sm font-semibold text-primary hover:bg-accent"
                          data-testid="link-mobile-dachsanierung-hub"
                        >
                          Dachsanierung (Komplettsanierung)
                        </Link>
                        <div className="border-t border-card-border my-2 ml-4"></div>
                        {services.map((service) => (
                          <Link
                            key={service.path}
                            href={service.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center px-3 min-h-[44px] rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                            data-testid={`link-mobile-${service.name.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            {service.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                
                ) : (
                  <Link
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-3 min-h-[44px] rounded-md text-sm font-medium ${
                      location === item.path
                        ? "text-primary bg-accent"
                        : "text-card-foreground hover:bg-accent"
                    }`}
                    data-testid={`link-mobile-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-4 space-y-2">
              <Button
                asChild
                variant="outline"
                className="w-full"
                data-testid="button-call-mobile"
              >
                <a href="tel:+49234583100" className="flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+49 234 583100</span>
                </a>
              </Button>
              <Button
                variant="default"
                className="w-full pulse-ring cta-pulse"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLocation("/kontakt");
                }}
                data-testid="button-quote-mobile"
              >
                Angebot anfragen
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
