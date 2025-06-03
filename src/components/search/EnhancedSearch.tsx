
import React, { useState, useCallback, useMemo } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Clock, Heart, Filter, Star } from 'lucide-react';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useFavorites } from '@/hooks/useFavorites';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { SearchFilters } from './SearchFilters';
import { SearchResults } from './SearchResults';
import { RecentTab } from './RecentTab';
import { FavoritesTab } from './FavoritesTab';
import { HistoryTab } from './HistoryTab';

interface EnhancedSearchProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  className?: string;
}

export const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  open,
  onOpenChange,
  placeholder = "Search components...",
  className = ""
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('search');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    tags: [] as string[]
  });

  const { addSearchTerm, searchHistory } = useSearchHistory();
  const { favorites, toggleFavorite } = useFavorites();
  const { recentItems } = useRecentlyViewed();

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      addSearchTerm(query);
    }
  }, [addSearchTerm]);

  const filteredResults = useMemo(() => {
    // Mock search results - in a real app, this would come from an API
    const allComponents = [
      { id: 'button', name: 'Button', category: 'Form', difficulty: 'Easy', tags: ['interactive', 'form'] },
      { id: 'input', name: 'Input', category: 'Form', difficulty: 'Easy', tags: ['form', 'text'] },
      { id: 'card', name: 'Card', category: 'Layout', difficulty: 'Easy', tags: ['container', 'layout'] },
      { id: 'dialog', name: 'Dialog', category: 'Overlay', difficulty: 'Medium', tags: ['modal', 'overlay'] },
      { id: 'table', name: 'Table', category: 'Data', difficulty: 'Hard', tags: ['data', 'grid'] },
      { id: 'calendar', name: 'Calendar', category: 'Form', difficulty: 'Hard', tags: ['date', 'picker'] }
    ];

    return allComponents.filter(component => {
      const matchesQuery = !searchQuery || 
        component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        component.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = !filters.category || component.category === filters.category;
      const matchesDifficulty = !filters.difficulty || component.difficulty === filters.difficulty;
      const matchesTags = filters.tags.length === 0 || 
        filters.tags.some(tag => component.tags.includes(tag));

      return matchesQuery && matchesCategory && matchesDifficulty && matchesTags;
    });
  }, [searchQuery, filters]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className={`w-full justify-start text-muted-foreground ${className}`}>
          <Search className="mr-2 h-4 w-4" />
          {placeholder}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0">
        <Command className="rounded-lg border shadow-md">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder={placeholder}
              value={searchQuery}
              onValueChange={handleSearch}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="ml-2"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {showFilters && (
            <div className="border-b p-4">
              <SearchFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
              <TabsTrigger value="search" className="rounded-none">
                <Search className="mr-2 h-4 w-4" />
                Search
              </TabsTrigger>
              <TabsTrigger value="recent" className="rounded-none">
                <Clock className="mr-2 h-4 w-4" />
                Recent
              </TabsTrigger>
              <TabsTrigger value="favorites" className="rounded-none">
                <Heart className="mr-2 h-4 w-4" />
                Favorites
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-none">
                <Star className="mr-2 h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="mt-0">
              <CommandList className="max-h-[300px] overflow-y-auto">
                {filteredResults.length === 0 ? (
                  <CommandEmpty>No components found.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    <SearchResults 
                      results={filteredResults}
                      onSelect={(component) => {
                        window.location.href = `/components/${component.id}`;
                        onOpenChange?.(false);
                      }}
                      favorites={favorites.map(f => f.href)}
                      onToggleFavorite={(componentId) => {
                        const component = filteredResults.find(c => c.id === componentId);
                        if (component) {
                          toggleFavorite({
                            title: component.name,
                            href: `/components/${component.id}`,
                            category: component.category
                          });
                        }
                      }}
                    />
                  </CommandGroup>
                )}
              </CommandList>
            </TabsContent>

            <TabsContent value="recent" className="mt-0">
              <RecentTab 
                recentlyViewed={recentItems.map(item => ({
                  id: item.href.split('/').pop() || '',
                  name: item.title,
                  visitedAt: item.visitedAt
                }))}
                onSelect={(component) => {
                  window.location.href = `/components/${component.id}`;
                  onOpenChange?.(false);
                }}
              />
            </TabsContent>

            <TabsContent value="favorites" className="mt-0">
              <FavoritesTab 
                favorites={favorites.map(f => f.href)}
                onSelect={(componentHref) => {
                  window.location.href = componentHref;
                  onOpenChange?.(false);
                }}
                onRemove={(componentHref) => {
                  const favorite = favorites.find(f => f.href === componentHref);
                  if (favorite) {
                    toggleFavorite(favorite);
                  }
                }}
              />
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <HistoryTab 
                searchHistory={searchHistory}
                onSelect={(query) => {
                  setSearchQuery(query);
                  setActiveTab('search');
                }}
              />
            </TabsContent>
          </Tabs>
        </Command>
      </DialogContent>
    </Dialog>
  );
};
