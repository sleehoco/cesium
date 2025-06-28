
import ScrollAnimation from "../utils/ScrollAnimation";
import FadeInSection from "../utils/FadeInSection";
import ContactForm from "./contact/ContactForm";
import ContactInfo from "./contact/ContactInfo";
import ConsultationBooking from "./contact/ConsultationBooking";
import BackgroundAnimations from "../utils/BackgroundAnimations";

const ContactSection = () => {
  return (
    <div id="contact" className="bg-cyber py-20 relative overflow-hidden">
      {/* Enhanced background animations */}
      <BackgroundAnimations 
        includeParticles={true}
        includeGradients={false}
        includeInteractive={true}
        particleCount={30}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <FadeInSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Contact <span className="text-cesium">Us</span>
            </h2>
          </FadeInSection>
          <FadeInSection delay={200}>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              Let's discuss how we can secure your digital assets
            </p>
          </FadeInSection>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <FadeInSection direction="right">
            <div className="transform transition-all duration-500 hover:scale-105">
              <ContactForm />
            </div>
          </FadeInSection>
          
          <div className="space-y-8">
            <FadeInSection delay={200} direction="left">
              <div className="transform transition-all duration-500 hover:scale-105">
                <ContactInfo />
              </div>
            </FadeInSection>
            
            <FadeInSection delay={400} direction="left">
              <div className="transform transition-all duration-500 hover:scale-105">
                <ConsultationBooking />
              </div>
            </FadeInSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
