import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
                    <div className="max-w-md w-full glass-card rounded-2xl p-8 text-center border-destructive/20 bg-destructive/5">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 mx-auto mb-6 flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-destructive" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
                        <p className="text-muted-foreground mb-6">
                            We encountered an unexpected error. Please try reloading the page.
                        </p>

                        <div className="text-left bg-black/20 p-4 rounded-lg text-xs font-mono mb-6 overflow-auto max-h-40">
                            <p className="text-red-400 font-semibold mb-1">
                                {this.state.error?.toString()}
                            </p>
                            <pre className="text-muted-foreground opacity-70">
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        </div>

                        <Button
                            onClick={() => window.location.reload()}
                            variant="outline"
                            className="w-full gap-2 border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reload Application
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
