
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  variant?: 'card' | 'alert' | 'inline';
  showRetry?: boolean;
  showDetails?: boolean;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryTimeouts: NodeJS.Timeout[] = [];

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, retryCount: 0 };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Track error in analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        custom_parameter: errorInfo.componentStack
      });
    }
    
    this.props.onError?.(error, errorInfo);
  }

  componentWillUnmount() {
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  handleRetry = () => {
    const delay = Math.min(1000 * Math.pow(2, this.state.retryCount), 5000);
    
    const timeout = setTimeout(() => {
      this.setState(prevState => ({ 
        hasError: false, 
        error: undefined, 
        retryCount: prevState.retryCount + 1 
      }));
    }, delay);
    
    this.retryTimeouts.push(timeout);
  };

  renderError() {
    const { variant = 'card', showRetry = true, showDetails = false } = this.props;
    const { error, retryCount } = this.state;
    
    const errorMessage = error?.message || 'An unexpected error occurred';
    const isRetrying = retryCount > 0;
    
    const content = (
      <>
        <div className="flex items-center space-x-2 text-destructive mb-3">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-medium">Something went wrong</span>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
          
          {showDetails && error?.stack && (
            <details className="text-xs">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                <Bug className="h-3 w-3 inline mr-1" />
                Show technical details
              </summary>
              <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                {error.stack}
              </pre>
            </details>
          )}
          
          {showRetry && (
            <div className="flex items-center justify-between">
              <Button 
                onClick={this.handleRetry} 
                variant="outline" 
                size="sm"
                disabled={isRetrying}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Retrying...' : 'Try again'}
              </Button>
              
              {retryCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  Attempt {retryCount + 1}
                </span>
              )}
            </div>
          )}
        </div>
      </>
    );

    switch (variant) {
      case 'alert':
        return (
          <Alert variant="destructive">
            <AlertDescription>{content}</AlertDescription>
          </Alert>
        );
      
      case 'inline':
        return (
          <div className="p-4 border border-destructive/20 rounded-md bg-destructive/5">
            {content}
          </div>
        );
      
      case 'card':
      default:
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-sm">Error</CardTitle>
            </CardHeader>
            <CardContent>{content}</CardContent>
          </Card>
        );
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || this.renderError();
    }

    return this.props.children;
  }
}

// Simplified component error boundary for inline use
export function ComponentErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary 
      variant="alert" 
      showRetry={true} 
      showDetails={process.env.NODE_ENV === 'development'}
    >
      {children}
    </ErrorBoundary>
  );
}
