import { create } from 'zustand';
export const useAuthStore = create((set) => ({
    user: null,
    tenant: null,
    isAuthenticated: false,
    isLoading: true,
    setUser: (user) => set({ user, isAuthenticated: true }),
    setTenant: (tenant) => set({ tenant }),
    logout: () => set({ user: null, isAuthenticated: false }),
    setLoading: (v) => set({ isLoading: v }),
}));
//# sourceMappingURL=auth.store.js.map