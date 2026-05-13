/** Vérifie l'accès à partir d'une liste de permissions */
export function hasPermissionCode(permissions, code) {
    return permissions.some(p => p.code === code);
}
/** Niveau d'accès effectif sur un domaine */
export function getEffectiveLevel(permissions, domain) {
    const domainPerms = permissions.filter(p => p.domaine === domain);
    if (domainPerms.some(p => p.niveau === 'admin'))
        return 'admin';
    if (domainPerms.some(p => p.niveau === 'write'))
        return 'write';
    if (domainPerms.some(p => p.niveau === 'read'))
        return 'read';
    return 'none';
}
