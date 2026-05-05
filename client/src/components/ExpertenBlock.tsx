import { CheckCircle } from "lucide-react";

declare const __BUILD_DATE__: string;

interface ExpertenBlockProps {
  normen?: string[];
}

const DEFAULT_NORMEN = ["GEG 2024", "ZVDH-Regelwerk", "BAFA BEG EM"];

export default function ExpertenBlock({ normen = DEFAULT_NORMEN }: ExpertenBlockProps) {
  const reviewDate = typeof __BUILD_DATE__ !== "undefined" ? __BUILD_DATE__ : "2026";

  return (
    <div
      className="max-w-4xl mx-auto px-4 mb-2"
      data-testid="experten-block"
    >
      <div className="bg-card border border-border rounded-md px-5 py-4 flex items-start gap-4">
        <img
          src="/images/Tim_Rex_Dachdeckermeister_Bochum.webp"
          alt="Tim Rex, Geschäftsführer und Dachdeckermeister der Rex Bedachungs GmbH in Bochum"
          width={44}
          height={44}
          loading="lazy"
          decoding="async"
          className="w-11 h-11 rounded-full object-cover flex-shrink-0"
          data-testid="img-tim-rex-avatar"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-snug">Tim Rex</p>
          <p className="text-xs text-muted-foreground mt-0.5">Geschäftsführer · Dachdeckermeister</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-50 text-green-800 px-2 py-0.5 rounded">
              <CheckCircle className="w-3 h-3" />
              Meisterbetrieb seit 1984
            </span>
            {normen.map((n) => (
              <span key={n} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                {n}
              </span>
            ))}
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
              Geprüft: {reviewDate}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Alle Inhalte dieser Seite werden von unserem Fachbetrieb auf Aktualität und Normkonformität geprüft.
          </p>
        </div>
      </div>
    </div>
  );
}
