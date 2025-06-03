
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, ExternalLink } from 'lucide-react';

export const BundleAnalyzer: React.FC = () => {
  const handleViewReport = () => {
    window.open('/stats.html', '_blank');
  };

  const handleAnalyze = async () => {
    // Trigger bundle analysis
    console.log('Starting bundle analysis...');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>Bundle Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-primary">~250KB</div>
            <div className="text-sm text-muted-foreground">Initial Bundle</div>
            <Badge variant="secondary">Optimized</Badge>
          </div>
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-green-500">~85KB</div>
            <div className="text-sm text-muted-foreground">Gzipped</div>
            <Badge variant="secondary">Good</Badge>
          </div>
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-blue-500">5</div>
            <div className="text-sm text-muted-foreground">Chunks</div>
            <Badge variant="secondary">Split</Badge>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button onClick={handleAnalyze} className="flex-1">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analyze Bundle
          </Button>
          <Button variant="outline" onClick={handleViewReport}>
            <ExternalLink className="h-4 w-4 mr-2" />
            View Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
