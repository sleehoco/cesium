import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Bot, Users, Zap, FileText, Search } from 'lucide-react';

interface Agent {
  name: string;
  role: string;
  model: string;
  status: 'pending' | 'working' | 'complete' | 'error';
}

interface BlogGenerationResult {
  success: boolean;
  research?: string;
  strategy?: string;
  content?: string;
  edited_content?: string;
  seo?: string;
  final_post?: {
    title: string;
    content: string;
    meta_description: string;
    keywords: any;
    seo_score: number;
  };
  agents_used?: Agent[];
}

const MultiAgentBlogGenerator: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<BlogGenerationResult | null>(null);
  const [currentAgent, setCurrentAgent] = useState('');

  const agents = [
    { name: 'Research Agent', icon: Search, description: 'Finds trending topics and data' },
    { name: 'Content Strategist', icon: Users, description: 'Plans structure and SEO strategy' },
    { name: 'Content Writer', icon: FileText, description: 'Creates engaging blog content' },
    { name: 'Content Editor', icon: Bot, description: 'Refines and polishes content' },
    { name: 'SEO Specialist', icon: Zap, description: 'Optimizes for search engines' },
  ];

  const generateBlog = async () => {
    setIsGenerating(true);
    setProgress(0);
    setResult(null);
    
    try {
      toast({
        title: "Starting Blog Generation",
        description: "Multi-agent system is now working on your blog post...",
      });

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 90) return prev + 10;
          return prev;
        });
      }, 2000);

      const { data, error } = await supabase.functions.invoke('multi-agent-blog-generator', {
        body: {
          topic: topic || undefined,
          save_to_db: false,
          author_id: user?.id || null
        }
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (error) {
        throw new Error(error.message);
      }

      setResult(data);
      
      toast({
        title: "Blog Generated Successfully!",
        description: "Your multi-agent blog post is ready for review.",
      });

    } catch (error) {
      console.error('Error generating blog:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate blog post",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveBlogPost = async () => {
    if (!result?.final_post) return;

    try {
      const { data, error } = await supabase.functions.invoke('multi-agent-blog-generator', {
        body: {
          ...result.final_post,
          save_to_db: true,
          author_id: user?.id
        }
      });

      if (error) throw error;

      toast({
        title: "Blog Post Saved",
        description: "Your blog post has been saved to the database.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save blog post to database",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Multi-Agent Blog Generator
        </h1>
        <p className="text-muted-foreground text-lg">
          Powered by multiple AI agents working together to create exceptional content
        </p>
      </div>

      {/* Agent Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {agents.map((agent, index) => {
          const Icon = agent.icon;
          return (
            <Card key={index} className="text-center">
              <CardHeader className="pb-2">
                <Icon className="h-8 w-8 mx-auto text-primary" />
                <CardTitle className="text-sm">{agent.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{agent.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Generation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Generate Blog Post
          </CardTitle>
          <CardDescription>
            Let our AI agents collaborate to create a comprehensive blog post
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic (Optional)</Label>
            <Input
              id="topic"
              placeholder="Enter a specific topic or leave blank for trending topics"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Generation Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              {currentAgent && (
                <p className="text-sm text-muted-foreground">
                  Current: {currentAgent}
                </p>
              )}
            </div>
          )}

          <Button 
            onClick={generateBlog} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Blog Post'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Agent Results Summary */}
          {result.agents_used && (
            <Card>
              <CardHeader>
                <CardTitle>Agent Collaboration Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.agents_used.map((agent, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{agent.role}</p>
                        <p className="text-sm text-muted-foreground">{agent.model}</p>
                      </div>
                      <Badge variant="secondary">Complete</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Final Blog Post */}
          {result.final_post && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Generated Blog Post
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      SEO Score: {result.final_post.seo_score}/100
                    </Badge>
                    <Button onClick={saveBlogPost} size="sm">
                      Save to Database
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input value={result.final_post.title} readOnly />
                </div>
                
                <div>
                  <Label>Meta Description</Label>
                  <Input value={result.final_post.meta_description} readOnly />
                </div>

                <div>
                  <Label>Keywords</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Array.isArray(result.final_post.keywords) 
                      ? result.final_post.keywords.map((keyword: string, index: number) => (
                          <Badge key={index} variant="secondary">{keyword}</Badge>
                        ))
                      : <Badge variant="secondary">{result.final_post.keywords}</Badge>
                    }
                  </div>
                </div>

                <div>
                  <Label>Content Preview</Label>
                  <Textarea 
                    value={result.final_post.content.substring(0, 500) + '...'} 
                    readOnly 
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Raw Agent Outputs (for debugging) */}
          <Card>
            <CardHeader>
              <CardTitle>Agent Outputs (Debug)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.research && (
                <div>
                  <Label>Research Agent</Label>
                  <Textarea value={result.research.substring(0, 300) + '...'} readOnly rows={3} />
                </div>
              )}
              {result.strategy && (
                <div>
                  <Label>Strategy Agent</Label>
                  <Textarea value={result.strategy.substring(0, 300) + '...'} readOnly rows={3} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MultiAgentBlogGenerator;