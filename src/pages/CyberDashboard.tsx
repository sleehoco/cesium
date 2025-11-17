import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import NetworkAnimation from '@/components/utils/NetworkAnimation';
import { LiveThreatMap } from '@/components/cyber-dashboard/LiveThreatMap';
import { RealTimeScanPanel } from '@/components/cyber-dashboard/RealTimeScanPanel';
import { SecurityMetrics } from '@/components/cyber-dashboard/SecurityMetrics';
import FingerprintAnalysis from '@/components/fingerprinting/FingerprintAnalysis';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Scan, History } from 'lucide-react';

const CyberDashboard = () => {
  const [scanComplete, setScanComplete] = useState(false);

  const handleScanComplete = () => {
    setScanComplete(true);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <NetworkAnimation />
      <Navbar />
      
      <div className="relative z-10 pt-20 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Advanced Threat Detection</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Real-Time <span className="text-primary">Cyber Security</span> Platform
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              AI-powered threat detection and browser fingerprinting to protect your digital presence
            </p>
          </motion.div>

          {/* Security Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <SecurityMetrics />
          </motion.div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="scan" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="scan" className="flex items-center gap-2">
                <Scan className="h-4 w-4" />
                <span className="hidden sm:inline">Scan</span>
              </TabsTrigger>
              <TabsTrigger value="threats" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Threats</span>
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">Analysis</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scan" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RealTimeScanPanel onScanComplete={handleScanComplete} />
                
                {scanComplete && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    <FingerprintAnalysis />
                  </motion.div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="threats">
              <div className="space-y-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Live Threat Monitor</h2>
                  <p className="text-muted-foreground">Real-time security metrics and threat detection</p>
                </div>
                <LiveThreatMap />
              </div>
            </TabsContent>

            <TabsContent value="analysis">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">Security Analysis History</h2>
                <p className="text-muted-foreground mb-8">View detailed reports of past security scans</p>
                <Button variant="outline">View Full History</Button>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Shield,
                title: 'Advanced Protection',
                description: 'AI-powered threat detection and real-time monitoring'
              },
              {
                icon: Scan,
                title: 'Deep Analysis',
                description: 'Comprehensive browser and device fingerprinting'
              },
              {
                icon: History,
                title: 'Historical Data',
                description: 'Track security metrics and threat patterns over time'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg p-6 text-center hover:border-primary/40 transition-colors"
              >
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default CyberDashboard;
