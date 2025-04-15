
import { useState } from "react";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import ScrollAnimation from "../utils/ScrollAnimation";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would submit the form data
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", company: "", message: "" });
  };

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
          {/* Contact Form */}
          <ScrollAnimation>
            <div className="bg-cyber-dark rounded-lg border border-cesium/20 p-6 md:p-8">
              <h3 className="text-2xl font-semibold text-white mb-6">Send us a message</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md bg-cyber border border-cesium/30 text-white focus:border-cesium focus:ring-1 focus:ring-cesium outline-none transition-colors"
                    placeholder="Your name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md bg-cyber border border-cesium/30 text-white focus:border-cesium focus:ring-1 focus:ring-cesium outline-none transition-colors"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md bg-cyber border border-cesium/30 text-white focus:border-cesium focus:ring-1 focus:ring-cesium outline-none transition-colors"
                    placeholder="Your company name"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-md bg-cyber border border-cesium/30 text-white focus:border-cesium focus:ring-1 focus:ring-cesium outline-none transition-colors"
                    placeholder="How can we help you?"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="w-full bg-cesium hover:bg-cesium-dark text-cyber-dark font-medium px-4 py-3 rounded-md transition-colors flex items-center justify-center"
                  >
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </form>
            </div>
          </ScrollAnimation>
          
          {/* Contact Information */}
          <div>
            <div className="bg-cyber-dark rounded-lg border border-cesium/20 p-6 md:p-8 mb-8">
              <h3 className="text-2xl font-semibold text-white mb-6">Get in touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-cesium/10 rounded-full p-3 mr-4">
                    <Mail className="h-6 w-6 text-cesium" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Email</h4>
                    <p className="text-gray-400">info@cesiumcyber.com</p>
                    <p className="text-gray-400">support@cesiumcyber.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-cesium/10 rounded-full p-3 mr-4">
                    <Phone className="h-6 w-6 text-cesium" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Phone</h4>
                    <p className="text-gray-400">(555) 123-4567</p>
                    <p className="text-gray-400">(555) 987-6543</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-cesium/10 rounded-full p-3 mr-4">
                    <MapPin className="h-6 w-6 text-cesium" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Office</h4>
                    <p className="text-gray-400">123 Cyber Street</p>
                    <p className="text-gray-400">Tech City, TC 10101</p>
                  </div>
                </div>
              </div>
            </div>
            
            <ScrollAnimation className="delay-200">
              <div id="consult" className="bg-cyber-dark rounded-lg border border-cesium/20 p-6 md:p-8">
                <h3 className="text-2xl font-semibold text-white mb-4">Free Consultation</h3>
                <p className="text-gray-400 mb-6">
                  Schedule a free 30-minute consultation with our security experts to discuss your cybersecurity needs.
                </p>
                <button className="w-full bg-cesium hover:bg-cesium-dark text-cyber-dark font-medium px-4 py-3 rounded-md transition-colors">
                  Book a Consultation
                </button>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
