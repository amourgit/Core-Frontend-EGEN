// ============================================================
// App.tsx — Point d'entrée React du Core Frontend
//
// Architecture :
//  QueryClientProvider → ThemeProvider → AuthProvider → Router
//
// Routes :
//  /login        — Page de connexion (publique)
//  /             — Shell principal (protégé)
//  /iam/*        — Module IAM (micro-frontend, protégé)
//  /settings/*   — Paramètres (protégé)
//  /profile      — Profil (protégé)
// ============================================================

import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { ThemeProvider }    from '@/lib/theme';
import { AuthProvider, useAuthContext } from '@/lib/auth/AuthProvider';
import { useAuthStore }     from '@/stores/auth.store';
import { useRegistryStore } from '@/stores/registry.store';
import CoreBaseLayout       from '@/components/layouts/CoreBaseLayout';

const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const SettingsPage  = lazy(() => import('@/pages/SettingsPage'));
const ProfilePage   = lazy(() => import('@/pages/ProfilePage'));
const LoginPage     = lazy(() => import('@/pages/LoginPage'));
const IAMModule     = lazy(() => import('@/modules/IAMModule'));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

// ── Loader global ─────────────────────────────────────────────
function GlobalLoader({ message = 'Initialisation...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center" style={{ background: 'var(--surface-background)' }}>
      <div className="h-10 w-10 rounded-full border-[3px] border-primary/20 border-t-primary animate-spin mb-4" />
      <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--surface-mutedForeground)' }}>
        {message}
      </span>
    </div>
  );
}

// ── Guard de route — redirige vers /login si non authentifié ──
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthContext();
  if (isLoading) return <GlobalLoader message="Vérification de la session..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// ── Navigation statique IAM (toujours chargée) ────────────────
function useRegistryBootstrap() {
  const { setManifests, setNavigation } = useRegistryStore();

  useEffect(() => {
    setManifests([{
      id: 'iam', label: 'IAM Central',
      description: 'Gestion des identités et accès',
      icon: 'Shield', color: '#6366f1', basePath: '/iam',
      version: '2.0.0', requiredRoles: ['iam-admin', 'super-admin'],
      eager: false, order: 1, defaultEnabled: true, routes: [],
    }]);
    import('@/lib/iam-nav-static').then(m => {
      setNavigation(m.iamNavItems as any, m.iamNavGroups as any);
    }).catch(() => {/* nav statique manquante — non bloquant */});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

// ── Tenant bootstrap (à remplacer par un appel API) ───────────
function useTenantBootstrap() {
  const { setTenant } = useAuthStore();
  useEffect(() => {
    setTenant({
      id: 'default', subdomain: 'default', name: 'EGEN Platform',
      theme: { primary: '#6366f1', secondary: '#8b5cf6' },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

// ── Contenu de l'app (router) ─────────────────────────────────
function AppContent() {
  useRegistryBootstrap();
  useTenantBootstrap();

  return (
    <BrowserRouter>
      <Routes>
        {/* Route publique */}
        <Route
          path="/login"
          element={
            <Suspense fallback={<GlobalLoader />}>
              <LoginPage />
            </Suspense>
          }
        />

        {/* Routes protégées */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <CoreBaseLayout />
            </RequireAuth>
          }
        >
          <Route
            index
            element={<Suspense fallback={null}><DashboardPage /></Suspense>}
          />
          <Route
            path="iam/*"
            element={<Suspense fallback={null}><IAMModule /></Suspense>}
          />
          <Route
            path="settings/*"
            element={<Suspense fallback={null}><SettingsPage /></Suspense>}
          />
          <Route
            path="profile"
            element={<Suspense fallback={null}><ProfilePage /></Suspense>}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        {/* Fallback global */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// ── App racine ────────────────────────────────────────────────
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="default" enableDarkMode>
        <BrowserRouterAuthBridge>
          <AppContent />
        </BrowserRouterAuthBridge>
        <Toaster position="bottom-right" richColors toastOptions={{ duration: 4000 }} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// ── Bridge : AuthProvider a besoin de useNavigate → il doit être
//    à l'intérieur du router. On enveloppe AppContent (qui contient
//    le BrowserRouter) dans un wrapper qui fournit AuthProvider
//    APRÈS l'init du router grâce à ce pattern.
// ─────────────────────────────────────────────────────────────

function BrowserRouterAuthBridge({ children }: { children: React.ReactNode }) {
  // Logout redirige vers /login — géré ici car on a accès au navigate
  // après que le BrowserRouter est monté à l'intérieur de children.
  return (
    <AuthProvider
      autoHydrate
      // Le onLogout sera appelé après le montage du router dans AppContent
      // => on utilise window.location pour la redirection initiale
      onLogout={() => { window.location.href = '/login'; }}
    >
      {children}
    </AuthProvider>
  );
}
