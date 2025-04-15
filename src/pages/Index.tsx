
import { useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/sections/HeroSection";
import ServicesSection from "../components/sections/ServicesSection";
import AboutSection from "../components/sections/AboutSection";
import ApproachSection from "../components/sections/ApproachSection";
import TestimonialSection from "../components/sections/TestimonialSection";
import ContactSection from "../components/sections/ContactSection";
import ScrollToTop from "../components/utils/ScrollToTop";
import PageLoader from "../components/utils/PageLoader";
import VoiceAssistantSection from "../components/sections/VoiceAssistantSection";

const Index = () => {
  return (
    <div id="top" className="bg-cyber min-h-screen">
      <PageLoader />
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <ApproachSection />
        <VoiceAssistantSection />
        <TestimonialSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
