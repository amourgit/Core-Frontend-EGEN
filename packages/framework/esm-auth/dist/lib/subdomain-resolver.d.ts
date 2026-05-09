/** Options de résolution des sous-domaines */
export interface SubdomainResolverOptions {
    /**
     * Hostname explicite (utile pour SSR ou tests).
     * Si omis, utilise window.location.hostname côté client.
     */
    hostname?: string;
    /**
     * Niveaux de sous-domaines à extraire.
     *
     * Le NIVEAU 1 est le sous-domaine le plus proche du domaine racine.
     * Exemple : "client.region.org.iam-central.ga"
     *   - niveau 1 = "org"
     *   - niveau 2 = "region"
     *   - niveau 3 = "client"
     *
     * Si non défini, tous les niveaux sont retournés.
     */
    levels?: number[];
    /**
     * Domaines racines supplémentaires à exclure (en plus de la liste par défaut).
     */
    additionalRootDomains?: string[];
    /**
     * Si true, "www" est ignoré comme sous-domaine (défaut: true).
     */
    ignoreWww?: boolean;
}
/** Résultat de la résolution des sous-domaines */
export interface SubdomainResolution {
    /** Tous les sous-domaines extraits, du plus proche au plus éloigné du domaine racine */
    all: string[];
    /**
     * Sous-domaines indexés par niveau (base 1).
     * niveau 1 = le plus proche du domaine racine.
     *
     * @example
     * // "client.region.iam-central.ga"
     * // byLevel[1] = "region"
     * // byLevel[2] = "client"
     */
    byLevel: Record<number, string>;
    /**
     * Sous-domaines demandés via options.levels (dans l'ordre demandé).
     * Vide si levels non spécifié.
     */
    requested: string[];
    /** Hostname source utilisé pour l'extraction */
    hostname: string;
    /** Domaine racine détecté (sans les sous-domaines) */
    rootDomain: string;
    /** true si des sous-domaines ont été trouvés */
    hasSubdomains: boolean;
    /** Nombre total de niveaux de sous-domaines */
    depth: number;
}
/**
 * Résout les sous-domaines depuis l'URL courante ou un hostname fourni.
 *
 * @param options Configuration de la résolution
 * @returns SubdomainResolution avec tous les niveaux et les niveaux demandés
 *
 * @example
 * // URL: https://client1.region2.org.iam-central.ga
 * const r = resolveSubdomains({ levels: [1, 3] });
 * // r.all      = ["org", "region2", "client1"]
 * // r.byLevel  = { 1: "org", 2: "region2", 3: "client1" }
 * // r.requested = ["org", "client1"]  (niveaux 1 et 3)
 *
 * @example
 * // URL: https://tenant.app.saas-platform.com
 * const r = resolveSubdomains({ levels: [2] });
 * // r.all      = ["app", "tenant"]
 * // r.byLevel  = { 1: "app", 2: "tenant" }
 * // r.requested = ["tenant"]
 */
export declare function resolveSubdomains(options?: SubdomainResolverOptions): SubdomainResolution;
/**
 * Retourne le sous-domaine à un niveau précis.
 *
 * Niveau 1 = le plus proche du domaine racine.
 *
 * @param level   Niveau de sous-domaine (base 1)
 * @param hostname Hostname optionnel (pour SSR/tests)
 * @returns Le sous-domaine ou null si inexistant
 *
 * @example
 * // URL: https://client.region.iam-central.ga
 * getSubdomainAt(1) // → "region"
 * getSubdomainAt(2) // → "client"
 * getSubdomainAt(3) // → null
 */
export declare function getSubdomainAt(level: number, hostname?: string): string | null;
/**
 * Retourne une liste de sous-domaines pour les niveaux demandés.
 *
 * @param levels  Tableau de niveaux (base 1) à extraire
 * @param hostname Hostname optionnel (pour SSR/tests)
 * @returns Liste des sous-domaines dans l'ordre des niveaux demandés
 *
 * @example
 * // URL: https://client.region.org.iam-central.ga
 * getSubdomainsList([1, 3])  // → ["org", "client"]
 * getSubdomainsList([2, 1])  // → ["region", "org"]
 */
export declare function getSubdomainsList(levels: number[], hostname?: string): string[];
/**
 * Retourne le premier sous-domaine (niveau le plus éloigné du rootDomain).
 * Correspond généralement au tenant/client dans une architecture multitenant.
 *
 * @example
 * // URL: https://myclient.iam-central.ga
 * getTopSubdomain() // → "myclient"
 *
 * // URL: https://myclient.region.iam-central.ga
 * getTopSubdomain() // → "myclient"
 */
export declare function getTopSubdomain(hostname?: string): string | null;
/**
 * Retourne tous les sous-domaines sous forme de map { niveau: valeur }.
 *
 * @param hostname Hostname optionnel
 *
 * @example
 * // URL: https://client.region.org.iam-central.ga
 * getAllSubdomainsMap()
 * // → { 1: "org", 2: "region", 3: "client" }
 */
export declare function getAllSubdomainsMap(hostname?: string): Record<number, string>;
/**
 * Hook React qui retourne la résolution de sous-domaines courante.
 * À utiliser dans les composants côté client uniquement.
 *
 * @param options Options de résolution (peuvent inclure les niveaux)
 *
 * @example
 * function TenantBadge() {
 *   const { byLevel, requested } = useSubdomains({ levels: [1, 2] });
 *   return <span>{requested.join(' / ')}</span>;
 * }
 */
export declare function useSubdomains(options?: SubdomainResolverOptions): SubdomainResolution;
declare const _default: {
    resolveSubdomains: typeof resolveSubdomains;
    getSubdomainAt: typeof getSubdomainAt;
    getSubdomainsList: typeof getSubdomainsList;
    getTopSubdomain: typeof getTopSubdomain;
    getAllSubdomainsMap: typeof getAllSubdomainsMap;
    useSubdomains: typeof useSubdomains;
};
export default _default;
//# sourceMappingURL=subdomain-resolver.d.ts.map