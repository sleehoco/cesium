
import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import MetaTags from "../components/utils/MetaTags";
import ScrollAnimation from "../components/utils/ScrollAnimation";
import FingerprintCollector from "../components/fingerprinting/FingerprintCollector";
import FingerprintDisplay from "../components/fingerprinting/FingerprintDisplay";
import PrivacyProtectionTips from "../components/fingerprinting/PrivacyProtectionTips";
import { Fingerprint, Shield, Eye, AlertTriangle } from "lucide-react";

export interface FingerprintData {
  userAgent: string;
  screen: {
    width: number;
    height: number;
    colorDepth: number;
    pixelDepth: number;
    availWidth?: number;
    availHeight?: number;
    pixelRatio?: number;
  };
  timezone: string;
  language: string;
  languages: string[];
  platform: string;
  cookieEnabled: boolean;
  doNotTrack: string | null;
  canvas: string;
  webgl: string;
  fonts: string[];
  plugins: any[];
  touchSupport: boolean;
  hardwareConcurrency: number;
  deviceMemory: number | undefined;
  connection: any;
  battery: any;
  permissions: Record<string, string>;
  additionalInfo?: Record<string, boolean>;
}

const BrowserFingerprintingDemo = () => {
  const [fingerprintData, setFingerprintData] = useState<FingerprintData | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [collectionComplete, setCollectionComplete] = useState(false);

  const handleDataCollection = (data: FingerprintData) => {
    setFingerprintData(data);
    setCollectionComplete(true);
    setIsCollecting(false);
  };

  const startCollection = () => {
    setIsCollecting(true);
    setCollectionComplete(false);
    setFingerprintData(null);
  };

  return (
    <div className="bg-cyber min-h-screen">
      <MetaTags 
        title="Browser Fingerprinting Demo - CesiumCyber Security"
        description="Interactive demonstration showing how browsers can be tracked and fingerprinted. Learn about digital privacy and protection techniques."
        keywords="browser fingerprinting, digital privacy, tracking prevention, cybersecurity demo, online privacy"
        url="https://cesiumcyber.com/browser-fingerprinting-demo"
        canonical="https://cesiumcyber.com/browser-fingerprinting-demo"
      />

      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-cyber py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-pink-400/10 w-20 h-20 rounded-lg flex items-center justify-center">
                  <Fingerprint className="h-10 w-10 text-pink-400" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Browser <span className="text-pink-400">Fingerprinting</span> Demo
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Discover exactly what information your browser reveals about you. This real-time demo collects 
                actual data from your device to show tracking techniques used across the web.
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-2 text-pink-400" />
                  Real Browser Data
                </div>
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-orange-400" />
                  Privacy Analysis
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-green-400" />
                  Protection Guide
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="bg-cyber-dark py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Collection Controls */}
              <div className="lg:col-span-1">
                <ScrollAnimation>
                  <FingerprintCollector 
                    onDataCollected={handleDataCollection}
                    isCollecting={isCollecting}
                    onStartCollection={startCollection}
                  />
                </ScrollAnimation>
              </div>

              {/* Results Display */}
              <div className="lg:col-span-2">
                <ScrollAnimation className="delay-200">
                  <FingerprintDisplay 
                    data={fingerprintData}
                    isCollecting={isCollecting}
                    collectionComplete={collectionComplete}
                  />
                </ScrollAnimation>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Protection Tips */}
        <section className="bg-cyber py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollAnimation>
              <PrivacyProtectionTips />
            </ScrollAnimation>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-cyber-dark py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Concerned About Your Digital Privacy?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Our cybersecurity experts can help you implement comprehensive privacy protection strategies.
            </p>
            <button className="bg-pink-400 hover:bg-pink-500 text-white font-semibold px-8 py-4 rounded-lg transition-colors">
              Get Privacy Consultation
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BrowserFingerprintingDemo;
