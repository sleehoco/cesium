import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, Calendar, Eye, User, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import DOMPurify from 'dompurify';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  featured_image_url: string | null;
  published_at: string;
  view_count: number;
  meta_description: string;
  ai_keywords: any;
  author_id: string;
  status: string;
  ai_seo_score: number;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  const fetchBlogPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      
      setBlogPost(data);
      
      // Increment view count
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id);

      if (updateError) {
        console.error('Error updating view count:', updateError);
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      toast.error('Blog post not found');
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!blogPost) return;
    
    if (window.confirm(`Are you sure you want to delete "${blogPost.title}"? This action cannot be undone.`)) {
      try {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', blogPost.id);

        if (error) throw error;

        toast.success('Blog post deleted successfully');
        navigate('/blog');
      } catch (error) {
        console.error('Error deleting blog post:', error);
        toast.error('Failed to delete blog post');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-muted rounded mb-8"></div>
            <div className="h-64 bg-muted rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="bg-background min-h-screen">
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <Button onClick={() => navigate('/blog')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/blog')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
          
          {blogPost && (user?.id === blogPost.author_id || isAdmin) && (
            <Button
              variant="destructive"
              onClick={handleDeletePost}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Post
            </Button>
          )}
        </div>

        <article>
          {/* Featured Image */}
          {blogPost.featured_image_url && (
            <div className="mb-8">
              <img
                src={blogPost.featured_image_url}
                alt={blogPost.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {blogPost.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(blogPost.published_at)}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {blogPost.view_count || 0} views
              </div>
              {blogPost.ai_seo_score && (
                <Badge variant="secondary">
                  SEO Score: {blogPost.ai_seo_score}/100
                </Badge>
              )}
            </div>

            {blogPost.meta_description && (
              <p className="text-lg text-muted-foreground mb-6">
                {blogPost.meta_description}
              </p>
            )}

            {/* Keywords */}
            {blogPost.ai_keywords && (
              <div className="flex flex-wrap gap-2 mb-8">
                {(Array.isArray(blogPost.ai_keywords) ? blogPost.ai_keywords : [blogPost.ai_keywords])
                  .map((keyword: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {keyword}
                    </Badge>
                  ))}
              </div>
            )}
          </header>

          {/* Content */}
          <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(
                blogPost.content
                  .replace(/```mermaid\n([\s\S]*?)\n```/g, 
                    '<div class="bg-blue-50 dark:bg-blue-950 p-6 border-l-4 border-blue-400 my-6 rounded-r-lg"><strong>Mermaid Diagram:</strong><br/><code class="text-sm">$1</code></div>'
                  )
                  .replace(/\n/g, '<br/>')
                  .replace(/#{1,6}\s([^\n]+)/g, (match, title) => {
                    const level = match.indexOf(' ');
                    return `<h${level} class="font-bold mt-8 mb-4 text-primary">${title}</h${level}>`;
                  })
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>'),
                {
                  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'code', 'pre', 'div', 'span'],
                  ALLOWED_ATTR: ['href', 'class', 'style'],
                  ALLOW_DATA_ATTR: false
                }
              )
            }} />
          </div>
        </article>
      </div>
      
      <Footer />
    </div>
  );
};

export default BlogPost;