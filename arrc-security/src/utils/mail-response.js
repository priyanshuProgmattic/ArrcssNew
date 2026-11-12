// Static SPA hosting can return index.html with HTTP 200 for missing API routes.
// Never treat that as delivery, or expose a browser-specific JSON parser error.
export async function readMailResponse(response) {
  const contentType = response.headers?.get('content-type');
  if (contentType && !/^application\/json\b/i.test(contentType))
    throw new Error('The email service is unavailable. Please contact us by phone or email.');
  try {
    return await response.json();
  } catch {
    throw new Error(
      'We could not confirm delivery. Please try again or contact us by phone or email.',
    );
  }
}
