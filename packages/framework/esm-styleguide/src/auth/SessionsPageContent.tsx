// ============================================================
// components/pages/auth/SessionsPageContent.tsx
// Gestion des sessions actives — GET + DELETE /tokens/sessions
// Affiche device info, IP, activité, bouton révoquer
// ============================================================


import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor, Smartphone, Tablet, Globe, Clock,
  LogOut, RefreshCw, Shield, AlertCircle, CheckCircle2,
  Loader2, ArrowLeft, Wifi, WifiOff,
} from 'lucide-react';
import { useIAMSessions } from '@igen/esm-auth';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import type { Session } from '@igen/esm-auth';
import { AuthLayout } from './ui/AuthLayout';

// ── Détection appareil depuis User-Agent ──────────────────
function getDeviceType(ua?: string): 'mobile' | 'tablet' | 'desktop' {
  const u = (ua || '').toLowerCase();
  if (u.includes('ipad') || u.includes('tablet') || (u.includes('android') && !u.includes('mobile'))) return 'tablet';
  if (u.includes('mobile') || u.includes('android') || u.includes('iphone')) return 'mobile';
  return 'desktop';
}

function getBrowserName(ua?: string): string {
  const u = ua || '';
  if (u.includes('Chrome') && !u.includes('Edg') && !u.includes('OPR')) return 'Chrome';
  if (u.includes('Firefox')) return 'Firefox';
  if (u.includes('Safari') && !u.includes('Chrome')) return 'Safari';
  if (u.includes('Edg')) return 'Edge';
  if (u.includes('OPR') || u.includes('Opera')) return 'Opera';
  return 'Navigateur inconnu';
}

function getOSName(ua?: string): string {
  const u = ua || '';
  if (u.includes('Windows NT')) return 'Windows';
  if (u.includes('Mac OS')) return 'macOS';
  if (u.includes('Linux') && !u.includes('Android')) return 'Linux';
  if (u.includes('Android')) return 'Android';
  if (u.includes('iOS') || u.includes('iPhone') || u.includes('iPad')) return 'iOS';
  return 'OS inconnu';
}

function DeviceIcon({ ua, className }: { ua?: string; className?: string }) {
  const type = getDeviceType(ua);
  if (type === 'mobile') return <Smartphone className={className || 'w-5 h-5'} />;
  if (type === 'tablet') return <Tablet className={className || 'w-5 h-5'} />;
  return <Monitor className={className || 'w-5 h-5'} />;
}

function formatRelative(dateStr?: string): string {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'À l\'instant';
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  return `Il y a ${Math.floor(hours / 24)}j`;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ── Carte session ─────────────────────────────────────────
function SessionCard({
  session,
  isCurrent,
  onRevoke,
  isRevoking,
}: {
  session: Session;
  isCurrent: boolean;
  onRevoke: (id: string) => void;
  isRevoking: boolean;
}) {
  const browser = getBrowserName(session.user_agent);
  const os = getOSName(session.user_agent);
  const isActive = session.status !== 'revoked' && session.status !== 'expired';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl p-4 border"
      style={{
        background: isCurrent
          ? 'rgba(34,197,94,0.05)'
          : isActive ? 'rgba(255,255,255,0.04)' : 'rgba(239,68,68,0.04)',
        borderColor: isCurrent
          ? 'rgba(34,197,94,0.25)'
          : isActive ? 'rgba(255,255,255,0.09)' : 'rgba(239,68,68,0.2)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex items-start gap-3">
        {/* Icône appareil */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <span className={isCurrent ? 'text-green-400' : 'text-white/60'}>
            <DeviceIcon ua={session.user_agent} />
          </span>
        </div>

        {/* Infos */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-white/90">{browser} · {os}</span>
            {isCurrent && (
              <span className="flex items-center gap-1 text-xs text-green-400 px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Session actuelle
              </span>
            )}
            {!isActive && !isCurrent && (
              <span className="text-xs text-red-400 px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                {session.status}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
            {session.ip_address && (
              <span className="flex items-center gap-1 text-xs text-white/45">
                <Globe className="w-3 h-3" /> {session.ip_address}
              </span>
            )}
            {session.last_activity && (
              <span className="flex items-center gap-1 text-xs text-white/45">
                <Clock className="w-3 h-3" /> {formatRelative(session.last_activity)}
              </span>
            )}
            {session.activity_count !== undefined && (
              <span className="text-xs text-white/30">
                {session.activity_count} activité{session.activity_count !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="flex gap-4 mt-1">
            <span className="text-xs text-white/25">Créé {formatDate(session.created_at)}</span>
            {session.expires_at && (
              <span className="text-xs text-white/25">Expire {formatDate(session.expires_at)}</span>
            )}
          </div>

          <p className="text-xs text-white/20 font-mono mt-1 truncate">
            ID: {session.id}
          </p>
        </div>

        {/* Bouton révoquer */}
        {!isCurrent && isActive && (
          <Button
            variant="outline" size="sm"
            onClick={() => onRevoke(session.id)}
            disabled={isRevoking}
            className="flex-shrink-0 text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20 text-xs h-8"
          >
            {isRevoking ? <Loader2 className="w-3 h-3 animate-spin" /> : (
              <><LogOut className="w-3 h-3 mr-1" />Révoquer</>
            )}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

// ── Contenu principal ─────────────────────────────────────
function SessionsMainContent() {
  const { sessions, isLoading, error, currentSessionId, fetchSessions, revokeSession } = useIAMSessions();
  const { toast } = useToast();
  const [revokingId, setRevokingId] = useState<string | null>(null);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const handleRevoke = async (sessionId: string) => {
    setRevokingId(sessionId);
    const result = await revokeSession(sessionId);
    if (result.success) {
      toast({ variant: 'success', title: 'Session révoquée', description: 'Déconnexion effectuée.', duration: 3000 });
    } else {
      toast({ variant: 'destructive', title: 'Erreur', description: result.error, duration: 4000 });
    }
    setRevokingId(null);
  };

  const activeSessions = sessions.filter(s => s.status !== 'revoked' && s.status !== 'expired');
  const revokedSessions = sessions.filter(s => s.status === 'revoked' || s.status === 'expired');

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* En-tête */}
      <div className="mb-6">
        <Link href="/auth/compte"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />Retour au compte
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(12,17,91,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <Shield className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Sessions actives</h1>
              <p className="text-white/45 text-sm">{activeSessions.length} session{activeSessions.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchSessions} disabled={isLoading}
            className="text-white/50 border-white/10 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
        >
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-red-300">{error}</span>
        </div>
      )}

      {/* Chargement */}
      {isLoading && sessions.length === 0 && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-7 h-7 text-white/25 animate-spin" />
        </div>
      )}

      {/* Sessions actives */}
      <div className="space-y-3 mb-6">
        <AnimatePresence mode="popLayout">
          {activeSessions.map((s) => (
            <SessionCard key={s.id} session={s}
              isCurrent={s.id === currentSessionId}
              onRevoke={handleRevoke}
              isRevoking={revokingId === s.id}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Sessions révoquées/expirées */}
      {revokedSessions.length > 0 && (
        <div>
          <p className="text-xs text-white/30 uppercase tracking-wider mb-3">Historique</p>
          <div className="space-y-2">
            {revokedSessions.slice(0, 5).map((s) => (
              <SessionCard key={s.id} session={s} isCurrent={false}
                onRevoke={handleRevoke} isRevoking={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Vide */}
      {!isLoading && sessions.length === 0 && !error && (
        <div className="text-center py-12">
          <CheckCircle2 className="w-10 h-10 text-white/15 mx-auto mb-3" />
          <p className="text-white/35 text-sm">Aucune session trouvée</p>
        </div>
      )}
    </div>
  );
}

export default function SessionsPageContent() {
  return (
    <AuthLayout>
      <SessionsMainContent />
    </AuthLayout>
  );
}
