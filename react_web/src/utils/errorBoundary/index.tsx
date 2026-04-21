import React, { Component, ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to service like Sentry
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }

    render() {
        const { fallback } = this.props;

        if (this.state.hasError) {
            return fallback || <h2>Something went wrong.</h2>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
