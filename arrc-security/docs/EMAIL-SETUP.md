# Form email setup

All enquiries, quote requests and career applications are sent to **info@arcsecuritysolutions.in**. Career applications include the selected resume as an attachment. No external form service is used.

1. Copy `arrc-security/.env.example` to `arrc-security/.env.local`.
2. Enter the SMTP host, username and password supplied by your mail provider. Use the provider's authorized sender address for `SMTP_FROM`. Keep this file private; it is ignored by Git.
3. For port 587, use `SMTP_SECURE=false` (STARTTLS is required). For port 465, use `SMTP_SECURE=true`.
4. Run `npm run dev` locally. For Node.js hosting, run `npm run build` and then `npm start`. The server uses `PORT`, defaulting to 3000. Hosting environment variables may be used instead of `.env.local`.
5. Submit a contact enquiry, a quote and a career application with a test resume. Confirm they arrive in the company inbox and that replying addresses the visitor.

SMTP credentials have not been supplied, so live delivery requires step 2. Without valid credentials, forms show an error and offer an email draft without claiming success. Restart the Node process after changing SMTP settings.

The browser calls `/api/enquiry` for contact and quote forms and `/api/careers` for applications. The same endpoints run in development, preview and the production Node server. Deploying only `dist/` to static hosting does not run these endpoints.

Keep SMTP variables server-only. Variables starting with `VITE_` are public browser settings. Use HTTPS for the public website. If a trusted reverse proxy terminates HTTPS and overwrites `X-Forwarded-For`, set `TRUST_PROXY=true` so submission limits apply to each visitor. The application holds resumes in memory while emailing them; the SMTP provider and destination mailbox have their own retention settings.
