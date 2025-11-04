import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,

  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (data.user) {
      set({ user: data.user });
    }

    return { error };
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data.user) {
      set({ user: data.user });
    }

    return { error };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },

  initialize: async () => {
    set({ isLoading: true });

    const { data: { session } } = await supabase.auth.getSession();

    set({ user: session?.user ?? null, isLoading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null });
    });
  },
}));
