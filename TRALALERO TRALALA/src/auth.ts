import { supabase } from './supabase';
import { useAuthStore } from './stores/authStore';

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  const authStore = useAuthStore();

  if (error) {
    console.error('Error signing up:', error.message);
  } else {
    console.log('User signed up successfully:', data);
    authStore.setLoggedIn(data.user);
  }
};

export const logIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  const authStore = useAuthStore();
  
  if (error) {
    console.error('Error logging in:', error.message);
  } else {
    console.log('User logged in successfully:', data);
    authStore.setLoggedIn(data.user);
  }
};