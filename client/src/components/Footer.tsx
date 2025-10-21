import { Link } from "wouter";
import { Phone, Mail, Clock } from "lucide-react";
import logoPath from "@assets/generated_images/Logo.png";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-card-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
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
            <h3 className="font-semibold mb-4">Leistungen</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/leistungen/steildach" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-steildach">
                  Steildach
                </Link>
              </li>
              <li>
                <Link href="/leistungen/flachdach" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-flachdach">
                  Flachdach
                </Link>
              </li>
              <li>
                <Link href="/leistungen/bauklempnerei" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-bauklempnerei">
                  Bauklempnerei
                </Link>
              </li>
              <li>
                <Link href="/leistungen/dachfenster" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-dachfenster">
                  Dachfenster
                </Link>
              </li>
              <li>
                <Link href="/leistungen/reparaturen" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-reparaturen">
                  Reparaturen
                </Link>
              </li>
              <li>
                <Link href="/leistungen/dachwartung" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-dachwartung">
                  Dachwartung
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Unternehmen</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ueber-uns" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-about">
                  Über uns
                </Link>
              </li>
              <li>
                <Link href="/referenzen" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-references">
                  Referenzen
                </Link>
              </li>
              <li>
                <Link href="/karriere" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-careers">
                  Karriere
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-contact">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Kontakt</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-primary" />
                <a href="tel:0234583100" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-phone">
                  0234-583100
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-primary" />
                <a href="mailto:info@rex-bedachung.de" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-footer-email">
                  info@rex-bedachung.de
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 text-primary" />
                <span className="text-muted-foreground">Mo–Fr 7–17 Uhr</span>
              </div>
              <div className="text-muted-foreground mt-4">
                Paulinenstr. 22<br />
                44799 Bochum
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <img 
              src={logoPath} 
              alt="REX Bedachungs GmbH Logo" 
              className="h-12 w-auto object-contain"
              data-testid="img-footer-logo"
            />
            <div>
              © {new Date().getFullYear()} Rex Bedachungs GmbH. Alle Rechte vorbehalten.
            </div>
          </div>
          <div className="flex gap-6">
            <Link href="/impressum" className="hover:text-primary transition-colors" data-testid="link-footer-impressum">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-primary transition-colors" data-testid="link-footer-privacy">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
