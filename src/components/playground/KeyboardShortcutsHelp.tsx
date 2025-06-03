
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Keyboard, Zap } from 'lucide-react';

const playgroundShortcuts = [
  { keys: ['Ctrl', '1'], description: 'Switch to Preview tab' },
  { keys: ['Ctrl', '2'], description: 'Switch to Code tab' },
  { keys: ['Ctrl', '3'], description: 'Switch to Props tab' },
  { keys: ['Ctrl', '4'], description: 'Switch to Variations tab' },
  { keys: ['Ctrl', '5'], description: 'Switch to Responsive tab' },
  { keys: ['Ctrl', 'R'], description: 'Run component code' },
  { keys: ['Ctrl', 'S'], description: 'Save as variation' },
  { keys: ['Ctrl', 'Z'], description: 'Reset playground' },
  { keys: ['Esc'], description: 'Close dialogs' },
];

export function PlaygroundKeyboardShortcuts() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Keyboard className="h-4 w-4 mr-2" />
          Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Playground Shortcuts
          </DialogTitle>
          <DialogDescription>
            Quick navigation and actions for the component playground
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {playgroundShortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{shortcut.description}</span>
              <div className="flex items-center space-x-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <div key={keyIndex} className="flex items-center">
                    <Badge variant="outline" className="text-xs font-mono">
                      {key}
                    </Badge>
                    {keyIndex < shortcut.keys.length - 1 && (
                      <span className="text-xs text-muted-foreground mx-1">+</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted rounded-md">
          <strong>Tip:</strong> These shortcuts work when the playground is focused. Use Tab to navigate between interactive elements.
        </div>
      </DialogContent>
    </Dialog>
  );
}
