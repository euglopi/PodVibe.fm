import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import LandingPage from "@/pages/LandingPage";

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <LandingPage />
    </TooltipProvider>
  );
}

export default App;
