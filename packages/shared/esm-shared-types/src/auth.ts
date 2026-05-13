import type { IPermission } from './base.js';

export type { IPermission } from './base.js';
export type { IGroupe }     from './base.js';

/** Rôle d'un utilisateur dans le système */
export interface IRole {
  id: string;
  nom: string;
  code: string;
  description?: string;
  permissions?: IPermission[];
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
