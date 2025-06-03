import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SearchResultsSkeleton } from '@/components/ui/skeleton-loaders';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  title: string;
  href: string;
  category: string;
  description?: string;
}

const searchData: SearchResult[] = [
  // Components
  { title: "Accordion", href: "/components/accordion", category: "Layout", description: "Collapsible content sections" },
  { title: "Alert", href: "/components/alert", category: "Layout", description: "Important notifications" },
  { title: "Avatar", href: "/components/avatar", category: "Layout", description: "User profile images" },
  { title: "Badge", href: "/components/badge", category: "Layout", description: "Status indicators" },
  { title: "Button", href: "/components/button", category: "Layout", description: "Interactive buttons" },
  { title: "Card", href: "/components/card", category: "Layout", description: "Content containers" },
  { title: "Checkbox", href: "/components/checkbox", category: "Forms", description: "Boolean input controls" },
  { title: "Input", href: "/components/input", category: "Forms", description: "Text input fields" },
  { title: "Select", href: "/components/select", category: "Forms", description: "Dropdown selections" },
  { title: "Breadcrumb", href: "/components/breadcrumb", category: "Navigation", description: "Navigation trail" },
  { title: "Tabs", href: "/components/tabs", category: "Navigation", description: "Tabbed content" },
  // Docs
  { title: "Installation", href: "/installation", category: "Docs", description: "Getting started guide" },
  { title: "Theming", href: "/theming", category: "Docs", description: "Customize appearance" },
  { title: "Typography", href: "/typography", category: "Docs", description: "Text styling guide" },
];

interface EnhancedSearchProps {
  placeholder?: string;
  className?: string;
}

export function EnhancedSearch({ placeholder = "Search components...", className }: EnhancedSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Fuzzy search implementation
  const fuzzySearch = (searchQuery: string, items: SearchResult[]): SearchResult[] => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return items
      .filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      )
      .sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        
        // Exact matches first
        if (aTitle === query) return -1;
        if (bTitle === query) return 1;
        
        // Starts with query
        if (aTitle.startsWith(query) && !bTitle.startsWith(query)) return -1;
        if (bTitle.startsWith(query) && !aTitle.startsWith(query)) return 1;
        
        // Alphabetical
        return aTitle.localeCompare(bTitle);
      });
  };

  useEffect(() => {
    if (query) {
      setIsSearching(true);
      // Simulate search delay for better UX
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
  }, [query]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === '/') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (result: SearchResult) => {
    navigate(result.href);
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className={`justify-start text-sm text-muted-foreground w-full max-w-sm ${className}`}
        onClick={() => setIsOpen(true)}
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="sr-only">Search Components</DialogTitle>
            <DialogDescription className="sr-only">
              Search through components and documentation
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center border-b pb-3">
            {isSearching ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin opacity-50" />
            ) : (
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            )}
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search components and docs..."
              className="border-0 p-0 text-sm focus-visible:ring-0 shadow-none"
              autoFocus
            />
          </div>

          {isSearching ? (
            <SearchResultsSkeleton />
          ) : results.length > 0 ? (
            <div className="max-h-80 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={result.href}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    index === selectedIndex 
                      ? 'bg-accent text-accent-foreground' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleSelect(result)}
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{result.title}</span>
                      <Badge variant="secondary" className="text-xs">
                        {result.category}
                      </Badge>
                    </div>
                    {result.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {result.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : query && !isSearching ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : null}

          <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
            <span>Use ↑↓ to navigate, Enter to select, Esc to close</span>
            <span>Press / or Cmd+K to search</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
