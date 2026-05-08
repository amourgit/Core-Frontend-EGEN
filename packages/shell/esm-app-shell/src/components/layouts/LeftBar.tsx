// ============================================================
// components/layouts/LeftBar.tsx
// Sidebar gauche du Core Frontend
//
// Responsabilités :
//  - Afficher les modules actifs pour ce tenant (chargés depuis le Registry)
//  - Afficher la navigation interne du module actif (chargée via MF)
//  - Guard de permission : ne montrer que les modules autorisés
//  - Mode réduit (icônes seules) / étendu (icônes + labels)
//  - Groupes de navigation avec accordéons
// ============================================================

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Home, ChevronDown, ChevronRight,
  Settings, Package, ExternalLink,
} from 'lucide-react';

import { useRegistryStore }  from '@/stores/registry.store';
import { usePermissions }    from '@igen/esm-auth';
import { useAuthStore }      from '@igen/esm-auth';
import { cn }                from '@/lib/utils';
import { ScrollArea }        from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge }             from '@/components/ui/badge';
import type { MicroNavItem, MicroserviceManifest } from '@/types/core';

// ── Icône Lucide dynamique depuis un nom string ──────────────
// Le manifest expose le nom d'icône (string), on le résout ici
import * as LucideIcons from 'lucide-react';

function DynamicIcon({ name, className }: { name?: string; className?: string }) {
  if (!name) return <Package className={className} />;
  const Icon = (LucideIcons as any)[name];
  if (!Icon) return <Package className={className} />;
  return <Icon className={className} />;
}

// ── Item de navigation feuille ───────────────────────────────
function NavLeaf({
  item, collapsed, depth = 0,
}: { item: MicroNavItem; collapsed: boolean; depth?: number }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const isActive  = location.pathname === item.path
    || location.pathname.startsWith(item.path + '/');

  const content = (
    <button
      onClick={() => navigate(item.path)}
      className={cn(
        'w-full flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-all duration-150 group',
        depth === 0 ? 'px-2' : 'px-2 ml-4',
        isActive
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
        collapsed && 'justify-center px-2',
      )}
    >
      {item.iconName && (
        <DynamicIcon
          name={item.iconName}
          className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary' : '')}
        />
      )}
      {!collapsed && (
        <>
          <span className="truncate leading-tight">{item.label}</span>
          {item.badge && (
            <Badge variant="default" className="ml-auto text-[9px] h-4 px-1">
              {item.badge}
            </Badge>
          )}
        </>
      )}
      {/* Indicateur actif */}
      {isActive && !collapsed && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
      )}
    </button>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs">{item.label}</TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

// ── Groupe de navigation avec accordéon ─────────────────────
function NavGroup({
  item, collapsed,
}: { item: MicroNavItem; collapsed: boolean }) {
  const location   = useLocation();
  const isAnyActive = item.children?.some(
    c => location.pathname === c.path || location.pathname.startsWith(c.path + '/')
  );
  const [open, setOpen] = useState(isAnyActive ?? false);

  if (!item.children?.length) return <NavLeaf item={item} collapsed={collapsed} />;

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          'w-full flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-all',
          isAnyActive
            ? 'text-primary font-medium'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
          collapsed && 'justify-center',
        )}
      >
        {item.iconName && (
          <DynamicIcon
            name={item.iconName}
            className={cn('h-4 w-4 shrink-0', isAnyActive ? 'text-primary' : '')}
          />
        )}
        {!collapsed && (
          <>
            <span className="truncate leading-tight flex-1 text-left">{item.label}</span>
            {open
              ? <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
              : <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
            }
          </>
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && !collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="mt-0.5 space-y-0.5 border-l border-border/50 ml-3.5 pl-2">
              {item.children.map(child => (
                <NavLeaf key={child.id} item={child} collapsed={false} depth={1} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Section d'un module dans la sidebar ──────────────────────
function ModuleSection({
  manifest, navItems, collapsed,
}: {
  manifest:  MicroserviceManifest;
  navItems:  MicroNavItem[];
  collapsed: boolean;
}) {
  const location      = useLocation();
  const isModuleActive = location.pathname.startsWith(manifest.basePath);
  const [open, setOpen] = useState(isModuleActive);

  // Items de navigation de ce module
  const moduleNavItems = navItems.filter(
    n => n.path.startsWith(manifest.basePath) || n.group
  );

  const sectionHeader = (
    <button
      onClick={() => setOpen(o => !o)}
      className={cn(
        'w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold uppercase tracking-widest transition-all',
        isModuleActive
          ? 'text-foreground'
          : 'text-muted-foreground/60 hover:text-muted-foreground',
        collapsed && 'justify-center px-0',
      )}
    >
      <div
        className="h-5 w-5 rounded-md flex items-center justify-center shrink-0"
        style={{ backgroundColor: manifest.color + '20', color: manifest.color }}
      >
        <DynamicIcon name={manifest.icon} className="h-3 w-3" />
      </div>
      {!collapsed && (
        <>
          <span className="flex-1 text-left leading-none">{manifest.label}</span>
          {open
            ? <ChevronDown className="h-3 w-3 opacity-40" />
            : <ChevronRight className="h-3 w-3 opacity-40" />
          }
        </>
      )}
    </button>
  );

  return (
    <div className="mt-1">
      {collapsed ? (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>{sectionHeader}</TooltipTrigger>
          <TooltipContent side="right" className="text-xs">{manifest.label}</TooltipContent>
        </Tooltip>
      ) : sectionHeader}

      <AnimatePresence initial={false}>
        {open && !collapsed && moduleNavItems.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mt-0.5 space-y-0.5"
          >
            {moduleNavItems.map(item => (
              <NavGroup key={item.id} item={item} collapsed={false} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// LEFTBAR PRINCIPAL
// ============================================================
interface LeftBarProps {
  collapsed:         boolean;
  onToggleCollapse?: () => void;
  mobileOpen?:       boolean;
  onMobileClose?:    () => void;
}

export default function LeftBar({
  collapsed, onToggleCollapse, mobileOpen, onMobileClose,
}: LeftBarProps) {
  const navigate             = useNavigate();
  const location             = useLocation();
  const { manifests, navItems } = useRegistryStore();
  const { canAccessModule }  = usePermissions();
  const tenant               = useAuthStore(s => s.tenant);

  // Filtrer les modules autorisés pour cet utilisateur
  const accessibleModules = manifests
    .filter(m => m.defaultEnabled && canAccessModule(m.requiredRoles))
    .sort((a, b) => a.order - b.order);

  const sidebarContent = (
    <div className="flex flex-col h-full">

      {/* En-tête sidebar */}
      <div className={cn(
        'flex items-center gap-2 px-3 h-11 border-b border-sidebar-border shrink-0',
        collapsed && 'justify-center px-2',
      )}>
        <button
          onClick={onToggleCollapse}
          className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors shrink-0"
        >
          <span className="text-[11px] font-black text-primary">E</span>
        </button>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold truncate leading-tight">
              {tenant?.name ?? 'EGEN Platform'}
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight">
              {tenant?.subdomain ?? 'core'}
            </p>
          </div>
        )}
      </div>

      {/* Navigation principale */}
      <ScrollArea className="flex-1 px-2 py-2">
        <div className="space-y-0.5">

          {/* Accueil */}
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate('/')}
                className={cn(
                  'w-full flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-all',
                  location.pathname === '/'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
                  collapsed && 'justify-center',
                )}
              >
                <Home className="h-4 w-4 shrink-0" />
                {!collapsed && <span>Accueil</span>}
              </button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Accueil</TooltipContent>}
          </Tooltip>

          {/* Séparateur */}
          {!collapsed && (
            <p className="px-2 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              Modules
            </p>
          )}
          {collapsed && <div className="my-2 mx-auto h-px w-5 bg-border" />}

          {/* Modules actifs */}
          {accessibleModules.map(manifest => (
            <ModuleSection
              key={manifest.id}
              manifest={manifest}
              navItems={navItems.filter(n => n.path?.startsWith(manifest.basePath))}
              collapsed={collapsed}
            />
          ))}

          {/* Aucun module */}
          {accessibleModules.length === 0 && !collapsed && (
            <div className="px-2 py-6 text-center text-xs text-muted-foreground">
              Aucun module disponible
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Pied de sidebar — Settings */}
      <div className="border-t border-sidebar-border px-2 py-2 shrink-0">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={() => navigate('/settings')}
              className={cn(
                'w-full flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all',
                collapsed && 'justify-center',
              )}
            >
              <Settings className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Paramètres</span>}
            </button>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">Paramètres</TooltipContent>}
        </Tooltip>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar Desktop */}
      <motion.aside
        animate={{ width: collapsed ? 52 : 220 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-20 bg-sidebar-bg border-r border-sidebar-border overflow-hidden"
      >
        {sidebarContent}
      </motion.aside>

      {/* Sidebar Mobile (overlay) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-56 flex flex-col bg-sidebar-bg border-r border-sidebar-border lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
