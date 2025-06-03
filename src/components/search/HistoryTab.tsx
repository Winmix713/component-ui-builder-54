
import React from 'react';
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { History } from 'lucide-react';

interface HistoryTabProps {
  searchHistory: Array<{
    term: string;
    count: number;
    lastSearched: Date;
  }>;
  onSelect: (query: string) => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  searchHistory,
  onSelect
}) => {
  return (
    <CommandList className="max-h-[300px] overflow-y-auto">
      {searchHistory.length === 0 ? (
        <CommandEmpty>
          <div className="flex flex-col items-center justify-center py-6">
            <History className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No search history</p>
          </div>
        </CommandEmpty>
      ) : (
        <CommandGroup heading="Search History">
          {searchHistory.map((item, index) => (
            <CommandItem
              key={index}
              value={item.term}
              onSelect={() => onSelect(item.term)}
              className="flex items-center justify-between p-3"
            >
              <span className="font-medium">{item.term}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {item.count} searches
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(item.lastSearched).toLocaleDateString()}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      )}
    </CommandList>
  );
};
