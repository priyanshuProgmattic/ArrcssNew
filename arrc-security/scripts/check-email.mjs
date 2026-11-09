import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
import { createApiHandler, createSmtpTransport } from '../server/api.js';
import { createWebsiteServer } from '../server/index.js';
import { company } from '../src/data/company.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const env = { ...loadEnv('development', root, ''), ...process.env };
const recipient = env.SMTP_TO?.trim() || company.email;
const missing = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'].filter((key) => !env[key]?.trim());

async function main() {
  console.log(`All forms send to: ${recipient}`);
  if (missing.length) {
    console.error(`Email is not configured. Set ${missing.join(', ')} in .env.local.`);
    console.error('Changing the recipient alone does not configure a mail sender.');
    process.exitCode = 1;
    return;
  }

  const transport = createSmtpTransport(env);
  let server;
  try {
    await transport.verify();
    console.log('SMTP connection and authentication passed.');
    if (!process.argv.includes('--send-tests')) return;

    server = createWebsiteServer({ env, api: createApiHandler({ env, transport }) });
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    const base = `http://127.0.0.1:${server.address().port}`;
    const enquiry = {
      fullName: 'ARRC Form Test',
      companyName: 'ARRC Security Solutions',
      email: recipient,
      phone: '+91 98765 43210',
      service: 'manned-guarding',
      message: 'This is a test submission to verify website form email delivery.',
      consent: true,
    };
    for (const formType of ['contact', 'quote']) {
      const response = await fetch(`${base}/api/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...enquiry,
          formType,
          propertyType: 'Corporate Offices',
          location: 'Gurugram',
          personnel: '2',
        }),
        signal: AbortSignal.timeout(30000),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error(result.message);
      console.log(`PASS: ${formType} form accepted by SMTP for ${recipient}.`);
    }
    for (const [category, designation] of [
      ['direct', 'Security Guards'],
      ['indirect', 'HR'],
    ]) {
      const form = new FormData();
      for (const [key, value] of Object.entries({
        category,
        designation,
        fullName: enquiry.fullName,
        email: recipient,
        phone: enquiry.phone,
        consent: 'true',
        address: '',
        currentLocation: 'Gurugram',
        experience: '',
        lastSalary: '',
        lastPost: '',
      }))
        form.set(key, value);
      form.set(
        'resume',
        new File(['%PDF-1.4\nARRC test resume\n%%EOF'], 'arrc-test-resume.pdf', {
          type: 'application/pdf',
        }),
      );
      const response = await fetch(`${base}/api/careers`, {
        method: 'POST',
        body: form,
        signal: AbortSignal.timeout(30000),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error(result.message);
      console.log(`PASS: ${category} career form accepted by SMTP with a resume for ${recipient}.`);
    }
    console.log(`Check ${recipient} (including Spam) for all four messages and both attachments.`);
  } finally {
    if (server) await new Promise((resolve) => server.close(resolve));
    transport.close();
  }
}

try {
  await main();
} catch (error) {
  console.error(
    `Email check failed (${error.code || 'DELIVERY_ERROR'}). Check SMTP credentials, sender authorization and network access.`,
  );
  process.exitCode = 1;
}
