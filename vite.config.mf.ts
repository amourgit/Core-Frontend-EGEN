// ============================================================
// vite.config.mf.ts — Template for EGEN Micro-Frontend Remotes
//
// Copy this to your micro-frontend package and adjust:
//   1. name: 'your-mf-name'
//   2. exposes: list your components
//   3. port: unique port for dev
// ============================================================

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'my-mf',           // ← change to your MF name
      filename: 'remoteEntry.js',
      exposes: {
        // './MyComponent': './src/MyComponent',
      },
      shared: {
        react:                   { singleton: true, requiredVersion: '^18.3.1' },
        'react-dom':             { singleton: true, requiredVersion: '^18.3.1' },
        'react-router-dom':      { singleton: true, requiredVersion: '^6.0.0' },
        'zustand':               { singleton: true },
        '@tanstack/react-query': { singleton: true },
        // Core EGEN packages — loaded from host
        '@egen/esm-auth':        { singleton: true, import: false },
        '@egen/esm-styleguide':  { singleton: true, import: false },
        '@egen/esm-framework':   { singleton: true, import: false },
        '@egen/esm-api':         { singleton: true, import: false },
      },
    }),
  ],
  server: {
    port: 3002,     // ← assign unique port per MF
    cors: true,
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});
