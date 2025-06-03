
import React, { Suspense, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BundleAnalyzer } from '@/components/performance/BundleAnalyzer';
import { ComponentCard } from '@/components/overview/ComponentCard';
import { SearchResultsSkeleton } from '@/components/ui/skeleton-loaders';
import { EnhancedSearch } from '@/components/search/EnhancedSearch';
import { usePerformanceMonitor } from '@/hooks/usePerformance';

const LazyStatsCard = React.lazy(() => import('@/components/overview/StatsCard').then(module => ({ default: module.StatsCard })));

export const Overview: React.FC = React.memo(() => {
  usePerformanceMonitor('Overview');

  const featuredComponents = useMemo(() => [
    { name: 'Button', description: 'Interactive button component', href: '/components/button' },
    { name: 'Card', description: 'Flexible content container', href: '/components/card' },
    { name: 'Input', description: 'Form input element', href: '/components/input' },
    { name: 'Checkbox', description: 'Checkbox input control', href: '/components/checkbox' }
  ], []);

  const quickStats = useMemo(() => ({
    totalComponents: 45,
    categories: 8,
    variations: 120,
    lastUpdated: new Date().toLocaleDateString()
  }), []);

  return (
    <div className="space-y-6" role="main" aria-label="Component Library Overview">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Component Library</h1>
        <p className="text-muted-foreground mt-2">
          A comprehensive collection of accessible, customizable UI components built with React and Tailwind CSS.
        </p>
      </header>

      <Tabs defaultValue="components" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="components" className="space-y-6">
          <section aria-label="Featured components">
            <h2 className="text-2xl font-semibold mb-4">Featured Components</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredComponents.map((component) => (
                <ComponentCard key={component.name} {...component} />
              ))}
            </div>
          </section>

          <section aria-label="Quick statistics">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold">{quickStats.totalComponents}</div>
                  <p className="text-sm text-muted-foreground">Components</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold">{quickStats.categories}</div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold">{quickStats.variations}</div>
                  <p className="text-sm text-muted-foreground">Variations</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold">100%</div>
                  <p className="text-sm text-muted-foreground">Accessible</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <EnhancedSearch />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <BundleAnalyzer />
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <Suspense fallback={<SearchResultsSkeleton />}>
            <LazyStatsCard stats={quickStats} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
});

Overview.displayName = 'Overview';
