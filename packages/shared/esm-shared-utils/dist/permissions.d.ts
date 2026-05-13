import type { IPermission, AccessLevel } from '@igen/esm-shared-types';
/** Vérifie si une liste de permissions contient un code donné */
export declare function hasPermission(permissions: IPermission[], code: string): boolean;
/** Vérifie si toutes les permissions requises sont présentes */
export declare function hasAllPermissions(permissions: IPermission[], required: string[]): boolean;
/** Vérifie si au moins une des permissions est présente */
export declare function hasAnyPermission(permissions: IPermission[], codes: string[]): boolean;
/** Retourne le niveau d'accès effectif sur une ressource */
export declare function getAccessLevel(permissions: IPermission[], domain: string): AccessLevel;
//# sourceMappingURL=permissions.d.ts.map