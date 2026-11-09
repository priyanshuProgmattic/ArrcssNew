import { cp, mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { company } from '../src/data/company.js';
import { services } from '../src/data/services.js';
import { careerCategories } from '../src/data/careers.js';

export const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export async function prepareSharedHosting(destination, { includeWebsite = true } = {}) {
  const source = resolve(projectRoot, 'deploy/php');
  await access(resolve(source, 'vendor/autoload.php')).catch(() => {
    throw new Error(
      'Install the PHP mail dependency first: composer install --working-dir=deploy/php --no-dev',
    );
  });
  const publicDir = resolve(destination, 'public_html');
  const privateDir = resolve(destination, 'arrc-mail');
  await mkdir(resolve(publicDir, 'api'), { recursive: true });
  await mkdir(privateDir, { recursive: true });
  if (includeWebsite) await cp(resolve(projectRoot, 'dist'), publicDir, { recursive: true });
  for (const [from, to] of [
    ['api.php', resolve(publicDir, 'api/index.php')],
    ['public.htaccess', resolve(publicDir, '.htaccess')],
    ['public.user.ini', resolve(publicDir, '.user.ini')],
    ['private.htaccess', resolve(privateDir, '.htaccess')],
    ['bootstrap.php', resolve(privateDir, 'bootstrap.php')],
    ['composer.json', resolve(privateDir, 'composer.json')],
    ['composer.lock', resolve(privateDir, 'composer.lock')],
  ])
    await cp(resolve(source, from), to);
  await cp(resolve(source, 'vendor'), resolve(privateDir, 'vendor'), { recursive: true });
  await writeFile(
    resolve(privateDir, 'form-data.json'),
    JSON.stringify(
      {
        services: {
          ...Object.fromEntries(services.map(({ slug, title }) => [slug, title])),
          'integrated-services': 'Integrated services',
        },
        careers: Object.fromEntries(
          careerCategories.map(({ id, title, roles }) => [id, { title, roles }]),
        ),
      },
      null,
      2,
    ) + '\n',
  );
  await writeFile(
    resolve(privateDir, '.env.example'),
    [
      '# Save as .env in arrc-mail, outside public_html. Never put the app password in public_html.',
      `SMTP_TO=${company.email}`,
      'SMTP_HOST=smtp.gmail.com',
      'SMTP_PORT=587',
      'SMTP_SECURE=false',
      'SMTP_USER=your-sender@gmail.com',
      'SMTP_PASS=',
      'SMTP_FROM=your-sender@gmail.com',
      'SITE_URL=https://arrcss.com',
      'TRUST_PROXY=false',
      '',
    ].join('\n'),
  );
  await cp(resolve(projectRoot, 'docs/HOSTING.md'), resolve(destination, 'READ-ME-FIRST.md'));
  return { publicDir, privateDir };
}
