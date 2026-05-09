// ============================================================
// hooks/useKeycloakSession.ts
// Hook de vérification directe de session Keycloak.
//
// RÔLE :
//  Expose une fonction `checkKeycloakSession()` pour vérifier
//  manuellement si la session Keycloak est encore active.
//
//  Utile pour :
//   - Vérification avant une action critique (paiement, soumission)
//   - Détection de révocation à la demande
//   - Affichage d'un indicateur de santé de session dans l'UI
//
// UTILISATION :
//   const { isSessionValid, isChecking, check } = useKeycloakSession();
//   await check(); // → true si session active, false si révoquée
// ============================================================
import { useState, useCallback } from 'react';
import { tokenManager } from '../security/token-manager';
import { getCurrentRealm } from '../lib/realm-resolver';
export function useKeycloakSession() {
    const [isSessionValid, setIsSessionValid] = useState(null);
    const [isChecking, setIsChecking] = useState(false);
    const [lastError, setLastError] = useState(null);
    const [lastCheckedAt, setLastCheckedAt] = useState(0);
    const check = useCallback(async () => {
        const accessToken = tokenManager.getAccessToken();
        if (!accessToken) {
            setIsSessionValid(false);
            setLastError('Pas de token en mémoire');
            return false;
        }
        setIsChecking(true);
        setLastError(null);
        try {
            const { oidcBase } = getCurrentRealm();
            const res = await fetch(`${oidcBase}/userinfo`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Cache-Control': 'no-store',
                },
                signal: AbortSignal.timeout(8000),
            });
            const valid = res.ok;
            setIsSessionValid(valid);
            setLastCheckedAt(Date.now());
            if (!valid && res.status !== 401 && res.status !== 403) {
                setLastError(`Keycloak a retourné HTTP ${res.status}`);
            }
            return valid;
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'Erreur réseau';
            setLastError(msg);
            // Erreur réseau → on ne change pas isSessionValid (failsafe)
            return isSessionValid ?? false;
        }
        finally {
            setIsChecking(false);
        }
    }, [isSessionValid]);
    return { isSessionValid, isChecking, lastError, lastCheckedAt, check };
}
//# sourceMappingURL=useKeycloakSession.js.map