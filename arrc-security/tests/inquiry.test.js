import test from 'node:test';
import assert from 'node:assert/strict';
import { createInquirySchema, buildEmailDraft, sendInquiry } from '../src/utils/inquiry.js';

const values = {
  fullName: 'Asha Sharma',
  companyName: 'Example Operations',
  email: 'asha@example.com',
  phone: '+91 98765 43210',
  service: 'manned-guarding',
  message: 'We need to discuss security for our office premises.',
  consent: true,
};

test('contact enquiry requires a real contact method, a known service and consent', () => {
  const schema = createInquirySchema();
  assert.equal(schema.safeParse(values).success, true);
  for (const invalid of [
    { email: 'not-an-email' },
    { phone: '123' },
    { phone: 'hello9876543210' },
    { service: 'unknown-service' },
    { consent: false },
    { message: 'short' },
  ])
    assert.equal(schema.safeParse({ ...values, ...invalid }).success, false);
});
test('quote requires property and location, with an optional positive personnel count', () => {
  const schema = createInquirySchema(true);
  const quote = {
    ...values,
    propertyType: 'Corporate Offices',
    location: 'Gurugram',
    personnel: '',
  };
  assert.equal(schema.safeParse(quote).success, true);
  for (const invalid of [
    { propertyType: '' },
    { location: '' },
    { personnel: '-1' },
    { personnel: '1.5' },
    { personnel: '10001' },
  ])
    assert.equal(schema.safeParse({ ...quote, ...invalid }).success, false);
  assert.equal(schema.safeParse({ ...quote, personnel: '12' }).success, true);
});
test('email draft safely encodes the requirements and has no submission side effects', () => {
  const draft = buildEmailDraft({
    ...values,
    message: 'We need access control & security. Please discuss A/B options.',
  });
  const url = new URL(draft.href);
  assert.equal(url.protocol, 'mailto:');
  assert.equal(url.pathname, 'info@arrcss.com');
  assert.match(url.searchParams.get('body'), /access control & security/);
  assert.match(url.searchParams.get('subject'), /Manned Guarding/);
});
test('backend submission confirms success only after an explicit successful JSON response', async () => {
  let request;
  const result = await sendInquiry('/api/enquiry', values, async (url, options) => {
    request = { url, options };
    return { ok: true, json: async () => ({ success: true }) };
  });
  assert.equal(result.success, true);
  assert.equal(request.options.method, 'POST');
  assert.equal(JSON.parse(request.options.body).source, 'arrc-website');
  await assert.rejects(
    sendInquiry('/api/enquiry', values, async () => ({ ok: false })),
    /could not accept/,
  );
  await assert.rejects(
    sendInquiry('/api/enquiry', values, async () => ({
      ok: true,
      json: async () => ({ success: false }),
    })),
    /not confirmed/,
  );
  await assert.rejects(
    sendInquiry('/api/enquiry', values, async () => ({
      ok: true,
      json: async () => {
        throw new SyntaxError('HTML response');
      },
    })),
    /could not confirm/,
  );
});
