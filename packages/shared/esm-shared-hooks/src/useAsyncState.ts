import { useState, useCallback, useRef } from 'react';
import type { AsyncResult, IApiError } from '@igen/esm-shared-types';

/**
 * Hook générique pour gérer l'état d'une opération async (idle/loading/success/error).
 *
 * @example
 * const { state, run } = useAsyncState<Patient[]>();
 * await run(() => fetchPatients());
 */
export function useAsyncState<T>() {
  const [state, setState] = useState<AsyncResult<T>>({ status: 'idle' });
  const mountedRef = useRef(true);

  const run = useCallback(async (fn: () => Promise<T>): Promise<T | undefined> => {
    setState({ status: 'loading' });
    try {
      const data = await fn();
      if (mountedRef.current) setState({ status: 'success', data });
      return data;
    } catch (err: unknown) {
      const error: IApiError = {
        code: 'UNKNOWN',
        message: err instanceof Error ? err.message : String(err),
        status: (err as any)?.status,
      };
      if (mountedRef.current) setState({ status: 'error', error });
      return undefined;
    }
  }, []);

  const reset = useCallback(() => setState({ status: 'idle' }), []);

  return { state, run, reset };
}
