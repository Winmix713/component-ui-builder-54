
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Monitor, Smartphone, Tablet, Eye, Accessibility } from 'lucide-react';
import { EnhancedLivePreview } from './EnhancedLivePreview';

interface ResponsivePreviewProps {
  code: string;
  componentType: string;
}

interface Viewport {
  name: string;
  width: number;
  height: number;
  icon: React.ComponentType<{ className?: string }>;
}

const viewports: Viewport[] = [
  { name: 'Mobile', width: 375, height: 667, icon: Smartphone },
  { name: 'Tablet', width: 768, height: 1024, icon: Tablet },
  { name: 'Desktop', width: 1280, height: 800, icon: Monitor },
];

interface AccessibilityInfo {
  contrast: 'pass' | 'fail' | 'unknown';
  focusable: boolean;
  screenReaderText: string;
  keyboardNavigation: boolean;
}

export const ResponsivePreview: React.FC<ResponsivePreviewProps> = ({
  code,
  componentType
}) => {
  const [activeViewport, setActiveViewport] = useState<string>('Desktop');
  const [darkMode, setDarkMode] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);

  const currentViewport = viewports.find(v => v.name === activeViewport) || viewports[2];

  // Mock accessibility data - in a real app, this would be calculated
  const accessibilityInfo: AccessibilityInfo = {
    contrast: 'pass',
    focusable: componentType === 'button' || componentType === 'input',
    screenReaderText: `${componentType} component`,
    keyboardNavigation: componentType === 'button' || componentType === 'input'
  };

  return (
    <Card className="glass-card backdrop-blur-md border-border/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Responsive Preview
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="darkMode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
              <Label htmlFor="darkMode" className="text-sm">Dark Mode</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="accessibility"
                checked={showAccessibility}
                onCheckedChange={setShowAccessibility}
              />
              <Label htmlFor="accessibility" className="text-sm">A11y Info</Label>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeViewport} onValueChange={setActiveViewport}>
          <TabsList className="grid w-full grid-cols-3">
            {viewports.map((viewport) => {
              const IconComponent = viewport.icon;
              return (
                <TabsTrigger key={viewport.name} value={viewport.name} className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4" />
                  {viewport.name}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {viewports.map((viewport) => (
            <TabsContent key={viewport.name} value={viewport.name} className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {viewport.width} × {viewport.height}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  {viewport.name} Viewport
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden bg-background">
                <div 
                  className={`mx-auto transition-all duration-300 ${darkMode ? 'dark' : ''}`}
                  style={{ 
                    width: Math.min(viewport.width, 800),
                    height: Math.min(viewport.height, 600)
                  }}
                >
                  <div className={`
                    h-full transition-colors duration-300
                    ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}
                  `}>
                    <EnhancedLivePreview 
                      code={code} 
                      componentType={componentType}
                    />
                  </div>
                </div>
              </div>

              {showAccessibility && (
                <Card className="bg-muted/20">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Accessibility className="h-4 w-4" />
                      Accessibility Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-xs text-muted-foreground">Contrast Ratio</Label>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={accessibilityInfo.contrast === 'pass' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {accessibilityInfo.contrast === 'pass' ? 'PASS' : 'FAIL'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-muted-foreground">Keyboard Navigation</Label>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={accessibilityInfo.keyboardNavigation ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {accessibilityInfo.keyboardNavigation ? 'Supported' : 'N/A'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-muted-foreground">Focusable</Label>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={accessibilityInfo.focusable ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {accessibilityInfo.focusable ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-xs text-muted-foreground">Screen Reader</Label>
                        <p className="text-xs mt-1">{accessibilityInfo.screenReaderText}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
