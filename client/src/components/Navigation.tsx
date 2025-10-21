import { Link, useLocation } from "wouter";
import { useState, useRef } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/generated_images/Logo.png";

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  const services = [
    { name: "Steildach", path: "/leistungen/steildach" },
    { name: "Flachdach", path: "/leistungen/flachdach" },
    { name: "Bauklempnerei", path: "/leistungen/bauklempnerei" },
    { name: "Dachfenster", path: "/leistungen/dachfenster" },
    { name: "Reparaturen", path: "/leistungen/reparaturen" },
    { name: "Dachwartung", path: "/leistungen/dachwartung" },
  ];

  const mainNav = [
    { name: "Startseite", path: "/" },
    { name: "Leistungen", path: "/leistungen", hasDropdown: true },
    { name: "Referenzen", path: "/referenzen" },
    { name: "FAQ", path: "/faq" },
    { name: "Über uns", path: "/ueber-uns" },
    { name: "Karriere", path: "/karriere" },
    { name: "Kontakt", path: "/kontakt" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3" data-testid="link-home">
            <img 
              src={logoPath} 
              alt="REX Bedachungs GmbH Logo" 
              className="h-8 w-auto object-contain"
              data-testid="img-header-logo"
            />
            <div className="hidden sm:block">
              <div className="font-bold text-lg text-foreground">Rex Bedachung</div>
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
                      <div className="absolute top-full left-0 mt-0 w-48 bg-card border border-card-border rounded-md shadow-lg py-2">
                        {services.map((service) => (
                          <Link
                            key={service.path}
                            href={service.path}
                            className="block px-4 py-2 text-sm text-card-foreground hover:bg-accent transition-colors"
                            data-testid={`link-${service.name.toLowerCase()}`}
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
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
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
              <a href="tel:0234583100" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>0234-583100</span>
              </a>
            </Button>
            <Button asChild variant="default" size="sm" data-testid="button-quote-desktop">
              <Link href="/kontakt">Angebot anfragen</Link>
            </Button>
          </div>

          <button
            className="lg:hidden p-2"
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
          <div className="px-4 py-4 space-y-3">
            {mainNav.map((item) => (
              <div key={item.path}>
                {item.hasDropdown ? (
                  <div>
                    <button
                      onClick={() => setServicesOpen(!servicesOpen)}
                      className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-card-foreground flex items-center justify-between"
                      data-testid="button-services-mobile"
                    >
                      {item.name}
                      <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
                    </button>
                    {servicesOpen && (
                      <div className="ml-4 mt-2 space-y-2">
                        {services.map((service) => (
                          <Link
                            key={service.path}
                            href={service.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent"
                            data-testid={`link-mobile-${service.name.toLowerCase()}`}
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
                    className={`block px-3 py-2 rounded-md text-sm font-medium ${
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
                <a href="tel:0234583100" className="flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>0234-583100</span>
                </a>
              </Button>
              <Button
                asChild
                variant="default"
                className="w-full"
                data-testid="button-quote-mobile"
              >
                <Link href="/kontakt" onClick={() => setMobileMenuOpen(false)}>
                  Angebot anfragen
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
