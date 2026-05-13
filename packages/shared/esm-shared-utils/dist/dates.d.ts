/** Formate un timestamp ISO en date lisible */
export declare function formatDate(iso: string, locale?: string): string;
/** Formate un timestamp ISO en date+heure */
export declare function formatDateTime(iso: string, locale?: string): {
    date: string;
    time: string;
};
/** Durée relative (ex: "il y a 3 min") */
export declare function timeAgo(iso: string, locale?: string): string;
//# sourceMappingURL=dates.d.ts.map