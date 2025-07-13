import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Lock, Mail, User, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import BackgroundAnimations from '@/components/utils/BackgroundAnimations';
import SendAdminEmail from '@/components/admin/SendAdminEmail';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isSetNewPassword, setIsSetNewPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, signUp, resetPassword, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check for password reset confirmation
  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'recovery') {
      setIsSetNewPassword(true);
      setIsResetPassword(false);
      setIsSignUp(false);
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isSetNewPassword) {
      navigate('/');
    }
  }, [user, navigate, isSetNewPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSetNewPassword) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const { error } = await supabase.auth.updateUser({
          password: password
        });

        if (error) {
          setError(error.message);
        } else {
          toast({
            title: "Password updated successfully!",
            description: "You can now sign in with your new password.",
          });
          setIsSetNewPassword(false);
          setPassword('');
          setConfirmPassword('');
          navigate('/');
        }
      } else if (isResetPassword) {
        const { error } = await resetPassword(email);
        
        if (error) {
          setError(error.message);
        } else {
          toast({
            title: "Password reset email sent!",
            description: "Please check your email for password reset instructions.",
          });
          setIsResetPassword(false);
          setEmail('');
        }
      } else if (isSignUp) {
        const { error } = await signUp(email, password, firstName, lastName);
        
        if (error) {
          if (error.message.includes('User already registered')) {
            setError('An account with this email already exists. Please sign in instead.');
          } else if (error.message.includes('Password should be at least')) {
            setError('Password should be at least 6 characters long.');
          } else {
            setError(error.message);
          }
        } else {
          toast({
            title: "Account created successfully!",
            description: "Please check your email to verify your account.",
          });
          // Switch to sign in after successful signup
          setIsSignUp(false);
          setFirstName('');
          setLastName('');
        }
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('Invalid email or password. Please check your credentials and try again.');
          } else {
            setError(error.message);
          }
        } else {
          toast({
            title: "Welcome back!",
            description: "You have been signed in successfully.",
          });
          navigate('/');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Helmet>
        <title>{isSignUp ? 'Sign Up' : 'Sign In'} - CesiumCyber Security</title>
        <meta name="description" content="Access your CesiumCyber Security account to manage your cybersecurity services." />
      </Helmet>
      
      <BackgroundAnimations />
      
      <div className="relative z-10 w-full max-w-md">
        <SendAdminEmail />
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-primary mr-2" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                CesiumCyber
              </span>
            </div>
            <CardTitle className="text-2xl">
              {isSetNewPassword ? 'Set New Password' : (isResetPassword ? 'Reset Password' : (isSignUp ? 'Create Account' : 'Welcome Back'))}
            </CardTitle>
            <CardDescription>
              {isSetNewPassword
                ? 'Enter your new password below'
                : (isResetPassword
                  ? 'Enter your email address and we\'ll send you a password reset link'
                  : (isSignUp 
                    ? 'Join CesiumCyber to access advanced security tools' 
                    : 'Sign in to your CesiumCyber account'))
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {!isResetPassword && !isSetNewPassword && isSignUp && (
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
                        required={isSignUp}
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
                        required={isSignUp}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {!isSetNewPassword && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}
              
              {(!isResetPassword || isSetNewPassword) && (
                <div className="space-y-2">
                  <Label htmlFor="password">{isSetNewPassword ? 'New Password' : 'Password'}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={isSetNewPassword ? 'Enter your new password' : (isSignUp ? 'Create a strong password' : 'Enter your password')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {(isSignUp || isSetNewPassword) && (
                    <p className="text-xs text-muted-foreground">
                      Password should be at least 6 characters long
                    </p>
                  )}
                </div>
              )}

              {isSetNewPassword && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Please wait...' : (
                  isSetNewPassword ? 'Update Password' : (isResetPassword ? 'Send Reset Link' : (isSignUp ? 'Create Account' : 'Sign In'))
                )}
              </Button>
              
              {!isResetPassword && !isSignUp && !isSetNewPassword && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetPassword(true);
                      setError('');
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
            </form>
            
            <div className="mt-6">
              <Separator />
              {!isSetNewPassword && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    {isResetPassword ? 'Remember your password?' : (isSignUp ? 'Already have an account?' : "Don't have an account?")}
                    {' '}
                    <button
                      type="button"
                      onClick={() => {
                        if (isResetPassword) {
                          setIsResetPassword(false);
                          setIsSignUp(false);
                        } else {
                          setIsSignUp(!isSignUp);
                        }
                        setError('');
                        setFirstName('');
                        setLastName('');
                        setEmail('');
                        setPassword('');
                        setConfirmPassword('');
                      }}
                      className="text-primary hover:underline font-medium"
                    >
                      {isResetPassword ? 'Sign in' : (isSignUp ? 'Sign in' : 'Sign up')}
                    </button>
                  </p>
                </div>
              )}
              
              <div className="mt-4 text-center">
                <Link 
                  to="/" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;