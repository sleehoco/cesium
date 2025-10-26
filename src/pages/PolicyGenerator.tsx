import { Helmet } from 'react-helmet';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PolicyGeneratorForm from '@/components/policy/PolicyGeneratorForm';
import BackgroundAnimations from '@/components/utils/BackgroundAnimations';
import { Shield, FileText, CheckCircle } from 'lucide-react';

const PolicyGenerator = () => {
  console.log('PolicyGenerator component rendering');
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>AI Policy Generator - CesiumCyber Security</title>
        <meta name="description" content="Generate comprehensive cybersecurity policies instantly using AI. Tailored to your organization's needs." />
        <meta name="keywords" content="cybersecurity policy, AI policy generator, security policy template, compliance, NIST, ISO 27001" />
      </Helmet>
      
      <BackgroundAnimations />
      <Navbar />
      
      <main className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Shield className="w-12 h-12 text-primary mr-3" />
                <FileText className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                AI Policy Generator
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Generate comprehensive, professional cybersecurity policies tailored to your organization in minutes.
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-card p-6 rounded-lg border border-border">
                <CheckCircle className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Industry Standards</h3>
                <p className="text-sm text-muted-foreground">
                  Aligned with ISO 27001, NIST, and other frameworks
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <CheckCircle className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Customized Content</h3>
                <p className="text-sm text-muted-foreground">
                  Tailored to your industry and specific requirements
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <CheckCircle className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">Ready to Use</h3>
                <p className="text-sm text-muted-foreground">
                  Download as Word document, review, and implement
                </p>
              </div>
            </div>

            {/* Form */}
            <PolicyGeneratorForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PolicyGenerator;
