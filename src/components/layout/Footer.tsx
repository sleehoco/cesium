
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Function to handle smooth scrolling for anchor links
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-cyber-dark border-t border-cesium/20 text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <button 
              onClick={() => scrollToSection('top')} 
              className="flex items-start"
            >
              <span className="text-cesium font-bold text-2xl">CesiumCyber</span>
              <span className="text-white font-light ml-2">Security</span>
            </button>
            <p className="mt-4 text-sm">
              Providing advanced cybersecurity solutions to protect your business from evolving threats.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('top')} 
                  className="hover:text-cesium transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="hover:text-cesium transition-colors"
                >
                  Services
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="hover:text-cesium transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('approach')} 
                  className="hover:text-cesium transition-colors"
                >
                  Our Approach
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="hover:text-cesium transition-colors"
                >
                  Vulnerability Assessment
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="hover:text-cesium transition-colors"
                >
                  Penetration Testing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="hover:text-cesium transition-colors"
                >
                  Security Consulting
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="hover:text-cesium transition-colors"
                >
                  Incident Response
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-cesium mr-2 mt-0.5" />
                <span>3500 Cedar Ave. Columbia, MD 21045</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-cesium mr-2" />
                <span>(301) 531-5670</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-cesium mr-2" />
                <span>information@cesiumcyber.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cesium/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {currentYear} CesiumCyber Security. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <button className="text-gray-400 hover:text-cesium">
              Privacy Policy
            </button>
            <button className="text-gray-400 hover:text-cesium">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
