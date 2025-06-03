
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Code, Zap } from 'lucide-react';

interface StatsCardProps {
  stats: {
    totalComponents: number;
    categories: number;
    variations: number;
    lastUpdated: string;
  };
}

export const StatsCard: React.FC<StatsCardProps> = React.memo(({ stats }) => {
  const statItems = [
    {
      title: 'Total Components',
      value: stats.totalComponents,
      icon: Code,
      description: 'Production-ready components'
    },
    {
      title: 'Categories',
      value: stats.categories,
      icon: Users,
      description: 'Organized component groups'
    },
    {
      title: 'Variations',
      value: stats.variations,
      icon: TrendingUp,
      description: 'Different component styles'
    },
    {
      title: 'Performance',
      value: '99%',
      icon: Zap,
      description: 'Lighthouse score average'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item) => (
        <Card key={item.title} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground">{item.description}</p>
            <Badge variant="secondary" className="mt-2">
              Updated {stats.lastUpdated}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});

StatsCard.displayName = 'StatsCard';
