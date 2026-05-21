import type { IUser } from '@egen/esm-shared-types';
interface UseCurrentUserResult {
    user: IUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}
/**
 * Hook pour accéder à l'utilisateur courant depuis le store egen.
 *
 * @example
 * const { user, isAuthenticated } = useCurrentUser();
 */
export declare function useCurrentUser(): UseCurrentUserResult;
export {};
//# sourceMappingURL=useCurrentUser.d.ts.map