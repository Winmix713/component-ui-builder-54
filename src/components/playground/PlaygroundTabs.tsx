
import React, { useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LazyCodeEditor } from './LazyCodeEditor';
import { EnhancedLivePreview } from './EnhancedLivePreview';
import { AdvancedPropsConfigurator } from './AdvancedPropsConfigurator';
import { EnhancedCodeEditor } from './EnhancedCodeEditor';
import { ComponentVariations } from './ComponentVariations';
import { CodeGenerator } from './CodeGenerator';
import { ResponsivePreview } from './ResponsivePreview';
import { ComponentErrorBoundary } from '@/components/error/ErrorBoundary';
import { useAccessibility } from '@/components/accessibility/AccessibilityProvider';
import { FocusManager } from '@/components/accessibility/FocusManager';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';
import { LoadingState, CodeEditorLoadingSkeleton, PreviewLoadingSkeleton, PropsConfiguratorLoadingSkeleton } from '@/components/loading/EnhancedLoadingStates';

interface PlaygroundTabsProps {
  code: string;
  componentType: string;
  props: Record<string, any>;
  variations: any[];
  activeVariation: string | null;
  onCodeChange: (code: string) => void;
  onPropsChange: (props: Record<string, any>) => void;
  onVariationSelect: (variation: any) => void;
  onVariationRemove: (id: string) => void;
  onRenderError: (error: Error) => void;
  onFormat: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

export const PlaygroundTabs: React.FC<PlaygroundTabsProps> = React.memo(({
  code,
  componentType,
  props,
  variations,
  activeVariation,
  onCodeChange,
  onPropsChange,
  onVariationSelect,
  onVariationRemove,
  onRenderError,
  onFormat,
  onReset,
  isLoading = false
}) => {
  const { announceToScreenReader } = useAccessibility();
  const [activeTab, setActiveTab] = React.useState('preview');

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    const tabNames = {
      preview: 'Live Preview',
      code: 'Code Editor',
      props: 'Properties Configurator',
      variations: 'Component Variations',
      responsive: 'Responsive Preview'
    };
    announceToScreenReader(`Switched to ${tabNames[value as keyof typeof tabNames]} tab`);
  }, [announceToScreenReader]);

  const handleKeyboardShortcuts = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case '1':
          e.preventDefault();
          (document.querySelector('[data-tab="preview"]') as HTMLElement)?.click();
          break;
        case '2':
          e.preventDefault();
          (document.querySelector('[data-tab="code"]') as HTMLElement)?.click();
          break;
        case '3':
          e.preventDefault();
          (document.querySelector('[data-tab="props"]') as HTMLElement)?.click();
          break;
        case '4':
          e.preventDefault();
          (document.querySelector('[data-tab="variations"]') as HTMLElement)?.click();
          break;
        case '5':
          e.preventDefault();
          (document.querySelector('[data-tab="responsive"]') as HTMLElement)?.click();
          break;
      }
    }
  }, []);

  if (isLoading) {
    return <LoadingState variant="skeleton" message="Loading playground..." />;
  }

  return (
    <FocusManager>
      <div onKeyDown={handleKeyboardShortcuts} role="region" aria-label="Component playground tabs">
        <Tabs defaultValue="preview" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-5" role="tablist">
            <TabsTrigger 
              value="preview" 
              data-tab="preview"
              aria-label="Live Preview (Ctrl+1)"
              title="Ctrl+1"
            >
              Preview
            </TabsTrigger>
            <TabsTrigger 
              value="code" 
              data-tab="code"
              aria-label="Code Editor (Ctrl+2)"
              title="Ctrl+2"
            >
              Code
            </TabsTrigger>
            <TabsTrigger 
              value="props" 
              data-tab="props"
              aria-label="Properties (Ctrl+3)"
              title="Ctrl+3"
            >
              Props
            </TabsTrigger>
            <TabsTrigger 
              value="variations" 
              data-tab="variations"
              aria-label="Variations (Ctrl+4)"
              title="Ctrl+4"
            >
              Variations
            </TabsTrigger>
            <TabsTrigger 
              value="responsive" 
              data-tab="responsive"
              aria-label="Responsive (Ctrl+5)"
              title="Ctrl+5"
            >
              Responsive
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" role="tabpanel" aria-labelledby="tab-preview">
            <ComponentErrorBoundary>
              <div role="region" aria-label="Live component preview" aria-live="polite">
                <React.Suspense fallback={<PreviewLoadingSkeleton />}>
                  <EnhancedLivePreview
                    code={code}
                    componentType={componentType}
                    onRenderError={onRenderError}
                  />
                </React.Suspense>
              </div>
            </ComponentErrorBoundary>
          </TabsContent>

          <TabsContent value="code" role="tabpanel" aria-labelledby="tab-code">
            <ComponentErrorBoundary>
              <div role="region" aria-label="Code generator and export">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <div aria-label="Code editor">
                    <React.Suspense fallback={<CodeEditorLoadingSkeleton />}>
                      <EnhancedCodeEditor
                        value={code}
                        onChange={onCodeChange}
                        height="500px"
                        onFormat={onFormat}
                        onReset={onReset}
                      />
                    </React.Suspense>
                  </div>
                  <div aria-label="Code generator and performance metrics" className="space-y-4">
                    <CodeGenerator
                      componentType={componentType}
                      currentProps={props}
                      currentCode={code}
                    />
                    <PerformanceMonitor componentName={componentType} />
                  </div>
                </div>
              </div>
            </ComponentErrorBoundary>
          </TabsContent>

          <TabsContent value="props" role="tabpanel" aria-labelledby="tab-props">
            <ComponentErrorBoundary>
              <div role="region" aria-label="Advanced component properties configurator">
                <React.Suspense fallback={<PropsConfiguratorLoadingSkeleton />}>
                  <AdvancedPropsConfigurator
                    componentType={componentType}
                    onPropsChange={onPropsChange}
                    currentProps={props}
                    onReset={() => onPropsChange({})}
                  />
                </React.Suspense>
              </div>
            </ComponentErrorBoundary>
          </TabsContent>

          <TabsContent value="variations" role="tabpanel" aria-labelledby="tab-variations">
            <ComponentErrorBoundary>
              <div role="region" aria-label="Component variations and presets">
                <ComponentVariations
                  variations={variations}
                  activeVariation={activeVariation}
                  onVariationSelect={onVariationSelect}
                  onVariationRemove={onVariationRemove}
                />
              </div>
            </ComponentErrorBoundary>
          </TabsContent>

          <TabsContent value="responsive" role="tabpanel" aria-labelledby="tab-responsive">
            <ComponentErrorBoundary>
              <div role="region" aria-label="Responsive preview across different screen sizes">
                <React.Suspense fallback={<PreviewLoadingSkeleton />}>
                  <ResponsivePreview
                    code={code}
                    componentType={componentType}
                  />
                </React.Suspense>
              </div>
            </ComponentErrorBoundary>
          </TabsContent>
        </Tabs>
        
        <div className="sr-only" aria-live="polite" id="keyboard-shortcuts-help">
          Use Ctrl+1 through Ctrl+5 to quickly switch between tabs. Press ? for help.
        </div>
      </div>
    </FocusManager>
  );
});

PlaygroundTabs.displayName = 'PlaygroundTabs';
