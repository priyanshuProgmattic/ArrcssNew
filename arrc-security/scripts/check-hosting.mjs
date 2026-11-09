const origin = new URL(process.argv[2] || 'https://arrcss.com').origin;
let failed = false;

console.log(`Checking form API routing at ${origin} (no emails will be sent).`);
for (const endpoint of ['/api/enquiry', '/api/careers']) {
  try {
    const response = await fetch(`${origin}${endpoint}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(15000),
    });
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      failed = true;
      console.error(
        `FAIL ${endpoint}: HTTP ${response.status}, ${contentType || 'no content type'}.`,
      );
      console.error(
        'The request did not reach the form API. Route /api/* to the backend before the website fallback.',
      );
      continue;
    }
    const result = await response.json();
    if (response.status !== 405 || result.success !== false) {
      failed = true;
      console.error(
        `FAIL ${endpoint}: expected the form API to reject GET with HTTP 405 and success:false; received HTTP ${response.status}.`,
      );
      continue;
    }
    console.log(`PASS ${endpoint}: the form backend is reachable and returns JSON.`);
  } catch (error) {
    failed = true;
    console.error(
      `FAIL ${endpoint}: ${error.cause?.code || error.name}. Check the hosting route and whether the backend is running.`,
    );
  }
}
if (failed) {
  console.error('Hosting is not ready for form submissions. See docs/HOSTING.md.');
  process.exitCode = 1;
} else {
  console.log('API routing passed. Verify SMTP on the server with npm run email:check.');
}
