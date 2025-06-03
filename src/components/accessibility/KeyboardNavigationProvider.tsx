
import React, { createContext, useContext, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface KeyboardNavigationContextType {
  registerShortcut: (key: string, callback: () => void, description: string) => void;
  unregisterShortcut: (key: string) => void;
  getShortcuts: () => Record<string, { callback: () => void; description: string }>;
}

const KeyboardNavigationContext = createContext<KeyboardNavigationContextType | undefined>(undefined);

export const useKeyboardNavigation = () => {
  const context = useContext(KeyboardNavigationContext);
  if (!context) {
    throw new Error('useKeyboardNavigation must be used within a KeyboardNavigationProvider');
  }
  return context;
};

interface KeyboardNavigationProviderProps {
  children: React.ReactNode;
}

export const KeyboardNavigationProvider: React.FC<KeyboardNavigationProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [shortcuts, setShortcuts] = React.useState<Record<string, { callback: () => void; description: string }>>({});

  const registerShortcut = useCallback((key: string, callback: () => void, description: string) => {
    setShortcuts(prev => ({
      ...prev,
      [key]: { callback, description }
    }));
  }, []);

  const unregisterShortcut = useCallback((key: string) => {
    setShortcuts(prev => {
      const newShortcuts = { ...prev };
      delete newShortcuts[key];
      return newShortcuts;
    });
  }, []);

  const getShortcuts = useCallback(() => shortcuts, [shortcuts]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Help shortcut
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
          return;
        }
        
        e.preventDefault();
        toast({
          title: "Keyboard Shortcuts",
          description: "Press Ctrl+? to see all available shortcuts",
        });
        return;
      }

      // Global shortcuts
      if (e.ctrlKey || e.metaKey) {
        const shortcutKey = `${e.ctrlKey ? 'Ctrl+' : 'Cmd+'}${e.key}`;
        const shortcut = shortcuts[shortcutKey];
        
        if (shortcut) {
          e.preventDefault();
          shortcut.callback();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, toast]);

  return (
    <KeyboardNavigationContext.Provider value={{ registerShortcut, unregisterShortcut, getShortcuts }}>
      {children}
    </KeyboardNavigationContext.Provider>
  );
};
