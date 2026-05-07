/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IAM_URL: string;
  readonly VITE_REGISTRY_URL: string;
  readonly VITE_KEYCLOAK_URL: string;
  readonly VITE_KEYCLOAK_REALM: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Déclarations des modules fédérés (types approximatifs)
declare module 'iam/App' {
  import type React from 'react';
  interface IAMAppProps { coreContext?: any; basePath?: string; embedded?: boolean; }
  const IAMApp: React.ComponentType<IAMAppProps>;
  export default IAMApp;
}
declare module 'iam/manifest' {
  const manifest: any;
  export default manifest;
}
declare module 'iam/navigation' {
  export const iamNavItems: any[];
  export const iamNavGroups: any[];
}
