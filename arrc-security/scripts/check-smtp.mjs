import { fileURLToPath } from 'node:url';
import { createSmtpTransport } from '../server/api.js';

try {
  process.loadEnvFile(fileURLToPath(new URL('../.env.local', import.meta.url)));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const transport = createSmtpTransport();
if (!transport) {
  console.error('Set SMTP_HOST, SMTP_USER and SMTP_PASS on the server.');
  process.exitCode = 1;
} else {
  try {
    await transport.verify();
    console.log('SMTP connection, TLS and authentication succeeded. No email was sent.');
  } catch (error) {
    // Do not print provider responses or credentials.
    console.error(
      `SMTP verification failed (${error.code || 'SMTP_ERROR'}). Check provider settings and outbound SMTP access.`,
    );
    process.exitCode = 1;
  } finally {
    transport.close();
  }
}
