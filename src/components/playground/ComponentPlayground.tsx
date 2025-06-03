
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LazyCodeEditor } from './LazyCodeEditor';
import { EnhancedLivePreview } from './EnhancedLivePreview';
import { AdvancedPropsConfigurator } from './AdvancedPropsConfigurator';
import { EnhancedCodeEditor } from './EnhancedCodeEditor';
import { ComponentVariations } from './ComponentVariations';
import { CodeGenerator } from './CodeGenerator';
import { ResponsivePreview } from './ResponsivePreview';
import { PlaygroundHeader } from './PlaygroundHeader';
import { ErrorBoundary, ComponentErrorBoundary } from '@/components/error/ErrorBoundary';
import { ComponentPlaygroundSkeleton } from '@/components/ui/skeleton-loaders';
import { usePlaygroundShortcuts } from '@/hooks/useKeyboardShortcuts';
import { usePerformanceMonitor } from '@/hooks/usePerformance';
import { useFocusManagement } from '@/hooks/useFocusManagement';
import { useComponentVariations } from '@/hooks/useComponentVariations';
import { usePlaygroundState } from '@/hooks/usePlaygroundState';
import { usePlaygroundActions } from '@/hooks/usePlaygroundActions';

interface ComponentPlaygroundProps {
  componentType: string;
  initialCode: string;
  title: string;
}

export const ComponentPlayground: React.FC<ComponentPlaygroundProps> = ({
  componentType,
  initialCode,
  title
}) => {
  usePerformanceMonitor('ComponentPlayground');
  const { containerRef } = useFocusManagement({ autoFocus: false });
  
  const {
    state,
    updateCode,
    updateProps,
    setRunning,
    setLoading,
    addRenderError,
    clearRenderErrors,
    setExecutionTime,
    reset
  } = usePlaygroundState(initialCode);

  const {
    variations,
    activeVariation,
    setActiveVariation,
    addCustomVariation,
    removeVariation
  } = useComponentVariations(componentType);

  const {
    handleCodeChange,
    handlePropsChange,
    handleReset,
    handleRun,
    handleCopy,
    handleSaveAsVariation,
    handleVariationSelect
  } = usePlaygroundActions({
    componentType,
    initialCode,
    state,
    updateCode,
    updateProps,
    setRunning,
    clearRenderErrors,
    setExecutionTime,
    addCustomVariation,
    reset
  });

  const handleRenderError = (error: Error) => {
    addRenderError(error);
  };

  const handleFormat = () => {
    const formatted = state.code
      .split('\n')
      .map(line => line.trim())
      .join('\n');
    updateCode(formatted);
  };

  const handleVariationSelectWithActiveState = (variation: any) => {
    setActiveVariation(variation.id);
    handleVariationSelect(variation);
  };

  // Set up keyboard shortcuts
  usePlaygroundShortcuts({
    onRun: handleRun,
    onCopy: handleCopy,
    onReset: handleReset,
  });

  if (state.isLoading) {
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
        <PlaygroundHeader
          title={title}
          renderErrorsCount={state.renderErrors.length}
          isRunning={state.isRunning}
          lastExecutionTime={state.lastExecutionTime}
          code={state.code}
          onRun={handleRun}
          onReset={handleReset}
          onSaveAsVariation={handleSaveAsVariation}
          onCopy={handleCopy}
        />
        <CardContent>
          <Tabs defaultValue="playground" className="w-full">
            <TabsList className="grid w-full grid-cols-5" role="tablist">
              <TabsTrigger value="playground" role="tab">Playground</TabsTrigger>
              <TabsTrigger value="variations" role="tab">Variations</TabsTrigger>
              <TabsTrigger value="responsive" role="tab">Responsive</TabsTrigger>
              <TabsTrigger value="code" role="tab">Code</TabsTrigger>
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
                        value={state.code}
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
                        code={state.code} 
                        componentType={componentType}
                        onError={handleRenderError}
                      />
                    </div>
                  </ComponentErrorBoundary>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="variations" role="tabpanel">
              <ComponentErrorBoundary>
                <div role="region" aria-label="Component variations">
                  <ComponentVariations
                    variations={variations}
                    activeVariation={activeVariation}
                    onVariationSelect={handleVariationSelectWithActiveState}
                    onVariationRemove={removeVariation}
                  />
                </div>
              </ComponentErrorBoundary>
            </TabsContent>
            
            <TabsContent value="responsive" role="tabpanel">
              <ComponentErrorBoundary>
                <div role="region" aria-label="Responsive preview">
                  <ResponsivePreview componentType={componentType}>
                    <EnhancedLivePreview 
                      code={state.code} 
                      componentType={componentType}
                      onError={handleRenderError}
                    />
                  </ResponsivePreview>
                </div>
              </ComponentErrorBoundary>
            </TabsContent>
            
            <TabsContent value="code" role="tabpanel">
              <ComponentErrorBoundary>
                <div role="region" aria-label="Code generator and export">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <EnhancedCodeEditor
                      value={state.code}
                      onChange={handleCodeChange}
                      height="500px"
                      onFormat={handleFormat}
                      onReset={handleReset}
                    />
                    <CodeGenerator
                      componentType={componentType}
                      currentProps={state.props}
                      currentCode={state.code}
                    />
                  </div>
                </div>
              </ComponentErrorBoundary>
            </TabsContent>
            
            <TabsContent value="props" role="tabpanel">
              <ComponentErrorBoundary>
                <div role="region" aria-label="Advanced component properties configurator">
                  <AdvancedPropsConfigurator
                    componentType={componentType}
                    onPropsChange={handlePropsChange}
                    currentProps={state.props}
                    onReset={() => updateProps({})}
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
