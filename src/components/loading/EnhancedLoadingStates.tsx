
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Loader2, Code, Settings, Eye } from 'lucide-react';

interface LoadingStateProps {
  variant: 'skeleton' | 'spinner' | 'progress';
  message?: string;
  progress?: number;
  icon?: React.ReactNode;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  variant, 
  message = 'Loading...', 
  progress = 0,
  icon 
}) => {
  switch (variant) {
    case 'skeleton':
      return (
        <Card className="w-full">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
      );

    case 'progress':
      return (
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {icon || <Loader2 className="h-4 w-4 animate-spin" />}
                <span className="text-sm text-muted-foreground">{message}</span>
              </div>
              <Progress value={progress} className="w-full" />
              <div className="text-xs text-center text-muted-foreground">
                {progress}% complete
              </div>
            </div>
          </CardContent>
        </Card>
      );

    case 'spinner':
    default:
      return (
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm text-muted-foreground">{message}</span>
          </div>
        </div>
      );
  }
};

export const CodeEditorLoadingSkeleton: React.FC = () => (
  <div className="border border-border/20 rounded-lg overflow-hidden">
    <div className="bg-muted/20 p-2 border-b border-border/20 flex items-center space-x-2">
      <Code className="h-4 w-4" />
      <Skeleton className="h-4 w-20" />
    </div>
    <div className="p-4 space-y-2">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex space-x-2">
          <Skeleton className="h-4 w-6" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  </div>
);

export const PreviewLoadingSkeleton: React.FC = () => (
  <div className="border rounded-md p-8 bg-muted/20 min-h-[200px] flex items-center justify-center">
    <div className="text-center space-y-4">
      <Eye className="h-8 w-8 mx-auto text-muted-foreground animate-pulse" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32 mx-auto" />
        <Skeleton className="h-4 w-24 mx-auto" />
      </div>
    </div>
  </div>
);

export const PropsConfiguratorLoadingSkeleton: React.FC = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center space-x-2">
        <Settings className="h-5 w-5" />
        <Skeleton className="h-6 w-40" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </CardContent>
  </Card>
);
