import React from 'react';
import type { AsyncResult } from '@egen/esm-shared-types';
interface AsyncStateViewProps<T> {
    state: AsyncResult<T>;
    renderSuccess: (data: T) => React.ReactNode;
    renderLoading?: () => React.ReactNode;
    renderError?: (message: string) => React.ReactNode;
    renderIdle?: () => React.ReactNode;
}
/**
 * Composant générique pour afficher les 4 états async (idle/loading/success/error).
 *
 * @example
 * <AsyncStateView
 *   state={state}
 *   renderSuccess={(patients) => <PatientList data={patients} />}
 * />
 */
export declare function AsyncStateView<T>({ state, renderSuccess, renderLoading, renderError, renderIdle, }: AsyncStateViewProps<T>): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=AsyncStateView.d.ts.map