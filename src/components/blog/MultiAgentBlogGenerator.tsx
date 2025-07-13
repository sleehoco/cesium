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
import { Loader2, Bot, Users, Zap, FileText, Search, Image, BarChart3, Save, Eye, Globe } from 'lucide-react';

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
    featured_image_url?: string;
    diagrams?: string[];
  };
  agents_used?: Agent[];
  generated_images?: Array<{
    url: string;
    prompt: string;
    section: string;
  }>;
}

const MultiAgentBlogGenerator: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<BlogGenerationResult | null>(null);
  const [currentAgent, setCurrentAgent] = useState('');
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [publishedBlogId, setPublishedBlogId] = useState<string | null>(null);

  const agents = [
    { name: 'Research Agent', icon: Search, description: 'Finds trending topics and data' },
    { name: 'Content Strategist', icon: Users, description: 'Plans structure and SEO strategy' },
    { name: 'Content Writer', icon: FileText, description: 'Creates engaging blog content' },
    { name: 'Content Editor', icon: Bot, description: 'Refines and polishes content' },
    { name: 'SEO Specialist', icon: Zap, description: 'Optimizes for search engines' },
    { name: 'Image Generator', icon: Image, description: 'Creates relevant images' },
    { name: 'Diagram Creator', icon: BarChart3, description: 'Adds technical diagrams' },
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
          author_id: user?.id || null,
          include_images: true,
          include_diagrams: true
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

  const generateImages = async () => {
    if (!result?.final_post) return;

    setIsGeneratingImages(true);
    try {
      // Generate hero image
      const heroPrompt = `Professional, modern illustration for a blog post titled "${result.final_post.title}". Cybersecurity theme, high-tech, blue and purple color scheme, clean and corporate style.`;
      
      const { data: heroImage } = await supabase.functions.invoke('blog-image-generator', {
        body: {
          prompt: heroPrompt,
          size: "1536x1024",
          quality: "high"
        }
      });

      if (heroImage?.success) {
        // Update the result with the generated image
        setResult(prev => ({
          ...prev!,
          final_post: {
            ...prev!.final_post!,
            featured_image_url: heroImage.image_url
          },
          generated_images: [
            ...(prev?.generated_images || []),
            {
              url: heroImage.image_url,
              prompt: heroPrompt,
              section: 'hero'
            }
          ]
        }));

        toast({
          title: "Images Generated",
          description: "Hero image has been created for your blog post.",
        });
      }
    } catch (error) {
      toast({
        title: "Image Generation Failed",
        description: "Failed to generate images for the blog post",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImages(false);
    }
  };

  const publishBlog = async () => {
    if (!result?.final_post) return;

    try {
      // Save directly to the blog_posts table
      const blogPostData = {
        title: result.final_post.title,
        content: result.final_post.content,
        meta_description: result.final_post.meta_description,
        meta_title: result.final_post.title,
        ai_keywords: result.final_post.keywords,
        ai_seo_score: result.final_post.seo_score,
        featured_image_url: result.final_post.featured_image_url,
        author_id: user?.id,
        status: 'published',
        published_at: new Date().toISOString(),
        slug: result.final_post.title.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      };

      const { data: blogPost, error } = await supabase
        .from('blog_posts')
        .insert(blogPostData)
        .select()
        .single();

      if (error) throw error;

      setPublishedBlogId(blogPost.id);
      
      toast({
        title: "Blog Published!",
        description: "Your blog post is now live on the website.",
      });
    } catch (error) {
      console.error('Error publishing blog:', error);
      toast({
        title: "Publish Failed",
        description: error instanceof Error ? error.message : "Failed to publish blog post",
        variant: "destructive",
      });
    }
  };

  const publishSampleBlog = async () => {
    try {
      const sampleBlogData = {
        title: 'Getting Started with Cybersecurity: A Comprehensive Guide',
        content: `# Getting Started with Cybersecurity: A Comprehensive Guide

## Introduction

Cybersecurity has become one of the most critical concerns for businesses and individuals alike. With cyber threats evolving rapidly, understanding the fundamentals of cybersecurity is essential for protecting digital assets.

## Key Cybersecurity Principles

### 1. Defense in Depth
Implementing multiple layers of security controls to protect against various types of attacks.

### 2. Least Privilege Access
Granting users only the minimum access rights needed to perform their job functions.

### 3. Regular Updates and Patches
Keeping all software and systems up to date with the latest security patches.

## Common Threats

- **Phishing Attacks**: Deceptive emails designed to steal credentials
- **Malware**: Malicious software that can damage or compromise systems
- **Social Engineering**: Manipulating people to divulge confidential information

## Best Practices

1. Use strong, unique passwords for all accounts
2. Enable two-factor authentication wherever possible
3. Keep software updated
4. Be cautious with email attachments and links
5. Regular security training for employees

## Conclusion

Cybersecurity is an ongoing process that requires constant vigilance and adaptation. By implementing these fundamental practices, organizations can significantly reduce their risk of cyber attacks.`,
        meta_description: 'Learn the essential cybersecurity principles and best practices to protect your digital assets. A comprehensive guide covering threats, defense strategies, and implementation tips.',
        meta_title: 'Getting Started with Cybersecurity: A Comprehensive Guide',
        ai_keywords: ["cybersecurity", "digital security", "cyber threats", "data protection", "security best practices"],
        ai_seo_score: 85,
        author_id: user?.id,
        status: 'published',
        published_at: new Date().toISOString(),
        slug: 'getting-started-with-cybersecurity-comprehensive-guide'
      };

      const { data: blogPost, error } = await supabase
        .from('blog_posts')
        .insert(sampleBlogData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sample Blog Published!",
        description: `Blog post "${blogPost.title}" has been published successfully.`,
      });
    } catch (error) {
      console.error('Error publishing sample blog:', error);
      toast({
        title: "Publish Failed",
        description: error instanceof Error ? error.message : "Failed to publish sample blog post",
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
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
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
          
          <Button 
            onClick={publishSampleBlog} 
            variant="outline"
            className="w-full"
          >
            <Globe className="mr-2 h-4 w-4" />
            Publish Sample Blog Post
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
                    {!result.final_post.featured_image_url && (
                      <Button onClick={generateImages} size="sm" disabled={isGeneratingImages}>
                        {isGeneratingImages ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating Images
                          </>
                        ) : (
                          <>
                            <Image className="mr-2 h-4 w-4" />
                            Generate Images
                          </>
                        )}
                      </Button>
                    )}
                    <Button onClick={publishBlog} size="sm" variant="default">
                      <Globe className="mr-2 h-4 w-4" />
                      Publish Live
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.final_post.featured_image_url && (
                  <div>
                    <Label>Featured Image</Label>
                    <div className="mt-2">
                      <img 
                        src={result.final_post.featured_image_url} 
                        alt={result.final_post.title}
                        className="w-full max-w-2xl h-64 object-cover rounded-lg border"
                      />
                    </div>
                  </div>
                )}

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
                  <Label>Content Preview (with Mermaid Diagrams)</Label>
                  <div className="mt-2 p-4 border rounded-lg bg-muted">
                    <div className="prose prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ 
                        __html: result.final_post.content
                          .substring(0, 1000)
                          .replace(/```mermaid\n([\s\S]*?)\n```/g, 
                            '<div class="bg-blue-50 p-4 border-l-4 border-blue-400 my-4"><strong>Mermaid Diagram:</strong> <code>$1</code></div>'
                          ) + '...'
                      }} />
                    </div>
                  </div>
                </div>

                {publishedBlogId && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">Blog Published Successfully!</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Your blog post is now live and can be viewed on the website.
                    </p>
                  </div>
                )}
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