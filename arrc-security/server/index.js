import nodemailer from 'nodemailer';
import { root, smtpOptions } from './config.js';
import { createApp } from './app.js';

const transport = nodemailer.createTransport(smtpOptions());
const app = createApp({ transport, from: process.env.SMTP_FROM, to: process.env.SMTP_TO, staticDir: `${root}dist` });
const port = Number(process.env.PORT || 3000);
app.listen(port, process.env.HOST || '127.0.0.1', () => console.log(`ARRC mail server listening on port ${port}`));
