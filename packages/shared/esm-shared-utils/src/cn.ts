/**
 * Utilitaire className — fusionne les classes conditionnelles.
 * Équivalent à clsx + tailwind-merge sans les dépendances.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
