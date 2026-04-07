import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { CheckCircle, Loader2 } from 'lucide-react';

const requestSchema = z.object({
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  companyName: z.string().optional(),
  phoneNumber: z.string().optional(),
  reason: z.string().min(10, 'Please provide a reason (at least 10 characters)'),
});

type FormValues = z.infer<typeof requestSchema>;

interface RequestAccessFormProps {
  onAccessGranted: (accessKey: string) => void;
}

const RequestAccessForm = ({ onAccessGranted: _onAccessGranted }: RequestAccessFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      email: '',
      fullName: '',
      companyName: '',
      phoneNumber: '',
      reason: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('policy_generator_access_requests')
        .insert({
          email: values.email,
          full_name: values.fullName,
          company_name: values.companyName || null,
          phone_number: values.phoneNumber || null,
          reason: values.reason,
        });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success('Access request submitted successfully! We\'ll review your request and get back to you soon.');
    } catch (error) {
      console.error('Error submitting access request:', error);
      toast.error('Failed to submit access request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-primary mx-auto" />
            <h3 className="text-xl font-semibold">Request Submitted!</h3>
            <p className="text-muted-foreground">
              Thank you for your interest in our AI Policy Generator. We'll review your request and send you an access key or 7-day trial access within 24-48 hours.
            </p>
            <p className="text-sm text-muted-foreground">
              Please check your email at <strong>{form.getValues('email')}</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Request Access</CardTitle>
        <CardDescription>
          Fill out this form to request access to the AI Policy Generator. We'll review your request and provide you with an access key or 7-day trial.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              placeholder="your@email.com"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              {...form.register('fullName')}
              placeholder="John Doe"
            />
            {form.formState.errors.fullName && (
              <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name (Optional)</Label>
            <Input
              id="companyName"
              {...form.register('companyName')}
              placeholder="Your Company"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
            <Input
              id="phoneNumber"
              type="tel"
              {...form.register('phoneNumber')}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Why do you need access? *</Label>
            <Textarea
              id="reason"
              {...form.register('reason')}
              placeholder="Please describe your use case and why you need access to the policy generator..."
              rows={4}
            />
            {form.formState.errors.reason && (
              <p className="text-sm text-destructive">{form.formState.errors.reason.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RequestAccessForm;
