import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip"; // Si ça bloque encore ici, remplace par ./components/ui/tooltip

// Pages - Remplacés par des chemins relatifs pour éviter les erreurs de build
import MainMenu from "./pages/MainMenu";
import GameRoom from "./pages/GameRoom";
import ResultScreen from "./pages/ResultScreen";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={MainMenu} />
      <Route path="/game" component={GameRoom} />
      <Route path="/result" component={ResultScreen} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Le Toaster a été supprimé car son fichier est manquant ou mal configuré */}
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
