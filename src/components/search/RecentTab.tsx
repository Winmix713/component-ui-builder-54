
import React from 'react';
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface RecentTabProps {
  recentlyViewed: Array<{
    id: string;
    name: string;
    visitedAt: Date;
  }>;
  onSelect: (component: any) => void;
}

export const RecentTab: React.FC<RecentTabProps> = ({
  recentlyViewed,
  onSelect
}) => {
  return (
    <CommandList className="max-h-[300px] overflow-y-auto">
      {recentlyViewed.length === 0 ? (
        <CommandEmpty>
          <div className="flex flex-col items-center justify-center py-6">
            <Clock className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No recently viewed components</p>
          </div>
        </CommandEmpty>
      ) : (
        <CommandGroup heading="Recently Viewed">
          {recentlyViewed.map((component) => (
            <CommandItem
              key={component.id}
              value={component.name}
              onSelect={() => onSelect(component)}
              className="flex items-center justify-between p-3"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{component.name}</span>
                <Badge variant="outline" className="text-xs">
                  {new Date(component.visitedAt).toLocaleDateString()}
                </Badge>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      )}
    </CommandList>
  );
};
