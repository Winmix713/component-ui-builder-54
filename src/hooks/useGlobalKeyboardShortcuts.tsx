
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const shortcuts = {
  'g h': '/', // Go home
  'g c': '/components/button', // Go to components (button as default)
  'g i': '/installation', // Go to installation
  'g t': '/theming', // Go to theming
  'g s': '/settings', // Go to settings
};

export function useGlobalKeyboardShortcuts() {
  const navigate = useNavigate();

  useEffect(() => {
    let keySequence = '';
    let sequenceTimeout: NodeJS.Timeout;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if user is typing in an input
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement) {
        return;
      }

      // Skip if modifier keys are pressed (except for our specific shortcuts)
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      // Add key to sequence
      keySequence += event.key.toLowerCase();

      // Clear any existing timeout
      if (sequenceTimeout) {
        clearTimeout(sequenceTimeout);
      }

      // Check if current sequence matches any shortcut
      const matchingShortcut = Object.keys(shortcuts).find(shortcut => 
        shortcut.startsWith(keySequence)
      );

      if (matchingShortcut) {
        // If exact match, execute the shortcut
        if (matchingShortcut === keySequence) {
          event.preventDefault();
          const destination = shortcuts[matchingShortcut as keyof typeof shortcuts];
          navigate(destination);
          keySequence = '';
          return;
        }

        // If partial match, wait for more keys
        sequenceTimeout = setTimeout(() => {
          keySequence = '';
        }, 1000);
      } else {
        // No match, reset sequence
        keySequence = '';
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (sequenceTimeout) {
        clearTimeout(sequenceTimeout);
      }
    };
  }, [navigate]);
}
