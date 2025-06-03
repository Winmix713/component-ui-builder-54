
import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useFavorites } from '@/hooks/useFavorites';
import { useSearchLogic } from '@/hooks/useSearchLogic';
import { SearchTrigger } from './SearchTrigger';
import { SearchInput } from './SearchInput';
import { SearchFilters } from './SearchFilters';
import { SearchResults } from './SearchResults';
import { RecentTab } from './RecentTab';
import { FavoritesTab } from './FavoritesTab';
import { HistoryTab } from './HistoryTab';
import { SearchResult } from './SearchData';

interface EnhancedSearchProps {
  placeholder?: string;
  className?: string;
}

export function EnhancedSearch({ placeholder = "Search components...", className }: EnhancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { history, addToHistory, clearHistory, removeFromHistory } = useSearchHistory();
  const { recentItems, clearRecent } = useRecentlyViewed();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  
  const {
    query,
    setQuery,
    results,
    selectedIndex,
    setSelectedIndex,
    isSearching,
    filters,
    handleFilterToggle,
    handleClearFilters
  } = useSearchLogic();

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
      <SearchTrigger
        placeholder={placeholder}
        className={className}
        onClick={() => setIsOpen(true)}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="sr-only">Search Components</DialogTitle>
            <DialogDescription className="sr-only">
              Search through components and documentation
            </DialogDescription>
          </DialogHeader>
          
          <SearchInput
            value={query}
            onChange={setQuery}
            onKeyDown={handleKeyDown}
            isSearching={isSearching}
            inputRef={inputRef}
          />

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
              
              <SearchResults
                results={results}
                selectedIndex={selectedIndex}
                isSearching={isSearching}
                query={query}
                onSelect={handleSelect}
                onNavigate={handleQuickNavigation}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
              />
            </TabsContent>
            
            <TabsContent value="recent" className="mt-4">
              <RecentTab
                recentItems={recentItems}
                onSelect={handleSelect}
                onNavigate={handleQuickNavigation}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
                onClearRecent={clearRecent}
              />
            </TabsContent>
            
            <TabsContent value="favorites" className="mt-4">
              <FavoritesTab
                favorites={favorites}
                onSelect={handleSelect}
                onNavigate={handleQuickNavigation}
                onToggleFavorite={toggleFavorite}
              />
            </TabsContent>
            
            <TabsContent value="history" className="mt-4">
              <HistoryTab
                history={history}
                onSelectQuery={setQuery}
                onRemoveFromHistory={removeFromHistory}
                onClearHistory={clearHistory}
              />
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
