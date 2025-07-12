import { supabase } from '@/integrations/supabase/client';

export const createAdminAccount = async (email: string, firstName: string = 'Admin', lastName: string = 'User') => {
  try {
    const { data, error } = await supabase.functions.invoke('create-admin-account', {
      body: {
        email,
        firstName,
        lastName
      }
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating admin account:', error);
    throw error;
  }
};

// Auto-execute to create the admin account
if (typeof window !== 'undefined') {
  // Only run in browser environment
  createAdminAccount('slee@sent.com', 'Admin', 'User')
    .then((result) => {
      console.log('Admin account creation result:', result);
    })
    .catch((error) => {
      console.error('Failed to create admin account:', error);
    });
}