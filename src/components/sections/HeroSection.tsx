
import { ArrowRight, Shield, Lock, Server } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative bg-cyber-dark pt-28 pb-20 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdjZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Advanced <span className="text-cesium">Cybersecurity</span> for the Modern Enterprise
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Protect your business with cutting-edge security solutions tailored to defend against today's evolving threats.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/#consult"
                className="bg-cesium hover:bg-cesium-dark text-cyber-dark font-medium px-6 py-3 rounded-md transition-colors flex items-center justify-center"
              >
                Get a Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/#services"
                className="border border-cesium/50 text-cesium hover:bg-cesium/10 font-medium px-6 py-3 rounded-md transition-colors flex items-center justify-center"
              >
                Explore Our Services
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-12">
              <div className="bg-cyber border border-cesium/20 rounded-lg p-4">
                <p className="text-cesium text-2xl font-bold">100+</p>
                <p className="text-gray-400 text-sm">Clients Protected</p>
              </div>
              <div className="bg-cyber border border-cesium/20 rounded-lg p-4">
                <p className="text-cesium text-2xl font-bold">1000+</p>
                <p className="text-gray-400 text-sm">Threats Mitigated</p>
              </div>
              <div className="bg-cyber border border-cesium/20 rounded-lg p-4">
                <p className="text-cesium text-2xl font-bold">99.9%</p>
                <p className="text-gray-400 text-sm">Success Rate</p>
              </div>
            </div>
          </div>
          
          {/* Hero Image/Graphics */}
          <div className="flex justify-center relative">
            <div className="relative w-full max-w-lg">
              {/* Glowing effect */}
              <div className="absolute top-0 -left-4 w-72 h-72 bg-cesium/30 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob"></div>
              <div className="absolute -bottom-8 right-20 w-72 h-72 bg-cesium/20 rounded-full mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
              
              {/* Core graphic */}
              <div className="relative">
                <div className="bg-cyber rounded-2xl border border-cesium/30 shadow-xl p-8 relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-cyber-dark rounded-lg flex flex-col items-center justify-center">
                      <Shield className="h-10 w-10 text-cesium mb-2" />
                      <h3 className="text-white text-center">Threat Protection</h3>
                    </div>
                    <div className="p-4 bg-cyber-dark rounded-lg flex flex-col items-center justify-center">
                      <Lock className="h-10 w-10 text-cesium mb-2" />
                      <h3 className="text-white text-center">Data Security</h3>
                    </div>
                    <div className="p-4 bg-cyber-dark rounded-lg flex flex-col items-center justify-center">
                      <Server className="h-10 w-10 text-cesium mb-2" />
                      <h3 className="text-white text-center">Infrastructure</h3>
                    </div>
                    <div className="p-4 bg-cyber-dark rounded-lg flex flex-col items-center justify-center">
                      <div className="h-10 w-10 border-2 border-cesium rounded-full flex items-center justify-center mb-2">
                        <span className="text-cesium font-bold">24/7</span>
                      </div>
                      <h3 className="text-white text-center">Monitoring</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
