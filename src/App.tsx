
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import CyberDashboard from "./pages/CyberDashboard";
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
import M365SecurityAssessment from "./pages/M365SecurityAssessment";
import PolicyGenerator from "./pages/PolicyGenerator";
import AdminPolicyAccess from "./pages/AdminPolicyAccess";
import SalesPipeline from "./pages/SalesPipeline";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import AdminRoleManagement from "./components/admin/AdminRoleManagement";
import BadgeRemover from "./components/utils/BadgeRemover";
import GoogleAnalytics from "./components/utils/GoogleAnalytics";
import { CookieConsent } from "./components/utils/CookieConsent";
import { RouteErrorBoundary } from "./components/utils/RouteErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SecurityScanner from "./pages/SecurityScanner";
// Note: createAdminAccount import removed to prevent blocking app startup

// Google Analytics Measurement ID from environment variable
// Get your GA4 measurement ID from https://analytics.google.com
// Format should be: G-XXXXXXXXXX
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "";

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
            {GA_MEASUREMENT_ID && <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />}
            <BadgeRemover />
            <CookieConsent />
          <Routes>
            <Route path="/" element={<RouteErrorBoundary routeName="Home"><Index /></RouteErrorBoundary>} />
            <Route path="/cyber-dashboard" element={<RouteErrorBoundary routeName="Cyber Dashboard"><CyberDashboard /></RouteErrorBoundary>} />
            <Route path="/services" element={<RouteErrorBoundary routeName="Services"><Services /></RouteErrorBoundary>} />
            <Route path="/contact" element={<RouteErrorBoundary routeName="Contact"><Contact /></RouteErrorBoundary>} />
            <Route path="/pdf-download" element={<RouteErrorBoundary routeName="PDF Download"><PdfDownload /></RouteErrorBoundary>} />
            <Route path="/founders" element={<RouteErrorBoundary routeName="Team"><Founders /></RouteErrorBoundary>} />
            <Route path="/blog" element={<RouteErrorBoundary routeName="Blog"><Blog /></RouteErrorBoundary>} />
            <Route path="/image-generator" element={<RouteErrorBoundary routeName="Image Generator"><ImageGeneratorPage /></RouteErrorBoundary>} />
            <Route path="/blog/:slug" element={<RouteErrorBoundary routeName="Blog Post"><BlogPost /></RouteErrorBoundary>} />
            <Route path="/create-blog" element={<RouteErrorBoundary routeName="Create Blog"><CreateBlog /></RouteErrorBoundary>} />
            <Route path="/newsletter-manager" element={<RouteErrorBoundary routeName="Newsletter Manager"><NewsletterManager /></RouteErrorBoundary>} />
            <Route path="/blog-generator" element={<RouteErrorBoundary routeName="Blog Generator"><BlogGenerator /></RouteErrorBoundary>} />
            <Route path="/auth" element={<RouteErrorBoundary routeName="Authentication"><Auth /></RouteErrorBoundary>} />
            <Route path="/browser-fingerprinting-demo" element={<RouteErrorBoundary routeName="Browser Fingerprinting"><BrowserFingerprintingDemo /></RouteErrorBoundary>} />
            <Route path="/hidden-code-detector" element={<RouteErrorBoundary routeName="Hidden Code Detector"><HiddenCodeDetectorPage /></RouteErrorBoundary>} />
            <Route path="/m365-security-assessment" element={<RouteErrorBoundary routeName="M365 Security"><M365SecurityAssessment /></RouteErrorBoundary>} />
            <Route 
              path="/security-scanner" 
              element={
                <RouteErrorBoundary routeName="Security Scanner">
                  <ProtectedRoute>
                    <SecurityScanner />
                  </ProtectedRoute>
                </RouteErrorBoundary>
              } 
            />
          <Route path="/policy-generator" element={<RouteErrorBoundary routeName="Policy Generator"><PolicyGenerator /></RouteErrorBoundary>} />
          <Route path="/admin/policy-access" element={<RouteErrorBoundary routeName="Admin Policy Access"><AdminPolicyAccess /></RouteErrorBoundary>} />
            {/* Redirect old insecure login route to secure auth */}
            <Route path="/login" element={<Navigate to="/auth" replace />} />
            <Route 
              path="/client-dashboard" 
              element={
                <RouteErrorBoundary routeName="Client Dashboard">
                  <ProtectedRoute>
                    <ClientDashboard />
                  </ProtectedRoute>
                </RouteErrorBoundary>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <RouteErrorBoundary routeName="Admin Dashboard">
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                </RouteErrorBoundary>
              } 
            />
            <Route 
              path="/admin/roles" 
              element={
                <RouteErrorBoundary routeName="Admin Role Management">
                  <AdminRoute>
                    <AdminRoleManagement />
                  </AdminRoute>
                </RouteErrorBoundary>
              } 
            />
            <Route 
              path="/admin/security" 
              element={<RouteErrorBoundary routeName="Admin Security"><AdminSecurity /></RouteErrorBoundary>} 
            />
            <Route 
              path="/admin/sales" 
              element={
                <RouteErrorBoundary routeName="Sales Pipeline">
                  <AdminRoute>
                    <SalesPipeline />
                  </AdminRoute>
                </RouteErrorBoundary>
              } 
            />
            <Route path="*" element={<RouteErrorBoundary routeName="404"><NotFound /></RouteErrorBoundary>} />
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
