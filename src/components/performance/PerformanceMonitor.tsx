
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Clock, Eye, Cpu } from 'lucide-react';

interface PerformanceMetrics {
  renderTime: number;
  bundleSize: number;
  memoryUsage: number;
  renderCount: number;
  lastUpdate: number;
}

interface PerformanceMonitorProps {
  componentName: string;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  componentName, 
  onMetricsUpdate 
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    bundleSize: 0,
    memoryUsage: 0,
    renderCount: 0,
    lastUpdate: Date.now()
  });

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name.includes(componentName)) {
          setMetrics(prev => {
            const newMetrics = {
              ...prev,
              renderTime: entry.duration,
              renderCount: prev.renderCount + 1,
              lastUpdate: Date.now()
            };
            
            onMetricsUpdate?.(newMetrics);
            return newMetrics;
          });
        }
      });
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });

    // Memory usage monitoring
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024 // Convert to MB
        }));
      }
    };

    const memoryInterval = setInterval(updateMemoryUsage, 5000);

    return () => {
      observer.disconnect();
      clearInterval(memoryInterval);
    };
  }, [componentName, onMetricsUpdate]);

  const getPerformanceColor = (value: number, thresholds: [number, number]) => {
    if (value < thresholds[0]) return 'text-green-600';
    if (value < thresholds[1]) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Render Time
              </span>
              <Badge 
                variant="outline" 
                className={`text-xs ${getPerformanceColor(metrics.renderTime, [16, 50])}`}
              >
                {metrics.renderTime.toFixed(2)}ms
              </Badge>
            </div>
            <Progress 
              value={Math.min((metrics.renderTime / 100) * 100, 100)} 
              className="h-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Cpu className="h-3 w-3" />
                Memory
              </span>
              <Badge 
                variant="outline" 
                className={`text-xs ${getPerformanceColor(metrics.memoryUsage, [50, 100])}`}
              >
                {metrics.memoryUsage.toFixed(1)}MB
              </Badge>
            </div>
            <Progress 
              value={Math.min((metrics.memoryUsage / 200) * 100, 100)} 
              className="h-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Renders
              </span>
              <Badge variant="outline" className="text-xs">
                {metrics.renderCount}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Last Update
              </span>
              <Badge variant="outline" className="text-xs">
                {new Date(metrics.lastUpdate).toLocaleTimeString()}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
