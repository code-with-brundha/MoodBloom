import { useRef, useState } from 'react';
import Button from '../Button.jsx';
import ProfileAvatar from './ProfileAvatar.jsx';
import SettingsIcon from './SettingsIcon.jsx';
import { AVATAR_TYPES, processAvatarFile } from '../../utils/profile.js';

/** Avatar preview + choose / change / remove photo buttons. Calls onChange(dataUrl | null). */
export default function AvatarUploader({ avatar, name, onChange }) {
  const inputRef = useRef(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // lets the same file be chosen again later
    if (!file) return;

    setError('');
    setBusy(true);
    try {
      onChange(await processAvatarFile(file));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = () => {
    setError('');
    onChange(null);
  };

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
      <ProfileAvatar src={avatar} name={name} className="h-28 w-28 text-4xl" />

      <div className="flex min-w-0 flex-1 flex-col items-center gap-3 text-center sm:items-start sm:text-left">
        <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
          <Button
            type="button"
            variant="secondary"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="py-2.5"
          >
            <SettingsIcon name="camera" /> {avatar ? 'Change photo' : 'Choose photo'}
          </Button>
          {avatar && (
            <Button type="button" variant="ghost" onClick={handleRemove} disabled={busy} className="py-2.5">
              <SettingsIcon name="trash" /> Remove photo
            </Button>
          )}
        </div>

        <input
          ref={inputRef}
          id="avatar-input"
          type="file"
          accept={AVATAR_TYPES.join(',')}
          onChange={handleFile}
          className="sr-only"
          tabIndex={-1}
          aria-label="Choose a profile photo"
        />

        <p className="text-sm text-ink-500">
          JPG, PNG or WebP, up to 5 MB. Your photo is cropped to a square and kept in this browser only.
        </p>

        <p role="status" className="text-sm font-semibold text-lilac-500">
          {busy ? 'Preparing your photo…' : ''}
        </p>
        {error && (
          <p role="alert" className="text-sm font-semibold text-blush-500">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
