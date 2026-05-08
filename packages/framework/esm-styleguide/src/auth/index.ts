// ============================================================
// @egen/esm-styleguide — Auth UI Components
//
// ⚠️  Core auth logic lives in @egen/esm-auth.
//     This module exports only UI pages & layouts.
//     Import hooks, stores, security from @egen/esm-auth.
// ============================================================

// ── Auth UI Pages ────────────────────────────────────────────
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

// ── Auth UI Layouts ──────────────────────────────────────────
export * from './ui/AuthLayout';
export * from './ui/GlassUI';
export * from './ui/AuthNavMenu';

// ── Re-exports from @egen/esm-auth (single source of truth) ──
export {
  AuthProvider,
  useAuthContext,
  AuthContext,
  useAuth,
  useIAMAuth,
  usePermissions,
  useKeycloakSession,
  useSessionMonitor,
  useAuthStore,
} from '@egen/esm-auth';
export type { AuthContextType, CurrentUser, AuthState } from '@egen/esm-auth';
