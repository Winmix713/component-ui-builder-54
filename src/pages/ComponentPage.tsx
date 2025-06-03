
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BreadcrumbNavigation } from '@/components/navigation/BreadcrumbNavigation';
import { ComponentPlayground } from '@/components/playground/ComponentPlayground';
import { ComponentPageSkeleton } from '@/components/ui/skeleton-loaders';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

const ComponentPage: React.FC = () => {
  const { component } = useParams<{ component: string }>();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [component]);

  if (!component) {
    return <div>Component not found</div>;
  }

  if (isLoading) {
    return <ComponentPageSkeleton />;
  }

  const componentTitle = component.charAt(0).toUpperCase() + component.slice(1);
  
  const getInitialCode = (componentType: string): string => {
    switch (componentType) {
      case 'button':
        return `export function ComponentDemo() {
  return (
    <Button>Click me</Button>
  )
}`;
      case 'card':
        return `export function ComponentDemo() {
  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
    </Card>
  )
}`;
      case 'input':
        return `export function ComponentDemo() {
  return (
    <Input placeholder="Type something..." />
  )
}`;
      default:
        return `export function ComponentDemo() {
  return (
    <div className="p-4 border rounded">
      ${componentTitle} component demo
    </div>
  )
}`;
    }
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <BreadcrumbNavigation />
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{componentTitle}</h1>
          <p className="text-muted-foreground mt-2">
            Interactive playground for the {componentTitle} component
          </p>
        </div>
        
        <ComponentPlayground
          componentType={component}
          initialCode={getInitialCode(component)}
          title={componentTitle}
        />
      </div>
    </ErrorBoundary>
  );
};

export default ComponentPage;
