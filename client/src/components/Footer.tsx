import { Link } from "wouter";
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import Picture from "@/components/Picture";
const logoPath = "/images/logo-rex-bedachungs-gmbh-bochum-2025.webp";
const logoFallback = "/images/logo-rex-bedachungs-gmbh-bochum-2025.jpg";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-card-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div>
                <div className="font-bold text-lg">Rex Bedachung</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ihr zuverlässiger Meisterbetrieb für alle Dacharbeiten in Bochum und Umgebung
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Leistungen</h3>
            <ul className="text-sm">
              <li>
                <Link href="/steildach-bochum" className="flex items-center min-h-[44px] text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-steildach">
                  Steildach
                </Link>
              </li>
              <li>
                <Link href="/flachdach-bochum" className="flex items-center min-h-[44px] text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-flachdach">
                  Flachdach
                </Link>
              </li>
              <li>
                <Link href="/bauklempnerei-bochum" className="flex items-center min-h-[44px] text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-bauklempnerei">
                  Bauklempnerei
                </Link>
              </li>
              <li>
                <Link href="/dachfenster-bochum" className="flex items-center min-h-[44px] text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-dachfenster">
                  Dachfenster
                </Link>
              </li>
              <li>
                <Link href="/dachreparatur-bochum" className="flex items-center min-h-[44px] text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-reparaturen">
                  Reparaturen
                </Link>
              </li>
              <li>
                <Link href="/dachwartung-bochum" className="flex items-center min-h-[44px] text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-dachwartung">
                  Dachwartung
                </Link>
              </li>
              <li>
                <Link href="/gruendach-dachbegrunung-bochum" className="flex items-center min-h-[44px] text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-gruendach">
                  Gründach
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Unternehmen</h3>
            <ul className="text-sm">
              <li>
                <Link href="/ueber-uns" className="flex items-center min-h-[44px] text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-about">
                  Über uns
                </Link>
              </li>
              <li>
                <Link href="/referenzen" className="flex items-center min-h-[44px] text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-references">
                  Referenzen
                </Link>
              </li>
              <li>
                <Link href="/karriere" className="flex items-center min-h-[44px] text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-careers">
                  Karriere
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="flex items-center min-h-[44px] text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-contact">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Wissen &amp; Ratgeber</h3>
            <ul className="text-sm">
              <li>
                <Link href="/lexikon" className="flex items-center min-h-[44px] text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-lexikon">
                  Dach-Lexikon
                </Link>
              </li>
              <li>
                <Link href="/faq" className="flex items-center min-h-[44px] text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-faq">
                  Häufige Fragen (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Kontakt</h3>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2 min-h-[44px]">
                <Phone className="w-4 h-4 shrink-0 text-primary" />
                <a href="tel:+49234583100" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-phone">
                  +49 234 583100
                </a>
              </div>
              <div className="flex items-center gap-2 min-h-[44px]">
                <Mail className="w-4 h-4 shrink-0 text-primary" />
                <a href="mailto:info@rex-bedachung.de" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-email">
                  info@rex-bedachung.de
                </a>
              </div>
              <div className="flex items-center gap-2 min-h-[44px]">
                <Clock className="w-4 h-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">Mo–Fr 7–17 Uhr</span>
              </div>
              <div className="text-muted-foreground pt-2">
                Paulinenstr. 22<br />
                44799 Bochum
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Rex+Bedachungs+GmbH+Paulinenstra%C3%9Fe+22+44799+Bochum"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-1"
                data-testid="link-footer-anfahrt"
              >
                <MapPin className="w-3 h-3" />
                Anfahrt auf Google Maps
              </a>
              <div className="pt-3">
                <a
                  href="https://www.google.com/maps/place/Rex+Bedachungs+GmbH/@51.4623584,7.2428438,519m/data=!3m2!1e3!4b1!4m6!3m5!1s0x47b8e00fdd91a96d:0xb0e424e0f275f1b6!8m2!3d51.4623584!4d7.2428438!16s%2Fg%2F1tfqkgvg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Rex Bedachung auf Google bewerten"
                  data-testid="link-footer-google-review"
                >
                  ⭐ Google Bewertung schreiben
                </a>
              </div>
              <div className="flex items-center gap-4 pt-3">
                <a
                  href="https://www.facebook.com/rexbedachung"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Rex Bedachung auf Facebook"
                  data-testid="link-footer-facebook"
                >
                  Facebook
                </a>
                <a
                  href="https://www.instagram.com/rexbedachung"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Rex Bedachung auf Instagram"
                  data-testid="link-footer-instagram"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Picture
              src={logoPath}
              fallback={logoFallback}
              alt="Logo Rex Bedachungs GmbH Bochum"
              className="h-12 w-auto object-contain"
              width={200}
              height={114}
              data-testid="img-footer-logo"
            />
            <div>
              © {new Date().getFullYear()} Rex Bedachungs GmbH. Alle Rechte vorbehalten.
            </div>
          </div>
          <div className="flex gap-6">
            <Link href="/impressum" className="flex items-center min-h-[44px] hover:text-primary transition-colors" data-testid="link-footer-impressum">
              Impressum
            </Link>
            <Link href="/datenschutz" className="flex items-center min-h-[44px] hover:text-primary transition-colors" data-testid="link-footer-privacy">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
