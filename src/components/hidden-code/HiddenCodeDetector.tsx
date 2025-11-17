import React, { useState } from 'react';
import { Copy, Download, Eye, EyeOff, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface DetectedCode {
  type: string;
  count: number;
  description: string;
  positions: number[];
}

const HiddenCodeDetector = () => {
  const [inputText, setInputText] = useState('');
  const [cleanedText, setCleanedText] = useState('');
  const [detectedCodes, setDetectedCodes] = useState<DetectedCode[]>([]);
  const [showHidden, setShowHidden] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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
    const controlChars = cleaned.match(/[\u0000-\u001F\u007F-\u009F]/g);
    if (controlChars) {
      detected.push({
        type: 'CTRL',
        count: controlChars.length,
        description: 'Control Characters',
        positions: []
      });
      cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
    }

    // Detect unusual Unicode ranges
    const unusualUnicode = cleaned.match(/[\uE000-\uF8FF\uFFF0-\uFFFF]/g);
    if (unusualUnicode) {
      detected.push({
        type: 'UNICODE',
        count: unusualUnicode.length,
        description: 'Private Use/Special Unicode',
        positions: []
      });
      cleaned = cleaned.replace(/[\uE000-\uF8FF\uFFF0-\uFFFF]/g, '');
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
          Detect and remove hidden characters, invisible Unicode, and embedded codes from AI-generated texts. 
          Perfect for cleaning OpenGPT outputs and ensuring text security.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
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

        {/* Output Section */}
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

      {/* Detection Results */}
      {detectedCodes.length > 0 && (
        <Card className="mt-6">
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

      {/* Educational Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>About Hidden Codes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            AI-generated texts, especially from models like OpenGPT, can sometimes contain invisible characters 
            and hidden codes that aren't visible in normal text editors but can cause issues when copying, 
            pasting, or processing the text.
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
    </div>
  );
};

export default HiddenCodeDetector;