export declare function getActiveRealm(): string;
export declare function getActiveAdminBase(): string;
export declare function getActiveOidcBase(): string;
declare class HttpClient {
    private isRefreshing;
    private pendingQueue;
    private onLogout?;
    setLogoutCallback(callback: () => void): void;
    private resolveQueue;
    private rejectQueue;
    private waitForRefresh;
    /**
     * Rafraîchit le token via le Route Handler /api/auth/refresh.
     * Le Route Handler lit le cookie HttpOnly refresh_token,
     * appelle le backend, met à jour les cookies et retourne
     * le nouveau access_token en body JSON.
     */
    private refreshTokens;
    /**
     * Requête HTTP avec injection Bearer + retry 401 automatique.
     */
    fetch(endpoint: string, options?: RequestInit): Promise<Response>;
    get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T>;
    post<T>(endpoint: string, body: unknown): Promise<T>;
    delete<T>(endpoint: string): Promise<T>;
    /**
     * DELETE avec body JSON — requis par certains endpoints Keycloak
     * (ex: scope-mappings/realm, scope-mappings/clients/{id})
     */
    deleteWithBody<T>(endpoint: string, body: unknown): Promise<T>;
    put<T>(endpoint: string, body: unknown): Promise<T>;
}
export declare const httpClient: HttpClient;
export {};
//# sourceMappingURL=http-client.d.ts.map