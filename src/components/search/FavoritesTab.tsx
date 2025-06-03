
import React from 'react';
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Heart, X } from 'lucide-react';

interface FavoritesTabProps {
  favorites: string[];
  onSelect: (component: string) => void;
  onRemove: (id: string) => void;
}

export const FavoritesTab: React.FC<FavoritesTabProps> = ({
  favorites,
  onSelect,
  onRemove
}) => {
  return (
    <CommandList className="max-h-[300px] overflow-y-auto">
      {favorites.length === 0 ? (
        <CommandEmpty>
          <div className="flex flex-col items-center justify-center py-6">
            <Heart className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No favorite components yet</p>
            <p className="text-xs text-muted-foreground mt-1">Click the heart icon to add favorites</p>
          </div>
        </CommandEmpty>
      ) : (
        <CommandGroup heading="Favorite Components">
          {favorites.map((componentId) => (
            <CommandItem
              key={componentId}
              value={componentId}
              onSelect={() => onSelect(componentId)}
              className="flex items-center justify-between p-3"
            >
              <span className="font-medium capitalize">{componentId}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(componentId);
                }}
                className="ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </CommandItem>
          ))}
        </CommandGroup>
      )}
    </CommandList>
  );
};
