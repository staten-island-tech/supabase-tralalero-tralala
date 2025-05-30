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
    const userId = (await supabase.from("profiles").select('*').eq('email', credentials.email.toLowerCase()).single()).data.id;
    authStore.setLoggedIn(userId, data.user);
  }

  if (data.session && data.user) {
    const loginResponse: LoginResponse = {
      user: {
        id: data.user.id,
        email: data.user.email ?? '',
        balance: 0,
        stocks: []
      },
      token: data.session.access_token,
    };
    authStore.setLoggedIn(data.user.id, data.session.access_token);
    return loginResponse;
  } else {
    throw new Error('Session data is null');
  }
 

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
    const userId = (await supabase.from("profiles").select('*').eq('email', credentials.email.toLowerCase()).single()).data.id;
    authStore.setLoggedIn(userId, data.user);
  }

  if (data.session && data.user) {
    const loginResponse: LoginResponse = {
      user: {
        id: data.user.id,
        email: data.user.email ?? '',
        balance: 0,
        stocks: []
      },
      token: data.session.access_token,
    };
    authStore.setLoggedIn(data.user.id, data.session.access_token);
    return loginResponse;
  } else {
    throw new Error('Session data is null');
  }
  
};
