import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { Link } from "wouter";

interface HeroProps {
  title: string;
  subtitle: string;
  description?: string;
  imageUrl: string;
  imageAlt: string;
  showCTAs?: boolean;
}

export default function Hero({
  title,
  subtitle,
  description,
  imageUrl,
  imageAlt,
  showCTAs = true,
}: HeroProps) {
  return (
    <div className="relative h-[80vh] min-h-[500px] w-full overflow-hidden">
      <img
        src={imageUrl}
        alt={imageAlt}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      
      <div className="relative h-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex items-center">
        <div className="max-w-3xl text-white">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4" data-testid="text-hero-title">
            Ihr Partner rund um's Dach
          </h1>
          <p className="text-xl md:text-2xl font-semibold mb-4 text-white/90" data-testid="text-hero-subtitle">
            {subtitle}
          </p>
          {description && (
            <p className="text-lg md:text-xl leading-relaxed mb-8 text-white/80 max-w-2xl" data-testid="text-hero-description">
              {description}
            </p>
          )}
          
          {showCTAs && (
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                asChild
                variant="default"
                size="lg"
                className="text-base"
                data-testid="button-hero-quote"
              >
                <Link href="/kontakt">Angebot anfragen</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                data-testid="button-hero-call"
              >
                <a href="tel:0234583100" className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span>Jetzt anrufen</span>
                </a>
              </Button>
            </div>
          )}
          
          {showCTAs && (
            <div className="flex items-center gap-4 text-sm text-white/70">
              <span>Meisterbetrieb</span>
              <span>•</span>
              <span>20+ Jahre Erfahrung</span>
              <span>•</span>
              <span>Ruhrgebiet</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
