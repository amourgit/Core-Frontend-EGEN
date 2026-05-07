# EGEN Core Frontend

## Structure du Projet

Le projet utilise une architecture monorepo avec le code source principal situé dans :
```
packages/shell/esm-app-shell/src/
```

## Prérequis

- Node.js 18+
- npm ou yarn

## Installation

```bash
# Installation des dépendances principales
npm install

# Installation des dépendances du framework
cd packages/framework
npm install

# Installation des dépendances du shell
cd ../shell/esm-app-shell
npm install
```

## Démarrage du Projet

### Option 1 : Depuis la racine (recommandé)

```bash
# Retourner à la racine du projet
cd ../../..

# Démarrer le serveur de développement
npm run dev
```

### Option 2 : Directement dans le shell

```bash
# Naviguer vers le shell
cd packages/shell/esm-app-shell

# Démarrer le serveur de développement
npm run start
```

## Scripts Disponibles

- `npm run dev` : Démarre le serveur de développement sur le port 3001
- `npm run build` : Compile le projet pour la production
- `npm run preview` : Prévisualise le build de production
- `npm run type-check` : Vérifie les types TypeScript

## Architecture

- **Framework** : `packages/framework/` - Modules du cœur du framework
- **Shell** : `packages/shell/esm-app-shell/` - Application principale
- **Source** : `packages/shell/esm-app-shell/src/` - Code source de l'application

## Configuration

Les fichiers de configuration principaux ont été mis à jour pour pointer vers la nouvelle structure :
- `package.json` : Scripts mis à jour
- `tsconfig.json` : Chemins d'includes et alias ajustés
- `vite.config.ts` : Configuration pour le shell
- `index.html` : Point d'entrée mis à jour

## Développement

Le serveur de développement démarrera sur `http://localhost:3001` avec hot-reload et support du module federation.
