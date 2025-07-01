import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBorder, setShowBorder] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowBorder(true);
      } else {
        setShowBorder(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname === '/services' && ['top', 'about', 'approach', 'contact'].includes(sectionId)) {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleServicesClick = () => {
    if (location.pathname === '/') {
      scrollToSection('services');
    } else {
      window.location.href = '/services';
    }
  };

  const handleContactClick = () => {
    if (location.pathname === '/') {
      scrollToSection('contact');
    } else {
      window.location.href = '/contact';
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      showBorder ? 'bg-cyber border-b border-cesium/20 backdrop-blur-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/b24b90f5-8a07-4589-821e-d614e2703fa9.png" 
              alt="CesiumCyber Security Logo" 
              className="h-8 w-8"
            />
            <span className="text-cesium font-bold text-xl">CesiumCyber</span>
            <span className="text-white font-light">Security</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-cesium transition-colors">
              Home
            </Link>
            <button 
              onClick={handleServicesClick}
              className="text-white hover:text-cesium transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-white hover:text-cesium transition-colors"
            >
              About
            </button>
            <Link 
              to="/julia-morrison"
              className="text-white hover:text-cesium transition-colors"
            >
              Julia Morrison
            </Link>
            <Link 
              to="/pdf-download"
              className="text-white hover:text-cesium transition-colors"
            >
              Free Guide
            </Link>
            <button 
              onClick={handleContactClick}
              className="bg-cesium text-black px-4 py-2 rounded-md hover:bg-cesium/80 transition-colors font-medium"
            >
              Contact Us
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-cesium focus:outline-none focus:text-cesium transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-cyber border-t border-cesium/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                className="block px-3 py-2 text-white hover:text-cesium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <button 
                onClick={() => {
                  handleServicesClick();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-white hover:text-cesium transition-colors"
              >
                Services
              </button>
              <button 
                onClick={() => {
                  scrollToSection('about');
                  setIsOpen(false);
                }} 
                className="block w-full text-left px-3 py-2 text-white hover:text-cesium transition-colors"
              >
                About
              </button>
              <Link 
                to="/julia-morrison"
                className="block px-3 py-2 text-white hover:text-cesium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Julia Morrison
              </Link>
              <Link 
                to="/pdf-download"
                className="block px-3 py-2 text-white hover:text-cesium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Free Guide
              </Link>
              <button 
                onClick={() => {
                  handleContactClick();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 bg-cesium text-black rounded-md hover:bg-cesium/80 transition-colors font-medium mx-3 mt-2"
              >
                Contact Us
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
