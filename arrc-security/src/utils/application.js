import { z } from 'zod';
import { careerCategories, careers } from '../data/careers.js';

export const MAX_RESUME_SIZE = 5 * 1024 * 1024;
const resumeTypes = {
  pdf: ['application/pdf'],
  doc: ['application/msword', 'application/octet-stream'],
  docx: [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
    'application/octet-stream',
  ],
};

export function validateResume(file) {
  if (!file) return 'Choose your resume to continue.';
  if (!file.size) return 'Choose a file that is not empty.';
  if (file.size > MAX_RESUME_SIZE) return 'Your resume must be 5 MB or smaller.';
  const extension = file.name?.split('.').pop()?.toLowerCase();
  if (!resumeTypes[extension] || (file.type && !resumeTypes[extension].includes(file.type)))
    return 'Choose a PDF, DOC or DOCX resume.';
  return null;
}

export function createApplicationSchema(teamId) {
  const team = careerCategories.find((category) => category.id === teamId);
  if (!team) throw new Error('Choose a valid application category.');
  const optionalText = (length) =>
    z.string().trim().max(length, `Use ${length} characters or fewer.`);
  return z.object({
    designation: z.enum(team.roles, { error: 'Choose the role you are applying for.' }),
    fullName: z
      .string()
      .trim()
      .min(2, 'Enter your full name.')
      .max(100, 'Use 100 characters or fewer.'),
    email: z.email('Enter a valid email address.').max(254),
    phone: z
      .string()
      .trim()
      .refine(
        (value) =>
          /^[+\d\s()\-]+$/.test(value) &&
          value.replace(/\D/g, '').length >= 10 &&
          value.replace(/\D/g, '').length <= 15,
        'Enter a valid phone number with 10–15 digits.',
      ),
    address: optionalText(300),
    currentLocation: optionalText(150),
    experience: optionalText(100),
    lastSalary: optionalText(100),
    lastPost: optionalText(150),
    resume: z.any().superRefine((files, context) => {
      const error = validateResume(files?.[0]);
      if (error) context.addIssue({ code: 'custom', message: error });
    }),
    consent: z.literal(true, { error: 'Please agree to be contacted about your application.' }),
  });
}

export function buildApplicationDraft(values, teamId) {
  const team = careerCategories.find((category) => category.id === teamId);
  const resume = values.resume?.[0];
  const subject = `Career application — ${values.designation}`;
  const body = [
    'Hello ARRC team,',
    '',
    `I would like to apply for ${values.designation}.`,
    '',
    `Application category: ${team.title}`,
    `Name: ${values.fullName}`,
    `Email: ${values.email}`,
    `Phone: ${values.phone}`,
    values.address && `Address: ${values.address}`,
    values.currentLocation && `Current location: ${values.currentLocation}`,
    values.experience && `Experience: ${values.experience}`,
    values.lastSalary && `Last salary: ${values.lastSalary}`,
    values.lastPost && `Last position / employer: ${values.lastPost}`,
    '',
    `Resume to attach: ${resume.name}`,
    '',
    'Thank you for considering my application.',
  ]
    .filter((value) => value !== false && value !== undefined)
    .join('\n');
  return {
    body,
    href: `mailto:${careers.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    resumeName: resume.name,
  };
}

export async function sendApplication(endpoint, values, teamId, fetcher = fetch) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) {
    if (key !== 'resume') data.append(key, String(value));
  }
  data.append('category', teamId);
  data.append('resume', values.resume[0]);
  data.append('source', 'arrc-careers');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  try {
    const response = await fetcher(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: data,
      signal: controller.signal,
    });
    if (!response.ok)
      throw new Error(
        'Your application could not be accepted. Please try again or email our team.',
      );
    const result = await response.json();
    if (result.success !== true)
      throw new Error('Receipt was not confirmed. Please try again or email our team.');
    return result;
  } catch (error) {
    if (error.name === 'AbortError')
      throw new Error('The upload timed out. Please try again or apply by email.');
    if (error instanceof TypeError || error instanceof SyntaxError)
      throw new Error('We could not confirm receipt. Please try again or apply by email.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
