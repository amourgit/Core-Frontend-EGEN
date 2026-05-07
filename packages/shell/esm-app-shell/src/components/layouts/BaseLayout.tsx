// ============================================================
// components/layouts/BaseLayout.tsx
// Layout principal du Core — assemble TopBar + LeftBar + Outlet
//
// Gère :
//  - L'état collapsed/étendu de la sidebar
//  - L'état open/close de la sidebar mobile
//  - Le padding dynamique du contenu selon l'état sidebar
//  - La zone de contenu où sont rendus les modules MF
// ============================================================

import { useState } from 'react';
import { Outlet }   from 'react-router-dom';
import { motion }   from 'framer-motion';

import TopBar  from './TopBar';
import LeftBar from './LeftBar';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function BaseLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">

        {/* TopBar fixe en haut */}
        <TopBar
          onToggleSidebar={() => setMobileSidebarOpen(o => !o)}
          sidebarOpen={mobileSidebarOpen}
        />

        {/* Sidebar gauche */}
        <LeftBar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(o => !o)}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        {/* Zone de contenu principale */}
        {/* On compense : pt-11 (TopBar) + pl dynamique (LeftBar) */}
        <motion.main
          animate={{
            paddingLeft: sidebarCollapsed ? 52 : 220,
          }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="pt-11 min-h-screen hidden lg:block"
        >
          <div className="h-full">
            <Outlet />
          </div>
        </motion.main>

        {/* Zone de contenu mobile (pas de décalage sidebar) */}
        <main className="pt-11 lg:hidden min-h-screen">
          <Outlet />
        </main>

      </div>
    </TooltipProvider>
  );
}
