import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [isSetNewPassword, setIsSetNewPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, resetPassword, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check for password reset confirmation FIRST (before redirect logic)
  useEffect(() => {
    const type = searchParams.get('type');
    const accessToken = searchParams.get('access_token');
    
    if (type === 'recovery' && accessToken) {
      setIsSetNewPassword(true);
      setIsResetPassword(false);
    }
  }, [searchParams]);

  // Redirect if already logged in (but NOT during password reset)
  useEffect(() => {
    const type = searchParams.get('type');
    const accessToken = searchParams.get('access_token');
    const isPasswordReset = type === 'recovery' && accessToken;
    
    if (user && !isPasswordReset && !isSetNewPassword) {
      navigate('/');
    }
  }, [user, navigate, isSetNewPassword, searchParams]);

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
    <div className="min-h-screen flex">
      <Helmet>
        <title>
          {isSetNewPassword ? 'Set New Password' : (isResetPassword ? 'Reset Password' : 'Sign In')} - CesiumCyber Security
        </title>
        <meta name="description" content="Access your CesiumCyber Security account to manage your cybersecurity services." />
      </Helmet>
      
      {/* Left Panel - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-600 to-blue-600 opacity-90">
          {/* Animated waves */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
            <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-2000"></div>
            <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-4000"></div>
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 text-sm font-medium bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
              A WISE CHOICE
            </span>
          </div>
          
          <h1 className="text-6xl font-bold leading-tight mb-6">
            Get<br />
            Everything<br />
            You Want
          </h1>
          
          <p className="text-xl text-white/80 mb-8 max-w-md">
            Secure your digital world with enterprise-grade cybersecurity solutions designed for the modern business.
          </p>
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-2xl">🛡️</span>
            </div>
            <div>
              <p className="font-medium">Advanced Protection</p>
              <p className="text-sm text-white/70">24/7 Security Monitoring</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🔒</span>
              </div>
            </div>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isSetNewPassword ? 'Set New Password' : (isResetPassword ? 'Reset Password' : 'Welcome Back')}
            </h2>
            <p className="text-gray-600">
              {isSetNewPassword
                ? 'Enter your new password below'
                : (isResetPassword
                  ? 'Enter your email address and we\'ll send you a password reset link'
                  : 'Enter your email and password to access your account')
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!isSetNewPassword && (
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            )}

            {(!isResetPassword || isSetNewPassword) && (
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  {isSetNewPassword ? 'New Password' : 'Password'}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={isSetNewPassword ? 'Enter your new password' : 'Enter your password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {isSetNewPassword && (
                  <p className="text-xs text-gray-500 mt-1">
                    Password should be at least 6 characters long
                  </p>
                )}
              </div>
            )}

            {isSetNewPassword && (
              <div>
                <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}

            {!isResetPassword && !isSetNewPassword && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsResetPassword(true);
                    setError('');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Forgot Password
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Please wait...' : (
                isSetNewPassword ? 'Update Password' : (isResetPassword ? 'Send Reset Link' : 'Sign In')
              )}
            </Button>


            {(isResetPassword || isSetNewPassword) && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetPassword(false);
                    setIsSetNewPassword(false);
                    setError('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  ← Back to Sign In
                </button>
              </div>
            )}
          </form>

          <div className="mt-8 text-center">
            <Link 
              to="/" 
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;