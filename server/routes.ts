import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Keine API-Routen mehr notwendig
  // Kontaktformular wird von Netlify Forms verarbeitet
  
  const httpServer = createServer(app);

  return httpServer;
}
