
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const homeSections = ['top', 'services', 'about', 'approach', 'faq', 'contact'];

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/' && homeSections.includes(sectionId)) {
      window.location.href = `/#${sectionId}`;
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleServicesClick = () => {
    if (location.pathname === '/') {
      scrollToSection('services');
    } else {
      window.location.href = '/services';
    }
  };

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#D4AF37]/10">

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Company */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-display text-[#D4AF37] font-bold text-2xl tracking-[0.01em]">CesiumCyber</span>
            </div>
            <p className="font-ui text-[16px] text-white/78 leading-7">
              Cybersecurity services for small businesses, including assessments,
              Microsoft 365 security, incident response, and ongoing protection.
            </p>
            <div className="mt-4 font-ui text-[15px] text-white/58">
              Columbia, MD | Est. 2009
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <div className="font-tech text-[10px] tracking-[0.16em] text-white/45 mb-5 border-b border-[#D4AF37]/10 pb-2">
              NAVIGATION
            </div>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', href: '/', type: 'link' },
                { label: 'Services', onClick: handleServicesClick, type: 'button' },
                { label: 'About', onClick: () => scrollToSection('about'), type: 'button' },
                { label: 'Our approach', onClick: () => scrollToSection('approach'), type: 'button' },
                { label: 'FAQ', onClick: () => scrollToSection('faq'), type: 'button' },
                { label: 'Contact', onClick: () => scrollToSection('contact'), type: 'button' },
                { label: 'Podcast', href: '/podcast', type: 'link' },
                { label: 'Meet the team', href: '/founders', type: 'link' },
                { label: 'Shannon++', href: '/shannon-plus-plus', type: 'link' },
              ].map((item) =>
                item.type === 'link' ? (
                  <li key={item.label}>
                    <Link to={item.href!} className="font-ui text-[16px] text-white/78 hover:text-[#D4AF37] transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ) : (
                  <li key={item.label}>
                    <button onClick={item.onClick} className="font-ui text-[16px] text-white/78 hover:text-[#D4AF37] transition-colors">
                      {item.label}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-1">
            <div className="font-tech text-[10px] tracking-[0.16em] text-white/45 mb-5 border-b border-[#D4AF37]/10 pb-2">
              CORE SERVICES
            </div>
            <ul className="space-y-2.5">
              {[
                { label: 'Managed cybersecurity', href: '/services' },
                { label: 'Microsoft 365 security', href: '/m365-security-assessment' },
                { label: 'Vulnerability assessment', href: '/services#vulnerability-assessment' },
                { label: 'Penetration testing', href: '/services#penetration-testing' },
                { label: 'Incident response', href: '/services#incident-response' },
                { label: 'Compliance assistance', href: '/services#compliance-assistance' },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="font-ui text-[16px] text-white/78 hover:text-[#D4AF37] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <div className="font-tech text-[10px] tracking-[0.16em] text-white/45 mb-5 border-b border-[#D4AF37]/10 pb-2">
              CONTACT
            </div>
            <ul className="space-y-4">
              <li>
                <span className="font-tech text-white/40 text-[10px] tracking-[0.12em] block mb-1">Location</span>
                <span className="font-ui text-[16px] text-white/82 leading-7">3500 Cedar Ave. Columbia, MD 21045</span>
              </li>
              <li>
                <span className="font-tech text-white/40 text-[10px] tracking-[0.12em] block mb-1">Service area</span>
                <span className="font-ui text-[16px] text-white/82 leading-7">Maryland and remote engagements nationwide</span>
              </li>
              <li>
                <span className="font-tech text-white/40 text-[10px] tracking-[0.12em] block mb-1">Phone</span>
                <span className="font-ui text-[16px] text-white/82 leading-7">(301) 531-5670</span>
              </li>
              <li>
                <span className="font-tech text-white/40 text-[10px] tracking-[0.12em] block mb-1">Email</span>
                <span className="font-ui text-[16px] text-white/82 leading-7">information@cesiumcyber.com</span>
              </li>
              <li>
                <span className="font-tech text-white/40 text-[10px] tracking-[0.12em] block mb-1">Instagram</span>
                <a
                  href="https://instagram.com/cesiumcyber"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-ui text-[16px] text-white/82 hover:text-[#D4AF37] transition-colors"
                >
                  @cesiumcyber
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Classification Footer Banner */}
      <div className="border-t border-[#D4AF37]/10 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-ui text-[14px] text-white/52 text-center md:text-left">
            CesiumCyber Security | Small business cybersecurity | Columbia, Maryland
          </p>
          <div className="flex items-center gap-4 font-ui text-[14px] text-white/52 flex-wrap justify-center">
            <span>© {currentYear} CesiumCyber Security</span>
            <span className="text-white/20">|</span>
            <button className="hover:text-[#D4AF37] transition-colors">Privacy policy</button>
            <span className="text-white/20">|</span>
            <button className="hover:text-[#D4AF37] transition-colors">Terms of service</button>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
