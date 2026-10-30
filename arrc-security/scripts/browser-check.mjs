import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { services } from '../src/data/services.js';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:5173';
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
  '/career',
  '/request-quote',
  '/privacy-policy',
  '/missing-page',
  '/services/missing-service',
];
const issues = [];
const report = { routes: [], responsive: [], interactions: [], issues };
await mkdir('test-results', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on('pageerror', (error) => issues.push(`Runtime: ${error.message}`));
page.on('console', (message) => {
  if (message.type() === 'error') issues.push(`Console: ${message.text()}`);
});
page.on('response', (response) => {
  if (response.status() >= 400 && response.url().startsWith(base))
    issues.push(`HTTP ${response.status()}: ${response.url()}`);
});

async function load(path) {
  await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
  await page.locator('main h1').waitFor();
  await page.evaluate(() => document.fonts.ready);
}
async function loadImages() {
  return page.locator('img').evaluateAll(async (images) => {
    await Promise.all(
      images.map(async (image) => {
        image.loading = 'eager';
        try {
          await image.decode();
        } catch {}
      }),
    );
    return images
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.getAttribute('src'));
  });
}
async function noOverflow(label) {
  const overflow = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    width: window.innerWidth,
  }));
  if (overflow.scroll > overflow.width + 1)
    issues.push(`Overflow at ${label}: ${overflow.scroll}/${overflow.width}`);
}

try {
  for (const route of routes) {
    await load(route);
    expect(await page.locator('main h1').count()).toBe(1);
    const broken = await loadImages();
    if (broken.length) issues.push(`${route}: broken images ${broken.join(', ')}`);
    await noOverflow(route);
    const title = await page.title();
    expect(title).toContain('ARRC');
    report.routes.push({ route, title, heading: await page.locator('main h1').innerText() });
  }

  await load('/');
  const servicesToggle = page.getByRole('button', { name: 'Open Services menu', exact: true });
  await servicesToggle.click();
  await expect(page.locator('#menu-services')).toBeVisible();
  expect(await page.locator('#menu-services .nav-dropdown__links>a').count()).toBe(7);
  await page.locator('#menu-services .nav-dropdown__links>a').first().focus();
  await page.keyboard.press('Escape');
  await expect(page.locator('#menu-services')).toHaveCount(0);
  await expect(servicesToggle).toBeFocused();
  report.interactions.push('Desktop mega menu, Escape and focus return');

  await page.getByRole('tab', { name: '02 Personnel selection' }).click();
  await expect(page.getByRole('tabpanel')).toContainText('Select the right people');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tabpanel')).toContainText('Prepare for the assignment');
  report.interactions.push('Operations tabs and arrow-key navigation');

  await load('/services');
  await page.getByRole('button', { name: 'Technology', exact: true }).click();
  await expect(page.locator('.services-directory .service-card')).toHaveCount(1);
  await page.locator('.services-directory .service-card').click();
  await expect(page).toHaveURL(/\/services\/smart-security$/);
  report.interactions.push('Service filters and corresponding service links');

  await load('/request-quote?service=facility-management');
  await expect(page.getByLabel('Service required')).toHaveValue('facility-management');
  await page.getByRole('button', { name: 'Prepare email enquiry' }).click();
  await expect(page.getByText('Enter your full name.', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Full name')).toBeFocused();
  await page.getByLabel('Full name').fill('Asha Sharma');
  await page.getByLabel('Company name').fill('Example Operations');
  await page.getByLabel('Email address').fill('asha@example.com');
  await page.getByLabel('Phone number').fill('+91 98765 43210');
  await page.getByLabel('Property type').selectOption('Corporate Offices');
  await page.getByLabel('Site location').fill('Gurugram');
  await page.getByLabel('Number of personnel').fill('8');
  await page
    .getByLabel('Your requirements')
    .fill('Please discuss housekeeping and facility support for our office.');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Prepare email enquiry' }).click();
  await expect(page.getByRole('status')).toContainText('No message has been sent yet');
  await expect(page.getByRole('link', { name: 'Open email draft' })).toHaveAttribute(
    'href',
    /^mailto:info@arrcss.com\?/,
  );
  report.interactions.push(
    'Quote preselection, required-field validation and honest email draft flow',
  );
  await load('/contact-us');
  await expect(page.locator('.office-map iframe')).toHaveCount(0);
  await page.getByRole('button', { name: /Registered office Delhi/ }).click();
  await expect(page.locator('.office-map h3')).toContainText('Delhi');
  await expect(page.getByRole('link', { name: 'Get directions' })).toHaveAttribute(
    'href',
    /Ghitorni/,
  );
  report.interactions.push('Office selection and maps withheld until requested');

  for (const width of [320, 375, 390, 480, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/services', '/request-quote', '/careers']) {
      await load(route);
      await noOverflow(`${route} at ${width}px`);
    }
    report.responsive.push(width);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await load('/');
  await page.getByRole('button', { name: 'Open navigation', exact: true }).click();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await page.getByRole('button', { name: 'Open Services menu', exact: true }).click();
  await expect(page.locator('#menu-services')).toBeVisible();
  await page.screenshot({ path: 'test-results/mobile-navigation.png', animations: 'disabled' });
  await page.locator('#menu-services a').filter({ hasText: 'Manned Guarding' }).click();
  await expect(page).toHaveURL(/\/services\/manned-guarding$/);
  await expect(page.getByRole('button', { name: 'Open navigation', exact: true })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  report.interactions.push('Mobile menu, service submenu, navigation and automatic close');

  await load('/careers');
  await loadImages();
  await page.screenshot({
    path: 'test-results/careers-mobile.png',
    animations: 'disabled',
    fullPage: true,
  });
  await page.getByRole('button', { name: 'Apply for indirect staff', exact: true }).click();
  await expect(page.locator('#application-designation option')).toHaveText([
    'Choose a role',
    'Management Staff',
    'Sales',
    'Accounts & Finance',
    'Operations',
    'Payroll Management',
    'HR',
    'CRM',
  ]);
  await page.getByRole('button', { name: 'Prepare application', exact: true }).click();
  await expect(
    page.getByText('Choose the role you are applying for.', { exact: true }),
  ).toBeVisible();
  await page.getByLabel('Applying for').selectOption('HR');
  await page.getByLabel('Full name').fill('Asha Sharma');
  await page.getByLabel('Email address').fill('asha@example.com');
  await page.getByLabel('Phone number').fill('+91 98765 43210');
  await page
    .getByLabel('Upload resume')
    .setInputFiles({
      name: 'resume.exe',
      mimeType: 'application/octet-stream',
      buffer: Buffer.from('invalid'),
    });
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Prepare application', exact: true }).click();
  await expect(page.getByText('Choose a PDF, DOC or DOCX resume.', { exact: true })).toBeVisible();
  await page
    .getByLabel('Upload resume')
    .setInputFiles({
      name: 'asha-resume.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4 sample resume'),
    });
  await page.getByRole('button', { name: 'Prepare application', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Nothing has been sent or uploaded yet');
  await expect(page.getByRole('link', { name: 'Open application email' })).toHaveAttribute(
    'href',
    /^mailto:info@arrcss.com\?/,
  );
  await page.getByRole('button', { name: 'Direct staff', exact: true }).click();
  await expect(page.getByLabel('Applying for')).toHaveValue('');
  await expect(page.locator('#application-designation option')).toContainText(['Security Guards']);
  await expect(page.getByRole('status')).toHaveCount(0);
  report.interactions.push(
    'Career application categories, required fields, resume validation and email draft',
  );

  await page.setViewportSize({ width: 1440, height: 1000 });
  await load('/careers');
  await loadImages();
  await page.screenshot({
    path: 'test-results/careers-desktop.png',
    animations: 'disabled',
    fullPage: true,
  });
  await page.screenshot({ path: 'test-results/careers-desktop-top.png', animations: 'disabled' });

  await page.setViewportSize({ width: 390, height: 844 });

  await load('/');
  await loadImages();
  await page.screenshot({
    path: 'test-results/home-mobile.png',
    fullPage: true,
    animations: 'disabled',
  });
  await page.screenshot({ path: 'test-results/home-mobile-top.png', animations: 'disabled' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await load('/');
  await loadImages();
  await page.screenshot({
    path: 'test-results/home-desktop.png',
    fullPage: true,
    animations: 'disabled',
  });
  await page.screenshot({ path: 'test-results/home-desktop-top.png', animations: 'disabled' });
  await page.getByRole('button', { name: 'Open Services menu', exact: true }).click();
  await page.screenshot({ path: 'test-results/desktop-mega-menu.png', animations: 'disabled' });
  expect(issues, issues.join('\n')).toEqual([]);
  console.log(
    `PASS: ${report.routes.length} routes, ${report.responsive.length} viewport widths, ${report.interactions.length} interaction groups. No runtime errors, failed assets or horizontal overflow.`,
  );
} finally {
  await writeFile('test-results/browser-report.json', JSON.stringify(report, null, 2));
  await browser.close();
}
