import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import Picture from "@/components/Picture";

interface ServiceCardProps {
  title: string;
  description: string;
  imageUrl: string;
  imageUrlFallback?: string;
  imageAlt: string;
  href: string;
  benefits: string[];
  ctaLabel?: string;
}

export default function ServiceCard({
  title,
  description,
  imageUrl,
  imageUrlFallback,
  imageAlt,
  href,
  benefits,
  ctaLabel = "Mehr erfahren",
}: ServiceCardProps) {
  return (
    <Card className="overflow-hidden hover:-translate-y-1 transition-all duration-200" data-testid={`card-service-${title.toLowerCase()}`}>
      <div className="aspect-video overflow-hidden">
        <Picture
          src={imageUrl}
          fallback={imageUrlFallback}
          alt={imageAlt}
          className="w-full h-full object-cover"
          width={800}
          height={450}
          loading="lazy"
        />
      </div>
      <div className="p-6 md:p-8">
        <h3 className="text-2xl md:text-3xl font-semibold mb-3" data-testid="text-service-title">
          {title}
        </h3>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4">
          {description}
        </p>
        <ul className="space-y-2 mb-6">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2 text-sm md:text-base">
              <span className="text-primary mt-1">✓</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        <Button asChild variant="outline" className="w-full" data-testid="button-service-more">
          <Link href={href} className="flex items-center justify-center gap-2">
            {ctaLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
