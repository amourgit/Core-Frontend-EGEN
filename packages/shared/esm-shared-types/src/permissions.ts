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
export function hasPermissionCode(permissions: IPermission[], code: string): boolean {
  return permissions.some(p => p.code === code);
}

/** Niveau d'accès effectif sur un domaine */
export function getEffectiveLevel(permissions: IPermission[], domain: string): AccessLevel {
  const domainPerms = permissions.filter(p => p.domaine === domain);
  if (domainPerms.some(p => p.niveau === 'admin')) return 'admin';
  if (domainPerms.some(p => p.niveau === 'write')) return 'write';
  if (domainPerms.some(p => p.niveau === 'read'))  return 'read';
  return 'none';
}
