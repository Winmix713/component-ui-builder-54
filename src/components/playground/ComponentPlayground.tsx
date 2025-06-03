
import React, { useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PlaygroundHeader } from './PlaygroundHeader';
import { PlaygroundTabs } from './PlaygroundTabs';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { ComponentPlaygroundSkeleton } from '@/components/ui/skeleton-loaders';
import { usePlaygroundLogic } from '@/hooks/usePlaygroundLogic';

interface ComponentPlaygroundProps {
  componentType: string;
  initialCode: string;
  title: string;
}

export const ComponentPlayground: React.FC<ComponentPlaygroundProps> = React.memo(({ 
  componentType, 
  title, 
  initialCode 
}) => {
  const {
    state,
    handlers,
    variations,
    activeVariation,
    variationHandlers,
    containerRef
  } = usePlaygroundLogic({ componentType, title, initialCode });

  // Memoize header props to prevent unnecessary re-renders
  const headerProps = useMemo(() => ({
    title,
    renderErrorsCount: state.renderErrors.length,
    isRunning: state.isRunning,
    lastExecutionTime: state.lastExecutionTime,
    code: state.code,
    onRun: handlers.handleRun,
    onReset: handlers.handleReset,
    onSaveAsVariation: handlers.handleSaveAsVariation,
    onCopy: handlers.handleCopy
  }), [
    title, 
    state.renderErrors.length, 
    state.isRunning, 
    state.lastExecutionTime, 
    state.code,
    handlers.handleRun,
    handlers.handleReset,
    handlers.handleSaveAsVariation,
    handlers.handleCopy
  ]);

  // Memoize tabs props to prevent unnecessary re-renders
  const tabsProps = useMemo(() => ({
    code: state.code,
    componentType,
    props: state.props,
    variations,
    activeVariation,
    onCodeChange: handlers.handleCodeChange,
    onPropsChange: handlers.handlePropsChange,
    onVariationSelect: handlers.handleVariationSelectWithActiveState,
    onVariationRemove: variationHandlers.removeVariation,
    onRenderError: handlers.handleRenderError,
    onFormat: handlers.handleFormat,
    onReset: handlers.handleReset
  }), [
    state.code,
    componentType,
    state.props,
    variations,
    activeVariation,
    handlers.handleCodeChange,
    handlers.handlePropsChange,
    handlers.handleVariationSelectWithActiveState,
    variationHandlers.removeVariation,
    handlers.handleRenderError,
    handlers.handleFormat,
    handlers.handleReset
  ]);

  // Memoized error handler for better performance
  const handlePlaygroundError = useCallback((error: Error) => {
    console.error('ComponentPlayground error:', error);
    handlers.handleRenderError(error);
  }, [handlers.handleRenderError]);

  if (state.isLoading) {
    console.log('ComponentPlayground: Showing loading skeleton');
    return <ComponentPlaygroundSkeleton />;
  }

  console.log('ComponentPlayground: Rendering main interface');

  return (
    <ErrorBoundary 
      variant="card" 
      showRetry={true} 
      showDetails={process.env.NODE_ENV === 'development'}
      onError={handlePlaygroundError}
    >
      <Card 
        ref={containerRef}
        className="glass-card backdrop-blur-md border-border/20"
        role="region"
        aria-label={`Interactive playground for ${title} component`}
      >
        <PlaygroundHeader {...headerProps} />
        <CardContent>
          <PlaygroundTabs {...tabsProps} />
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
});

ComponentPlayground.displayName = 'ComponentPlayground';
