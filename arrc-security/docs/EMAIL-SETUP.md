# Form email setup

All enquiries, quote requests and career applications are sent to **info@arcsecuritysolutions.in**. Career applications include the selected resume as an attachment. No external form service is used.

1. Copy `arrc-security/.env.example` to `arrc-security/.env.local`.
2. Enter the SMTP host, username and password supplied by your mail provider. Use the provider's authorized sender address for `SMTP_FROM`. Keep this file private; it is ignored by Git.
3. For port 587, use `SMTP_SECURE=false` (STARTTLS is required). For port 465, use `SMTP_SECURE=true`.
4. Run `npm run dev` locally. For Node.js hosting, run `npm run build` and then `npm start`. The server uses `PORT`, defaulting to 3000. Hosting environment variables may be used instead of `.env.local`.
5. Submit a contact enquiry, a quote and a career application with a test resume. Confirm they arrive in the company inbox and that replying addresses the visitor.

Live delivery requires valid SMTP credentials on the production server. A local `.env.local` does not configure the live host. Without valid credentials, forms show an error and offer an email draft without claiming success. Restart the Node process after changing SMTP settings.

The browser calls `/api/enquiry` for contact and quote forms and `/api/careers` for applications. The same endpoints run in development, preview and the production Node server. Deploying only `dist/` to static hosting does not run these endpoints.

## Fixing the live Apache deployment

On 10 November 2026, `https://arrcss.com/api/enquiry` returned HTTP 200 with the frontend HTML instead of the mail API. Parsing that HTML as JSON can show Safari's “The string did not match the expected pattern” error. Changing SMTP settings alone cannot fix the missing backend routing.

1. Use Node.js 22 or newer. Upload the application source, `server/`, `src/`, `package.json` and `package-lock.json` to a private application directory outside Apache's public document root. The server imports validation and company data from `src/`; upload that directory too. Keep `.env.local` private in this directory, or configure SMTP in the hosting panel environment.
2. In that application directory, run `npm ci`, `npm run build`, and `npm run check:smtp`. The SMTP check tests connection, TLS and authentication without sending a message. Keep `VITE_INQUIRY_ENDPOINT=/api/enquiry` and `VITE_CAREERS_ENDPOINT=/api/careers`. Set `VITE_SITE_URL=https://arrcss.com` before building.
3. Run `npm start` as a persistent service using the host's process manager. For the Apache example, set `HOST=127.0.0.1` and `PORT=3000`. Configure automatic restart and startup after reboot.
4. Have the hosting administrator apply [apache-proxy.conf.example](apache-proxy.conf.example) inside the existing HTTPS virtual host, validate the Apache configuration, then reload it. These directives require server configuration access and do not work in `.htaccess`. The proxy sends both the website and API to the Node server. Keep the existing TLS certificate setup.
5. If using cPanel's Node application manager, register this application with its supported Node startup configuration and map `arrcss.com` to it. The host must support this ES module Node application. If the plan only serves static files, request a Node-capable plan or a separate backend routed under the same domain.
6. Run `npm run check:live-mail`. Both endpoints must return HTTP 405 JSON to this read-only check; HTTP 200 HTML means the SPA fallback still intercepts the API. This check does not send email.
7. Submit a real test enquiry from `https://arrcss.com/contact-us` and confirm receipt in `info@arcsecuritysolutions.in`. SMTP acceptance alone does not guarantee inbox delivery; check spam if necessary.

Keep SMTP variables server-only. Variables starting with `VITE_` are public browser settings. Use HTTPS for the public website. If a trusted reverse proxy terminates HTTPS and overwrites `X-Forwarded-For`, set `TRUST_PROXY=true` so submission limits apply to each visitor. The application holds resumes in memory while emailing them; the SMTP provider and destination mailbox have their own retention settings.
