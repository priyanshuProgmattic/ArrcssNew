import { z } from 'zod';
import { company } from '../data/company.js';

// Vite exposes only the destination address, never the SMTP credentials.
export const formRecipient =
  typeof import.meta.env === 'object'
    ? import.meta.env.VITE_FORM_RECIPIENT || company.email
    : company.email;

export async function readFormResponse(response, failureMessage, unconfirmedMessage) {
  let result;
  try {
    result = await response.json();
  } catch (error) {
    if (response.ok) throw error;
  }
  if (!response.ok || result?.success !== true) {
    const message =
      typeof result?.message === 'string' && result.message.trim()
        ? result.message
        : response.ok
          ? unconfirmedMessage
          : failureMessage;
    const error = new Error(message);
    error.recipient = z.email().safeParse(result?.recipient).success
      ? result.recipient
      : formRecipient;
    throw error;
  }
  return result;
}
