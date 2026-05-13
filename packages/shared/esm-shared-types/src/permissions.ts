/** Source d'une permission (directe, via rôle, via groupe, délégation) */
export type PermissionSource = 'direct' | `role:${string}` | `groupe:${string}` | `delegation:${string}`;

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
  /** Permissions requises pour afficher le module */
  required?: string[];
  /** Permissions pour les fonctionnalités avancées */
  advanced?: string[];
  /** Si true, le module est visible mais désactivé sans les permissions */
  gracefulDegradation?: boolean;
}
