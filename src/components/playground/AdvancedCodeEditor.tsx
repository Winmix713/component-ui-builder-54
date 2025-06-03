
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download, Share2, Code2, FileText } from 'lucide-react';
import { EnhancedCodeEditor } from './EnhancedCodeEditor';
import { useToast } from '@/hooks/use-toast';

interface AdvancedCodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  componentType: string;
  onExport?: (format: 'jsx' | 'tsx' | 'vue' | 'angular') => void;
}

export const AdvancedCodeEditor: React.FC<AdvancedCodeEditorProps> = ({
  code,
  onChange,
  componentType,
  onExport
}) => {
  const [activeFormat, setActiveFormat] = useState<'jsx' | 'tsx'>('tsx');
  const { toast } = useToast();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Code copied",
        description: "Code has been copied to clipboard",
      });
    } catch (error) {
      console.error('Failed to copy code:', error);
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard",
        variant: "destructive",
      });
    }
  }, [code, toast]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${componentType}-component.${activeFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: `Component code downloaded as ${componentType}-component.${activeFormat}`,
    });
  }, [code, componentType, activeFormat, toast]);

  const handleShare = useCallback(() => {
    const shareData = {
      title: `${componentType} Component`,
      text: `Check out this ${componentType} component`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Component link has been copied to clipboard",
      });
    }
  }, [componentType, toast]);

  const convertToJSX = (tsxCode: string): string => {
    // Simple conversion - remove type annotations
    return tsxCode
      .replace(/: React\.FC<.*?>/g, '')
      .replace(/: string/g, '')
      .replace(/: number/g, '')
      .replace(/: boolean/g, '')
      .replace(/interface.*?{[^}]*}/gs, '');
  };

  const getFormattedCode = () => {
    return activeFormat === 'jsx' ? convertToJSX(code) : code;
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            <CardTitle className="text-lg">Advanced Code Editor</CardTitle>
            <Badge variant="outline">{componentType}</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeFormat} onValueChange={(value) => setActiveFormat(value as 'jsx' | 'tsx')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="tsx" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              TypeScript
            </TabsTrigger>
            <TabsTrigger value="jsx" className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              JavaScript
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tsx">
            <EnhancedCodeEditor
              value={code}
              onChange={onChange}
              height="400px"
              language="typescript"
            />
          </TabsContent>

          <TabsContent value="jsx">
            <EnhancedCodeEditor
              value={getFormattedCode()}
              onChange={onChange}
              height="400px"
              language="javascript"
              readOnly
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
