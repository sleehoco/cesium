import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Shield, AlertTriangle, CheckCircle, XCircle, Info, Search, BookOpen, Code, Bug, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import BackgroundAnimations from '@/components/utils/BackgroundAnimations';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const scanFormSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
});

type ScanFormData = z.infer<typeof scanFormSchema>;

interface Vulnerability {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  category: string;
  description: string;
  impact: string;
  location: string;
  remediation: {
    steps: string[];
    codeExample?: string;
    references?: string[];
  };
}

interface ScanResults {
  summary: {
    totalVulnerabilities: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    overallRiskScore: number;
  };
  vulnerabilities: Vulnerability[];
  recommendations: string[];
  rawAnalysis?: string;
  complianceStatus?: {
    owasp: string;
    pci: string;
    gdpr: string;
  };
}

const SecurityScanner = () => {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResults | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  const form = useForm<ScanFormData>({
    resolver: zodResolver(scanFormSchema),
    defaultValues: {
      url: '',
    },
  });

  const onSubmit = async (data: ScanFormData) => {
    setIsScanning(true);
    setScanProgress(0);
    setScanResults(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => Math.min(prev + 10, 90));
    }, 500);

    try {
      console.log('Starting security scan for:', data.url);
      
      const { data: scanData, error } = await supabase.functions.invoke('moonshot-security-scan', {
        body: {
          url: data.url,
          scanType: 'comprehensive'
        }
      });

      clearInterval(progressInterval);
      setScanProgress(100);

      if (error) {
        console.error('Scan error:', error);
        throw error;
      }

      if (!scanData.success) {
        throw new Error(scanData.error || 'Scan failed');
      }

      console.log('Scan completed:', scanData);
      setScanResults(scanData.results);
      
      toast({
        title: "Scan Complete",
        description: `Found ${scanData.results.summary.totalVulnerabilities} potential vulnerabilities`,
      });
    } catch (error) {
      console.error('Security scan error:', error);
      clearInterval(progressInterval);
      setScanProgress(0);
      
      toast({
        title: "Scan Failed",
        description: error.message || "Failed to complete security scan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'high':
        return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
      case 'high':
        return <XCircle className="w-5 h-5" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5" />;
      case 'low':
        return <Info className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>AI Security Scanner - CesiumCyber</title>
        <meta name="description" content="Advanced AI-powered security vulnerability scanner and security guides" />
      </Helmet>

      <BackgroundAnimations />
      <Navbar />

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            AI Security Scanner
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powered by Moonshot AI - Comprehensive vulnerability detection and security analysis
          </p>
        </div>

        <Tabs defaultValue="scanner" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="scanner">
              <Search className="w-4 h-4 mr-2" />
              Scanner
            </TabsTrigger>
            <TabsTrigger value="guides">
              <BookOpen className="w-4 h-4 mr-2" />
              Security Guides
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scanner" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scan Website for Vulnerabilities</CardTitle>
                <CardDescription>
                  Enter a URL to perform a comprehensive security analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com"
                              {...field}
                              disabled={isScanning}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {isScanning && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Scanning in progress...</span>
                          <span>{scanProgress}%</span>
                        </div>
                        <Progress value={scanProgress} />
                      </div>
                    )}

                    <Button type="submit" disabled={isScanning} className="w-full">
                      {isScanning ? 'Scanning...' : 'Start Security Scan'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {scanResults && (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Total Issues</p>
                        <p className="text-3xl font-bold">{scanResults.summary.totalVulnerabilities}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-red-200 dark:border-red-900">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Critical</p>
                        <p className="text-3xl font-bold text-red-600">{scanResults.summary.critical}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-orange-200 dark:border-orange-900">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">High</p>
                        <p className="text-3xl font-bold text-orange-600">{scanResults.summary.high}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-yellow-200 dark:border-yellow-900">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Medium</p>
                        <p className="text-3xl font-bold text-yellow-600">{scanResults.summary.medium}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-blue-200 dark:border-blue-900">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Low</p>
                        <p className="text-3xl font-bold text-blue-600">{scanResults.summary.low}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Risk Score */}
                <Card>
                  <CardHeader>
                    <CardTitle>Overall Risk Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Security Level</span>
                        <span className="text-2xl font-bold">{scanResults.summary.overallRiskScore}/100</span>
                      </div>
                      <Progress value={scanResults.summary.overallRiskScore} className="h-2" />
                      <p className="text-sm text-muted-foreground mt-2">
                        {scanResults.summary.overallRiskScore < 30 ? 'Low Risk - Good security posture' :
                         scanResults.summary.overallRiskScore < 60 ? 'Medium Risk - Some improvements needed' :
                         scanResults.summary.overallRiskScore < 80 ? 'High Risk - Immediate action required' :
                         'Critical Risk - Urgent security issues detected'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Vulnerabilities */}
                {scanResults.vulnerabilities && scanResults.vulnerabilities.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Vulnerabilities Found</CardTitle>
                      <CardDescription>
                        Detailed list of security issues with remediation steps
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {scanResults.vulnerabilities.map((vuln, index) => (
                          <AccordionItem key={vuln.id || index} value={`item-${index}`}>
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center gap-3 text-left w-full">
                                <Badge className={getSeverityColor(vuln.severity)}>
                                  {getSeverityIcon(vuln.severity)}
                                  <span className="ml-1">{vuln.severity}</span>
                                </Badge>
                                <div className="flex-1">
                                  <p className="font-semibold">{vuln.title}</p>
                                  <p className="text-sm text-muted-foreground">{vuln.category}</p>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <Bug className="w-4 h-4" />
                                  Description
                                </h4>
                                <p className="text-muted-foreground">{vuln.description}</p>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4" />
                                  Impact
                                </h4>
                                <p className="text-muted-foreground">{vuln.impact}</p>
                              </div>

                              {vuln.location && (
                                <div>
                                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <Code className="w-4 h-4" />
                                    Location
                                  </h4>
                                  <p className="text-muted-foreground font-mono text-sm bg-muted p-2 rounded">
                                    {vuln.location}
                                  </p>
                                </div>
                              )}

                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <Lock className="w-4 h-4" />
                                  Remediation Steps
                                </h4>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                  {vuln.remediation.steps.map((step, i) => (
                                    <li key={i}>{step}</li>
                                  ))}
                                </ol>
                              </div>

                              {vuln.remediation.codeExample && (
                                <div>
                                  <h4 className="font-semibold mb-2">Code Example</h4>
                                  <pre className="bg-muted p-4 rounded overflow-x-auto text-sm">
                                    <code>{vuln.remediation.codeExample}</code>
                                  </pre>
                                </div>
                              )}

                              {vuln.remediation.references && vuln.remediation.references.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2">References</h4>
                                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    {vuln.remediation.references.map((ref, i) => (
                                      <li key={i}>
                                        <a href={ref} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                          {ref}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                )}

                {/* Raw Analysis */}
                {scanResults.rawAnalysis && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded">
                          {scanResults.rawAnalysis}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recommendations */}
                {scanResults.recommendations && scanResults.recommendations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {scanResults.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="guides" className="space-y-6">
            <SecurityGuides />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

// Security Guides Component
const SecurityGuides = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="w-5 h-5" />
            Common Vulnerability Types
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">SQL Injection</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Attackers inject malicious SQL code through input fields to manipulate database queries.
            </p>
            <div className="bg-muted p-3 rounded text-sm">
              <p className="font-mono">Example: ' OR '1'='1' --</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Cross-Site Scripting (XSS)</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Malicious scripts injected into web pages viewed by other users.
            </p>
            <div className="bg-muted p-3 rounded text-sm">
              <p className="font-mono">&lt;script&gt;alert('XSS')&lt;/script&gt;</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">CSRF (Cross-Site Request Forgery)</h4>
            <p className="text-sm text-muted-foreground">
              Tricks users into executing unwanted actions while authenticated.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Broken Authentication</h4>
            <p className="text-sm text-muted-foreground">
              Weak session management allowing attackers to compromise accounts.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Secure Coding Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Input Validation</p>
              <p className="text-sm text-muted-foreground">Always validate and sanitize user input on both client and server side</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Parameterized Queries</p>
              <p className="text-sm text-muted-foreground">Use prepared statements to prevent SQL injection</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Secure Password Storage</p>
              <p className="text-sm text-muted-foreground">Hash passwords with bcrypt or Argon2, never store plaintext</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">HTTPS Everywhere</p>
              <p className="text-sm text-muted-foreground">Use TLS/SSL for all data transmission</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Security Headers</p>
              <p className="text-sm text-muted-foreground">Implement CSP, HSTS, X-Frame-Options, and X-Content-Type-Options</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Principle of Least Privilege</p>
              <p className="text-sm text-muted-foreground">Grant minimum necessary permissions to users and systems</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Testing Methodologies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">1. Static Application Security Testing (SAST)</h4>
            <p className="text-sm text-muted-foreground">
              Analyze source code for vulnerabilities without executing the application. Tools: SonarQube, ESLint security plugins.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">2. Dynamic Application Security Testing (DAST)</h4>
            <p className="text-sm text-muted-foreground">
              Test running applications by simulating attacks. Tools: OWASP ZAP, Burp Suite.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">3. Penetration Testing</h4>
            <p className="text-sm text-muted-foreground">
              Simulate real-world attacks to identify exploitable vulnerabilities. Phases: reconnaissance, scanning, exploitation, reporting.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">4. Security Code Review</h4>
            <p className="text-sm text-muted-foreground">
              Manual inspection of code to identify security flaws that automated tools might miss.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">5. Dependency Scanning</h4>
            <p className="text-sm text-muted-foreground">
              Check third-party libraries for known vulnerabilities. Tools: npm audit, Snyk, Dependabot.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Remediation Guides
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Fixing SQL Injection</h4>
            <div className="bg-muted p-3 rounded text-sm space-y-2">
              <p className="text-red-600 font-mono">❌ Bad: query = "SELECT * FROM users WHERE id = " + userId</p>
              <p className="text-green-600 font-mono">✅ Good: Use parameterized queries or ORM</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Preventing XSS</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Escape all user input before rendering</li>
              <li>Use Content Security Policy (CSP) headers</li>
              <li>Sanitize HTML with libraries like DOMPurify</li>
              <li>Validate input on both client and server</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">CSRF Protection</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Use anti-CSRF tokens for state-changing operations</li>
              <li>Implement SameSite cookie attribute</li>
              <li>Verify Origin and Referer headers</li>
              <li>Use framework-provided CSRF protection</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Secure Authentication</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Implement multi-factor authentication (MFA)</li>
              <li>Use secure session management</li>
              <li>Set proper cookie flags (HttpOnly, Secure, SameSite)</li>
              <li>Implement account lockout after failed attempts</li>
              <li>Use OAuth 2.0 / OpenID Connect for third-party auth</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityScanner;
