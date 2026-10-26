
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../dashboard/Card.jsx';
import Button from '../Button.jsx';
import FormField from '../FormField.jsx';
import SettingsIcon from './SettingsIcon.jsx';
import InfoRow from './account/InfoRow.jsx';
import UnavailableCard from './account/UnavailableCard.jsx';
import {
  loadProfile,
  saveUsername,
  validateUsername,
} from '../../utils/profile.js';
import { useAuth } from '../../auth/useAuth.js';
import { supabase } from '../../lib/supabaseClient.js';

export default function AccountSection() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState('');
  const [profile, setProfile] = useState(loadProfile);
  const [draft, setDraft] = useState(profile.username);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(null);

  const dirty = draft.trim() !== profile.username;

  useEffect(() => {
    if (!dirty) return undefined;

    const warn = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const problem = validateUsername(draft);

    if (problem) {
      setError(problem);
      setStatus({ type: 'error', text: 'Please fix the username.' });
      document.getElementById('account-username')?.focus();
      return;
    }

    const result = saveUsername(draft);

    if (!result.ok) {
      setStatus({
        type: 'error',
        text:
          result.error ||
          "We couldn't save your username. Please try again.",
      });
      return;
    }

    setProfile(result.profile);
    setDraft(result.profile.username);
    setError('');
    setStatus({
      type: 'success',
      text: 'Username saved successfully.',
    });
  };

  const handleCancel = () => {
    setDraft(profile.username);
    setError('');
    setStatus({ type: 'info', text: 'Changes discarded.' });
  };

  const handlePasswordUpdate = async (event) => {
    event.preventDefault();
    setPasswordStatus(null);

    if (newPassword.length < 8) {
      setPasswordStatus({
        type: 'error',
        text: 'Use at least 8 characters for your new password.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        type: 'error',
        text: 'The passwords do not match.',
      });
      return;
    }

    setPasswordBusy(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setNewPassword('');
      setConfirmPassword('');
      setPasswordStatus({
        type: 'success',
        text: 'Your password was updated successfully.',
      });
    } catch (err) {
      setPasswordStatus({
        type: 'error',
        text:
          err?.message ||
          'We could not update your password. Please sign in again and retry.',
      });
    } finally {
      setPasswordBusy(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    setSignOutError('');

    const result = await signOut();

    if (!result.ok) {
      setSigningOut(false);
      setSignOutError(result.error);
      return;
    }

    navigate('/signin', { replace: true });
  };

  const createdAt = user?.created_at
    ? new Date(user.created_at)
    : null;

  const memberSince =
    createdAt && !Number.isNaN(createdAt.getTime())
      ? createdAt.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'Not available';

  const statusStyle = {
    success: 'text-ink-800',
    info: 'text-ink-700',
    error: 'text-ink-800',
  };

  return (
    <div className="space-y-6">
      {/* Account status */}
      <Card>
        <div className="flex items-start gap-3 sm:gap-4">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blush-100 to-lilac-200 text-ink-800"
          >
            <SettingsIcon name="account" className="h-6 w-6" />
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h2 className="text-xl font-semibold">Account status</h2>
              <span
                data-testid="account-mode"
                className="rounded-full bg-lilac-200 px-3 py-1 text-xs font-bold text-ink-800"
              >
                Signed in
              </span>
            </div>

            
<p className="mt-2 text-sm leading-relaxed text-ink-600">
  You’re signed in with{' '}
  <strong className="break-all text-ink-800">
    {user?.email}
  </strong>
  . Your account manages your sign-in details. Data storage depends on
  the feature, and some information may still be stored only in this
  browser.
</p>

          </div>
        </div>
      </Card>

      {/* Account information */}
      <Card title="Account information" subtitle="Your sign-in details.">
        <dl
          className="divide-y divide-lilac-200/60"
          data-testid="account-info"
        >
          <InfoRow
            label="Email address"
            value={user?.email}
            testId="account-email"
          >
            <span className="rounded-full border border-lilac-200 bg-white/80 px-2.5 py-0.5 text-xs font-bold text-ink-800">
              {user?.email_confirmed_at
                ? 'Confirmed'
                : 'Not confirmed yet'}
            </span>
          </InfoRow>

          <InfoRow
            label="Username"
            value={profile.username || 'Not set'}
            testId="account-username-value"
          />

          <InfoRow
            label="Member since"
            value={memberSince}
            testId="account-created"
          />
        </dl>

        
      </Card>

      {/* Edit username */}
      <Card
        title="Username"
        subtitle="Choose a username for your MoodBloom profile."
      >
        <form onSubmit={handleSubmit} noValidate>
          <div className="max-w-md [&_p[role=alert]]:text-ink-800">
            <FormField
              id="account-username"
              label="Username"
              autoComplete="off"
              maxLength={20}
              value={draft}
              placeholder="moodbloom_friend"
              onChange={(event) => {
                setDraft(event.target.value);
                setError('');
                setStatus(null);
              }}
              error={error}
              hint="3–20 letters, numbers, dots or underscores."
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p
              role="status"
              aria-live="polite"
              data-testid="username-status"
              className={`flex min-h-[1.5rem] items-center gap-2 text-sm font-semibold ${
                status ? statusStyle[status.type] : 'text-ink-600'
              }`}
            >
              {status ? (
                <>
                  <SettingsIcon
                    name={status.type === 'error' ? 'alert' : 'check'}
                    className="h-5 w-5 shrink-0"
                  />
                  <span>{status.text}</span>
                </>
              ) : dirty ? (
                'You have unsaved changes.'
              ) : (
                ''
              )}
            </p>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={!dirty}
                className="flex-1 py-2.5 sm:flex-none"
              >
                Cancel changes
              </Button>

              <Button
                type="submit"
                disabled={!dirty}
                className="flex-1 py-2.5 sm:flex-none"
              >
                Save username
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Change password */}
      <Card
        id="password"
        title="Change password"
        subtitle="Choose a strong password you do not use on other websites."
      >
        <form
          onSubmit={handlePasswordUpdate}
          className="max-w-lg space-y-4"
        >
          <FormField
            id="new-password"
            label="New password"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            hint="At least 8 characters."
            required
          />

          <FormField
            id="confirm-password"
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />

          <Button
            type="submit"
            disabled={
              passwordBusy || !newPassword || !confirmPassword
            }
            className="py-2.5"
          >
            {passwordBusy ? 'Updating password…' : 'Update password'}
          </Button>

          {passwordStatus && (
            <p
              role={passwordStatus.type === 'error' ? 'alert' : 'status'}
              className={`text-sm font-semibold ${
                passwordStatus.type === 'error'
                  ? 'text-blush-500'
                  : 'text-lilac-600'
              }`}
            >
              {passwordStatus.text}
            </p>
          )}

          <p className="text-sm leading-relaxed text-ink-600">
            Your password is handled by Supabase Auth; MoodBloom never
            stores it in your profile or browser storage.
          </p>
        </form>
      </Card>

      <UnavailableCard
        id="twofactor"
        icon="privacy"
        title="Two-factor authentication"
      >
        <p>
          Two-factor authentication adds a second step, like a code from
          your phone, when you sign in. It is{' '}
          <strong className="text-ink-800">not active</strong> and can’t
          be turned on yet.
        </p>
      </UnavailableCard>

      <UnavailableCard
        id="sessions"
        icon="data"
        title="Active sessions"
      >
        <p>
          Seeing and ending your sessions on other devices isn’t available
          yet. “Sign out” below ends the session on this browser only.
        </p>
      </UnavailableCard>

      {/* Sign out */}
      <Card>
        <div className="flex items-start gap-3 sm:gap-4">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blush-100 to-lilac-200 text-ink-800"
          >
            <SettingsIcon name="account" className="h-6 w-6" />
          </span>

          <div className="min-w-0 flex-1">
            <h2 id="signout-title" className="text-xl font-semibold">
              Sign out
            </h2>

            <p
              id="signout-help"
              className="mt-2 text-sm leading-relaxed text-ink-600"
            >
              Signs you out of MoodBloom on this browser. Your journal,
              goals and other data saved in this browser stay exactly as
              they are.
            </p>

            <div className="mt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={handleSignOut}
                disabled={signingOut}
                aria-describedby="signout-help"
                className="py-2.5"
              >
                {signingOut ? 'Signing out…' : 'Sign out'}
              </Button>
            </div>

            {signOutError && (
              <p
                role="alert"
                data-testid="signout-error"
                className="mt-3 rounded-2xl bg-blush-100 px-4 py-3 text-sm font-semibold text-ink-800"
              >
                {signOutError}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Account management */}
      <UnavailableCard
        id="delete"
        icon="trash"
        title="Delete account"
        status="Not available yet"
        footer={
          <Button
            type="button"
            variant="secondary"
            disabled
            aria-describedby="delete-help"
            className="py-2.5"
          >
            Delete account
          </Button>
        }
      >
        <p id="delete-help">
          Deleting your account isn’t available yet. It needs a secure
          step on the server that hasn’t been set up, so nothing on this
          page can delete your account, and this button stays off.
        </p>

        <p>
          <strong className="text-ink-800">When it is available,</strong>{' '}
          deleting an account will permanently remove the account and the
          data stored with it, and this can’t be undone. You’ll be asked
          to confirm before anything is removed.
        </p>

        <p>
          You can export or clear the data kept in this browser in{' '}
          <Link
            to="/settings/data"
            className="font-bold underline underline-offset-2 hover:text-ink-800"
          >
            Data Management
          </Link>
          .
        </p>
      </UnavailableCard>
    </div>
  );
}
