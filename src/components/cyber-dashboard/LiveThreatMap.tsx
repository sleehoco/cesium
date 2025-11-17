import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

interface ThreatIndicator {
  id: string;
  type: 'safe' | 'warning' | 'danger';
  label: string;
  value: number;
  maxValue: number;
}

export const LiveThreatMap = () => {
  const [threats, setThreats] = useState<ThreatIndicator[]>([
    { id: '1', type: 'safe', label: 'Secure Connections', value: 0, maxValue: 100 },
    { id: '2', type: 'warning', label: 'Suspicious Activity', value: 0, maxValue: 100 },
    { id: '3', type: 'danger', label: 'Detected Threats', value: 0, maxValue: 100 },
    { id: '4', type: 'safe', label: 'Protected Sessions', value: 0, maxValue: 100 }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setThreats(prev => prev.map(threat => ({
        ...threat,
        value: Math.min(threat.maxValue, threat.value + Math.random() * 5)
      })));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'safe': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'danger': return Shield;
      default: return Activity;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'safe': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'danger': return 'text-red-500';
      default: return 'text-primary';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {threats.map((threat) => {
        const Icon = getIcon(threat.type);
        const percentage = (threat.value / threat.maxValue) * 100;
        
        return (
          <motion.div
            key={threat.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon className={`h-5 w-5 ${getColor(threat.type)}`} />
                <span className="text-sm font-medium text-foreground">{threat.label}</span>
              </div>
              <span className={`text-sm font-bold ${getColor(threat.type)}`}>
                {Math.round(percentage)}%
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <motion.div
                className={`h-full ${
                  threat.type === 'safe' ? 'bg-green-500' :
                  threat.type === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
