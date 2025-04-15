
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cyber-dark border-t border-cesium/20 text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-start">
              <span className="text-cesium font-bold text-2xl">CesiumCyber</span>
              <span className="text-white font-light ml-2">Security</span>
            </Link>
            <p className="mt-4 text-sm">
              Providing advanced cybersecurity solutions to protect your business from evolving threats.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-cesium transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/#services" className="hover:text-cesium transition-colors">Services</Link>
              </li>
              <li>
                <Link to="/#about" className="hover:text-cesium transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/#approach" className="hover:text-cesium transition-colors">Our Approach</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/#vulnerability-assessment" className="hover:text-cesium transition-colors">
                  Vulnerability Assessment
                </Link>
              </li>
              <li>
                <Link to="/#penetration-testing" className="hover:text-cesium transition-colors">
                  Penetration Testing
                </Link>
              </li>
              <li>
                <Link to="/#security-consulting" className="hover:text-cesium transition-colors">
                  Security Consulting
                </Link>
              </li>
              <li>
                <Link to="/#incident-response" className="hover:text-cesium transition-colors">
                  Incident Response
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-cesium mr-2 mt-0.5" />
                <span>123 Cyber Street, Tech City, TC 10101</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-cesium mr-2" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-cesium mr-2" />
                <span>info@cesiumcyber.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cesium/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {currentYear} CesiumCyber Security. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-cesium">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-cesium">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
