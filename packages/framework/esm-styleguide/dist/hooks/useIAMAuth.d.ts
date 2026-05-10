export interface LoginRequest {
    username: string;
    password: string;
}
export interface LoginResult {
    success: boolean;
    error?: string;
}
export interface Session {
    id: string;
    ipAddress: string;
    start: number;
    lastAccess: number;
    clients: Record<string, string>;
}
export declare function useIAMAuth(): {
    user: import("@egen/esm-auth").CurrentUser;
    isAuthenticated: boolean;
    isLoading: boolean;
    isLoginLoading: boolean;
    loginError: string;
    permissions: string[];
    roles: string[];
    sessionId: string;
    accessToken: string;
    login: (credentials: LoginRequest, redirectTo?: string) => Promise<LoginResult>;
    logout: () => Promise<void>;
    clearLoginError: () => void;
    hasPermission: (permission: string) => boolean;
    hasRole: (role: string) => boolean;
    refreshUser: () => Promise<void>;
};
export declare function useIAMSessions(): {
    sessions: Session[];
    isLoading: boolean;
    error: string;
    currentSessionId: string;
    fetchSessions: () => Promise<void>;
    revokeSession: (sessionId: string) => Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
    }>;
};
export declare function useChangePassword(): {
    isLoading: boolean;
    error: string;
    success: boolean;
    changePassword: (oldPassword: string, newPassword: string) => Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
    }>;
    reset: () => void;
};
export declare function useJournal(limit?: number): {
    entries: Record<string, unknown>[];
    isLoading: boolean;
    error: string;
    refetch: (skip?: number) => Promise<void>;
};
export declare function useAdminResetPassword(): {
    isLoading: boolean;
    error: string;
    success: boolean;
    resetPassword: (userId: string, newPassword: string, temporary?: boolean) => Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
    }>;
    reset: () => void;
};
//# sourceMappingURL=useIAMAuth.d.ts.map