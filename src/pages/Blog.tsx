
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import NewsletterSignup from '@/components/newsletter/NewsletterSignup';
import { Search, Bot, Plus, BarChart3, Trash2, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  featured_image_url: string | null;
  published_at: string;
  view_count: number;
  meta_description: string;
  ai_keywords: any;
  author_id: string;
  status: string;
}

const categories = [
  { name: 'All', value: '' },
  { name: 'Cybersecurity', value: 'cybersecurity' },
  { name: 'Technology', value: 'technology' },
  { name: 'Privacy', value: 'privacy' },
  { name: 'Software', value: 'software' },
  { name: 'AI', value: 'ai' },
];

const Blog = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (e: React.MouseEvent, postId: string, postTitle: string) => {
    e.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete "${postTitle}"? This action cannot be undone.`)) {
      try {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', postId);

        if (error) throw error;

        toast.success('Blog post deleted successfully');
        fetchBlogPosts();
      } catch (error) {
        console.error('Error deleting blog post:', error);
        toast.error('Failed to delete blog post');
      }
    }
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.meta_description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || 
      post.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (post.ai_keywords && Array.isArray(post.ai_keywords) && 
       post.ai_keywords.some((keyword: string) => 
         keyword.toLowerCase().includes(selectedCategory.toLowerCase())
       ));
    
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePostClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      
      {/* Main Content Container with proper mobile spacing */}
      <div className="pt-20 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Blog
          </h1>
          
          {/* Category Filter - Mobile Optimized */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Search and Admin Actions - Mobile Responsive */}
          <div className="flex flex-col gap-4 items-center justify-center mb-6 sm:mb-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {user && (
              <div className="flex gap-2 flex-wrap justify-center">
                <Button
                  onClick={() => navigate('/create-blog')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Create</span>
                </Button>
                <Button
                  onClick={() => navigate('/blog-generator')}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Bot className="h-4 w-4" />
                  <span className="hidden sm:inline">AI Generator</span>
                </Button>
                {isAdmin && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/admin/blog-analytics')}
                      className="flex items-center gap-2"
                    >
                      <BarChart3 className="h-4 w-4" />
                      <span className="hidden sm:inline">Analytics</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/newsletter-manager')}
                      className="flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      <span className="hidden sm:inline">Newsletter</span>
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-card rounded-lg overflow-hidden border">
                  <div className="h-48 sm:h-64 bg-muted"></div>
                  <div className="p-4 sm:p-6">
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <div className="h-4 bg-muted rounded w-16"></div>
                        <div className="h-4 bg-muted rounded w-16"></div>
                      </div>
                      <div className="h-6 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-20"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="h-16 sm:h-24 w-16 sm:w-24 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl sm:text-2xl font-semibold mb-2">No blog posts found</h3>
            <p className="text-muted-foreground mb-6 px-4">
              {searchTerm || selectedCategory ? 'Try adjusting your filters' : 'Be the first to create a blog post!'}
            </p>
            {user && (
              <div className="flex gap-2 justify-center flex-wrap">
                <Button onClick={() => navigate('/create-blog')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Blog Post
                </Button>
                <Button onClick={() => navigate('/blog-generator')} variant="outline">
                  <Bot className="mr-2 h-4 w-4" />
                  AI Generator
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredPosts.map((post) => (
              <article 
                key={post.id} 
                className="group cursor-pointer"
                onClick={() => handlePostClick(post.slug)}
              >
                <div className="bg-card rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300">
                  {/* Featured Image */}
                  <div className="relative h-48 sm:h-64 overflow-hidden">
                    {post.featured_image_url ? (
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Bot className="h-8 sm:h-12 w-8 sm:w-12 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Delete button for admins/authors */}
                    {(user?.id === post.author_id || isAdmin) && (
                      <button
                        onClick={(e) => handleDeletePost(e, post.id, post.title)}
                        className="absolute top-3 right-3 p-2 bg-destructive/80 text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 sm:p-6">
                    {/* Categories/Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.ai_keywords && Array.isArray(post.ai_keywords) && (
                        post.ai_keywords.slice(0, 2).map((keyword: string, index: number) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="text-xs px-2 py-1"
                          >
                            {keyword}
                          </Badge>
                        ))
                      )}
                    </div>
                    
                    {/* Title */}
                    <h2 className="font-bold text-lg sm:text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    
                    {/* Date */}
                    <time className="text-sm text-muted-foreground">
                      {formatDate(post.published_at)}
                    </time>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Newsletter Signup Section */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <NewsletterSignup />
      </div>
      
      <Footer />
    </div>
  );
};

export default Blog;
