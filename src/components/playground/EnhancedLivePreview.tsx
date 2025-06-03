import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Eye, EyeOff, RefreshCw, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { debounce } from '@/lib/utils';

interface EnhancedLivePreviewProps {
  code: string;
  componentType: string;
  onError?: (error: Error) => void;
}

interface PreviewSettings {
  showGrid: boolean;
  darkMode: boolean;
  centerContent: boolean;
  showBounds: boolean;
}

export const EnhancedLivePreview: React.FC<EnhancedLivePreviewProps> = React.memo(({ 
  code, 
  componentType,
  onError 
}) => {
  const [error, setError] = useState<Error | null>(null);
  const [renderCount, setRenderCount] = useState(0);
  const [lastRenderTime, setLastRenderTime] = useState<number>(0);
  const [settings, setSettings] = useState<PreviewSettings>({
    showGrid: false,
    darkMode: false,
    centerContent: true,
    showBounds: false
  });

  const renderedComponent = useMemo(() => {
    const startTime = performance.now();

    try {
      setError(null);

      // Create a function that returns the component
      const createComponent = new Function(
        'React',
        'Card', 'CardContent', 'CardHeader', 'CardTitle', 'CardDescription',
        'Button',
        'Badge',
        'Input',
        'Checkbox',
        'useState',
        'useEffect',
        `
        const { useState, useEffect } = React;
        ${code}
        return ComponentDemo;
        `
      );

      const ComponentDemo = createComponent(
        React,
        Card, CardContent, CardHeader, CardTitle, CardDescription,
        Button,
        Badge,
        Input,
        Checkbox,
        React.useState,
        React.useEffect
      );

      const endTime = performance.now();
      setLastRenderTime(endTime - startTime);
      setRenderCount(prev => prev + 1);

      return <ComponentDemo />;
    } catch (error) {
      const err = error as Error;
      setError(err);

      // Schedule error callback for next tick to avoid setState during render
      setTimeout(() => {
        onError?.(err);
      }, 0);

      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="font-medium">Render Error:</div>
              <div className="text-sm font-mono bg-destructive/10 p-2 rounded">
                {err.message}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      );
    }
  }, [code, onError]);

  const handleRefresh = () => {
    setRenderCount(0);
    setError(null);
    setLastRenderTime(0);
  };

  const handleSettingChange = (key: keyof PreviewSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getGridBackground = () => {
    if (!settings.showGrid) return '';
    return 'bg-[radial-gradient(circle,_#e5e7eb_1px,_transparent_1px)] [background-size:16px_16px]';
  };

  const getPreviewClasses = () => {
    const baseClasses = [
      'p-8 border rounded-md min-h-[200px] transition-all duration-300',
      settings.centerContent ? 'flex items-center justify-center' : 'flex',
      settings.showBounds ? 'border-2 border-dashed border-blue-500' : '',
      settings.darkMode ? 'bg-slate-900 text-white' : 'bg-muted/20 backdrop-blur-sm',
      getGridBackground()
    ];

    return baseClasses.filter(Boolean).join(' ');
  };

  useEffect(() => {
    if (error && onError) {
      // Use setTimeout to avoid setState during render
      const timeoutId = setTimeout(() => {
        onError(error);
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [error, onError]);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Live Preview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {componentType}
              </Badge>
              {error && (
                <Badge variant="destructive" className="text-xs">
                  Error
                </Badge>
              )}
              {!error && (
                <Badge variant="secondary" className="text-xs">
                  Rendered {renderCount}x
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              {lastRenderTime > 0 && (
                <Badge variant="outline" className="text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  {lastRenderTime.toFixed(2)}ms
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="glass-card"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className={getPreviewClasses()}>
            {renderedComponent}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-sm">Preview Settings</CardTitle>
              <CardDescription className="text-xs">
                Customize the preview environment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="centerContent"
                    checked={settings.centerContent}
                    onCheckedChange={(value) => handleSettingChange('centerContent', value)}
                  />
                  <Label htmlFor="centerContent" className="text-sm">Center Content</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="showGrid"
                    checked={settings.showGrid}
                    onCheckedChange={(value) => handleSettingChange('showGrid', value)}
                  />
                  <Label htmlFor="showGrid" className="text-sm">Show Grid</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="darkMode"
                    checked={settings.darkMode}
                    onCheckedChange={(value) => handleSettingChange('darkMode', value)}
                  />
                  <Label htmlFor="darkMode" className="text-sm">Dark Mode</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="showBounds"
                    checked={settings.showBounds}
                    onCheckedChange={(value) => handleSettingChange('showBounds', value)}
                  />
                  <Label htmlFor="showBounds" className="text-sm">Show Bounds</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
});