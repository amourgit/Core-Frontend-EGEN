// ============================================================
// src/components/layouts/CoreBaseLayout.tsx
// Shell principal du Core — assemble TopBar + LeftBar + Outlet
// FIXED: TopBar full-width, offsets corrects via CSS vars
// ============================================================

import { Outlet }   from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';

import TopBarContent  from './TopBarContent';
import LeftBarContent from './LeftBarContent';

export default function CoreBaseLayout() {
  return (
    <TooltipProvider>
      <div
        className="min-h-screen text-foreground"
        style={{ background: 'var(--surface-background)' }}
      >
        {/* TopBar — FULL WIDTH, aucun décalage latéral */}
        <TopBarContent />

        {/* Sidebar gauche — fixed, overlay sur le contenu */}
        <LeftBarContent />

        {/* Zone principale — décalée uniquement via padding */}
        <main
          style={{
            position:    'fixed',
            top:         0,
            left:        0,
            width:       '100%',
            height:      '100%',
            overflowY:   'auto',
            overflowX:   'hidden',
            paddingLeft: '3.05rem',
            paddingTop:  'var(--header-height, 64px)',
            boxSizing:   'border-box',
          }}
        >
          <div style={{ minHeight: '100%' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
