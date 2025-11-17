import { motion } from 'framer-motion';
import { Shield, Activity, Lock, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Metric {
  label: string;
  value: string;
  icon: any;
  color: string;
  change?: string;
}

export const SecurityMetrics = () => {
  const metrics: Metric[] = [
    {
      label: 'Security Score',
      value: '94/100',
      icon: Shield,
      color: 'text-green-500',
      change: '+5%'
    },
    {
      label: 'Active Sessions',
      value: '1,247',
      icon: Activity,
      color: 'text-blue-500',
      change: '+12%'
    },
    {
      label: 'Threats Blocked',
      value: '38',
      icon: Lock,
      color: 'text-yellow-500',
      change: '-23%'
    },
    {
      label: 'Scans Today',
      value: '2,891',
      icon: Eye,
      color: 'text-purple-500',
      change: '+8%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                  <p className="text-2xl font-bold text-foreground mb-2">{metric.value}</p>
                  {metric.change && (
                    <p className={`text-xs font-medium ${
                      metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {metric.change} vs last week
                    </p>
                  )}
                </div>
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
