import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import nodemailer from 'nodemailer';
import { smtpOptions } from './server/config.js';
import { createApp } from './server/app.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  function mountMailApi(server) {
    const transport = nodemailer.createTransport(smtpOptions(env));
    const app = createApp({ transport, from: env.SMTP_FROM, to: env.SMTP_TO });
    // Keep /api in the URL so Express can match its complete route paths.
    server.middlewares.use((req, res, next) => {
      if (req.url === '/api' || req.url?.startsWith('/api/')) app(req, res, next);
      else next();
    });
    server.httpServer?.once('close', () => transport.close());
  }
  return {
    plugins: [react(), {
      name: 'arrc-mail-api',
      configureServer: mountMailApi,
      configurePreviewServer: mountMailApi,
    }],
  };
});
