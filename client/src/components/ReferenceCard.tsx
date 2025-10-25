import { Card } from "@/components/ui/card";
import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReferenceCardProps {
  title: string;
  location: string;
  service: string;
  year: string;
  description: string;
  imageUrl?: string;
  imageUrls?: string[];
  imageAlt: string;
}

export default function ReferenceCard({
  title,
  location,
  service,
  year,
  description,
  imageUrl,
  imageUrls,
  imageAlt,
}: ReferenceCardProps) {
  const images = imageUrls && imageUrls.length > 0 ? imageUrls : imageUrl ? [imageUrl] : [];
  const hasMultipleImages = images.length > 1;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <Card className="overflow-hidden group" data-testid="card-reference">
      <div className="relative aspect-[4/3] overflow-hidden">
        {hasMultipleImages ? (
          <div className="embla h-full" ref={emblaRef}>
            <div className="embla__container h-full flex">
              {images.map((img, index) => (
                <div key={index} className="embla__slide flex-[0_0_100%] min-w-0 relative">
                  <img
                    src={img}
                    alt={`${imageAlt} - Bild ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            <Button
              size="icon"
              variant="outline"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
              onClick={scrollPrev}
              data-testid="button-carousel-prev"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
              onClick={scrollNext}
              data-testid="button-carousel-next"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === selectedIndex
                      ? "bg-white w-6"
                      : "bg-white/50 hover-elevate"
                  }`}
                  onClick={() => scrollTo(index)}
                  data-testid={`button-carousel-dot-${index}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <img
            src={images[0]}
            alt={imageAlt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <p className="text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl md:text-2xl font-semibold mb-2" data-testid="text-reference-title">
          {title}
        </h3>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span data-testid="text-reference-location">{location}</span>
          <span>•</span>
          <span data-testid="text-reference-service">{service}</span>
          <span>•</span>
          <span data-testid="text-reference-year">{year}</span>
        </div>
      </div>
    </Card>
  );
}
