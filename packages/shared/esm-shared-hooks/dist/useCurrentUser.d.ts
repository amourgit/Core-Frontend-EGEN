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
export declare function useCurrentUser(): UseCurrentUserResult;
export {};
//# sourceMappingURL=useCurrentUser.d.ts.map