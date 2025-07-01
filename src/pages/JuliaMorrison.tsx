import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import MetaTags from '../components/utils/MetaTags';
import ImageOptimizer from '../components/utils/ImageOptimizer';
import { Shield, Users, Award, Briefcase } from 'lucide-react';

const JuliaMorrison = () => {
  return (
    <div className="bg-cyber min-h-screen">
      <MetaTags 
        title="Julia Morrison - Co-Founder & CEO | CesiumCyber Security"
        description="Meet Julia Morrison, Co-Founder and CEO of CesiumCyber Security. Expert in vulnerability management, threat intelligence, zero trust, and compliance."
        keywords="Julia Morrison, CesiumCyber, CEO, co-founder, cybersecurity expert, vulnerability management, threat intelligence, zero trust, compliance"
        url="https://cesiumcyber.com/julia-morrison"
        canonical="https://cesiumcyber.com/julia-morrison"
      />
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-cyber via-cyber-dark to-cyber">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  Julia Morrison
                </h1>
                <p className="text-xl md:text-2xl text-cesium mb-6">
                  Co-Founder & CEO
                </p>
                <p className="text-lg text-white/90 mb-8 leading-relaxed">
                  Leading CesiumCyber Security with extensive expertise in vulnerability management, 
                  threat intelligence, zero trust architecture, and compliance frameworks. 
                  Dedicated to protecting organizations from evolving cyber threats.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center text-cesium">
                    <Shield className="w-5 h-5 mr-2" />
                    <span>Cybersecurity Expert</span>
                  </div>
                  <div className="flex items-center text-cesium">
                    <Users className="w-5 h-5 mr-2" />
                    <span>Industry Leader</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-cesium/20 rounded-2xl blur-xl"></div>
                  <ImageOptimizer
                    src="/lovable-uploads/b24b90f5-8a07-4589-821e-d614e2703fa9.png"
                    alt="Julia Morrison - Co-Founder & CEO of CesiumCyber Security"
                    className="relative rounded-2xl w-80 h-80 object-cover border-2 border-cesium/30"
                    priority={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Expertise Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Areas of Expertise
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                With years of experience in cybersecurity, Julia brings deep knowledge 
                across critical security domains.
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

        {/* Leadership Section */}
        <section className="py-20 bg-cyber-light/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                Leadership at CesiumCyber
              </h2>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                As Co-Founder and CEO of CesiumCyber Security, Julia leads our mission to provide 
                comprehensive cybersecurity solutions that protect businesses from evolving threats. 
                Her vision drives our commitment to excellence in penetration testing, vulnerability 
                assessments, and security consulting services.
              </p>
              <p className="text-lg text-white/90 leading-relaxed">
                Under her leadership, CesiumCyber has established itself as a trusted partner for 
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

export default JuliaMorrison;