
import React from 'react';
import { Shield } from 'lucide-react';

const PdfDownloadHeader = () => {
  return (
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
  );
};

export default PdfDownloadHeader;
