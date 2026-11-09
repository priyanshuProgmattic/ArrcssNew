import express from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { createInquirySchema, buildEmailDraft } from '../src/utils/inquiry.js';
import { createApplicationSchema, buildApplicationDraft, MAX_RESUME_SIZE } from '../src/utils/application.js';

export function createApp({ transport, from, to, staticDir }) {
  const app = express();
  app.disable('x-powered-by');
  app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false }));
  app.use(express.json({ limit: '32kb' }));
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_RESUME_SIZE, files: 1, fields: 20, fieldSize: 4000 } });
  async function deliver(res, message) {
    try {
      const result = await transport.sendMail({ from, to, ...message });
      if (!result.accepted?.length || result.rejected?.length) throw new Error('SMTP recipient rejected');
      res.json({ success: true });
    } catch (error) {
      console.error('Mail delivery failed:', error.code || error.name);
      res.status(502).json({ success: false, message: 'Email delivery failed. Please try again or contact us directly.' });
    }
  }
  app.post('/api/enquiry', async (req, res) => {
    const isQuote = req.body?.inquiryType === 'quote';
    const parsed = createInquirySchema(isQuote).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Please check your enquiry details.' });
    const draft = buildEmailDraft(parsed.data);
    await deliver(res, { replyTo: parsed.data.email, subject: isQuote ? draft.subject.replace('Website enquiry', 'Quote request') : draft.subject, text: draft.body });
  });
  app.post('/api/careers', upload.single('resume'), async (req, res) => {
    let schema;
    try { schema = createApplicationSchema(req.body.category); }
    catch { return res.status(400).json({ success: false, message: 'Choose a valid application category.' }); }
    const file = req.file;
    const resume = file && { name: file.originalname, type: file.mimetype, size: file.size };
    const parsed = schema.safeParse({ ...req.body, consent: req.body.consent === 'true', resume: [resume] });
    if (!parsed.success) return res.status(400).json({ success: false, message: 'Please check your application and resume.' });
    const draft = buildApplicationDraft(parsed.data, req.body.category);
    await deliver(res, {
      replyTo: parsed.data.email, subject: `Career application — ${parsed.data.designation}`,
      text: draft.body.replace('Resume to attach:', 'Attached resume:'),
      attachments: [{ filename: file.originalname.replace(/[\r\n/\\]/g, '_'), content: file.buffer, contentType: file.mimetype }],
    });
  });
  app.use('/api', (req, res) => res.status(404).json({ success: false, message: 'Unknown API route.' }));
  if (staticDir) {
    app.use(express.static(staticDir));
    app.get('/{*path}', (req, res) => res.sendFile(`${staticDir}/index.html`));
  }
  app.use((error, req, res, next) => {
    res.status(error instanceof multer.MulterError || error.status === 413 ? 413 : 400)
      .json({ success: false, message: error.code === 'LIMIT_FILE_SIZE' ? 'Your resume must be 5 MB or smaller.' : 'Invalid request. Please check your details.' });
  });
  return app;
}
