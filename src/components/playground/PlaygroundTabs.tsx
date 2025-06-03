
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
  onCodeChange: (code: string | undefined) => void;
  onPropsChange: (props: Record<string, any>) => void;
  onVariationSelect: (variation: any) => void;
  onVariationRemove: (id: string) => void;
  onRenderError: (error: Error) => void;
  onFormat: () => void;
  onReset: () => void;
}

export const PlaygroundTabs: React.FC<PlaygroundTabsProps> = ({
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
                  value={code}
                  onChange={onCodeChange}
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
                  onError={onRenderError}
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
              onVariationSelect={onVariationSelect}
              onVariationRemove={onVariationRemove}
            />
          </div>
        </ComponentErrorBoundary>
      </TabsContent>
      
      <TabsContent value="responsive" role="tabpanel">
        <ComponentErrorBoundary>
          <div role="region" aria-label="Responsive preview">
            <ResponsivePreview componentType={componentType}>
              <EnhancedLivePreview 
                code={code} 
                componentType={componentType}
                onError={onRenderError}
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
    </Tabs>
  );
};
