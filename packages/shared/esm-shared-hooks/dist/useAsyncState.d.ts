import type { AsyncResult } from '@igen/esm-shared-types';
/**
 * Hook générique pour gérer l'état d'une opération async (idle/loading/success/error).
 *
 * @example
 * const { state, run } = useAsyncState<Patient[]>();
 * await run(() => fetchPatients());
 */
export declare function useAsyncState<T>(): {
    state: AsyncResult<T>;
    run: (fn: () => Promise<T>) => Promise<T | undefined>;
    reset: () => void;
};
//# sourceMappingURL=useAsyncState.d.ts.map