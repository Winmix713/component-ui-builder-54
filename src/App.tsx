
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

const App = () => {
  useWebVitals();
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AccessibilityProvider>
          <TooltipProvider>
            <SkipNavigation />
            <Toaster />
            <Sonner />
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
          </TooltipProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
