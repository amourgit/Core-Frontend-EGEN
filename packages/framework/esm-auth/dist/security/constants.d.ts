export declare const STORAGE_KEYS: {
    readonly LEGACY_ACCESS_TOKEN: "iam_access_token";
    readonly LEGACY_REFRESH_TOKEN: "iam_refresh_token";
    readonly LEGACY_SESSION_ID: "iam_session_id";
    readonly USER: "iam_user";
    readonly PERMISSIONS: "iam_permissions";
    readonly ROLES: "iam_roles";
};
export declare const COOKIE_NAMES: {
    readonly ACCESS_TOKEN: "iam_at";
    readonly REFRESH_TOKEN: "iam_rt";
    readonly SESSION_ID: "iam_sid";
    readonly SESSION_ACTIVE: "iam_session_active";
    readonly REFRESH_TOKEN_EXP: "iam_rt_exp";
};
export declare const TOKEN_TTL: {
    readonly ACCESS_TOKEN_SECONDS: 3600;
    readonly REFRESH_TOKEN_SECONDS: number;
    readonly SESSION_ACTIVE_SECONDS: 86400;
};
export declare const INACTIVITY: {
    readonly TIMEOUT_MS: number;
    readonly WARNING_BEFORE_MS: number;
    readonly RESET_EVENTS: readonly ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click"];
};
export declare const SESSION_MONITOR: {
    readonly POLL_STANDARD_MS: 60000;
    readonly POLL_ELEVATED_MS: 15000;
    readonly POLL_CRITICAL_MS: 5000;
    readonly HEALTH_ENDPOINT: "/compte/moi";
};
export declare const PUBLIC_EXACT_ROUTES: Set<string>;
export declare const PUBLIC_PREFIXES: readonly ["/auth/login", "/auth/forgot", "/auth/logout", "/_next", "/api", "/favicon", "/images", "/logo", "/motion_logo", "/opengraph-image", "/themes"];
export declare const SECURITY_HEADERS: {
    readonly 'X-Frame-Options': "DENY";
    readonly 'X-Content-Type-Options': "nosniff";
    readonly 'X-XSS-Protection': "1; mode=block";
    readonly 'Referrer-Policy': "strict-origin-when-cross-origin";
    readonly 'Permissions-Policy': "camera=(), microphone=(), geolocation=()";
    readonly 'Strict-Transport-Security': "max-age=63072000; includeSubDomains; preload";
};
export declare function isPublicPath(pathname: string): boolean;
/** En-tête HTTP personnalisé pour transmettre le realm Keycloak */
export declare const KEYCLOAK_REALM_HEADER = "X-Keycloak-Realm";
/** Realm Keycloak par défaut */
export declare const DEFAULT_REALM = "master";
//# sourceMappingURL=constants.d.ts.map