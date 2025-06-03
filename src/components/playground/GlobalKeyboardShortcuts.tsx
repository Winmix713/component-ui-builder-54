
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface GlobalKeyboardShortcutsProps {
  onRun?: () => void;
  onReset?: () => void;
  onSave?: () => void;
  onFormat?: () => void;
}

export const GlobalKeyboardShortcuts: React.FC<GlobalKeyboardShortcutsProps> = ({
  onRun,
  onReset,
  onSave,
  onFormat
}) => {
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'Enter':
            if (onRun) {
              e.preventDefault();
              onRun();
            }
            break;
          case 'r':
            if (onReset) {
              e.preventDefault();
              onReset();
            }
            break;
          case 's':
            if (onSave) {
              e.preventDefault();
              onSave();
            }
            break;
          case '1':
            e.preventDefault();
            (document.querySelector('[data-tab="preview"]') as HTMLElement)?.click();
            break;
          case '2':
            e.preventDefault();
            (document.querySelector('[data-tab="code"]') as HTMLElement)?.click();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onRun, onReset, onSave, onFormat]);

  return null;
};
