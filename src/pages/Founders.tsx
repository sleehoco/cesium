import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import MetaTags from '../components/utils/MetaTags';
import ImageOptimizer from '../components/utils/ImageOptimizer';
import { Shield, Users, Award, Briefcase, UserRound } from 'lucide-react';

const Founders = () => {
  return (
    <div className="bg-cyber min-h-screen">
      <MetaTags 
        title="Our Founders | CesiumCyber Security Leadership Team"
        description="Meet the founding team of CesiumCyber Security. Expert leadership in cybersecurity, vulnerability management, threat intelligence, and compliance."
        keywords="CesiumCyber founders, Julia Morrison, cybersecurity leadership, founders team, security experts"
        url="https://cesiumcyber.com/founders"
        canonical="https://cesiumcyber.com/founders"
      />
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-cyber via-cyber-dark to-cyber">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Our Founders
              </h1>
              <p className="text-xl md:text-2xl text-cesium mb-6">
                Leadership Team at CesiumCyber Security
              </p>
              <p className="text-lg text-white/90 max-w-4xl mx-auto leading-relaxed">
                Meet the visionary leaders who founded CesiumCyber Security with a mission to provide 
                comprehensive cybersecurity solutions and protect organizations from evolving threats.
              </p>
            </div>
            
            {/* Founders Grid */}
            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Julia Morrison */}
              <div className="bg-cyber-light/10 rounded-2xl p-8 border border-cesium/20">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-cesium/20 rounded-2xl blur-xl"></div>
                    <ImageOptimizer
                      src="/lovable-uploads/57ca5107-42ac-47dc-8986-6eae8ee54711.png?v=1"
                      alt="Julia Morrison - Co-Founder & CEO of CesiumCyber Security"
                      className="relative rounded-2xl w-48 h-48 object-cover border-2 border-cesium/30 mx-auto"
                      priority={true}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Julia Morrison
                  </h2>
                  <p className="text-cesium text-lg mb-4">
                    Co-Founder & CEO
                  </p>
                  <p className="text-white/90 leading-relaxed mb-6">
                    Leading CesiumCyber Security with extensive expertise in vulnerability management, 
                    threat intelligence, zero trust architecture, and compliance frameworks. 
                    Dedicated to protecting organizations from evolving cyber threats.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <div className="flex items-center text-cesium text-sm">
                      <Shield className="w-4 h-4 mr-2" />
                      <span>Cybersecurity Expert</span>
                    </div>
                    <div className="flex items-center text-cesium text-sm">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Industry Leader</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Co-Founder Placeholder */}
              <div className="bg-cyber-light/10 rounded-2xl p-8 border border-cesium/20">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-cesium/20 rounded-2xl blur-xl"></div>
                    <div className="relative rounded-2xl w-48 h-48 bg-cyber-light/20 border-2 border-cesium/30 mx-auto flex items-center justify-center">
                      <UserRound className="w-24 h-24 text-cesium/60" />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Co-Founder
                  </h2>
                  <p className="text-cesium text-lg mb-4">
                    Founding Partner
                  </p>
                  <p className="text-white/90 leading-relaxed mb-6">
                    Bringing complementary expertise and vision to CesiumCyber Security, 
                    working alongside Julia to build comprehensive cybersecurity solutions 
                    and drive the company's strategic growth.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <div className="flex items-center text-cesium text-sm">
                      <Briefcase className="w-4 h-4 mr-2" />
                      <span>Strategic Vision</span>
                    </div>
                    <div className="flex items-center text-cesium text-sm">
                      <Award className="w-4 h-4 mr-2" />
                      <span>Business Leadership</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Julia's Expertise Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Julia's Areas of Expertise
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                With years of experience in cybersecurity, Julia brings deep knowledge 
                across critical security domains to CesiumCyber.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-cyber-light/10 p-6 rounded-xl border border-cesium/20 hover:border-cesium/40 transition-colors">
                <Shield className="w-12 h-12 text-cesium mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  Vulnerability Management
                </h3>
                <p className="text-white/80">
                  Expert in identifying, assessing, and mitigating security vulnerabilities 
                  across complex enterprise environments.
                </p>
              </div>

              <div className="bg-cyber-light/10 p-6 rounded-xl border border-cesium/20 hover:border-cesium/40 transition-colors">
                <Award className="w-12 h-12 text-cesium mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  Threat Intelligence
                </h3>
                <p className="text-white/80">
                  Advanced threat analysis and intelligence gathering to stay ahead 
                  of emerging cyber threats and attack vectors.
                </p>
              </div>

              <div className="bg-cyber-light/10 p-6 rounded-xl border border-cesium/20 hover:border-cesium/40 transition-colors">
                <Users className="w-12 h-12 text-cesium mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  Zero Trust Architecture
                </h3>
                <p className="text-white/80">
                  Designing and implementing zero trust security models that verify 
                  every user and device before granting access.
                </p>
              </div>

              <div className="bg-cyber-light/10 p-6 rounded-xl border border-cesium/20 hover:border-cesium/40 transition-colors">
                <Briefcase className="w-12 h-12 text-cesium mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">
                  Compliance
                </h3>
                <p className="text-white/80">
                  Ensuring organizations meet regulatory requirements including 
                  GDPR, HIPAA, SOC 2, and industry-specific standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Founding Vision Section */}
        <section className="py-20 bg-cyber-light/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                Founding Vision
              </h2>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                Our founders established CesiumCyber Security with a shared vision to provide 
                comprehensive cybersecurity solutions that protect businesses from evolving threats. 
                Their combined expertise and commitment drives our mission to deliver excellence in 
                penetration testing, vulnerability assessments, and security consulting services.
              </p>
              <p className="text-lg text-white/90 leading-relaxed">
                Under their leadership, CesiumCyber has established itself as a trusted partner for 
                organizations seeking to strengthen their security posture and achieve compliance 
                with industry standards and regulations.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Founders;