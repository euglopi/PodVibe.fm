import { Route, Switch } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import LandingPage from "@/pages/LandingPage";
// @ts-expect-error - JSX component without type declarations
import SummarizerApp from "./SummarizerApp";

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/app" component={SummarizerApp} />
      </Switch>
    </TooltipProvider>
  );
}

export default App;
