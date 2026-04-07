import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

const SendAdminEmail = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const sendEmail = async () => {
    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      console.log('Calling create-admin-account function...');
      
      const { data, error } = await supabase.functions.invoke('create-admin-account', {
        body: {
          email: 'rock@noahella.com',
          firstName: 'Admin',
          lastName: 'User'
        }
      });

      console.log('Function response:', { data, error });

      if (error) {
        throw error;
      }

      if (data?.success) {
        setStatus('success');
        if (data?.alreadyAdmin) {
          setMessage(`User rock@noahella.com already has admin access.`);
        } else if (data?.grantedAccess) {
          setMessage(`Existing user rock@noahella.com has been granted admin access and notified via email.`);
        } else {
          setMessage('Admin account created and email sent successfully to rock@noahella.com');
        }
      } else {
        throw new Error(data?.error || 'Unknown error occurred');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send email';
      console.error('Error sending email:', error);
      setStatus('error');
      setMessage(message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-trigger on component mount
  useEffect(() => {
    sendEmail();
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Sending Admin Account Email</h2>
        <p className="text-muted-foreground">Creating admin account for rock@noahella.com</p>
      </div>

      {status === 'success' && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {message}
          </AlertDescription>
        </Alert>
      )}

      {status === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {message}
          </AlertDescription>
        </Alert>
      )}

      <Button 
        onClick={sendEmail} 
        disabled={loading}
        className="w-full"
      >
        <Mail className="h-4 w-4 mr-2" />
        {loading ? 'Sending Email...' : 'Send Admin Account Email'}
      </Button>
    </div>
  );
};

export default SendAdminEmail;
