
import React, { Suspense } from 'react';
import { CodeEditorSkeleton } from '@/components/ui/skeleton-loaders';

const MonacoEditor = React.lazy(() => 
  import('./CodeEditor').then(module => ({ 
    default: module.CodeEditor 
  }))
);

interface LazyCodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
  height?: string;
}

export const LazyCodeEditor: React.FC<LazyCodeEditorProps> = (props) => {
  return (
    <Suspense fallback={<CodeEditorSkeleton />}>
      <MonacoEditor {...props} />
    </Suspense>
  );
};
