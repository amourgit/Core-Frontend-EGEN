import { create } from 'zustand';
import type { CoreUser, CoreTenant } from '@/types/core';

interface AuthState {
  user:          CoreUser | null;
  tenant:        CoreTenant | null;
  isAuthenticated: boolean;
  isLoading:     boolean;

  setUser:    (user: CoreUser) => void;
  setTenant:  (tenant: CoreTenant) => void;
  logout:     () => void;
  setLoading: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user:            null,
  tenant:          null,
  isAuthenticated: false,
  isLoading:       true,

  setUser: (user) => set({ user, isAuthenticated: true }),
  setTenant: (tenant) => set({ tenant }),
  logout: () => set({ user: null, isAuthenticated: false }),
  setLoading: (v) => set({ isLoading: v }),
}));
