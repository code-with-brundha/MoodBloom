import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import FormField from '../components/FormField.jsx';
import Button from '../components/Button.jsx';
import { AuthLoadingScreen } from '../auth/AuthProvider.jsx';
import { useAuth } from '../auth/useAuth.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate({ email, password }) {
  const errors = {};
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Please enter a valid email address.';
  if (!password) errors.password = 'Please enter your password.';
  return errors;
}

/** Only ever go back to a page inside MoodBloom (never an outside address), and never to the auth pages. */
const safeTarget = (from) =>
  typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') && !/^\/(signin|signup)(\/|\?|#|$)/.test(from)
    ? from
    : '/dashboard';

const bannerClass = 'rounded-2xl bg-blush-100 px-4 py-3 text-sm font-semibold text-ink-800';

export default function SignInPage() {
  const { session, loading, signIn, resendConfirmation, callbackNotice, dismissCallbackNotice } = useAuth();
  const location = useLocation();

  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [resend, setResend] = useState({ busy: false, text: '', ok: false });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    setFormError('');
    setNeedsConfirm(false);
    setResend({ busy: false, text: '', ok: false });
    dismissCallbackNotice();

    // Success: AuthProvider now holds the session, and this page redirects (see below).
    const result = await signIn({ email: values.email.trim(), password: values.password });
    if (!result.ok) {
      setSubmitting(false);
      setFormError(result.error);
      setNeedsConfirm(result.code === 'email_not_confirmed');
    }
  };

  const handleResend = async () => {
    setResend({ busy: true, text: '', ok: false });
    const result = await resendConfirmation(values.email.trim());
    setResend({
      busy: false,
      ok: result.ok,
      text: result.ok ? 'A new confirmation email is on its way. Check your inbox (and spam).' : result.error,
    });
  };

  if (loading) return <AuthLoadingScreen />;
  if (session) return <Navigate to={safeTarget(location.state?.from)} replace />;

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Your little world missed you."
      footer={
        <>
          New to MoodBloom?{' '}
          <Link to="/signup" className="font-bold text-lilac-500 underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-busy={submitting}>
        {callbackNotice && (
          <p role="alert" data-testid="callback-notice" className={bannerClass}>
            {callbackNotice.message}
          </p>
        )}

        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          disabled={submitting}
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          disabled={submitting}
        />

        {formError && (
          <p role="alert" data-testid="form-error" className={bannerClass}>
            {formError}
          </p>
        )}

        {needsConfirm && (
          <div className="space-y-2">
            <Button type="button" variant="secondary" onClick={handleResend} disabled={resend.busy} className="w-full">
              {resend.busy ? 'Sending…' : 'Resend confirmation email'}
            </Button>
            {resend.text && (
              <p role="status" data-testid="resend-status" className="rounded-2xl bg-lilac-100 px-4 py-3 text-sm font-semibold text-ink-800">
                {resend.text}
              </p>
            )}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </AuthLayout>
  );
}
