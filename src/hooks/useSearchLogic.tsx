
import { useState, useEffect } from 'react';
import { SearchResult, searchData, categories } from '@/components/search/SearchData';
import { SearchFilter } from '@/components/search/SearchFilters';

export function useSearchLogic() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilter[]>(
    categories.slice(1).map(cat => ({ key: cat, label: cat, active: false }))
  );

  // Fuzzy search implementation
  const fuzzySearch = (searchQuery: string, items: SearchResult[]): SearchResult[] => {
    if (!searchQuery.trim()) return [];

    const queryLower = searchQuery.toLowerCase();
    const activeCategories = filters.filter(f => f.active).map(f => f.key);
    
    let filteredItems = items;
    if (activeCategories.length > 0) {
      filteredItems = items.filter(item => activeCategories.includes(item.category));
    }
    
    return filteredItems
      .filter(item => 
        item.title.toLowerCase().includes(queryLower) ||
        item.category.toLowerCase().includes(queryLower) ||
        item.description?.toLowerCase().includes(queryLower)
      )
      .sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        
        if (aTitle === queryLower) return -1;
        if (bTitle === queryLower) return 1;
        
        if (aTitle.startsWith(queryLower) && !bTitle.startsWith(queryLower)) return -1;
        if (bTitle.startsWith(queryLower) && !aTitle.startsWith(queryLower)) return 1;
        
        return aTitle.localeCompare(bTitle);
      });
  };

  useEffect(() => {
    if (query) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        const searchResults = fuzzySearch(query, searchData);
        setResults(searchResults);
        setSelectedIndex(0);
        setIsSearching(false);
      }, 150);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [query, filters]);

  const handleFilterToggle = (key: string) => {
    setFilters(prev => prev.map(filter => 
      filter.key === key ? { ...filter, active: !filter.active } : filter
    ));
  };

  const handleClearFilters = () => {
    setFilters(prev => prev.map(filter => ({ ...filter, active: false })));
  };

  return {
    query,
    setQuery,
    results,
    selectedIndex,
    setSelectedIndex,
    isSearching,
    filters,
    handleFilterToggle,
    handleClearFilters
  };
}
