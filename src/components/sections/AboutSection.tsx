
import { CheckCircle, UserCheck, Award, Clock, BarChart } from "lucide-react";
import ScrollAnimation from "../utils/ScrollAnimation";

const AboutSection = () => {
  return (
    <div id="about" className="bg-cyber-dark py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* About Image */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              {/* Main image with border effect */}
              <div className="rounded-lg overflow-hidden border-2 border-cesium/30 shadow-xl shadow-cesium/10">
                <div className="aspect-w-16 aspect-h-9 bg-cyber relative overflow-hidden">
                  {/* Abstract cyber security image representation */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyber-dark via-cyber to-cesium/20 opacity-90"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full max-w-md">
                      <div className="grid grid-cols-3 gap-4">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <div 
                            key={i}
                            className={`h-16 rounded border ${i % 3 === 0 ? 'border-cesium/40' : 'border-gray-700'} 
                                      ${i % 4 === 0 ? 'bg-cesium/10' : 'bg-cyber-light/20'}`}
                          ></div>
                        ))}
                      </div>
                      
                      {/* Animated blinking dots */}
                      <div className="mt-6 flex justify-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-cesium animate-pulse"></div>
                        <div className="h-2 w-2 rounded-full bg-cesium animate-pulse delay-150"></div>
                        <div className="h-2 w-2 rounded-full bg-cesium animate-pulse delay-300"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Stats card that overlaps the main image */}
              <div className="absolute -bottom-8 -right-8 bg-cyber border border-cesium/30 rounded-lg p-4 shadow-lg w-48">
                <div className="flex items-center mb-2">
                  <BarChart className="h-5 w-5 text-cesium mr-2" />
                  <span className="text-white font-medium">Success Rate</span>
                </div>
                <div className="w-full bg-cyber-dark rounded-full h-2.5 mb-1">
                  <div className="bg-cesium h-2.5 rounded-full w-[98%]"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>98% Efficacy</span>
                  <span>350+ Projects</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* About Content */}
          <div className="order-1 lg:order-2">
            <ScrollAnimation>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                About <span className="text-cesium">CesiumCyber</span> Security
              </h2>
              
              <p className="text-gray-300 mb-6">
                CesiumCyber Security is a leading provider of advanced cybersecurity solutions for businesses of all sizes. With our team of certified security experts, we deliver comprehensive protection against the most sophisticated cyber threats.
              </p>
              
              <p className="text-gray-300 mb-8">
                Founded by industry veterans with decades of experience in information security, we combine cutting-edge technology with strategic expertise to safeguard your most valuable digital assets.
              </p>
              
              <div className="space-y-4">
                <ScrollAnimation className="delay-100">
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-cesium mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-white font-medium">Certified Expertise</h3>
                      <p className="text-gray-400">Our team holds industry-leading certifications including CISSP, CEH, and OSCP.</p>
                    </div>
                  </div>
                </ScrollAnimation>
                
                <ScrollAnimation className="delay-200">
                  <div className="flex items-start">
                    <UserCheck className="h-6 w-6 text-cesium mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-white font-medium">Client-Focused Approach</h3>
                      <p className="text-gray-400">We tailor our solutions to meet your specific business needs and security requirements.</p>
                    </div>
                  </div>
                </ScrollAnimation>
                
                <ScrollAnimation className="delay-300">
                  <div className="flex items-start">
                    <Award className="h-6 w-6 text-cesium mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-white font-medium">Industry Recognition</h3>
                      <p className="text-gray-400">Recognized for excellence in cybersecurity services and innovation.</p>
                    </div>
                  </div>
                </ScrollAnimation>
                
                <ScrollAnimation className="delay-400">
                  <div className="flex items-start">
                    <Clock className="h-6 w-6 text-cesium mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-white font-medium">24/7 Support</h3>
                      <p className="text-gray-400">Round-the-clock monitoring and support to address security concerns at any time.</p>
                    </div>
                  </div>
                </ScrollAnimation>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
