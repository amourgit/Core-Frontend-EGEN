export default function SettingsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-2">Paramètres</h1>
      <p className="text-muted-foreground text-sm">Configuration de la plateforme EGEN.</p>
      <div className="mt-6 p-8 rounded-xl border border-border bg-card text-center">
        <span className="text-4xl">⚙️</span>
        <p className="mt-3 text-sm text-muted-foreground">Paramètres en cours de développement</p>
      </div>
    </div>
  );
}
