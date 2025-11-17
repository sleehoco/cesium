import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Loader2, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { generateEnhancedFingerprint, generateSessionId } from '@/utils/enhancedFingerprinting';

interface AnalysisResult {
  id: string;
  riskScore: number;
  threats: string[];
  aiAnalysis: any;
  ipAddress: string;
  timestamp: string;
}

const FingerprintAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [sessionId] = useState(() => generateSessionId());

  useEffect(() => {
    analyzeConnection();
  }, []);

  const analyzeConnection = async () => {
    setIsAnalyzing(true);
    
    try {
      toast.info('Collecting fingerprint data...');
      
      // Generate enhanced fingerprint
      const browserFingerprint = await generateEnhancedFingerprint();
      
      const connectionMetadata = {
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        touchSupport: 'ontouchstart' in window,
        batteryAPI: 'getBattery' in navigator,
      };

      toast.info('Analyzing with AI...');

      // Call edge function for AI analysis
      const { data, error } = await supabase.functions.invoke('analyze-fingerprint', {
        body: {
          sessionId,
          browserFingerprint,
          connectionMetadata,
          userAgent: navigator.userAgent,
        },
      });

      if (error) {
        console.error('Analysis error:', error);
        
        if (error.message?.includes('429')) {
          toast.error('Rate limit exceeded. Please wait a moment and try again.');
        } else if (error.message?.includes('402')) {
          toast.error('AI analysis unavailable. Please contact support.');
        } else {
          toast.error('Failed to analyze fingerprint');
        }
        return;
      }

      if (data?.success) {
        setAnalysis(data.analysis);
        toast.success('Analysis complete!');
      } else {
        toast.error('Analysis failed');
      }

    } catch (error) {
      console.error('Error during analysis:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskLevel = (score: number): { label: string; color: string; icon: React.ReactNode } => {
    if (score < 30) {
      return {
        label: 'Low Risk',
        color: 'text-green-600',
        icon: <CheckCircle className="h-5 w-5" />,
      };
    } else if (score < 60) {
      return {
        label: 'Medium Risk',
        color: 'text-yellow-600',
        icon: <Activity className="h-5 w-5" />,
      };
    } else {
      return {
        label: 'High Risk',
        color: 'text-red-600',
        icon: <AlertTriangle className="h-5 w-5" />,
      };
    }
  };

  if (isAnalyzing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">Analyzing your connection...</p>
            <p className="text-sm text-muted-foreground">
              Collecting fingerprint data and performing AI analysis
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertDescription>
              No analysis data available. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const riskLevel = getRiskLevel(analysis.riskScore);

  return (
    <div className="space-y-6">
      {/* Risk Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Connection Security Analysis
          </CardTitle>
          <CardDescription>
            AI-powered analysis of your connection and browser fingerprint
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Risk Score</span>
              <div className={`flex items-center gap-2 ${riskLevel.color}`}>
                {riskLevel.icon}
                <span className="font-bold">{riskLevel.label}</span>
              </div>
            </div>
            <Progress value={analysis.riskScore} className="h-3" />
            <p className="text-xs text-muted-foreground">
              Score: {analysis.riskScore}/100
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div>
              <p className="text-sm font-medium mb-1">Session ID</p>
              <p className="text-xs text-muted-foreground font-mono">{sessionId}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">IP Address</p>
              <p className="text-xs text-muted-foreground font-mono">{analysis.ipAddress}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Threats Card */}
      {analysis.threats && analysis.threats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Detected Threats & Anomalies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analysis.threats.map((threat, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">
                    {index + 1}
                  </Badge>
                  <p className="text-sm">{threat}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Analysis Card */}
      {analysis.aiAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis Details</CardTitle>
            <CardDescription>
              Detailed assessment from AI security model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.aiAnalysis.deviceInfo && (
                <div>
                  <p className="text-sm font-medium mb-1">Device Information</p>
                  <p className="text-sm text-muted-foreground">
                    {analysis.aiAnalysis.deviceInfo}
                  </p>
                </div>
              )}
              
              {analysis.aiAnalysis.confidence && (
                <div>
                  <p className="text-sm font-medium mb-1">Confidence Level</p>
                  <p className="text-sm text-muted-foreground">
                    {analysis.aiAnalysis.confidence}
                  </p>
                </div>
              )}

              {analysis.aiAnalysis.recommendations && (
                <div>
                  <p className="text-sm font-medium mb-2">Recommendations</p>
                  {Array.isArray(analysis.aiAnalysis.recommendations) ? (
                    <ul className="list-disc list-inside space-y-1">
                      {analysis.aiAnalysis.recommendations.map((rec: string, idx: number) => (
                        <li key={idx} className="text-sm text-muted-foreground">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {analysis.aiAnalysis.recommendations}
                    </p>
                  )}
                </div>
              )}

              {analysis.aiAnalysis.rawAnalysis && (
                <div>
                  <p className="text-sm font-medium mb-2">Full Analysis</p>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs whitespace-pre-wrap font-mono">
                      {analysis.aiAnalysis.rawAnalysis}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FingerprintAnalysis;