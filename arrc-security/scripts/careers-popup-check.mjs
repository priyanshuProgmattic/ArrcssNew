import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

await mkdir('test-results', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.route('**/api/careers', (route) => route.fulfill({ json: { success: true } }));
const issues = [];
page.on('pageerror', (error) => issues.push(error.message));
page.on('console', (message) => {
  if (message.type() === 'error') issues.push(message.text());
});
const base = 'http://127.0.0.1:5173';
const direct = page.getByRole('button', { name: 'Apply for direct staff', exact: true });
const indirect = page.getByRole('button', { name: 'Apply for indirect staff', exact: true });
const dialog = page.getByRole('dialog', { name: 'Apply for a job', exact: true });

try {
  await page.goto(`${base}/careers`, { waitUntil: 'networkidle' });
  await expect(page.locator('.career-category')).toHaveCount(2);
  await expect(page.locator('.careers-page form')).toHaveCount(0);
  await page.screenshot({ path: 'test-results/careers-desktop-top.png', animations: 'disabled' });
  await direct.click();
  await expect(dialog).toBeVisible();
  await expect(page.getByLabel('Job role (required)', { exact: true })).toBeFocused();
  await expect(page.locator('#application-designation option')).toHaveText([
    'Select job role',
    'Security Guards',
    'Supervisors',
    'ASO',
    'SO',
    'Gunman-Civilian',
    'Ex-serviceman',
    'Ex-Service Man Training Officer',
    'PSO',
    'Facility Staff',
  ]);
  await expect(page.getByRole('form', { name: 'Direct staff application' })).toBeVisible();
  await page.screenshot({ path: 'test-results/careers-popup-desktop.png', animations: 'disabled' });
  await page.getByRole('button', { name: 'Cancel', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Close application', exact: true })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(direct).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');

  await indirect.click();
  await expect(dialog).toBeVisible();
  await expect(page.locator('#application-designation option')).toHaveText([
    'Select job role',
    'Management Staff',
    'Sales',
    'Accounts & Finance',
    'Operations',
    'Payroll Management',
    'HR',
    'CRM',
  ]);
  await expect(page.getByRole('form', { name: 'Indirect staff application' })).toBeVisible();
  await page.screenshot({
    path: 'test-results/careers-popup-indirect.png',
    animations: 'disabled',
  });
  await page.getByRole('button', { name: 'Submit', exact: true }).click();
  await expect(
    page.getByText('Choose the role you are applying for.', { exact: true }),
  ).toBeVisible();
  await page.getByLabel('Job role (required)', { exact: true }).selectOption('HR');
  await page.getByLabel('Your name').fill('Asha Sharma');
  await page.getByLabel('Email (required)', { exact: true }).fill('asha@example.com');
  await page.getByLabel('Phone number').fill('+91 98765 43210');
  await page.getByLabel('Upload resume').setInputFiles({
    name: 'resume.exe',
    mimeType: 'application/octet-stream',
    buffer: Buffer.from('invalid'),
  });
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Submit', exact: true }).click();
  await expect(page.getByText('Choose a PDF, DOC or DOCX resume.', { exact: true })).toBeVisible();
  await page.getByLabel('Upload resume').setInputFiles({
    name: 'resume.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4 example'),
  });
  await page.getByRole('button', { name: 'Submit', exact: true }).click();
  await expect(page.getByRole('status')).toBeVisible();
  await expect(page.getByRole('status')).toContainText('Your application has been received');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await direct.click();
  await expect(page.getByLabel('Your name')).toHaveValue('');
  await expect(page.getByLabel('Job role (required)', { exact: true })).toHaveValue('');
  await page.mouse.click(4, 4);
  await expect(dialog).toHaveCount(0);

  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${base}/careers`, { waitUntil: 'networkidle' });
    await direct.click();
    await expect(dialog).toBeVisible();
    const dimensions = await dialog.evaluate((element) => ({
      scroll: element.scrollWidth,
      width: element.clientWidth,
      height: element.getBoundingClientRect().height,
      viewport: window.innerHeight,
    }));
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.width + 1);
    expect(dimensions.height).toBeLessThanOrEqual(dimensions.viewport);
    if (width === 390)
      await page.screenshot({
        path: 'test-results/careers-popup-mobile.png',
        animations: 'disabled',
      });
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    ).toBe(true);
  }
  expect(issues).toEqual([]);
  console.log(
    'PASS: two category popups, exact role lists, reference fields, required-field and resume validation, API submission confirmation, focus trap and restoration, Escape, Cancel, backdrop close, fresh forms, and mobile scrolling at 320/390/768px.',
  );
} finally {
  await writeFile('test-results/careers-popup-report.json', JSON.stringify({ issues }, null, 2));
  await browser.close();
}
