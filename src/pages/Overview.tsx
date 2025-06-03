
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package, Zap, Shield } from 'lucide-react';

export const Overview: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">UI Components</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A comprehensive collection of reusable React components built with modern design principles.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg">
            View Components
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <Package className="h-8 w-8 text-primary mb-2" />
            <CardTitle>50+ Components</CardTitle>
            <CardDescription>
              A comprehensive set of components for building modern applications
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Zap className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Fast & Lightweight</CardTitle>
            <CardDescription>
              Optimized for performance with minimal bundle size
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Accessible</CardTitle>
            <CardDescription>
              Built with accessibility in mind, following WCAG guidelines
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Example</CardTitle>
          <CardDescription>
            Here's how easy it is to use our components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code>{`import { Button, Card } from '@ui/components'

function App() {
  return (
    <Card>
      <Button variant="primary">
        Click me
      </Button>
    </Card>
  )
}`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};
