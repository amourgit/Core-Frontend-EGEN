/** Rôle d'un utilisateur dans le système */
export interface IRole {
  id: string;
  nom: string;
  code: string;
  description?: string;
  permissions?: IPermission[];
}

/** Groupe d'appartenance d'un utilisateur */
export interface IGroupe {
  id: string;
  nom: string;
  domaine?: string;
}

/** Session utilisateur active */
export interface ISession {
  id?: string;
  userId: string;
  realm: string;
  ip?: string;
  device?: string;
  browser?: string;
  createdAt: string;
  expiresAt?: string;
  isCurrentSession?: boolean;
}

/** Informations d'authentification */
export interface IAuthInfo {
  isAuthenticated: boolean;
  realm: string;
  token?: string;
  refreshToken?: string;
  expiresAt?: number;
}
