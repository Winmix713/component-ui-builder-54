import React from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';

export function BreadcrumbNavigation(props: React.HTMLAttributes<HTMLElement>) {
  const breadcrumbs = useBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  // Extract data-lov-id and other props that shouldn't be passed to Fragment
  const { 'data-lov-id': dataLovId, ...restProps } = props;

  return (
    <Breadcrumb className="mb-6" {...restProps}>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={`breadcrumb-${index}-${item.label}`}>
            <BreadcrumbItem>
              {item.isCurrentPage ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.href || '/'}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}