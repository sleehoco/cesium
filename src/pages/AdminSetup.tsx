import React from 'react';
import { Helmet } from 'react-helmet';
import CreateAdminAccount from '@/components/admin/CreateAdminAccount';
import BackgroundAnimations from '@/components/utils/BackgroundAnimations';

const AdminSetup = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Helmet>
        <title>Admin Setup - CesiumCyber Security</title>
        <meta name="description" content="Create admin accounts for CesiumCyber Security platform." />
      </Helmet>
      
      <BackgroundAnimations />
      
      <div className="relative z-10 w-full">
        <CreateAdminAccount />
      </div>
    </div>
  );
};

export default AdminSetup;