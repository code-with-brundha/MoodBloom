import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import FormField from '../components/FormField.jsx';
import Button from '../components/Button.jsx';
import { AuthLoadingScreen } from '../auth/AuthProvider.jsx';
import { useAuth } from '../auth/useAuth.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_WAIT_SECONDS = 60;

function validate({ name, email, password, confirmPassword }) {
  const errors = {};
  if (!name.trim()) errors.name = 'Please tell us your name.';
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Please enter a valid email address.';
  if (password.length < 8) errors.password = 'Password must be at least 8 characters.';
  if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match.';
  return errors;
}

const bannerClass = 'rounded-2xl bg-blush-100 px-4 py-3 text-sm font-semibold text-ink-800';

export default function SignUpPage() {
  const { session, loading, signUp, resendConfirmation } = useAuth();

  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [sentTo, setSentTo] = useState(null); // the email we asked the person to confirm
  const [resendAt, setResendAt] = useState(0); // time (ms) when another email may be requested
  const [now, setNow] = useState(() => Date.now());
  const [resend, setResend] = useState({ busy: false, text: '', ok: false });

  // Wait before another confirmation email can be requested (also avoids Supabase's email rate limit).
  // It compares clock times instead of counting ticks, so it stays right even if the tab sleeps in the background.
  const cooldown = Math.max(0, Math.ceil((resendAt - now) / 1000));
  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [cooldown > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const startCooldown = () => {
    const t = Date.now();
    setNow(t);
    setResendAt(t + RESEND_WAIT_SECONDS * 1000);
  };

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
    const email = values.email.trim();
    const result = await signUp({ name: values.name.trim(), email, password: values.password });
    setSubmitting(false);

    if (!result.ok) {
      if (result.code === 'weak_password') setErrors({ password: result.error });
      else setFormError(result.error);
      return;
    }
    // Signed in straight away (confirmation switched off): AuthProvider has the session and we redirect below.
    if (result.needsConfirmation) {
      setSentTo(email);
      startCooldown();
      setResend({ busy: false, text: '', ok: false });
    }
  };

  const handleResend = async () => {
    setResend({ busy: true, text: '', ok: false });
    const result = await resendConfirmation(sentTo);
    setResend({
      busy: false,
      ok: result.ok,
      text: result.ok ? 'Another email is on its way. Check your inbox (and spam).' : result.error,
    });
    if (result.ok) startCooldown();
  };

  if (loading) return <AuthLoadingScreen />;
  if (session) return <Navigate to="/dashboard" replace />;

  const footer = (
    <>
      Already have an account?{' '}
      <Link to="/signin" className="font-bold text-lilac-500 underline-offset-4 hover:underline">
        Sign in
      </Link>
    </>
  );

  // Step 2: the account was created, but the email address still has to be confirmed.
  if (sentTo) {
    return (
      <AuthLayout title="Check your email" subtitle="One more step to finish creating your account." footer={footer}>
        <div className="space-y-4" data-testid="check-email">
          <p className="leading-relaxed text-ink-700">
            If <strong className="break-all text-ink-800">{sentTo}</strong> is a new account, we’ve sent it a
            confirmation link. Open the link to finish, then you’ll be signed in. If you already registered with this
            email, just sign in instead.
          </p>
          <p className="text-sm leading-relaxed text-ink-600">Can’t see it? Check your spam folder.</p>

          <Button
            type="button"
            variant="secondary"
            onClick={handleResend}
            disabled={resend.busy || cooldown > 0}
            className="w-full"
          >
            {resend.busy ? 'Sending…' : cooldown > 0 ? `Resend email (${cooldown}s)` : 'Resend email'}
          </Button>
          {resend.text && (
            <p
              role={resend.ok ? 'status' : 'alert'}
              data-testid="resend-status"
              className={resend.ok ? 'rounded-2xl bg-lilac-100 px-4 py-3 text-sm font-semibold text-ink-800' : bannerClass}
            >
              {resend.text}
            </p>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="ghost" onClick={() => setSentTo(null)} className="flex-1 py-2">
              Use a different email
            </Button>
            <Button to="/signin" variant="ghost" className="flex-1 py-2">
              Go to sign in
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your little world. It only takes a minute."
      footer={footer}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4" aria-busy={submitting}>
        <FormField
          id="name"
          label="Name"
          autoComplete="name"
          placeholder="What should we call you?"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
          disabled={submitting}
        />
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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          disabled={submitting}
        />
        <FormField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Type it once more"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          disabled={submitting}
        />

        {formError && (
          <p role="alert" data-testid="form-error" className={bannerClass}>
            {formError}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  );
}
