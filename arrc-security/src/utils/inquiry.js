import { z } from 'zod';
import { services } from '../data/services.js';
<<<<<<< HEAD
import { formRecipient, readFormResponse } from './form-response.js';
=======
import { company } from '../data/company.js';
import { readMailResponse } from './mail-response.js';
>>>>>>> 4ec086f46d53ecc52a2adf84486e04b9b12edb41

const phone = z
  .string()
  .trim()
  .min(1, 'Enter your phone number.')
  .refine(
    (value) =>
      /^[+\d\s()\-]+$/.test(value) &&
      value.replace(/\D/g, '').length >= 10 &&
      value.replace(/\D/g, '').length <= 15,
    'Enter a valid phone number with 10–15 digits.',
  );
export function createInquirySchema(isQuote = false) {
  const schema = {
    fullName: z
      .string()
      .trim()
      .min(2, 'Enter your full name.')
      .max(100, 'Use 100 characters or fewer.'),
    companyName: z
      .string()
      .trim()
      .min(2, 'Enter your company or organization name.')
      .max(150, 'Use 150 characters or fewer.'),
    email: z.email('Enter a valid email address.').max(254),
    phone,
    service: z.enum([...services.map((service) => service.slug), 'integrated-services'], {
      error: 'Choose a service.',
    }),
    message: z
      .string()
      .trim()
      .min(20, 'Please tell us a little more (at least 20 characters).')
      .max(3000, 'Use 3,000 characters or fewer.'),
    consent: z.literal(true, { error: 'Please agree to be contacted about this enquiry.' }),
  };
  if (isQuote)
    Object.assign(schema, {
      propertyType: z.string().trim().min(1, 'Choose a property type.'),
      location: z
        .string()
        .trim()
        .min(2, 'Enter your site location.')
        .max(200, 'Use 200 characters or fewer.'),
      personnel: z
        .string()
        .refine(
          (value) =>
            value === '' || (/^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 10000),
          'Enter a number between 1 and 10,000, or leave this blank.',
        ),
    });
  return z.object(schema);
}

export function buildEmailDraft(values, recipient = formRecipient) {
  const title =
    services.find((service) => service.slug === values.service)?.title || 'Integrated services';
  const subject = `Website enquiry — ${title}`;
  const body = [
    'Hello ARRC team,',
    '',
    'I would like to discuss the following requirements:',
    '',
    `Name: ${values.fullName}`,
    `Company: ${values.companyName}`,
    `Email: ${values.email}`,
    `Phone: ${values.phone}`,
    `Service: ${title}`,
    values.propertyType && `Property type: ${values.propertyType}`,
    values.location && `Location: ${values.location}`,
    values.personnel && `Personnel required: ${values.personnel}`,
    '',
    'Requirements:',
    values.message,
  ]
    .filter((value) => value !== undefined && value !== false)
    .join('\n');
  return {
    subject,
    body,
    href: `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
  };
}

export async function sendInquiry(endpoint, values, fetcher = fetch) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetcher(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...values, source: 'arrc-website' }),
      signal: controller.signal,
    });
<<<<<<< HEAD
    return await readFormResponse(
      response,
      'The enquiry service could not accept your message. Please try again or contact us directly.',
      'Delivery was not confirmed. Please contact us by phone or email.',
    );
=======
    if (!response.ok)
      throw new Error(
        'The enquiry service could not accept your message. Please try again or contact us directly.',
      );
    const result = await readMailResponse(response);
    if (result?.success !== true)
      throw new Error('Delivery was not confirmed. Please contact us by phone or email.');
    return result;
>>>>>>> 4ec086f46d53ecc52a2adf84486e04b9b12edb41
  } catch (error) {
    if (error.name === 'AbortError')
      throw new Error('The request timed out. Please try again or contact us directly.');
    if (error instanceof TypeError || error instanceof SyntaxError)
      throw new Error(
        'We could not confirm delivery. Please try again or contact us by phone or email.',
      );
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
