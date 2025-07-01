
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { formSchema, FormValues } from './form/PdfDownloadFormSchema';
import { usePdfDownloadSubmission } from './form/usePdfDownloadSubmission';
import PdfDownloadFormFields from './form/PdfDownloadFormFields';
import PdfDownloadSubmitButton from './form/PdfDownloadSubmitButton';

interface PdfDownloadFormProps {
  onSubmitSuccess: () => void;
}

const PdfDownloadForm = ({ onSubmitSuccess }: PdfDownloadFormProps) => {
  const { submitForm, isLoading } = usePdfDownloadSubmission(onSubmitSuccess);

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

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Download Your Research Paper</h2>
        <p className="text-gray-600">Enter your details below to get instant access</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-4">
          <PdfDownloadFormFields control={form.control} />
          <PdfDownloadSubmitButton isLoading={isLoading} />
        </form>
      </Form>

      <p className="text-xs text-gray-500 text-center mt-4">
        By downloading, you agree to receive occasional emails about technology research insights. Unsubscribe anytime.
      </p>
    </div>
  );
};

export default PdfDownloadForm;
