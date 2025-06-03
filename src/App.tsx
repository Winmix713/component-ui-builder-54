import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { AccessibilityProvider } from '@/components/accessibility/AccessibilityProvider';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { Layout } from '@/components/layout/Layout';
import { Toaster } from '@/components/ui/toaster';
import { ComponentPlaygroundSkeleton } from '@/components/ui/skeleton-loaders';

// Lazy load pages for better performance
const LazyOverview = React.lazy(() => import('@/pages/LazyOverview'));
const LazyComponentPage = React.lazy(() => import('@/pages/LazyComponentPage'));
const LazyDocsPage = React.lazy(() => import('@/pages/LazyDocsPage'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

// Create a stable query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AccessibilityProvider>
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

const AppRoutes: React.FC = () => (
  <Suspense fallback={<ComponentPlaygroundSkeleton />}>
    <Routes>
      <Route path="/" element={<LazyOverview />} />
      <Route path="/components/:component" element={<LazyComponentPage />} />
      <Route path="/docs" element={<LazyDocsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProviders>
        <Router>
          <Layout>
            <AppRoutes />
          </Layout>
          <Toaster />
        </Router>
      </AppProviders>
    </ErrorBoundary>
  );
};

export default App;