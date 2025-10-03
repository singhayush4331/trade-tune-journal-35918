import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';
import type { ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: false, // Disable polling for better performance
    }
  },
  plugins: [
    react(), // Removing the fastRefresh option as it's not supported in the type
    mode === 'development' && componentTagger(),
    {
      name: 'serve-xml-files',
      configureServer(server: ViteDevServer) {
        // Custom middleware to serve XML files directly with proper content-type
        server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: Function) => {
          if (req.url === '/sitemap.xml') {
            res.setHeader('Content-Type', 'application/xml');
            const xmlContent = fs.readFileSync(path.resolve(__dirname, 'public/sitemap.xml'), 'utf-8');
            res.end(xmlContent);
            return;
          }
          if (req.url === '/robots.txt') {
            res.setHeader('Content-Type', 'text/plain');
            const txtContent = fs.readFileSync(path.resolve(__dirname, 'public/robots.txt'), 'utf-8');
            res.end(txtContent);
            return;
          }
          next();
        });
      },
    },
    // Add PWA support for offline access and better performance
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'sitemap.xml', '*.svg', '*.png'],
      manifest: {
        name: 'Trade Tracker',
        short_name: 'TTracker',
        description: 'Track your trading journey',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '64x64',
            type: 'image/x-icon'
          }
        ],
        start_url: '/',
        display: 'standalone',
      },
      workbox: {
        // Cache first strategy for assets
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60, // Reduced entries
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 20, // Reduced entries
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          }
        ],
        // Explicitly exclude sitemap.xml and robots.txt from precaching AND navigation fallback
        navigateFallbackDenylist: [/^\/sitemap\.xml$/, /^\/robots\.txt$/],
        skipWaiting: true,
        clientsClaim: true,
        directoryIndex: 'index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // Explicitly exclude XML and TXT files from service worker handling
        globIgnores: ['**/*.xml', '**/*.txt']
      }
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Special handling for sitemap.xml in the build process
    emptyOutDir: true,
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunks for better caching
          react: ['react', 'react-dom'],
          routing: ['react-router-dom'],
          ui: [
            '@radix-ui/react-tabs', 
            '@radix-ui/react-dialog',
            '@radix-ui/react-toast',
            'next-themes'
          ],
          charts: ['recharts'],
          animations: ['framer-motion'],
          forms: ['react-hook-form', 'zod', '@hookform/resolvers'],
          datePicker: ['react-day-picker', 'date-fns'],
          // Add lucide icons as separate chunk since they're used throughout the app
          icons: ['lucide-react'],
          // Add tanstack libraries in a separate chunk
          tanstack: ['@tanstack/react-query', '@tanstack/react-virtual']
        },
        // Enhanced cache-busting using content hashing
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          // Special handling for sitemap.xml and robots.txt - keep them at the root with no transformation
          if (assetInfo.name === 'sitemap.xml' || assetInfo.name === 'robots.txt') {
            return '[name].[ext]';
          }
          return 'assets/[name].[hash].[ext]';
        }
      }
    },
    chunkSizeWarningLimit: 1200, // Increased warning limit
    sourcemap: mode === 'development', // Only in development
    // Enable build optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production', // Remove console logs in production
        drop_debugger: mode === 'production',
        // Additional terser optimizations
        pure_funcs: mode === 'production' ? ['console.log', 'console.debug'] : [],
        passes: 2
      },
      mangle: {
        safari10: true, // Better Safari compatibility
      },
      format: {
        comments: false // Remove comments from production build
      }
    },
    // Target modern browsers for smaller bundle size
    target: 'es2020',
    // Preload critical chunks
    modulePreload: {
      polyfill: true
    },
    // Split CSS for better caching
    cssCodeSplit: true
  },
  // Add optimizeDeps for faster development startup
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@tanstack/react-query',
      'framer-motion',
      'date-fns',
      'recharts'
    ],
    // Skip unnecessary processing with esbuild
    esbuildOptions: {
      target: 'es2020'
    }
  },
  // CSS optimization
  css: {
    devSourcemap: true
  }
}));
