# @eigen/esm-auth

Package d'authentification et IAM pour le Core EIGEN.

## Architecture

```
src/
├── lib/
│   ├── auth-provider.tsx    # React Context Provider (AuthProvider)
│   ├── auth-store.ts        # Re-exports & tokenStore
│   ├── auth-store.types.ts  # AuthContextType
│   ├── subdomain-resolver.ts
│   ├── realm-resolver.ts
│   └── iam-nav-static.ts
├── security/
│   ├── token-manager.ts     # Tokens en mémoire (JAMAIS localStorage)
│   ├── cookie-manager.ts    # Cookie miroir session_active
│   ├── jwt-verifier.ts      # Décodage & validation JWT
│   ├── audit-logger.ts      # Journal des événements sécurité
│   └── constants.ts
├── models/
│   └── auth.model.ts        # CurrentUser, LoginResponse, SessionResponse
├── services/
│   ├── auth.service.ts      # getSession, logoutAndClean, scheduleTokenRefresh
│   └── http-client.ts       # httpClient avec intercepteur auth
├── hooks/
│   ├── useAuth.ts
│   ├── useIAMAuth.ts
│   ├── usePermissions.ts
│   ├── useKeycloakSession.ts
│   └── useSessionMonitor.ts
├── store/
│   ├── auth.store.ts        # Zustand store auth
│   └── registry.store.ts    # Zustand store modules
├── types.ts                 # CoreConfig, MicrofrontendConfig
├── utils-iam.ts
└── index.ts                 # Barrel export principal
```

## Usage

```tsx
// Dans le CORE (shell)
import { AuthProvider } from '@eigen/esm-auth';

function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}

// Dans un Micro-frontend
import { useAuthContext, usePermissions, tokenManager } from '@eigen/esm-auth';

function MyComponent() {
  const { user, isAuthenticated, hasPermission } = useAuthContext();
  const { hasRole } = usePermissions();

  if (!isAuthenticated) return <Redirect to="/login" />;
  return <div>Bienvenue {user?.prenom}</div>;
}
```

## Sécurité

- Tokens **JAMAIS** en localStorage
- Access token **en mémoire** uniquement
- Refresh token dans **cookie HttpOnly** géré par le serveur
- Cookie miroir `session_active` pour savoir si une session existe
