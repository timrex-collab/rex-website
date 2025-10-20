import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Steildach from "@/pages/Steildach";
import Flachdach from "@/pages/Flachdach";
import Bauklempnerei from "@/pages/Bauklempnerei";
import Dachfenster from "@/pages/Dachfenster";
import Dachwartung from "@/pages/Dachwartung";
import References from "@/pages/References";
import About from "@/pages/About";
import Careers from "@/pages/Careers";
import Contact from "@/pages/Contact";
import Impressum from "@/pages/Impressum";
import Datenschutz from "@/pages/Datenschutz";
import FAQ from "@/pages/FAQ";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/leistungen" component={Services} />
      <Route path="/leistungen/steildach" component={Steildach} />
      <Route path="/leistungen/flachdach" component={Flachdach} />
      <Route path="/leistungen/bauklempnerei" component={Bauklempnerei} />
      <Route path="/leistungen/dachfenster" component={Dachfenster} />
      <Route path="/leistungen/dachwartung" component={Dachwartung} />
      <Route path="/referenzen" component={References} />
      <Route path="/faq" component={FAQ} />
      <Route path="/ueber-uns" component={About} />
      <Route path="/karriere" component={Careers} />
      <Route path="/kontakt" component={Contact} />
      <Route path="/impressum" component={Impressum} />
      <Route path="/datenschutz" component={Datenschutz} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
