import { useState, useEffect, useCallback } from 'react';
import { httpClient } from '../services/http-client';
import { tokenManager } from '../security/token-manager';
import type { Session } from '../models/auth.model';

interface UseIAMSessionsResult {
  sessions: Session[];
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  fetchSessions: () => void;
  currentSessionId: string | null;
  terminateSession: (sessionId: string) => Promise<{ success: boolean; error?: string }>;
  revokeSession: (sessionId: string) => Promise<{ success: boolean; error?: string }>;
}

export function useIAMSessions(userId?: string): UseIAMSessionsResult {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentSessionId = tokenManager.getTokenPayload()?.sid ?? null;

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const uid = userId ?? 'me';
      const result = await httpClient.get<Session[]>(`/compte/sessions/${uid}`);
      setSessions(Array.isArray(result) ? result : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur chargement sessions.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const revokeSession = useCallback(async (sessionId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await httpClient.delete(`/compte/sessions/${sessionId}`);
      setSessions(prev => prev.filter(s => (s.id ?? s.sessionId) !== sessionId));
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur révocation session.';
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  return {
    sessions, isLoading, loading: isLoading,
    error, refresh: fetchSessions, fetchSessions,
    currentSessionId,
    terminateSession: revokeSession, revokeSession,
  };
}
