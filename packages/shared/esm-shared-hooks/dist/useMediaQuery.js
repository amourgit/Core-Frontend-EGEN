import { useState, useEffect } from 'react';
/**
 * Réagit aux breakpoints CSS — utile pour le responsive dans les MFEs.
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 */
export function useMediaQuery(query) {
    const [matches, setMatches] = useState(() => {
        if (typeof window === 'undefined')
            return false;
        return window.matchMedia(query).matches;
    });
    useEffect(() => {
        if (typeof window === 'undefined')
            return;
        const mq = window.matchMedia(query);
        const handler = (e) => setMatches(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [query]);
    return matches;
}
