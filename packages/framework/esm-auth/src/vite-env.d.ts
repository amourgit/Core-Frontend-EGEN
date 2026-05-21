// Compatibilité webpack + Vite : déclare import.meta.env pour TypeScript
interface ImportMeta {
  readonly env: Record<string, string | boolean | undefined> & {
    readonly VITE_KEYCLOAK_REALM?: string;
    readonly VITE_KEYCLOAK_URL?: string;
    readonly VITE_KEYCLOAK_CLIENT?: string;
    readonly egen_IAM_URL?: string;
    readonly MODE?: string;
    readonly DEV?: boolean;
    readonly PROD?: boolean;
  };
}
