
import React, { useMemo, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface EnhancedLivePreviewProps {
  code: string;
  componentType: string;
  props?: Record<string, any>;
  onError?: (error: Error) => void;
}

export const EnhancedLivePreview: React.FC<EnhancedLivePreviewProps> = React.memo(({ 
  code, 
  componentType,
  props = {},
  onError 
}) => {
  const [error, setError] = useState<Error | null>(null);
  const [renderCount, setRenderCount] = useState(0);

  const handleRenderError = useCallback((error: Error) => {
    setError(error);
    onError?.(error);
  }, [onError]);

  const renderedComponent = useMemo(() => {
    try {
      setError(null);

      // Strip export keywords from the code before passing to new Function
      const cleanedCode = code
        .replace(/^export\s+default\s+/m, '')
        .replace(/^export\s+/m, '');

      // Create a function that returns the component with React hooks available
      const createComponent = new Function(
        'React',
        'Card', 'CardContent', 'CardHeader', 'CardTitle', 'CardDescription',
        'Button',
        'Badge',
        'Input',
        'Checkbox',
        `
        // Destructure React hooks to avoid redeclaration
        const { useState, useEffect, useMemo, useCallback } = React;
        ${cleanedCode}
        return ComponentDemo;
        `
      );

      const ComponentDemo = createComponent(
        React,
        Card, CardContent, CardHeader, CardTitle, CardDescription,
        Button,
        Badge,
        Input,
        Checkbox
      );

      setRenderCount(prev => prev + 1);

      return <ComponentDemo {...props} />;
    } catch (error) {
      const err = error as Error;
      handleRenderError(err);

      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="font-medium">Render Error:</div>
              <div className="text-sm font-mono bg-destructive/10 p-2 rounded">
                {err.message}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      );
    }
  }, [code, props, handleRenderError]);

  const handleRefresh = useCallback(() => {
    setRenderCount(0);
    setError(null);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {componentType}
          </Badge>
          {error && (
            <Badge variant="destructive" className="text-xs">
              Error
            </Badge>
          )}
          {!error && (
            <Badge variant="secondary" className="text-xs">
              Rendered {renderCount}x
            </Badge>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-8 border rounded-md bg-muted/20 backdrop-blur-sm flex items-center justify-center min-h-[200px]">
        {renderedComponent}
      </div>
    </div>
  );
});

EnhancedLivePreview.displayName = 'EnhancedLivePreview';
