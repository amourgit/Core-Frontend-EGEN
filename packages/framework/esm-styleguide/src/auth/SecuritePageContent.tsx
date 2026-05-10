// ============================================================
// components/pages/auth/SecuritePageContent.tsx
// Tableau de bord sécurité — vue consolidée :
//  - Stats sessions (GET /tokens/sessions/stats) [admin]
//  - Métriques tokens (GET /tokens/metrics) [admin]
//  - Statut sync IAM Central (GET /tokens/sync/status)
//  - Inspecteur de token (POST /tokens/validate)
// ============================================================


import React, { useState, useEffect, useCallback } from 'react';
import { type Variants, type Transition, motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Activity, RefreshCw, Zap, Globe, Lock,
  CheckCircle2, AlertCircle, Clock, Eye, EyeOff,
  BarChart2, Wifi, WifiOff, AlertTriangle, Info,
  Copy, Check, ChevronDown, Users,
} from 'lucide-react';
import {
  GlassCard, PageContainer, PageHeader, BackLink,
  CenteredLoader, ErrorBanner, glass,
} from './ui/GlassUI';
import { authService, extendedAuthService } from '@egen/esm-auth';
import { useIAMAuth } from '@egen/esm-auth';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AuthLayout } from './ui/AuthLayout';

// ── Carte métrique ────────────────────────────────────────
function MetricCard({ label, value, icon: Icon, color, bg, sub }:
  { label: string; value: string | number; icon: React.ElementType; color: string; bg: string; sub?: string }) {
  return (
    <GlassCard animate={false} className="flex items-center gap-3 p-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: bg, border: `1px solid ${bg.replace('0.12', '0.25').replace('0.1', '0.25')}` }}
      >
        <Icon className={cn('w-5 h-5', color)} />
      </div>
      <div>
        <p className={cn('text-xl font-bold', color)}>{value}</p>
        <p className="text-xs text-white/40">{label}</p>
        {sub && <p className="text-xs text-white/25 mt-0.5">{sub}</p>}
      </div>
    </GlassCard>
  );
}

// ── Section stats sessions ────────────────────────────────
function SessionStatsSection({ isAdmin }: { isAdmin: boolean }) {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await extendedAuthService.getSessionStats();
        setStats(data);
      } catch (e: any) {
        setError('Accès réservé aux administrateurs');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <GlassCard className="flex items-center gap-3 py-4">
        <Lock className="w-5 h-5 text-white/25" />
        <div>
          <p className="text-sm text-white/50">Statistiques de sessions</p>
          <p className="text-xs text-white/30">Réservé aux administrateurs IAM</p>
        </div>
      </GlassCard>
    );
  }

  if (isLoading) return <CenteredLoader />;
  if (error) return <ErrorBanner message={error} />;
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 gap-3">
      <MetricCard label="Sessions actives" value={stats.active ?? 0}
        icon={Activity} color="text-green-400" bg={glass.green} />
      <MetricCard label="Sessions révoquées" value={stats.revoked ?? 0}
        icon={ShieldCheck} color="text-blue-400" bg={glass.blue} />
      <MetricCard label="Total clés cache" value={stats.total_keys ?? 0}
        icon={BarChart2} color="text-white/60" bg="rgba(255,255,255,0.06)" />
      {stats.timestamp && (
        <MetricCard label="Dernière mise à jour" value={new Date(stats.timestamp).toLocaleTimeString('fr-FR')}
          icon={Clock} color="text-white/50" bg="rgba(255,255,255,0.05)" />
      )}
    </div>
  );
}

// ── Section métriques tokens ──────────────────────────────
function TokenMetricsSection({ isAdmin }: { isAdmin: boolean }) {
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    const load = async () => {
      setIsLoading(true);
      try {
        setMetrics(await extendedAuthService.getTokenMetrics());
      } catch {}
      finally { setIsLoading(false); }
    };
    load();
  }, [isAdmin]);

  if (!isAdmin || !metrics) return null;
  if (isLoading) return <CenteredLoader />;

  return (
    <div className="grid grid-cols-2 gap-3">
      <MetricCard label="Sessions actives" value={metrics.active_sessions ?? 0}
        icon={Users} color="text-purple-400" bg={glass.purple} />
      <MetricCard label="Tokens blacklistés" value={metrics.blacklisted_sessions ?? 0}
        icon={Lock} color="text-red-400" bg={glass.red} />
      <MetricCard label="Tokens émis aujourd'hui" value={metrics.tokens_issued_today ?? 0}
        icon={Zap} color="text-amber-400" bg={glass.amber} />
    </div>
  );
}

// ── Section statut sync IAM Central ──────────────────────
function SyncStatusSection() {
  const [status, setStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    try {
      const data = await extendedAuthService.getSyncStatus();
      setStatus(data);
    } catch (e: any) {
      setError(e?.message || 'Statut indisponible');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (isLoading) return <CenteredLoader label="Vérification de la connexion..." />;

  const isConnected = !error && status;

  return (
    <GlassCard animate={false}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center',
          )} style={{ background: isConnected ? glass.green : glass.red, border: `1px solid ${isConnected ? glass.greenBorder : glass.redBorder}` }}>
            {isConnected ? <Wifi className="w-5 h-5 text-green-400" /> : <WifiOff className="w-5 h-5 text-red-400" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">IAM Central</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={cn('w-1.5 h-1.5 rounded-full', isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400')} />
              <span className={cn('text-xs', isConnected ? 'text-green-400' : 'text-red-400')}>
                {isConnected ? 'Synchronisé' : 'Déconnecté'}
              </span>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={load}
          className="border-white/10 text-white/50 text-xs h-8"
        >
          <RefreshCw className="w-3 h-3 mr-1" /> Vérifier
        </Button>
      </div>

      {error && (
        <div className="p-3 rounded-xl text-xs text-red-300"
          style={{ background: glass.red, border: `1px solid ${glass.redBorder}` }}
        >
          {error}
        </div>
      )}

      {status && !error && (
        <div className="space-y-2">
          {Object.entries(status).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
              <span className="text-xs text-white/40 capitalize">{key.replace(/_/g, ' ')}</span>
              <span className="text-xs text-white/70 font-medium font-mono">
                {typeof val === 'boolean' ? (val ? '✓' : '✗') : String(val)}
              </span>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}

// ── Inspecteur de token ───────────────────────────────────
function TokenInspector() {
  const [tokenInput, setTokenInput] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const inspect = async () => {
    if (!tokenInput.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await extendedAuthService.validateToken(tokenInput.trim());
      setResult(data);
    } catch (e: any) {
      setError(e?.message || 'Erreur de validation');
    } finally {
      setIsLoading(false);
    }
  };

  const copy = (key: string, value: string) => {
    navigator?.clipboard?.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <GlassCard animate={false}>
      <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
        <Eye className="w-3.5 h-3.5" /> Inspecteur de token
      </h3>

      {/* Input token */}
      <div className="relative mb-3">
        <textarea
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="Collez un token JWT ici pour l'inspecter..."
          rows={3}
          className="w-full p-3 rounded-xl text-xs font-mono text-white/70 placeholder-white/20 resize-none outline-none"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
        />
        <button onClick={() => setShowToken(!showToken)}
          className="absolute right-3 top-3 text-white/30 hover:text-white/60"
        >
          {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      </div>

      <Button onClick={inspect} disabled={isLoading || !tokenInput.trim()}
        className="w-full h-10 text-sm"
        style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)' }}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> Validation...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Eye className="w-4 h-4" /> Inspecter le token
          </span>
        )}
      </Button>

      {error && (
        <div className="mt-3 flex items-center gap-2 p-3 rounded-xl text-xs"
          style={{ background: glass.red, border: `1px solid ${glass.redBorder}` }}
        >
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-red-300">{error}</span>
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 space-y-2 overflow-hidden"
          >
            {/* Statut */}
            <div className={cn('flex items-center gap-2 p-3 rounded-xl')}
              style={{
                background: result.valid ? glass.green : glass.red,
                border: `1px solid ${result.valid ? glass.greenBorder : glass.redBorder}`,
              }}
            >
              {result.valid
                ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                : <AlertCircle className="w-4 h-4 text-red-400" />
              }
              <span className={cn('text-sm font-medium', result.valid ? 'text-green-300' : 'text-red-300')}>
                Token {result.valid ? 'valide' : 'invalide'}
                {result.token_type ? ` · ${result.token_type}` : ''}
              </span>
            </div>

            {/* Payload */}
            {result.valid && (
              <div className="space-y-1.5">
                {[
                  { k: 'user_id',     v: result.user_id,    label: 'User ID' },
                  { k: 'session_id',  v: result.session_id, label: 'Session ID' },
                  { k: 'type_profil', v: result.type_profil, label: 'Type profil' },
                  { k: 'issued_at',   v: result.issued_at,  label: 'Émis le' },
                  { k: 'expires_at',  v: result.expires_at, label: 'Expire le' },
                ].filter(({ v }) => v).map(({ k, v, label }) => (
                  <div key={k} className="flex items-center justify-between py-1.5 px-3 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <span className="text-xs text-white/35">{label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/70 font-mono">{String(v).slice(0, 30)}</span>
                      <button onClick={() => copy(k, String(v))}
                        className="text-white/25 hover:text-white/60"
                      >
                        {copied === k ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                ))}
                {result.is_admin && (
                  <div className="flex items-center gap-2 p-2 rounded-lg"
                    style={{ background: glass.amber, border: `1px solid ${glass.amberBorder}` }}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs text-amber-300 font-medium">Token administrateur</span>
                  </div>
                )}
                {result.permissions && result.permissions.length > 0 && (
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-xs text-white/35 mb-2">Permissions ({result.permissions.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {result.permissions.slice(0, 8).map((p: string) => (
                        <span key={p} className="text-xs text-white/50 font-mono px-2 py-0.5 rounded"
                          style={{ background: 'rgba(255,255,255,0.05)' }}
                        >{p}</span>
                      ))}
                      {result.permissions.length > 8 && (
                        <span className="text-xs text-white/30">+{result.permissions.length - 8}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

// ── Contenu principal ─────────────────────────────────────
function SecuriteMainContent() {
  const { user } = useIAMAuth();
  const isAdmin = !!user?.is_admin;

  return (
    <PageContainer maxWidth="2xl">
      <BackLink href="/auth/compte" label="Mon compte" />

      <PageHeader
        icon={ShieldCheck}
        title="Sécurité du compte"
        subtitle="Supervision et outils de sécurité IAM"
        iconBg="rgba(139,92,246,0.15)"
        iconColor="text-purple-300"
      />

      {/* Sync IAM Central */}
      <GlassCard className="mb-4" delay={0.05}>
        <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Globe className="w-3.5 h-3.5" /> Synchronisation IAM Central
        </h3>
        <SyncStatusSection />
      </GlassCard>

      {/* Stats sessions admin */}
      {isAdmin && (
        <>
          <GlassCard className="mb-4" delay={0.1}>
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" /> Statistiques des sessions
            </h3>
            <SessionStatsSection isAdmin={isAdmin} />
          </GlassCard>

          <GlassCard className="mb-4" delay={0.15}>
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" /> Métriques des tokens
            </h3>
            <TokenMetricsSection isAdmin={isAdmin} />
          </GlassCard>
        </>
      )}

      {/* Inspecteur token */}
      <GlassCard delay={0.2}>
        <TokenInspector />
      </GlassCard>
    </PageContainer>
  );
}

export default function SecuritePageContent() {
  return (
    <AuthLayout>
      <SecuriteMainContent />
    </AuthLayout>
  );
}
