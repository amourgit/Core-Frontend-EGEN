export interface ResolvedRealm {
    /** Nom du realm Keycloak */
    realm: string;
    /** Sous-domaine extrait (null si fallback) */
    subdomain: string | null;
    /** true si le realm vient d'un sous-domaine réel */
    isDynamic: boolean;
    /** URL de base OIDC pour ce realm */
    oidcBase: string;
    /** URL de base Admin REST pour ce realm */
    adminBase: string;
    /** URL complète Keycloak */
    keycloakUrl: string;
}
/**
 * Extrait le sous-domaine depuis un hostname.
 *
 * Règles :
 *  - "monentite.iam-central.ga"  →  "monentite"
 *  - "sub.monentite.iam-central.ga"  →  "sub"  (premier segment)
 *  - "localhost" / IP / domaine racine  →  null
 *
 * @param hostname  Le hostname brut (ex: "monentite.iam-central.ga")
 * @returns Le sous-domaine ou null si inexistant / non pertinent
 */
/**
 * Extrait le sous-domaine principal depuis un hostname.
 * Délègue au SubdomainResolver pour une extraction robuste multi-niveaux.
 *
 * Retourne le sous-domaine le plus éloigné du domaine racine (= le tenant).
 * Exemple : "client.region.iam-central.ga" → "client"
 */
export declare function extractSubdomain(hostname: string): string | null;
/**
 * Résout le realm Keycloak depuis un hostname.
 * Utilisable côté CLIENT et SERVEUR (Route Handlers).
 *
 * @param hostname  Hostname explicite (pour SSR/Edge). Si omis, utilise
 *                  window.location.hostname côté client.
 * @returns ResolvedRealm avec toutes les URLs pré-calculées
 */
export declare function resolveRealm(hostname?: string): ResolvedRealm;
/**
 * Version simplifiée — retourne uniquement le nom du realm.
 * À utiliser dans les services IAM comme remplacement de la constante.
 *
 * @param hostname  Hostname optionnel (pour SSR)
 * @returns Nom du realm
 */
export declare function getRealm(hostname?: string): string;
/**
 * Retourne l'URL de base Admin REST API pour un realm.
 *
 * @param realm     Realm explicite (si déjà connu)
 * @param hostname  Hostname pour extraction automatique
 */
export declare function getAdminBase(realm?: string, hostname?: string): string;
/**
 * Retourne l'URL de base OIDC pour un realm.
 *
 * @param realm     Realm explicite (si déjà connu)
 * @param hostname  Hostname pour extraction automatique
 */
export declare function getOidcBase(realm?: string, hostname?: string): string;
/**
 * Extrait le realm depuis un objet NextRequest (header `host`).
 * À utiliser dans les Route Handlers (app/api/**).
 *
 * @param request  NextRequest de Next.js
 * @returns ResolvedRealm
 *
 * @example
 * // Dans app/api/auth/login/route.ts
 * import { resolveRealmFromRequest } from '../lib/realm-resolver';
 *
 * export async function POST(request: NextRequest) {
 *   const { realm, oidcBase, adminBase } = resolveRealmFromRequest(request);
 *   const OIDC_TOKEN_URL = `${oidcBase}/token`;
 *   // ...
 * }
 */
export declare function resolveRealmFromRequest(request: {
    headers: {
        get: (key: string) => string | null;
    };
}): ResolvedRealm;
export declare function getCurrentRealm(): ResolvedRealm;
/**
 * Invalide le cache du realm (utile pour les tests).
 */
export declare function clearRealmCache(): void;
declare const _default: {
    resolveRealm: typeof resolveRealm;
    resolveRealmFromRequest: typeof resolveRealmFromRequest;
    getCurrentRealm: typeof getCurrentRealm;
    getRealm: typeof getRealm;
    getAdminBase: typeof getAdminBase;
    getOidcBase: typeof getOidcBase;
    extractSubdomain: typeof extractSubdomain;
    clearRealmCache: typeof clearRealmCache;
};
export default _default;
//# sourceMappingURL=realm-resolver.d.ts.map