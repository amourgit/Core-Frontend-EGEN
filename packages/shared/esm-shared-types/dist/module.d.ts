import type { IMicroFrontendPermissions } from './permissions';
/** Métadonnées d'un micro-frontend enregistré dans le CORE */
export interface IMicroFrontendMeta {
    /** Nom unique du module (ex: @igen/esm-patient-app) */
    name: string;
    /** Version du module */
    version?: string;
    /** URL de chargement (Module Federation) */
    url?: string;
    /** Slug pour les routes */
    slug?: string;
    /** Permissions requises */
    permissions?: IMicroFrontendPermissions;
    /** Si false, le module ne se charge pas */
    enabled?: boolean;
    /** Métadonnées custom */
    metadata?: Record<string, unknown>;
}
/** État de chargement d'un module fédéré */
export type ModuleLoadState = 'pending' | 'loading' | 'loaded' | 'error' | 'disabled';
//# sourceMappingURL=module.d.ts.map