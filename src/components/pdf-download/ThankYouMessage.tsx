
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ThankYouMessage = () => {
  return (
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
  );
};

export default ThankYouMessage;
