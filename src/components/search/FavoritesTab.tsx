
import React from 'react';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FavoriteItem } from '@/hooks/useFavorites';
import { SearchResult } from './SearchData';
import { QuickActions } from './QuickActions';

interface FavoritesTabProps {
  favorites: FavoriteItem[];
  onSelect: (result: SearchResult) => void;
  onNavigate: (result: SearchResult) => void;
  onToggleFavorite: (result: SearchResult) => void;
}

export function FavoritesTab({
  favorites,
  onSelect,
  onNavigate,
  onToggleFavorite
}: FavoritesTabProps) {
  return (
    <>
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
              onClick={() => onSelect(item)}
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
                onNavigate={onNavigate}
                onAddToFavorites={() => onToggleFavorite(item)}
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
    </>
  );
}
