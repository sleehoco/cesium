import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  routeName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class RouteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Route Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });

    // You can also log to an error reporting service here
    // Example: Sentry.captureException(error);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-8">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="rounded-full bg-destructive/10 p-4">
                <AlertTriangle className="w-12 h-12 text-destructive" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  Oops! Something went wrong
                </h1>
                <p className="text-muted-foreground">
                  {this.props.routeName 
                    ? `An error occurred while loading ${this.props.routeName}.` 
                    : 'An unexpected error occurred on this page.'}
                </p>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <Card className="w-full p-4 bg-muted text-left">
                  <p className="font-mono text-sm text-destructive mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="text-xs overflow-auto max-h-40 text-muted-foreground">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </Card>
              )}

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button
                  onClick={this.handleReset}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="gap-2"
                >
                  <Link to="/">
                    <Home className="w-4 h-4" />
                    Go Home
                  </Link>
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                If this problem persists, please contact support.
              </p>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
