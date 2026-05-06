import { useAuthStore } from '@/stores/auth.store';
export default function ProfilePage() {
  const user = useAuthStore(s => s.user);
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Mon profil</h1>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </div>
          <div>
            <p className="text-lg font-semibold">{user?.prenom} {user?.nom}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <div className="space-y-2">
          {user?.roles.map(r => (
            <span key={r} className="inline-flex mr-2 px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
              {r}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
