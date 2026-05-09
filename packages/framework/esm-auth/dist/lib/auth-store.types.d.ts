import type { CurrentUser, AuthState } from '../models/auth.model';
export interface AuthContextType extends AuthState {
    login: (accessToken: string, sessionId: string, user: CurrentUser, permissions: string[], roles: string[]) => Promise<void>;
    logout: (callApi?: boolean) => Promise<void>;
    hasPermission: (permission: string) => boolean;
    hasRole: (role: string) => boolean;
    refreshUser: () => Promise<void>;
}
//# sourceMappingURL=auth-store.types.d.ts.map