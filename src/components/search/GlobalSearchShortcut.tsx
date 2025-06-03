
import React, { useState, useEffect } from 'react';
import { EnhancedSearch } from './EnhancedSearch';

export const GlobalSearchShortcut: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  return (
    <EnhancedSearch 
      open={open} 
      onOpenChange={setOpen}
      placeholder="Search components... (Ctrl+K)"
    />
  );
};
