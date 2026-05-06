// ============================================================
// src/modules/IAMModule.tsx — Module IAM via Module Federation
//
// Le Core charge dynamiquement IAMApp depuis le remoteEntry.js
// du microservice IAM (http://localhost:3000).
//
// Le coreContext est injecté : il contient le token live et
// toutes les informations de session pour que le module IAM
// puisse effectuer ses appels API sans re-authentification.
// ============================================================

import React, { lazy, Suspense, useEffect } from 'react';
import { useAuthStore }    from '@/stores/auth.store';
import { useAuthContext }  from '@/lib/auth/AuthProvider';
import { tokenManager }    from '@/lib/security/token-manager';
import type { CoreContext } from '@/types/core';

// Import MF — résolu par vite-plugin-federation à la compilation
// @ts-ignore — module fédéré, pas de types locaux disponibles
const IAMApp = lazy(() => import('iam/App'));

// ── Loader ────────────────────────────────────────────────────
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
        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--surface-mutedForeground)', margin: 0 }}>
          Chargement du module
        </p>
        <p style={{ fontSize: 12, color: 'var(--surface-mutedForeground)', margin: '4px 0 0', opacity: 0.7 }}>
          {name}
        </p>
      </div>
      <style>{`@keyframes core-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Erreur si remote inaccessible ─────────────────────────────
function ModuleError({ name, error }: { name: string; error: Error }) {
  const iamUrl = import.meta.env.VITE_IAM_URL ?? 'http://localhost:3000';
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '100%', minHeight: 400, gap: 12, padding: 24,
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'rgba(239,68,68,0.10)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 28 }}>⚡</span>
      </div>
      <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--error-500)', margin: 0 }}>
        Module {name} inaccessible
      </p>
      <p style={{ fontSize: 13, color: 'var(--surface-mutedForeground)', maxWidth: 380, textAlign: 'center', margin: 0 }}>
        {error.message}
      </p>
      <p style={{ fontSize: 12, color: 'var(--surface-mutedForeground)', opacity: 0.7, maxWidth: 380, textAlign: 'center', margin: 0 }}>
        Vérifiez que le service IAM tourne sur{' '}
        <code style={{ background: 'var(--surface-muted)', padding: '2px 6px', borderRadius: 4 }}>
          {iamUrl}
        </code>
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: 8, padding: '8px 20px',
          background: 'var(--primary-500)', color: '#fff',
          border: 'none', borderRadius: 'var(--radius-md)',
          cursor: 'pointer', fontSize: 13, fontWeight: 500,
        }}
      >
        Réessayer
      </button>
    </div>
  );
}

// ── Error Boundary ────────────────────────────────────────────
class ModuleErrorBoundary extends React.Component<
  { name: string; children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null };
  static getDerivedStateFromError(e: Error) { return { error: e }; }
  componentDidCatch(error: Error) {
    console.warn(`[Core] Module ${this.props.name} en erreur :`, error.message);
  }
  render() {
    if (this.state.error) {
      return <ModuleError name={this.props.name} error={this.state.error} />;
    }
    return this.props.children;
  }
}

// ── IAMModule principal ────────────────────────────────────────
export default function IAMModule() {
  const { user, tenant } = useAuthStore();
  const { accessToken, permissions, roles } = useAuthContext();

  // Token live depuis tokenManager (source de vérité mémoire)
  const liveToken = tokenManager.getAccessToken() ?? accessToken ?? user?.token ?? 'no-token';

  // Navigation — délègue au router React
  const navigate = (path: string) => { window.history.pushState({}, '', path); };

  // CoreContext transmis au module IAM
  const coreContext: CoreContext = {
    user: user ?? {
      id:       'guest',
      username: 'guest',
      email:    'guest@localhost',
      roles:    ['iam-admin'],
      token:    liveToken,
      tenantId: 'default',
    },
    tenant: tenant ?? {
      id: 'default', subdomain: 'default', name: 'EGEN Platform',
    },
    basePath:       '/iam',
    navigate,
    hasShellLayout: true,   // Core fournit TopBar + Sidebar
    permissions:    permissions.length > 0 ? permissions : (user?.roles ?? []),
  };

  // Synchronise le token live si le module expose une API de sync
  useEffect(() => {
    if (!liveToken || liveToken === 'no-token') return;
    // Emit un event DOM pour que le module IAM puisse se synchroniser
    window.dispatchEvent(new CustomEvent('core:token-updated', {
      detail: { accessToken: liveToken },
    }));
  }, [liveToken]);

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
