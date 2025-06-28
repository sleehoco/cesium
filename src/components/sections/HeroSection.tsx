import { ArrowRight, Shield, Lock, Server } from "lucide-react";
import { Link } from "react-router-dom";
import FadeInSection from "../utils/FadeInSection";
import AnimatedCounter from "../utils/AnimatedCounter";
import BackgroundAnimations from "../utils/BackgroundAnimations";

const HeroSection = () => {
  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToConsult = () => {
    const consultSection = document.getElementById('consult');
    if (consultSection) {
      consultSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-cyber-dark pt-28 pb-20 overflow-hidden">
      {/* New comprehensive background animations */}
      <BackgroundAnimations 
        includeParticles={true}
        includeGradients={true}
        includeInteractive={true}
        particleCount={60}
      />
      
      {/* Enhanced Background pattern with animation */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdjZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10 animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div>
            <FadeInSection>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Advanced <span className="text-cesium">Cybersecurity</span> for the Modern Enterprise
              </h1>
            </FadeInSection>
            
            <FadeInSection delay={200}>
              <p className="text-xl text-gray-300 mb-8">
                Protect your business with cutting-edge security solutions tailored to defend against today's evolving threats.
              </p>
            </FadeInSection>
            
            <FadeInSection delay={400}>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={scrollToConsult}
                  className="bg-cesium hover:bg-cesium-dark text-cyber-dark font-medium px-6 py-3 rounded-md transition-all duration-300 flex items-center justify-center hover:scale-105 hover:shadow-lg hover:shadow-cesium/25"
                >
                  Get a Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <button
                  onClick={scrollToServices}
                  className="border border-cesium/50 text-cesium hover:bg-cesium/10 font-medium px-6 py-3 rounded-md transition-all duration-300 flex items-center justify-center hover:scale-105 hover:border-cesium"
                >
                  Explore Our Services
                </button>
              </div>
            </FadeInSection>
            
            {/* Stats */}
            <FadeInSection delay={600}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-12">
                <div className="bg-cyber border border-cesium/20 rounded-lg p-4 backdrop-blur-sm bg-black/30 hover:border-cesium/40 transition-all duration-300 hover:scale-105">
                  <p className="text-cesium text-2xl font-bold">
                    <AnimatedCounter end={100} suffix="+" />
                  </p>
                  <p className="text-gray-400 text-sm">Clients Protected</p>
                </div>
                <div className="bg-cyber border border-cesium/20 rounded-lg p-4 backdrop-blur-sm bg-black/30 hover:border-cesium/40 transition-all duration-300 hover:scale-105">
                  <p className="text-cesium text-2xl font-bold">
                    <AnimatedCounter end={1000} suffix="+" />
                  </p>
                  <p className="text-gray-400 text-sm">Threats Mitigated</p>
                </div>
                <div className="bg-cyber border border-cesium/20 rounded-lg p-4 backdrop-blur-sm bg-black/30 hover:border-cesium/40 transition-all duration-300 hover:scale-105">
                  <p className="text-cesium text-2xl font-bold">
                    <AnimatedCounter end={99.9} suffix="%" />
                  </p>
                  <p className="text-gray-400 text-sm">Success Rate</p>
                </div>
              </div>
            </FadeInSection>
          </div>
          
          {/* Hero Image/Graphics with enhanced effects */}
          <FadeInSection delay={300} direction="left">
            <div className="flex justify-center relative">
              <div className="relative w-full max-w-lg">
                {/* Core graphic with enhanced animations */}
                <div className="relative">
                  <div className="bg-cyber rounded-2xl border border-cesium/30 shadow-xl p-8 relative z-10 backdrop-blur-sm bg-black/30 hover:border-cesium/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cesium/20">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-cyber-dark rounded-lg flex flex-col items-center justify-center border border-cesium/10 hover:border-cesium/30 transition-all duration-300 hover:scale-105 group">
                        <Shield className="h-10 w-10 text-cesium mb-2 group-hover:animate-pulse" />
                        <h3 className="text-white text-center">Threat Protection</h3>
                      </div>
                      <div className="p-4 bg-cyber-dark rounded-lg flex flex-col items-center justify-center border border-cesium/10 hover:border-cesium/30 transition-all duration-300 hover:scale-105 group">
                        <Lock className="h-10 w-10 text-cesium mb-2 group-hover:animate-pulse" />
                        <h3 className="text-white text-center">Data Security</h3>
                      </div>
                      <div className="p-4 bg-cyber-dark rounded-lg flex flex-col items-center justify-center border border-cesium/10 hover:border-cesium/30 transition-all duration-300 hover:scale-105 group">
                        <Server className="h-10 w-10 text-cesium mb-2 group-hover:animate-pulse" />
                        <h3 className="text-white text-center">Infrastructure</h3>
                      </div>
                      <div className="p-4 bg-cyber-dark rounded-lg flex flex-col items-center justify-center border border-cesium/10 hover:border-cesium/30 transition-all duration-300 hover:scale-105 group">
                        <div className="h-10 w-10 bg-cesium/20 rounded-full flex items-center justify-center mb-2">
                          <div className="h-4 w-4 bg-cesium rounded-full animate-ping"></div>
                        </div>
                        <h3 className="text-white text-center">24/7 Monitoring</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
