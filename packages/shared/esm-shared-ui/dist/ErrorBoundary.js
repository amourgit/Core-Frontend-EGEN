import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
/**
 * Error Boundary partagé — isole les crashes d'un micro-frontend.
 * Compatible Module Federation : chaque MFE doit en avoir un à la racine.
 */
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
        this.reset = this.reset.bind(this);
    }
    static getDerivedStateFromError(error) {
        return { error };
    }
    componentDidCatch(error, info) {
        this.props.onError?.(error, info);
        console.error('[egen ErrorBoundary]', error, info.componentStack);
    }
    reset() {
        this.setState({ error: null });
    }
    render() {
        if (this.state.error) {
            if (this.props.fallback) {
                return _jsx(_Fragment, { children: this.props.fallback(this.state.error, this.reset) });
            }
            return (_jsxs("div", { className: "egen-error-boundary", role: "alert", children: [_jsx("h2", { children: "Une erreur est survenue dans ce module" }), _jsx("p", { children: this.state.error.message }), _jsx("button", { onClick: this.reset, children: "R\u00E9essayer" })] }));
        }
        return this.props.children;
    }
}
