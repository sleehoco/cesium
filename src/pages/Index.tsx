
import React, { Suspense, lazy } from "react";
import ProfessionalNavbar from "../components/layout/ProfessionalNavbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/sections/HeroSection";
import ScrollToTop from "../components/utils/ScrollToTop";
import PageLoader from "../components/utils/PageLoader";
import MetaTags from "../components/utils/MetaTags";
import LazyLoad from "../components/utils/LazyLoad";

// Lazy load non-critical sections
const ServicesSection = lazy(() => import("../components/sections/ServicesSection"));
const AboutSection = lazy(() => import("../components/sections/AboutSection"));
const ApproachSection = lazy(() => import("../components/sections/ApproachSection"));
const ContactSection = lazy(() => import("../components/sections/ContactSection"));

// Simple fallback for lazy loaded components
const SectionFallback = () => (
  <div className="w-full h-64 bg-cyber-light/5 animate-pulse"></div>
);

const Index = () => {
  return (
    <div id="top" className="bg-cyber min-h-screen">
      <MetaTags 
        title="CesiumCyber Security - Advanced Cybersecurity Solutions for Business"
        description="Protect your digital assets with our comprehensive security solutions including penetration testing, vulnerability assessment, and incident response services."
        keywords="cybersecurity, penetration testing, vulnerability assessment, security consulting, incident response, cloud security, data protection, GDPR compliance, HIPAA compliance, cybersecurity services"
        url="https://cesiumcyber.com"
        canonical="https://cesiumcyber.com"
        modifiedTime={new Date().toISOString()}
      />
      <PageLoader />
      <ProfessionalNavbar />
      <main className="pt-16 lg:pt-20">
        {/* Critical section - load immediately */}
        <HeroSection />
        
        {/* Non-critical sections - lazy load */}
        <LazyLoad height="400px">
          <Suspense fallback={<SectionFallback />}>
            <ServicesSection />
          </Suspense>
        </LazyLoad>
        
        <LazyLoad height="400px">
          <Suspense fallback={<SectionFallback />}>
            <AboutSection />
          </Suspense>
        </LazyLoad>
        
        <LazyLoad height="400px">
          <Suspense fallback={<SectionFallback />}>
            <ApproachSection />
          </Suspense>
        </LazyLoad>
        
        <LazyLoad height="500px">
          <Suspense fallback={<SectionFallback />}>
            <ContactSection />
          </Suspense>
        </LazyLoad>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
