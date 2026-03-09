import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "@/pages/Home";

const Services     = lazy(() => import("@/pages/Services"));
const Steildach    = lazy(() => import("@/pages/Steildach"));
const Flachdach    = lazy(() => import("@/pages/Flachdach"));
const Bauklempnerei = lazy(() => import("@/pages/Bauklempnerei"));
const Dachfenster  = lazy(() => import("@/pages/Dachfenster"));
const Reparaturen  = lazy(() => import("@/pages/Reparaturen"));
const Dachwartung  = lazy(() => import("@/pages/Dachwartung"));
const References   = lazy(() => import("@/pages/References"));
const About        = lazy(() => import("@/pages/About"));
const Careers      = lazy(() => import("@/pages/Careers"));
const Contact      = lazy(() => import("@/pages/Contact"));
const Danke        = lazy(() => import("@/pages/Danke"));
const Impressum    = lazy(() => import("@/pages/Impressum"));
const Datenschutz  = lazy(() => import("@/pages/Datenschutz"));
const FAQ          = lazy(() => import("@/pages/FAQ"));
const DachLexikon  = lazy(() => import("@/pages/DachLexikon"));
const NotFound     = lazy(() => import("@/pages/not-found"));
const Foerderung   = lazy(() => import("@/pages/Foerderung"));
const Solarpflicht = lazy(() => import("@/pages/Solarpflicht"));
const DachfensterBochum = lazy(() => import("@/pages/DachfensterBochum"));

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/leistungen" component={Services} />
      <Route path="/leistungen/steildach" component={Steildach} />
      <Route path="/leistungen/flachdach" component={Flachdach} />
      <Route path="/leistungen/bauklempnerei" component={Bauklempnerei} />
      <Route path="/leistungen/dachfenster" component={Dachfenster} />
      <Route path="/leistungen/reparaturen" component={Reparaturen} />
      <Route path="/leistungen/dachwartung" component={Dachwartung} />
      <Route path="/referenzen" component={References} />
      <Route path="/foerderung" component={Foerderung} />
      <Route path="/solarpflicht" component={Solarpflicht} />
      <Route path="/faq" component={FAQ} />
      <Route path="/lexikon" component={DachLexikon} />
      <Route path="/ueber-uns" component={About} />
      <Route path="/karriere" component={Careers} />
      <Route path="/kontakt" component={Contact} />
      <Route path="/danke" component={Danke} />
      <Route path="/impressum" component={Impressum} />
      <Route path="/datenschutz" component={Datenschutz} />
      <Route path="/dachfenster-bochum" component={DachfensterBochum} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-1">
            <Suspense fallback={<div className="flex-1" />}>
              <Router />
            </Suspense>
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
