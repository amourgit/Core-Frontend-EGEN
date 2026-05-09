// ============================================================
// lib/security/audit-logger.ts
// Journal d'audit côté client.
//
// Rôle :
//  - Enregistrer les événements de session (expiration, révocation)
//  - Enregistrer les changements de permissions détectés
//  - Enregistrer les déconnexions (timeout, 401, révocation, manuel)
//
// Chaque entrée est envoyée au backend via POST /audit/frontend
// de façon asynchrone et non-bloquante (fire-and-forget).
// Si le backend est indisponible → entrée bufférisée en mémoire.
// ============================================================
// ── Buffer en mémoire (si le backend est down) ────────────
const MAX_BUFFER = 50;
let _buffer = [];
// ── AuditLogger ───────────────────────────────────────────
export const auditLogger = {
    log(event, options = {}) {
        const entry = {
            event,
            timestamp: new Date().toISOString(),
            user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
            ...options,
        };
        _buffer.push(entry);
        if (_buffer.length > MAX_BUFFER)
            _buffer.shift();
        this._send(entry);
    },
    _send(entry) {
        if (typeof window === 'undefined')
            return;
        const base = import.meta.env.VITE_IAM_URL || 'http://localhost:8000';
        const url = `${base}/api/v1/audit/frontend`;
        const body = JSON.stringify(entry);
        if (navigator.sendBeacon) {
            const blob = new Blob([body], { type: 'application/json' });
            navigator.sendBeacon(url, blob);
            return;
        }
        fetch(url, {
            method: 'POST',
            body,
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
            cache: 'no-store',
        }).catch(() => { });
    },
    getBuffer() { return _buffer; },
    clearBuffer() { _buffer = []; },
    // ── Helpers sémantiques ───────────────────────────────
    logInactivityTimeout(route, userId, sessionId) {
        this.log('inactivity_timeout', { route, user_id: userId, session_id: sessionId });
    },
    logSessionRevoked(userId, sessionId) {
        this.log('session_revoked', { user_id: userId, session_id: sessionId });
    },
    logTokenRefreshed(userId) {
        this.log('token_refreshed', { user_id: userId });
    },
    logForceLogout(reason, userId, sessionId) {
        this.log('logout_forced', { user_id: userId, session_id: sessionId, details: { reason } });
    },
    logManualLogout(userId, sessionId) {
        this.log('logout_manual', { user_id: userId, session_id: sessionId });
    },
};
//# sourceMappingURL=audit-logger.js.map