import { useState } from 'react';
import { usePreferences } from './preferences.js';

/**
 * "Hide previews" helper for summary cards.
 * `hidden` is true while previews should be hidden (the text is not rendered at all, not just blurred).
 * The person can tap "Show for now" to peek; that resets whenever the page is reloaded.
 */
export function usePrivateView() {
  const { hidePreviews } = usePreferences();
  const [revealed, setRevealed] = useState(false);
  return {
    enabled: hidePreviews,
    hidden: hidePreviews && !revealed,
    revealed,
    toggle: () => setRevealed((v) => !v),
  };
}

/** Stand-in shown instead of hidden personal text. */
export function HiddenNote({ className = '' }) {
  return (
    <span className={`italic text-ink-600 ${className}`}>
      <span aria-hidden="true">🔒</span> Hidden for privacy
    </span>
  );
}

/** Small button that shows / hides the previews on one card. Renders nothing when hiding is off. */
export function RevealButton({ view, className = '' }) {
  if (!view.enabled) return null;
  return (
    <button
      type="button"
      onClick={view.toggle}
      aria-pressed={view.revealed}
      className={`rounded-full px-3 py-1.5 text-sm font-bold text-ink-700 underline underline-offset-4 transition hover:bg-lilac-100 ${className}`}
    >
      {view.revealed ? 'Hide again' : 'Show for now'}
    </button>
  );
}
