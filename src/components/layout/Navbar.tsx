
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to handle smooth scrolling for anchor links
  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-cyber-dark border-b border-cesium/20 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <button 
              onClick={() => scrollToSection('top')} 
              className="flex-shrink-0 flex items-center"
            >
              <span className="text-cesium font-bold text-2xl">CesiumCyber</span>
              <span className="text-white font-light ml-2">Security</span>
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('top')} 
              className="text-gray-300 hover:text-cesium transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('services')} 
              className="text-gray-300 hover:text-cesium transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-gray-300 hover:text-cesium transition-colors"
            >
              About Us
            </button>
            <button 
              onClick={() => scrollToSection('approach')} 
              className="text-gray-300 hover:text-cesium transition-colors"
            >
              Our Approach
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-gray-300 hover:text-cesium transition-colors"
            >
              Contact
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="bg-cesium hover:bg-cesium-dark text-cyber-dark font-medium px-4 py-2 rounded-md transition-colors"
            >
              Get a Consultation
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              className="text-gray-300 hover:text-white focus:outline-none"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden bg-cyber-dark border-t border-cesium/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button 
              onClick={() => scrollToSection('top')}
              className="text-gray-300 hover:text-cesium block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="text-gray-300 hover:text-cesium block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-300 hover:text-cesium block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              About Us
            </button>
            <button 
              onClick={() => scrollToSection('approach')}
              className="text-gray-300 hover:text-cesium block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Our Approach
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-300 hover:text-cesium block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Contact
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-cesium hover:bg-cesium-dark text-cyber-dark block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Get a Consultation
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
