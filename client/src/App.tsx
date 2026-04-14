import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import ScrollToTop from "@/components/ScrollToTop";
import Home from "@/pages/Home";

const Services     = lazy(() => import("@/pages/Services"));
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
const FlachdachBochum   = lazy(() => import("@/pages/FlachdachBochum"));
const Dachreparatur     = lazy(() => import("@/pages/Dachreparatur"));
const SteildachBochum   = lazy(() => import("@/pages/SteildachBochum"));
const BauklempnereiBochum = lazy(() => import("@/pages/BauklempnereiBochum"));
const DachwartungBochum = lazy(() => import("@/pages/DachwartungBochum"));
const VeluxAustausch = lazy(() => import("@/pages/VeluxAustausch"));
const VeluxRolllaeden = lazy(() => import("@/pages/VeluxRolllaeden"));
const GruendachBochum = lazy(() => import("@/pages/GruendachBochum"));
const SteildachFoerderungBochum = lazy(() => import("@/pages/SteildachFoerderungBochum"));
const DachgaubeBochum = lazy(() => import("@/pages/DachgaubeBochum"));
const AufsparrendaemmungBochum = lazy(() => import("@/pages/AufsparrendaemmungBochum"));
const SteildachUndichtBochum = lazy(() => import("@/pages/SteildachUndichtBochum"));
const DachsanierungBochum = lazy(() => import("@/pages/DachsanierungBochum"));
const SturmschadenDach = lazy(() => import("@/pages/SturmschadenDach"));
const BitumenVsPvc = lazy(() => import("@/pages/BitumenVsPvc"));

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/leistungen" component={Services} />
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
      <Route path="/flachdach-bochum" component={FlachdachBochum} />
      <Route path="/dachreparatur-bochum" component={Dachreparatur} />
      <Route path="/steildach-bochum" component={SteildachBochum} />
      <Route path="/bauklempnerei-bochum" component={BauklempnereiBochum} />
      <Route path="/dachwartung-bochum" component={DachwartungBochum} />
      <Route path="/velux-dachfenster-austausch-bochum" component={VeluxAustausch} />
      <Route path="/velux-dachfenster-rolllaeden-bochum" component={VeluxRolllaeden} />
      <Route path="/gruendach-dachbegrunung-bochum" component={GruendachBochum} />
      <Route path="/steildach-foerderung-bochum" component={SteildachFoerderungBochum} />
      <Route path="/dachgaube-bochum" component={DachgaubeBochum} />
      <Route path="/aufsparrendaemmung-bochum" component={AufsparrendaemmungBochum} />
      <Route path="/steildach-undicht-bochum" component={SteildachUndichtBochum} />
      <Route path="/dachsanierung-bochum" component={DachsanierungBochum} />
          <Route path="/sturmschaden-dach-bochum" component={SturmschadenDach} />
          <Route path="/bitumen-vs-pvc-flachdach-bochum" component={BitumenVsPvc} />
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
        <StickyMobileCTA />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
