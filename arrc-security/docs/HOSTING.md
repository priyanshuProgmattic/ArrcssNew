# Hosting the website and form backend

The website needs two parts: the built React pages in `dist/`, and a running server that handles `/api/enquiry` and `/api/careers` and sends mail. Uploading only `dist/` publishes the pages but does not start the Node.js email server. A domain name does not run that server.

## Shared PHP hosting: arrcss.com

Use `arrc-shared-hosting.zip`, built with `npm run build:shared`. It includes the React site, PHP endpoints, Apache routing, PHPMailer and the generated service/job catalogue. Node.js and Composer are not needed on the hosting server.

1. In your hosting panel, select PHP 8.1 or newer with OpenSSL and Fileinfo enabled. PHP must allow uploads of at least 5 MB and POST requests of at least 8 MB; the included `.user.ini` supplies those limits where supported.
2. Back up the existing site's `.htaccess`. Extract the ZIP in the directory **containing** the domain's `public_html`, so its `public_html` files merge into the website and `arrc-mail` is beside it. Do not put the whole package or `arrc-mail` inside `public_html`. Keep any hosting-generated PHP handler/HTTPS directives from your old `.htaccess`; the packaged API rules must appear before any React catch-all rule.
3. Upload the already configured local `.env.local` into the server's **private `arrc-mail` folder**, and rename it to `.env`. Do not put credentials in `public_html`. The ZIP deliberately excludes the app password. Alternatively, copy `arrc-mail/.env.example` to `arrc-mail/.env` there and enter the SMTP settings privately. Keep `SMTP_TO=info@arcsecuritysolutions.in`; `SMTP_USER` and `SMTP_FROM` must remain the Gmail account supplying the app password. Set `SITE_URL=https://arrcss.com`.
4. Open `https://arrcss.com/api/enquiry` and `https://arrcss.com/api/careers`. Each should return JSON saying "Use POST to submit a form" with HTTP 405. Run `npm run hosting:check -- https://arrcss.com` locally to check both routes without sending emails.
5. Submit a contact enquiry, a quote and both career forms. Confirm delivery to `info@arcsecuritysolutions.in`, with resumes attached to career emails.

The final layout must be:

```text
directory containing the domain's public_html/
  public_html/
    .htaccess
    .user.ini
    index.html
    assets/
    api/index.php
  arrc-mail/
    .env                 <- upload privately from your existing .env.local
    .htaccess
    bootstrap.php
    form-data.json
    vendor/
```

The PHP entry point intentionally loads `arrc-mail` from **beside** its document root. If your host uses a differently named document root, put `arrc-mail` beside that root. The PHP worker must be able to create `arrc-mail/runtime` for submission limits. The backend validates requests and uploads, fixes the recipient on the server, limits submissions and confirms success only after SMTP accepts the message. Resumes use PHP's temporary upload files and are not saved to the public website.

If the routes return JSON but a valid form returns HTTP 502, check the hosting PHP error log and ask the provider whether outbound SMTP to `smtp.gmail.com:587` is allowed. If the provider requires port 465 instead, set `SMTP_PORT=465` and `SMTP_SECURE=true` in the private `.env`. Missing SMTP settings return HTTP 503. The Gmail password must be the app password for the configured sender account.

## Why the original deployment failed

On the original `dist`-only Apache deployment, both form endpoints returned HTTP 200 with `Content-Type: text/html` and the React `index.html` page. The contact form expects JSON from the email server, so parsing the page fails and displays "We could not confirm delivery." This response happens before an SMTP connection or email delivery attempt. The shared-hosting package routes `/api/*` to PHP before falling back to the React page.

See the official [Apache rewrite documentation](https://httpd.apache.org/docs/2.4/mod/mod_rewrite.html) and [PHPMailer documentation](https://github.com/PHPMailer/PHPMailer).

## Node.js hosting

Deploy the complete application, including `package.json`, `package-lock.json`, `server/`, `src/` and the production `dist/`. Keep `.env.local` private on the server, outside the public document root, or configure the same SMTP variables in the hosting control panel. Do not upload the application source or `.env.local` into a public static directory.

From the application directory, install dependencies with `npm ci`, build with `npm run build`, and start the backend with `npm start`. Use the host's Node.js application manager or process manager to keep it running. The process listens on `PORT`, defaulting to 3000.

Set `VITE_SITE_URL=https://arrcss.com` before the build. Configure `SITE_URL=https://arrcss.com` and `SMTP_TO=info@arcsecuritysolutions.in` in the runtime environment. Use the existing authorized Gmail sender and app password for the SMTP variables.

If Apache serves the React files, its administrator must proxy `/api/` to the Node process **before** any rule that rewrites page URLs to `index.html`. An example inside the existing HTTPS virtual host is:

```apache
ProxyPreserveHost On
ProxyPass        /api/ http://127.0.0.1:3000/api/
ProxyPassReverse /api/ http://127.0.0.1:3000/api/
```

These directives need Apache proxy modules and server or hosting-panel configuration. A React rewrite rule alone cannot run Node.js. If the hosting panel instead maps the whole domain to the Node application, `npm start` already serves both the built website and the API; a separate React rewrite rule is unnecessary.

## Static hosting without PHP or Node.js

Neither the Node nor PHP backend runs on a static-only hosting plan. Such a plan requires a separately hosted API with an appropriate domain route. Uploading `server/api.js` beside `index.html` does not execute it.

## Verify after deployment

Run `npm run hosting:check -- https://arrcss.com`. This only makes GET requests and never sends emails. Each form endpoint should return HTTP 405 with JSON because forms use POST. Returning the React HTML page means the API route is still misconfigured.

On a Node.js backend server, run `npm run email:check` to verify SMTP authentication. On PHP hosting, use the shared-hosting steps above. Then submit the contact, quote and both career forms and confirm delivery to `info@arcsecuritysolutions.in`. Career emails must include the selected resume attachment.
