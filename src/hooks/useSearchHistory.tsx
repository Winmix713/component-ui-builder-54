import { useState, useCallback, useEffect } from 'react';

interface SearchHistoryItem {
  term: string;
  count: number;
  lastSearched: Date;
}

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('component-search-history');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSearchHistory(parsed.map((item: any) => ({
          ...item,
          lastSearched: new Date(item.lastSearched)
        })));
      } catch (error) {
        console.error('Failed to parse search history:', error);
      }
    }
  }, []);

  const addSearchTerm = useCallback((term: string) => {
    if (!term.trim()) return;

    setSearchHistory(prev => {
      const existing = prev.find(item => item.term.toLowerCase() === term.toLowerCase());
      let updated;

      if (existing) {
        updated = prev.map(item =>
          item.term.toLowerCase() === term.toLowerCase()
            ? { ...item, count: item.count + 1, lastSearched: new Date() }
            : item
        );
      } else {
        updated = [...prev, { term, count: 1, lastSearched: new Date() }];
      }

      // Keep only the most recent 50 searches
      const sorted = updated
        .sort((a, b) => b.lastSearched.getTime() - a.lastSearched.getTime())
        .slice(0, 50);

      localStorage.setItem('component-search-history', JSON.stringify(sorted));
      return sorted;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem('component-search-history');
  }, []);

  return {
    searchHistory,
    addSearchTerm,
    clearHistory
  };
};
