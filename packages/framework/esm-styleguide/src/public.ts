export { type StyleguideConfigObject } from './config-schema';
export * from './cards';
export * from './custom-overflow-menu';
export * from './dashboard-extension';
export * from './datepicker';
export * from './diagnosis-tags';
export * from './empty-card';
export * from './error-state';
export * from './icons/icons';
export * from './left-nav';
export * from './location-picker';
export * from './numeric-observation';
export { showModal } from './modals';
export { showNotification, showActionableNotification } from './notifications';
export {
  type ActionableNotificationDescriptor,
  type ActionableNotificationType,
} from './notifications/actionable-notification.component';
export { type NotificationDescriptor, type InlineNotificationType } from './notifications/notification.component';
export * from './page-header';
export * from './pagination';
export * from './patient-banner';
export * from './patient-photo';
export * from './pictograms/pictograms';
export * from './responsive-wrapper';
export { showSnackbar, type SnackbarDescriptor, type SnackbarType, type SnackbarMeta } from './snackbars';
export { showToast, type ToastDescriptor, type ToastType, type ToastNotificationMeta } from './toasts';
export * from './workspaces/public';
export {
  launchWorkspace2,
  launchWorkspaceGroup2,
  closeWorkspaceGroup2,
  getRegisteredWorkspace2Names,
  useWorkspace2Context,
  ActionMenuButton2,
  Workspace2,
  type Workspace2Definition,
  type Workspace2DefinitionProps,
} from './workspaces2';

// ============================================================
// Eegen — Core Extensions (Theme, UI, Auth, Layouts, Hooks)
// ============================================================

// Theme System (explicit to avoid conflict with hooks/index useTheme)
export {
  ThemeProvider,
  ThemeSwitcher,
  DarkModeToggle,
  ThemeColorPreview,
  useTheme,
  useThemeEvents,
  useThemeVariables,
  ThemeInitScript,
  ThemeLoader,
  themeUtils,
  type ThemeContextType,
  type Theme,
  type ThemeColors,
  type ThemeTypography,
  type ThemeLayout,
  type ThemeSpacing,
  type ThemeAnimation,
  type ThemeChangeEvent,
  type ThemeStorage,
} from './theme/index';

// UI Components
export * from './ui/index';

// Layout Components (explicit to avoid conflict with page-header)
export { BaseLayout, CoreBaseLayout, BaseContent, TopBar, LeftBar, LeftBarContent, TopBarContent,
  RightBarContent, StaggeredMenu, StaggeredMenuButton, AnimateAgentAI,
  BasePage, Frame, Section } from './layouts/index';

// Cards (explicit to avoid conflict with ./cards top-level export)
export { GlassTimeCard, UserProfileCard, CardHeader } from './cards/index';

// Fields
export { DynamicField } from './fields/index';

// Hooks (explicit - useTheme already exported from theme)
export { useAuth, useIAMAuth, useKeycloakSession,
  usePermissions, useSessionMonitor } from '@egen/esm-auth';

export { useGlass } from './hooks/useGlass';

// Auth UI System
export * from './auth/index';
