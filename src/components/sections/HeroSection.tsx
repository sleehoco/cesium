import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, CheckCircle, ArrowRight, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import BackgroundAnimations from '@/components/utils/BackgroundAnimations';
import CEOPopupTrigger from '@/components/ceo/CEOPopupTrigger';

const HeroSection = () => {
  const [featureList] = useState([
    {
      icon: Shield,
      title: 'Advanced Threat Protection',
      description: 'Protect your business from advanced threats with our AI-powered security solutions.'
    },
    {
      icon: Lock,
      title: 'Data Loss Prevention',
      description: 'Prevent data breaches and ensure compliance with our comprehensive data loss prevention strategies.'
    },
    {
      icon: Eye,
      title: 'Real-Time Monitoring',
      description: 'Gain real-time visibility into your network and systems with our 24/7 monitoring services.'
    },
    {
      icon: CheckCircle,
      title: 'Compliance Management',
      description: 'Stay compliant with industry regulations and standards with our expert compliance management services.'
    }
  ]);

  const [stats] = useState([
    { label: 'Clients Worldwide', value: '500+' },
    { label: 'Threats Detected Daily', value: '10,000+' },
    { label: 'Years of Experience', value: '15+' },
    { label: 'Security Experts', value: '50+' }
  ]);

  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-background/95 pt-20">
      <BackgroundAnimations />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Secure Your Digital
              <span className="block bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                Infrastructure
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Advanced cybersecurity solutions powered by AI and machine learning. 
              Protect your business with enterprise-grade security that adapts and evolves.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <Button 
                size="lg" 
                className="px-8 py-3 text-lg group"
                onClick={() => navigate('/contact')}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-3 text-lg"
                onClick={() => navigate('/services')}
              >
                View Services
              </Button>

              <CEOPopupTrigger 
                variant="button"
                className="px-6 py-3"
              >
                Meet Our CEO
              </CEOPopupTrigger>
            </motion.div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            {featureList.map((feature, index) => (
              <div key={index} className="p-6 bg-card rounded-lg shadow-md hover-lift">
                <feature.icon className="h-6 w-6 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="p-4">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground uppercase">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
