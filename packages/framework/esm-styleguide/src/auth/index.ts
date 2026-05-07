// @egen/esm-styleguide — Auth Components & System
// Auth Pages
export { default as LoginPageContent }           from './LoginPageContent';
export { default as LoginOrbitalAuth }           from './LoginOrbitalAuth';
export { default as LogoutPageContent }          from './LogoutPageContent';
export { default as ForgotPasswordPageContent }  from './ForgotPasswordPageContent';
export { default as ChangePasswordPageContent }  from './ChangePasswordPageContent';
export { default as ComptePageContent }          from './ComptePageContent';
export { default as HabilitationsPageContent }   from './HabilitationsPageContent';
export { default as JournalPageContent }         from './JournalPageContent';
export { default as SecuritePageContent }        from './SecuritePageContent';
export { default as SessionsPageContent }        from './SessionsPageContent';
// Auth UI
export * from './ui/AuthLayout';
export * from './ui/GlassUI';
export * from './ui/AuthNavMenu';
// Auth system
export { AuthProvider, useAuthContext, AuthContext } from './lib/auth-provider';
export type { AuthContextType }                      from './auth-store.types';
export { tokenStore }                                from './auth-store';
// Security
export { tokenManager, userDataStore }               from './security/token-manager';
export { clientCookieManager }                       from './security/cookie-manager';
export { auditLogger }                               from './security/audit-logger';
// Models
export type { CurrentUser, AuthState, LoginResponse, SessionResponse, LoginCredentials } from './models/auth.model';
// Services
export { getSession, logoutAndClean, scheduleTokenRefresh, cancelTokenRefresh } from './services/auth.service';
export { httpClient } from './services/http-client';
