import { mkdir, mkdtemp } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { prepareSharedHosting, projectRoot } from './shared-hosting-files.mjs';

// PHP hosts use the included PHP endpoints at the same URLs as the Node backend.
execFileSync(process.execPath, [resolve(projectRoot, 'node_modules/vite/bin/vite.js'), 'build'], {
  cwd: projectRoot,
  stdio: 'inherit',
  windowsHide: true,
  env: {
    ...process.env,
    VITE_SITE_URL: 'https://arrcss.com',
    VITE_INQUIRY_ENDPOINT: '/api/enquiry',
    VITE_CAREERS_ENDPOINT: '/api/careers',
  },
});
const toolsDir = resolve(projectRoot, '.tools');
await mkdir(toolsDir, { recursive: true });
const staging = await mkdtemp(resolve(toolsDir, 'shared-hosting-'));
await prepareSharedHosting(staging);
const archive = resolve(projectRoot, 'arrc-shared-hosting.zip');
execFileSync('php', [resolve(projectRoot, 'deploy/php/package.php'), staging, archive], {
  cwd: projectRoot,
  stdio: 'inherit',
  windowsHide: true,
});
console.log(`Upload package: ${archive}`);
console.log('Extract in the account directory containing public_html, not inside public_html.');
console.log(
  'Copy your private .env.local to arrc-mail/.env on the host. No password is included in the ZIP.',
);
