/**
 * Registriert ein WebMCP-Tool für die Lebensdauer der Komponente.
 *
 * - Registrierung im Effekt, Abmeldung über AbortController (kein
 *   unregisterTool in der Spec); StrictMode-/HMR-sicher durch Abort im Cleanup
 *   und einen Generationszähler, der veraltete Ergebnisse verwirft.
 * - Das übergebene Tool-Objekt muss referenzstabil sein (useMemo) — die
 *   execute-Closure liest aktuellen State über die Bridge, nicht über
 *   Re-Registrierung.
 */

import { useEffect, useState } from "react";
import { registerWebMCPTool, type RegistrationResult, type WebMCPTool } from "@/lib/webmcp";

export function useWebMCPTool(tool: WebMCPTool | null, enabled: boolean = true): RegistrationResult | null {
  const [result, setResult] = useState<RegistrationResult | null>(null);

  useEffect(() => {
    if (!enabled || !tool) {
      setResult(null);
      return;
    }
    const controller = new AbortController();
    let active = true;
    registerWebMCPTool(tool, controller.signal).then((r) => {
      if (active) setResult(r);
    });
    return () => {
      active = false;
      controller.abort();
    };
  }, [tool, enabled]);

  return result;
}
