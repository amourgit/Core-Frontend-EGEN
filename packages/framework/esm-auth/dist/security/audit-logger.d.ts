export type AuditEventType = 'session_expired' | 'session_revoked' | 'inactivity_timeout' | 'token_refreshed' | 'permission_mismatch' | 'logout_manual' | 'logout_forced';
export interface AuditEntry {
    event: AuditEventType;
    timestamp: string;
    route?: string;
    user_id?: string;
    session_id?: string;
    details?: Record<string, unknown>;
    user_agent?: string;
}
export declare const auditLogger: {
    log(event: AuditEventType, options?: Omit<AuditEntry, "event" | "timestamp" | "user_agent">): void;
    _send(entry: AuditEntry): void;
    getBuffer(): Readonly<AuditEntry[]>;
    clearBuffer(): void;
    logInactivityTimeout(route: string, userId?: string, sessionId?: string): void;
    logSessionRevoked(userId?: string, sessionId?: string): void;
    logTokenRefreshed(userId?: string): void;
    logForceLogout(reason: string, userId?: string, sessionId?: string): void;
    logManualLogout(userId?: string, sessionId?: string): void;
};
//# sourceMappingURL=audit-logger.d.ts.map