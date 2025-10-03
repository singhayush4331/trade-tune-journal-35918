
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';
import { AuthProvider } from './hooks/use-auth';
import { initializeBundleOptimizations } from './utils/bundle-optimization';

// Initialize performance optimizations
initializeBundleOptimizations();

// Create a client with optimized caching strategy
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
      gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes (renamed from cacheTime)
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Only retry on network errors, not on auth/permission errors
        if (failureCount >= 2) return false;
        return error?.message?.includes('Network') || error?.message?.includes('fetch');
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnReconnect: 'always'
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error('Mutation error:', error);
      }
    }
  }
});

// Important: We're removing the client-side detection/redirect for sitemap.xml and robots.txt
// as these will now be handled directly by the server middleware

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <HelmetProvider>
              <App />
            </HelmetProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
