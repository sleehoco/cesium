
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
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import ImageGeneratorPage from "./pages/ImageGenerator";
import CreateBlog from "./pages/CreateBlog";
import NewsletterManager from "./pages/NewsletterManager";
import Auth from "./pages/Auth";
import ClientDashboard from "./pages/ClientDashboard";
import BrowserFingerprintingDemo from "./pages/BrowserFingerprintingDemo";
import HiddenCodeDetectorPage from "./pages/HiddenCodeDetector";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSecurity from "./pages/AdminSecurity";
import NotFound from "./pages/NotFound";
import M365SecurityAssessment from "./pages/M365SecurityAssessment";
import PolicyGenerator from "./pages/PolicyGenerator";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import AdminRoleManagement from "./components/admin/AdminRoleManagement";
import BadgeRemover from "./components/utils/BadgeRemover";
import GoogleAnalytics from "./components/utils/GoogleAnalytics";
import { AuthProvider } from "./contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
// Note: createAdminAccount import removed to prevent blocking app startup

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
            <Route path="/blog" element={<Blog />} />
            <Route path="/image-generator" element={<ImageGeneratorPage />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/create-blog" element={<CreateBlog />} />
            <Route path="/newsletter-manager" element={<NewsletterManager />} />
            <Route path="/blog-generator" element={<BlogGenerator />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/browser-fingerprinting-demo" element={<BrowserFingerprintingDemo />} />
            <Route path="/hidden-code-detector" element={<HiddenCodeDetectorPage />} />
            <Route path="/m365-security-assessment" element={<M365SecurityAssessment />} />
            <Route path="/policy-generator" element={<PolicyGenerator />} />
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
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
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
