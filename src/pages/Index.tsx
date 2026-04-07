
import React, { Suspense, lazy, useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/sections/HeroSection";
import ScrollToTop from "../components/utils/ScrollToTop";
import PageLoader from "../components/utils/PageLoader";
import MetaTags from "../components/utils/MetaTags";
import LazyLoad from "../components/utils/LazyLoad";
import IranCyberRiskBanner from "../components/sections/IranCyberRiskBanner";
import SecurityRobotSection from "../components/sections/SecurityRobotSection";
import CesiumCyberTextGraphic from "../components/sections/CesiumCyberTextGraphic";

// Lazy load non-critical sections
const ServicesSection = lazy(() => import("../components/sections/ServicesSection"));
const AboutSection = lazy(() => import("../components/sections/AboutSection"));
const ApproachSection = lazy(() => import("../components/sections/ApproachSection"));
const FaqSection = lazy(() => import("../components/sections/FaqSection"));
const ContactSection = lazy(() => import("../components/sections/ContactSection"));

// Simple fallback for lazy loaded components
const SectionFallback = () => (
  <div className="w-full h-64 bg-cyber-light/5 animate-pulse"></div>
);

const Index = () => {
  const [introPhase, setIntroPhase] = useState<'visible' | 'dissolving' | 'hidden'>('visible');
  const isIntroVisible = introPhase !== 'hidden';
  const isIntroDissolving = introPhase === 'dissolving';

  useEffect(() => {
    const dissolveTimer = window.setTimeout(() => {
      setIntroPhase('dissolving');
    }, 2200);

    const hideTimer = window.setTimeout(() => {
      setIntroPhase('hidden');
    }, 3200);

    return () => {
      window.clearTimeout(dissolveTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div id="top" className="bg-cyber min-h-screen">
      <MetaTags 
        title="Small Business Cybersecurity Services in Maryland | CesiumCyber"
        description="CesiumCyber provides small business cybersecurity services from Columbia, Maryland, including vulnerability assessments, penetration testing, Microsoft 365 security, incident response, and ongoing protection."
        keywords="small business cybersecurity, cybersecurity services Maryland, Columbia MD cybersecurity, managed cybersecurity services, penetration testing, vulnerability assessment, Microsoft 365 security, incident response, compliance assistance"
        url="https://cesiumcyber.com"
        canonical="https://cesiumcyber.com"
        modifiedTime={new Date().toISOString()}
      />
      <PageLoader />
      {isIntroVisible ? <CesiumCyberTextGraphic fullscreen dissolving={isIntroDissolving} /> : null}
      <div
        className={`transition-all duration-1000 ease-out ${
          introPhase === 'visible'
            ? 'opacity-0 blur-[8px] scale-[1.01]'
            : isIntroDissolving
              ? 'opacity-100 blur-0 scale-100'
              : 'opacity-100 blur-0 scale-100'
        }`}
      >
      <Navbar />
      <main>
        {/* Critical section - load immediately */}
        <HeroSection />

        {/* Iran Cyber Risk Advisory */}
        <IranCyberRiskBanner />
        
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

        <SecurityRobotSection />

        <LazyLoad height="400px">
          <Suspense fallback={<SectionFallback />}>
            <FaqSection />
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
    </div>
  );
};

export default Index;
