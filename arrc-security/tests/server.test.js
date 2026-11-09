import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../server/app.js';

test('API validates submissions, attaches resumes, and reports SMTP failures honestly', async () => {
  const messages = [];
  let fail = false;
  const app = createApp({ from: 'sender@example.com', to: 'team@example.com', transport: {
    async sendMail(message) { messages.push(message); if (fail) throw new Error('SMTP unavailable'); return { accepted: ['team@example.com'], rejected: [] }; },
  } });
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const values = { fullName: 'Test User', companyName: 'Test Company', email: 'visitor@example.com', phone: '9876543210', service: 'manned-guarding', message: 'Please discuss our security requirements.', consent: true };
  const post = (body) => fetch(`${base}/api/enquiry`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  try {
    assert.equal((await post({ ...values, consent: false })).status, 400);
    assert.equal(messages.length, 0);
    assert.equal((await post({ ...values, inquiryType: 'quote' })).status, 400);
    assert.equal((await post({ ...values, to: 'attacker@example.com' })).status, 200);
    assert.equal(messages[0].to, 'team@example.com');
    assert.equal(messages[0].replyTo, values.email);
    const data = new FormData();
    for (const [key, value] of Object.entries({ ...values, category: 'direct', designation: 'Security Guards', address: '', currentLocation: '', experience: '', lastSalary: '', lastPost: '' })) data.append(key, String(value));
    data.append('resume', new Blob(['test resume'], { type: 'application/pdf' }), 'cv.pdf');
    const response = await fetch(`${base}/api/careers`, { method: 'POST', body: data });
    assert.equal(response.status, 200);
    assert.equal(messages[1].attachments[0].content.toString(), 'test resume');
    fail = true;
    const failure = await post(values);
    assert.equal(failure.status, 502);
    assert.equal((await failure.json()).success, false);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
