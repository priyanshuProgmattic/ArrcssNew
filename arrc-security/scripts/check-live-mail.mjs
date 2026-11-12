const origin = process.argv[2] || 'https://arrcss.com';
let failed = false;
for (const path of ['/api/enquiry', '/api/careers']) {
  try {
    // GET cannot send mail. The real API must reject it with JSON and HTTP 405.
    const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(15000) });
    if (
      response.status !== 405 ||
      !response.headers.get('content-type')?.includes('application/json')
    )
      throw new Error(
        `Expected HTTP 405 JSON; received HTTP ${response.status} ${response.headers.get('content-type')}`,
      );
    const result = await response.json();
    if (result.success !== false) throw new Error('Unexpected API response');
    console.log(`${path}: mail backend reachable`);
  } catch (error) {
    failed = true;
    console.error(`${path}: ${error.message}`);
  }
}
process.exitCode = failed ? 1 : 0;
