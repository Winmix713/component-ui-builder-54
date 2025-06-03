
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LazyCodeEditor } from './LazyCodeEditor';
import { EnhancedLivePreview } from './EnhancedLivePreview';
import { AdvancedPropsConfigurator } from './AdvancedPropsConfigurator';
import { EnhancedCodeEditor } from './EnhancedCodeEditor';
import { ComponentVariations } from './ComponentVariations';
import { CodeGenerator } from './CodeGenerator';
import { ResponsivePreview } from './ResponsivePreview';
import { ComponentErrorBoundary } from '@/components/error/ErrorBoundary';

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
  onReset
}) => {
  return (
    <Tabs defaultValue="preview" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsTrigger value="props">Props</TabsTrigger>
        <TabsTrigger value="variations">Variations</TabsTrigger>
        <TabsTrigger value="responsive">Responsive</TabsTrigger>
      </TabsList>

      <TabsContent value="preview" role="tabpanel">
        <ComponentErrorBoundary>
          <div role="region" aria-label="Live component preview">
            <EnhancedLivePreview
              code={code}
              componentType={componentType}
              onRenderError={onRenderError}
            />
          </div>
        </ComponentErrorBoundary>
      </TabsContent>

      <TabsContent value="code" role="tabpanel">
        <ComponentErrorBoundary>
          <div role="region" aria-label="Code generator and export">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <EnhancedCodeEditor
                value={code}
                onChange={onCodeChange}
                height="500px"
                onFormat={onFormat}
                onReset={onReset}
              />
              <CodeGenerator
                componentType={componentType}
                currentProps={props}
                currentCode={code}
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
              onPropsChange={onPropsChange}
              currentProps={props}
              onReset={() => onPropsChange({})}
            />
          </div>
        </ComponentErrorBoundary>
      </TabsContent>

      <TabsContent value="variations" role="tabpanel">
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

      <TabsContent value="responsive" role="tabpanel">
        <ComponentErrorBoundary>
          <div role="region" aria-label="Responsive preview across different screen sizes">
            <ResponsivePreview
              code={code}
              componentType={componentType}
            />
          </div>
        </ComponentErrorBoundary>
      </TabsContent>
    </Tabs>
  );
});

PlaygroundTabs.displayName = 'PlaygroundTabs';
