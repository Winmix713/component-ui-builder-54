
import React from 'react';
import { History, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchHistoryItem } from '@/hooks/useSearchHistory';

interface HistoryTabProps {
  history: SearchHistoryItem[];
  onSelectQuery: (query: string) => void;
  onRemoveFromHistory: (query: string) => void;
  onClearHistory: () => void;
}

export function HistoryTab({
  history,
  onSelectQuery,
  onRemoveFromHistory,
  onClearHistory
}: HistoryTabProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Search History</span>
        </div>
        {history.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearHistory}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {history.length > 0 ? (
        <div className="max-h-80 overflow-y-auto space-y-1">
          {history.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onSelectQuery(item.query)}
            >
              <div className="flex items-center space-x-2">
                <History className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm">{item.query}</span>
                {item.category && (
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFromHistory(item.query);
                }}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-sm text-muted-foreground">
          No search history yet
        </div>
      )}
    </>
  );
}
