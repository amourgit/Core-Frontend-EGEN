// ============================================================
// hooks/useSessionMonitor.ts
// Monitor de SESSION (présence côté serveur) — polling fixe.
//
// RÔLE UNIQUE :
//  Vérifier que la SESSION est toujours valide côté serveur.
//  (révocation admin, déconnexion d'un autre appareil, blacklist...)
//  Il NE gère PAS le refresh du token — c'est useTokenWatcher.
//
// SÉPARATION DES RESPONSABILITÉS :
//  - useTokenWatcher   → refresh proactif (exp lu depuis le JWT, 1s interval)
//  - useSessionMonitor → vérification serveur (polling toutes les 60s)
//
// GRACE PERIOD post-login :
//  8s sans vérification réseau après le login pour éviter la race
//  condition avec la propagation des cookies HttpOnly.
//
// FAILSAFE :
//  Erreur réseau (5xx, timeout) → on ne déconnecte PAS.
//  Seul un 401/403 avec authenticated:false confirme une révocation.
// ============================================================


import { useEffect, useRef, useCallback } from 'react';
import { useAuthContext } from '@/lib/auth-store';
import { tokenManager } from '@/lib/security/token-manager';
import { auditLogger }  from '@/lib/security/audit-logger';
import {
  SESSION_MONITOR,
  INACTIVITY,
} from '@/lib/security/constants';

// Grace period post-login (cookies HttpOnly pas encore propagés)
const LOGIN_GRACE_PERIOD_MS = 8_000;

// ── useSessionMonitor ─────────────────────────────────────
export function useSessionMonitor() {
  const { isAuthenticated, logout, user, sessionId } = useAuthContext();

  const intervalRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const isCheckingRef    = useRef(false);
  const lastCheckRef     = useRef<number>(0);
  const authStartTimeRef = useRef<number>(0);

  // Polling fixe toutes les 60s
  const pollIntervalMs = SESSION_MONITOR.POLL_STANDARD_MS;

  // Enregistrer le moment où l'auth devient true
  useEffect(() => {
    if (isAuthenticated && authStartTimeRef.current === 0) {
      authStartTimeRef.current = Date.now();
    }
    if (!isAuthenticated) {
      authStartTimeRef.current = 0;
    }
  }, [isAuthenticated]);

  // ── Vérification de session (côté serveur) ────────────────
  // Ne rafraîchit PAS le token — se contente de vérifier si la session
  // est toujours connue et valide côté backend.
  const checkSession = useCallback(async () => {
    if (isCheckingRef.current) return;
    if (!isAuthenticated)      return;

    // Grace period post-login
    const timeSinceAuth = Date.now() - authStartTimeRef.current;
    if (timeSinceAuth < LOGIN_GRACE_PERIOD_MS && tokenManager.hasValidToken()) return;

    // Anti-flood : min 4s entre deux vérifications
    const now = Date.now();
    if (now - lastCheckRef.current < 4_000) return;
    lastCheckRef.current  = now;
    isCheckingRef.current = true;

    try {
      const res = await fetch('/api/auth/session', {
        method:      'GET',
        credentials: 'include',
        cache:       'no-store',
      });

      // Erreur serveur → failsafe, on garde la session
      if (!res.ok) {
        if (res.status >= 500) return;
        // 401/403 = session révoquée côté backend
        auditLogger.logSessionRevoked(user?.id, sessionId || undefined);
        tokenManager.clear();
        await logout(false);
        return;
      }

      const data = await res.json() as { authenticated: boolean; accessToken?: string };

      if (!data.authenticated) {
        // Double vérification : si token valide en mémoire, ne pas déconnecter
        // (cookie peut ne pas encore être arrivé après un refresh récent)
        if (tokenManager.hasValidToken()) return;

        auditLogger.logSessionRevoked(user?.id, sessionId || undefined);
        tokenManager.clear();
        await logout(false);
        return;
      }

      // Mettre à jour le token en mémoire si le serveur en fournit un nouveau
      if (data.accessToken) {
        tokenManager.setAccessToken(data.accessToken);
      }

    } catch {
      // Erreur réseau → on conserve la session (failsafe)
    } finally {
      isCheckingRef.current = false;
    }
  }, [isAuthenticated, logout, user?.id, sessionId]);

  // ── Polling adaptatif ──────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
      return;
    }

    // Premier check après la grace period
    const initialDelay = setTimeout(() => {
      checkSession();
      intervalRef.current = setInterval(checkSession, pollIntervalMs);
    }, LOGIN_GRACE_PERIOD_MS);

    return () => {
      clearTimeout(initialDelay);
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    };
  }, [isAuthenticated, checkSession, pollIntervalMs]);

  // ── Vérification au retour sur l'onglet ───────────────────
  useEffect(() => {
    if (!isAuthenticated) return;
    const handle = () => { if (document.visibilityState === 'visible') checkSession(); };
    document.addEventListener('visibilitychange', handle);
    return () => document.removeEventListener('visibilitychange', handle);
  }, [isAuthenticated, checkSession]);

  // ── Vérification au focus ─────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;
    const handle = () => checkSession();
    window.addEventListener('focus', handle);
    return () => window.removeEventListener('focus', handle);
  }, [isAuthenticated, checkSession]);
}

// ── useInactivityGuard ────────────────────────────────────
export function useInactivityGuard(onWarning?: (secondsLeft: number) => void) {
  const { isAuthenticated, logout, user, sessionId } = useAuthContext();

  const timerRef        = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningRef      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const clearTimers = useCallback(() => {
    if (timerRef.current)   clearTimeout(timerRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    timerRef.current   = null;
    warningRef.current = null;
  }, []);

  const resetTimers = useCallback(() => {
    if (!isAuthenticated) return;
    clearTimers();
    lastActivityRef.current = Date.now();

    const warnDelay = INACTIVITY.TIMEOUT_MS - INACTIVITY.WARNING_BEFORE_MS;
    warningRef.current = setTimeout(() => {
      onWarning?.(Math.round(INACTIVITY.WARNING_BEFORE_MS / 1000));
    }, warnDelay);

    timerRef.current = setTimeout(async () => {
      auditLogger.logInactivityTimeout(
        window.location.pathname,
        user?.id,
        sessionId || undefined
      );
      tokenManager.clear();
      await logout(true);
    }, INACTIVITY.TIMEOUT_MS);
  }, [isAuthenticated, clearTimers, logout, onWarning, user?.id, sessionId]);

  useEffect(() => {
    if (!isAuthenticated) { clearTimers(); return; }
    resetTimers();

    let lastReset = 0;
    const handleActivity = () => {
      const now = Date.now();
      if (now - lastReset < 1_000) return;
      lastReset = now;
      resetTimers();
    };

    INACTIVITY.RESET_EVENTS.forEach(evt =>
      window.addEventListener(evt, handleActivity, { passive: true })
    );
    return () => {
      clearTimers();
      INACTIVITY.RESET_EVENTS.forEach(evt =>
        window.removeEventListener(evt, handleActivity)
      );
    };
  }, [isAuthenticated, resetTimers, clearTimers]);

  return {
    getInactiveMs: () => Date.now() - lastActivityRef.current,
    resetActivity: resetTimers,
  };
}
