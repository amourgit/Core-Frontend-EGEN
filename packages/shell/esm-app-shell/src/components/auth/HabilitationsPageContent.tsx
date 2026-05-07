// ============================================================
// components/pages/auth/HabilitationsPageContent.tsx
// Mes habilitations complètes — GET /api/v1/habilitations/moi
// Vue détaillée : permissions par domaine, rôles, groupes
// ============================================================


import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, ShieldCheck, Users, Key, ChevronDown, ChevronRight,
  RefreshCw, Search, Filter, CheckCircle2, Lock, Globe,
  Layers, Tag, Zap, Copy, Check, Info,
} from 'lucide-react';
import {
  GlassCard, PageContainer, PageHeader,
  BackLink, CenteredLoader, ErrorBanner, EmptyState,
  glass,
} from './ui/GlassUI';
import { profilService } from '@/services/iam/authService';
import { useIAMAuth } from '@/hooks/useIAMAuth';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PermissionEffective, Habilitations } from '@/lib/models/iam/auth.model';
import { AuthLayout } from './ui/AuthLayout';

// ── Regrouper les permissions par domaine ─────────────────
function groupByDomain(permissions: PermissionEffective[]) {
  return permissions.reduce((acc, perm) => {
    const domain = perm.domaine || 'autre';
    if (!acc[domain]) acc[domain] = [];
    acc[domain].push(perm);
    return acc;
  }, {} as Record<string, PermissionEffective[]>);
}

// ── Couleur par source de permission ─────────────────────
function sourceColor(source: string) {
  if (source === 'direct')     return { text: 'text-blue-300',   bg: glass.blue,   border: glass.blueBorder };
  if (source.startsWith('role'))   return { text: 'text-purple-300', bg: glass.purple, border: glass.purpleBorder };
  if (source.startsWith('groupe')) return { text: 'text-green-300',  bg: glass.green,  border: glass.greenBorder };
  if (source.startsWith('delegation')) return { text: 'text-amber-300', bg: glass.amber, border: glass.amberBorder };
  return { text: 'text-white/50', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' };
}

// ── Icône par domaine ─────────────────────────────────────
function domainIcon(domain: string) {
  const map: Record<string, React.ElementType> = {
    iam: Shield, profil: Key, audit: Layers, gateway: Globe,
    admin: Lock, token: Zap,
  };
  return map[domain.toLowerCase()] || Tag;
}

// ── Badge source de permission ────────────────────────────
function SourceBadge({ source }: { source: string }) {
  const c = sourceColor(source);
  const label = source.startsWith('role:')   ? `Via rôle: ${source.split(':')[1]}`
    : source.startsWith('groupe:') ? `Via groupe: ${source.split(':')[1]}`
    : source.startsWith('delegation:') ? 'Délégation'
    : 'Direct';
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.text}`}
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
    >
      {label}
    </span>
  );
}

// ── Carte permission individuelle ─────────────────────────
function PermissionCard({ perm, isExpanded, onToggle }: {
  perm: PermissionEffective;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.membreboard.writeText(perm.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div layout className="rounded-xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* En-tête cliquable */}
      <button onClick={onToggle} className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/3 transition-colors">
        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <code className="text-sm text-white/90 font-mono">{perm.code}</code>
            <SourceBadge source={perm.source} />
          </div>
          <p className="text-xs text-white/40 truncate mt-0.5">{perm.nom}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={(e) => { e.stopPropagation(); copy(); }}
            className="p-1 text-white/25 hover:text-white/60 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          </button>
          {isExpanded
            ? <ChevronDown className="w-4 h-4 text-white/30" />
            : <ChevronRight className="w-4 h-4 text-white/30" />
          }
        </div>
      </button>

      {/* Détails expandés */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 pt-1 grid grid-cols-2 gap-2 border-t border-white/6">
              {[
                { label: 'Domaine',   value: perm.domaine },
                { label: 'Ressource', value: perm.ressource },
                { label: 'Action',    value: perm.action },
                { label: 'Source',    value: perm.source },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-xs text-white/30">{label}</span>
                  <span className="text-xs text-white/70 font-medium">{value || '—'}</span>
                </div>
              ))}
              {perm.perimetre && (
                <div className="col-span-2">
                  <span className="text-xs text-white/30">Périmètre</span>
                  <pre className="text-xs text-white/60 font-mono mt-0.5 whitespace-pre-wrap break-all">
                    {JSON.stringify(perm.perimetre, null, 2)}
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

// ── Groupe par domaine ────────────────────────────────────
function DomainGroup({
  domain,
  permissions,
  expandedPerms,
  onTogglePerm,
}: {
  domain: string;
  permissions: PermissionEffective[];
  expandedPerms: Set<string>;
  onTogglePerm: (code: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const DomIcon = domainIcon(domain);

  return (
    <GlassCard className="overflow-hidden" noPadding animate={false}>
      {/* Header du groupe */}
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 hover:bg-white/3 transition-colors"
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: glass.blue, border: `1px solid ${glass.blueBorder}` }}
        >
          <DomIcon className="w-4 h-4 text-blue-300" />
        </div>
        <div className="flex-1 text-left">
          <span className="text-sm font-semibold text-white capitalize">{domain}</span>
          <span className="text-xs text-white/35 ml-2">{permissions.length} permission{permissions.length > 1 ? 's' : ''}</span>
        </div>
        {expanded
          ? <ChevronDown className="w-4 h-4 text-white/35" />
          : <ChevronRight className="w-4 h-4 text-white/35" />
        }
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-1.5">
              {permissions.map((perm) => (
                <PermissionCard
                  key={perm.code}
                  perm={perm}
                  isExpanded={expandedPerms.has(perm.code)}
                  onToggle={() => onTogglePerm(perm.code)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

// ── Contenu principal ─────────────────────────────────────
function HabilitationsMainContent() {
  const { user } = useIAMAuth();
  const { toast } = useToast();

  const [hab, setHab] = useState<Habilitations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [expandedPerms, setExpandedPerms] = useState<Set<string>>(new Set());
  const [filterSource, setFilterSource] = useState<string>('all');

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await profilService.getMesHabilitations();
      setHab(data);
    } catch (err: any) {
      setError(err?.message || 'Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRefresh = async () => {
    await load();
    toast({ variant: 'success', title: 'Habilitations actualisées', duration: 2000 });
  };

  const togglePerm = (code: string) => {
    setExpandedPerms((prev) => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  };

  // Filtrer les permissions
  const filteredPerms = (hab?.permissions || []).filter((p) => {
    const matchSearch = !search || p.code.toLowerCase().includes(search.toLowerCase())
      || p.nom.toLowerCase().includes(search.toLowerCase())
      || p.domaine.toLowerCase().includes(search.toLowerCase());
    const matchSource = filterSource === 'all' || p.source.startsWith(filterSource);
    return matchSearch && matchSource;
  });

  const grouped = groupByDomain(filteredPerms);
  const sources = [...new Set((hab?.permissions || []).map((p) => {
    if (p.source === 'direct') return 'direct';
    if (p.source.startsWith('role')) return 'role';
    if (p.source.startsWith('groupe')) return 'groupe';
    if (p.source.startsWith('delegation')) return 'delegation';
    return 'other';
  }))];

  return (
    <PageContainer maxWidth="3xl">
      <BackLink href="/auth/compte" label="Mon compte" />

      <PageHeader
        icon={Shield}
        title="Mes habilitations"
        subtitle="Permissions et rôles effectifs sur ce système"
        iconBg="rgba(59,130,246,0.15)"
        iconColor="text-blue-300"
        badge={
          <span className="text-xs text-white/35 px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Cache 15 min
          </span>
        }
      />

      {/* Stats rapides */}
      {hab && !isLoading && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-3 mb-5"
        >
          {[
            { label: 'Permissions', value: hab.permissions.length, icon: Key, color: 'text-blue-300', bg: glass.blue },
            { label: 'Rôles actifs', value: hab.roles_actifs.length, icon: Shield, color: 'text-purple-300', bg: glass.purple },
            { label: 'Groupes',     value: hab.groupes_actifs.length, icon: Users, color: 'text-green-300', bg: glass.green },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <GlassCard key={label} animate={false} className="flex flex-col items-center gap-1 py-4 px-3 text-center">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-1"
                style={{ background: bg, border: `1px solid ${bg.replace('0.12', '0.25').replace('0.1', '0.25')}` }}
              >
                <Icon className={cn('w-4 h-4', color)} />
              </div>
              <span className={cn('text-2xl font-bold', color)}>{value}</span>
              <span className="text-xs text-white/40">{label}</span>
            </GlassCard>
          ))}
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Rechercher une permission..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white/80 placeholder-white/25 outline-none"
            style={{ background: glass.card, border: `1px solid ${glass.cardBorder}` }}
          />
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}
          className="border-white/10 text-white/50 hover:text-white text-xs h-10"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Filtre source */}
      {sources.length > 1 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {['all', ...sources].map((s) => (
            <button key={s} onClick={() => setFilterSource(s)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium transition-all',
                filterSource === s
                  ? 'text-white bg-blue-500/30 border-blue-400/50'
                  : 'text-white/40 border-white/10 hover:text-white/60'
              )}
              style={{ border: filterSource === s ? '1px solid rgba(96,165,250,0.5)' : '1px solid rgba(255,255,255,0.1)' }}
            >
              {s === 'all' ? 'Toutes' : s === 'direct' ? 'Directes' : s === 'role' ? 'Via rôle' : s === 'groupe' ? 'Via groupe' : 'Délégation'}
            </button>
          ))}
        </div>
      )}

      {/* Contenu */}
      {isLoading && <CenteredLoader label="Chargement des habilitations..." />}
      {error && <ErrorBanner message={error} onRetry={load} />}

      {!isLoading && !error && hab && (
        <>
          {/* Rôles actifs */}
          {hab.roles_actifs.length > 0 && (
            <GlassCard className="mb-4" delay={0.05}>
              <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" /> Rôles actifs
              </h3>
              <div className="flex flex-wrap gap-2">
                {hab.roles_actifs.map((role) => (
                  <span key={role} className="px-3 py-1.5 rounded-xl text-sm text-purple-300 font-medium"
                    style={{ background: glass.purple, border: `1px solid ${glass.purpleBorder}` }}
                  >
                    {role}
                  </span>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Groupes actifs */}
          {hab.groupes_actifs.length > 0 && (
            <GlassCard className="mb-4" delay={0.1}>
              <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Users className="w-3.5 h-3.5" /> Groupes actifs
              </h3>
              <div className="flex flex-wrap gap-2">
                {hab.groupes_actifs.map((g) => (
                  <span key={g} className="px-3 py-1.5 rounded-xl text-sm text-green-300 font-medium"
                    style={{ background: glass.green, border: `1px solid ${glass.greenBorder}` }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Permissions par domaine */}
          {filteredPerms.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-xs font-medium text-white/35 uppercase tracking-wider">
                Permissions ({filteredPerms.length})
              </h3>
              {Object.entries(grouped).sort().map(([domain, perms]) => (
                <DomainGroup key={domain} domain={domain} permissions={perms}
                  expandedPerms={expandedPerms} onTogglePerm={togglePerm}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Key}
              title={search ? 'Aucune permission trouvée' : 'Aucune permission assignée'}
              subtitle={search ? `Aucun résultat pour "${search}"` : 'Contactez votre administrateur IAM'}
            />
          )}
        </>
      )}
    </PageContainer>
  );
}


export default function HabilitationsPageContent() {
  return (
    <AuthLayout>
      <HabilitationsMainContent />
    </AuthLayout>
  );
}
