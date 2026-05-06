# Core Frontend — EGEN Platform

> **React 18 + Vite 6 + TypeScript + Module Federation (Host)**

## Architecture

```
Core (host, port 3001)
├── BaseLayout (TopBar + Sidebar)
├── /           → DashboardPage
├── /iam/*      → IAMModule  ──→  iam/App (MF remote, port 3000)
├── /scolarite/* → ScolariteModule (à venir)
└── /settings/* → SettingsPage
```

## Stack

- **Vite 6** + `@originjs/vite-plugin-federation` (host)
- **React 18** + TypeScript + Tailwind CSS
- **Zustand** (stores auth + registry)
- **React Query** (cache API)
- **Framer Motion** (animations)
- **react-router-dom v6** (routing)

## Développement

```bash
# 1. Démarrer IAM en mode remote (OBLIGATOIRE AVANT LE CORE)
cd ../IAM-Central--Frontend && npm run dev   # build:watch + preview :3000

# 2. Démarrer le Core
npm run dev   # vite :3001
```

## Intégration d'un nouveau module

1. Démarrer le remote sur son port
2. Ajouter dans `vite.config.ts` :
   ```ts
   remotes: {
     scolarite: 'http://localhost:3002/assets/remoteEntry.js',
   }
   ```
3. Créer `src/modules/ScolariteModule.tsx`
4. Ajouter la route dans `App.tsx`
5. Enregistrer le manifest dans `useBootstrap()`
