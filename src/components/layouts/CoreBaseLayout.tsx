// ============================================================
// src/components/layouts/CoreBaseLayout.tsx
// Shell principal du Core — réutilise les vrais layouts IAM
//
// Assemble : TopBarContent (IAM) + LeftBarContent (IAM) + Outlet
// C'est ce layout que tous les modules voient comme leur shell.
// ============================================================

import { useState } from 'react';
import { Outlet }   from 'react-router-dom';
import { motion }   from 'framer-motion';
import { TooltipProvider } from '@/components/ui/tooltip';

// ── Layouts IAM copiés et adaptés React ──────────────────────
import TopBarContent  from './TopBarContent';
import LeftBarContent from './LeftBarContent';

export default function CoreBaseLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen]             = useState(false);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground">

        {/* TopBar — barre supérieure fixe */}
        <TopBarContent
          className={sidebarCollapsed ? '' : 'pl-[3.05rem] lg:pl-[15rem]'}
        />

        {/* Sidebar gauche */}
        <LeftBarContent />

        {/* Zone de contenu principale */}
        {/* pl = largeur sidebar (40px fermé / 15rem ouvert) + pt = hauteur topbar */}
        <main
          className="fixed top-0 left-0 w-full h-full overflow-auto"
          style={{
            paddingLeft: '40px',     // largeur sidebar fermée par défaut
            paddingTop:  '45px',     // hauteur topbar
          }}
        >
          <div className="h-full">
            <Outlet />
          </div>
        </main>

      </div>
    </TooltipProvider>
  );
}
