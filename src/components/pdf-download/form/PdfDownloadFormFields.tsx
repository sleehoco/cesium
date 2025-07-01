
import React from 'react';
import { Control } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormValues } from './PdfDownloadFormSchema';

interface PdfDownloadFormFieldsProps {
  control: Control<FormValues>;
}

const PdfDownloadFormFields = ({ control }: PdfDownloadFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
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
          control={control}
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
        control={control}
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
        control={control}
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
        control={control}
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
    </>
  );
};

export default PdfDownloadFormFields;
