
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SearchFiltersProps {
  filters: {
    category: string;
    difficulty: string;
    tags: string[];
  };
  onFiltersChange: (filters: any) => void;
}

const categories = ['Form', 'Layout', 'Overlay', 'Data', 'Navigation'];
const difficulties = ['Easy', 'Medium', 'Hard'];
const availableTags = ['interactive', 'form', 'text', 'container', 'layout', 'modal', 'overlay', 'data', 'grid', 'date', 'picker'];

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const updateFilter = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      onFiltersChange({ ...filters, tags: [...filters.tags, tag] });
    }
  };

  const removeTag = (tag: string) => {
    onFiltersChange({ ...filters, tags: filters.tags.filter(t => t !== tag) });
  };

  const clearFilters = () => {
    onFiltersChange({ category: '', difficulty: '', tags: [] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filters</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear all
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Category</label>
          <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Difficulty</label>
          <Select value={filters.difficulty} onValueChange={(value) => updateFilter('difficulty', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All levels</SelectItem>
              {difficulties.map(difficulty => (
                <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground">Tags</label>
        <div className="mt-1 flex flex-wrap gap-1">
          {filters.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-auto p-0"
                onClick={() => removeTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {availableTags
            .filter(tag => !filters.tags.includes(tag))
            .map(tag => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer text-xs"
                onClick={() => addTag(tag)}
              >
                {tag}
              </Badge>
            ))}
        </div>
      </div>
    </div>
  );
};
