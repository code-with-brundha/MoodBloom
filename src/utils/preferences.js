/* Privacy & Journal preferences: demo storage (localStorage) + a tiny shared store.
 *
 * Any component can call usePreferences() and re-renders when a preference changes,
 * so no provider has to be added to main.jsx. These are display preferences only:
 * they change what the interface shows, never the journal or mood data itself.
 */
import { useSyncExternalStore } from 'react';

// Own key, so it never touches journal / mood / goals / planner / bucket list / profile / appearance data.
export const PREFERENCES_STORAGE_KEY = 'moodbloom.preferences.v1';

export const JOURNAL_SORTS = ['newest', 'oldest'];

export const DEFAULT_PREFERENCES = Object.freeze({
  showPrivacyReminder: true, // gentle note on the My Journal page
  hidePreviews: false, // hide entry titles / text / mood notes on summary cards
  showMoodSummary: true, // "This week's moods" card on the dashboard
  confirmDelete: true, // ask before deleting journal entries and mood records
  journalSort: 'newest', // order of the My Journal list
  showDailyPrompt: true, // daily writing prompt card on the dashboard
});

/** Turns whatever came out of storage into a complete, valid preferences object. */
export function sanitizePreferences(raw) {
  const prefs = { ...DEFAULT_PREFERENCES };
  if (raw && typeof raw === 'object') {
    Object.keys(DEFAULT_PREFERENCES).forEach((key) => {
      if (key === 'journalSort') {
        if (JOURNAL_SORTS.includes(raw.journalSort)) prefs.journalSort = raw.journalSort;
      } else if (typeof raw[key] === 'boolean') {
        prefs[key] = raw[key];
      }
    });
  }
  return prefs;
}

const listeners = new Set();
let cache = null; // the current preferences object (kept stable between changes)

function readFromStorage() {
  try {
    const raw = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
    return sanitizePreferences(raw ? JSON.parse(raw) : null);
  } catch {
    // Storage blocked, or the saved value was damaged: fall back to the defaults.
    return { ...DEFAULT_PREFERENCES };
  }
}

export function getPreferences() {
  if (!cache) cache = readFromStorage();
  return cache;
}

const emit = () => listeners.forEach((listener) => listener());

/** Change one or more preferences. Returns { ok } (ok is false if the browser would not store it). */
export function updatePreferences(patch) {
  cache = sanitizePreferences({ ...getPreferences(), ...patch });
  let ok = true;
  try {
    // TODO (next step): save preferences to the user's Supabase profile as well.
    window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(cache));
  } catch {
    ok = false; // still applied for this visit, just not remembered
  }
  emit();
  return { ok };
}

export function resetPreferences() {
  cache = { ...DEFAULT_PREFERENCES };
  let ok = true;
  try {
    window.localStorage.removeItem(PREFERENCES_STORAGE_KEY);
  } catch {
    ok = false;
  }
  emit();
  return { ok };
}

export const isDefaultPreferences = (prefs) =>
  Object.keys(DEFAULT_PREFERENCES).every((key) => prefs[key] === DEFAULT_PREFERENCES[key]);

function subscribe(listener) {
  listeners.add(listener);
  // Another tab changed the preferences: re-read them.
  const onStorage = (event) => {
    if (event.key === PREFERENCES_STORAGE_KEY || event.key === null) {
      cache = null;
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

/** Current preferences. Re-renders the component whenever they change. */
export function usePreferences() {
  return useSyncExternalStore(subscribe, getPreferences, () => DEFAULT_PREFERENCES);
}
