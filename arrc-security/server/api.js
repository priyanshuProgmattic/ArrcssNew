import nodemailer from 'nodemailer';
import { company } from '../src/data/company.js';
import { careerCategories } from '../src/data/careers.js';
import { buildEmailDraft, createInquirySchema } from '../src/utils/inquiry.js';
import {
  MAX_RESUME_SIZE,
  buildApplicationDraft,
  createApplicationSchema,
} from '../src/utils/application.js';

class RequestError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function createSmtpTransport(env = process.env) {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) return null;
  const port = Number(env.SMTP_PORT || 587);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error('SMTP_PORT must be a valid port number.');
  const secure = env.SMTP_SECURE ? env.SMTP_SECURE === 'true' : port === 465;
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port,
    secure,
    requireTLS: !secure,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
}

function respond(res, status, message) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(JSON.stringify({ success: status === 200, message }));
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        chunks.length = 0;
        reject(new RequestError(413, 'This submission is too large.'));
      } else {
        chunks.push(chunk);
      }
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
    req.on('aborted', () => reject(new RequestError(400, 'The upload was interrupted.')));
  });
}

async function inquiryMessage(req) {
  if (!req.headers['content-type']?.toLowerCase().startsWith('application/json'))
    throw new RequestError(415, 'Submit enquiries as JSON.');
  let data;
  try {
    data = JSON.parse((await readBody(req, 64 * 1024)).toString('utf8'));
  } catch (error) {
    if (error instanceof RequestError) throw error;
    throw new RequestError(400, 'The enquiry could not be read.');
  }
  if (!data || typeof data !== 'object' || Array.isArray(data))
    throw new RequestError(400, 'Submit a valid enquiry.');
  if (data.formType && !['contact', 'quote'].includes(data.formType))
    throw new RequestError(422, 'Choose a valid enquiry type.');
  const parsed = createInquirySchema(data.formType === 'quote').safeParse(data);
  if (!parsed.success) throw new RequestError(422, parsed.error.issues[0].message);
  const draft = buildEmailDraft(parsed.data);
  return { replyTo: parsed.data.email, subject: draft.subject, text: draft.body };
}

async function applicationMessage(req) {
  const contentType = req.headers['content-type'];
  if (!contentType?.toLowerCase().startsWith('multipart/form-data;'))
    throw new RequestError(415, 'Submit applications with a resume attachment.');
  const body = await readBody(req, MAX_RESUME_SIZE + 64 * 1024);
  let form;
  try {
    form = await new Request('http://localhost/api/careers', {
      method: 'POST',
      headers: { 'Content-Type': contentType },
      body,
    }).formData();
  } catch {
    throw new RequestError(400, 'The application could not be read.');
  }
  const category = form.get('category');
  if (!careerCategories.some((item) => item.id === category))
    throw new RequestError(422, 'Choose a valid application category.');
  const resume = form.get('resume');
  if (form.getAll('resume').length !== 1 || typeof resume?.arrayBuffer !== 'function')
    throw new RequestError(422, 'Choose one PDF, DOC or DOCX resume.');
  const parsed = createApplicationSchema(category).safeParse({
    ...Object.fromEntries(form),
    resume: [resume],
    consent: form.get('consent') === 'true',
  });
  if (!parsed.success) throw new RequestError(422, parsed.error.issues[0].message);
  const draft = buildApplicationDraft(parsed.data, category);
  return {
    replyTo: parsed.data.email,
    subject: draft.subject,
    text: draft.body.replace('Resume to attach:', 'Resume attached:'),
    attachments: [
      {
        filename: resume.name.replace(/[\\/:\x00-\x1f\x7f]/g, '_').slice(-180),
        content: Buffer.from(await resume.arrayBuffer()),
        contentType: resume.type || 'application/octet-stream',
      },
    ],
  };
}

export function createApiHandler({
  env = process.env,
  transport = createSmtpTransport(env),
  logger = console,
  now = Date.now,
} = {}) {
  const attempts = new Map();
  const windowMs = 15 * 60 * 1000;
  return async (req, res, next) => {
    try {
      let pathname;
      try {
        pathname = new URL(req.url, 'http://localhost').pathname;
      } catch {
        throw new RequestError(400, 'Invalid request URL.');
      }
      if (!pathname.startsWith('/api/')) return next?.();
      if (!['/api/enquiry', '/api/careers'].includes(pathname))
        throw new RequestError(404, 'This endpoint does not exist.');
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        throw new RequestError(405, 'Use POST to submit a form.');
      }
      const origin = req.headers.origin;
      const siteUrl = (env.SITE_URL || env.VITE_SITE_URL || '').replace(/\/$/, '');
      if (origin && origin !== siteUrl) {
        let originHost;
        try {
          originHost = new URL(origin).host;
        } catch {
          throw new RequestError(403, 'Submit this form from our website.');
        }
        if (originHost !== req.headers.host)
          throw new RequestError(403, 'Submit this form from our website.');
      }
      const timestamp = now();
      for (const [key, attempt] of attempts) {
        if (attempt.expires <= timestamp) attempts.delete(key);
      }
      const ip =
        (env.TRUST_PROXY === 'true' && req.headers['x-forwarded-for']?.split(',')[0].trim()) ||
        req.socket.remoteAddress;
      const attempt = attempts.get(ip) || { count: 0, expires: timestamp + windowMs };
      attempt.count += 1;
      attempts.set(ip, attempt);
      if (attempt.count > 10) {
        res.setHeader('Retry-After', String(Math.ceil((attempt.expires - timestamp) / 1000)));
        throw new RequestError(429, 'Too many submissions. Please try again later or email us.');
      }
      if (!transport)
        throw new RequestError(503, `Email is unavailable. Please write to ${company.email}.`);
      const message = await (pathname === '/api/careers'
        ? applicationMessage(req)
        : inquiryMessage(req));
      const result = await transport.sendMail({
        ...message,
        from: { name: 'ARRC website', address: env.SMTP_FROM || company.email },
        to: company.email,
        disableFileAccess: true,
        disableUrlAccess: true,
      });
      if (
        !result.accepted?.some((address) => address.toLowerCase() === company.email.toLowerCase())
      )
        throw new Error('The mail server did not accept the recipient.');
      respond(res, 200, 'Your message was accepted by our mail server.');
    } catch (error) {
      if (error instanceof RequestError) {
        respond(res, error.status, error.message);
      } else {
        logger.error(`Website mail delivery failed (${error.code || 'SMTP_ERROR'}).`);
        respond(res, 502, `Your message could not be sent. Please write to ${company.email}.`);
      }
    }
  };
}
