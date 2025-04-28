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
    throw error;
  } else {
    console.log('User signed up successfully:', data);
    const userId = (await supabase.from("profiles").select('*').eq('email', email).single()).data.id;
    authStore.setLoggedIn(userId, data.user);
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
    throw error;
  } else {
    console.log('User logged in successfully:', data);
    const userId = (await supabase.from("profiles").select('*').eq('email', email).single()).data.id;
    authStore.setLoggedIn(userId, data.user);
  }
};