// ============================================================
// root.component.test.tsx
// Tests adaptés à la nouvelle architecture :
//   Root → ThemeProvider → BrowserRouter → NavShell → CompactTopBar
// ============================================================
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Root from './root.component';

// ── Mocks globaux ─────────────────────────────────────────────

// BrowserRouter + useLocation mockés
let mockPathname = '/home';
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: any) => <>{children}</>,
  useLocation: () => ({ pathname: mockPathname }),
}));

// ThemeProvider — rendu transparent en test
vi.mock('@eigen/esm-framework', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    ThemeProvider: ({ children }: any) => <>{children}</>,
  };
});

// CompactTopBar — mock léger
vi.mock('@eigen/esm-styleguide/src/layouts/TopBarContent', () => ({
  default: () => <div data-testid="compact-topbar">TopBar</div>,
}));

// ── Tests ──────────────────────────────────────────────────────
describe('Root (esm-primary-navigation-app)', () => {
  describe('sur une route authentifiée (/home)', () => {
    beforeEach(() => { mockPathname = '/home'; });

    it('monte le CompactTopBar', () => {
      render(<Root />);
      expect(screen.getByTestId('compact-topbar')).toBeInTheDocument();
    });
  });

  describe('sur la route /login', () => {
    beforeEach(() => { mockPathname = '/login'; });

    it('ne monte PAS le CompactTopBar (fix whitespace)', () => {
      render(<Root />);
      expect(screen.queryByTestId('compact-topbar')).not.toBeInTheDocument();
    });
  });

  describe('sur la route /logout', () => {
    beforeEach(() => { mockPathname = '/logout'; });

    it('ne monte PAS le CompactTopBar', () => {
      render(<Root />);
      expect(screen.queryByTestId('compact-topbar')).not.toBeInTheDocument();
    });
  });

  describe('sur une sous-route de login (/login/confirm)', () => {
    beforeEach(() => { mockPathname = '/login/confirm'; });

    it('ne monte PAS le CompactTopBar', () => {
      render(<Root />);
      expect(screen.queryByTestId('compact-topbar')).not.toBeInTheDocument();
    });
  });
});
