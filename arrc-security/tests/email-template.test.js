import test from 'node:test';
import assert from 'node:assert/strict';
import { renderEmail } from '../server/email-template.js';

test('HTML emails escape visitor content, preserve line breaks and omit blank fields', () => {
  const html = renderEmail({ title: 'New quote request', intro: 'Requirements received', fields: [['Name', '<script>alert(1)</script>'], ['Empty', '']], message: 'First line\nSecond & final line' });
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>|>Empty</);
  assert.match(html, /First line<br>Second &amp; final line/);
  assert.match(html, /New quote request/);
});

test('career emails show an escaped attachment filename', () => {
  const html = renderEmail({ title: 'New career application', intro: 'Application received', fields: [['Position', 'HR']], resumeName: '<cv>.pdf' });
  assert.match(html, /Resume attached/);
  assert.match(html, /&lt;cv&gt;.pdf/);
  assert.doesNotMatch(html, /<h2[^>]*>Requirements/);
});
