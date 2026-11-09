import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createApplicationSchema,
  validateResume,
  buildApplicationDraft,
  sendApplication,
  MAX_RESUME_SIZE,
} from '../src/utils/application.js';

const resume = new File(['A sample PDF document'], 'asha-resume.pdf', { type: 'application/pdf' });
const application = {
  designation: 'Security Guards',
  fullName: 'Asha Sharma',
  email: 'asha@example.com',
  phone: '+91 98765 43210',
  address: '',
  currentLocation: 'Gurugram',
  experience: '2 years',
  lastSalary: '',
  lastPost: '',
  resume: [resume],
  consent: true,
};

test('application categories accept only their own roles', () => {
  assert.equal(createApplicationSchema('direct').safeParse(application).success, true);
  assert.equal(createApplicationSchema('indirect').safeParse(application).success, false);
  assert.equal(
    createApplicationSchema('indirect').safeParse({ ...application, designation: 'HR' }).success,
    true,
  );
  assert.equal(
    createApplicationSchema('direct').safeParse({ ...application, consent: false }).success,
    false,
  );
});
test('resume validation rejects missing, empty, oversized and disallowed files', () => {
  assert.match(validateResume(undefined), /Choose/);
  assert.match(validateResume({ name: 'cv.pdf', type: 'application/pdf', size: 0 }), /empty/);
  assert.match(
    validateResume({ name: 'cv.pdf', type: 'application/pdf', size: MAX_RESUME_SIZE + 1 }),
    /5 MB/,
  );
  assert.match(
    validateResume({ name: 'cv.exe', type: 'application/octet-stream', size: 500 }),
    /PDF, DOC or DOCX/,
  );
  assert.match(
    validateResume({ name: 'cv.pdf', type: 'text/javascript', size: 500 }),
    /PDF, DOC or DOCX/,
  );
  assert.equal(validateResume(resume), null);
});
test('email application preserves details and requires the applicant to attach the selected resume', () => {
  const draft = buildApplicationDraft(application, 'direct');
  const url = new URL(draft.href);
  assert.equal(url.protocol, 'mailto:');
  assert.equal(url.pathname, 'info@arcsecuritysolutions.in');
  assert.match(url.searchParams.get('body'), /Resume to attach: asha-resume.pdf/);
  assert.match(url.searchParams.get('subject'), /Security Guards/);
});
test('direct application submission includes the resume and waits for confirmation', async () => {
  let request;
  await sendApplication('/api/careers', application, 'direct', async (url, options) => {
    request = options;
    return { ok: true, json: async () => ({ success: true }) };
  });
  assert.equal(request.body.get('resume').name, 'asha-resume.pdf');
  assert.equal(request.body.get('category'), 'direct');
  assert.equal(request.headers['Content-Type'], undefined);
  await assert.rejects(
    sendApplication('/api/careers', application, 'direct', async () => ({ ok: false })),
    /could not be accepted/,
  );
  await assert.rejects(
    sendApplication('/api/careers', application, 'direct', async () => ({
      ok: true,
      json: async () => ({ success: false }),
    })),
    /not confirmed/,
  );
});

test('career delivery errors preserve the server message and the configured fallback inbox', async () => {
  const recipient = 'priyanshukashyap844@gmail.com';
  const message = `Your message could not be sent. Please email ${recipient}.`;
  await assert.rejects(
    sendApplication('/api/careers', application, 'direct', async () => ({
      ok: false,
      json: async () => ({ success: false, message, recipient }),
    })),
    (error) => {
      assert.equal(error.message, message);
      assert.equal(
        new URL(buildApplicationDraft(application, 'direct', error.recipient).href).pathname,
        recipient,
      );
      return true;
    },
  );
});
