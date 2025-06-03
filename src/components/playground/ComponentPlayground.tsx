
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Play, Copy, Check } from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { LivePreview } from './LivePreview';
import { PropsConfigurator } from './PropsConfigurator';
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
  const [code, setCode] = useState(initialCode);
  const [props, setProps] = useState<Record<string, any>>({});
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleCodeChange = (newCode: string | undefined) => {
    if (newCode !== undefined) {
      setCode(newCode);
    }
  };

  const handlePropsChange = (newProps: Record<string, any>) => {
    setProps(newProps);
    const generatedCode = generateCodeFromProps(componentType, newProps, initialCode);
    setCode(generatedCode);
  };

  const handleReset = () => {
    setCode(initialCode);
    setProps({});
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 500);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="glass-card backdrop-blur-md border-border/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CardTitle className="text-lg">Interactive Playground</CardTitle>
            <Badge variant="secondary" className="glass-card">
              {title}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRun}
              disabled={isRunning}
              className="glass-card"
            >
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? 'Running...' : 'Run'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="glass-card"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="glass-card"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="playground" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="playground">Playground</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="props">Props</TabsTrigger>
          </TabsList>
          
          <TabsContent value="playground" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Code Editor</h3>
                <CodeEditor
                  value={code}
                  onChange={handleCodeChange}
                  height="400px"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Live Preview</h3>
                <LivePreview code={code} componentType={componentType} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="code">
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              height="500px"
            />
          </TabsContent>
          
          <TabsContent value="props">
            <PropsConfigurator
              componentType={componentType}
              onPropsChange={handlePropsChange}
              currentProps={props}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
