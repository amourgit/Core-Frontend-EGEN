import { useState, useEffect } from 'react';
import type { IUser } from '@igen/esm-shared-types';

interface UseCurrentUserResult {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Hook pour accéder à l'utilisateur courant depuis le store IGEN.
 *
 * @example
 * const { user, isAuthenticated } = useCurrentUser();
 */
export function useCurrentUser(): UseCurrentUserResult {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const store = (window as any).__IGEN_AUTH_STORE__;
    if (!store) {
      setIsLoading(false);
      return;
    }

    const update = () => {
      const state = store.getState?.();
      setUser(state?.user ?? null);
      setIsLoading(false);
    };

    update();
    // S'abonner aux changements du store Zustand
    const unsub = store.subscribe?.(update);
    return () => unsub?.();
  }, []);

  return { user, isLoading, isAuthenticated: !!user };
}
