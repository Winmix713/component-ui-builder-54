
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Palette, Download, RotateCcw } from 'lucide-react';

interface ThemeCustomizerProps {
  onThemeChange?: (theme: Record<string, any>) => void;
}

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ onThemeChange }) => {
  const [colors, setColors] = useState<ThemeColors>({
    primary: '#000000',
    secondary: '#6b7280',
    accent: '#3b82f6',
    background: '#ffffff',
    foreground: '#000000',
  });
  
  const [spacing, setSpacing] = useState([4]);
  const [borderRadius, setBorderRadius] = useState([6]);
  const [darkMode, setDarkMode] = useState(false);

  const handleColorChange = (colorKey: keyof ThemeColors, value: string) => {
    const newColors = { ...colors, [colorKey]: value };
    setColors(newColors);
    
    if (onThemeChange) {
      onThemeChange({
        colors: newColors,
        spacing: spacing[0],
        borderRadius: borderRadius[0],
        darkMode
      });
    }
  };

  const handleReset = () => {
    const defaultColors = {
      primary: '#000000',
      secondary: '#6b7280',
      accent: '#3b82f6',
      background: '#ffffff',
      foreground: '#000000',
    };
    
    setColors(defaultColors);
    setSpacing([4]);
    setBorderRadius([6]);
    setDarkMode(false);
    
    if (onThemeChange) {
      onThemeChange({
        colors: defaultColors,
        spacing: 4,
        borderRadius: 6,
        darkMode: false
      });
    }
  };

  const generateCSS = () => {
    return `
:root {
  --color-primary: ${colors.primary};
  --color-secondary: ${colors.secondary};
  --color-accent: ${colors.accent};
  --color-background: ${colors.background};
  --color-foreground: ${colors.foreground};
  --spacing-unit: ${spacing[0]}px;
  --border-radius: ${borderRadius[0]}px;
}

${darkMode ? `
.dark {
  --color-background: #0a0a0a;
  --color-foreground: #fafafa;
}
` : ''}
    `.trim();
  };

  const handleExportCSS = () => {
    const css = generateCSS();
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom-theme.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            <CardTitle className="text-lg">Theme Customizer</CardTitle>
            <Badge variant="outline">Live Preview</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCSS}>
              <Download className="h-4 w-4 mr-1" />
              Export CSS
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="spacing">Spacing</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-4">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3">
                <Label className="w-20 capitalize">{key}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={value}
                    onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                    className="w-12 h-8 p-0 border-0 cursor-pointer"
                  />
                  <Input
                    value={value}
                    onChange={(e) => handleColorChange(key as keyof ThemeColors, e.target.value)}
                    className="flex-1 font-mono text-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="spacing" className="space-y-4">
            <div className="space-y-3">
              <Label>Base Spacing Unit: {spacing[0]}px</Label>
              <Slider
                value={spacing}
                onValueChange={setSpacing}
                max={20}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            
            <div className="space-y-3">
              <Label>Border Radius: {borderRadius[0]}px</Label>
              <Slider
                value={borderRadius}
                onValueChange={setBorderRadius}
                max={20}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Enable dark theme</p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
