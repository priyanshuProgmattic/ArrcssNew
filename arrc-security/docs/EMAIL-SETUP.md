# Form email setup

All enquiries, quote requests and career applications are sent to **info@arcsecuritysolutions.in**. The local and example configurations both use this company inbox. The server-only `SMTP_TO` setting overrides the recipient for every form when testing. Career applications include the selected resume as an attachment. No external form service is used.

**For arrcss.com's shared PHP hosting:** deploy the package described in [HOSTING.md](HOSTING.md), then upload the configured `.env.local` privately as `arrc-mail/.env` beside `public_html`. The Node commands below apply to local development and Node hosting; uploading `dist/` alone does not deploy a mail backend on PHP hosting.

1. Use `arrc-security/.env.local` (copy `.env.example` only if it does not already exist). Gmail is configured as the sender with `SMTP_HOST=smtp.gmail.com`. Set `SMTP_USER` and `SMTP_FROM` to the Gmail account that supplied the app password; `SMTP_TO` is the destination and can be a different address.
2. Enable [Google 2-Step Verification and create an app password](https://support.google.com/mail/answer/185833). Paste that app password into `SMTP_PASS` in `.env.local`. Do not use your normal Google password or put the app password in `.env.example`. Spaces in Google's displayed app password are handled automatically. Keep `.env.local` private; it is ignored by Git. For another mail provider, replace the host, username, password and authorized sender with that provider's settings.
3. For port 587, use `SMTP_SECURE=false` (STARTTLS is required). For port 465, use `SMTP_SECURE=true`.
4. Run `npm run dev` locally. For Node.js hosting, run `npm run build` and then `npm start`. The server uses `PORT`, defaulting to 3000. Hosting environment variables may be used instead of `.env.local`.
5. Run `npm run email:check` to verify the connection and authentication. Then run `npm run email:test` to send four real submissions through the backend: contact, quote, direct staff and indirect staff. Both career submissions include a test resume. Confirm all four arrive in the `SMTP_TO` inbox, including Spam. Then submit through the website with your own details and confirm that replying addresses the visitor.

Live delivery requires the app password from step 2. Without valid credentials, forms show the server's error, keep the entered details and offer an email draft addressed to the configured inbox. Restart the Node process after changing SMTP settings. Vite also uses `SMTP_TO` for the browser's fallback links; rebuild before deploying a changed recipient.

The browser calls `/api/enquiry` for contact and quote forms and `/api/careers` for applications. The same endpoints run in development, preview and the production Node server. Deploying only `dist/` to static hosting does not run these endpoints.

Keep SMTP variables server-only. Variables starting with `VITE_` are public browser settings. Use HTTPS for the public website. If a trusted reverse proxy terminates HTTPS and overwrites `X-Forwarded-For`, set `TRUST_PROXY=true` so submission limits apply to each visitor. The application holds resumes in memory while emailing them; the SMTP provider and destination mailbox have their own retention settings.
