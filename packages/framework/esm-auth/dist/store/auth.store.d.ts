import type { CoreUser, CoreTenant } from '../types';
interface AuthState {
    user: CoreUser | null;
    tenant: CoreTenant | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: CoreUser) => void;
    setTenant: (tenant: CoreTenant) => void;
    logout: () => void;
    setLoading: (v: boolean) => void;
}
export declare const useAuthStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AuthState>>;
export {};
//# sourceMappingURL=auth.store.d.ts.map