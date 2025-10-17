import { Card } from "@/components/ui/card";

interface ReferenceCardProps {
  title: string;
  location: string;
  service: string;
  year: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

export default function ReferenceCard({
  title,
  location,
  service,
  year,
  description,
  imageUrl,
  imageAlt,
}: ReferenceCardProps) {
  return (
    <Card className="overflow-hidden group" data-testid="card-reference">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
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
