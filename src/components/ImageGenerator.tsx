import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ImageIcon, Download, Loader2 } from 'lucide-react';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: {
          prompt: prompt,
          size: "1024x1024",
          quality: "high"
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message);
      }

      if (data.success && data.image) {
        // The image comes as base64 data from gpt-image-1
        const imageUrl = data.image.b64_json ? 
          `data:image/png;base64,${data.image.b64_json}` : 
          data.image.url;
        
        setGeneratedImage(imageUrl);
        toast.success('Image generated successfully!');
      } else {
        throw new Error(data.error || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error(`Failed to generate image: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateRandomPrompt = () => {
    const prompts = [
      "A futuristic cybersecurity expert working in a neon-lit digital fortress, surrounded by floating holographic security shields and data streams",
      "An elegant digital guardian angel made of flowing code and light, protecting a glowing city of data towers",
      "A steampunk-inspired cybersecurity laboratory with brass mechanical computers and steam-powered encryption devices",
      "A mystical forest where each tree is made of fiber optic cables, glowing with different colored data packets flowing through them",
      "A cosmic hacker's den floating in space, with constellation-pattern code displays and nebula-powered quantum computers",
      "An art deco style cybersecurity command center with geometric patterns made of golden circuit boards",
      "A underwater digital reef where coral formations are made of crystalline data structures and schools of encrypted fish swim through fiber optic seaweed"
    ];
    
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setPrompt(randomPrompt);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-6 w-6" />
            AI Image Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Image Prompt</label>
            <Textarea
              placeholder="Describe the image you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={generateImage}
              disabled={isGenerating || !prompt.trim()}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4" />
                  Generate Image
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={generateRandomPrompt}
              disabled={isGenerating}
            >
              Random Prompt
            </Button>
          </div>
        </CardContent>
      </Card>

      {generatedImage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generated Image
              <Button
                onClick={downloadImage}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg overflow-hidden border">
              <img
                src={generatedImage}
                alt="Generated artwork"
                className="w-full h-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              <strong>Prompt:</strong> {prompt}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageGenerator;