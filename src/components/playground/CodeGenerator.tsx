
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Code, Download, Copy, FileText } from 'lucide-react';
import { EnhancedCopyButton } from '@/components/ui/enhanced-copy';
import { toast } from '@/hooks/use-toast';

interface CodeGeneratorProps {
  componentType: string;
  currentProps: Record<string, any>;
  currentCode: string;
}

type ExportFormat = 'jsx' | 'tsx' | 'vue' | 'react-native';

const formatCode = (componentType: string, props: Record<string, any>, format: ExportFormat): string => {
  switch (format) {
    case 'jsx':
      return generateJSX(componentType, props);
    case 'tsx':
      return generateTSX(componentType, props);
    case 'vue':
      return generateVue(componentType, props);
    case 'react-native':
      return generateReactNative(componentType, props);
    default:
      return generateTSX(componentType, props);
  }
};

const generateJSX = (componentType: string, props: Record<string, any>): string => {
  const propsString = Object.entries(props)
    .filter(([_, value]) => value !== undefined && value !== '')
    .map(([key, value]) => {
      if (typeof value === 'boolean') {
        return value ? key : '';
      }
      return `${key}="${value}"`;
    })
    .filter(Boolean)
    .join(' ');

  const componentName = componentType.charAt(0).toUpperCase() + componentType.slice(1);
  
  switch (componentType) {
    case 'button':
      return `import { Button } from '@/components/ui/button';

export function MyComponent() {
  return (
    <Button${propsString ? ` ${propsString}` : ''}>
      ${props.children || 'Button'}
    </Button>
  );
}`;
    
    case 'card':
      return `import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function MyComponent() {
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
  );
}`;
    
    case 'input':
      return `import { Input } from '@/components/ui/input';

export function MyComponent() {
  return (
    <Input${propsString ? ` ${propsString}` : ''} />
  );
}`;
    
    default:
      return `// Generated code for ${componentName} component
export function MyComponent() {
  return <${componentName}${propsString ? ` ${propsString}` : ''} />;
}`;
  }
};

const generateTSX = (componentType: string, props: Record<string, any>): string => {
  return generateJSX(componentType, props).replace('export function MyComponent()', 'export function MyComponent(): JSX.Element');
};

const generateVue = (componentType: string, props: Record<string, any>): string => {
  const componentName = componentType.charAt(0).toUpperCase() + componentType.slice(1);
  return `<template>
  <${componentName}${Object.entries(props).map(([key, value]) => ` :${key}="${value}"`).join('')} />
</template>

<script setup lang="ts">
import ${componentName} from '@/components/ui/${componentType}';
</script>`;
};

const generateReactNative = (componentType: string, props: Record<string, any>): string => {
  return `import React from 'react';
import { View } from 'react-native';

export function MyComponent() {
  return (
    <View>
      {/* React Native equivalent for ${componentType} */}
    </View>
  );
}`;
};

export const CodeGenerator: React.FC<CodeGeneratorProps> = ({
  componentType,
  currentProps,
  currentCode
}) => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('tsx');
  const [activeTab, setActiveTab] = useState<'current' | 'generated'>('current');

  const generatedCode = formatCode(componentType, currentProps, exportFormat);
  const displayCode = activeTab === 'current' ? currentCode : generatedCode;

  const handleExport = () => {
    const filename = `${componentType}-component.${exportFormat === 'vue' ? 'vue' : exportFormat}`;
    const blob = new Blob([displayCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Code exported",
      description: `${filename} has been downloaded`,
    });
  };

  const formatLabels = {
    jsx: 'React JSX',
    tsx: 'React TSX',
    vue: 'Vue 3',
    'react-native': 'React Native'
  };

  return (
    <Card className="glass-card backdrop-blur-md border-border/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Code className="h-5 w-5" />
            Code Generator
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {formatLabels[exportFormat]}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="glass-card"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'current' | 'generated')}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="current">Current Code</TabsTrigger>
              <TabsTrigger value="generated">Generated Code</TabsTrigger>
            </TabsList>
            
            <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as ExportFormat)}>
              <SelectTrigger className="w-32 bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jsx">JSX</SelectItem>
                <SelectItem value="tsx">TSX</SelectItem>
                <SelectItem value="vue">Vue</SelectItem>
                <SelectItem value="react-native">React Native</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="current" className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Your current playground code
              </p>
              <EnhancedCopyButton
                code={currentCode}
                language="tsx"
                className="glass-card"
              />
            </div>
            <div className="bg-muted/20 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre-wrap">{currentCode}</pre>
            </div>
          </TabsContent>

          <TabsContent value="generated" className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Generated from current props
              </p>
              <EnhancedCopyButton
                code={generatedCode}
                language={exportFormat === 'vue' ? 'vue' : 'tsx'}
                className="glass-card"
              />
            </div>
            <div className="bg-muted/20 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre-wrap">{generatedCode}</pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
