
import { ArrowRight, Shield, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToConsult = () => {
    const consultSection = document.getElementById('contact');
    if (consultSection) {
      consultSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-white pt-20 pb-32 overflow-hidden">
      {/* Clean background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium mb-6">
              <Shield className="h-4 w-4 mr-2" />
              Trusted Cybersecurity Partner
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Secure Your Digital
              <span className="text-blue-600 block">Future Today</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Comprehensive cybersecurity solutions designed to protect your business from evolving threats. 
              Expert guidance, advanced security, and peace of mind.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              <button
                onClick={scrollToConsult}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors flex items-center justify-center shadow-lg"
              >
                Get Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={scrollToServices}
                className="border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 font-semibold px-8 py-4 rounded-lg transition-colors flex items-center justify-center"
              >
                View Our Services
              </button>
            </div>
            
            {/* Trust indicators */}
            <div className="space-y-3">
              {[
                "100+ Businesses Protected",
                "24/7 Security Monitoring",
                "Expert Threat Response Team"
              ].map((item, index) => (
                <div key={index} className="flex items-center text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Hero Visual */}
          <div className="flex justify-center relative animate-slide-up">
            <div className="relative w-full max-w-lg">
              {/* Main card */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise Security</h3>
                  <p className="text-gray-600">Advanced protection for your business</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-800">Threat Detection</span>
                    <span className="text-xs text-green-600 font-semibold">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-800">Network Security</span>
                    <span className="text-xs text-blue-600 font-semibold">PROTECTED</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-purple-800">Data Encryption</span>
                    <span className="text-xs text-purple-600 font-semibold">SECURED</span>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-600 rounded-lg opacity-10 rotate-12"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-green-500 rounded-full opacity-10"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
