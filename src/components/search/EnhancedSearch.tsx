import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, Loader2, History, Filter, Heart, Clock, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SearchResultsSkeleton } from '@/components/ui/skeleton-loaders';
import { useNavigate } from 'react-router-dom';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useFavorites } from '@/hooks/useFavorites';
import { SearchFilters, SearchFilter } from './SearchFilters';
import { QuickActions } from './QuickActions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SearchResult {
  title: string;
  href: string;
  category: string;
  description?: string;
}

const searchData: SearchResult[] = [
  // Components
  { title: "Accordion", href: "/components/accordion", category: "Layout", description: "Collapsible content sections" },
  { title: "Alert", href: "/components/alert", category: "Layout", description: "Important notifications" },
  { title: "Avatar", href: "/components/avatar", category: "Layout", description: "User profile images" },
  { title: "Badge", href: "/components/badge", category: "Layout", description: "Status indicators" },
  { title: "Button", href: "/components/button", category: "Layout", description: "Interactive buttons" },
  { title: "Card", href: "/components/card", category: "Layout", description: "Content containers" },
  { title: "Checkbox", href: "/components/checkbox", category: "Forms", description: "Boolean input controls" },
  { title: "Input", href: "/components/input", category: "Forms", description: "Text input fields" },
  { title: "Select", href: "/components/select", category: "Forms", description: "Dropdown selections" },
  { title: "Breadcrumb", href: "/components/breadcrumb", category: "Navigation", description: "Navigation trail" },
  { title: "Tabs", href: "/components/tabs", category: "Navigation", description: "Tabbed content" },
  // Docs
  { title: "Installation", href: "/installation", category: "Docs", description: "Getting started guide" },
  { title: "Theming", href: "/theming", category: "Docs", description: "Customize appearance" },
  { title: "Typography", href: "/typography", category: "Docs", description: "Text styling guide" },
];

const categories = ['All', 'Layout', 'Forms', 'Navigation', 'Data Display', 'Feedback', 'Docs'];

interface EnhancedSearchProps {
  placeholder?: string;
  className?: string;
}

export function EnhancedSearch({ placeholder = "Search components...", className }: EnhancedSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  
  const [filters, setFilters] = useState<SearchFilter[]>(
    categories.slice(1).map(cat => ({ key: cat, label: cat, active: false }))
  );

  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { history, addToHistory, clearHistory, removeFromHistory } = useSearchHistory();
  const { recentItems, clearRecent } = useRecentlyViewed();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Fuzzy search implementation
  const fuzzySearch = (searchQuery: string, items: SearchResult[]): SearchResult[] => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const activeCategories = filters.filter(f => f.active).map(f => f.key);
    
    let filteredItems = items;
    if (activeCategories.length > 0) {
      filteredItems = items.filter(item => activeCategories.includes(item.category));
    }
    
    return filteredItems
      .filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      )
      .sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        
        if (aTitle === query) return -1;
        if (bTitle === query) return 1;
        
        if (aTitle.startsWith(query) && !bTitle.startsWith(query)) return -1;
        if (bTitle.startsWith(query) && !aTitle.startsWith(query)) return 1;
        
        return aTitle.localeCompare(bTitle);
      });
  };

  useEffect(() => {
    if (query) {
      setIsSearching(true);
      // Simulate search delay for better UX
      const timer = setTimeout(() => {
        const searchResults = fuzzySearch(query, searchData);
        setResults(searchResults);
        setSelectedIndex(0);
        setIsSearching(false);
      }, 150);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [query, filters]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === '/') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (result: SearchResult) => {
    navigate(result.href);
    addToHistory(query, result.category);
    setIsOpen(false);
    setQuery('');
  };

  const handleQuickNavigation = (result: SearchResult) => {
    window.open(result.href, '_blank');
  };

  const handleFilterToggle = (key: string) => {
    setFilters(prev => prev.map(filter => 
      filter.key === key ? { ...filter, active: !filter.active } : filter
    ));
  };

  const handleClearFilters = () => {
    setFilters(prev => prev.map(filter => ({ ...filter, active: false })));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className={`justify-start text-sm text-muted-foreground w-full max-w-sm ${className}`}
        onClick={() => setIsOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        {placeholder}
        <div className="ml-auto flex items-center space-x-1">
          <Badge variant="outline" className="text-xs">
            <Command className="h-3 w-3 mr-1" />
            K
          </Badge>
        </div>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="sr-only">Search Components</DialogTitle>
            <DialogDescription className="sr-only">
              Search through components and documentation
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center border-b pb-3">
            {isSearching ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin opacity-50" />
            ) : (
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            )}
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search components and docs..."
              className="border-0 p-0 text-sm focus-visible:ring-0 shadow-none"
              autoFocus
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="mt-4">
              <SearchFilters 
                filters={filters}
                onFilterToggle={handleFilterToggle}
                onClearAll={handleClearFilters}
              />
              
              {isSearching ? (
                <SearchResultsSkeleton />
              ) : results.length > 0 ? (
                <div className="max-h-80 overflow-y-auto">
                  {results.map((result, index) => (
                    <div
                      key={result.href}
                      className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        index === selectedIndex 
                          ? 'bg-accent text-accent-foreground' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleSelect(result)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{result.title}</span>
                          <Badge variant="secondary" className="text-xs">
                            {result.category}
                          </Badge>
                          {isFavorite(result.href) && (
                            <Heart className="h-3 w-3 fill-current text-red-500" />
                          )}
                        </div>
                        {result.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {result.description}
                          </p>
                        )}
                      </div>
                      <QuickActions
                        result={result}
                        onNavigate={handleQuickNavigation}
                        onAddToFavorites={() => toggleFavorite(result)}
                        isFavorite={isFavorite(result.href)}
                      />
                    </div>
                  ))}
                </div>
              ) : query && !isSearching ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No results found for "{query}"
                </div>
              ) : null}
            </TabsContent>
            
            <TabsContent value="recent" className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Recently Viewed</span>
                </div>
                {recentItems.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearRecent}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {recentItems.length > 0 ? (
                <div className="max-h-80 overflow-y-auto space-y-1">
                  {recentItems.map((item) => (
                    <div
                      key={item.href}
                      className="group flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSelect(item)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{item.title}</span>
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                      <QuickActions
                        result={item}
                        onNavigate={handleQuickNavigation}
                        onAddToFavorites={() => toggleFavorite(item)}
                        isFavorite={isFavorite(item.href)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No recently viewed components
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="favorites" className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Favorites</span>
                </div>
              </div>
              {favorites.length > 0 ? (
                <div className="max-h-80 overflow-y-auto space-y-1">
                  {favorites.map((item) => (
                    <div
                      key={item.href}
                      className="group flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleSelect(item)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{item.title}</span>
                          <Badge variant="secondary" className="text-xs">
                            {item.category}
                          </Badge>
                          <Heart className="h-3 w-3 fill-current text-red-500" />
                        </div>
                      </div>
                      <QuickActions
                        result={item}
                        onNavigate={handleQuickNavigation}
                        onAddToFavorites={() => toggleFavorite(item)}
                        isFavorite={true}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No favorite components yet
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <History className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Search History</span>
                </div>
                {history.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearHistory}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {history.length > 0 ? (
                <div className="max-h-80 overflow-y-auto space-y-1">
                  {history.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setQuery(item.query)}
                    >
                      <div className="flex items-center space-x-2">
                        <History className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{item.query}</span>
                        {item.category && (
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromHistory(item.query);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No search history yet
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
            <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
            <span>Press / or Cmd+K to search</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
