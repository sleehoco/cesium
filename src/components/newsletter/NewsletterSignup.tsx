import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, CheckCircle } from 'lucide-react';

interface NewsletterSignupProps {
  className?: string;
  compact?: boolean;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ className = '', compact = false }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: email.trim().toLowerCase(),
          name: name.trim() || null,
          status: 'active'
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already Subscribed",
            description: "This email is already subscribed to our newsletter.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      setIsSubscribed(true);
      toast({
        title: "Successfully Subscribed!",
        description: "Welcome to our newsletter. You'll receive our latest updates and insights.",
      });

      // Reset form
      setEmail('');
      setName('');
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast({
        title: "Subscription Failed",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed && compact) {
    return (
      <div className={`text-center ${className}`}>
        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Thanks for subscribing!</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={className}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="newsletter-email" className="sr-only">Email address</Label>
            <Input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            <Mail className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Subscribe to Our Newsletter
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isSubscribed ? (
          <div className="text-center py-6">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Successfully Subscribed!</h3>
            <p className="text-muted-foreground">
              Thank you for subscribing to our newsletter. You'll receive our latest cybersecurity insights and updates.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="subscriber-name">Name (Optional)</Label>
              <Input
                id="subscriber-name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="subscriber-email">Email Address *</Label>
              <Input
                id="subscriber-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              <Mail className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Get the latest cybersecurity insights, tips, and industry updates delivered to your inbox.
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsletterSignup;