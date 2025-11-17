import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Shield } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBorder, setShowBorder] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
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
    } else {
      // If element not found (maybe lazy loaded), try again after a short delay
      setTimeout(() => {
        const retryElement = document.getElementById(sectionId);
        if (retryElement) {
          retryElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
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

  const handleSignOut = async () => {
    await signOut();
  };

  const isAuthPage = location.pathname === '/auth';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      showBorder ? 'bg-cyber border-b border-cesium/20 backdrop-blur-sm' : 'bg-cyber/80 backdrop-blur-sm'
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
              to="/founders"
              className="text-white hover:text-cesium transition-colors"
            >
              Founders
            </Link>
            <Link 
              to="/cyber-dashboard"
              className="text-white hover:text-cesium transition-colors"
            >
              Security Hub
            </Link>
            <Link 
              to="/hidden-code-detector"
              className="text-white hover:text-cesium transition-colors"
            >
              Text Cleaner
            </Link>
            <Link 
              to="/security-scanner"
              className="text-white hover:text-cesium transition-colors flex items-center gap-1"
            >
              <Shield className="h-4 w-4" />
              Security Scanner
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                  {isAdmin && <Shield className="h-4 w-4 text-cesium" />}
                </div>
                <Button 
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="border-white text-white hover:bg-white hover:text-black"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : !isAuthPage ? (
              <div className="flex items-center gap-2">
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-black">
                    Sign In
                  </Button>
                </Link>
                <button 
                  onClick={handleContactClick}
                  className="bg-cesium text-black px-4 py-2 rounded-md hover:bg-cesium/80 transition-colors font-medium"
                >
                  Contact Us
                </button>
              </div>
            ) : (
              <button 
                onClick={handleContactClick}
                className="bg-cesium text-black px-4 py-2 rounded-md hover:bg-cesium/80 transition-colors font-medium"
              >
                Contact Us
              </button>
            )}
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
                to="/founders"
                className="block px-3 py-2 text-white hover:text-cesium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Founders
              </Link>
              <Link 
                to="/cyber-dashboard"
                className="block px-3 py-2 text-white hover:text-cesium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Security Hub
              </Link>
              <Link 
                to="/hidden-code-detector"
                className="block px-3 py-2 text-white hover:text-cesium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Text Cleaner
              </Link>
              <Link 
                to="/security-scanner"
                className="block px-3 py-2 text-white hover:text-cesium transition-colors flex items-center gap-1"
                onClick={() => setIsOpen(false)}
              >
                <Shield className="h-4 w-4" />
                Security Scanner
              </Link>
              
              {user ? (
                <div className="px-3 py-2 border-t border-cesium/20 mt-2">
                  <div className="flex items-center gap-2 text-white mb-3">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{user.email}</span>
                    {isAdmin && <Shield className="h-4 w-4 text-cesium" />}
                  </div>
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 bg-white/10 text-white rounded-md hover:bg-white/20 transition-colors font-medium flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : !isAuthPage ? (
                <div className="px-3 py-2 border-t border-cesium/20 mt-2 space-y-2">
                  <Link 
                    to="/auth"
                    className="block w-full text-center px-3 py-2 bg-white/10 text-white rounded-md hover:bg-white/20 transition-colors font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <button 
                    onClick={() => {
                      handleContactClick();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 bg-cesium text-black rounded-md hover:bg-cesium/80 transition-colors font-medium"
                  >
                    Contact Us
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    handleContactClick();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 bg-cesium text-black rounded-md hover:bg-cesium/80 transition-colors font-medium mx-3 mt-2"
                >
                  Contact Us
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
