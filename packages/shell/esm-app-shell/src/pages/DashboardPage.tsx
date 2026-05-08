import { useAuthStore } from '@igen/esm-auth';
import { useRegistryStore } from '@/stores/registry.store';
import { Shield, Users, Activity, Building2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const user     = useAuthStore(s => s.user);
  const tenant   = useAuthStore(s => s.tenant);
  const manifests = useRegistryStore(s => s.manifests);
  const navigate = useNavigate();

  const cards = [
    { icon: Shield,    label: 'IAM Central',    desc: 'Identités & accès',  path: '/iam',          color: '#6366f1' },
    { icon: Users,     label: 'Scolarité',      desc: 'Gestion étudiants',  path: '/scolarite',    color: '#10b981' },
    { icon: Activity,  label: 'Bibliothèque',   desc: 'Ressources doc.',    path: '/bibliotheque', color: '#f59e0b' },
    { icon: Building2, label: 'Organisations',  desc: 'Structure & depts',  path: '/organisations',color: '#8b5cf6' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Bonjour, {user?.prenom ?? user?.username} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {tenant?.name} — Tableau de bord
        </p>
      </div>

      {/* Modules grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ icon: Icon, label, desc, path, color }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="group p-5 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all text-left"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
              style={{ backgroundColor: color + '20' }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <p className="font-semibold text-sm text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            <div className="flex items-center gap-1 mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Ouvrir</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </button>
        ))}
      </div>

      {/* Modules actifs */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">
          Modules actifs ({manifests.length})
        </h2>
        {manifests.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun module chargé.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {manifests.map(m => (
              <span
                key={m.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: m.color + '15', color: m.color }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {m.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
