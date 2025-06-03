
import { lazyLoad } from '@/utils/lazyLoad';
import { ComponentPlaygroundSkeleton } from '@/components/ui/skeleton-loaders';

export default lazyLoad(
  () => import('./Overview'),
  <ComponentPlaygroundSkeleton />
);
