export interface NavItem {
    id: string;
    label: string;
    description?: string;
    iconName?: string;
    path: string;
    badge?: string;
    group?: string;
    children?: NavItem[];
    requiredRoles?: string[];
}
export interface NavGroup {
    id: string;
    label: string;
    color?: string;
}
export declare const iamNavGroups: NavGroup[];
export declare const iamNavItems: NavItem[];
//# sourceMappingURL=iam-nav-static.d.ts.map