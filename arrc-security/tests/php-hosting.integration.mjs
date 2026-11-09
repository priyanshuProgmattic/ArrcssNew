import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { createServer as createNetServer } from 'node:net';
import { createServer as createTlsServer } from 'node:tls';
import { spawn, execFileSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { prepareSharedHosting, projectRoot } from '../scripts/shared-hosting-files.mjs';

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

function applicationForm(overrides = {}, filename = 'resume.pdf') {
  const form = new FormData();
  for (const [key, value] of Object.entries({
    category: 'indirect',
    designation: 'HR',
    fullName: enquiry.fullName,
    email: enquiry.email,
    phone: enquiry.phone,
    consent: 'true',
    ...overrides,
  }))
    form.set(key, value);
  form.set('resume', new File(['%PDF-1.4 test resume'], filename, { type: 'application/pdf' }));
  return form;
}

test(
  'shared-hosting package routes through Apache and PHP, delivers every form over TLS SMTP, and rejects unsafe submissions',
  { timeout: 90000 },
  async (context) => {
    const apache = process.env.APACHE_BIN || 'C:/xampp/apache/bin/httpd.exe';
    const phpModule = process.env.PHP_APACHE_MODULE || 'C:/xampp/php/php8apache2_4.dll';
    assert.ok(
      existsSync(apache),
      'Set APACHE_BIN to an Apache installation for this integration test.',
    );
    assert.ok(existsSync(phpModule), 'Set PHP_APACHE_MODULE to the PHP Apache module.');
    const toolsDir = resolve(projectRoot, '.tools');
    await mkdir(toolsDir, { recursive: true });
    const stage = await mkdtemp(resolve(toolsDir, 'php-integration-'));
    const { publicDir, privateDir } = await prepareSharedHosting(stage, { includeWebsite: false });
    await writeFile(
      resolve(publicDir, 'index.html'),
      '<!doctype html><title>ARRC integration fixture</title>',
    );
    const keyPath = resolve(stage, 'smtp.key');
    const certPath = resolve(stage, 'smtp.crt');
    execFileSync(
      'C:/xampp/apache/bin/openssl.exe',
      [
        'req',
        '-x509',
        '-newkey',
        'rsa:2048',
        '-nodes',
        '-keyout',
        keyPath,
        '-out',
        certPath,
        '-days',
        '2',
        '-subj',
        '/CN=localhost',
        '-addext',
        'subjectAltName=DNS:localhost,IP:127.0.0.1',
        '-config',
        'C:/xampp/apache/conf/openssl.cnf',
      ],
      { stdio: 'ignore', windowsHide: true },
    );

    const messages = [];
    const recipients = [];
    const sockets = new Set();
    let rejectRecipient = false;
    const smtp = createTlsServer(
      { key: readFileSync(keyPath), cert: readFileSync(certPath) },
      (socket) => {
        sockets.add(socket);
        socket.on('close', () => sockets.delete(socket));
        socket.write('220 local-test ESMTP\r\n');
        let pending = '';
        let dataMode = false;
        let authStep = 0;
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
            } else if (/^EHLO|^HELO/.test(line))
              socket.write('250-local-test\r\n250 AUTH LOGIN PLAIN\r\n');
            else if (/^AUTH PLAIN/.test(line)) socket.write('235 Authenticated\r\n');
            else if (line === 'AUTH LOGIN') {
              authStep = 1;
              socket.write('334 VXNlcm5hbWU6\r\n');
            } else if (authStep === 1) {
              authStep = 2;
              socket.write('334 UGFzc3dvcmQ6\r\n');
            } else if (authStep === 2) {
              authStep = 0;
              socket.write('235 Authenticated\r\n');
            } else if (/^RCPT TO:/.test(line)) {
              recipients.push(line);
              socket.write(
                rejectRecipient ? '550 Recipient rejected\r\n' : '250 Recipient accepted\r\n',
              );
            } else if (line === 'DATA') {
              dataMode = true;
              socket.write('354 Send message\r\n');
            } else if (line === 'QUIT') socket.end('221 Goodbye\r\n');
            else socket.write('250 OK\r\n');
          }
        });
      },
    );
    await new Promise((resolve) => smtp.listen(0, '127.0.0.1', resolve));
    context.after(async () => {
      for (const socket of sockets) socket.destroy();
      await new Promise((resolve) => smtp.close(resolve));
    });
    const fakeConfig = [
      'SMTP_HOST=127.0.0.1',
      `SMTP_PORT=${smtp.address().port}`,
      'SMTP_SECURE=true',
      'SMTP_USER=website@example.com',
      'SMTP_PASS=fixture-password',
      'SMTP_FROM=website@example.com',
      'SMTP_TO=info@arcsecuritysolutions.in',
      '',
    ].join('\n');
    await writeFile(resolve(privateDir, '.env'), fakeConfig);
    const reservation = createNetServer();
    await new Promise((resolve) => reservation.listen(0, '127.0.0.1', resolve));
    const port = reservation.address().port;
    await new Promise((resolve) => reservation.close(resolve));
    const apacheRoot = resolve(dirname(apache), '..');
    const posix = (path) => path.replaceAll('\\', '/');
    const config = resolve(stage, 'apache.conf');
    const errorLog = resolve(stage, 'apache-error.log');
    await writeFile(
      config,
      [
        `ServerRoot "${posix(apacheRoot)}"`,
        `Listen 127.0.0.1:${port}`,
        'ServerName 127.0.0.1',
        `PidFile "${posix(resolve(stage, 'apache.pid'))}"`,
        `ErrorLog "${posix(errorLog)}"`,
        'LogLevel warn',
        ...['authz_core', 'authz_host', 'dir', 'mime', 'rewrite'].map(
          (name) => `LoadModule ${name}_module modules/mod_${name}.so`,
        ),
        `LoadModule php_module "${posix(phpModule)}"`,
        `PHPIniDir "${posix(dirname(phpModule))}"`,
        `php_value openssl.cafile "${posix(certPath)}"`,
        'php_flag display_errors Off',
        'TypesConfig conf/mime.types',
        `DocumentRoot "${posix(publicDir)}"`,
        `<Directory "${posix(publicDir)}">`,
        'Options FollowSymLinks',
        'AllowOverride All',
        'Require all granted',
        '</Directory>',
        '<FilesMatch "\\.php$">',
        'SetHandler application/x-httpd-php',
        '</FilesMatch>',
        '',
      ].join('\n'),
    );
    const childEnv = Object.fromEntries(
      Object.entries(process.env).filter(([key]) => !/^(SMTP_|SITE_URL$|TRUST_PROXY$)/i.test(key)),
    );
    execFileSync(apache, ['-t', '-f', posix(config)], {
      env: childEnv,
      windowsHide: true,
      stdio: 'pipe',
    });
    const apacheProcess = spawn(apache, ['-X', '-f', posix(config)], {
      env: childEnv,
      windowsHide: true,
      stdio: 'pipe',
    });
    let stderr = '';
    apacheProcess.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    context.after(async () => {
      if (apacheProcess.exitCode === null) {
        const exit = new Promise((resolve) => apacheProcess.once('exit', resolve));
        apacheProcess.kill();
        await exit;
      }
    });
    const base = `http://127.0.0.1:${port}`;
    let ready = false;
    for (let attempt = 0; attempt < 50; attempt++) {
      if (apacheProcess.exitCode !== null) break;
      try {
        const response = await fetch(`${base}/api/enquiry`, { signal: AbortSignal.timeout(500) });
        if (response.status === 405) {
          ready = true;
          break;
        }
      } catch {
        /* Wait for Apache to start. */
      }
      await delay(100);
    }
    if (!ready)
      throw new Error(
        `Apache PHP fixture failed: ${stderr}\n${await readFile(errorLog, 'utf8').catch(() => '')}`,
      );
    const post = (values = enquiry) =>
      fetch(`${base}/api/enquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Origin: base },
        body: JSON.stringify(values),
      });
    assert.equal((await fetch(`${base}/contact-us`)).status, 200);
    for (const endpoint of ['/api/enquiry', '/api/careers']) {
      const response = await fetch(`${base}${endpoint}`);
      assert.equal(response.status, 405);
      assert.match(response.headers.get('content-type'), /application\/json/);
    }
    assert.equal((await fetch(`${base}/api/unknown`)).status, 404);
    for (const path of ['/.env.local', '/arrc-mail/.env', '/server/api.js']) {
      assert.equal((await fetch(`${base}${path}`)).status, 403);
    }
    for (const values of [
      { ...enquiry, to: 'untrusted@example.com' },
      {
        ...enquiry,
        formType: 'quote',
        propertyType: 'Corporate Offices',
        location: 'Gurugram',
        personnel: '8',
      },
    ]) {
      const response = await post(values);
      assert.equal(response.status, 200, await response.clone().text());
      assert.equal((await response.json()).success, true);
    }
    for (const values of [{}, { category: 'direct', designation: 'Security Guards' }]) {
      const response = await fetch(`${base}/api/careers`, {
        method: 'POST',
        body: applicationForm(values),
        headers: { Origin: base },
      });
      assert.equal(response.status, 200, await response.clone().text());
    }
    assert.equal(messages.length, 4);
    assert.deepEqual(recipients, Array(4).fill('RCPT TO:<info@arcsecuritysolutions.in>'));
    for (const message of messages) {
      assert.match(message, /From: ARRC website <website@example.com>/);
      assert.match(message, /Reply-To: asha@example.com/);
      assert.match(message, /To: info@arcsecuritysolutions.in/);
    }
    assert.match(messages[1], /Personnel required: 8/);
    for (const message of messages.slice(2)) {
      assert.match(message, /Content-Disposition: attachment; filename="?resume.pdf/);
      assert.match(message, /Resume attached: resume.pdf/);
      assert.match(message, /JVBERi0xLjQgdGVzdCByZXN1bWU=/);
    }
    const foreign = await fetch(`${base}/api/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://other.example.com' },
      body: JSON.stringify(enquiry),
    });
    assert.equal(foreign.status, 403);
    assert.equal(
      (
        await fetch(`${base}/api/careers`, {
          method: 'POST',
          body: applicationForm({ designation: 'Security Guards' }),
        })
      ).status,
      422,
    );
    assert.equal((await post({ ...enquiry, consent: false })).status, 422);
    assert.equal(
      (
        await fetch(`${base}/api/careers`, {
          method: 'POST',
          body: applicationForm({}, 'resume.exe'),
        })
      ).status,
      422,
    );
    await writeFile(
      resolve(privateDir, '.env'),
      fakeConfig.replace('SMTP_PASS=fixture-password', 'SMTP_PASS='),
    );
    const unavailable = await post();
    assert.equal(unavailable.status, 503);
    assert.equal((await unavailable.json()).recipient, 'info@arcsecuritysolutions.in');
    await writeFile(resolve(privateDir, '.env'), fakeConfig);
    rejectRecipient = true;
    const rejected = await post();
    assert.equal(rejected.status, 502);
    assert.equal((await rejected.json()).success, false);
    rejectRecipient = false;
    assert.equal(
      (
        await fetch(`${base}/api/enquiry`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{bad',
        })
      ).status,
      400,
    );
    const limited = await post();
    assert.equal(limited.status, 429);
    assert.ok(Number(limited.headers.get('retry-after')) > 0);
    assert.equal(messages.length, 4, 'Rejected requests must never send mail.');
  },
);
