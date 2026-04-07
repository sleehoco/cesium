import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HiddenCodeDetector from '@/components/hidden-code/HiddenCodeDetector';
import BackgroundAnimations from '@/components/utils/BackgroundAnimations';

const HiddenCodeDetectorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Hidden Code & Source Map Detector | CesiumCyber Security</title>
        <meta name="description" content="Free tool to remove hidden characters from AI text and check websites for source map and debug artifact exposure." />
        <meta name="keywords" content="hidden code detector, source map leak checker, invisible characters, AI text cleaner, Unicode cleaner, debug artifact scanner, security tool" />
      </Helmet>
      
      <BackgroundAnimations />
      <Navbar />
      
      <main className="relative z-10 pt-20">
        <HiddenCodeDetector />
      </main>
      
      <Footer />
    </div>
  );
};

export default HiddenCodeDetectorPage;
