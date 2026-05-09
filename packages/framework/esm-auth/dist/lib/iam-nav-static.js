// Navigation IAM embarquée en statique dans le Core
// Source de vérité : iam/navigation (chargé via MF en prod)
// Ce fichier sert de fallback quand IAM n'est pas encore disponible
export const iamNavGroups = [
    { id: 'identity', label: 'Identités', color: '#6366f1' },
    { id: 'access', label: 'Accès & Rôles', color: '#8b5cf6' },
    { id: 'sessions', label: 'Sessions', color: '#06b6d4' },
    { id: 'infra', label: 'Infrastructure', color: '#f59e0b' },
    { id: 'config', label: 'Configuration', color: '#64748b' },
];
export const iamNavItems = [
    {
        id: 'compte', label: 'Comptes', iconName: 'User',
        path: '/iam/compte', group: 'identity',
        children: [
            { id: 'compte-liste', label: 'Liste', iconName: 'Users', path: '/iam/compte/liste' },
            { id: 'compte-creer', label: 'Créer', iconName: 'UserPlus', path: '/iam/compte/creer' },
        ],
    },
    { id: 'organisations', label: 'Organisations', iconName: 'Building2', path: '/iam/organisations', group: 'identity' },
    { id: 'roles', label: 'Rôles clients', iconName: 'Shield', path: '/iam/roles', group: 'access' },
    { id: 'realmroles', label: 'Rôles Realm', iconName: 'ShieldCheck', path: '/iam/realmroles', group: 'access' },
    { id: 'groupes', label: 'Groupes', iconName: 'Users', path: '/iam/groupes', group: 'access' },
    { id: 'permissions', label: 'Permissions', iconName: 'Key', path: '/iam/permissions', group: 'access' },
    {
        id: 'sessions', label: 'Sessions', iconName: 'Activity', path: '/iam/sessions', group: 'sessions',
        children: [
            { id: 'sessions-actives', label: 'Actives', iconName: 'Zap', path: '/iam/sessions/actives' },
            { id: 'sessions-offline', label: 'Offline', iconName: 'WifiOff', path: '/iam/sessions/offline' },
            { id: 'sessions-revocation', label: 'Révocation', iconName: 'Ban', path: '/iam/sessions/revocation' },
        ],
    },
    { id: 'evenements', label: 'Événements', iconName: 'Bell', path: '/iam/evenements', group: 'sessions' },
    { id: 'clients', label: 'Clients OAuth2', iconName: 'Blocks', path: '/iam/clients', group: 'infra' },
    { id: 'scopes', label: 'Scopes', iconName: 'Tag', path: '/iam/scopes', group: 'infra' },
    { id: 'realm', label: 'Realm Settings', iconName: 'Settings', path: '/iam/realm', group: 'config' },
    { id: 'authentification', label: 'Authentification', iconName: 'Lock', path: '/iam/authentification', group: 'config' },
];
//# sourceMappingURL=iam-nav-static.js.map