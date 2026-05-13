/** Formate un timestamp ISO en date lisible */
export function formatDate(iso, locale = 'fr-FR') {
    try {
        return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(iso));
    }
    catch {
        return iso;
    }
}
/** Formate un timestamp ISO en date+heure */
export function formatDateTime(iso, locale = 'fr-FR') {
    try {
        const d = new Date(iso);
        return {
            date: new Intl.DateTimeFormat(locale, { dateStyle: 'short' }).format(d),
            time: new Intl.DateTimeFormat(locale, { timeStyle: 'short' }).format(d),
        };
    }
    catch {
        return { date: iso, time: '' };
    }
}
/** Durée relative (ex: "il y a 3 min") */
export function timeAgo(iso, locale = 'fr-FR') {
    const diff = Date.now() - new Date(iso).getTime();
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    const mins = Math.round(diff / 60000);
    if (Math.abs(mins) < 60)
        return rtf.format(-mins, 'minute');
    const hours = Math.round(mins / 60);
    if (Math.abs(hours) < 24)
        return rtf.format(-hours, 'hour');
    return rtf.format(-Math.round(hours / 24), 'day');
}
