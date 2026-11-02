import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { company } from '../src/data/company.js';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:5173';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const issues = [];
const requests = [];
let fail = true;
page.on('pageerror', (error) => issues.push(error.message));
await page.route('https://www.google.com/maps/embed?*', (route) =>
  route.fulfill({
    contentType: 'text/html',
    body: '<!doctype html><style>body{margin:0;background:#edf0f5}</style><title>Map fixture</title>',
  }),
);
// Keep browser checks independent of SMTP credentials and never send test data to a real inbox.
await page.route(/\/api\/(enquiry|careers)$/, (route) => {
  requests.push({ url: route.request().url(), body: route.request().postData() });
  return route.fulfill({ status: fail ? 502 : 200, json: { success: !fail } });
});

try {
  await page.goto(`${base}/contact-us`, { waitUntil: 'networkidle' });
  await expect(page.locator('.office-map iframe')).toHaveAttribute(
    'src',
    company.offices[0].mapEmbedUrl,
  );
  await page.getByLabel('Full name').fill('Asha Sharma');
  await page.getByLabel('Company name').fill('Example Operations');
  await page.getByLabel('Email address').fill('asha@example.com');
  await page.getByLabel('Phone number').fill('+91 98765 43210');
  await page.getByLabel('Service required').selectOption('manned-guarding');
  await page
    .getByLabel('How can we help?')
    .fill('Please discuss security for our office premises.');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Send enquiry' }).click();
  await expect(page.getByRole('alert')).toContainText('could not accept');
  await expect(page.getByLabel('Full name')).toHaveValue('Asha Sharma');
  await expect(page.getByRole('status')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Open email draft' })).toHaveAttribute(
    'href',
    /^mailto:info@arcsecuritysolutions\.in\?/,
  );
  expect(JSON.parse(requests.at(-1).body).formType).toBe('contact');
  fail = false;
  await page.getByRole('button', { name: 'Send enquiry' }).click();
  await expect(page.getByRole('status')).toContainText('Your enquiry has been received');
  await expect(page.getByRole('link', { name: 'Open email draft' })).toHaveCount(0);
  await expect(page.getByLabel('Full name')).toHaveValue('');

  await mkdir('test-results', { recursive: true });
  await page.screenshot({
    path: 'test-results/contact-desktop.png',
    fullPage: true,
    animations: 'disabled',
  });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.locator('.office-map').scrollIntoViewIfNeeded();
  const map = await page.locator('.office-map iframe').boundingBox();
  expect(map.height).toBeGreaterThan(200);
  expect(map.x + map.width).toBeLessThanOrEqual(320);
  await page.screenshot({
    path: 'test-results/contact-mobile.png',
    fullPage: true,
    animations: 'disabled',
  });

  await page.goto(`${base}/careers`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Apply for direct staff', exact: true }).click();
  await page.getByLabel('Job role (required)', { exact: true }).selectOption('Security Guards');
  await page.getByLabel('Your name').fill('Asha Sharma');
  await page.getByLabel('Email (required)', { exact: true }).fill('asha@example.com');
  await page.getByLabel('Phone number').fill('+91 98765 43210');
  await page.getByLabel('Upload resume').setInputFiles({
    name: 'resume.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4 test resume'),
  });
  await page.getByRole('checkbox').check();
  fail = true;
  await page.getByRole('button', { name: 'Submit', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('could not be accepted');
  await expect(page.getByRole('status')).toHaveCount(0);
  await expect(page.getByLabel('Your name')).toHaveValue('Asha Sharma');
  await expect(page.getByRole('link', { name: 'Open application email' })).toHaveAttribute(
    'href',
    /^mailto:info@arcsecuritysolutions\.in\?/,
  );
  fail = false;
  await page.getByRole('button', { name: 'Submit', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Your application has been received');
  await expect(page.getByRole('link', { name: 'Open application email' })).toHaveCount(0);
  await expect(page.getByLabel('Your name')).toHaveValue('');
  expect(issues).toEqual([]);
  console.log(
    'PASS: contact and career errors preserve details, fallbacks use the new inbox, retries confirm and reset, and the exact supplied map fits mobile.',
  );
} finally {
  await browser.close();
}
