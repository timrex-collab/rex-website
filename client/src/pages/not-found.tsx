import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Seite nicht gefunden
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Die von Ihnen gesuchte Seite existiert leider nicht. 
          Möglicherweise wurde sie verschoben oder gelöscht.
        </p>
        <Button asChild size="lg" data-testid="button-home">
          <Link href="/" className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            <span>Zurück zur Startseite</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
