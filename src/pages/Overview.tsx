
import React, { useState, useEffect } from 'react';
import { ComponentCard } from '@/components/overview/ComponentCard';
import { StatsCard } from '@/components/overview/StatsCard';
import { SearchInput } from '@/components/search/SearchInput';
import { QuickActions } from '@/components/search/QuickActions';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { usePageAnalytics } from '@/hooks/usePageAnalytics';
import { usePerformanceMonitor } from '@/hooks/usePerformance';

interface Component {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: 'Simple' | 'Medium' | 'Complex';
  tags: string[];
  usage: number;
  lastUpdated: string;
}

const mockComponents: Component[] = [
  {
    id: 'button',
    name: 'Button',
    description: 'Interactive button component with multiple variants',
    category: 'Form Controls',
    complexity: 'Simple',
    tags: ['interactive', 'form', 'basic'],
    usage: 98,
    lastUpdated: '2024-01-15'
  },
  {
    id: 'card',
    name: 'Card',
    description: 'Flexible content container with header, body, and footer',
    category: 'Layout',
    complexity: 'Medium',
    tags: ['container', 'layout', 'content'],
    usage: 87,
    lastUpdated: '2024-01-12'
  },
  {
    id: 'dialog',
    name: 'Dialog',
    description: 'Modal dialog for user interactions and confirmations',
    category: 'Overlays',
    complexity: 'Complex',
    tags: ['modal', 'overlay', 'interaction'],
    usage: 76,
    lastUpdated: '2024-01-10'
  }
];

const Overview: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredComponents, setFilteredComponents] = useState(mockComponents);
  
  usePageAnalytics('Overview');
  usePerformanceMonitor('Overview');

  useEffect(() => {
    if (!searchTerm) {
      setFilteredComponents(mockComponents);
      return;
    }

    const filtered = mockComponents.filter(component =>
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredComponents(filtered);
  }, [searchTerm]);

  const stats = {
    totalComponents: mockComponents.length,
    categories: [...new Set(mockComponents.map(c => c.category))].length,
    averageUsage: Math.round(mockComponents.reduce((acc, c) => acc + c.usage, 0) / mockComponents.length),
    lastUpdated: mockComponents.reduce((latest, c) => 
      new Date(c.lastUpdated) > new Date(latest) ? c.lastUpdated : latest, 
      mockComponents[0].lastUpdated
    )
  };

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Component Library</h1>
            <p className="text-muted-foreground mt-2">
              Explore and test our collection of reusable UI components
            </p>
          </div>
          
          <SearchInput 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search components..."
          />
          
          <QuickActions />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Components"
            value={stats.totalComponents}
            description="Available in library"
            trend="stable"
          />
          <StatsCard
            title="Categories"
            value={stats.categories}
            description="Component groups"
            trend="stable"
          />
          <StatsCard
            title="Avg Usage"
            value={`${stats.averageUsage}%`}
            description="Adoption rate"
            trend="up"
          />
          <StatsCard
            title="Last Updated"
            value={new Date(stats.lastUpdated).toLocaleDateString()}
            description="Most recent change"
            trend="stable"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map((component) => (
            <ComponentCard key={component.id} component={component} />
          ))}
        </div>

        {filteredComponents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No components found matching "{searchTerm}"
            </p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 text-primary hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Overview;
