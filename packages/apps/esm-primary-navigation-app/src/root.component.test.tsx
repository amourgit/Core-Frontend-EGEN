// ============================================================
// root.component.test.tsx
// Tests de la nouvelle architecture :
//   Root → ThemeProvider → BrowserRouter → NavShell → TopBarContent
//
// Tous les imports sont depuis '@eigen/esm-framework'
// (même chemin que le composant testé).
// ============================================================
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Root from './root.component';

// ── Mocks ─────────────────────────────────────────────────────

let mockPathname = '/home';

vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: any) => <>{children}</>,
  useLocation: () => ({ pathname: mockPathname }),
}));

// ThemeProvider transparent + TopBarContent mocké via esm-framework
vi.mock('@eigen/esm-framework', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    ThemeProvider:  ({ children }: any) => <>{children}</>,
    TopBarContent: () => <div data-testid="compact-topbar">TopBar</div>,
  };
});

// ── Tests ──────────────────────────────────────────────────────
describe('Root (esm-primary-navigation-app)', () => {

  describe('route authentifiée (/home)', () => {
    beforeEach(() => { mockPathname = '/home'; });

    it('monte TopBarContent', () => {
      render(<Root />);
      expect(screen.getByTestId('compact-topbar')).toBeInTheDocument();
    });
  });

  describe('route /login', () => {
    beforeEach(() => { mockPathname = '/login'; });

    it('ne monte PAS TopBarContent (fix whitespace)', () => {
      render(<Root />);
      expect(screen.queryByTestId('compact-topbar')).not.toBeInTheDocument();
    });
  });

  describe('route /logout', () => {
    beforeEach(() => { mockPathname = '/logout'; });

    it('ne monte PAS TopBarContent', () => {
      render(<Root />);
      expect(screen.queryByTestId('compact-topbar')).not.toBeInTheDocument();
    });
  });

  describe('sous-route /login/confirm', () => {
    beforeEach(() => { mockPathname = '/login/confirm'; });

    it('ne monte PAS TopBarContent', () => {
      render(<Root />);
      expect(screen.queryByTestId('compact-topbar')).not.toBeInTheDocument();
    });
  });
});
