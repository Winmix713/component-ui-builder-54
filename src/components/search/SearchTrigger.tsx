
import React from 'react';
import { Search, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SearchTriggerProps {
  placeholder?: string;
  className?: string;
  onClick: () => void;
}

export function SearchTrigger({ placeholder = "Search components...", className, onClick }: SearchTriggerProps) {
  return (
    <Button
      variant="outline"
      className={`justify-start text-sm text-muted-foreground w-full max-w-sm ${className}`}
      onClick={onClick}
    >
      <Search className="mr-2 h-4 w-4" />
      {placeholder}
      <div className="ml-auto flex items-center space-x-1">
        <Badge variant="outline" className="text-xs">
          <Command className="h-3 w-3 mr-1" />
          K
        </Badge>
      </div>
    </Button>
  );
}
