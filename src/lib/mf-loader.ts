// ============================================================
// lib/mf-loader.ts — Chargement dynamique des remoteEntry.js
// ============================================================

declare const __webpack_init_sharing__: (scope: string) => Promise<void>;
declare const __webpack_share_scopes__: { default: unknown };

/**
 * Charge un module distant via Module Federation Runtime.
 */
export async function loadRemoteModule(
  remoteName: string,
  modulePath:  string,
  remoteUrl:   string,
): Promise<any> {
  const remoteEntryUrl = `${remoteUrl}/static/chunks/remoteEntry.js`;
  await loadScript(remoteEntryUrl);

  if (typeof __webpack_init_sharing__ !== 'undefined') {
    await __webpack_init_sharing__('default');
  }

  const container = (window as any)[remoteName];
  if (!container) {
    throw new Error(`[Core MF] Container "${remoteName}" introuvable sur ${remoteEntryUrl}`);
  }

  if (typeof __webpack_share_scopes__ !== 'undefined') {
    await container.init(__webpack_share_scopes__.default);
  }

  const factory = await container.get(modulePath);
  return factory();
}

function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${url}"]`)) { resolve(); return; }
    const s     = document.createElement('script');
    s.src       = url;
    s.async     = true;
    s.onload    = () => resolve();
    s.onerror   = () => reject(new Error(`[Core MF] Impossible de charger : ${url}`));
    document.head.appendChild(s);
  });
}

export async function checkRemoteHealth(remoteUrl: string, manifestPath = '/api/iam/manifest'): Promise<boolean> {
  try {
    const r = await fetch(`${remoteUrl}${manifestPath}`, { signal: AbortSignal.timeout(3000) });
    return r.ok;
  } catch { return false; }
}
