
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import PdfDownload from "./pages/PdfDownload";
import Founders from "./pages/Founders";
import BlogGenerator from "./pages/BlogGenerator";
import Auth from "./pages/Auth";
import ClientDashboard from "./pages/ClientDashboard";
import BrowserFingerprintingDemo from "./pages/BrowserFingerprintingDemo";
import AdminSecurity from "./pages/AdminSecurity";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import AdminRoleManagement from "./components/admin/AdminRoleManagement";
import BadgeRemover from "./components/utils/BadgeRemover";
import GoogleAnalytics from "./components/utils/GoogleAnalytics";
import { AuthProvider } from "./contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./utils/createAdminAccount"; // Auto-execute admin account creation

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
        <AuthProvider>
          <BrowserRouter>
            <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />
            <BadgeRemover />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/pdf-download" element={<PdfDownload />} />
            <Route path="/founders" element={<Founders />} />
            <Route path="/blog-generator" element={<BlogGenerator />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/browser-fingerprinting-demo" element={<BrowserFingerprintingDemo />} />
            {/* Redirect old insecure login route to secure auth */}
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route 
              path="/client-dashboard" 
              element={
                <ProtectedRoute>
                  <ClientDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/roles" 
              element={
                <AdminRoute>
                  <AdminRoleManagement />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/security" 
              element={<AdminSecurity />} 
            />
            <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
