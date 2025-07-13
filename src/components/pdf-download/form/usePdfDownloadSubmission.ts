
import { useState } from 'react';
import { FormValues } from './PdfDownloadFormSchema';

export const usePdfDownloadSubmission = (onSubmitSuccess: () => void) => {
  const [isLoading, setIsLoading] = useState(false);

  const submitForm = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      // SECURITY: Removed localStorage storage of form data for privacy/security
      // Form data should only be stored server-side with proper security controls

      // Send email notification with form details
      try {
        const emailData = {
          name: `${values.firstName} ${values.lastName}`,
          email: values.email,
          company: values.company || 'Not provided',
          message: `PDF Download Request - AI Meets Quantum Computing Research Paper

Contact Details:
- Name: ${values.firstName} ${values.lastName}
- Email: ${values.email}
- Company: ${values.company || 'Not provided'}
- Phone: ${values.phone || 'Not provided'}
- Download Time: ${new Date().toLocaleString()}

This person has requested to download the AI Meets Quantum Computing Business Review research paper.`,
          recipient: 'jmorrison@cesiumcyber.com'
        };

        console.log('Sending email notification with data:', emailData);

        const emailResponse = await fetch('https://rxlpulfotwjizohyfulc.supabase.co/functions/v1/send-contact-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        });

        const emailResult = await emailResponse.json();
        console.log('Email notification result:', emailResult);
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't block the download if email fails
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Trigger PDF download using your updated Google Drive file
      const link = document.createElement('a');
      link.href = 'https://drive.google.com/uc?export=download&id=1E-fiHdHN9WmO-fz4z5TzbbTRCLMjdEOn';
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

  return { submitForm, isLoading };
};
