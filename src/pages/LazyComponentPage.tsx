
import { lazyLoad } from '@/utils/lazyLoad';
import { ComponentPageSkeleton } from '@/components/ui/skeleton-loaders';

export const LazyComponentPage = lazyLoad(
  () => import('./ComponentPage').then(module => ({ default: module.ComponentPage })),
  <ComponentPageSkeleton />
);
