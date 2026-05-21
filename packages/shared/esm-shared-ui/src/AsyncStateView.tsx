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
export function AsyncStateView<T>({
  state,
  renderSuccess,
  renderLoading = () => <div className="egen-spinner" aria-label="Chargement…" />,
  renderError = (msg) => <div className="egen-error" role="alert">{msg}</div>,
  renderIdle = () => null,
}: AsyncStateViewProps<T>) {
  switch (state.status) {
    case 'loading': return <>{renderLoading()}</>;
    case 'success': return <>{renderSuccess(state.data)}</>;
    case 'error':   return <>{renderError(state.error.message)}</>;
    default:        return <>{renderIdle()}</>;
  }
}
