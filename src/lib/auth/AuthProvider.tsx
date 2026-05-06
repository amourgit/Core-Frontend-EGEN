// ============================================================
// lib/auth/AuthProvider.tsx
// Provider React d'authentification — Source de vérité auth du Core.
//
// Responsabilités :
//  1. Hydrater la session au montage (via GET /api/auth/session)
//  2. Exposer login / logout / hasPermission / hasRole
//  3. Synchroniser l'AuthStore Zustand ← toujours à jour
//  4. Planifier le refresh auto 60 s avant expiration
//  5. Notifier les modules via coreContext (via IAMModule)
//
// Usage :
//   <AuthProvider>
//     <App />
//   </AuthProvider>
//
//   const { user, login, logout } = useAuthContext();
// ============================================================

import {
  createContext, useContext, useEffect, useRef,
  useState, useCallback, ReactNode,
} from 'react';

import type { CurrentUser } from '@/lib/models/iam/auth.model';
import type { AuthContextType } from '@/lib/auth-store';
import { authService, scheduleTokenRefresh, cancelTokenRefresh } from './authService';
import { tokenManager, userDataStore } from '@/lib/security/token-manager';
import { useAuthStore } from '@/stores/auth.store';

// ── Types ─────────────────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode;
  /** Activer l'hydratation de session au montage (défaut: true) */
  autoHydrate?: boolean;
  /** Callback appelé après un logout (ex: redirect /login) */
  onLogout?: () => void;
  /** Callback appelé après un login réussi */
  onLogin?: (user: CurrentUser) => void;
}

// ── Context ───────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext);
  // Retourne un contexte par défaut si pas de provider (pas d'erreur)
  if (!ctx) {
    return {
      accessToken:     null,
      refreshToken:    null,
      sessionId:       null,
      user:            null,
      isAuthenticated: false,
      isLoading:       false,
      permissions:     [],
      roles:           [],
      login:           async () => {},
      logout:          async () => {},
      hasPermission:   () => false,
      hasRole:         () => false,
      refreshUser:     async () => {},
    };
  }
  return ctx;
}

// ── Provider ──────────────────────────────────────────────────

export function AuthProvider({
  children,
  autoHydrate = true,
  onLogout,
  onLogin,
}: AuthProviderProps) {
  // Sync vers le store Zustand (pour les composants qui n'ont pas accès au contexte)
  const { setUser, setTenant, logout: storeLogout, setLoading } = useAuthStore();

  const [state, setState] = useState<{
    user:            CurrentUser | null;
    accessToken:     string | null;
    sessionId:       string | null;
    isAuthenticated: boolean;
    isLoading:       boolean;
    permissions:     string[];
    roles:           string[];
  }>({
    user:            null,
    accessToken:     null,
    sessionId:       null,
    isAuthenticated: false,
    isLoading:       autoHydrate,
    permissions:     [],
    roles:           [],
  });

  const initialized = useRef(false);

  // ── Helpers ─────────────────────────────────────────────────

  /** Synchronise l'état interne → store Zustand */
  const syncToStore = useCallback((
    user: CurrentUser | null,
    accessToken: string | null,
    permissions: string[],
    roles: string[],
  ) => {
    if (user && accessToken) {
      setUser({
        id:        user.id,
        username:  user.username,
        email:     user.email,
        prenom:    user.prenom,
        nom:       user.nom,
        roles:     roles,
        token:     accessToken,
        tenantId:  user.tenantId ?? 'default',
        avatarUrl: user.avatarUrl,
      });
      userDataStore.setUser(user);
      userDataStore.setPermissionsAndRoles(permissions, roles);
    } else {
      storeLogout();
      userDataStore.clear();
    }
    setLoading(false);
  }, [setUser, storeLogout, setLoading]);

  // ── Hydratation session ──────────────────────────────────────

  useEffect(() => {
    if (initialized.current || !autoHydrate) {
      if (!autoHydrate) setLoading(false);
      return;
    }
    initialized.current = true;

    const hydrate = async () => {
      try {
        const session = await authService.getSession();

        if (session.authenticated && session.user && session.accessToken) {
          const user        = session.user;
          const accessToken = session.accessToken;
          const permissions = session.permissions ?? [];
          const roles       = session.roles ?? [];
          const sessionId   = session.sessionId ?? null;

          setState({
            user, accessToken, sessionId,
            isAuthenticated: true,
            isLoading: false,
            permissions, roles,
          });

          syncToStore(user, accessToken, permissions, roles);

          // Planifier le refresh auto
          scheduleTokenRefresh(() => {
            const newToken = tokenManager.getAccessToken();
            if (newToken) {
              setState(prev => ({ ...prev, accessToken: newToken }));
            }
          });
        } else {
          // Pas de session valide → tenter de restaurer depuis userDataStore
          const cachedUser = userDataStore.getUser<CurrentUser>();
          if (cachedUser && tokenManager.hasValidToken()) {
            const accessToken = tokenManager.getAccessToken()!;
            const permissions = userDataStore.getPermissions();
            const roles       = userDataStore.getRoles();
            setState({
              user: cachedUser, accessToken,
              sessionId: tokenManager.getSessionId(),
              isAuthenticated: true,
              isLoading: false,
              permissions, roles,
            });
            syncToStore(cachedUser, accessToken, permissions, roles);
          } else {
            setState(prev => ({ ...prev, isAuthenticated: false, isLoading: false }));
            syncToStore(null, null, [], []);
          }
        }
      } catch {
        setState(prev => ({ ...prev, isAuthenticated: false, isLoading: false }));
        syncToStore(null, null, [], []);
      }
    };

    hydrate();

    return () => cancelTokenRefresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Actions publiques ────────────────────────────────────────

  const login = useCallback(async (
    accessToken: string,
    sessionId: string,
    user: CurrentUser,
    permissions: string[],
    roles: string[],
  ) => {
    setState({
      user, accessToken, sessionId,
      isAuthenticated: true,
      isLoading: false,
      permissions, roles,
    });
    syncToStore(user, accessToken, permissions, roles);
    scheduleTokenRefresh(() => {
      const newToken = tokenManager.getAccessToken();
      if (newToken) setState(prev => ({ ...prev, accessToken: newToken }));
    });
    onLogin?.(user);
  }, [syncToStore, onLogin]);

  const logout = useCallback(async (callApi = true) => {
    cancelTokenRefresh();
    if (callApi) {
      try { await authService.logout(); } catch { /* nettoyage de toute façon */ }
    } else {
      tokenManager.clearAll();
    }
    setState({
      user: null, accessToken: null, sessionId: null,
      isAuthenticated: false, isLoading: false,
      permissions: [], roles: [],
    });
    syncToStore(null, null, [], []);
    onLogout?.();
  }, [syncToStore, onLogout]);

  const refreshUser = useCallback(async () => {
    const session = await authService.getSession();
    if (session.authenticated && session.user && session.accessToken) {
      const { user, accessToken, permissions = [], roles = [], sessionId = null } = session;
      setState(prev => ({
        ...prev,
        user, accessToken, sessionId: sessionId ?? prev.sessionId,
        isAuthenticated: true,
        permissions, roles,
      }));
      syncToStore(user, accessToken, permissions, roles);
    }
  }, [syncToStore]);

  const hasPermission = useCallback(
    (permission: string) => state.permissions.includes(permission),
    [state.permissions],
  );

  const hasRole = useCallback(
    (role: string) => state.roles.includes(role),
    [state.roles],
  );

  // ── Valeur du contexte ───────────────────────────────────────

  const value: AuthContextType = {
    accessToken:     state.accessToken,
    refreshToken:    null,           // toujours null côté client (cookie HttpOnly)
    sessionId:       state.sessionId,
    user:            state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading:       state.isLoading,
    permissions:     state.permissions,
    roles:           state.roles,
    login,
    logout,
    hasPermission,
    hasRole,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
