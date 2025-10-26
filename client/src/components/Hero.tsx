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
    <div className="relative h-[80vh] min-h-[500px] max-h-[900px] w-full overflow-hidden">
      <img
        src={imageUrl}
        alt={imageAlt}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 flex items-center sm:items-start sm:pt-12 md:pt-16 lg:pt-20">
        <div className="max-w-4xl text-white w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-5 md:mb-6 lg:mb-8 leading-tight" data-testid="text-hero-title">
            Ihr Partner rund um's Dach
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 sm:mb-5 md:mb-6 lg:mb-8 text-white/95 leading-snug" data-testid="text-hero-subtitle">
            {subtitle}
          </p>
          
          {showCTAs && (
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                asChild
                variant="default"
                size="lg"
                className="text-sm sm:text-base w-full sm:w-auto"
                data-testid="button-hero-quote"
              >
                <Link href="/kontakt">Angebot anfragen</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-sm sm:text-base w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                data-testid="button-hero-call"
              >
                <a href="tel:0234583100" className="flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Jetzt anrufen</span>
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
