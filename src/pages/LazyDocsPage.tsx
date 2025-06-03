
import { lazyLoad } from '@/utils/lazyLoad';

export const LazyDocsPage = lazyLoad(
  () => import('./DocsPage').then(module => ({ default: module.DocsPage })),
  <div className="space-y-6 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
    <div className="h-64 bg-gray-200 rounded"></div>
  </div>
);
