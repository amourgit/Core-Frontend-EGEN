// ============================================================
// components/pages/auth/ComptePageContent.tsx
// Profil utilisateur connecté — données réelles du backend
// GET /compte/moi | GET /habilitations/moi | GET /audit/moi
// ============================================================


import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Shield, ShieldCheck, Clock, KeyRound, LogOut, RefreshCw,
  ChevronRight, CheckCircle2, Monitor, Activity,
  Hash, Mail, Phone, Building, Calendar, Loader2,
  Copy, Check, AlertCircle, Users,
} from 'lucide-react';
import { useIAMAuth, useJournal } from '@egen/esm-auth';
import { profilService } from '@egen/esm-auth';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import type { JournalEntry, PermissionEffective } from '@egen/esm-auth';
import { AuthLayout } from './ui/AuthLayout';
import { GlassTimeCard } from "@/components/cards/glass-time-card"

// ── Copier dans le presse-papier ──────────────────────────
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.membreboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="p-1 text-white/30 hover:text-white/60 transition-colors">
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

// ── Card info ─────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, copyable = false }: {
  icon: React.ElementType; label: string; value?: string | null; copyable?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
      <Icon className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
      <span className="text-xs text-white/40 w-36 flex-shrink-0">{label}</span>
      <span className="text-sm text-white/80 flex-1 truncate font-medium">
        {value || <span className="text-white/25 italic font-normal">Non renseigné</span>}
      </span>
      {copyable && value && <CopyButton value={value} />}
    </div>
  );
}

// ── Badge statut ──────────────────────────────────────────
function StatutBadge({ statut }: { statut?: string }) {
  const map: Record<string, { color: string; bg: string; border: string }> = {
    actif:    { color: 'text-green-400',  bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.3)' },
    suspendu: { color: 'text-orange-400', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)' },
    inactif:  { color: 'text-red-400',    bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)' },
    supprime: { color: 'text-red-500',    bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)' },
  };
  const s = map[(statut || 'actif').toLowerCase()] || map.actif;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${s.color}`}
      style={{ background: s.bg, border: `1px solid ${s.border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {statut || 'Actif'}
    </span>
  );
}

// ── Section habilitations ─────────────────────────────────
function HabilitationsSection() {
  const { permissions, roles } = useIAMAuth();
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-white/35 uppercase tracking-wider mb-2">Rôles actifs ({roles.length})</p>
        <div className="flex flex-wrap gap-1.5">
          {roles.length > 0 ? roles.map((r) => (
            <span key={r} className="px-2.5 py-1 rounded-lg text-xs text-blue-300 font-medium"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
            >{r}</span>
          )) : (
            <span className="text-xs text-white/25 italic">Aucun rôle assigné</span>
          )}
        </div>
      </div>
      <div>
        <p className="text-xs text-white/35 uppercase tracking-wider mb-2">Permissions ({permissions.length})</p>
        <div className="flex flex-wrap gap-1.5">
          {permissions.slice(0, 10).map((p) => (
            <span key={p} className="px-2 py-0.5 rounded text-xs text-white/45 font-mono"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
            >{p}</span>
          ))}
          {permissions.length > 10 && (
            <Link href="/auth/habilitations" className="text-xs text-white/25 hover:text-white/50 self-center">
              +{permissions.length - 10} autres
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Section journal ───────────────────────────────────────
function JournalSection() {
  const { entries, isLoading, error } = useJournal(5);
  if (isLoading) return <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-white/25" /></div>;
  if (error) return <p className="text-xs text-red-400 py-2">{error}</p>;
  if (entries.length === 0) return <p className="text-xs text-white/25 italic py-2">Aucune activité récente</p>;

  return (
    <div className="space-y-1.5">
      {entries.map((e: JournalEntry) => (
        <div key={e.id} className="flex items-center gap-3 py-1.5 px-2 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.02)' }}
        >
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${e.autorise ? 'bg-green-400' : 'bg-red-400'}`} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/65 truncate">{e.type_action}</p>
            <p className="text-xs text-white/30">{e.module || '—'}</p>
          </div>
          <span className="text-xs text-white/20 flex-shrink-0">
            {e.timestamp ? new Date(e.timestamp).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : ''}
          </span>
        </div>
      ))}
      <Link href="/auth/journal" className="block text-center text-xs text-blue-400/60 hover:text-blue-400 mt-2 transition-colors">
        Voir tout l'historique →
      </Link>
    </div>
  );
}

// ── Contenu principal ─────────────────────────────────────
function CompteMainContent() {
  const { user, logout, refreshUser, permissions, roles } = useIAMAuth();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const initials = [user?.prenom?.charAt(0), user?.nom?.charAt(0)].filter(Boolean).join('').toUpperCase()
    || user?.username?.charAt(0)?.toUpperCase() || '?';
  const displayName = user?.prenom && user?.nom ? `${user.prenom} ${user.nom}` : user?.username || 'Utilisateur';

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshUser();
    setIsRefreshing(false);
    toast({ variant: 'success', title: 'Profil actualisé', duration: 2000 });
  };

  const handleLogout = async () => {
    toast({ variant: 'info', title: 'Déconnexion...', duration: 1500 });
    await logout();
  };

  return (
    <div className="p-5 max-w-2xl mx-auto space-y-5">

      {/* ── Avatar + infos principales ─────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #0C115B 0%, #1e3a8a 100%)', border: '2px solid rgba(255,255,255,0.15)' }}
          >{initials}</div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-semibold text-white">{displayName}</h1>
              <StatutBadge statut={user?.statut} />
              {user?.is_admin && (
                <span className="px-2 py-0.5 rounded-full text-xs text-amber-300 font-medium"
                  style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}
                >Admin</span>
              )}
            </div>
            <p className="text-white/40 text-sm mt-0.5">@{user?.username || '—'}</p>
            <p className="text-white/30 text-xs mt-0.5 capitalize">{user?.type_profil?.replace('_', ' ') || '—'}</p>
          </div>

          <button onClick={handleRefresh} disabled={isRefreshing}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/35 hover:text-white/65 transition-colors flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* ── Informations ──────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="rounded-2xl px-5 pt-4 pb-2"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
      >
        <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
          <User className="w-3.5 h-3.5" /> Informations du compte
        </p>
        <InfoRow icon={Hash} label="ID Profil" value={user?.id} copyable />
        <InfoRow icon={User} label="Identifiant" value={user?.username} />
        <InfoRow icon={Mail} label="Email" value={user?.email} />
        <InfoRow icon={Phone} label="Téléphone" value={user?.telephone} />
        <InfoRow icon={Hash} label="N° Identifiant" value={user?.identifiant_national} copyable />
        <InfoRow icon={Building} label="Type de profil" value={user?.type_profil} />
        <InfoRow icon={Calendar} label="Première connexion"
          value={user?.premiere_connexion ? new Date(user.premiere_connexion).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : undefined}
        />
        <InfoRow icon={Clock} label="Dernière connexion"
          value={user?.derniere_connexion ? new Date(user.derniere_connexion).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : undefined}
        />
        {user?.raison_suspension && (
          <div className="flex items-start gap-2 py-2 mt-1 rounded-lg px-3"
            style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.15)' }}
          >
            <AlertCircle className="w-3.5 h-3.5 text-orange-400 mt-0.5" />
            <div>
              <p className="text-xs text-orange-400 font-medium">Compte suspendu</p>
              <p className="text-xs text-orange-300/70">{user.raison_suspension}</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Habilitations ─────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-3.5 h-3.5" /> Mes habilitations
          </p>
          <Link href="/auth/habilitations" className="text-xs text-blue-400/60 hover:text-blue-400 flex items-center gap-1 transition-colors">
            Détail <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <HabilitationsSection />
      </motion.div>

      {/* ── Activité récente ───────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" /> Activité récente
          </p>
          <Link href="/auth/journal" className="text-xs text-blue-400/60 hover:text-blue-400 flex items-center gap-1 transition-colors">
            Tout voir <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <JournalSection />
      </motion.div>

      {/* ── Actions ───────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        {[
          { href: '/auth/password',    icon: KeyRound,     label: 'Changer le mot de passe' },
          { href: '/auth/sessions',     icon: Monitor,      label: 'Gérer mes sessions actives' },
          { href: '/auth/habilitations',icon: Shield,       label: 'Mes habilitations complètes' },
          { href: '/auth/journal',      icon: Activity,     label: 'Mon journal d\'activité' },
          { href: '/auth/securite',     icon: ShieldCheck,  label: 'Sécurité & supervision' },
        ].map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} prefetch
            className="flex items-center justify-between p-3.5 rounded-xl group transition-colors"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4 text-white/40" />
              <span className="text-sm text-white/70">{label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/25 group-hover:text-white/50 transition-colors" />
          </Link>
        ))}

        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3.5 rounded-xl transition-colors"
          style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)' }}
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-400">Se déconnecter</span>
        </button>
      </motion.div>
    </div>
  );
}

export default function ComptePageContent() {
  return (
    <AuthLayout>
      <CompteMainContent />
    </AuthLayout>
  );
}
