import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer as createHttpServer } from 'node:http';
import { createServer as createTcpServer } from 'node:net';
import { mkdtemp, writeFile, unlink, rmdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import nodemailer from 'nodemailer';
import { createApiHandler, createSmtpTransport } from '../server/api.js';
import { createWebsiteServer } from '../server/index.js';

const recipient = 'info@arcsecuritysolutions.in';
const enquiry = {
  fullName: 'Asha Sharma',
  companyName: 'Example Operations',
  email: 'asha@example.com',
  phone: '+91 98765 43210',
  service: 'manned-guarding',
  message: 'Please discuss security for our office premises.',
  consent: true,
  formType: 'contact',
};

async function listen(server, context) {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  context.after(() => new Promise((resolve) => server.close(resolve)));
  return `http://127.0.0.1:${server.address().port}`;
}

function apiServer(options) {
  const handler = createApiHandler({ env: {}, logger: { error() {} }, ...options });
  return createHttpServer((req, res) => handler(req, res, () => res.end('Website')));
}

function post(base, values = enquiry) {
  return fetch(`${base}/api/enquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });
}

function applicationForm(overrides = {}) {
  const form = new FormData();
  const fields = {
    designation: 'HR',
    fullName: enquiry.fullName,
    email: enquiry.email,
    phone: enquiry.phone,
    category: 'indirect',
    consent: 'true',
    address: '',
    currentLocation: 'Gurugram',
    experience: '',
    lastSalary: '',
    lastPost: '',
    ...overrides,
  };
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  form.set('resume', new File(['%PDF-1.4 test resume'], 'resume.pdf', { type: 'application/pdf' }));
  return form;
}

for (const smtpTo of [undefined, 'priyanshukashyap844@gmail.com']) {
  test(`all forms deliver through SMTP to ${smtpTo || 'the default company inbox'}`, async (context) => {
    const expectedRecipient = smtpTo || recipient;
    const messages = [];
    const recipients = [];
    const smtp = createTcpServer((socket) => {
      socket.write('220 local-test ESMTP\r\n');
      let pending = '';
      let dataMode = false;
      let message = '';
      socket.on('data', (chunk) => {
        pending += chunk.toString();
        let end;
        while ((end = pending.indexOf('\r\n')) !== -1) {
          const line = pending.slice(0, end);
          pending = pending.slice(end + 2);
          if (dataMode) {
            if (line === '.') {
              messages.push(message);
              message = '';
              dataMode = false;
              socket.write('250 Message accepted\r\n');
            } else message += `${line}\r\n`;
          } else if (/^EHLO|^HELO/.test(line)) socket.write('250 local-test\r\n');
          else if (/^RCPT TO:/.test(line)) {
            recipients.push(line);
            socket.write('250 Recipient accepted\r\n');
          } else if (line === 'DATA') {
            dataMode = true;
            socket.write('354 Send message\r\n');
          } else if (line === 'QUIT') socket.end('221 Goodbye\r\n');
          else socket.write('250 OK\r\n');
        }
      });
    });
    await listen(smtp, context);
    // Local SMTP fixture only. Production createSmtpTransport always requires TLS.
    const transport = nodemailer.createTransport({
      host: '127.0.0.1',
      port: smtp.address().port,
      secure: false,
      ignoreTLS: true,
    });
    const base = await listen(
      apiServer({ transport, env: { SMTP_FROM: 'website@example.com', SMTP_TO: smtpTo } }),
      context,
    );
    const contact = await post(base, { ...enquiry, to: 'other@example.com' });
    assert.equal(contact.status, 200);
    assert.equal((await contact.json()).success, true);
    const quote = await post(base, {
      ...enquiry,
      formType: 'quote',
      propertyType: 'Corporate Offices',
      location: 'Gurugram',
      personnel: '8',
    });
    assert.equal(quote.status, 200);
    const application = await fetch(`${base}/api/careers`, {
      method: 'POST',
      body: applicationForm(),
    });
    assert.equal(application.status, 200);
    const directApplication = await fetch(`${base}/api/careers`, {
      method: 'POST',
      body: applicationForm({ category: 'direct', designation: 'Security Guards' }),
    });
    assert.equal(directApplication.status, 200);
    assert.equal(messages.length, 4);
    assert.deepEqual(recipients, Array(4).fill(`RCPT TO:<${expectedRecipient}>`));
    for (const message of messages) {
      assert.match(message, /From: ARRC website <website@example.com>/);
      assert.match(message, /Reply-To: asha@example.com/);
      assert.ok(message.includes(`To: ${expectedRecipient}\r\n`));
    }
    assert.match(messages[0], /Please discuss security for our office premises/);
    assert.match(messages[1], /Property type: Corporate Offices/);
    assert.match(messages[1], /Personnel required: 8/);
    assert.match(messages[2], /Content-Disposition: attachment; filename=resume.pdf/);
    assert.match(messages[2], /Resume attached: resume.pdf/);
    assert.match(messages[2], /JVBERi0xLjQgdGVzdCByZXN1bWU=/);
  });
}

test('server validation rejects invalid enquiries, quotes, consent and role categories', async (context) => {
  let sent = 0;
  const base = await listen(
    apiServer({
      transport: {
        sendMail() {
          sent += 1;
        },
      },
    }),
    context,
  );
  for (const values of [
    { ...enquiry, email: 'invalid' },
    { ...enquiry, consent: false },
    { ...enquiry, service: 'unknown' },
    { ...enquiry, formType: 'quote' },
    { ...enquiry, formType: 'other' },
  ])
    assert.equal((await post(base, values)).status, 422);
  const invalidRole = await fetch(`${base}/api/careers`, {
    method: 'POST',
    body: applicationForm({ designation: 'Security Guards' }),
  });
  assert.equal(invalidRole.status, 422);
  const form = applicationForm();
  form.set('resume', new File(['bad'], 'resume.exe', { type: 'application/octet-stream' }));
  assert.equal((await fetch(`${base}/api/careers`, { method: 'POST', body: form })).status, 422);
  assert.equal(sent, 0);
});

test('missing SMTP, SMTP rejection and SMTP failure never report success', async (context) => {
  assert.equal(createSmtpTransport({}), null);
  const testRecipient = 'priyanshukashyap844@gmail.com';
  const missing = await listen(
    apiServer({ transport: null, env: { SMTP_TO: testRecipient } }),
    context,
  );
  const unavailable = await post(missing);
  assert.equal(unavailable.status, 503);
  const unavailableBody = await unavailable.json();
  assert.equal(unavailableBody.success, false);
  assert.equal(unavailableBody.recipient, testRecipient);
  assert.ok(unavailableBody.message.includes(testRecipient));
  assert.equal((await post(missing, { ...enquiry, consent: false })).status, 422);
  for (const transport of [
    { sendMail: async () => ({ accepted: [] }) },
    {
      sendMail: async () => {
        throw new Error('Private provider details');
      },
    },
  ]) {
    const base = await listen(apiServer({ transport }), context);
    const response = await post(base);
    assert.equal(response.status, 502);
    const body = await response.text();
    assert.equal(JSON.parse(body).success, false);
    assert.doesNotMatch(body, /Private provider details/);
  }
});

test('Gmail SMTP accepts app passwords pasted with spaces and requires TLS', () => {
  const transport = createSmtpTransport({
    SMTP_HOST: 'smtp.gmail.com',
    SMTP_USER: 'sender@example.com',
    SMTP_PASS: 'aaaa bbbb cccc dddd',
    SMTP_PORT: '587',
    SMTP_SECURE: 'false',
  });
  assert.equal(transport.options.auth.pass, 'aaaabbbbccccdddd');
  assert.equal(transport.options.requireTLS, true);
  transport.close();
  assert.equal(
    createSmtpTransport({
      SMTP_HOST: 'smtp.gmail.com',
      SMTP_USER: 'sender@example.com',
      SMTP_PASS: ' ',
    }),
    null,
  );
});

test('API rejects unexpected origins, malformed requests, large payloads and excess requests', async (context) => {
  const base = await listen(
    apiServer({ transport: { sendMail: async () => ({ accepted: [recipient] }) } }),
    context,
  );
  assert.equal((await fetch(`${base}/api/enquiry`)).status, 405);
  assert.equal((await fetch(`${base}/api/unknown`)).status, 404);
  const foreign = await fetch(`${base}/api/enquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://other.example.com' },
    body: JSON.stringify(enquiry),
  });
  assert.equal(foreign.status, 403);
  const invalidOrigin = await fetch(`${base}/api/enquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'null' },
    body: JSON.stringify(enquiry),
  });
  assert.equal(invalidOrigin.status, 403);
  assert.equal(
    (
      await fetch(`${base}/api/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{broken',
      })
    ).status,
    400,
  );
  assert.equal((await post(base, { ...enquiry, message: 'a'.repeat(70 * 1024) })).status, 413);
  for (let index = 0; index < 8; index++) assert.equal((await post(base)).status, 200);
  const limited = await post(base);
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get('Retry-After')) > 0);
});

test('production server keeps source files private and supports direct page navigation', async (context) => {
  const distDir = await mkdtemp(join(tmpdir(), 'arrc-mail-site-'));
  await writeFile(join(distDir, 'index.html'), '<!doctype html><title>ARRC</title>');
  context.after(async () => {
    await unlink(join(distDir, 'index.html'));
    await rmdir(distDir);
  });
  const base = await listen(createWebsiteServer({ env: {}, distDir }), context);
  const page = await fetch(`${base}/contact-us`);
  assert.equal(page.status, 200);
  assert.match(page.headers.get('Content-Type'), /text\/html/);
  for (const path of [
    '/.env.local',
    '/server/api.js',
    '/src/data/company.js',
    '/assets/missing.js',
  ])
    assert.equal((await fetch(`${base}${path}`)).status, 404);
  assert.equal((await fetch(`${base}/api/unknown`)).status, 404);
});
