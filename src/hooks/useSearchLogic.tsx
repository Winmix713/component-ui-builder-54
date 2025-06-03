
import { useState, useCallback, useMemo } from 'react';
import { useSearchHistory } from './useSearchHistory';
import { SearchFilters } from '@/components/search/SearchFilters';

interface UseSearchLogicProps {
  onSelect?: (result: any) => void;
}

export const useSearchLogic = ({ onSelect }: UseSearchLogicProps = {}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    tags: [] as string[]
  });
  const [isOpen, setIsOpen] = useState(false);

  const { addSearchTerm, searchHistory } = useSearchHistory();

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      addSearchTerm(searchQuery);
    }
  }, [addSearchTerm]);

  const handleSelect = useCallback((result: any) => {
    onSelect?.(result);
    setIsOpen(false);
  }, [onSelect]);

  const results = useMemo(() => {
    // Mock search results - in a real app, this would come from an API
    const allComponents = [
      { id: 'button', name: 'Button', category: 'Form', difficulty: 'Easy', tags: ['interactive', 'form'] },
      { id: 'input', name: 'Input', category: 'Form', difficulty: 'Easy', tags: ['form', 'text'] },
      { id: 'card', name: 'Card', category: 'Layout', difficulty: 'Easy', tags: ['container', 'layout'] },
      { id: 'dialog', name: 'Dialog', category: 'Overlay', difficulty: 'Medium', tags: ['modal', 'overlay'] },
      { id: 'table', name: 'Table', category: 'Data', difficulty: 'Hard', tags: ['data', 'grid'] },
      { id: 'calendar', name: 'Calendar', category: 'Form', difficulty: 'Hard', tags: ['date', 'picker'] }
    ];

    return allComponents.filter(component => {
      const matchesQuery = !query || 
        component.name.toLowerCase().includes(query.toLowerCase()) ||
        component.category.toLowerCase().includes(query.toLowerCase()) ||
        component.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));

      const matchesCategory = !filters.category || component.category === filters.category;
      const matchesDifficulty = !filters.difficulty || component.difficulty === filters.difficulty;
      const matchesTags = filters.tags.length === 0 || 
        filters.tags.some(tag => component.tags.includes(tag));

      return matchesQuery && matchesCategory && matchesDifficulty && matchesTags;
    });
  }, [query, filters]);

  return {
    query,
    setQuery,
    filters,
    setFilters,
    isOpen,
    setIsOpen,
    results,
    searchHistory,
    handleSearch,
    handleSelect
  };
};
