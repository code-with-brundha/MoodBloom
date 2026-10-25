/* Friendly messages for Supabase Auth errors, plus reading the "email confirmation" link callback.
 *
 * We never show Supabase's raw error text (it can be technical) and we never say whether an email
 * exists when a sign-in fails, so the messages are deliberately general.
 */

const MESSAGES = {
  invalid_credentials: 'That email and password don’t match. Please check them and try again.',
  email_not_confirmed: 'Please confirm your email first. Check your inbox for the link, or send it again below.',
  user_already_exists: 'An account with this email already exists. Try signing in instead.',
  email_exists: 'An account with this email already exists. Try signing in instead.',
  weak_password: 'That password is too easy to guess. Please choose a longer one with a mix of letters and numbers.',
  signup_disabled: 'New sign-ups are turned off right now. Please try again later.',
  email_address_invalid: 'That email address doesn’t look right. Please check it and try again.',
  validation_failed: 'Please check your details and try again.',
  over_request_rate_limit: 'Too many attempts right now. Please wait a minute and try again.',
  over_email_send_rate_limit: 'We’ve sent a few emails already. Please wait a minute before asking for another.',
  otp_expired: 'That link has expired or was already used. Sign in, or ask for a new confirmation email.',
  access_denied: 'That link isn’t valid any more. Sign in, or ask for a new confirmation email.',
};

const NETWORK_MESSAGE = 'We couldn’t reach the sign-in service. Please check your internet connection and try again.';
const FALLBACK_MESSAGE = 'Something went wrong on our side. Please try again in a moment.';

/** True when the request never reached Supabase (offline, blocked, DNS...). */
export const isNetworkError = (error) =>
  Boolean(error) && (error.name === 'AuthRetryableFetchError' || error.status === 0 || error.name === 'TypeError');

export function friendlyAuthError(error) {
  if (!error) return FALLBACK_MESSAGE;
  if (isNetworkError(error)) return NETWORK_MESSAGE;
  if (error.code && MESSAGES[error.code]) return MESSAGES[error.code];
  if (error.status === 429) return MESSAGES.over_request_rate_limit;
  return FALLBACK_MESSAGE;
}

/**
 * Reads what Supabase put in the address after the person clicked the link in their confirmation email.
 *  - Success (tokens in the #hash, or ?code= when using PKCE): supabase-js signs the person in by itself.
 *  - Failure (#error=...&error_code=otp_expired...): we turn it into a friendly message and clean the address bar.
 * It must run BEFORE supabase-js starts (it removes the hash), so AuthProvider calls it when the module loads.
 * Returns null when the page was opened normally.
 */
export function readAuthCallback(location = window.location, history = window.history) {
  try {
    const fromHash = new URLSearchParams(location.hash.replace(/^#/, ''));
    const fromQuery = new URLSearchParams(location.search);
    const get = (name) => fromHash.get(name) ?? fromQuery.get(name);

    const errorCode = get('error_code') || (get('error') ? get('error') : '');
    if (errorCode) {
      // Remove the error details from the address bar so a refresh doesn't show it again.
      history.replaceState(history.state, '', location.pathname);
      return {
        kind: 'error',
        message: MESSAGES[errorCode] ?? 'That link isn’t valid any more. Sign in, or ask for a new confirmation email.',
      };
    }
    if (get('access_token') || get('code')) {
      return { kind: 'success', type: get('type') || 'signup' };
    }
  } catch {
    /* an unreadable address is just treated as a normal visit */
  }
  return null;
}
