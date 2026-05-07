// ============================================================
// components/pages/auth/LogoutPageContent.tsx
// Page de déconnexion avec animation de sortie.
// Appelée quand l'utilisateur clique "Se déconnecter".
// Révoque la session serveur puis redirige vers /auth/login.
// ============================================================


import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldOff, Loader2 } from 'lucide-react';
import { useIAMAuth } from '@/hooks/useIAMAuth';

export default function LogoutPageContent() {
  const { logout } = useIAMAuth();

  // Déconnexion automatique au montage de la page
  useEffect(() => {
    // Petit délai pour laisser l'animation se lancer
    const timer = setTimeout(() => {
      logout();
    }, 1200);
    return () => clearTimeout(timer);
  }, [logout]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fond */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/background1.webp')", opacity: 0.6 }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/70" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 text-center px-8"
      >
        {/* Icône */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
          style={{
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <ShieldOff className="w-10 h-10 text-red-400" />
        </motion.div>

        <h1 className="text-2xl font-bold text-white mb-2">Déconnexion en cours</h1>
        <p className="text-white/50 text-sm mb-6">
          Votre session est en train d'être révoquée en toute sécurité...
        </p>

        <div className="flex items-center justify-center gap-2 text-white/40">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Fermeture de la session IAM</span>
        </div>
      </motion.div>
    </div>
  );
}
