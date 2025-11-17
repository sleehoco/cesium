import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Shield, Eye, Fingerprint, Wifi, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ScanStep {
  id: string;
  label: string;
  icon: any;
  status: 'pending' | 'scanning' | 'complete';
}

interface RealTimeScanPanelProps {
  onScanComplete: () => void;
}

export const RealTimeScanPanel = ({ onScanComplete }: RealTimeScanPanelProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [steps, setSteps] = useState<ScanStep[]>([
    { id: '1', label: 'Analyzing Network', icon: Wifi, status: 'pending' },
    { id: '2', label: 'Fingerprinting Device', icon: Fingerprint, status: 'pending' },
    { id: '3', label: 'Detecting Threats', icon: Eye, status: 'pending' },
    { id: '4', label: 'Evaluating Security', icon: Shield, status: 'pending' },
    { id: '5', label: 'Generating Report', icon: Lock, status: 'pending' }
  ]);

  const startScan = async () => {
    setIsScanning(true);
    
    for (let i = 0; i < steps.length; i++) {
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        status: index === i ? 'scanning' : index < i ? 'complete' : 'pending'
      })));
      
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setSteps(prev => prev.map(step => ({ ...step, status: 'complete' })));
    setIsScanning(false);
    onScanComplete();
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <motion.div
            animate={{ rotate: isScanning ? 360 : 0 }}
            transition={{ duration: 2, repeat: isScanning ? Infinity : 0, ease: "linear" }}
            className="inline-block"
          >
            <Scan className="h-16 w-16 text-primary mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Security Scan</h2>
          <p className="text-muted-foreground">Real-time threat detection and analysis</p>
        </div>

        <div className="space-y-3 mb-6">
          <AnimatePresence>
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  step.status === 'complete' ? 'border-green-500/50 bg-green-500/10' :
                  step.status === 'scanning' ? 'border-primary/50 bg-primary/10' :
                  'border-secondary/50 bg-secondary/10'
                }`}
              >
                <step.icon className={`h-5 w-5 ${
                  step.status === 'complete' ? 'text-green-500' :
                  step.status === 'scanning' ? 'text-primary' :
                  'text-muted-foreground'
                }`} />
                <span className={`flex-1 text-sm font-medium ${
                  step.status === 'complete' ? 'text-green-500' :
                  step.status === 'scanning' ? 'text-primary' :
                  'text-muted-foreground'
                }`}>
                  {step.label}
                </span>
                {step.status === 'scanning' && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="h-2 w-2 rounded-full bg-primary"
                  />
                )}
                {step.status === 'complete' && (
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <Button
          onClick={startScan}
          disabled={isScanning}
          className="w-full"
          size="lg"
        >
          {isScanning ? 'Scanning...' : 'Start Security Scan'}
        </Button>
      </CardContent>
    </Card>
  );
};
