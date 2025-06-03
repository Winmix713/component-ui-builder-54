
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export interface SearchFilter {
  key: string;
  label: string;
  active: boolean;
}

interface SearchFiltersProps {
  filters: SearchFilter[];
  onFilterToggle: (key: string) => void;
  onClearAll: () => void;
}

export function SearchFilters({ filters, onFilterToggle, onClearAll }: SearchFiltersProps) {
  const activeFilters = filters.filter(f => f.active);

  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 p-3 border-b">
      <span className="text-xs font-medium text-muted-foreground mr-2">Filter by:</span>
      
      {filters.map(filter => (
        <Badge
          key={filter.key}
          variant={filter.active ? "default" : "outline"}
          className="cursor-pointer transition-colors"
          onClick={() => onFilterToggle(filter.key)}
        >
          {filter.label}
        </Badge>
      ))}

      {activeFilters.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-6 px-2 text-xs"
        >
          <X className="h-3 w-3 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
