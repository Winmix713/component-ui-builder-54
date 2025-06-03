
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface LivePreviewProps {
  code: string;
  componentType: string;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ code, componentType }) => {
  const renderedComponent = useMemo(() => {
    try {
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
        Input
      );

      return <ComponentDemo />;
    } catch (error) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error rendering component: {(error as Error).message}
          </AlertDescription>
        </Alert>
      );
    }
  }, [code]);

  return (
    <div className="p-8 border rounded-md bg-muted/20 backdrop-blur-sm flex items-center justify-center min-h-[200px]">
      {renderedComponent}
    </div>
  );
};
