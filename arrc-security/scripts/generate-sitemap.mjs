import { writeFileSync } from 'node:fs';
import { services } from '../src/data/services.js';
const origin = process.env.SITE_URL || 'https://arrcss.com';
if (!/^https?:\/\/[^\s]+$/.test(origin)) throw new Error('Set SITE_URL to the production origin.');
const base = origin.replace(/\/$/, '');
const routes = [
  '/',
  '/about-us',
  '/services',
  ...services.map((service) => `/services/${service.slug}`),
  '/operations',
  '/technology',
  '/industries',
  '/why-choose-us',
  '/contact-us',
  '/careers',
  '/request-quote',
  '/privacy-policy',
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>${base}${route}</loc></url>`).join('\n')}\n</urlset>\n`;
writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml);
console.log(`Generated ${routes.length} sitemap URLs for ${base}`);
