// ============================================================
// components/pages/auth/ui/AuthNavMenu.tsx
// Navigation latérale du module auth.
// Responsive : utilisé dans sidebar desktop ET drawer mobile.
// ============================================================


import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Shield, Activity, Monitor, KeyRound,
  ShieldCheck, LogOut, ChevronRight,
} from 'lucide-react';
import { useIAMAuth } from '@egen/esm-auth';
import { cn } from '@/lib/utils';

// ── Config de la navigation ───────────────────────────────
interface NavItem {
  href:        string;
  icon:        React.ElementType;
  label:       string;
  description: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/auth/compte',
    icon: User,
    label: 'Mon profil',
    description: 'Informations personnelles',
  },
  {
    href: '/auth/habilitations',
    icon: Shield,
    label: 'Habilitations',
    description: 'Permissions & rôles',
  },
  {
    href: '/auth/sessions',
    icon: Monitor,
    label: 'Sessions',
    description: 'Appareils connectés',
  },
  {
    href: '/auth/journal',
    icon: Activity,
    label: 'Journal',
    description: 'Historique d\'activité',
  },
  {
    href: '/auth/password',
    icon: KeyRound,
    label: 'Mot de passe',
    description: 'Sécurité des credentials',
  },
  {
    href: '/auth/securite',
    icon: ShieldCheck,
    label: 'Sécurité',
    description: 'Supervision & tokens',
  },
];

// ── Composant principal ───────────────────────────────────
export function AuthNavMenu() {
  const { pathname } = useLocation();
  const { user, logout } = useIAMAuth();

  const initials = [user?.prenom?.charAt(0), user?.nom?.charAt(0)]
    .filter(Boolean).join('').toUpperCase()
    || user?.username?.charAt(0)?.toUpperCase()
    || '?';

  const displayName = user?.prenom && user?.nom
    ? `${user.prenom} ${user.nom}`
    : user?.username || 'Utilisateur';

  return (
    <div className="flex flex-col h-full">

      {/* ── Avatar utilisateur ────────────────────────── */}
      <div className="px-3 py-3 mb-1">
        <div
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #0C115B 0%, #1e3a8a 100%)',
              border: '1.5px solid rgba(255,255,255,0.2)',
            }}
          >
            {initials}
          </div>

          {/* Infos */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white/90 truncate">{displayName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div
                className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  user?.statut === 'actif' ? 'bg-green-400 animate-pulse' : 'bg-white/30'
                )}
              />
              <p className="text-xs text-white/35 truncate capitalize">
                {user?.type_profil?.replace('_', ' ') || 'Profil'}
                {user?.is_admin && ' · Admin'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Items de navigation ────────────────────────── */}
      <nav className="flex-1 px-2 space-y-0.5">
        {NAV_ITEMS.map((item, idx) => {
          const isActive = pathname === item.href;
          const Icon     = item.icon;

          return (
            <Link key={item.href} href={item.href} prefetch>
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.2 }}
                whileHover={{ x: isActive ? 0 : 2 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer group',
                  isActive
                    ? 'text-white'
                    : 'text-white/55 hover:text-white/85 hover:bg-white/5'
                )}
                style={isActive ? {
                  background: 'rgba(59,130,246,0.15)',
                  border: '1px solid rgba(59,130,246,0.28)',
                } : {
                  border: '1px solid transparent',
                }}
              >
                {/* Icône */}
                <Icon className={cn(
                  'w-4 h-4 flex-shrink-0 transition-colors',
                  isActive ? 'text-blue-300' : 'text-white/35 group-hover:text-white/60'
                )} />

                {/* Texte */}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm font-medium leading-tight',
                    isActive ? 'text-white' : ''
                  )}>
                    {item.label}
                  </p>
                  {!isActive && (
                    <p className="text-xs text-white/25 truncate leading-tight mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Flèche active */}
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400/50 flex-shrink-0" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* ── Déconnexion ───────────────────────────────── */}
      <div className="px-2 py-2 mt-2 border-t border-white/6">
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-500/8 transition-all group"
          style={{ border: '1px solid transparent' }}
        >
          <LogOut className="w-4 h-4 flex-shrink-0 transition-colors" />
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium">Déconnexion</p>
            <p className="text-xs text-red-400/30 group-hover:text-red-400/50 leading-tight mt-0.5">
              Fermer la session
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
