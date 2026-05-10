import { useState, useCallback } from 'react';
import { httpClient } from '../services/http-client';

interface ChangePasswordResult {
  success: boolean;
  error?: string;
}

interface UseChangePasswordReturn {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  changePassword: (currentPassword: string, newPassword: string) => Promise<ChangePasswordResult>;
  reset: () => void;
}

export function useChangePassword(): UseChangePasswordReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const changePassword = useCallback(async (
    currentPassword: string,
    newPassword: string
  ): Promise<ChangePasswordResult> => {
    setIsLoading(true);
    setError(null);
    try {
      await httpClient.put('/compte/password', { current_password: currentPassword, new_password: newPassword });
      setSuccess(true);
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du changement de mot de passe.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return { isLoading, error, success, changePassword, reset };
}
