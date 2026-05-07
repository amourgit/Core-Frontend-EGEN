# EIGEN Core — Architecture Shared Package System

## Structure des packages

```
packages/
├── framework/
│   ├── esm-auth/          @eigen/esm-auth        ← Authentification IAM / Keycloak
│   ├── esm-theme/         @eigen/esm-theme       ← Système de thème CSS Variable
│   ├── esm-styleguide/    @eigen/esm-styleguide  ← Composants UI + Layouts + Hooks
│   ├── esm-api/           @eigen/esm-api         ← HTTP client & OpenMRS API
│   ├── esm-config/        @eigen/esm-config      ← Config modulaire
│   ├── esm-extensions/    @eigen/esm-extensions  ← Extension slots (MF)
│   ├── esm-navigation/    @eigen/esm-navigation  ← Router & breadcrumbs
│   ├── esm-react-utils/   @eigen/esm-react-utils ← Hooks React utilitaires
│   ├── esm-state/         @eigen/esm-state       ← Zustand global store
│   └── esm-framework/     @eigen/esm-framework   ← Re-export central
├── shell/
│   └── esm-app-shell/                            ← Shell principal (Single SPA)
├── apps/
│   ├── esm-login-app/                            ← Module Login
│   ├── esm-primary-navigation-app/               ← Navigation principale
│   └── ...
└── tooling/
    └── openmrs/                                  ← CLI & Webpack/Rspack configs
```

## Philosophie : "Code Once, Use Everywhere"

**AVANT (mauvais) :**
```tsx
// Réécrire le même code dans chaque micro-frontend
const tokenManager = { ... }; // Copié-collé partout
const useTheme = () => { ... }; // Dupliqué dans chaque MF
```

**APRÈS (correct) :**
```tsx
// Dans le CORE ou n'importe quel Micro-frontend
import { tokenManager, useAuth }     from '@eigen/esm-auth';
import { useTheme, ThemeProvider }   from '@eigen/esm-theme';
import { Button, CoreBaseLayout }    from '@eigen/esm-styleguide';
import { useOpenmrsFetch }           from '@eigen/esm-react-utils';
```

## Arbre des dépendances des packages

```
@eigen/esm-framework    ← Re-export de tout
├── @eigen/esm-auth         ← Auth / IAM / Keycloak
├── @eigen/esm-theme        ← Thème / Dark mode / Glass
├── @eigen/esm-styleguide   ← UI Components + Layouts
├── @eigen/esm-api          ← HTTP Client
├── @eigen/esm-config       ← Config modulaire
├── @eigen/esm-extensions   ← Extension system
├── @eigen/esm-navigation   ← Routing
├── @eigen/esm-react-utils  ← Hooks
├── @eigen/esm-state        ← State (Zustand)
└── @eigen/esm-utils        ← Utilitaires purs
```

## Convention d'import dans un Micro-frontend

```tsx
// ✅ Correct — depuis le package partagé
import { useAuthContext }   from '@eigen/esm-auth';
import { Button, Badge }    from '@eigen/esm-styleguide';
import { useTheme }         from '@eigen/esm-theme';
import { navigate }         from '@eigen/esm-navigation';

// ❌ Interdit — code local dupliqué
import { useAuth }    from '../../lib/auth'; // NON
import { Button }     from '../../components/button'; // NON
```

## Système de permissions niveau frontend

```tsx
import { useAuthContext, usePermissions } from '@eigen/esm-auth';

function AdminPanel() {
  const { hasPermission, hasRole } = useAuthContext();
  const { canAccess }              = usePermissions();

  // Permission fine
  if (!hasPermission('admin:users:write')) return <Forbidden />;

  // Rôle
  if (!hasRole('ROLE_ADMIN'))   return <Forbidden />;

  return <AdminUI />;
}
```
