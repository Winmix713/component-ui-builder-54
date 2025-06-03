
import React, { useState, useEffect, useRef } from 'react';
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
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  usePageAnalytics();
  usePerformanceMonitor('Overview');

  useEffect(() => {
    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      if (!searchTerm) {
        setFilteredComponents(mockComponents);
      } else {
        const filtered = mockComponents.filter(component =>
          component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          component.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredComponents(filtered);
      }
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchTerm('');
    }
  };

  const stats = {
    totalComponents: mockComponents.length,
    categories: [...new Set(mockComponents.map(c => c.category))].length,
    variations: 24,
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
            onKeyDown={handleKeyDown}
            isSearching={isSearching}
            inputRef={searchInputRef}
          />
          
          <QuickActions 
            result={null}
            onNavigate={() => {}}
          />
        </div>

        <StatsCard stats={stats} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map((component) => (
            <ComponentCard 
              key={component.id} 
              name={component.name}
              description={component.description}
              href={`/components/${component.id}`}
            />
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
