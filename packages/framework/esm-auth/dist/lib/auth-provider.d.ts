import { type ReactNode } from 'react';
import type { CurrentUser } from '../models/auth.model';
import type { AuthContextType } from '../lib/auth-store.types';
interface AuthProviderProps {
    children: ReactNode;
    autoHydrate?: boolean;
    onLogout?: () => void;
    onLogin?: (user: CurrentUser) => void;
}
declare const AuthContext: import("react").Context<AuthContextType>;
export declare function useAuthContext(): AuthContextType;
export declare function AuthProvider({ children, autoHydrate, onLogout, onLogin }: AuthProviderProps): import("react/jsx-runtime").JSX.Element;
export { AuthContext };
//# sourceMappingURL=auth-provider.d.ts.map