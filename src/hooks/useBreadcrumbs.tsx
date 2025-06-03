
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const location = useLocation();

  return useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];

    if (pathSegments.length === 0) {
      breadcrumbs[0].isCurrentPage = true;
      return breadcrumbs;
    }

    // Handle components routes
    if (pathSegments[0] === 'components' && pathSegments[1]) {
      breadcrumbs.push(
        { label: 'Components', href: '/' },
        { label: pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1), isCurrentPage: true }
      );
    }
    // Handle docs routes
    else if (['installation', 'theming', 'typography', 'activity', 'settings', 'collaborators', 'notifications'].includes(pathSegments[0])) {
      breadcrumbs.push({
        label: pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1),
        isCurrentPage: true
      });
    }

    return breadcrumbs;
  }, [location.pathname]);
}
