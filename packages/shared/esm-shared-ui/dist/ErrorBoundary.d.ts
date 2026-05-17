import React, { Component, type ReactNode, type ErrorInfo } from 'react';
interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: (error: Error, reset: () => void) => ReactNode;
    onError?: (error: Error, info: ErrorInfo) => void;
}
interface ErrorBoundaryState {
    error: Error | null;
}
/**
 * Error Boundary partagé — isole les crashes d'un micro-frontend.
 * Compatible Module Federation : chaque MFE doit en avoir un à la racine.
 */
export declare class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): {
        error: Error;
    };
    componentDidCatch(error: Error, info: ErrorInfo): void;
    reset(): void;
    render(): string | number | boolean | Iterable<React.ReactNode> | import("react/jsx-runtime").JSX.Element;
}
export {};
//# sourceMappingURL=ErrorBoundary.d.ts.map