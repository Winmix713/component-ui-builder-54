
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smartphone, Tablet, Monitor, RotateCw } from 'lucide-react';
import { LivePreview } from './LivePreview';

interface ResponsivePreviewProps {
  code: string;
  componentType: string;
}

interface Device {
  name: string;
  width: number;
  height: number;
  icon: React.ComponentType<{ className?: string }>;
}

const devices: Device[] = [
  { name: 'Mobile', width: 375, height: 667, icon: Smartphone },
  { name: 'Tablet', width: 768, height: 1024, icon: Tablet },
  { name: 'Desktop', width: 1200, height: 800, icon: Monitor },
];

export const ResponsivePreview: React.FC<ResponsivePreviewProps> = ({
  code,
  componentType
}) => {
  const [selectedDevice, setSelectedDevice] = useState<Device>(devices[0]);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  const getDeviceDimensions = () => {
    const { width, height } = selectedDevice;
    return orientation === 'portrait' 
      ? { width, height }
      : { width: height, height: width };
  };

  const dimensions = getDeviceDimensions();

  return (
    <Card className="glass-card backdrop-blur-md border-border/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <selectedDevice.icon className="h-5 w-5" />
            Responsive Preview
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {dimensions.width} × {dimensions.height}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')}
              className="glass-card"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={selectedDevice.name} onValueChange={(name) => {
          const device = devices.find(d => d.name === name);
          if (device) setSelectedDevice(device);
        }}>
          <TabsList className="grid w-full grid-cols-3">
            {devices.map((device) => (
              <TabsTrigger key={device.name} value={device.name} className="flex items-center gap-2">
                <device.icon className="h-4 w-4" />
                {device.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {devices.map((device) => (
            <TabsContent key={device.name} value={device.name} className="mt-4">
              <div className="flex justify-center">
                <div 
                  className="border border-border/20 rounded-lg overflow-hidden shadow-lg bg-background"
                  style={{
                    width: dimensions.width,
                    height: dimensions.height,
                    maxWidth: '100%',
                    maxHeight: '70vh'
                  }}
                >
                  <div className="h-full overflow-auto">
                    <LivePreview
                      code={code}
                      componentType={componentType}
                      onRenderError={(error) => console.error('Responsive preview error:', error)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Preview showing how your component looks on {device.name.toLowerCase()} devices
                </p>
                <div className="flex justify-center gap-4 mt-2">
                  <span className="text-xs text-muted-foreground">
                    Width: {dimensions.width}px
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Height: {dimensions.height}px
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Orientation: {orientation}
                  </span>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
