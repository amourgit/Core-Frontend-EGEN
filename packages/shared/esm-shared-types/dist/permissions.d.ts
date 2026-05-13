import type { IPermission, IGroupe, AccessLevel } from './base.js';
import type { IRole } from './auth.js';
export type { PermissionSource, AccessLevel } from './base.js';
/** Habilitations complètes d'un utilisateur */
export interface IHabilitations {
    userId: string;
    permissions: IPermission[];
    roles_actifs?: IRole[];
    groupes_actifs?: IGroupe[];
    cachedAt?: string;
}
/** Résultat d'une vérification de permission */
export interface IPermissionCheck {
    granted: boolean;
    reason?: string;
    requiredPermission: string;
}
/** Config des permissions d'un micro-frontend */
export interface IMicroFrontendPermissions {
    required?: string[];
    advanced?: string[];
    gracefulDegradation?: boolean;
}
/** Vérifie l'accès à partir d'une liste de permissions */
export declare function hasPermissionCode(permissions: IPermission[], code: string): boolean;
/** Niveau d'accès effectif sur un domaine */
export declare function getEffectiveLevel(permissions: IPermission[], domain: string): AccessLevel;
//# sourceMappingURL=permissions.d.ts.map