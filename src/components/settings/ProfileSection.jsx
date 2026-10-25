
import { useContext, useEffect, useState } from 'react';
import Card from '../dashboard/Card.jsx';
import Button from '../Button.jsx';
import FormField from '../FormField.jsx';
import AvatarUploader from './AvatarUploader.jsx';
import ProfilePreviewCard from './ProfilePreviewCard.jsx';
import SettingsIcon from './SettingsIcon.jsx';
import { toDateInputValue } from '../../utils/dates.js';
import {
  BIO_MAX,
  isSameProfile,
  loadProfile,
  normalizeProfile,
  saveProfile,
  validateProfile,
} from '../../utils/profile.js';
import { supabase } from '../../lib/supabaseClient.js';
import { AuthContext } from '../../auth/AuthProvider.jsx';

const FIELD_ORDER = [
  'fullName',
  'username',
  'email',
  'bio',
  'dateOfBirth',
  'location',
];

export default function ProfileSection() {
  const { user } = useContext(AuthContext);

  const [saved, setSaved] = useState(loadProfile);
  const [draft, setDraft] = useState(() => loadProfile());
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(Boolean(user?.id));
  const [saving, setSaving] = useState(false);

  const dirty = !isSameProfile(draft, saved);

  // Load the profile belonging to the signed-in user.
  useEffect(() => {
    let cancelled = false;

    async function loadCloudProfile() {
      setLoading(true);
      setErrors({});
      setStatus(null);

      const localProfile = normalizeProfile(loadProfile());

      const signupName =
        user?.user_metadata?.name?.trim() ||
        user?.user_metadata?.display_name?.trim() ||
        user?.user_metadata?.full_name?.trim() ||
        '';

      const signupEmail = user?.email?.trim() || '';

      if (!user?.id) {
        setSaved(localProfile);
        setDraft(localProfile);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('profile')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        if (cancelled) return;

        const hasCloudProfile =
          data?.profile &&
          typeof data.profile === 'object' &&
          !Array.isArray(data.profile) &&
          Object.keys(data.profile).length > 0;

        if (hasCloudProfile) {
          const cloudProfile = normalizeProfile({
            ...localProfile,
            ...data.profile,
          });

          // Use signup details only when the saved fields are demo
          // placeholders or empty. Preserve existing custom details.
          const updatedProfile = normalizeProfile({
            ...cloudProfile,
            fullName:
              !cloudProfile.fullName ||
              cloudProfile.fullName === 'Friend'
                ? signupName || cloudProfile.fullName
                : cloudProfile.fullName,
            email:
              !cloudProfile.email ||
              cloudProfile.email === 'friend@example.com'
                ? signupEmail || cloudProfile.email
                : cloudProfile.email,
          });

          const profileChanged =
            updatedProfile.fullName !== cloudProfile.fullName ||
            updatedProfile.email !== cloudProfile.email;

          // Persist the updated signup details to the cloud if needed.
          if (profileChanged) {
            const { error: updateError } = await supabase
              .from('user_settings')
              .upsert(
                {
                  user_id: user.id,
                  profile: updatedProfile,
                  updated_at: new Date().toISOString(),
                },
                { onConflict: 'user_id' },
              );

            if (updateError) throw updateError;
            if (cancelled) return;
          }

          setSaved(updatedProfile);
          setDraft(updatedProfile);
          saveProfile(updatedProfile);
        } else {
          // Initialize the cloud profile with signup details while
          // preserving other available local profile information.
          const initialProfile = normalizeProfile({
            ...localProfile,
            fullName:
              signupName ||
              (localProfile.fullName === 'Friend'
                ? ''
                : localProfile.fullName),
            email:
              signupEmail ||
              (localProfile.email === 'friend@example.com'
                ? ''
                : localProfile.email),
          });

          const { error: saveError } = await supabase
            .from('user_settings')
            .upsert(
              {
                user_id: user.id,
                profile: initialProfile,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'user_id' },
            );

          if (saveError) throw saveError;
          if (cancelled) return;

          setSaved(initialProfile);
          setDraft(initialProfile);
          saveProfile(initialProfile);
        }
      } catch (error) {
        console.error('Could not load profile from Supabase:', error);

        if (!cancelled) {
          // Keep the existing local profile if cloud sync fails.
          setSaved(localProfile);
          setDraft(localProfile);
          setStatus({
            type: 'error',
            text: 'Could not sync your profile with the cloud. Your local profile is still available.',
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCloudProfile();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return undefined;

    const warn = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', warn);

    return () =>
      window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const update = (name, value) => {
    setDraft((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setStatus(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading || saving) return;

    const values = normalizeProfile(draft);
    const found = validateProfile(values);

    setErrors(found);

    const firstInvalid = FIELD_ORDER.find(
      (field) => found[field],
    );

    if (firstInvalid) {
      setStatus({
        type: 'error',
        text: 'Please fix the highlighted fields.',
      });

      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setSaving(true);
    setStatus(null);

    try {
      if (user?.id) {
        const { error } = await supabase
          .from('user_settings')
          .upsert(
            {
              user_id: user.id,
              profile: values,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' },
          );

        if (error) throw error;
      }

      // Keep a local fallback, including when signed out.
      const localResult = saveProfile(values);

      if (!localResult.ok) {
        throw new Error(localResult.error);
      }

      
      setSaved(values);
      setDraft(values);

      // Tell the Dashboard that the profile has been updated.
      window.dispatchEvent(new Event('moodbloom:profile-updated'));

      setStatus({
        type: 'success',
        text: user?.id
          ? 'Profile saved and synced to the cloud! 🌸'
          : 'Profile saved in this browser. Sign in to sync it across devices.',
      });

    } catch (error) {
      console.error('Could not save profile:', error);

      setStatus({
        type: 'error',
        text: user?.id
          ? 'Could not save your profile to the cloud. Please try again.'
          : 'Could not save your profile. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(saved);
    setErrors({});
    setStatus({ type: 'info', text: 'Changes discarded.' });
  };

  const statusStyle = {
    success: 'text-lilac-500',
    info: 'text-ink-600',
    error: 'text-blush-500',
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
    >
      <ProfilePreviewCard profile={draft} unsaved={dirty} />

      <Card
        title="Profile photo"
        subtitle="Choose a picture you love. Saved when you press Save changes."
      >
        <AvatarUploader
          avatar={draft.avatar}
          name={draft.fullName}
          onChange={(avatar) => update('avatar', avatar)}
        />
      </Card>

      <Card title="Personal information">
        <div className="space-y-4">
          <FormField
            id="fullName"
            label="Full name"
            autoComplete="name"
            maxLength={80}
            value={draft.fullName}
            onChange={(e) =>
              update('fullName', e.target.value)
            }
            error={errors.fullName}
          />

          <FormField
            id="username"
            label="Username"
            autoComplete="off"
            maxLength={30}
            value={draft.username}
            onChange={(e) =>
              update('username', e.target.value)
            }
            error={errors.username}
            hint="Letters, numbers, dots and underscores."
          />

          <FormField
            id="email"
            label="Email address"
            type="email"
            autoComplete="email"
            value={draft.email}
            onChange={(e) =>
              update('email', e.target.value)
            }
            error={errors.email}
            hint="Changing this does not change your actual sign-in email."
          />

          <div>
            <label
              htmlFor="bio"
              className="mb-1.5 block text-sm font-bold text-ink-700"
            >
              Short bio{' '}
              <span className="font-normal text-ink-500">
                (optional)
              </span>
            </label>

            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={draft.bio}
              onChange={(e) =>
                update('bio', e.target.value)
              }
              placeholder="A line or two about you"
              aria-invalid={errors.bio ? 'true' : 'false'}
              className={`w-full resize-none rounded-2xl border-2 bg-white/80 px-4 py-3 text-base text-ink-800 placeholder:text-ink-500/60 transition focus:bg-white focus:outline-none focus:ring-4 ${
                errors.bio
                  ? 'border-blush-400 focus:ring-blush-200'
                  : 'border-lilac-200 focus:border-lilac-400 focus:ring-lilac-200/70'
              }`}
            />

            <div className="mt-1 flex items-start justify-between gap-3">
              <p
                role="alert"
                className="text-sm font-semibold text-blush-500"
              >
                {errors.bio}
              </p>

              <p
                className={`ml-auto shrink-0 text-xs ${
                  draft.bio.length > BIO_MAX
                    ? 'font-bold text-blush-500'
                    : 'text-ink-500'
                }`}
              >
                {draft.bio.length}/{BIO_MAX}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card
        title="Personal details"
        subtitle="Both are optional."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            id="dateOfBirth"
            label="Date of birth"
            type="date"
            min="1900-01-01"
            max={toDateInputValue()}
            value={draft.dateOfBirth}
            onChange={(e) =>
              update('dateOfBirth', e.target.value)
            }
            error={errors.dateOfBirth}
          />

          <FormField
            id="location"
            label="Location"
            autoComplete="address-level2"
            placeholder="City, Country"
            maxLength={80}
            value={draft.location}
            onChange={(e) =>
              update('location', e.target.value)
            }
            error={errors.location}
          />
        </div>
      </Card>

      <div className="sticky bottom-3 z-20 flex flex-col gap-3 rounded-3xl border border-white/80 bg-cream-50/95 p-3 shadow-soft backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <p
          role="status"
          aria-live="polite"
          className={`flex min-h-[1.5rem] items-center gap-2 px-1 text-sm font-semibold ${
            status ? statusStyle[status.type] : 'text-ink-500'
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
          ) : loading ? (
            'Loading your profile...'
          ) : saving ? (
            'Saving your profile...'
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
            disabled={!dirty || saving || loading}
            className="flex-1 py-2.5 sm:flex-none"
          >
            Cancel changes
          </Button>

          <Button
            type="submit"
            disabled={!dirty || saving || loading}
            className="flex-1 py-2.5 sm:flex-none"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </div>
    </form>
  );
}
