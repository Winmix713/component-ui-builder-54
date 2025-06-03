
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
import { Keyboard } from 'lucide-react';

const shortcuts = [
  { keys: ['Cmd', 'K'], description: 'Open search' },
  { keys: ['/'], description: 'Focus search' },
  { keys: ['g', 'h'], description: 'Go to home' },
  { keys: ['g', 'c'], description: 'Go to components' },
  { keys: ['g', 'i'], description: 'Go to installation' },
  { keys: ['g', 't'], description: 'Go to theming' },
  { keys: ['g', 's'], description: 'Go to settings' },
  { keys: ['↑', '↓'], description: 'Navigate search results' },
  { keys: ['Enter'], description: 'Select search result' },
  { keys: ['Esc'], description: 'Close dialogs' },
];

export function KeyboardShortcutsHelp() {
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
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Quick navigation and actions using your keyboard
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">{shortcut.description}</span>
              <div className="flex items-center space-x-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <React.Fragment key={keyIndex}>
                    <Badge variant="outline" className="text-xs font-mono">
                      {key}
                    </Badge>
                    {keyIndex < shortcut.keys.length - 1 && (
                      <span className="text-xs text-muted-foreground">+</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted rounded-md">
          <strong>Tip:</strong> Press keys in sequence for navigation shortcuts (e.g., press 'g' then 'h' for home)
        </div>
      </DialogContent>
    </Dialog>
  );
}
