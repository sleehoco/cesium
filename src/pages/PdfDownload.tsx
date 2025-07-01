
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CheckCircle, Download, Shield, Users, TrendingUp, FileText } from 'lucide-react';
import MetaTags from '../components/utils/MetaTags';

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  company: z.string().optional(),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PdfDownload = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      phone: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      // Store form submission in localStorage
      const submissions = JSON.parse(localStorage.getItem('pdfDownloads') || '[]');
      const newSubmission = {
        ...values,
        timestamp: new Date().toISOString(),
        id: Date.now().toString(),
      };
      submissions.push(newSubmission);
      localStorage.setItem('pdfDownloads', JSON.stringify(submissions));

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Trigger PDF download
      const link = document.createElement('a');
      link.href = '/cybersecurity-guide.pdf'; // This would be your actual PDF path
      link.download = 'CesiumCyber-Security-Guide.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <MetaTags 
          title="Thank You - CesiumCyber Security Guide Downloaded"
          description="Thank you for downloading our comprehensive cybersecurity guide."
        />
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
            <p className="text-gray-600">
              Your download should start automatically. If it doesn't, please check your downloads folder.
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              We've also sent a copy to your email address for future reference.
            </p>
          </div>

          <Button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <MetaTags 
        title="Free Cybersecurity Guide - CesiumCyber Security"
        description="Download our comprehensive cybersecurity guide with essential tips to protect your business from cyber threats."
        keywords="cybersecurity guide, security tips, business protection, free download"
      />
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <span className="text-2xl font-bold text-gray-900">CesiumCyber</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-8">
            <FileText className="h-20 w-20 text-blue-600 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Essential Cybersecurity Guide for Modern Businesses
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get your free comprehensive guide packed with actionable insights to protect your business from cyber threats in 2024.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Threat Prevention</h3>
              <p className="text-gray-600 text-sm">Learn the latest techniques to identify and prevent cyber attacks before they happen.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Training</h3>
              <p className="text-gray-600 text-sm">Discover how to build a security-conscious culture within your organization.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Growth</h3>
              <p className="text-gray-600 text-sm">Understand how robust security measures can accelerate your business growth.</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Download Your Free Guide</h2>
            <p className="text-gray-600">Enter your details below to get instant access</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">First Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John" 
                          {...field}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Last Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Doe" 
                          {...field}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Email Address *</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="john@company.com" 
                        {...field}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Company Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your Company" 
                        {...field}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        type="tel"
                        placeholder="+1 (555) 123-4567" 
                        {...field}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Download className="h-5 w-5 mr-2" />
                    Get Free Guide
                  </div>
                )}
              </Button>
            </form>
          </Form>

          <p className="text-xs text-gray-500 text-center mt-4">
            By downloading, you agree to receive occasional emails about cybersecurity insights. Unsubscribe anytime.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-blue-600 mr-2" />
              <span className="text-lg font-semibold text-gray-900">CesiumCyber Security</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Protecting businesses from cyber threats since 2020
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500">
              <span>📧 information@cesiumcyber.com</span>
              <span>📞 (301) 531-5670</span>
              <span>📍 Columbia, MD</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-400">
                © 2024 CesiumCyber Security. All rights reserved. | 
                <button className="ml-1 hover:text-gray-600">Privacy Policy</button> | 
                <button className="ml-1 hover:text-gray-600">Terms of Service</button>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PdfDownload;
