
import React from 'react';
import { Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RecentlyViewedItem } from '@/hooks/useRecentlyViewed';
import { SearchResult } from './SearchData';
import { QuickActions } from './QuickActions';

interface RecentTabProps {
  recentItems: RecentlyViewedItem[];
  onSelect: (result: SearchResult) => void;
  onNavigate: (result: SearchResult) => void;
  onToggleFavorite: (result: SearchResult) => void;
  isFavorite: (href: string) => boolean;
  onClearRecent: () => void;
}

export function RecentTab({
  recentItems,
  onSelect,
  onNavigate,
  onToggleFavorite,
  isFavorite,
  onClearRecent
}: RecentTabProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Recently Viewed</span>
        </div>
        {recentItems.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearRecent}>
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
              onClick={() => onSelect(item)}
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
                onNavigate={onNavigate}
                onAddToFavorites={() => onToggleFavorite(item)}
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
    </>
  );
}
