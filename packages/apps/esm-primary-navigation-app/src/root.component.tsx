// ============================================================
// esm-primary-navigation-app/src/root.component.tsx
//
// Shell de la barre de navigation principale.
// Remplace l'ancien système Carbon Header par CompactTopBar
// du styleguide EIGEN, entièrement piloté par les CSS vars
// du système de thème dynamique.
//
// FIX WHITESPACE :
//   NavShell détecte les routes /login et /logout et retourne
//   null → aucun div conteneur n'est injecté dans le DOM,
//   donc ZÉRO hauteur fantôme sur la page de login.
//
// ARCHITECTURE :
//   ThemeProvider  →  BrowserRouter  →  NavShell
//   NavShell écoute useLocation() (accessible car il est fils
//   de BrowserRouter) et monte CompactTopBar seulement sur les
//   routes authentifiées.
// ============================================================

import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@eigen/esm-framework';
import CompactTopBar    from '@eigen/esm-styleguide/src/layouts/TopBarContent';
import styles           from './root.scss';

// ── Routes où la topbar NE doit PAS apparaître ───────────────
const AUTH_ROUTE_PREFIXES = ['/login', '/logout'];

// ── Contenu interne : a accès au contexte Router ─────────────
const NavShell: React.FC = () => {
  const location = useLocation();

  const isAuthRoute = AUTH_ROUTE_PREFIXES.some((prefix) =>
    location.pathname === prefix ||
    location.pathname.startsWith(`${prefix}/`)
  );

  // Sur les routes login/logout → on rend RIEN (pas même le div
  // conteneur) pour éviter l'espace blanc de var(--header-height).
  if (isAuthRoute) return null;

  return (
    // Ce div réserve la hauteur dans le flux du document
    // (CompactTopBar est position:fixed, il ne l'occupe pas lui-même).
    <div className={styles.primaryNavContainer} aria-hidden="true">
      <CompactTopBar />
    </div>
  );
};

// ── Root MFE ─────────────────────────────────────────────────
const Root: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="default" enableDarkMode>
      <BrowserRouter
        basename={window.getEgenSpaBase()}
        future={{
          v7_startTransition:  true,
          v7_relativeSplatPath: true,
        }}
      >
        <NavShell />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default Root;
