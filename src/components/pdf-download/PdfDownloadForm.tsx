
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Download } from 'lucide-react';

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  company: z.string().optional(),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PdfDownloadFormProps {
  onSubmitSuccess: () => void;
}

const PdfDownloadForm = ({ onSubmitSuccess }: PdfDownloadFormProps) => {
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

      // Trigger PDF download using your Google Drive file
      const link = document.createElement('a');
      link.href = 'https://drive.google.com/uc?export=download&id=1PFcwDCMNh0yMXgWfD321zHcXuSBoadRT';
      link.download = 'AI-Quantum-Computing-Business-Review.pdf';
      link.target = '_blank'; // Open in new tab as fallback
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onSubmitSuccess();
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Download Your Research Paper</h2>
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
                Get Research Paper
              </div>
            )}
          </Button>
        </form>
      </Form>

      <p className="text-xs text-gray-500 text-center mt-4">
        By downloading, you agree to receive occasional emails about technology research insights. Unsubscribe anytime.
      </p>
    </div>
  );
};

export default PdfDownloadForm;
