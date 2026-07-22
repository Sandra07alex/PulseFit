// Authentication store
import { create } from 'zustand';
import { AuthState, User } from '~/types';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  logout: () =>
    set({
      isAuthenticated: false,
      user: null,
      error: null,
    }),
}));
