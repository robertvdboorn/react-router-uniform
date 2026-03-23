import { defineConfig, loadEnv } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import path from 'path';
import { setupPreviewServer } from './ui/lib/preview/previewServer';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      // React Router Framework Mode plugin (handles SSR, code splitting, etc.)
      reactRouter(),
      
      // Uniform preview plugin
      {
        name: 'uniform-preview',
        configureServer(server) {
          setupPreviewServer(server, {
            secret: env.UNIFORM_PREVIEW_SECRET,
            playgroundPath: '/uniform-playground'
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './ui'),
        // Also alias app directory for Framework Mode
        '~': path.resolve(__dirname, './app'),
      },
    },
    // Vite automatically serves files from the public directory
    publicDir: 'public',
    server: {
      port: 3000,
    },
  };
});
