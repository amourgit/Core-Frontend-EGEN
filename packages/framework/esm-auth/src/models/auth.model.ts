// ============================================================
// lib/models/iam/auth.model.ts
// Modèles de données d'authentification IAM/Keycloak.
//
// Ces types sont partagés entre :
//  - lib/auth-store.ts   → Context React Auth
//  - stores/auth.store.ts → Zustand store
//  - hooks/useAuth.ts    → Hook consommateur
//  - composants UI       → Affichage du profil, breadcrumb…
// ============================================================

// ── Utilisateur courant ───────────────────────────────────────

/**
 * Représentation de l'utilisateur authentifié tel que retourné
 * par le serveur après décodage du JWT Keycloak.
 */
export interface CurrentUser {
  /** Identifiant unique Keycloak (sub) */
  id: string;
  /** Nom d'utilisateur préféré (preferred_username) */
  username: string;
  /** Adresse email */
  email: string;
  /** Prénom (given_name) */
  prenom?: string;
  /** Nom de famille (family_name) */
  nom?: string;
  /** Nom complet calculé */
  name?: string;
  /** Rôles Keycloak (realm + client) */
  roles: string[];
  /** Identifiant du tenant/organisation */
  tenantId?: string;
  /** URL de l'avatar */
  avatarUrl?: string;
  // ── Champs EIGEN spécifiques ──────────────────────────────
  statut?: 'actif' | 'suspendu' | 'inactif';
  is_admin?: boolean;
  type_profil?: string;
  telephone?: string;
  identifiant_national?: string;
  premiere_connexion?: string | null;
  derniere_connexion?: string | null;
  raison_suspension?: string | null;
}

// ── État d'authentification ───────────────────────────────────

/**
 * État global d'authentification porté par le Context React.
 * Les tokens ne sont PAS dans cet objet (sécurité).
 * Seul l'accessToken opaque est exposé pour les appels API directs.
 */
export interface AuthState {
  /** Token d'accès en mémoire (null si non authentifié) */
  accessToken: string | null;
  /**
   * Refresh token — toujours null côté client.
   * Il vit dans un cookie HttpOnly géré par le serveur.
   */
  refreshToken: null;
  /** Identifiant de session Keycloak */
  sessionId: string | null;
  /** Données de l'utilisateur connecté */
  user: CurrentUser | null;
  /** L'utilisateur est-il authentifié ? */
  isAuthenticated: boolean;
  /** Initialisation en cours (hydratation depuis /api/auth/session) */
  isLoading: boolean;
  /** Liste des permissions fonctionnelles */
  permissions: string[];
  /** Liste des rôles Keycloak */
  roles: string[];
}

// ── Réponse API d'authentification ───────────────────────────

/**
 * Réponse du Route Handler POST /api/auth/login.
 */
export interface LoginResponse {
  accessToken: string;
  sessionId: string;
  user: CurrentUser;
  permissions: string[];
  roles: string[];
  expiresIn: number;
}

/**
 * Réponse du Route Handler GET /api/auth/session.
 * Appelé au chargement de page pour ré-hydrater l'état auth.
 */
export interface SessionResponse {
  authenticated: boolean;
  accessToken?: string;
  sessionId?: string;
  user?: CurrentUser;
  permissions?: string[];
  roles?: string[];
}

// ── Payload de login ──────────────────────────────────────────

export interface LoginCredentials {
  username: string;
  password: string;
  tenantId?: string;
}

// ── Extensions EIGEN spécifiques ────────────────────────────────

/** Extension de CurrentUser avec les champs EIGEN */
export interface CurrentUserExtended extends CurrentUser {
  statut?: 'actif' | 'suspendu' | 'inactif';
  is_admin?: boolean;
  type_profil?: string;
  telephone?: string;
  identifiant_national?: string;
  premiere_connexion?: string | null;
  derniere_connexion?: string | null;
  raison_suspension?: string | null;
}

/** Entrée dans le journal d'audit */
export interface JournalEntry {
  id: string;
  action: string;
  type_action?: string;
  module?: string;
  description?: string;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
  success: boolean;
  autorise?: boolean;
  permission_verifiee?: string;
  ressource?: string;
  request_id?: string;
  raison?: string;
  details?: Record<string, unknown>;
}

/** Permission effective calculée */
export interface PermissionEffective {
  code: string;
  label?: string;
  nom?: string;
  source: string;
  scope?: string;
  domaine?: string;
  ressource?: string;
  action?: string;
  perimetre?: string;
}

/** Habilitations regroupées d'un utilisateur */
export interface Habilitations {
  roles: string[];
  roles_actifs?: string[];
  permissions: PermissionEffective[];
  groupes?: string[];
  groupes_actifs?: string[];
  profil_id?: string;
}

/** Session Keycloak active */
export interface Session {
  id?: string;
  sessionId: string;
  userId: string;
  username?: string;
  ipAddress?: string;
  ip_address?: string;
  start?: number;
  lastAccess?: number;
  last_activity?: string;
  created_at?: string;
  expires_at?: string;
  clients?: Record<string, string>;
  user_agent?: string;
  status?: 'active' | 'inactive' | 'expired' | 'revoked';
  activity_count?: number;
}
