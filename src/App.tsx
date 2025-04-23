
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import News from "./pages/News";
import SymptomChecker from "./pages/SymptomChecker";
import FitnessTracker from "./pages/FitnessTracker";
import Nutrition from "./pages/Nutrition";
import NotFound from "./pages/NotFound";

import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/news" element={<Layout><News /></Layout>} />
          <Route path="/symptoms" element={<Layout><SymptomChecker /></Layout>} />
          <Route path="/fitness" element={<Layout><FitnessTracker /></Layout>} />
          <Route path="/nutrition" element={<Layout><Nutrition /></Layout>} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
