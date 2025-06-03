
import React from 'react';
import { CommandItem } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

interface SearchResultsProps {
  results: Array<{
    id: string;
    name: string;
    category: string;
    difficulty: string;
    tags: string[];
  }>;
  onSelect: (component: any) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  onSelect,
  favorites,
  onToggleFavorite
}) => {
  return (
    <>
      {results.map((component) => (
        <CommandItem
          key={component.id}
          value={component.name}
          onSelect={() => onSelect(component)}
          className="flex items-center justify-between p-3"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{component.name}</span>
              <Badge variant="outline" className="text-xs">
                {component.category}
              </Badge>
              <Badge 
                variant={component.difficulty === 'Easy' ? 'default' : 
                        component.difficulty === 'Medium' ? 'secondary' : 'destructive'} 
                className="text-xs"
              >
                {component.difficulty}
              </Badge>
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {component.tags.map(tag => (
                <span key={tag} className="text-xs text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(component.id);
            }}
            className="ml-2"
          >
            <Heart 
              className={`h-4 w-4 ${favorites.includes(component.id) ? 'fill-current text-red-500' : ''}`} 
            />
          </Button>
        </CommandItem>
      ))}
    </>
  );
};
