import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../dashboard/Card.jsx';
import Button from '../Button.jsx';
import FormField from '../FormField.jsx';
import SettingsIcon from './SettingsIcon.jsx';
import InfoRow from './account/InfoRow.jsx';
import UnavailableCard from './account/UnavailableCard.jsx';
import { loadProfile, saveUsername, validateUsername } from '../../utils/profile.js';
import { useAuth } from '../../auth/useAuth.js';

/**
 * Account & Security.
 *
 * Sign-in is handled by Supabase Auth (see src/auth). This page shows the REAL signed-in account
 * (email, confirmation status, created date) and a working Sign out button.
 * Still not available (and labelled as such, with no fake controls): change password, two-factor
 * authentication, session list and account deletion.
 * The username below is part of the local profile (saved in this browser), not of the Supabase account.
 */
export default function AccountSection() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState('');
  const [profile, setProfile] = useState(loadProfile); // shared with My Profile: no duplicate account data
  const [draft, setDraft] = useState(profile.username);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(null); // { type: 'success' | 'error' | 'info', text }

  const dirty = draft.trim() !== profile.username;

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = '';
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
        text: "We couldn't save to this browser. Storage may be full or blocked. Please try again.",
      });
      return;
    }
    setProfile(result.profile);
    setDraft(result.profile.username);
    setError('');
    setStatus({ type: 'success', text: 'Username saved. It is stored in this browser only, not in your account.' });
  };

  const handleCancel = () => {
    setDraft(profile.username);
    setError('');
    setStatus({ type: 'info', text: 'Changes discarded.' });
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    setSignOutError('');
    const result = await signOut(); // ends this browser's session only; nothing else in storage is touched
    if (!result.ok) {
      setSigningOut(false);
      setSignOutError(result.error);
      return;
    }
    navigate('/signin', { replace: true });
  };

  const createdAt = user?.created_at ? new Date(user.created_at) : null;
  const memberSince =
    createdAt && !Number.isNaN(createdAt.getTime())
      ? createdAt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
      : 'Not available';

  const statusStyle = { success: 'text-ink-800', info: 'text-ink-700', error: 'text-ink-800' };

  return (
    <div className="space-y-6">
      {/* ---- Account status ---- */}
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
              You’re signed in with <strong className="break-all text-ink-800">{user?.email}</strong>. Your journal,
              moods, goals and other data are still kept <strong className="text-ink-800">in this browser only</strong>,
              not in your account yet. So anyone who signs in on this browser will see the same data. Saving it to your
              account comes in a later step.
            </p>
          </div>
        </div>
      </Card>

      {/* ---- Account information ---- */}
      <Card title="Account information" subtitle="Your sign-in details.">
        <dl className="divide-y divide-lilac-200/60" data-testid="account-info">
          <InfoRow label="Email address" value={user?.email} testId="account-email">
            <span className="rounded-full border border-lilac-200 bg-white/80 px-2.5 py-0.5 text-xs font-bold text-ink-800">
              {user?.email_confirmed_at ? 'Confirmed' : 'Not confirmed yet'}
            </span>
          </InfoRow>
          <InfoRow label="Username" value={profile.username} testId="account-username-value">
            <span className="text-xs text-ink-600">Saved in this browser</span>
          </InfoRow>
          <InfoRow label="Member since" value={memberSince} testId="account-created" />
        </dl>
        <p className="mt-3 rounded-2xl bg-lilac-100/70 px-4 py-3 text-sm leading-relaxed text-ink-700">
          Changing your sign-in email isn’t available yet. The email in{' '}
          <Link to="/settings/profile" className="font-bold underline underline-offset-2 hover:text-ink-800">
            My Profile
          </Link>{' '}
          is a separate value saved in this browser and is not the one you sign in with.
        </p>
      </Card>

      {/* ---- Edit username (the one real action on this page) ---- */}
      <Card title="Username" subtitle="Saved in this browser, in the same profile as My Profile. It isn’t linked to your account yet.">
        <form onSubmit={handleSubmit} noValidate>
          <div className="max-w-md [&_p[role=alert]]:text-ink-800">
            <FormField
              id="account-username"
              label="Username"
              autoComplete="off"
              maxLength={30}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
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
                  <SettingsIcon name={status.type === 'error' ? 'alert' : 'check'} className="h-5 w-5 shrink-0" />
                  <span>{status.text}</span>
                </>
              ) : dirty ? (
                'You have unsaved changes.'
              ) : (
                ''
              )}
            </p>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" onClick={handleCancel} disabled={!dirty} className="flex-1 py-2.5 sm:flex-none">
                Cancel changes
              </Button>
              <Button type="submit" disabled={!dirty} className="flex-1 py-2.5 sm:flex-none">
                Save username
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* ---- Security: what exists and what doesn't (no fake controls) ---- */}
      <UnavailableCard id="password" icon="privacy" title="Password">
        <p>
          Changing your password from inside MoodBloom isn’t available yet. It’s planned as a follow-up. Your
          password is never stored in this browser by MoodBloom.
        </p>
      </UnavailableCard>

      <UnavailableCard id="twofactor" icon="privacy" title="Two-factor authentication">
        <p>
          Two-factor authentication adds a second step, like a code from your phone, when you sign in. It is{' '}
          <strong className="text-ink-800">not active</strong> and can’t be turned on yet.
        </p>
      </UnavailableCard>

      <UnavailableCard id="sessions" icon="data" title="Active sessions">
        <p>
          Seeing and ending your sessions on other devices isn’t available yet. “Sign out” below ends the session on
          this browser only.
        </p>
      </UnavailableCard>

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
            <p id="signout-help" className="mt-2 text-sm leading-relaxed text-ink-600">
              Signs you out of MoodBloom on this browser. Your journal, goals and other data saved in this browser stay
              exactly as they are.
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
              <p role="alert" data-testid="signout-error" className="mt-3 rounded-2xl bg-blush-100 px-4 py-3 text-sm font-semibold text-ink-800">
                {signOutError}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* ---- Account management ---- */}
      <UnavailableCard
        id="delete"
        icon="trash"
        title="Delete account"
        status="Not available yet"
        footer={
          <Button type="button" variant="secondary" disabled aria-describedby="delete-help" className="py-2.5">
            Delete account
          </Button>
        }
      >
        <p id="delete-help">
          Deleting your account isn’t available yet. It needs a secure step on the server that hasn’t been set up, so
          nothing on this page can delete your account, and this button stays off.
        </p>
        <p>
          <strong className="text-ink-800">When it is available,</strong> deleting an account will permanently remove
          the account and the data stored with it, and this can’t be undone. You’ll be asked to confirm before
          anything is removed.
        </p>
        <p>
          You can export or clear the data kept in this browser in{' '}
          <Link to="/settings/data" className="font-bold underline underline-offset-2 hover:text-ink-800">
            Data Management
          </Link>
          .
        </p>
      </UnavailableCard>
    </div>
  );
}
