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
    user: any;
    isAuthenticated: any;
    isLoading: any;
    isLoginLoading: boolean;
    loginError: string;
    permissions: any;
    roles: any;
    sessionId: any;
    accessToken: any;
    login: (credentials: LoginRequest, redirectTo?: string) => Promise<LoginResult>;
    logout: () => Promise<void>;
    clearLoginError: () => void;
    hasPermission: any;
    hasRole: any;
    refreshUser: any;
};
export declare function useIAMSessions(): {
    sessions: Session[];
    isLoading: boolean;
    error: string;
    currentSessionId: any;
    fetchSessions: () => Promise<void>;
    revokeSession: (sessionId: string) => Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
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
        error: any;
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
        error: any;
    }>;
    reset: () => void;
};
//# sourceMappingURL=useIAMAuth.d.ts.map