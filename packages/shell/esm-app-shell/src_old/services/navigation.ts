// ============================================================
// services/navigation.ts
// Données de navigation statiques du Core Shell.
//
// ARCHITECTURE MICRO-FRONTEND :
//  - Ce fichier contient la navigation du Shell (niveau 0).
//  - Chaque micro-frontend injecte sa propre nav via son manifest.
//  - En production, navigationData est enrichi dynamiquement par
//    le registry store à partir des modules chargés.
//  - Ce fichier sert de fallback / données initiales.
// ============================================================

import type { ComponentType, SVGProps } from 'react';
import {
  LayoutDashboard, Settings, Users, Shield, Activity,
  Building2, Bell, FileText, BarChart3, Puzzle,
  Database, Globe, Lock, Key, Zap,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────

export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { style?: React.CSSProperties }>;

/**
 * Nœud de l'arbre de navigation.
 * Compatible avec le CascadingNavDropdown du TopBar.
 */
export interface NavigationItem {
  /** Identifiant unique (utilisé pour l'état actif) */
  id: string;
  /** Libellé affiché */
  label: string;
  /** Chemin de navigation React Router */
  path: string;
  /** Composant icône Lucide */
  icon?: IconComponent;
  /** Description courte (tooltip, sous-menus…) */
  description?: string;
  /** Badge numérique ou textuel */
  badge?: string;
  /** Rôles requis pour voir cet item */
  requiredRoles?: string[];
  /** Enfants (navigation hiérarchique) */
  children?: NavigationItem[];
  /** Groupe d'appartenance */
  group?: string;
}

export interface NavigationGroup {
  id:    string;
  label: string;
  color?: string;
}

// ── Données statiques ─────────────────────────────────────────

export const navigationGroups: NavigationGroup[] = [
  { id: 'core',      label: 'Core',          color: '#6366f1' },
  { id: 'iam',       label: 'Identités',     color: '#8b5cf6' },
  { id: 'analytics', label: 'Analytique',    color: '#06b6d4' },
  { id: 'settings',  label: 'Configuration', color: '#64748b' },
];

/**
 * Navigation principale du Shell.
 * Structure hiérarchique pour le CascadingNavDropdown.
 */
export const navigationData: NavigationItem[] = [
  {
    id:          'dashboard',
    label:       'Tableau de bord',
    path:        '/',
    icon:        LayoutDashboard,
    description: 'Vue d\'ensemble de la plateforme',
    group:       'core',
  },
  {
    id:          'iam',
    label:       'Identités & Accès',
    path:        '/iam',
    icon:        Shield,
    description: 'Gestion des utilisateurs, rôles et permissions',
    group:       'iam',
    children: [
      {
        id:    'iam-comptes',
        label: 'Comptes utilisateurs',
        path:  '/iam/compte',
        icon:  Users,
        children: [
          { id: 'iam-comptes-liste', label: 'Liste',     path: '/iam/compte/liste',  icon: Users },
          { id: 'iam-comptes-creer', label: 'Créer',     path: '/iam/compte/creer',  icon: Users },
        ],
      },
      {
        id:    'iam-organisations',
        label: 'Organisations',
        path:  '/iam/organisations',
        icon:  Building2,
      },
      {
        id:    'iam-roles',
        label: 'Rôles & Permissions',
        path:  '/iam/roles',
        icon:  Key,
        children: [
          { id: 'iam-roles-client', label: 'Rôles clients',    path: '/iam/roles',        icon: Key },
          { id: 'iam-roles-realm',  label: 'Rôles Realm',      path: '/iam/realmroles',   icon: Shield },
          { id: 'iam-groupes',      label: 'Groupes',          path: '/iam/groupes',      icon: Users },
          { id: 'iam-permissions',  label: 'Permissions',      path: '/iam/permissions',  icon: Lock },
        ],
      },
      {
        id:    'iam-sessions',
        label: 'Sessions',
        path:  '/iam/sessions',
        icon:  Activity,
        children: [
          { id: 'iam-sessions-actives',    label: 'Sessions actives',  path: '/iam/sessions/actives',    icon: Zap },
          { id: 'iam-sessions-offline',    label: 'Sessions offline',  path: '/iam/sessions/offline',    icon: Activity },
          { id: 'iam-sessions-revocation', label: 'Révocations',       path: '/iam/sessions/revocation', icon: Lock },
        ],
      },
    ],
  },
  {
    id:          'analytics',
    label:       'Analytique',
    path:        '/analytics',
    icon:        BarChart3,
    description: 'Rapports, métriques et tableaux de bord',
    group:       'analytics',
    children: [
      { id: 'analytics-rapports',  label: 'Rapports',      path: '/analytics/rapports',  icon: FileText },
      { id: 'analytics-metriques', label: 'Métriques',     path: '/analytics/metriques', icon: BarChart3 },
      { id: 'analytics-evenements', label: 'Événements',   path: '/analytics/evenements', icon: Bell },
    ],
  },
  {
    id:          'modules',
    label:       'Modules',
    path:        '/modules',
    icon:        Puzzle,
    description: 'Micro-frontends et extensions',
    group:       'core',
    children: [
      { id: 'modules-registre',  label: 'Registre',      path: '/modules/registre',  icon: Database },
      { id: 'modules-clients',   label: 'Clients OAuth', path: '/iam/clients',       icon: Globe },
      { id: 'modules-scopes',    label: 'Scopes',        path: '/iam/scopes',        icon: Key },
    ],
  },
  {
    id:          'settings',
    label:       'Configuration',
    path:        '/settings',
    icon:        Settings,
    description: 'Paramètres de la plateforme',
    group:       'settings',
    children: [
      { id: 'settings-realm',    label: 'Realm Keycloak',    path: '/iam/realm',            icon: Settings },
      { id: 'settings-auth',     label: 'Authentification',  path: '/iam/authentification',  icon: Lock },
      { id: 'settings-profile',  label: 'Mon profil',        path: '/profile',              icon: Users },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────

/**
 * Cherche récursivement un item par son id.
 */
export function findNavigationItem(
  id: string,
  items: NavigationItem[] = navigationData
): NavigationItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findNavigationItem(id, item.children);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Retourne le chemin (breadcrumb) vers un item donné.
 */
export function getNavigationBreadcrumb(
  id: string,
  items: NavigationItem[] = navigationData,
  path: NavigationItem[] = []
): NavigationItem[] {
  for (const item of items) {
    const current = [...path, item];
    if (item.id === id) return current;
    if (item.children) {
      const found = getNavigationBreadcrumb(id, item.children, current);
      if (found.length) return found;
    }
  }
  return [];
}
