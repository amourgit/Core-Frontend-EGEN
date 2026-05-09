export interface CoreUser {
    id: string;
    username: string;
    email: string;
    prenom?: string;
    nom?: string;
    roles: string[];
    token: string;
    tenantId: string;
    avatarUrl?: string;
}
export interface CoreTenant {
    id: string;
    subdomain: string;
    name: string;
    logoUrl?: string;
    theme?: {
        primary: string;
        secondary: string;
    };
}
export interface CoreContext {
    user: CoreUser;
    tenant: CoreTenant;
    basePath: string;
    navigate: (path: string) => void;
    hasShellLayout: boolean;
    permissions?: string[];
}
export interface MicroAppProps {
    coreContext: CoreContext;
    basePath?: string;
}
export interface MicroserviceManifest {
    id: string;
    label: string;
    description: string;
    icon: string;
    color: string;
    basePath: string;
    version: string;
    requiredRoles: string[];
    eager: boolean;
    order: number;
    badge?: string;
    defaultEnabled: boolean;
    routes: Array<{
        path: string;
        label: string;
        icon: string;
        description?: string;
        requiredRoles?: string[];
    }>;
}
export interface MicroNavItem {
    id: string;
    label: string;
    description?: string;
    iconName?: string;
    path: string;
    badge?: string;
    group?: string;
    children?: MicroNavItem[];
}
export interface MicroNavGroup {
    id: string;
    label: string;
    color: string;
}
export interface TenantConfig {
    name: string;
    logo?: string;
    theme?: {
        primary: string;
        secondary: string;
    };
    modules: Array<{
        name: string;
        url: string;
        enabled: boolean;
    }>;
}
export type CoreConfig = CoreTenant;
export interface MicrofrontendConfig {
    id: string;
    url: string;
    scope: string;
    module: string;
    enabled: boolean;
}
export interface RegistryEntry {
    id: string;
    manifest: MicroserviceManifest;
    loaded: boolean;
    error?: string;
}
//# sourceMappingURL=types.d.ts.map