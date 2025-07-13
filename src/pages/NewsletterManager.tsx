import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AdminRoute from '@/components/auth/AdminRoute';
import { ArrowLeft, Send, Save, Users, Mail, Eye, Calendar, Trash2, Edit, Plus } from 'lucide-react';

interface Newsletter {
  id: string;
  title: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent';
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
  subscriber_count: number;
  open_count: number;
  click_count: number;
}

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribed_at: string;
}

const NewsletterManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'newsletters' | 'compose' | 'subscribers'>('newsletters');
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscriberCount, setSubscriberCount] = useState(0);

  // Form state for composing newsletter
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    content: '',
    status: 'draft' as 'draft' | 'scheduled',
    scheduled_at: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [newslettersResult, subscribersResult] = await Promise.all([
        supabase
          .from('newsletters')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('newsletter_subscribers')
          .select('*')
          .eq('status', 'active')
          .order('subscribed_at', { ascending: false })
      ]);

      if (newslettersResult.error) throw newslettersResult.error;
      if (subscribersResult.error) throw subscribersResult.error;

      setNewsletters((newslettersResult.data || []) as Newsletter[]);
      setSubscribers((subscribersResult.data || []) as Subscriber[]);
      setSubscriberCount(subscribersResult.data?.length || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load newsletter data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveNewsletter = async (status: 'draft' | 'sent') => {
    if (!formData.title.trim() || !formData.subject.trim() || !formData.content.trim()) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newsletterData = {
        title: formData.title.trim(),
        subject: formData.subject.trim(),
        content: formData.content.trim(),
        status,
        created_by: user?.id,
        subscriber_count: subscriberCount,
        ...(status === 'sent' && { sent_at: new Date().toISOString() })
      };

      const { data: newsletter, error: insertError } = await supabase
        .from('newsletters')
        .insert(newsletterData)
        .select()
        .single();

      if (insertError) throw insertError;

      if (status === 'sent') {
        // Send the newsletter via edge function
        const { error: sendError } = await supabase.functions.invoke('send-newsletter', {
          body: {
            newsletter_id: newsletter.id,
            subject: formData.subject,
            content: formData.content
          }
        });

        if (sendError) {
          console.error('Error sending newsletter:', sendError);
          toast({
            title: "Send Failed",
            description: "Newsletter was saved but failed to send. Please try again from the newsletters list.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Newsletter Sent!",
            description: `Newsletter sent to ${subscriberCount} subscribers.`,
          });
        }
      } else {
        toast({
          title: "Newsletter Saved",
          description: "Newsletter saved as draft.",
        });
      }

      // Reset form and refresh data
      setFormData({
        title: '',
        subject: '',
        content: '',
        status: 'draft',
        scheduled_at: ''
      });
      fetchData();
      setActiveTab('newsletters');
    } catch (error) {
      console.error('Error saving newsletter:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save newsletter.",
        variant: "destructive",
      });
    }
  };

  const handleSendNewsletter = async (newsletterId: string, subject: string, content: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-newsletter', {
        body: {
          newsletter_id: newsletterId,
          subject,
          content
        }
      });

      if (error) throw error;

      // Update newsletter status
      await supabase
        .from('newsletters')
        .update({ 
          status: 'sent', 
          sent_at: new Date().toISOString(),
          subscriber_count: subscriberCount 
        })
        .eq('id', newsletterId);

      toast({
        title: "Newsletter Sent!",
        description: `Newsletter sent to ${subscriberCount} subscribers.`,
      });

      fetchData();
    } catch (error) {
      console.error('Error sending newsletter:', error);
      toast({
        title: "Send Failed",
        description: "Failed to send newsletter.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNewsletter = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        const { error } = await supabase
          .from('newsletters')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: "Newsletter Deleted",
          description: "Newsletter deleted successfully.",
        });

        fetchData();
      } catch (error) {
        console.error('Error deleting newsletter:', error);
        toast({
          title: "Delete Failed",
          description: "Failed to delete newsletter.",
          variant: "destructive",
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-background">
          <Navbar />
          <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center">Loading...</div>
          </div>
          <Footer />
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/blog')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Newsletter Manager
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                <Users className="mr-1 h-3 w-3" />
                {subscriberCount} Subscribers
              </Badge>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <Button 
              variant={activeTab === 'newsletters' ? 'default' : 'outline'}
              onClick={() => setActiveTab('newsletters')}
            >
              <Mail className="mr-2 h-4 w-4" />
              Newsletters
            </Button>
            <Button 
              variant={activeTab === 'compose' ? 'default' : 'outline'}
              onClick={() => setActiveTab('compose')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Compose
            </Button>
            <Button 
              variant={activeTab === 'subscribers' ? 'default' : 'outline'}
              onClick={() => setActiveTab('subscribers')}
            >
              <Users className="mr-2 h-4 w-4" />
              Subscribers
            </Button>
          </div>

          {/* Content */}
          {activeTab === 'newsletters' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsletters.map((newsletter) => (
                <Card key={newsletter.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{newsletter.title}</CardTitle>
                      <div className="flex gap-1">
                        {newsletter.status === 'draft' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendNewsletter(newsletter.id, newsletter.subject, newsletter.content)}
                          >
                            <Send className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteNewsletter(newsletter.id, newsletter.title)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {newsletter.subject}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <Badge variant={newsletter.status === 'sent' ? 'default' : 'secondary'}>
                        {newsletter.status}
                      </Badge>
                      <span>{formatDate(newsletter.created_at)}</span>
                    </div>
                    {newsletter.status === 'sent' && (
                      <div className="flex items-center justify-between text-xs">
                        <span>Sent to: {newsletter.subscriber_count}</span>
                        <span>Opens: {newsletter.open_count}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'compose' && (
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Compose Newsletter</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Newsletter Title</Label>
                      <Input
                        id="title"
                        placeholder="Internal title for your reference"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Email Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Subject line recipients will see"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="content">Newsletter Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Write your newsletter content here... (Supports basic HTML)"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      rows={15}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      You can use basic HTML tags like &lt;h1&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;, etc.
                    </p>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button
                      onClick={() => handleSaveNewsletter('draft')}
                      variant="outline"
                      className="flex-1"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save as Draft
                    </Button>
                    <Button
                      onClick={() => handleSaveNewsletter('sent')}
                      className="flex-1"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send to {subscriberCount} Subscribers
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'subscribers' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subscriber Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subscribers.map((subscriber) => (
                      <div key={subscriber.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{subscriber.name || 'Anonymous'}</p>
                          <p className="text-sm text-muted-foreground">{subscriber.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Subscribed: {formatDate(subscriber.subscribed_at)}
                          </p>
                        </div>
                        <Badge variant="secondary">{subscriber.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        <Footer />
      </div>
    </AdminRoute>
  );
};

export default NewsletterManager;