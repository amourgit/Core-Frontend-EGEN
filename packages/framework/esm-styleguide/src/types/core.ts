// Re-export canonical types from esm-auth (single source of truth)
export type {
  MicroserviceManifest,
  MicroNavItem,
  MicroNavGroup,
  TenantConfig,
} from '@egen/esm-auth';

// Additional UI-specific types
import type React from 'react';

export interface NavItem {
  id?: string;
  label: string;
  href?: string;
  to?: string;
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  children?: NavItem[];
  badge?: string | number;
  disabled?: boolean;
  external?: boolean;
  roles?: string[];
  permissions?: string[];
}

export interface CoreConfig {
  basename?: string;
  apiBase?: string;
  realm?: string;
  theme?: 'dark' | 'light' | 'system';
}

export type { NavItem as NavigationItem };
