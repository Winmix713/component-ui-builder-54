
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlaygroundActions } from './PlaygroundActions';

interface PlaygroundHeaderProps {
  title: string;
  renderErrorsCount: number;
  isRunning: boolean;
  lastExecutionTime: number;
  code: string;
  onRun: () => void;
  onReset: () => void;
  onSaveAsVariation: () => void;
  onCopy: () => void;
}

export const PlaygroundHeader: React.FC<PlaygroundHeaderProps> = ({
  title,
  renderErrorsCount,
  isRunning,
  lastExecutionTime,
  code,
  onRun,
  onReset,
  onSaveAsVariation,
  onCopy
}) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CardTitle className="text-lg" id="playground-title">
            Enhanced Playground
          </CardTitle>
          <Badge variant="secondary" className="glass-card" aria-describedby="playground-title">
            {title}
          </Badge>
          {renderErrorsCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {renderErrorsCount} Error{renderErrorsCount > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        <PlaygroundActions
          isRunning={isRunning}
          lastExecutionTime={lastExecutionTime}
          renderErrorsCount={renderErrorsCount}
          code={code}
          onRun={onRun}
          onReset={onReset}
          onSaveAsVariation={onSaveAsVariation}
          onCopy={onCopy}
        />
      </div>
    </CardHeader>
  );
};
