import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HeroUIProvider } from "@heroui/react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { HeroUIExample } from "./components/HeroUIExample";

const queryClient = new QueryClient();

const App = () => (
  <div className="min-h-screen bg-neutral-950">
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
                      <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/heroui-demo" element={<HeroUIExample />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  </div>
);

export default App;
