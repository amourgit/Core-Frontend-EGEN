// ============================================================
// src/modules/IAMModule.tsx — Module IAM chargé via MF
//
// Le Core charge dynamiquement IAMApp depuis le remoteEntry.js
// du microservice IAM (http://localhost:3000/assets/remoteEntry.js)
//
// Usage dans le router Core :
//   <Route path="/iam/*" element={<IAMModule />} />
// ============================================================

import React, { lazy, Suspense } from 'react';
import { useAuthStore }    from '@/stores/auth.store';
import type { CoreContext } from '@/types/core';

// Import MF — résolu par vite-plugin-federation à la compilation
// @ts-ignore — module fédéré, pas de types locaux
const IAMApp = lazy(() => import('iam/App'));

// ── Loader de module ─────────────────────────────────────────
function ModuleLoader({ name }: { name: string }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '100%', minHeight: 400, gap: 16,
    }}>
      <div style={{
        width: 40, height: 40,
        border: '3px solid rgba(99,102,241,0.15)',
        borderTop: '3px solid #6366f1',
        borderRadius: '50%',
        animation: 'core-spin 0.8s linear infinite',
      }} />
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: '#64748b', margin: 0 }}>
          Chargement du module
        </p>
        <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0' }}>{name}</p>
      </div>
      <style>{`@keyframes core-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Écran d'erreur si le remote est inaccessible ──────────────
function ModuleError({ name, error }: { name: string; error: Error }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '100%', minHeight: 400, gap: 12,
    }}>
      <span style={{ fontSize: 40 }}>⚡</span>
      <p style={{ fontSize: 14, fontWeight: 600, color: '#ef4444' }}>
        Module {name} inaccessible
      </p>
      <p style={{ fontSize: 12, color: '#94a3b8', maxWidth: 300, textAlign: 'center' }}>
        {error.message}
      </p>
      <p style={{ fontSize: 11, color: '#cbd5e1', maxWidth: 300, textAlign: 'center' }}>
        Vérifiez que le service IAM tourne sur {import.meta.env.VITE_IAM_URL || 'http://localhost:3000'}
      </p>
    </div>
  );
}

// ── Error boundary pour les modules distants ─────────────────
class ModuleErrorBoundary extends React.Component<
  { name: string; children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null };
  static getDerivedStateFromError(e: Error) { return { error: e }; }
  render() {
    if (this.state.error) {
      return <ModuleError name={this.props.name} error={this.state.error} />;
    }
    return this.props.children;
  }
}

// ── IAMModule ─────────────────────────────────────────────────
export default function IAMModule() {
  const { user, tenant } = useAuthStore();
  const navigate = (path: string) => { window.history.pushState({}, '', path); };

  // CoreContext injecté dans IAM
  const coreContext: CoreContext = {
    user: user ?? {
      id: 'dev', username: 'dev', email: 'dev@ioi.ga',
      roles: ['iam-admin', 'super-admin'], token: 'dev-token', tenantId: 'dev',
    },
    tenant: tenant ?? {
      id: 'dev', subdomain: 'dev', name: 'Dev Tenant',
    },
    basePath:       '/iam',
    navigate,
    hasShellLayout: true,   // Le Core fournit déjà TopBar + Sidebar
    permissions:    user?.roles ?? ['iam-admin'],
  };

  return (
    <ModuleErrorBoundary name="IAM Central">
      <Suspense fallback={<ModuleLoader name="IAM Central" />}>
        <IAMApp
          basePath="/iam"
          embedded={true}
          coreContext={coreContext}
        />
      </Suspense>
    </ModuleErrorBoundary>
  );
}
