import nodemailer from 'nodemailer';
import { smtpOptions } from '../server/config.js';
import { createApp } from '../server/app.js';

const recipient = process.argv[2];
if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) throw new Error('Usage: npm run test:mail -- recipient@example.com');
const transport = nodemailer.createTransport(smtpOptions());
await transport.verify();
console.log('SMTP authentication verified.');
const app = createApp({ transport, from: process.env.SMTP_FROM, to: recipient });
const server = app.listen(0, '127.0.0.1');
await new Promise(resolve => server.once('listening', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const values = { fullName: 'ARRC Mail Test', companyName: 'ARRC Test', email: recipient, phone: '+91 9876543210', service: 'manned-guarding', message: 'This is a test submission to verify website SMTP email delivery.', consent: true };
async function check(path, options, label) {
  const response = await fetch(`${base}${path}`, options);
  if (!response.ok || (await response.json()).success !== true) throw new Error(`${label} failed: HTTP ${response.status}`);
  console.log(`${label}: SMTP accepted email to ${recipient}`);
}
try {
  for (const inquiryType of ['contact', 'quote']) {
    await check('/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, inquiryType, propertyType: 'Corporate Offices', location: 'Test site', personnel: '2' }) }, inquiryType);
  }
  for (const [category, designation] of [['direct', 'Security Guards'], ['indirect', 'HR']]) {
    const data = new FormData();
    for (const [key, value] of Object.entries({ ...values, category, designation, address: '', currentLocation: 'Test site', experience: 'Test', lastSalary: '', lastPost: '' })) data.append(key, String(value));
    data.append('resume', new Blob(['%PDF-1.4\nARRC SMTP test resume attachment\n%%EOF'], { type: 'application/pdf' }), 'test-resume.pdf');
    await check('/api/careers', { method: 'POST', body: data }, `${category} career application with attachment`);
  }
} finally {
  server.close();
  transport.close();
}
