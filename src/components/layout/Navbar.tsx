
import { useState } from "react";
import { Menu, X, LogIn, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import CyberSecuritySearch from "../search/CyberSecuritySearch";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    
    // If we're on the services page and trying to navigate to home sections
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
    setIsMenuOpen(false);
    if (location.pathname === '/') {
      scrollToSection('services');
    } else {
      // Navigate to services page
      window.location.href = '/services';
    }
  };

  return (
    <nav className="bg-black-dark border-b border-gold/20 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-gold font-bold text-2xl">CesiumCyber</span>
              <span className="text-white font-light ml-2">Security</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-gold transition-colors">
              Home
            </Link>
            <button 
              onClick={handleServicesClick}
              className="text-gray-300 hover:text-gold transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-gray-300 hover:text-gold transition-colors"
            >
              About Us
            </button>
            <button 
              onClick={() => scrollToSection('approach')} 
              className="text-gray-300 hover:text-gold transition-colors"
            >
              Our Approach
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-gray-300 hover:text-gold transition-colors"
            >
              Contact
            </button>
            <Button 
              onClick={toggleSearch}
              variant="ghost" 
              className="text-gray-300 hover:text-gold p-2"
              size="icon"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Link 
              to="/login"
              className="bg-gold hover:bg-gold-dark text-black-dark font-medium px-4 py-2 rounded-md transition-colors flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </div>
          
          <div className="flex md:hidden items-center space-x-4">
            <Button 
              onClick={toggleSearch}
              variant="ghost" 
              className="text-gray-300 hover:text-gold p-2"
              size="icon"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Link 
              to="/login"
              className="text-gold hover:text-gold-dark"
            >
              <LogIn />
            </Link>
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

      {isMenuOpen && (
        <div className="md:hidden bg-black-dark border-t border-gold/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/"
              className="text-gray-300 hover:text-gold block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <button 
              onClick={handleServicesClick}
              className="text-gray-300 hover:text-gold block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-300 hover:text-gold block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              About Us
            </button>
            <button 
              onClick={() => scrollToSection('approach')}
              className="text-gray-300 hover:text-gold block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Our Approach
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-300 hover:text-gold block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              Contact
            </button>
            <Link 
              to="/login"
              className="bg-gold hover:bg-gold-dark text-black-dark block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </div>
        </div>
      )}
      
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-[600px] bg-cyber-dark border border-cesium/20">
          <DialogHeader>
            <DialogTitle className="text-gold">Search Cybersecurity Events</DialogTitle>
          </DialogHeader>
          <CyberSecuritySearch onClose={() => setIsSearchOpen(false)} />
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
