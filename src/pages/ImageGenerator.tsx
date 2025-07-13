import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ImageGenerator from '@/components/ImageGenerator';

const ImageGeneratorPage = () => {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <ImageGenerator />
      </div>
      
      <Footer />
    </div>
  );
};

export default ImageGeneratorPage;