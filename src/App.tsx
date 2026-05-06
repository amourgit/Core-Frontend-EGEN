import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { ThemeProvider }    from '@/lib/theme';
import { useAuthStore }     from '@/stores/auth.store';
import { useRegistryStore } from '@/stores/registry.store';
import CoreBaseLayout       from '@/components/layouts/CoreBaseLayout';

const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const SettingsPage  = lazy(() => import('@/pages/SettingsPage'));
const ProfilePage   = lazy(() => import('@/pages/ProfilePage'));
const IAMModule     = lazy(() => import('@/modules/IAMModule'));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function useBootstrap() {
  const { setUser, setTenant, setLoading } = useAuthStore();
  const { setManifests, setNavigation }    = useRegistryStore();

  useEffect(() => {
    setUser({
      id: '1', username: 'admin', email: 'admin@ioi.ga',
      prenom: 'Admin', nom: 'EGEN',
      roles: ['super-admin', 'iam-admin'],
      token: 'dev-token', tenantId: 'dev',
    });
    setTenant({
      id: 'dev', subdomain: 'dev', name: 'EGEN Platform Dev',
      theme: { primary: '#6366f1', secondary: '#8b5cf6' },
    });
    setManifests([{
      id: 'iam', label: 'IAM Central',
      description: 'Gestion des identités et accès',
      icon: 'Shield', color: '#6366f1', basePath: '/iam',
      version: '2.0.0', requiredRoles: ['iam-admin', 'super-admin'],
      eager: false, order: 1, defaultEnabled: true, routes: [],
    }]);

    // Charger nav IAM via MF en prod :
    // import('iam/navigation').then(m => setNavigation(m.iamNavItems, m.iamNavGroups))
    // Pour l'instant → nav statique embarquée
    import('@/lib/iam-nav-static').then(m => {
      setNavigation(m.iamNavItems as any, m.iamNavGroups as any);
    });

    setLoading(false);
  }, []);
}

function GlobalLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background gap-4">
      <div className="h-10 w-10 rounded-full border-[3px] border-primary/20 border-t-primary animate-spin" />
      <span className="text-sm text-muted-foreground">Initialisation EGEN Platform...</span>
    </div>
  );
}

function AppContent() {
  useBootstrap();
  const isLoading = useAuthStore(s => s.isLoading);
  if (isLoading) return <GlobalLoader />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CoreBaseLayout />}>
          <Route index element={<Suspense fallback={null}><DashboardPage /></Suspense>} />
          <Route path="iam/*" element={<Suspense fallback={null}><IAMModule /></Suspense>} />
          <Route path="settings/*" element={<Suspense fallback={null}><SettingsPage /></Suspense>} />
          <Route path="profile" element={<Suspense fallback={null}><ProfilePage /></Suspense>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="default" enableDarkMode>
        <AppContent />
        <Toaster position="bottom-right" richColors toastOptions={{ duration: 4000 }} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
