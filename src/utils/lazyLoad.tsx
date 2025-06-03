
import React, { Suspense } from 'react';
import { ComponentPageSkeleton } from '@/components/ui/skeleton-loaders';

export function lazyLoad(
  importFunc: () => Promise<{ default: React.ComponentType<any> }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = React.lazy(importFunc);

  return (props: any) => (
    <Suspense fallback={fallback || <ComponentPageSkeleton />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

export function withSuspense(
  Component: React.ComponentType<any>,
  fallback?: React.ReactNode
) {
  return (props: any) => (
    <Suspense fallback={fallback || <ComponentPageSkeleton />}>
      <Component {...props} />
    </Suspense>
  );
}
