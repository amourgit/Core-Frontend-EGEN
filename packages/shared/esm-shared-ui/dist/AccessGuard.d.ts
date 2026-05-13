import React from 'react';
interface AccessGuardProps {
    /** Permissions requises (toutes) */
    required?: string[];
    /** Composant à afficher si accès refusé */
    fallback?: React.ReactNode;
    /** Afficher le contenu en mode dégradé sans permissions */
    graceful?: boolean;
    children: React.ReactNode;
}
/**
 * Garde d'accès basée sur les permissions IGEN.
 * Enveloppe les zones sensibles d'un micro-frontend.
 *
 * @example
 * <AccessGuard required={['patient:write']}>
 *   <EditPatientForm />
 * </AccessGuard>
 */
export declare function AccessGuard({ required, fallback, graceful, children }: AccessGuardProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=AccessGuard.d.ts.map