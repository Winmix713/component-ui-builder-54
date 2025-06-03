
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Zap, Clock, Star } from 'lucide-react';

interface InteractiveStatsWidgetProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<any>;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  progress?: number;
}

export const InteractiveStatsWidget: React.FC<InteractiveStatsWidgetProps> = ({
  title,
  value,
  change,
  icon: Icon,
  description,
  actionLabel,
  onAction,
  progress
}) => {
  const isPositive = change >= 0;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-2xl font-bold">{value}</div>
        
        <div className="flex items-center space-x-2">
          <Badge variant={isPositive ? "default" : "destructive"} className="text-xs">
            {isPositive ? '+' : ''}{change}%
          </Badge>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>

        {progress !== undefined && (
          <div className="space-y-1">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">{progress}% completion</p>
          </div>
        )}

        {actionLabel && onAction && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onAction}
            className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
