
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-cyber-dark border-b border-cesium/20 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-cesium font-bold text-2xl">CesiumCyber</span>
              <span className="text-white font-light ml-2">Security</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-cesium transition-colors">
              Home
            </Link>
            <Link to="/#services" className="text-gray-300 hover:text-cesium transition-colors">
              Services
            </Link>
            <Link to="/#about" className="text-gray-300 hover:text-cesium transition-colors">
              About Us
            </Link>
            <Link to="/#approach" className="text-gray-300 hover:text-cesium transition-colors">
              Our Approach
            </Link>
            <Link to="/#contact" className="text-gray-300 hover:text-cesium transition-colors">
              Contact
            </Link>
            <Link 
              to="/#consult" 
              className="bg-cesium hover:bg-cesium-dark text-cyber-dark font-medium px-4 py-2 rounded-md transition-colors"
            >
              Get a Consultation
            </Link>
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
            <Link 
              to="/"
              className="text-gray-300 hover:text-cesium block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/#services"
              className="text-gray-300 hover:text-cesium block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Services
            </Link>
            <Link 
              to="/#about"
              className="text-gray-300 hover:text-cesium block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              About Us
            </Link>
            <Link 
              to="/#approach"
              className="text-gray-300 hover:text-cesium block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Our Approach
            </Link>
            <Link 
              to="/#contact"
              className="text-gray-300 hover:text-cesium block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Contact
            </Link>
            <Link
              to="/#consult"
              className="bg-cesium hover:bg-cesium-dark text-cyber-dark block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Get a Consultation
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
