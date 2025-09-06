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
        <title>Hidden Code Detector - Remove Hidden Characters from AI Text | CesiumCyber Security</title>
        <meta name="description" content="Free tool to detect and remove hidden codes, invisible characters, and embedded codes from OpenGPT and other AI-generated texts." />
        <meta name="keywords" content="hidden code detector, invisible characters, AI text cleaner, Unicode cleaner, text sanitizer, security tool" />
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