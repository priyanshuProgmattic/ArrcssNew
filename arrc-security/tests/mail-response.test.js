import test from 'node:test';
import assert from 'node:assert/strict';
import { readMailResponse } from '../src/utils/mail-response.js';

test('Apache SPA fallback HTML never confirms delivery', async () => {
  await assert.rejects(
    readMailResponse(
      new Response('<!doctype html><html></html>', {
        headers: { 'Content-Type': 'text/html; charset=UTF-8' },
      }),
    ),
    /email service is unavailable/,
  );
});

test('Safari JSON parsing errors are replaced with a useful delivery error', async () => {
  await assert.rejects(
    readMailResponse({
      json: async () => {
        throw new DOMException('The string did not match the expected pattern.', 'SyntaxError');
      },
    }),
    /could not confirm delivery/,
  );
});

test('valid JSON delivery confirmation is preserved', async () => {
  assert.deepEqual(await readMailResponse(Response.json({ success: true })), { success: true });
});
