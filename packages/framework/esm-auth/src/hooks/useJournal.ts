import { useState, useEffect, useCallback } from 'react';
import { httpClient } from '../services/http-client';
import type { JournalEntry } from '../models/auth.model';

interface UseJournalResult {
  entries: JournalEntry[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useJournal(limit?: number): UseJournalResult {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJournal = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = limit ? { limit } : undefined;
      const result = await httpClient.get<JournalEntry[]>('/compte/journal', params as Record<string, unknown> | undefined);
      setEntries(Array.isArray(result) ? result : []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur chargement journal.');
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => { fetchJournal(); }, [fetchJournal]);

  return { entries, isLoading, error, refresh: fetchJournal };
}
