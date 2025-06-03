
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { LivePreview } from './LivePreview';

interface ResponsivePreviewProps {
  code: string;
  componentType: string;
}

export const ResponsivePreview: React.FC<ResponsivePreviewProps> = ({
  code,
  componentType
}) => {
  const [activeDevice, setActiveDevice] = useState('desktop');

  const devices = {
    desktop: { width: '100%', height: '600px', icon: Monitor, label: 'Desktop' },
    tablet: { width: '768px', height: '600px', icon: Tablet, label: 'Tablet' },
    mobile: { width: '375px', height: '600px', icon: Smartphone, label: 'Mobile' }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Live Preview</span>
          <div className="flex space-x-2">
            {Object.entries(devices).map(([key, device]) => {
              const Icon = device.icon;
              return (
                <Button
                  key={key}
                  variant={activeDevice === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveDevice(key)}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {device.label}
                </Button>
              );
            })}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="border rounded-lg bg-background transition-all duration-300 mx-auto"
          style={{
            width: devices[activeDevice as keyof typeof devices].width,
            height: devices[activeDevice as keyof typeof devices].height,
            maxWidth: '100%'
          }}
        >
          <div className="h-full overflow-auto">
            <LivePreview 
              code={code} 
              componentType={componentType}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
