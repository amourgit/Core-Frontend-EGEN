export { useAuthContext, AuthContext, AuthProvider } from '../lib/auth-provider';
export type { AuthContextType } from '../lib/auth-store.types';
import type { CurrentUser } from '../models/auth.model';
export declare const tokenStore: {
    setTokens(accessToken: string, _refreshToken: string, sessionId?: string): void;
    setUser(user: CurrentUser): void;
    setPermissionsAndRoles(p: string[], r: string[]): void;
    getAccessToken(): string | null;
    getRefreshToken(): null;
    getSessionId(): string | null;
    getUser(): CurrentUser | null;
    getPermissions(): string[];
    getRoles(): string[];
    hasValidSession(): boolean;
    clear(): void;
};
//# sourceMappingURL=auth-store.d.ts.map