import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// ============================================================
// EGEN CORE — Vite Configuration
//
// Architecture: Vite + Module Federation (primary bundler)
//
// MODULE FEDERATION STRATEGY:
//  - Core is the HOST: exposes shared deps, loads remotes
//  - Each micro-frontend is a REMOTE: served from own port
//  - Shared singletons: React, Router, Zustand, Query
//
// ENV VARS:
//  EGEN_IAM_URL     — IAM micro-frontend URL (default: localhost:3000)
//  EGEN_API_URL     — Backend API URL (default: localhost:8080)
//  EGEN_PORT        — Dev server port (default: 3001)
// ============================================================

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const IAM_URL   = env.EGEN_IAM_URL   || 'http://localhost:3000';
  const API_URL   = env.EGEN_API_URL   || 'http://localhost:8080';
  const DEV_PORT  = parseInt(env.EGEN_PORT || '3001', 10);

  return {
    plugins: [
      react(),
      tailwindcss(),

      // ── Module Federation ───────────────────────────────────
      // Core is the HOST shell.
      // Remotes are loaded dynamically (see mf-loader.ts).
      federation({
        name: 'egen-core',
        remotes: {
          // Each MF remote — add/remove as modules are deployed
          // Format: <alias>@<url>/remoteEntry.js
          iam: `iam@${IAM_URL}/assets/remoteEntry.js`,
        },
        shared: {
          // Singletons — only ONE copy across the entire app
          react:                   { singleton: true, requiredVersion: '^18.3.1' },
          'react-dom':             { singleton: true, requiredVersion: '^18.3.1' },
          'react-router-dom':      { singleton: true, requiredVersion: '^6.0.0' },
          'zustand':               { singleton: true, requiredVersion: '^5.0.0' },
          '@tanstack/react-query': { singleton: true },
          // Non-singleton — each module bundles its own
          'framer-motion':         { singleton: false },
          'lucide-react':          { singleton: false },
        },
      }),
    ],

    resolve: {
      alias: {
        // @/ maps to shell src — used by shell components
        '@': path.resolve(__dirname, './packages/shell/esm-app-shell/src'),
        // Package aliases for local development (monorepo)
        '@egen/esm-auth':        path.resolve(__dirname, './packages/framework/esm-auth/src'),
        '@egen/esm-styleguide':  path.resolve(__dirname, './packages/framework/esm-styleguide/src'),
        '@egen/esm-framework':   path.resolve(__dirname, './packages/framework/esm-framework/src'),
        '@egen/esm-api':         path.resolve(__dirname, './packages/framework/esm-api/src'),
        '@egen/esm-config':      path.resolve(__dirname, './packages/framework/esm-config/src'),
        '@egen/esm-state':       path.resolve(__dirname, './packages/framework/esm-state/src'),
        '@egen/esm-utils':       path.resolve(__dirname, './packages/framework/esm-utils/src'),
      },
    },

    server: {
      port: DEV_PORT,
      cors: true,
      proxy: {
        // Proxy /api → backend (avoids CORS in dev)
        '/api': {
          target: API_URL,
          changeOrigin: true,
          secure: false,
        },
        // Proxy /egen → EGEN backend
        '/egen': {
          target: API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },

    build: {
      target: 'esnext',
      minify: false,         // Required for Module Federation runtime
      cssCodeSplit: false,   // Required for MF CSS sharing
      rollupOptions: {
        output: {
          // Consistent chunk naming for MF
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },

    optimizeDeps: {
      // Force pre-bundling of MF shared packages
      include: [
        'react', 'react-dom', 'react-router-dom',
        'zustand', '@tanstack/react-query',
      ],
    },
  };
});
