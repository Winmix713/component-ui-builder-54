
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LivePreview } from './LivePreview';
import { CodeEditor } from './CodeEditor';
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
  isLoading: boolean;
}

export const PlaygroundTabs: React.FC<PlaygroundTabsProps> = ({
  code,
  componentType,
  props,
  onCodeChange,
  onRenderError,
  isLoading
}) => {
  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      onCodeChange(value);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div role="region" aria-label="Component playground tabs">
      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview" data-tab="preview">
            Preview
          </TabsTrigger>
          <TabsTrigger value="code" data-tab="code">
            Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" role="tabpanel">
          <ComponentErrorBoundary>
            <LivePreview
              code={code}
              componentType={componentType}
            />
          </ComponentErrorBoundary>
        </TabsContent>

        <TabsContent value="code" role="tabpanel">
          <ComponentErrorBoundary>
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              height="400px"
            />
          </ComponentErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
};
