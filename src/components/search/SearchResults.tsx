
import React from 'react';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SearchResultsSkeleton } from '@/components/ui/skeleton-loaders';
import { SearchResult } from './SearchData';
import { QuickActions } from './QuickActions';

interface SearchResultsProps {
  results: SearchResult[];
  selectedIndex: number;
  isSearching: boolean;
  query: string;
  onSelect: (result: SearchResult) => void;
  onNavigate: (result: SearchResult) => void;
  onToggleFavorite: (result: SearchResult) => void;
  isFavorite: (href: string) => boolean;
}

export function SearchResults({
  results,
  selectedIndex,
  isSearching,
  query,
  onSelect,
  onNavigate,
  onToggleFavorite,
  isFavorite
}: SearchResultsProps) {
  if (isSearching) {
    return <SearchResultsSkeleton />;
  }

  if (results.length > 0) {
    return (
      <div className="max-h-80 overflow-y-auto">
        {results.map((result, index) => (
          <div
            key={result.href}
            className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
              index === selectedIndex 
                ? 'bg-accent text-accent-foreground' 
                : 'hover:bg-muted/50'
            }`}
            onClick={() => onSelect(result)}
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
              onNavigate={onNavigate}
              onAddToFavorites={() => onToggleFavorite(result)}
              isFavorite={isFavorite(result.href)}
            />
          </div>
        ))}
      </div>
    );
  }

  if (query && !isSearching) {
    return (
      <div className="py-6 text-center text-sm text-muted-foreground">
        No results found for "{query}"
      </div>
    );
  }

  return null;
}
