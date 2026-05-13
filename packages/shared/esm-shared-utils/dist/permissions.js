/** Vérifie si une liste de permissions contient un code donné */
export function hasPermission(permissions, code) {
    return permissions.some(p => p.code === code);
}
/** Vérifie si toutes les permissions requises sont présentes */
export function hasAllPermissions(permissions, required) {
    return required.every(r => hasPermission(permissions, r));
}
/** Vérifie si au moins une des permissions est présente */
export function hasAnyPermission(permissions, codes) {
    return codes.some(c => hasPermission(permissions, c));
}
/** Retourne le niveau d'accès effectif sur une ressource */
export function getAccessLevel(permissions, domain) {
    const domainPerms = permissions.filter(p => p.domaine === domain);
    if (domainPerms.some(p => p.niveau === 'admin'))
        return 'admin';
    if (domainPerms.some(p => p.niveau === 'write'))
        return 'write';
    if (domainPerms.some(p => p.niveau === 'read'))
        return 'read';
    return 'none';
}
