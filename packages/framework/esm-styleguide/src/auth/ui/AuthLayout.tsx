// ============================================================
// components/pages/auth/ui/AuthLayout.tsx
// Layout partagé — toutes les pages auth protégées.
// Desktop: sidebar fixe à gauche + topbar
// Mobile: topbar + bottom navigation bar
// ============================================================


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { AuthNavMenu } from './AuthNavMenu';
import { CompactTopBar } from '../../layouts/TopBarContent';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen">
      {/* ── Arrière-plan fixe ─────────────────────────── */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/background1.webp')", opacity: 0.28 }}
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* ── Topbar global (h=45px) ────────────────────── */}
      <CompactTopBar />

      {/* ── Corps sous la topbar ──────────────────────── */}
      <div className="flex" style={{ paddingTop: '45px', minHeight: 'calc(100vh - 45px)' }}>

        {/* ── Sidebar — Desktop uniquement ─────────────── */}
        <motion.aside
          initial={{ x: -16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:flex flex-col w-56 flex-shrink-0 border-r sticky top-[45px] h-[calc(100vh-45px)] overflow-y-auto"
          style={{
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(255,255,255,0.07)',
          }}
        >
          {/* Brand */}
          <div className="px-4 py-4 border-b border-white/6 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #0C115B, #1e3a8a)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-white/80">Mon compte</p>
                <p className="text-xs text-white/30">IAM Local</p>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <div className="flex-1 py-2 overflow-y-auto no-scrollbar">
            <AuthNavMenu />
          </div>
        </motion.aside>

        {/* ── Bouton menu mobile ────────────────────────── */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden fixed bottom-6 right-5 z-40 w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #0C115B, #1e3a8a)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(12,17,91,0.6)',
          }}
        >
          <Menu className="w-5 h-5 text-white" />
        </button>

        {/* ── Drawer mobile ────────────────────────────── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60 z-40 md:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />

              {/* Drawer depuis le bas */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="fixed bottom-0 left-0 right-0 z-50 md:hidden rounded-t-3xl overflow-hidden"
                style={{
                  background: 'rgba(8,8,20,0.96)',
                  backdropFilter: 'blur(30px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  maxHeight: '80vh',
                }}
              >
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full bg-white/20" />
                </div>

                {/* Header drawer */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
                  <span className="text-sm font-semibold text-white/80">Navigation</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white/50 hover:text-white"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Nav dans le drawer */}
                <div className="overflow-y-auto pb-8 no-scrollbar" onClick={() => setMobileMenuOpen(false)}>
                  <AuthNavMenu />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── Contenu principal ─────────────────────────── */}
        <main className="flex-1 overflow-y-auto min-w-0 pb-20 md:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      <style>{`
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
