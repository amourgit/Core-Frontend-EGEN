export interface KeycloakSessionState {
    /** null = pas encore vérifié */
    isSessionValid: boolean | null;
    /** Vérification en cours */
    isChecking: boolean;
    /** Erreur de la dernière vérification (null si succès ou pas encore vérifié) */
    lastError: string | null;
    /** Timestamp de la dernière vérification (0 si jamais) */
    lastCheckedAt: number;
    /** Déclenche une vérification manuelle */
    check: () => Promise<boolean>;
}
export declare function useKeycloakSession(): KeycloakSessionState;
//# sourceMappingURL=useKeycloakSession.d.ts.map