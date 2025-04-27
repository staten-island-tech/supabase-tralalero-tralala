import { supabase } from './supabase';
import { useAuthStore } from './stores/authStore';
import type { LoginRequest, LoginResponse } from './types/types';

export const signUp = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
  });

  const authStore = useAuthStore();

  if (error || !data.session || !data.user) {
    console.error('Error signing up:', error?.message);
    throw new Error(error?.message || 'Unknown sign-up error');
  }

  const loginResponse: LoginResponse = {
    user: data.user,
    token: data.session.access_token,
  };

  authStore.setLoggedIn(loginResponse);

  return loginResponse;
};

export const logIn = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  const authStore = useAuthStore();

  if (error || !data.session || !data.user) {
    console.error('Error logging in:', error?.message);
    throw new Error(error?.message || 'Unknown login error');
  }

  const loginResponse: LoginResponse = {
    user: data.user,
    token: data.session.access_token,
  };

  authStore.setLoggedIn(loginResponse);

  return loginResponse;
};
