/**
 * Utilitaire className — fusionne les classes conditionnelles.
 * Équivalent à clsx + tailwind-merge sans les dépendances.
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
