import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

export const root = fileURLToPath(new URL('../', import.meta.url));
dotenv.config({ path: `${root}.env.local`, quiet: true });

export function smtpOptions(env = process.env) {
  for (const key of ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM', 'SMTP_TO']) {
    if (!env[key]?.trim()) throw new Error(`Missing ${key} in .env.local`);
  }
  const port = Number(env.SMTP_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid SMTP_PORT');
  return {
    host: env.SMTP_HOST.trim(), port,
    secure: env.SMTP_SECURE === 'true' || (env.SMTP_SECURE === undefined && port === 465),
    requireTLS: port !== 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 20000,
  };
}
