
import React, { useState, useEffect } from 'react';
import { EnhancedSearch } from './EnhancedSearch';
import { useKeyboardNavigation } from '@/components/accessibility/KeyboardNavigationProvider';

export const GlobalSearchShortcut: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { registerShortcut, unregisterShortcut } = useKeyboardNavigation();

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };

    registerShortcut('Ctrl+k', () => setOpen(true), 'Open global search');
    document.addEventListener('keydown', handleKeydown);

    return () => {
      unregisterShortcut('Ctrl+k');
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [registerShortcut, unregisterShortcut]);

  return (
    <EnhancedSearch 
      open={open} 
      onOpenChange={setOpen}
      placeholder="Search components... (Ctrl+K)"
    />
  );
};
