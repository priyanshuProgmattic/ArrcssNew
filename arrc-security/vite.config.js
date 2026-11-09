import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { createApiHandler } from './server/api.js';
import { company } from './src/data/company.js';

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  return {
    define: {
      'import.meta.env.VITE_FORM_RECIPIENT': JSON.stringify(env.SMTP_TO?.trim() || company.email),
    },
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
