
import React from 'react';
import { Shield } from 'lucide-react';

const PdfDownloadFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-blue-600 mr-2" />
            <span className="text-lg font-semibold text-gray-900">CesiumCyber Security</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Advancing technology research and security solutions since 2020
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
  );
};

export default PdfDownloadFooter;
