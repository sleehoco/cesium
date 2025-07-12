import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MultiAgentBlogGenerator from '@/components/blog/MultiAgentBlogGenerator';
import AdminRoute from '@/components/auth/AdminRoute';
import BackgroundAnimations from '@/components/utils/BackgroundAnimations';

const BlogGenerator = () => {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>AI Blog Generator - CesiumCyber Security</title>
          <meta name="description" content="Generate high-quality cybersecurity blog posts using our multi-agent AI system powered by OpenRouter." />
          <meta name="keywords" content="AI blog generator, multi-agent AI, cybersecurity content, automated blogging, OpenRouter" />
        </Helmet>
        
        <BackgroundAnimations />
        <Navbar />
        
        <main className="relative z-10 pt-20">
          <MultiAgentBlogGenerator />
        </main>
        
        <Footer />
      </div>
    </AdminRoute>
  );
};

export default BlogGenerator;