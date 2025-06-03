
import React, { useState, useMemo } from 'react';
import { Search, Command } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface QuickSearchProps {
  onComponentSelect?: (componentName: string) => void;
}

const COMPONENT_SUGGESTIONS = [
  { name: 'button', description: 'Interactive button component', category: 'Form' },
  { name: 'card', description: 'Content container', category: 'Layout' },
  { name: 'input', description: 'Text input field', category: 'Form' },
  { name: 'accordion', description: 'Collapsible content sections', category: 'Navigation' },
  { name: 'alert', description: 'Important messages', category: 'Feedback' },
  { name: 'badge', description: 'Status indicators', category: 'Display' },
  { name: 'dialog', description: 'Modal dialogs', category: 'Overlay' },
  { name: 'tabs', description: 'Tabbed navigation', category: 'Navigation' },
];

export const QuickSearch: React.FC<QuickSearchProps> = ({ onComponentSelect }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const filteredComponents = useMemo(() => {
    if (!query) return COMPONENT_SUGGESTIONS.slice(0, 4);
    
    return COMPONENT_SUGGESTIONS.filter(component =>
      component.name.toLowerCase().includes(query.toLowerCase()) ||
      component.description.toLowerCase().includes(query.toLowerCase()) ||
      component.category.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6);
  }, [query]);

  const handleSelect = (componentName: string) => {
    if (onComponentSelect) {
      onComponentSelect(componentName);
    } else {
      navigate(`/components/${componentName}`);
    }
    setQuery('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search components..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="pl-9 pr-4"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Badge variant="outline" className="text-xs">
            <Command className="h-3 w-3 mr-1" />
            K
          </Badge>
        </div>
      </div>

      {isOpen && (query || filteredComponents.length > 0) && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 glass-card">
          <CardContent className="p-2">
            <div className="space-y-1">
              {filteredComponents.map((component) => (
                <Button
                  key={component.name}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => handleSelect(component.name)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <div className="font-medium">{component.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {component.description}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {component.category}
                    </Badge>
                  </div>
                </Button>
              ))}
              
              {filteredComponents.length === 0 && query && (
                <div className="p-3 text-center text-muted-foreground">
                  No components found for "{query}"
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
