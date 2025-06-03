import React, { useEffect } from 'react';
import { useKeyboardNavigation } from '@/components/accessibility/KeyboardNavigationProvider';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Keyboard, Zap } from 'lucide-react';

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
  const { registerShortcut, unregisterShortcut, getShortcuts } = useKeyboardNavigation();
  const { toast } = useToast();
  const [showHelp, setShowHelp] = React.useState(false);

  useEffect(() => {
    // Register global shortcuts
    if (onRun) {
      registerShortcut('Ctrl+r', onRun, 'Run component code');
    }
    if (onReset) {
      registerShortcut('Ctrl+z', onReset, 'Reset playground');
    }
    if (onSave) {
      registerShortcut('Ctrl+s', onSave, 'Save as variation');
    }
    if (onFormat) {
      registerShortcut('Ctrl+f', onFormat, 'Format code');
    }
    
    registerShortcut('Ctrl+?', () => setShowHelp(true), 'Show keyboard shortcuts');

    // Updated tab navigation shortcuts
    registerShortcut('Ctrl+1', () => {
      (document.querySelector('[data-tab="preview"]') as HTMLElement)?.click();
      toast({ description: 'Switched to Preview tab' });
    }, 'Switch to Preview tab');

    registerShortcut('Ctrl+2', () => {
      (document.querySelector('[data-tab="code"]') as HTMLElement)?.click();
      toast({ description: 'Switched to Code tab' });
    }, 'Switch to Code tab');

    registerShortcut('Ctrl+3', () => {
      (document.querySelector('[data-tab="templates"]') as HTMLElement)?.click();
      toast({ description: 'Switched to Templates tab' });
    }, 'Switch to Templates tab');

    registerShortcut('Ctrl+4', () => {
      (document.querySelector('[data-tab="props"]') as HTMLElement)?.click();
      toast({ description: 'Switched to Props tab' });
    }, 'Switch to Props tab');

    registerShortcut('Ctrl+5', () => {
      (document.querySelector('[data-tab="variations"]') as HTMLElement)?.click();
      toast({ description: 'Switched to Variations tab' });
    }, 'Switch to Variations tab');

    registerShortcut('Ctrl+6', () => {
      (document.querySelector('[data-tab="responsive"]') as HTMLElement)?.click();
      toast({ description: 'Switched to Responsive tab' });
    }, 'Switch to Responsive tab');

    return () => {
      // Cleanup shortcuts
      unregisterShortcut('Ctrl+r');
      unregisterShortcut('Ctrl+z');
      unregisterShortcut('Ctrl+s');
      unregisterShortcut('Ctrl+f');
      unregisterShortcut('Ctrl+?');
      unregisterShortcut('Ctrl+1');
      unregisterShortcut('Ctrl+2');
      unregisterShortcut('Ctrl+3');
      unregisterShortcut('Ctrl+4');
      unregisterShortcut('Ctrl+5');
      unregisterShortcut('Ctrl+6');
    };
  }, [onRun, onReset, onSave, onFormat, registerShortcut, unregisterShortcut, toast]);

  const shortcuts = getShortcuts();

  return (
    <Dialog open={showHelp} onOpenChange={setShowHelp}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Quick navigation and actions for the component playground
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {Object.entries(shortcuts).map(([key, { description }]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm">{description}</span>
              <Badge variant="outline" className="text-xs font-mono">
                {key}
              </Badge>
            </div>
          ))}
        </div>
        
        <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <Keyboard className="h-3 w-3" />
            <strong>Tips:</strong>
          </div>
          <ul className="space-y-1 text-xs">
            <li>• Press <kbd>?</kbd> anywhere to see this help</li>
            <li>• Use <kbd>Esc</kbd> to close dialogs</li>
            <li>• Shortcuts work when the playground is focused</li>
            <li>• <kbd>Ctrl+K</kbd> opens global search from anywhere</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};
