import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const IAM_URL = env.VITE_IAM_URL || 'http://localhost:3000';

  return {
    plugins: [
      react(),
      tailwindcss(),

      // ── Module Federation ───────────────────────────────────
      // Le Core consomme les remoteEntry.js des microservices.
      // Chaque microservice expose ses composants via MF.
      federation({
        name: 'core',

        // ── Remotes connus ─────────────────────────────────────
        // En production ces URLs viennent du Registry Service.
        // En dev, on les pointe en dur vers les ports locaux.
        remotes: {
          iam: `iam@${IAM_URL}/static/chunks/remoteEntry.js`,
          // future: scolarite: `scolarite@${env.VITE_SCOLARITE_URL}/static/chunks/remoteEntry.js`,
          // future: bibliotheque: `bibliotheque@${env.VITE_BIB_URL}/static/chunks/remoteEntry.js`,
        },

        // ── Dépendances partagées (singleton) ──────────────────
        // Ces libs ne seront chargées QU'UNE SEULE FOIS même si
        // le remote les déclare aussi — évite les doubles instances.
        shared: {
          react:           { singleton: true, requiredVersion: '^18.3.1' },
          'react-dom':     { singleton: true, requiredVersion: '^18.3.1' },
          'react-router-dom': { singleton: true, requiredVersion: '^6.0.0' },
          'framer-motion': { singleton: true },
          'lucide-react':  { singleton: false },
          'zustand':       { singleton: true },
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
    },

    build: {
      target: 'esnext',
      minify: false,         // requis pour MF en mode production
      cssCodeSplit: false,
    },
  };
});
