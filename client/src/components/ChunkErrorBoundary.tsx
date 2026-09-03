import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Phone, RefreshCw } from "lucide-react";

/**
 * Auffangnetz für Seiteninhalte, die sich nicht laden lassen.
 *
 * `lazyWithRetry` wiederholt einen fehlgeschlagenen Chunk-Import zweimal. Scheitern
 * auch die Wiederholungen, wirft React den Fehler weiter und hängt den Teilbaum aus —
 * der Besucher sieht dann eine **weiße Fläche ohne jeden Hinweis**. Genau das ist am
 * 31.08.2026 in zwei GSC-Livetests passiert (`PRERENDER-CHECK.md` §9), und dasselbe
 * trifft Besucher mit instabiler Verbindung.
 *
 * Diese Boundary macht aus dem stummen Ausfall einen sichtbaren, bedienbaren Zustand:
 * Erklärung, Schaltfläche zum Neuladen und die Telefonnummer — der einzige Weg, der
 * auch dann noch funktioniert, wenn die Seite es nicht tut.
 *
 * Navigation und Footer bleiben sichtbar, weil die Boundary nur den Routenbereich
 * umschließt. In `App.tsx` bekommt sie zusätzlich die aktuelle Route als `key`: Ein
 * Klick auf einen anderen Link setzt sie damit automatisch zurück, statt den
 * Fehlerzustand festzuhalten.
 */

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ChunkErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Bewusst console.error: Die Meldung taucht damit sowohl in den DevTools als auch
    // in den JavaScript-Konsolenmeldungen der GSC-URL-Prüfung auf — dort haben wir den
    // Ausfall überhaupt erst gefunden.
    console.error("Seiteninhalt konnte nicht geladen werden:", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Diese Seite konnte nicht geladen werden
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Beim Laden ist etwas dazwischengekommen – meist eine kurz unterbrochene
            Verbindung. Ein neuer Versuch genügt in der Regel.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
              data-testid="button-reload"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Seite neu laden</span>
            </Button>
            <Button asChild size="lg" variant="outline" data-testid="button-call">
              <a href="tel:+49234583100" className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <span>+49 234 583100</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
