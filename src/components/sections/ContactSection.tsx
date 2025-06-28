
import ScrollAnimation from "../utils/ScrollAnimation";
import ContactForm from "./contact/ContactForm";
import ContactInfo from "./contact/ContactInfo";
import ConsultationBooking from "./contact/ConsultationBooking";

const ContactSection = () => {
  return (
    <div id="contact" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Contact <span className="text-blue-600">Us</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to secure your business? Let's discuss how we can protect your digital assets
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <ScrollAnimation>
            <ContactForm />
          </ScrollAnimation>
          
          <div className="space-y-12">
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
