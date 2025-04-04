import { supabase } from './supabase';

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    console.error('Error signing up:', error.message);
  } else {
    console.log('User signed up successfully:', data);
  }
};

export const logIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.error('Error logging in:', error.message);
  } else {
    console.log('User logged in successfully:', data);
  }
};
