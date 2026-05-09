/**
 * Gestionnaire du cookie miroir "session_active".
 *
 * Ce cookie non-HttpOnly est positionné par le client pour
 * signaler qu'une session est censée être active, sans stocker
 * de token. Il permet à l'UI de savoir si elle doit tenter un
 * refresh via /api/auth/session au chargement de page.
 */
export declare const clientCookieManager: {
    /**
     * Indique si le cookie miroir "session_active" est présent.
     * Ne garantit pas que les tokens côté serveur sont encore valides.
     */
    readonly hasActiveSession: () => boolean;
    /**
     * Positionne le cookie miroir (ex: après un login réussi).
     * @param maxAgeSec Durée de vie en secondes (défaut : 1 heure)
     */
    readonly setSessionActiveCookie: (maxAgeSec?: number) => void;
    /**
     * Supprime le cookie miroir (ex: après un logout).
     * Les cookies HttpOnly sont supprimés par le serveur via POST /api/auth/logout.
     */
    readonly clearSessionActiveCookie: () => void;
    /**
     * Lit la valeur brute d'un cookie accessible JS (non-HttpOnly).
     * Usage : lire des préférences UI stockées côté client.
     */
    readonly get: (name: string) => string | null;
    /**
     * Définit un cookie non-HttpOnly générique (préférences UI, langue…).
     */
    readonly set: (name: string, value: string, maxAgeSec?: number) => void;
    /**
     * Supprime un cookie JS accessible.
     */
    readonly remove: (name: string) => void;
};
//# sourceMappingURL=cookie-manager.d.ts.map