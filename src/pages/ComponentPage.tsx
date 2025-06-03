
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ComponentPage: React.FC = () => {
  const { component } = useParams<{ component: string }>();
  
  const componentName = component
    ? component.charAt(0).toUpperCase() + component.slice(1).replace(/-/g, ' ')
    : 'Component';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{componentName}</h1>
        <p className="text-muted-foreground mt-2">
          A flexible and accessible {componentName.toLowerCase()} component.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Example</CardTitle>
          <CardDescription>
            Basic usage of the {componentName.toLowerCase()} component.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 border rounded-md bg-muted/50 flex items-center justify-center">
            <p className="text-muted-foreground">
              {componentName} component preview would appear here
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Installation</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md">
            <code>npm install @ui/components</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};
