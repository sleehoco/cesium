
import ScrollAnimation from "../utils/ScrollAnimation";
import ContactForm from "./contact/ContactForm";
import ContactInfo from "./contact/ContactInfo";
import ConsultationBooking from "./contact/ConsultationBooking";

const ContactSection = () => {
  return (
    <div id="contact" className="bg-cyber py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Contact <span className="text-cesium">Us</span>
          </h2>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            Let's discuss how we can secure your digital assets
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ScrollAnimation>
            <ContactForm />
          </ScrollAnimation>
          
          <div>
            <ContactInfo />
            
            <ScrollAnimation className="delay-200">
              <ConsultationBooking />
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
