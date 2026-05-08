# EGEN Core — Architecture Shared Package System

## Structure des packages

```
packages/
├── framework/
│   ├── esm-auth/          @egen/esm-auth        ← Authentification IAM / Keycloak
│   ├── esm-theme/         @egen/esm-theme       ← Système de thème CSS Variable
│   ├── esm-styleguide/    @egen/esm-styleguide  ← Composants UI + Layouts + Hooks
│   ├── esm-api/           @egen/esm-api         ← HTTP client & OpenMRS API
│   ├── esm-config/        @egen/esm-config      ← Config modulaire
│   ├── esm-extensions/    @egen/esm-extensions  ← Extension slots (MF)
│   ├── esm-navigation/    @egen/esm-navigation  ← Router & breadcrumbs
│   ├── esm-react-utils/   @egen/esm-react-utils ← Hooks React utilitaires
│   ├── esm-state/         @egen/esm-state       ← Zustand global store
│   └── esm-framework/     @egen/esm-framework   ← Re-export central
├── shell/
│   └── esm-app-shell/                            ← Shell principal (Single SPA)
├── apps/
│   ├── esm-login-app/                            ← Module Login
│   ├── esm-primary-navigation-app/               ← Navigation principale
│   └── ...
└── tooling/
    └── egen/                                  ← CLI & Webpack/Rspack configs
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
import { tokenManager, useAuth }     from '@egen/esm-auth';
import { useTheme, ThemeProvider }   from '@egen/esm-theme';
import { Button, CoreBaseLayout }    from '@egen/esm-styleguide';
import { useEgenFetch }           from '@egen/esm-react-utils';
```

## Arbre des dépendances des packages

```
@egen/esm-framework    ← Re-export de tout
├── @egen/esm-auth         ← Auth / IAM / Keycloak
├── @egen/esm-theme        ← Thème / Dark mode / Glass
├── @egen/esm-styleguide   ← UI Components + Layouts
├── @egen/esm-api          ← HTTP Client
├── @egen/esm-config       ← Config modulaire
├── @egen/esm-extensions   ← Extension system
├── @egen/esm-navigation   ← Routing
├── @egen/esm-react-utils  ← Hooks
├── @egen/esm-state        ← State (Zustand)
└── @egen/esm-utils        ← Utilitaires purs
```

## Convention d'import dans un Micro-frontend

```tsx
// ✅ Correct — depuis le package partagé
import { useAuthContext }   from '@egen/esm-auth';
import { Button, Badge }    from '@egen/esm-styleguide';
import { useTheme }         from '@egen/esm-theme';
import { navigate }         from '@egen/esm-navigation';

// ❌ Interdit — code local dupliqué
import { useAuth }    from '../../lib/auth'; // NON
import { Button }     from '../../components/button'; // NON
```

## Système de permissions niveau frontend

```tsx
import { useAuthContext, usePermissions } from '@egen/esm-auth';

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
