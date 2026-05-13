/** Réponse API paginée */
export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** Erreur API normalisée */
export interface IApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  status?: number;
}

/** Résultat d'une opération async */
export type AsyncResult<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: IApiError };
