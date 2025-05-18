
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/sections/HeroSection";
import ServicesSection from "../components/sections/ServicesSection";
import AboutSection from "../components/sections/AboutSection";
import ApproachSection from "../components/sections/ApproachSection";
import ContactSection from "../components/sections/ContactSection";
import ScrollToTop from "../components/utils/ScrollToTop";
import PageLoader from "../components/utils/PageLoader";
import MetaTags from "../components/utils/MetaTags";

const Index = () => {
  return (
    <div id="top" className="bg-cyber min-h-screen">
      <MetaTags />
      <PageLoader />
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <ApproachSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
