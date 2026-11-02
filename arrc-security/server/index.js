import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createApiHandler } from './api.js';

const defaultDist = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff2': 'font/woff2',
};

export function createWebsiteServer({
  env = process.env,
  api = createApiHandler({ env }),
  distDir = defaultDist,
} = {}) {
  const root = resolve(distDir);
  return createServer((req, res) => {
    api(req, res, async () => {
      try {
        if (!['GET', 'HEAD'].includes(req.method)) {
          res.writeHead(405, { Allow: 'GET, HEAD' });
          res.end();
          return;
        }
        const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
        const file = resolve(root, `.${pathname}`);
        if (
          (file !== root && !file.startsWith(`${root}${sep}`)) ||
          pathname.split(/[\\/]/).some((part) => part.startsWith('.'))
        ) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        let target = file;
        let details = await stat(target).catch(() => null);
        if (!details?.isFile()) {
          if (extname(pathname)) {
            res.writeHead(404);
            res.end('Not found');
            return;
          }
          target = resolve(root, 'index.html');
          details = await stat(target).catch(() => null);
        }
        if (!details?.isFile()) {
          res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Build the website with npm run build before starting the production server.');
          return;
        }
        res.writeHead(200, {
          'Content-Type': contentTypes[extname(target)] || 'application/octet-stream',
          'Content-Length': details.size,
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': extname(target) === '.html' ? 'no-cache' : 'public, max-age=3600',
        });
        if (req.method === 'HEAD') res.end();
        else
          createReadStream(target)
            .on('error', () => res.destroy())
            .pipe(res);
      } catch {
        res.writeHead(400);
        res.end('Invalid request');
      }
    });
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    process.loadEnvFile(resolve(dirname(fileURLToPath(import.meta.url)), '../.env.local'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const port = Number(process.env.PORT || 3000);
  createWebsiteServer().listen(port, process.env.HOST || '0.0.0.0', () => {
    console.log(`ARRC website listening on port ${port}`);
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS)
      console.log('Configure SMTP_HOST, SMTP_USER and SMTP_PASS to enable form email delivery.');
  });
}
