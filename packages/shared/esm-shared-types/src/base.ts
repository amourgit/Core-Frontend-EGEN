/** Source d'une permission */
export type PermissionSource =
  | 'direct'
  | `role:${string}`
  | `groupe:${string}`
  | `delegation:${string}`;

/** Niveau d'accès frontend */
export type AccessLevel = 'none' | 'read' | 'write' | 'admin';

/** Permission atomique sur une ressource */
export interface IPermission {
  id: string;
  code: string;
  nom?: string;
  domaine?: string;
  description?: string;
  source: PermissionSource;
  niveau?: AccessLevel;
}

/** Groupe d'appartenance d'un utilisateur */
export interface IGroupe {
  id: string;
  nom: string;
  domaine?: string;
}
