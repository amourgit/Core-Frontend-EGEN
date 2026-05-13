// Types de base (primitifs, sans dépendances croisées)
export type { IPermission, IGroupe, PermissionSource, AccessLevel } from './base.js';

// Auth
export type { IRole, ISession, IAuthInfo } from './auth.js';

// Permissions & habilitations
export type {
  IHabilitations,
  IPermissionCheck,
  IMicroFrontendPermissions,
} from './permissions.js';
export { hasPermissionCode, getEffectiveLevel } from './permissions.js';

// User
export type { IUser, IUserPreferences } from './user.js';

// API
export type { IPaginatedResponse, IApiError, AsyncResult } from './api.js';

// Navigation
export type { INavEntry, IBreadcrumb } from './navigation.js';

// Module / MFE
export type { IMicroFrontendMeta, ModuleLoadState } from './module.js';
