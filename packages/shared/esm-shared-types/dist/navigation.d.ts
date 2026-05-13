/** Entrée de navigation */
export interface INavEntry {
    id: string;
    label: string;
    path: string;
    icon?: string;
    /** Permissions requises pour voir cette entrée */
    requiredPermissions?: string[];
    children?: INavEntry[];
    badge?: string | number;
    isExternal?: boolean;
}
/** Breadcrumb */
export interface IBreadcrumb {
    label: string;
    path?: string;
}
//# sourceMappingURL=navigation.d.ts.map