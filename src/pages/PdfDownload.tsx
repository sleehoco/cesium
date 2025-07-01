
import React, { useState } from 'react';
import MetaTags from '../components/utils/MetaTags';
import PdfDownloadHeader from '../components/pdf-download/PdfDownloadHeader';
import HeroSection from '../components/pdf-download/HeroSection';
import PdfDownloadForm from '../components/pdf-download/PdfDownloadForm';
import ThankYouMessage from '../components/pdf-download/ThankYouMessage';
import PdfDownloadFooter from '../components/pdf-download/PdfDownloadFooter';

const PdfDownload = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitSuccess = () => {
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <MetaTags 
          title="Thank You - AI Meets Quantum Computing Research Paper Downloaded"
          description="Thank you for downloading our comprehensive AI meets Quantum Computing business review research paper."
        />
        <ThankYouMessage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <MetaTags 
        title="AI Meets Quantum Computing - Business Review Research Paper"
        description="Download our comprehensive research paper on AI meets Quantum Computing business applications and implications."
        keywords="AI, quantum computing, artificial intelligence, research paper, business review, technology convergence"
      />
      
      <PdfDownloadHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HeroSection />
        <PdfDownloadForm onSubmitSuccess={handleSubmitSuccess} />
      </main>

      <PdfDownloadFooter />
    </div>
  );
};

export default PdfDownload;
