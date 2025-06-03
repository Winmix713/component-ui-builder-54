
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Play, Zap, Star } from 'lucide-react';
import { EnhancedCopyButton } from '@/components/ui/enhanced-copy';

interface PlaygroundActionsProps {
  isRunning: boolean;
  lastExecutionTime: number;
  renderErrorsCount: number;
  code: string;
  onRun: () => void;
  onReset: () => void;
  onSaveAsVariation: () => void;
  onCopy: () => void;
}

export const PlaygroundActions: React.FC<PlaygroundActionsProps> = ({
  isRunning,
  lastExecutionTime,
  renderErrorsCount,
  code,
  onRun,
  onReset,
  onSaveAsVariation,
  onCopy
}) => {
  return (
    <div className="flex items-center space-x-2" role="toolbar" aria-label="Playground actions">
      {lastExecutionTime > 0 && (
        <Badge variant="outline" className="text-xs">
          <Zap className="h-3 w-3 mr-1" />
          {lastExecutionTime.toFixed(2)}ms
        </Badge>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={onSaveAsVariation}
        className="glass-card"
        aria-label="Save current configuration as variation"
      >
        <Star className="h-4 w-4 mr-2" aria-hidden="true" />
        Save
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onRun}
        disabled={isRunning}
        className="glass-card"
        aria-label={isRunning ? 'Code is running' : 'Run component code'}
      >
        <Play className="h-4 w-4 mr-2" aria-hidden="true" />
        {isRunning ? 'Running...' : 'Run'}
      </Button>
      <EnhancedCopyButton
        code={code}
        language="tsx"
        className="glass-card"
        onCopy={onCopy}
        aria-label="Copy code to clipboard"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="glass-card"
        aria-label="Reset playground to initial state"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Reset</span>
      </Button>
    </div>
  );
};
