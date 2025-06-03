
import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: () => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      const isKeyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const isCtrlMatch = !shortcut.ctrlKey || event.ctrlKey;
      const isMetaMatch = !shortcut.metaKey || event.metaKey;
      const isShiftMatch = !shortcut.shiftKey || event.shiftKey;
      const isAltMatch = !shortcut.altKey || event.altKey;

      // Check if we need modifier keys
      const needsModifier = shortcut.ctrlKey || shortcut.metaKey || shortcut.shiftKey || shortcut.altKey;
      const hasCorrectModifiers = needsModifier ? (
        (shortcut.ctrlKey === event.ctrlKey || false) &&
        (shortcut.metaKey === event.metaKey || false) &&
        (shortcut.shiftKey === event.shiftKey || false) &&
        (shortcut.altKey === event.altKey || false)
      ) : true;

      if (isKeyMatch && hasCorrectModifiers && isCtrlMatch && isMetaMatch && isShiftMatch && isAltMatch) {
        event.preventDefault();
        shortcut.callback();
        break;
      }
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

export function usePlaygroundShortcuts(actions: {
  onRun?: () => void;
  onCopy?: () => void;
  onReset?: () => void;
}) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'Enter',
      ctrlKey: true,
      callback: () => actions.onRun?.(),
      description: 'Run code'
    },
    {
      key: 'Enter',
      metaKey: true,
      callback: () => actions.onRun?.(),
      description: 'Run code (Mac)'
    },
    {
      key: 'c',
      ctrlKey: true,
      shiftKey: true,
      callback: () => actions.onCopy?.(),
      description: 'Copy code'
    },
    {
      key: 'c',
      metaKey: true,
      shiftKey: true,
      callback: () => actions.onCopy?.(),
      description: 'Copy code (Mac)'
    },
    {
      key: 'r',
      ctrlKey: true,
      callback: () => actions.onReset?.(),
      description: 'Reset playground'
    },
    {
      key: 'r',
      metaKey: true,
      callback: () => actions.onReset?.(),
      description: 'Reset playground (Mac)'
    }
  ];

  useKeyboardShortcuts(shortcuts);
}
