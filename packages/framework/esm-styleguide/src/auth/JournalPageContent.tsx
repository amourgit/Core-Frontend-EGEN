// ============================================================
// components/pages/auth/JournalPageContent.tsx
// Journal d'activité complet — GET /api/v1/audit/moi
// Filtres, pagination, couleurs par résultat
// ============================================================


import React, { useState, useEffect, useCallback } from 'react';
import { type Variants, type Transition, motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Filter, Search, ChevronDown, Globe,
  Clock, CheckCircle2, XCircle, RefreshCw, Calendar,
  Shield, Eye, Edit, Trash2, LogIn, LogOut,
  Info,
} from 'lucide-react';
import {
  GlassCard, PageContainer, GlassPageHeader as PageHeader, BackLink,
  CenteredLoader, ErrorBanner, EmptyState, MetaPill,
  SectionDivider, glass,
} from './ui/GlassUI';
import { profilService } from '@egen/esm-auth';
import type { JournalEntry } from '@egen/esm-auth';
import { cn } from '../lib/utils';
import { Button } from '../ui/button';
import { AuthLayout } from './ui/AuthLayout';

const PAGE_SIZE = 20;

// ── Icône par type d'action ───────────────────────────────
function actionIcon(type: string) {
  const t = type?.toLowerCase() || '';
  if (t.includes('login') || t.includes('connexion')) return LogIn;
  if (t.includes('logout') || t.includes('déconnexion')) return LogOut;
  if (t.includes('view') || t.includes('consulter') || t.includes('lire')) return Eye;
  if (t.includes('update') || t.includes('modifier') || t.includes('edit')) return Edit;
  if (t.includes('delete') || t.includes('supprimer')) return Trash2;
  if (t.includes('permission') || t.includes('habilitation')) return Shield;
  return Activity;
}

// ── Couleur par résultat ──────────────────────────────────
function resultConfig(autorise: boolean | null | undefined) {
  if (autorise === true)  return { icon: CheckCircle2, color: 'text-green-400', dot: 'bg-green-400', bg: glass.green, border: glass.greenBorder, label: 'Autorisé' };
  if (autorise === false) return { icon: XCircle,      color: 'text-red-400',   dot: 'bg-red-400',   bg: glass.red,   border: glass.redBorder,   label: 'Refusé' };
  return { icon: Info, color: 'text-white/40', dot: 'bg-white/30', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)', label: 'Info' };
}

// ── Formater la date/heure ────────────────────────────────
function formatDateTime(ts?: string) {
  if (!ts) return { date: '—', time: '' };
  const d = new Date(ts);
  return {
    date: d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}

// ── Entrée de journal ─────────────────────────────────────
function JournalRow({ entry, isExpanded, onToggle }: {
  entry: JournalEntry;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const rc = resultConfig(entry.autorise);
  const ActionIcon = actionIcon(entry.type_action ?? '');
  const { date, time } = formatDateTime(entry.timestamp);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-xl overflow-hidden border"
      style={{
        background: isExpanded ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        borderColor: isExpanded ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
      }}
    >
      {/* Ligne principale */}
      <button onClick={onToggle}
        className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-white/3 transition-colors"
      >
        {/* Indicateur résultat */}
        <div className={cn('w-1.5 h-8 rounded-full flex-shrink-0', rc.dot)} />

        {/* Icône action */}
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <ActionIcon className="w-4 h-4 text-white/50" />
        </div>

        {/* Infos principales */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-white/85 truncate">{entry.type_action}</span>
            {entry.module && (
              <span className="text-xs text-white/35 px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                {entry.module}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            {entry.permission_verifiee && (
              <span className="text-xs text-white/35 font-mono truncate">{entry.permission_verifiee}</span>
            )}
            {entry.ressource && (
              <span className="text-xs text-white/30 truncate">{entry.ressource}</span>
            )}
          </div>
        </div>

        {/* Méta */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className={cn('text-xs font-medium', rc.color)}>{rc.label}</span>
          <span className="text-xs text-white/30">{time}</span>
          <span className="text-xs text-white/20">{date}</span>
        </div>

        <ChevronDown className={cn('w-4 h-4 text-white/25 flex-shrink-0 transition-transform', isExpanded && 'rotate-180')} />
      </button>

      {/* Détails expandés */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/6"
          >
            <div className="p-4 grid grid-cols-2 gap-3">
              {[
                { label: 'ID Entrée',   value: entry.id.slice(0, 18) + '...' },
                { label: 'Horodatage',  value: new Date(entry.timestamp).toLocaleString('fr-FR') },
                { label: 'Module',      value: entry.module },
                { label: 'Ressource',   value: entry.ressource },
                { label: 'Action',      value: entry.action },
                { label: 'IP',          value: entry.ip_address },
                { label: 'Permission',  value: entry.permission_verifiee },
                { label: 'Request ID',  value: entry.request_id?.slice(0, 12) },
              ].filter(({ value }) => value).map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-white/30">{label}</p>
                  <p className="text-xs text-white/70 font-medium font-mono break-all">{value}</p>
                </div>
              ))}
              {entry.raison && (
                <div className="col-span-2 p-2 rounded-lg"
                  style={{ background: entry.autorise ? glass.green : glass.red, border: `1px solid ${entry.autorise ? glass.greenBorder : glass.redBorder}` }}
                >
                  <p className="text-xs text-white/50 mb-0.5">Raison</p>
                  <p className={cn('text-xs font-medium', entry.autorise ? 'text-green-300' : 'text-red-300')}>{entry.raison}</p>
                </div>
              )}
              {entry.details && (
                <div className="col-span-2">
                  <p className="text-xs text-white/30 mb-1">Détails</p>
                  <pre className="text-xs text-white/50 font-mono whitespace-pre-wrap break-all text-left">
                    {JSON.stringify(entry.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Contenu principal ─────────────────────────────────────
function JournalMainContent() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [search, setSearch] = useState('');
  const [filterResult, setFilterResult] = useState<'all' | 'autorise' | 'refuse'>('all');
  const [totalLoaded, setTotalLoaded] = useState(0);

  const load = useCallback(async (newSkip = 0, reset = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await profilService.fetchMonJournal(newSkip, PAGE_SIZE);
      setEntries((prev) => reset ? data : [...prev, ...data]);
      if (reset) { setTotalLoaded(data.length); } else { setTotalLoaded((prev) => prev + data.length); }
      setHasMore(data.length === PAGE_SIZE);
      setSkip(newSkip + data.length);
    } catch (err: any) {
      setError(err?.message || 'Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(0, true); }, [load]);

  // Filtrer localement
  const filtered = entries.filter((e) => {
    const matchSearch = !search
      || e.type_action?.toLowerCase().includes(search.toLowerCase())
      || e.module?.toLowerCase().includes(search.toLowerCase())
      || e.permission_verifiee?.toLowerCase().includes(search.toLowerCase())
      || e.ip_address?.includes(search);
    const matchResult = filterResult === 'all'
      || (filterResult === 'autorise' && e.autorise === true)
      || (filterResult === 'refuse' && e.autorise === false);
    return matchSearch && matchResult;
  });

  // Stats
  const stats = {
    total:    entries.length,
    autorise: entries.filter((e) => e.autorise === true).length,
    refuse:   entries.filter((e) => e.autorise === false).length,
  };

  return (
    <PageContainer maxWidth="3xl">
      <BackLink href="/auth/compte" label="Mon compte" />

      <PageHeader
        icon={Activity}
        title="Mon journal d'activité"
        subtitle="Historique complet de vos accès et actions sur le système"
        iconBg="rgba(16,185,129,0.15)"
        iconColor="text-emerald-300"
      />

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 gap-3 mb-5"
      >
        {[
          { label: 'Total', value: stats.total, color: 'text-white/70', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.1)' },
          { label: 'Autorisés', value: stats.autorise, color: 'text-green-400', bg: glass.green, border: glass.greenBorder },
          { label: 'Refusés',   value: stats.refuse,   color: 'text-red-400',   bg: glass.red,   border: glass.redBorder },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} className="flex flex-col items-center py-4 px-3 rounded-xl text-center"
            style={{ background: bg, border: `1px solid ${border}` }}
          >
            <span className={cn('text-2xl font-bold', color)}>{value}</span>
            <span className="text-xs text-white/40 mt-0.5">{label}</span>
          </div>
        ))}
      </motion.div>

      {/* Filtres */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <div className="flex-1 relative min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Rechercher dans le journal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white/80 placeholder-white/25 outline-none"
            style={{ background: glass.card, border: `1px solid ${glass.cardBorder}` }}
          />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'autorise', 'refuse'] as const).map((f) => (
            <button key={f} onClick={() => setFilterResult(f)}
              className={cn(
                'px-3 py-2 rounded-xl text-xs font-medium transition-all',
                filterResult === f ? 'text-white' : 'text-white/40 hover:text-white/60',
              )}
              style={{
                background: filterResult === f
                  ? (f === 'autorise' ? glass.green : f === 'refuse' ? glass.red : 'rgba(255,255,255,0.1)')
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${filterResult === f
                  ? (f === 'autorise' ? glass.greenBorder : f === 'refuse' ? glass.redBorder : 'rgba(255,255,255,0.2)')
                  : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              {f === 'all' ? 'Tous' : f === 'autorise' ? '✓ Autorisés' : '✗ Refusés'}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={() => load(0, true)} disabled={isLoading}
          className="border-white/10 text-white/50 h-10"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Erreur */}
      {error && <ErrorBanner message={error} onRetry={() => load(0, true)} />}

      {/* Liste */}
      {isLoading && entries.length === 0 && <CenteredLoader label="Chargement du journal..." />}

      {!isLoading && filtered.length === 0 && entries.length > 0 && (
        <EmptyState
          icon={Search}
          title="Aucun résultat"
          subtitle={`Aucune entrée ne correspond à "${search}"`}
        />
      )}

      {filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((entry) => (
            <JournalRow
              key={entry.id}
              entry={entry}
              isExpanded={expandedId === entry.id}
              onToggle={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
            />
          ))}
        </div>
      )}

      {/* Charger plus */}
      {hasMore && !isLoading && entries.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 flex justify-center">
          <Button variant="outline" onClick={() => load(skip)}
            className="border-white/10 text-white/50 hover:text-white hover:border-white/20 text-sm"
            style={{ background: glass.card }}
          >
            Charger plus d'entrées
          </Button>
        </motion.div>
      )}

      {isLoading && entries.length > 0 && (
        <div className="flex justify-center mt-5">
          <CenteredLoader />
        </div>
      )}
    </PageContainer>
  );
}

export default function JournalPageContent() {
  return (
    <AuthLayout>
      <JournalMainContent />
    </AuthLayout>
  );
}
