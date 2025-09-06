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

// Note: Admin account creation moved to be manually triggered
// This prevents blocking the app startup with async operations