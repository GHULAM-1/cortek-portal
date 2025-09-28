import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/users/users-types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({
        user,
        isAuthenticated: !!user
      }),
      clearUser: () => set({
        user: null,
        isAuthenticated: false
      }),
    }),
    {
      name: 'currentUser',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);