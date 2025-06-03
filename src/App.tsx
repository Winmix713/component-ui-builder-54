
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import { SkipNavigation } from "@/components/accessibility/SkipNavigation";
import { Layout } from "./components/layout/Layout";
import { LazyOverview } from "./pages/LazyOverview";
import { LazyComponentPage } from "./pages/LazyComponentPage";
import { LazyDocsPage } from "./pages/LazyDocsPage";
import NotFound from "./pages/NotFound";
import { useWebVitals } from "./hooks/usePerformance";
import { AnalyticsProvider } from "./components/analytics/AnalyticsProvider";
import { usePageAnalytics } from "./hooks/usePageAnalytics";
import { usePWA } from "./hooks/usePWA";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

const AppContent = () => {
  useWebVitals();
  usePageAnalytics();
  const { isInstallable, installApp } = usePWA();

  return (
    <>
      <SkipNavigation />
      <Toaster />
      <Sonner />
      {isInstallable && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={installApp}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg"
          >
            Install App
          </button>
        </div>
      )}
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<LazyOverview />} />
            <Route path="/installation" element={<LazyDocsPage />} />
            <Route path="/theming" element={<LazyDocsPage />} />
            <Route path="/typography" element={<LazyDocsPage />} />
            <Route path="/components/:component" element={<LazyComponentPage />} />
            <Route path="/activity" element={<LazyDocsPage />} />
            <Route path="/settings" element={<LazyDocsPage />} />
            <Route path="/collaborators" element={<LazyDocsPage />} />
            <Route path="/notifications" element={<LazyDocsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  );
};

const App = () => {
  
  return (
    <QueryClientProvider client={queryClient}>
      <AnalyticsProvider trackingId={import.meta.env.VITE_GA_TRACKING_ID}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AccessibilityProvider>
            <TooltipProvider>
              <AppContent />
            </TooltipProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </AnalyticsProvider>
    </QueryClientProvider>
  );
};

export default App;
