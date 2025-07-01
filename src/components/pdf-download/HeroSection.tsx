
import React from 'react';
import { Brain, TrendingUp, Cpu, Zap } from 'lucide-react';

const HeroSection = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="mb-8">
          <div className="flex justify-center items-center mb-6 space-x-4">
            <Brain className="h-16 w-16 text-blue-600" />
            <Zap className="h-12 w-12 text-purple-600" />
            <Cpu className="h-16 w-16 text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Meets Quantum Computing: A Business Review
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get our comprehensive research paper analyzing the convergence of Artificial Intelligence and Quantum Computing technologies and their transformative impact on modern business.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Innovation</h3>
            <p className="text-gray-600 text-sm">Explore cutting-edge AI technologies and their quantum-enhanced capabilities for business transformation.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <Cpu className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quantum Computing</h3>
            <p className="text-gray-600 text-sm">Understand how quantum computing revolutionizes AI processing and computational possibilities.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <TrendingUp className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Impact</h3>
            <p className="text-gray-600 text-sm">Discover strategic insights on implementing AI-Quantum solutions for competitive advantage.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
