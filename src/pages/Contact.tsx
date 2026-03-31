import React, { useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import MetaTags from "../components/utils/MetaTags";
import ScrollAnimation from "../components/utils/ScrollAnimation";
import ContactForm from "../components/sections/contact/ContactForm";
import ContactInfo from "../components/sections/contact/ContactInfo";
import ConsultationBooking from "../components/sections/contact/ConsultationBooking";
import { useLocation } from "react-router-dom";

const Contact = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if there's a pre-filled message in the URL state
    const serviceName = location.state?.serviceName;
    const prefillMessage = location.state?.prefillMessage;
    if (serviceName || prefillMessage) {
      // Wait for the form to be rendered and then pre-fill it
      setTimeout(() => {
        const messageTextarea = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
        const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
        
        if (messageTextarea) {
          const defaultMessage =
            prefillMessage ||
            `I'm interested in ${serviceName}. Please provide more information about your services.`;
          messageTextarea.value = defaultMessage;
          
          // Trigger events to update form state
          const inputEvent = new Event('input', { bubbles: true });
          const changeEvent = new Event('change', { bubbles: true });
          messageTextarea.dispatchEvent(inputEvent);
          messageTextarea.dispatchEvent(changeEvent);
        }
        
        // Focus on the name field instead of the message field
        if (nameInput) {
          nameInput.focus();
        }
      }, 500);
    }
  }, [location.state]);

  return (
    <div className="bg-cyber min-h-screen">
      <MetaTags 
        title="Contact Us - CesiumCyber Security Solutions"
        description="Get in touch with CesiumCyber for comprehensive cybersecurity solutions. Schedule a consultation or send us a message about your security needs."
        keywords="contact cybersecurity, security consultation, cybersecurity services contact, penetration testing inquiry"
        url="https://cesiumcyber.com/contact"
        canonical="https://cesiumcyber.com/contact"
      />

      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-cyber py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Contact <span className="text-cesium">Us</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Let's discuss how we can secure your digital assets and protect your business from cyber threats.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-cyber py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <ScrollAnimation>
                <ContactForm />
              </ScrollAnimation>
              
              <div className="space-y-8">
                <ContactInfo />
                
                <ScrollAnimation className="delay-200">
                  <ConsultationBooking />
                </ScrollAnimation>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
