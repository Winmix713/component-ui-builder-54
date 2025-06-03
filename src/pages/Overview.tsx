
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BundleAnalyzer } from '@/components/performance/BundleAnalyzer';
import { ComponentCard } from '@/components/overview/ComponentCard';
import { SearchResultsSkeleton } from '@/components/ui/skeleton-loaders';
import { EnhancedSearch } from '@/components/search/EnhancedSearch';
import { usePerformanceMonitor } from '@/hooks/usePerformance';

const Overview: React.FC = () => {
  usePerformanceMonitor('Overview');

  const featuredComponents = [
    { name: 'Button', description: 'Interactive button component', href: '/components/button' },
    { name: 'Card', description: 'Flexible content container', href: '/components/card' },
    { name: 'Input', description: 'Form input element', href: '/components/input' },
    { name: 'Checkbox', description: 'Checkbox input control', href: '/components/checkbox' }
  ];

  return (
    <div className="space-y-6" role="main" aria-label="Component Library Overview">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Component Library</h1>
        <p className="text-muted-foreground mt-2">
          A comprehensive collection of accessible, customizable UI components built with React and Tailwind CSS.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="glass-card backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Components</span>
              <Badge variant="secondary">50+</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Ready-to-use components with full TypeScript support</p>
          </CardContent>
        </Card>

        <Card className="glass-card backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Accessibility</span>
              <Badge variant="secondary">WCAG 2.1 AA</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Built with accessibility best practices in mind</p>
          </CardContent>
        </Card>

        <Card className="glass-card backdrop-blur-md border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Theming</span>
              <Badge variant="secondary">Customizable</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Easy theming with CSS variables and Tailwind</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="components" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="components">Featured Components</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="components" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredComponents.map((component) => (
              <ComponentCard 
                key={component.name} 
                name={component.name}
                description={component.description}
                href={component.href}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="search">
          <Card className="glass-card backdrop-blur-md border-border/20">
            <CardHeader>
              <CardTitle>Component Search</CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedSearch />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance">
          <BundleAnalyzer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Overview;
