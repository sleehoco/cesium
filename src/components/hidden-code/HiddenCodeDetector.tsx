import React, { useState } from 'react';
import { Copy, Download, Eye, EyeOff, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface DetectedCode {
  type: string;
  count: number;
  description: string;
  positions: number[];
}

interface DebugArtifactFinding {
  severity: 'High' | 'Medium' | 'Low';
  type: 'SourceMap' | 'SourceReference' | 'DebugArtifact';
  url: string;
  title: string;
  evidence: string;
}

interface DebugArtifactScanResult {
  target: string;
  overallRisk: 'High' | 'Medium' | 'Low' | 'None';
  assetCount: number;
  findingCount: number;
  findings: DebugArtifactFinding[];
}

const HiddenCodeDetector = () => {
  const [inputText, setInputText] = useState('');
  const [cleanedText, setCleanedText] = useState('');
  const [detectedCodes, setDetectedCodes] = useState<DetectedCode[]>([]);
  const [showHidden, setShowHidden] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanUrl, setScanUrl] = useState('');
  const [isScanningArtifacts, setIsScanningArtifacts] = useState(false);
  const [artifactResults, setArtifactResults] = useState<DebugArtifactScanResult | null>(null);

  // Common hidden characters and their descriptions
  const hiddenCharacters = [
    { char: '\u200B', name: 'Zero Width Space', type: 'ZWSP' },
    { char: '\u200C', name: 'Zero Width Non-Joiner', type: 'ZWNJ' },
    { char: '\u200D', name: 'Zero Width Joiner', type: 'ZWJ' },
    { char: '\u2060', name: 'Word Joiner', type: 'WJ' },
    { char: '\uFEFF', name: 'Zero Width No-Break Space', type: 'ZWNBSP' },
    { char: '\u00AD', name: 'Soft Hyphen', type: 'SHY' },
    { char: '\u061C', name: 'Arabic Letter Mark', type: 'ALM' },
    { char: '\u202A', name: 'Left-to-Right Embedding', type: 'LRE' },
    { char: '\u202B', name: 'Right-to-Left Embedding', type: 'RLE' },
    { char: '\u202C', name: 'Pop Directional Formatting', type: 'PDF' },
    { char: '\u202D', name: 'Left-to-Right Override', type: 'LRO' },
    { char: '\u202E', name: 'Right-to-Left Override', type: 'RLO' },
  ];

  const detectHiddenCodes = (text: string) => {
    setIsProcessing(true);
    
    const detected: DetectedCode[] = [];
    let cleaned = text;

    // Detect each type of hidden character
    hiddenCharacters.forEach(({ char, name, type }) => {
      const positions: number[] = [];
      let index = text.indexOf(char);
      
      while (index !== -1) {
        positions.push(index);
        index = text.indexOf(char, index + 1);
      }

      if (positions.length > 0) {
        detected.push({
          type,
          count: positions.length,
          description: name,
          positions
        });
        
        // Remove from cleaned text
        cleaned = cleaned.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
      }
    });

    // Detect other suspicious patterns
    const controlChars = Array.from(cleaned).filter((char) => {
      const codePoint = char.codePointAt(0) ?? -1;
      return (codePoint >= 0x0000 && codePoint <= 0x001f) || (codePoint >= 0x007f && codePoint <= 0x009f);
    });
    if (controlChars) {
      detected.push({
        type: 'CTRL',
        count: controlChars.length,
        description: 'Control Characters',
        positions: []
      });
      cleaned = Array.from(cleaned)
        .filter((char) => {
          const codePoint = char.codePointAt(0) ?? -1;
          return !((codePoint >= 0x0000 && codePoint <= 0x001f) || (codePoint >= 0x007f && codePoint <= 0x009f));
        })
        .join('');
    }

    // Detect unusual Unicode ranges
    const unusualUnicode = Array.from(cleaned).filter((char) => {
      const codePoint = char.codePointAt(0) ?? -1;
      return (codePoint >= 0xe000 && codePoint <= 0xf8ff) || (codePoint >= 0xfff0 && codePoint <= 0xffff);
    });
    if (unusualUnicode) {
      detected.push({
        type: 'UNICODE',
        count: unusualUnicode.length,
        description: 'Private Use/Special Unicode',
        positions: []
      });
      cleaned = Array.from(cleaned)
        .filter((char) => {
          const codePoint = char.codePointAt(0) ?? -1;
          return !((codePoint >= 0xe000 && codePoint <= 0xf8ff) || (codePoint >= 0xfff0 && codePoint <= 0xffff));
        })
        .join('');
    }

    setDetectedCodes(detected);
    setCleanedText(cleaned.trim());
    setIsProcessing(false);

    if (detected.length > 0) {
      toast.success(`Detected and removed ${detected.length} types of hidden codes`);
    } else {
      toast.info('No hidden codes detected in the text');
    }
  };

  const copyToClipboard = (text: string, type: 'original' | 'cleaned') => {
    navigator.clipboard.writeText(text);
    toast.success(`${type === 'original' ? 'Original' : 'Cleaned'} text copied to clipboard`);
  };

  const downloadText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
  };

  const clearAll = () => {
    setInputText('');
    setCleanedText('');
    setDetectedCodes([]);
    toast.info('All fields cleared');
  };

  const scanDebugArtifacts = async () => {
    if (!scanUrl.trim()) {
      toast.error('Enter a URL to scan');
      return;
    }

    setIsScanningArtifacts(true);
    setArtifactResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('debug-artifact-scan', {
        body: { url: scanUrl.trim() },
      });

      if (error) {
        throw error;
      }

      setArtifactResults(data as DebugArtifactScanResult);

      if (data.findingCount > 0) {
        toast.warning(`Found ${data.findingCount} debug artifact issue(s)`);
      } else {
        toast.success('No obvious public source map exposures found');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to scan target';
      toast.error(message);
    } finally {
      setIsScanningArtifacts(false);
    }
  };

  const getSeverityVariant = (severity: DebugArtifactFinding['severity'] | DebugArtifactScanResult['overallRisk']) => {
    switch (severity) {
      case 'High':
        return 'destructive' as const;
      case 'Medium':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  const renderTextWithHighlights = (text: string): React.ReactNode => {
    if (!showHidden || detectedCodes.length === 0) {
      return text;
    }

    // Get all positions and sort them
    const allPositions = detectedCodes
      .flatMap(d => d.positions)
      .sort((a, b) => a - b);

    const parts: React.ReactNode[] = [];
    let lastPos = 0;

    allPositions.forEach((pos, idx) => {
      // Add text before the hidden character
      if (pos > lastPos) {
        parts.push(text.slice(lastPos, pos));
      }
      // Add highlighted marker for hidden character
      parts.push(
        <span 
          key={`hidden-${pos}-${idx}`} 
          className="bg-destructive/20 border border-destructive/40 px-1 rounded text-xs"
        >
          ●
        </span>
      );
      lastPos = pos + 1;
    });

    // Add remaining text
    if (lastPos < text.length) {
      parts.push(text.slice(lastPos));
    }

    return parts;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Hidden Code Detector & Cleaner
        </h1>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Detect and remove hidden characters, invisible Unicode, embedded codes, and public debug artifacts.
          Use it to clean AI-generated text and to check whether a site is leaking source maps or other release leftovers.
        </p>
      </div>

      <Tabs defaultValue="text-cleaner" className="space-y-6">
        <TabsList className="grid w-full max-w-xl mx-auto grid-cols-2">
          <TabsTrigger value="text-cleaner">Invisible Text Cleaner</TabsTrigger>
          <TabsTrigger value="artifact-checker">Source Map Leak Check</TabsTrigger>
        </TabsList>

        <TabsContent value="text-cleaner" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Input Text
                </CardTitle>
                <CardDescription>
                  Paste your text here to analyze for hidden codes and invisible characters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your AI-generated text here..."
                  className="min-h-[300px] font-mono text-sm"
                />
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={() => detectHiddenCodes(inputText)}
                    disabled={!inputText.trim() || isProcessing}
                    className="flex-1 min-w-[120px]"
                  >
                    {isProcessing ? 'Analyzing...' : 'Analyze Text'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(inputText, 'original')}
                    disabled={!inputText.trim()}
                    size="icon"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearAll}
                    disabled={!inputText.trim() && !cleanedText.trim()}
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowHidden(!showHidden)}
                    disabled={detectedCodes.length === 0}
                    size="icon"
                  >
                    {showHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                {showHidden && inputText && (
                  <div className="p-3 bg-muted rounded-md">
                    <h4 className="text-sm font-medium mb-2">Original with Hidden Characters Highlighted:</h4>
                    <div className="font-mono text-xs whitespace-pre-wrap break-words">
                      {renderTextWithHighlights(inputText)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Cleaned Text
                </CardTitle>
                <CardDescription>
                  Text with all hidden codes and invisible characters removed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={cleanedText}
                  readOnly
                  placeholder="Cleaned text will appear here..."
                  className="min-h-[300px] font-mono text-sm bg-muted"
                />
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(cleanedText, 'cleaned')}
                    disabled={!cleanedText.trim()}
                    className="flex-1 min-w-[120px]"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Clean Text
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => downloadText(cleanedText, 'cleaned-text.txt')}
                    disabled={!cleanedText.trim()}
                    size="icon"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {detectedCodes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Detection Results</CardTitle>
                <CardDescription>
                  Summary of hidden codes and invisible characters found in your text
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {detectedCodes.map((code, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="destructive">{code.type}</Badge>
                        <span className="text-sm font-mono">{code.count}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{code.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>About Hidden Codes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                AI-generated texts can contain invisible characters and hidden codes that do not show up in normal text editors
                but still break formatting, parsing, and downstream automations.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Common Hidden Characters:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Zero-width spaces and joiners</li>
                    <li>• Directional formatting marks</li>
                    <li>• Control characters</li>
                    <li>• Private use Unicode characters</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Why Clean Your Text:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Prevent formatting issues</li>
                    <li>• Ensure proper text processing</li>
                    <li>• Improve security</li>
                    <li>• Maintain data integrity</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="artifact-checker" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Debug Artifact Leak Check</CardTitle>
              <CardDescription>
                Probe a public site for leaked source maps, `sourceMappingURL` references, and common release leftovers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  value={scanUrl}
                  onChange={(e) => setScanUrl(e.target.value)}
                  placeholder="https://example.com"
                />
                <Button onClick={scanDebugArtifacts} disabled={isScanningArtifacts}>
                  {isScanningArtifacts ? 'Scanning...' : 'Scan Site'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                This checks for the same class of exposure that can happen when production builds accidentally publish source maps or other debug files.
              </p>
            </CardContent>
          </Card>

          {artifactResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Scan Results
                  <Badge variant={getSeverityVariant(artifactResults.overallRisk)}>
                    {artifactResults.overallRisk} risk
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Scanned {artifactResults.target} across {artifactResults.assetCount} discovered script asset(s).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {artifactResults.findings.length === 0 ? (
                  <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                    No obvious public source map or debug artifact exposure was found in this quick check.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {artifactResults.findings.map((finding) => (
                      <div key={`${finding.type}-${finding.url}`} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="font-medium">{finding.title}</div>
                          <Badge variant={getSeverityVariant(finding.severity)}>{finding.severity}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2 break-all">{finding.url}</div>
                        <p className="text-sm text-muted-foreground">{finding.evidence}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Why This Matters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                A modern AI tool can still leak a large amount of source through a simple packaging mistake. Public source maps often expose original file names,
                source structure, internal comments, and sometimes full embedded source content.
              </p>
              <p>
                The defensive logic is straightforward: do not publish `.map` files unless you intend to, strip `sourceMappingURL` references from production assets,
                and validate your release artifacts before pushing to npm or a CDN.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HiddenCodeDetector;
