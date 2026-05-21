import type { IPermission, AccessLevel } from '@egen/esm-shared-types';

/** Vérifie si une liste de permissions contient un code donné */
export function hasPermission(permissions: IPermission[], code: string): boolean {
  return permissions.some(p => p.code === code);
}

/** Vérifie si toutes les permissions requises sont présentes */
export function hasAllPermissions(permissions: IPermission[], required: string[]): boolean {
  return required.every(r => hasPermission(permissions, r));
}

/** Vérifie si au moins une des permissions est présente */
export function hasAnyPermission(permissions: IPermission[], codes: string[]): boolean {
  return codes.some(c => hasPermission(permissions, c));
}

/** Retourne le niveau d'accès effectif sur une ressource */
export function getAccessLevel(permissions: IPermission[], domain: string): AccessLevel {
  const domainPerms = permissions.filter(p => p.domaine === domain);
  if (domainPerms.some(p => p.niveau === 'admin')) return 'admin';
  if (domainPerms.some(p => p.niveau === 'write')) return 'write';
  if (domainPerms.some(p => p.niveau === 'read')) return 'read';
  return 'none';
}
