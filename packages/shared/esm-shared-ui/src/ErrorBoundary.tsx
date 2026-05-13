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
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
    console.error('[IGEN ErrorBoundary]', error, info.componentStack);
  }

  reset() {
    this.setState({ error: null });
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) {
        return <>{this.props.fallback(this.state.error, this.reset)}</>;
      }
      return (
        <div className="igen-error-boundary" role="alert">
          <h2>Une erreur est survenue dans ce module</h2>
          <p>{this.state.error.message}</p>
          <button onClick={this.reset}>Réessayer</button>
        </div>
      );
    }
    return this.props.children;
  }
}
