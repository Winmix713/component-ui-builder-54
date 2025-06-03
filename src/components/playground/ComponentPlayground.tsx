
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Play, Zap } from 'lucide-react';
import { LazyCodeEditor } from './LazyCodeEditor';
import { EnhancedLivePreview } from './EnhancedLivePreview';
import { AdvancedPropsConfigurator } from './AdvancedPropsConfigurator';
import { EnhancedCodeEditor } from './EnhancedCodeEditor';
import { ErrorBoundary, ComponentErrorBoundary } from '@/components/error/ErrorBoundary';
import { EnhancedCopyButton } from '@/components/ui/enhanced-copy';
import { ComponentPlaygroundSkeleton } from '@/components/ui/skeleton-loaders';
import { usePlaygroundShortcuts } from '@/hooks/useKeyboardShortcuts';
import { usePerformanceMonitor } from '@/hooks/usePerformance';
import { useFocusManagement } from '@/hooks/useFocusManagement';
import { useAccessibility } from '@/components/accessibility/AccessibilityProvider';
import { toast } from '@/hooks/use-toast';

interface ComponentPlaygroundProps {
  componentType: string;
  initialCode: string;
  title: string;
}

const generateCodeFromProps = (componentType: string, props: Record<string, any>, fallbackCode: string): string => {
  switch (componentType) {
    case 'button':
      return `export function ComponentDemo() {
  return (
    <Button${props.variant !== 'default' ? ` variant="${props.variant}"` : ''}${props.size !== 'default' ? ` size="${props.size}"` : ''}${props.disabled ? ' disabled' : ''}>
      ${props.children || 'Button'}
    </Button>
  )
}`;
    case 'card':
      return `export function ComponentDemo() {
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>${props.title || 'Card Title'}</CardTitle>
        <CardDescription>${props.description || 'Card Description'}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>${props.content || 'Card Content'}</p>
      </CardContent>
    </Card>
  )
}`;
    case 'input':
      return `export function ComponentDemo() {
  return (
    <Input${props.type !== 'text' ? ` type="${props.type}"` : ''}${props.placeholder ? ` placeholder="${props.placeholder}"` : ''}${props.disabled ? ' disabled' : ''} />
  )
}`;
    case 'checkbox':
      return `export function ComponentDemo() {
  const [checked, setChecked] = useState(${props.checked || false});
  
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id="demo"
        checked={checked}
        onCheckedChange={setChecked}${props.disabled ? '\n        disabled' : ''}
      />
      <label htmlFor="demo">${props.label || 'Accept terms and conditions'}</label>
    </div>
  )
}`;
    default:
      return fallbackCode;
  }
};

export const ComponentPlayground: React.FC<ComponentPlaygroundProps> = ({
  componentType,
  initialCode,
  title
}) => {
  usePerformanceMonitor('ComponentPlayground');
  const { announceToScreenReader } = useAccessibility();
  const { containerRef } = useFocusManagement({ autoFocus: false });
  
  const [code, setCode] = useState(initialCode);
  const [props, setProps] = useState<Record<string, any>>({});
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [renderErrors, setRenderErrors] = useState<Error[]>([]);
  const [lastExecutionTime, setLastExecutionTime] = useState<number>(0);

  const handleCodeChange = (newCode: string | undefined) => {
    if (newCode !== undefined) {
      setCode(newCode);
      announceToScreenReader('Code updated');
    }
  };

  const handlePropsChange = (newProps: Record<string, any>) => {
    setProps(newProps);
    const generatedCode = generateCodeFromProps(componentType, newProps, initialCode);
    setCode(generatedCode);
    announceToScreenReader('Component props updated');
  };

  const handleReset = () => {
    setCode(initialCode);
    setProps({});
    setRenderErrors([]);
    announceToScreenReader('Playground reset to initial state');
    toast({
      title: "Reset successful",
      description: "Playground has been reset to initial state",
    });
  };

  const handleRun = () => {
    const startTime = performance.now();
    setIsRunning(true);
    setRenderErrors([]);
    announceToScreenReader('Running component code');
    
    setTimeout(() => {
      const endTime = performance.now();
      setLastExecutionTime(endTime - startTime);
      setIsRunning(false);
      announceToScreenReader('Component code execution completed');
    }, 500);
  };

  const handleCopy = () => {
    announceToScreenReader('Code copied to clipboard');
  };

  const handleRenderError = (error: Error) => {
    setRenderErrors(prev => [...prev, error]);
  };

  const handleFormat = () => {
    // Simple code formatting (in a real implementation, you'd use a proper formatter)
    const formatted = code
      .split('\n')
      .map(line => line.trim())
      .join('\n');
    setCode(formatted);
    announceToScreenReader('Code formatted');
  };

  // Set up keyboard shortcuts
  usePlaygroundShortcuts({
    onRun: handleRun,
    onCopy: handleCopy,
    onReset: handleReset,
  });

  if (isLoading) {
    return <ComponentPlaygroundSkeleton />;
  }

  return (
    <ErrorBoundary>
      <Card 
        ref={containerRef}
        className="glass-card backdrop-blur-md border-border/20"
        role="region"
        aria-label={`Interactive playground for ${title} component`}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CardTitle className="text-lg" id="playground-title">
                Enhanced Playground
              </CardTitle>
              <Badge variant="secondary" className="glass-card" aria-describedby="playground-title">
                {title}
              </Badge>
              {renderErrors.length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {renderErrors.length} Error{renderErrors.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2" role="toolbar" aria-label="Playground actions">
              {lastExecutionTime > 0 && (
                <Badge variant="outline" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  {lastExecutionTime.toFixed(2)}ms
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRun}
                disabled={isRunning}
                className="glass-card"
                aria-label={isRunning ? 'Code is running' : 'Run component code'}
              >
                <Play className="h-4 w-4 mr-2" aria-hidden="true" />
                {isRunning ? 'Running...' : 'Run'}
              </Button>
              <EnhancedCopyButton
                code={code}
                language="tsx"
                className="glass-card"
                onCopy={handleCopy}
                aria-label="Copy code to clipboard"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="glass-card"
                aria-label="Reset playground to initial state"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Reset</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="playground" className="w-full">
            <TabsList className="grid w-full grid-cols-3" role="tablist">
              <TabsTrigger value="playground" role="tab">Playground</TabsTrigger>
              <TabsTrigger value="code" role="tab">Code Editor</TabsTrigger>
              <TabsTrigger value="props" role="tab">Props</TabsTrigger>
            </TabsList>
            
            <TabsContent value="playground" className="space-y-4" role="tabpanel">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground" id="code-editor-label">
                    Code Editor
                  </h3>
                  <ComponentErrorBoundary>
                    <div role="region" aria-labelledby="code-editor-label">
                      <LazyCodeEditor
                        value={code}
                        onChange={handleCodeChange}
                        height="400px"
                      />
                    </div>
                  </ComponentErrorBoundary>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground" id="live-preview-label">
                    Live Preview
                  </h3>
                  <ComponentErrorBoundary>
                    <div role="region" aria-labelledby="live-preview-label">
                      <EnhancedLivePreview 
                        code={code} 
                        componentType={componentType}
                        onError={handleRenderError}
                      />
                    </div>
                  </ComponentErrorBoundary>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="code" role="tabpanel">
              <ComponentErrorBoundary>
                <div role="region" aria-label="Enhanced code editor">
                  <EnhancedCodeEditor
                    value={code}
                    onChange={handleCodeChange}
                    height="500px"
                    onFormat={handleFormat}
                    onReset={handleReset}
                  />
                </div>
              </ComponentErrorBoundary>
            </TabsContent>
            
            <TabsContent value="props" role="tabpanel">
              <ComponentErrorBoundary>
                <div role="region" aria-label="Advanced component properties configurator">
                  <AdvancedPropsConfigurator
                    componentType={componentType}
                    onPropsChange={handlePropsChange}
                    currentProps={props}
                    onReset={() => setProps({})}
                  />
                </div>
              </ComponentErrorBoundary>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};
