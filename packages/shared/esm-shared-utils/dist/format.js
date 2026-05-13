/** Formate un nombre avec séparateur de milliers */
export function formatNumber(n, locale = 'fr-FR') {
    return new Intl.NumberFormat(locale).format(n);
}
/** Formate un montant en devise */
export function formatCurrency(amount, currency = 'EUR', locale = 'fr-FR') {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}
