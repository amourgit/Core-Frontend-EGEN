// ============================================================
// hooks/useAuth.ts
// Hook d'authentification unifié — source de vérité pour les
// composants qui ont besoin des données utilisateur.
//
// STRATÉGIE DOUBLE SOURCE :
//  1. useAuthStore (Zustand) → état léger, synchrone, partagé
//     globalement sans Provider (utile pour les composants deep)
//  2. useAuthContext (React Context) → état riche avec actions
//     (login, logout, hasPermission…)
//
// Ce hook expose un objet unifié compatible avec les deux sources,
// en privilégiant le Context quand disponible.
// ============================================================

import { useMemo } from 'react';
import { useAuthStore } from '@/stores/auth.store';

// ── Types retournés ───────────────────────────────────────────

export interface UseAuthReturn {
  /** Utilisateur connecté (null si non authentifié) */
  user: {
    id:        string;
    username:  string;
    email:     string;
    name:      string;
    prenom?:   string;
    nom?:      string;
    roles:     string[];
    avatarUrl?: string;
    tenantId?: string;
  } | null;
  /** L'utilisateur est-il authentifié ? */
  isAuthenticated: boolean;
  /** Initialisation en cours */
  isLoading: boolean;
  /** Vérifie si l'utilisateur a un rôle donné */
  hasRole: (role: string) => boolean;
  /** Vérifie si l'utilisateur a au moins un des rôles donnés */
  hasAnyRole: (roles: string[]) => boolean;
  /** Initiales de l'utilisateur (ex: "JD" pour Jean Dupont) */
  initials: string;
}

// ── Utilitaires ───────────────────────────────────────────────

function computeInitials(prenom?: string, nom?: string, username?: string): string {
  const f = prenom?.trim()?.[0] ?? '';
  const l = nom?.trim()?.[0]   ?? '';
  if (f || l) return `${f}${l}`.toUpperCase();
  return (username?.trim()?.[0] ?? 'U').toUpperCase();
}

function computeFullName(prenom?: string, nom?: string, username?: string, email?: string): string {
  const full = [prenom, nom].filter(Boolean).join(' ');
  return full || username || email?.split('@')[0] || 'Utilisateur';
}

// ── Hook principal ────────────────────────────────────────────

/**
 * Hook d'authentification à utiliser dans les composants.
 *
 * @example
 * const { user, isAuthenticated, hasRole } = useAuth();
 * if (!isAuthenticated) return <LoginPage />;
 * if (!hasRole('admin')) return <Forbidden />;
 */
export function useAuth(): UseAuthReturn {
  const storeUser      = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading      = useAuthStore((s) => s.isLoading);

  const user = useMemo(() => {
    if (!storeUser) return null;
    return {
      id:        storeUser.id,
      username:  storeUser.username,
      email:     storeUser.email,
      name:      computeFullName(storeUser.prenom, storeUser.nom, storeUser.username, storeUser.email),
      prenom:    storeUser.prenom,
      nom:       storeUser.nom,
      roles:     storeUser.roles ?? [],
      avatarUrl: storeUser.avatarUrl,
      tenantId:  storeUser.tenantId,
    };
  }, [storeUser]);

  const initials = useMemo(() => {
    if (!storeUser) return 'U';
    return computeInitials(storeUser.prenom, storeUser.nom, storeUser.username);
  }, [storeUser]);

  const hasRole = useMemo(
    () => (role: string) => user?.roles.includes(role) ?? false,
    [user]
  );

  const hasAnyRole = useMemo(
    () => (roles: string[]) => roles.length === 0 || roles.some((r) => user?.roles.includes(r) ?? false),
    [user]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    hasRole,
    hasAnyRole,
    initials,
  };
}
