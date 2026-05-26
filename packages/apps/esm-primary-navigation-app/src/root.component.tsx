// ============================================================
// esm-primary-navigation-app/src/root.component.tsx
//
// Shell de la barre de navigation principale.
// Utilise TopBarContent (= CompactTopBar) et ThemeProvider
// importés depuis '@eigen/esm-framework' — le seul point
// d'import valide pour les micro-frontends (singleton MF,
// résolu via le exports map du package).
//
// L'ancien import direct :
//   '@eigen/esm-styleguide/src/layouts/TopBarContent'
// n'est PAS dans le exports map → webpack ne peut pas le
// résoudre → build failure TS2307 / module not found.
//
// FIX WHITESPACE :
//   NavShell lit useLocation() et retourne null sur /login
//   et /logout → zéro div dans le flux DOM → zéro espace
//   fantôme en haut de la page de connexion.
// ============================================================

import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { ThemeProvider, TopBarContent } from '@eigen/esm-framework';
import styles from './root.scss';

// ── Routes sans topbar ────────────────────────────────────────
const AUTH_ROUTE_PREFIXES = ['/login', '/logout'];

// ── Contenu interne (a accès au Router context) ───────────────
const NavShell: React.FC = () => {
  const location = useLocation();

  const isAuthRoute = AUTH_ROUTE_PREFIXES.some(
    (prefix) =>
      location.pathname === prefix ||
      location.pathname.startsWith(`${prefix}/`),
  );

  // Auth routes → rien du tout (pas même le div spacer)
  if (isAuthRoute) return null;

  return (
    // Spacer de flux : réserve var(--header-height) dans le document flow.
    // TopBarContent lui-même est position:fixed → hors flux.
    <div className={styles.primaryNavContainer} aria-hidden="true">
      <TopBarContent />
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
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <NavShell />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default Root;
