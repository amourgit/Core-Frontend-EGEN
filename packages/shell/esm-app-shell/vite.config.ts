import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const IAM_URL = process.env.VITE_IAM_URL || 'http://localhost:3000';

  return {
    plugins: [
      react(),
      tailwindcss(),

      // ── Module Federation ─────────────────────────────────────
      federation({
        name: 'core',
        remotes: {
          iam: `iam@${IAM_URL}/static/chunks/remoteEntry.js`,
        },
        shared: {
          react: { singleton: true, requiredVersion: '^18.3.1' },
          'react-dom': { singleton: true, requiredVersion: '^18.3.1' },
          'react-router-dom': { singleton: true, requiredVersion: '^6.0.0' },
          'framer-motion': { singleton: true },
          'lucide-react': { singleton: false },
          zustand: { singleton: true },
          '@tanstack/react-query': { singleton: true },
        },
      }),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    server: {
      port: 3001,
      cors: true,
      proxy: {
        '/api/auth': {
          target: IAM_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },

    build: {
      target: 'esnext',
      minify: false,
      cssCodeSplit: false,
      outDir: '../../dist',
    },
  };
});
