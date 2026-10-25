import { Link } from 'react-router-dom';

/** Gentle reminder shown on My Journal. Can be switched off in Settings → Privacy & Journal Preferences. */
export default function JournalPrivacyNote() {
  return (
    <p
      role="note"
      className="mt-6 flex gap-3 rounded-2xl bg-lilac-100/70 px-4 py-3 text-sm leading-relaxed text-ink-700"
    >
      <span aria-hidden="true">🔒</span>
      <span>
        Gentle reminder: journal entries can contain personal information. Take care when sharing your screen or leaving
        MoodBloom open on a shared device.{' '}
        <Link to="/settings/privacy" className="font-bold text-ink-800 underline underline-offset-4">
          Privacy settings
        </Link>
      </span>
    </p>
  );
}
