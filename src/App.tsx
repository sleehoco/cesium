
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import ClientDashboard from "./pages/ClientDashboard";
import BrowserFingerprintingDemo from "./pages/BrowserFingerprintingDemo";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import BadgeRemover from "./components/utils/BadgeRemover";
import GoogleAnalytics from "./components/utils/GoogleAnalytics";
import { useState, useEffect } from "react";

// Updated Google Analytics Measurement ID
const GA_MEASUREMENT_ID = "135-394-7148";

const App = () => {
  // Create a client for React Query with default options
  // Using lazy initialization to avoid issues
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }));

  // Log when the App component mounts
  useEffect(() => {
    console.log("App component mounted");
    return () => console.log("App component unmounted");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />
          <BadgeRemover />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/browser-fingerprinting-demo" element={<BrowserFingerprintingDemo />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/client-dashboard" 
              element={
                <ProtectedRoute>
                  <ClientDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
