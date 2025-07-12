import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Mail, User, CheckCircle } from 'lucide-react';

const CreateAdminAccount = () => {
  const [email, setEmail] = useState('slee@sent.com');
  const [firstName, setFirstName] = useState('Admin');
  const [lastName, setLastName] = useState('User');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const { data, error } = await supabase.functions.invoke('create-admin-account', {
        body: {
          email,
          firstName,
          lastName
        }
      });

      if (error) throw error;

      if (data.success) {
        setSuccess(true);
        toast({
          title: "Admin Account Created!",
          description: `Account created for ${email}. Credentials sent via email.`,
        });
        
        // Reset form
        setEmail('');
        setFirstName('');
        setLastName('');
      } else {
        throw new Error(data.error || 'Failed to create admin account');
      }
    } catch (error: any) {
      console.error('Error creating admin account:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to create admin account',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="rounded-full bg-green-500/20 p-3 mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Account Created!</h2>
          <p className="text-muted-foreground mb-4">
            Admin account has been created and credentials have been sent to the specified email address.
          </p>
          <Button onClick={() => setSuccess(false)}>
            Create Another Account
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-2">
        <div className="flex items-center justify-center mb-4">
          <UserPlus className="h-8 w-8 text-primary mr-2" />
          <span className="text-2xl font-bold">Create Admin Account</span>
        </div>
        <CardTitle className="text-xl">Create New Admin User</CardTitle>
        <CardDescription>
          This will create a new admin account and send the login credentials via email.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleCreateAccount} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>
          
          <Alert>
            <AlertDescription>
              A secure temporary password will be generated and sent to the specified email address. 
              The user should change their password after first login.
            </AlertDescription>
          </Alert>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Admin Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateAdminAccount;