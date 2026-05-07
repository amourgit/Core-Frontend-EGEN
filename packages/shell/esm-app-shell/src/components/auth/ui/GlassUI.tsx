// ============================================================
// components/pages/auth/ui/GlassUI.tsx
// Primitives glass partagées — utilisées dans toutes les pages auth.
// Centralise le design system glass morphism du module.
// ============================================================


import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

// ── Styles glass réutilisables ────────────────────────────
export const glass = {
  card:   'rgba(255,255,255,0.06)',
  cardBorder: 'rgba(255,255,255,0.1)',
  cardStrong: 'rgba(255,255,255,0.09)',
  cardStrongBorder: 'rgba(255,255,255,0.15)',
  input:  'rgba(255,255,255,0.07)',
  hover:  'rgba(255,255,255,0.1)',
  blue:   'rgba(59,130,246,0.12)',
  blueBorder: 'rgba(59,130,246,0.25)',
  green:  'rgba(34,197,94,0.1)',
  greenBorder: 'rgba(34,197,94,0.25)',
  red:    'rgba(239,68,68,0.1)',
  redBorder:   'rgba(239,68,68,0.25)',
  amber:  'rgba(245,158,11,0.1)',
  amberBorder: 'rgba(245,158,11,0.25)',
  purple: 'rgba(139,92,246,0.1)',
  purpleBorder: 'rgba(139,92,246,0.25)',
};

// ── Page wrapper avec fond glass ─────────────────────────
export function GlassPageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-auto">
      {/* Arrière-plan */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/background1.webp')", opacity: 0.3 }}
        />
        <div className="absolute inset-0 bg-black/68" />
      </div>
      <div className="relative z-0">
        {children}
      </div>
    </div>
  );
}

// ── Container de page ─────────────────────────────────────
export function PageContainer({
  children,
  maxWidth = '2xl',
  className,
}: {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  className?: string;
}) {
  const widths = {
    sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg',
    xl: 'max-w-xl', '2xl': 'max-w-2xl', '3xl': 'max-w-3xl', '4xl': 'max-w-4xl',
  };
  return (
    <div className={cn('p-5 mx-auto w-full', widths[maxWidth], className)}>
      {children}
    </div>
  );
}

// ── Card glass ────────────────────────────────────────────
export function GlassCard({
  children,
  className,
  strong = false,
  animate = true,
  delay = 0,
  noPadding = false,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  strong?: boolean;
  animate?: boolean;
  delay?: number;
  noPadding?: boolean;
  style?: React.CSSProperties;
}) {
  const base = {
    background:    strong ? glass.cardStrong : glass.card,
    border:        `1px solid ${strong ? glass.cardStrongBorder : glass.cardBorder}`,
    backdropFilter: 'blur(12px)',
    ...style,
  };

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay }}
        className={cn('rounded-2xl', !noPadding && 'p-5', className)}
        style={base}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cn('rounded-2xl', !noPadding && 'p-5', className)} style={base}>
      {children}
    </div>
  );
}

// ── Section header dans une card ─────────────────────────
export function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  action,
  iconColor = 'text-blue-300',
  iconBg = 'rgba(59,130,246,0.12)',
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  iconColor?: string;
  iconBg?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: iconBg, border: `1px solid ${iconBg.replace('0.12', '0.25')}` }}
        >
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          {subtitle && <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ── Bouton retour ────────────────────────────────────────
export function BackLink({ href, label = 'Retour' }: { href: string; label?: string }) {
  return (
    <Link href={href} prefetch
      className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-5 transition-colors group"
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
      {label}
    </Link>
  );
}

// ── Page header avec icône ────────────────────────────────
export function PageHeader({
  icon: Icon,
  title,
  subtitle,
  iconBg = 'rgba(12,17,91,0.6)',
  iconColor = 'text-blue-300',
  badge,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  iconBg?: string;
  iconColor?: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: iconBg, border: '1px solid rgba(255,255,255,0.15)' }}
      >
        <Icon className={cn('w-6 h-6', iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl font-semibold text-white">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="text-white/45 text-sm mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ── État vide ─────────────────────────────────────────────
export function EmptyState({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-14 gap-3"
    >
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <Icon className="w-7 h-7 text-white/20" />
      </div>
      <p className="text-white/40 font-medium text-sm">{title}</p>
      {subtitle && <p className="text-white/25 text-xs text-center max-w-xs">{subtitle}</p>}
      {action}
    </motion.div>
  );
}

// ── Bannière d'erreur ─────────────────────────────────────
export function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="flex items-center gap-2.5 p-3 rounded-xl text-sm mb-4"
      style={{ background: glass.red, border: `1px solid ${glass.redBorder}` }}
    >
      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
      <span className="text-red-300 flex-1">{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="text-xs text-red-400/70 hover:text-red-400 underline">
          Réessayer
        </button>
      )}
    </motion.div>
  );
}

// ── Bannière de succès ────────────────────────────────────
export function SuccessBanner({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2.5 p-3 rounded-xl text-sm mb-4"
      style={{ background: glass.green, border: `1px solid ${glass.greenBorder}` }}
    >
      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
      <span className="text-green-300">{message}</span>
    </motion.div>
  );
}

// ── Loader centré ─────────────────────────────────────────
export function CenteredLoader({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <Loader2 className="w-7 h-7 text-white/25 animate-spin" />
      {label && <p className="text-xs text-white/30">{label}</p>}
    </div>
  );
}

// ── Badge de statut générique ─────────────────────────────
export function StatusBadge({
  status,
  labels,
  colors,
}: {
  status: string;
  labels: Record<string, string>;
  colors: Record<string, { text: string; bg: string; border: string }>;
}) {
  const key = status?.toLowerCase() || '';
  const c = colors[key] || { text: 'text-white/50', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)' };
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium', c.text)}
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {labels[key] || status}
    </span>
  );
}

// ── Séparateur de section ─────────────────────────────────
export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 border-t border-white/8" />
      <span className="text-xs text-white/30 uppercase tracking-widest">{label}</span>
      <div className="flex-1 border-t border-white/8" />
    </div>
  );
}

// ── Méta-info pill (IP, date, etc.) ──────────────────────
export function MetaPill({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs text-white/45"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

// ── Ligne action avec flèche ─────────────────────────────
export function ActionRow({
  href,
  icon: Icon,
  label,
  description,
  variant = 'default',
  onClick,
}: {
  href?: string;
  icon: React.ElementType;
  label: string;
  description?: string;
  variant?: 'default' | 'danger';
  onClick?: () => void;
}) {
  const variantStyle = {
    default: { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.07)', text: 'text-white/70', icon: 'text-white/40' },
    danger:  { bg: 'rgba(239,68,68,0.05)', border: 'rgba(239,68,68,0.12)', text: 'text-red-400', icon: 'text-red-400' },
  }[variant];

  const inner = (
    <div className="flex items-center gap-3 w-full">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: variantStyle.bg }}
      >
        <Icon className={cn('w-4 h-4', variantStyle.icon)} />
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className={cn('text-sm font-medium', variantStyle.text)}>{label}</p>
        {description && <p className="text-xs text-white/30 truncate">{description}</p>}
      </div>
      {variant !== 'danger' && (
        <svg className="w-4 h-4 text-white/20 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </div>
  );

  const style = { background: variantStyle.bg, border: `1px solid ${variantStyle.border}` };

  if (href) {
    return (
      <Link href={href} prefetch
        className="flex items-center p-3.5 rounded-xl transition-colors hover:bg-white/5 w-full"
        style={style}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button onClick={onClick}
      className="flex items-center p-3.5 rounded-xl transition-colors hover:brightness-125 w-full"
      style={style}
    >
      {inner}
    </button>
  );
}
