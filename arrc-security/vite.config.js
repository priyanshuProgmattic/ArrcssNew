import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { createApiHandler } from './server/api.js';

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  return {
    plugins: [
      react(),
      {
        name: 'website-form-email',
        configureServer(server) {
          server.middlewares.use(createApiHandler({ env }));
        },
        configurePreviewServer(server) {
          server.middlewares.use(createApiHandler({ env }));
        },
      },
    ],
  };
});
