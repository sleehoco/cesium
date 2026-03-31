import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, Shield } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const homeSections = ['top', 'services', 'about', 'approach', 'faq', 'contact'];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/' && homeSections.includes(sectionId)) {
      window.location.href = `/#${sectionId}`;
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      setTimeout(() => {
        const retryElement = document.getElementById(sectionId);
        if (retryElement) retryElement.scrollIntoView({ behavior: 'smooth' });
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]">
      {/* Classification Banner */}
      <div className="border-b border-[#D4AF37]/20 py-1.5 px-4 text-center bg-[#0A0A0A]">
        <span className="font-tech text-[#D4AF37] text-[10px] tracking-[0.18em] uppercase select-none">
          CesiumCyber Security | Columbia, MD
        </span>
      </div>

      {/* Main Navigation */}
      <div className={`transition-colors duration-300 ${scrolled ? 'border-b border-[#D4AF37]/15' : 'border-b border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/lovable-uploads/b24b90f5-8a07-4589-821e-d614e2703fa9.png"
                alt="CesiumCyber Logo"
                className="h-6 w-6"
              />
              <span className="font-display text-[#D4AF37] font-bold text-lg tracking-[0.02em]">CesiumCyber</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-7">
              <Link to="/" className="font-ui text-[15px] text-white/78 hover:text-white transition-colors duration-150">
                Home
              </Link>
              <button
                onClick={handleServicesClick}
                className="font-ui text-[15px] text-white/78 hover:text-white transition-colors duration-150"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="font-ui text-[15px] text-white/78 hover:text-white transition-colors duration-150"
              >
                About
              </button>
              <Link to="/founders" className="font-ui text-[15px] text-white/78 hover:text-white transition-colors duration-150">
                Team
              </Link>
              <Link to="/blog" className="font-ui text-[15px] text-white/78 hover:text-white transition-colors duration-150">
                Blog
              </Link>
              <Link to="/shannon-plus-plus" className="font-ui text-[15px] text-white/78 hover:text-white transition-colors duration-150">
                Shannon++
              </Link>

              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-white/45 text-[12px]">
                    <User className="h-3 w-3" />
                    <span>{user.email}</span>
                    {isAdmin && <Shield className="h-3 w-3 text-[#D4AF37]" />}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="font-ui text-[14px] text-white/60 hover:text-red-400 transition-colors flex items-center gap-1"
                  >
                    <LogOut className="h-3 w-3" />
                    Sign out
                  </button>
                </div>
              ) : !isAuthPage ? (
                <div className="flex items-center gap-3">
                  <Link to="/auth" className="font-ui text-[15px] text-white/78 hover:text-white transition-colors duration-150">
                    Sign in
                  </Link>
                  <button
                    onClick={handleContactClick}
                    className="font-ui border border-[#D4AF37] text-[#D4AF37] px-4 py-2 text-[14px] hover:bg-[#D4AF37] hover:text-black transition-colors duration-200"
                  >
                    Contact
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleContactClick}
                  className="font-ui border border-[#D4AF37] text-[#D4AF37] px-4 py-2 text-[14px] hover:bg-[#D4AF37] hover:text-black transition-colors duration-200"
                >
                  Contact
                </button>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden font-ui text-white/78 hover:text-[#D4AF37] transition-colors text-[14px]"
            >
              {isOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-[#D4AF37]/15 bg-[#0A0A0A]">
            <div className="px-4 py-5 space-y-4">
              <Link to="/" className="block font-ui text-[16px] text-white/82 hover:text-white" onClick={() => setIsOpen(false)}>Home</Link>
              <button onClick={() => { handleServicesClick(); setIsOpen(false); }} className="block font-ui text-[16px] text-white/82 hover:text-white">Services</button>
              <button onClick={() => { scrollToSection('about'); setIsOpen(false); }} className="block font-ui text-[16px] text-white/82 hover:text-white">About</button>
              <Link to="/founders" className="block font-ui text-[16px] text-white/82 hover:text-white" onClick={() => setIsOpen(false)}>Team</Link>
              <Link to="/blog" className="block font-ui text-[16px] text-white/82 hover:text-white" onClick={() => setIsOpen(false)}>Blog</Link>
              <Link to="/shannon-plus-plus" className="block font-ui text-[16px] text-white/82 hover:text-white" onClick={() => setIsOpen(false)}>Shannon++</Link>

              {user ? (
                <div className="border-t border-[#D4AF37]/15 pt-3 mt-3 space-y-2">
                  <div className="flex items-center gap-1.5 text-white/40">
                    <User className="h-3 w-3" />
                    <span className="text-[12px]">{user.email}</span>
                    {isAdmin && <Shield className="h-3 w-3 text-[#D4AF37]" />}
                  </div>
                  <button
                    onClick={() => { handleSignOut(); setIsOpen(false); }}
                    className="flex items-center gap-1 font-ui text-[15px] text-red-400"
                  >
                    <LogOut className="h-3 w-3" />
                    Sign out
                  </button>
                </div>
              ) : !isAuthPage ? (
                <div className="border-t border-[#D4AF37]/15 pt-3 mt-3 space-y-2">
                  <Link to="/auth" className="block font-ui text-[16px] text-white/82 hover:text-white" onClick={() => setIsOpen(false)}>Sign in</Link>
                  <button
                    onClick={() => { handleContactClick(); setIsOpen(false); }}
                    className="font-ui border border-[#D4AF37] text-[#D4AF37] px-4 py-2 text-[15px] hover:bg-[#D4AF37] hover:text-black transition-colors"
                  >
                    Contact
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { handleContactClick(); setIsOpen(false); }}
                  className="font-ui border border-[#D4AF37] text-[#D4AF37] px-4 py-2 text-[15px] hover:bg-[#D4AF37] hover:text-black transition-colors"
                >
                  Contact
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
