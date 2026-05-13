import { useState, useCallback, useRef } from 'react';
/**
 * Hook générique pour gérer l'état d'une opération async (idle/loading/success/error).
 *
 * @example
 * const { state, run } = useAsyncState<Patient[]>();
 * await run(() => fetchPatients());
 */
export function useAsyncState() {
    const [state, setState] = useState({ status: 'idle' });
    const mountedRef = useRef(true);
    const run = useCallback(async (fn) => {
        setState({ status: 'loading' });
        try {
            const data = await fn();
            if (mountedRef.current)
                setState({ status: 'success', data });
            return data;
        }
        catch (err) {
            const error = {
                code: 'UNKNOWN',
                message: err instanceof Error ? err.message : String(err),
                status: err?.status,
            };
            if (mountedRef.current)
                setState({ status: 'error', error });
            return undefined;
        }
    }, []);
    const reset = useCallback(() => setState({ status: 'idle' }), []);
    return { state, run, reset };
}
