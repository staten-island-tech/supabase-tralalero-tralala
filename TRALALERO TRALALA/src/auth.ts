import { supabase } from './supabase';
import { useAuthStore } from './stores/authStore';
import type { LoginRequest, LoginResponse } from './types/types';
import App from './App.vue';

export const signUp = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
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

  if (data.session && data.user) {
    const loginResponse: LoginResponse = {
      user: {
        id: data.user.id,
        email: data.user.email ?? '',
      },
      token: data.session.access_token,
    };
  } else {
    throw new Error('Session data is null');
  }
  

  if (data.session && data.user) {
    authStore.setLoggedIn(data.user.id, data.session.access_token);
  } else {
    throw new Error('Session data is null');
  }

  if (data.session && data.user) {
    authStore.setLoggedIn(data.user.id, data.session.access_token);
  } else {
    throw new Error('Session data is null');
  }

  return loginResponse;
};

export const logIn = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
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

  const loginResponse: LoginResponse = {
    user: data.user,
    token: data.session.access_token,
  };

  if (data.session && data.user) {
    authStore.setLoggedIn(data.user.id, data.session.access_token);
  } else {
    throw new Error('Session data is null');
  }

  return loginResponse;
};
