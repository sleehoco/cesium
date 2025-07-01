
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface PdfDownloadSubmitButtonProps {
  isLoading: boolean;
}

const PdfDownloadSubmitButton = ({ isLoading }: PdfDownloadSubmitButtonProps) => {
  return (
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
  );
};

export default PdfDownloadSubmitButton;
