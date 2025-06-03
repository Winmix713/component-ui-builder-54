
import React, { Suspense, ComponentType } from 'react';
import { ComponentPageSkeleton } from '@/components/ui/skeleton-loaders';

interface LazyComponentProps {
  fallback?: React.ReactNode;
}

export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = React.lazy(importFunc);

  return (props: React.ComponentProps<T> & LazyComponentProps) => (
    <Suspense fallback={fallback || <ComponentPageSkeleton />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

export function withSuspense<T extends ComponentType<any>>(
  Component: T,
  fallback?: React.ReactNode
) {
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback || <ComponentPageSkeleton />}>
      <Component {...props} />
    </Suspense>
  );
}
