import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

// Pages - Chemins relatifs (./) pour que Netlify les trouve
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
      {/* On a retiré TooltipProvider et Toaster qui bloquaient le build */}
      <Router />
    </QueryClientProvider>
  );
}

export default App;
