
import React, { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Type, 
  Palette, 
  RotateCcw, 
  Download,
  Upload,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

interface EnhancedCodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
  height?: string;
  readOnly?: boolean;
  onFormat?: () => void;
  onReset?: () => void;
}

interface EditorSettings {
  theme: string;
  fontSize: number;
  wordWrap: boolean;
  minimap: boolean;
  lineNumbers: boolean;
  formatOnPaste: boolean;
  autoIndent: boolean;
}

const themes = [
  { name: 'Dark', value: 'vs-dark' },
  { name: 'Light', value: 'light' },
  { name: 'High Contrast', value: 'hc-black' },
];

const fontSizes = [12, 14, 16, 18, 20, 24];

export const EnhancedCodeEditor: React.FC<EnhancedCodeEditorProps> = ({
  value,
  onChange,
  language = 'typescript',
  height = '300px',
  readOnly = false,
  onFormat,
  onReset
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settings, setSettings] = useState<EditorSettings>({
    theme: 'vs-dark',
    fontSize: 14,
    wordWrap: true,
    minimap: false,
    lineNumbers: true,
    formatOnPaste: true,
    autoIndent: true
  });
  const [charCount, setCharCount] = useState(value.length);
  const [lineCount, setLineCount] = useState(value.split('\n').length);

  const handleEditorChange = useCallback((newValue: string | undefined) => {
    if (newValue !== undefined) {
      setCharCount(newValue.length);
      setLineCount(newValue.split('\n').length);
      onChange(newValue);
    }
  }, [onChange]);

  const handleSettingChange = (key: keyof EditorSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = () => {
    const blob = new Blob([value], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `component-${Date.now()}.tsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Code exported",
      description: "Component code has been downloaded",
    });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.tsx,.ts,.jsx,.js';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onChange(content);
          toast({
            title: "Code imported",
            description: `Imported ${file.name}`,
          });
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const editorHeight = isFullscreen ? '70vh' : height;

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-4 z-50 bg-background/95 backdrop-blur-sm' : ''}`}>
      <Tabs defaultValue="editor" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {lineCount} lines
            </Badge>
            <Badge variant="outline" className="text-xs">
              {charCount} chars
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="glass-card"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        <TabsContent value="editor" className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {language.toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleImport}
                className="glass-card"
              >
                <Upload className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="glass-card"
              >
                <Download className="h-4 w-4" />
              </Button>
              {onFormat && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onFormat}
                  className="glass-card"
                >
                  <Type className="h-4 w-4" />
                </Button>
              )}
              {onReset && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onReset}
                  className="glass-card"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="border border-border/20 rounded-lg overflow-hidden">
            <Editor
              height={editorHeight}
              defaultLanguage={language}
              value={value}
              onChange={handleEditorChange}
              theme={settings.theme}
              options={{
                minimap: { enabled: settings.minimap },
                fontSize: settings.fontSize,
                wordWrap: settings.wordWrap ? 'on' : 'off',
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                lineNumbers: settings.lineNumbers ? 'on' : 'off',
                formatOnPaste: settings.formatOnPaste,
                autoIndent: settings.autoIndent ? 'full' : 'none',
                bracketPairColorization: { enabled: true },
                guides: {
                  bracketPairs: true,
                  indentation: true
                },
                suggest: {
                  showKeywords: true,
                  showSnippets: true
                },
                readOnly: readOnly
              }}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Editor Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Theme</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => handleSettingChange('theme', value)}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme.value} value={theme.value}>
                          {theme.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm">Font Size</Label>
                  <Select
                    value={settings.fontSize.toString()}
                    onValueChange={(value) => handleSettingChange('fontSize', parseInt(value))}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontSizes.map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}px
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="wordWrap"
                    checked={settings.wordWrap}
                    onCheckedChange={(value) => handleSettingChange('wordWrap', value)}
                  />
                  <Label htmlFor="wordWrap" className="text-sm">Word Wrap</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="minimap"
                    checked={settings.minimap}
                    onCheckedChange={(value) => handleSettingChange('minimap', value)}
                  />
                  <Label htmlFor="minimap" className="text-sm">Minimap</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="lineNumbers"
                    checked={settings.lineNumbers}
                    onCheckedChange={(value) => handleSettingChange('lineNumbers', value)}
                  />
                  <Label htmlFor="lineNumbers" className="text-sm">Line Numbers</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="formatOnPaste"
                    checked={settings.formatOnPaste}
                    onCheckedChange={(value) => handleSettingChange('formatOnPaste', value)}
                  />
                  <Label htmlFor="formatOnPaste" className="text-sm">Format on Paste</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
