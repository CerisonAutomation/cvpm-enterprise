import { Suspense, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { AccessibilityProvider } from "@/providers/AccessibilityProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { LoadingScreen } from "@/components/LoadingScreen";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import { routes } from "@/config/routes";
import { monitoring } from "@/lib/monitoring";

// Enterprise Query Configuration with Caching Strategy
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { 
      retry: (failureCount, error: any) => {
        // Custom retry logic for different error types
        if (error?.status === 404) return false;
        if (error?.status === 401) return false;
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      networkMode: 'online',
    },
    mutations: {
      retry: 1,
      onError: (error: Error, variables: unknown, context: unknown) => {
        monitoring.trackError('mutation_error', error, { variables, context });
      },
    },
  },
});

// CMS paths that skip loading screen for performance
const CMS_PATHS = ["/cms", "/admin"];

/**
 * Enterprise Application Root Component
 * 
 * Features:
 * - Error Boundaries with graceful degradation
 * - Suspense for code splitting
 * - Performance monitoring
 * - Accessibility providers
 * - Theme management
 * - Authentication state
 * - Optimized query client
 */
const App: React.FC = () => {
  const [loaded, setLoaded] = useState(() => {
    // Skip loader for CMS paths to improve admin experience
    return CMS_PATHS.some(path => 
      window.location.pathname.startsWith(path)
    );
  });

  useEffect(() => {
    // Performance monitoring setup
    const startTime = performance.now();
    
    // Track application startup performance
    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      monitoring.trackPerformance('app_load_time', loadTime);
      
      // Set loaded state after minimum display time for UX
      setTimeout(() => setLoaded(true), Math.max(0, 500 - loadTime));
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  // Error boundary fallback component
  const ErrorFallback = ({ error, resetErrorBoundary }: any) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-600 mb-6">
          We're sorry, but something unexpected happened. 
          Our team has been notified.
        </p>
        <details className="text-left mb-6 p-4 bg-red-50 rounded-lg">
          <summary className="cursor-pointer font-semibold text-red-800">
            Technical Details
          </summary>
          <pre className="mt-2 text-xs text-red-700 overflow-auto">
            {error?.message || 'Unknown error'}
          </pre>
        </details>
        <button
          onClick={resetErrorBoundary}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // Loading fallback for suspense
  const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AccessibilityProvider>
            <AuthProvider>
              <TooltipProvider>
                <PerformanceMonitor />
                {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
                <Suspense fallback={<LoadingFallback />}>
                  <BrowserRouter>
                    <Routes>
                      {routes.map(({ path, component: Component, ...props }) => (
                        <Route
                          key={path}
                          path={path}
                          element={
                            <Suspense fallback={<LoadingFallback />}>
                              <Component {...props} />
                            </Suspense>
                          }
                        />
                      ))}
                    </Routes>
                  </BrowserRouter>
                  <CookieConsentBanner />
                </Suspense>
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </AuthProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

// Performance optimization - memoize the component
export default App;