
// ============================================================
// components/layouts/TopBar.tsx
// Barre supérieure du Core Frontend
//
// Responsabilités :
//  - Afficher le tenant actif (logo + nom)
//  - Recherche globale (dans tous les modules actifs)
//  - Breadcrumb dynamique selon la route active
//  - Toggle thème clair/sombre
//  - Menu utilisateur (profil, déconnexion)
// ============================================================

import { useState } from 'react';
import { useNavigate, useLocation }  from 'react-router-dom';
import {
  Search, Bell, Sun, Moon, LogOut, User,
  Settings, ChevronRight, Menu, X,
} from 'lucide-react';
import { type Variants, type Transition, motion, AnimatePresence } from 'framer-motion';

import { useAuthStore }     from '../stores/auth.store';
import { useRegistryStore } from '../stores/registry.store';
import { useTheme }         from '@egen/esm-styleguide/theme';
import { cn }               from '../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button }           from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface TopBarProps {
  onToggleSidebar?: () => void;
  sidebarOpen?:     boolean;
}

// ── Breadcrumb dynamique ─────────────────────────────────────
function Breadcrumb() {
  const location  = useLocation();
  const { navItems } = useRegistryStore();

  // Construire le fil d'ariane depuis le pathname
  const segments = location.pathname.split('/').filter(Boolean);

  const crumbs = segments.map((seg, i) => {
    const path = '/' + segments.slice(0, i + 1).join('/');
    // Chercher le label dans la navigation
    const found = navItems.flatMap(n => [n, ...(n.children ?? [])])
      .find(n => n.path === path);
    return { label: found?.label ?? seg, path };
  });

  if (!crumbs.length) return null;

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground">
      {crumbs.map((crumb, i) => (
        <span key={crumb.path} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-40" />}
          <span className={cn(
            i === crumbs.length - 1
              ? 'text-foreground font-medium'
              : 'hover:text-foreground cursor-pointer transition-colors',
          )}>
            {crumb.label}
          </span>
        </span>
      ))}
    </nav>
  );
}

// ── Recherche globale ────────────────────────────────────────
function GlobalSearch() {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState('');
  const { navItems }      = useRegistryStore();
  const navigate          = useNavigate();

  // Filtrer les items de navigation selon la query
  const results = query.trim().length > 1
    ? navItems
        .flatMap(n => [n, ...(n.children ?? [])])
        .filter(n => n.label.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 8)
    : [];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 h-8 px-3 rounded-lg bg-muted/60 border border-transparent hover:border-border text-muted-foreground text-sm transition-all w-52"
      >
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">Rechercher...</span>
        <kbd className="ml-auto text-[10px] bg-background/80 border border-border rounded px-1">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => { setOpen(false); setQuery(''); }}
            />

            {/* Panel de recherche */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -4 }}
              transition={{ duration: 0.15 }}
              className="fixed left-1/2 top-20 -translate-x-1/2 z-50 w-[480px] bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Rechercher une page, un module..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  onKeyDown={e => {
                    if (e.key === 'Escape') { setOpen(false); setQuery(''); }
                    if (e.key === 'Enter' && results[0]) {
                      navigate(results[0].path);
                      setOpen(false); setQuery('');
                    }
                  }}
                />
                <kbd
                  className="text-[10px] text-muted-foreground bg-muted border border-border rounded px-1 cursor-pointer"
                  onClick={() => { setOpen(false); setQuery(''); }}
                >
                  Esc
                </kbd>
              </div>

              {results.length > 0 ? (
                <div className="py-2 max-h-64 overflow-y-auto">
                  {results.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(item.path);
                        setOpen(false); setQuery('');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/60 text-left transition-colors"
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.description && (
                        <span className="text-xs text-muted-foreground ml-auto truncate max-w-40">
                          {item.description}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ) : query.trim().length > 1 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Aucun résultat pour « {query} »
                </div>
              ) : (
                <div className="py-4 px-4 text-xs text-muted-foreground">
                  Tapez pour rechercher dans tous les modules actifs.
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Menu utilisateur ─────────────────────────────────────────
function UserMenu() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const initials = [user?.prenom?.[0], user?.nom?.[0]]
    .filter(Boolean).join('').toUpperCase() || user?.username?.[0]?.toUpperCase() || '?';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted/60 transition-colors"
      >
        <Avatar className="h-7 w-7">
          <AvatarImage src={user?.avatarUrl} />
          <AvatarFallback className="text-[11px] bg-primary/15 text-primary font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-medium leading-tight">
            {user?.prenom ? `${user.prenom} ${user.nom ?? ''}`.trim() : user?.username}
          </p>
          <p className="text-[10px] text-muted-foreground leading-tight truncate max-w-28">
            {user?.email}
          </p>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-full mt-1 z-40 w-52 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
            >
              <div className="px-3 py-2.5 border-b border-border">
                <p className="text-xs font-semibold truncate">
                  {user?.prenom ? `${user.prenom} ${user.nom ?? ''}`.trim() : user?.username}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <MenuButton icon={User} label="Mon profil"
                  onClick={() => { navigate('/profile'); setOpen(false); }} />
                <MenuButton icon={Settings} label="Paramètres"
                  onClick={() => { navigate('/settings'); setOpen(false); }} />
              </div>
              <div className="border-t border-border py-1">
                <MenuButton icon={LogOut} label="Déconnexion" destructive
                  onClick={() => { logout(); setOpen(false); }} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuButton({
  icon: Icon, label, onClick, destructive = false,
}: { icon: any; label: string; onClick: () => void; destructive?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted/60 transition-colors text-left',
        destructive && 'text-destructive hover:bg-destructive/10',
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

// ============================================================
// TOPBAR PRINCIPAL
// ============================================================
export default function TopBar({ onToggleSidebar, sidebarOpen }: TopBarProps) {
  const { isDark, toggleDarkMode } = useTheme();
  const tenant = useAuthStore(s => s.tenant);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-11 flex items-center gap-3 px-3 bg-background/80 backdrop-blur-md border-b border-border">

      {/* Bouton menu mobile */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden h-7 w-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors shrink-0"
      >
        {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {/* Logo + Tenant */}
      <div className="flex items-center gap-2 min-w-0 shrink-0">
        <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-[11px] font-black text-primary">E</span>
        </div>
        <span className="text-xs font-semibold text-foreground hidden sm:block truncate max-w-32">
          {tenant?.name ?? 'EGEN Platform'}
        </span>
      </div>

      {/* Séparateur */}
      <div className="h-4 w-px bg-border hidden sm:block shrink-0" />

      {/* Breadcrumb */}
      <div className="hidden md:flex flex-1 min-w-0">
        <Breadcrumb />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Recherche */}
      <GlobalSearch />

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Notifications (placeholder) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 relative">
              <Bell className="h-3.5 w-3.5" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-primary rounded-full" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>

        {/* Toggle thème */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost" size="icon" className="h-7 w-7"
              onClick={toggleDarkMode}
            >
              {isDark
                ? <Sun className="h-3.5 w-3.5" />
                : <Moon className="h-3.5 w-3.5" />
              }
            </Button>
          </TooltipTrigger>
          <TooltipContent>Basculer le thème</TooltipContent>
        </Tooltip>

        {/* Utilisateur */}
        <UserMenu />
      </div>
    </header>
  );
}
