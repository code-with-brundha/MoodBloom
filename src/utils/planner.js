import { toDateInputValue } from './dates.js';
import { addDays } from './tasks.js';

/* ------------------------------------------------------------------ */
/* Weekly & Monthly Planner helpers: types, reminders, dates, storage  */
/* ------------------------------------------------------------------ */

export const PLANNER_STORAGE_KEY = 'moodbloom.planner.v1';

/** Event types. `chip` = soft badge, `dot` = small calendar indicator, `border` = accent bar. */
export const eventTypes = [
  { key: 'study', label: 'Study', emoji: '📚', chip: 'bg-lilac-100 text-ink-800', dot: 'bg-lilac-400', border: 'border-lilac-400', ring: 'border-lilac-300 bg-lilac-100' },
  { key: 'work', label: 'Work', emoji: '💼', chip: 'bg-sky-100 text-ink-800', dot: 'bg-sky-300', border: 'border-sky-300', ring: 'border-sky-300 bg-sky-100' },
  { key: 'personal', label: 'Personal', emoji: '🌸', chip: 'bg-blush-100 text-ink-800', dot: 'bg-blush-300', border: 'border-blush-300', ring: 'border-blush-300 bg-blush-100' },
  { key: 'health', label: 'Health', emoji: '🌿', chip: 'bg-emerald-100 text-ink-800', dot: 'bg-emerald-300', border: 'border-emerald-300', ring: 'border-emerald-300 bg-emerald-100' },
  { key: 'appointment', label: 'Appointment', emoji: '🗓️', chip: 'bg-amber-100 text-ink-800', dot: 'bg-amber-300', border: 'border-amber-300', ring: 'border-amber-300 bg-amber-100' },
  { key: 'other', label: 'Other', emoji: '✨', chip: 'bg-cream-200 text-ink-700', dot: 'bg-ink-500/60', border: 'border-ink-500/50', ring: 'border-lilac-200 bg-cream-200' },
];
export const eventTypeByKey = Object.fromEntries(eventTypes.map((t) => [t.key, t]));

/** Reminder preference = how long before the start time. Saved only; nothing is sent. */
export const reminderOptions = [
  { value: '', label: 'No reminder' },
  { value: '0', label: 'At start time' },
  { value: '5', label: '5 minutes before' },
  { value: '10', label: '10 minutes before' },
  { value: '15', label: '15 minutes before' },
  { value: '30', label: '30 minutes before' },
  { value: '60', label: '1 hour before' },
  { value: '1440', label: '1 day before' },
];
export const reminderLabel = (value) => reminderOptions.find((o) => o.value === value && value !== '')?.label ?? '';

export const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/* ------------------------------ storage ----------------------------- */

const str = (v) => (typeof v === 'string' ? v : '');

export function normalizeEvent(raw) {
  if (!raw || typeof raw !== 'object' || !raw.id || typeof raw.title !== 'string') return null;
  if (!isValidDateKey(str(raw.date))) return null;
  return {
    id: String(raw.id),
    title: raw.title,
    description: str(raw.description),
    type: eventTypeByKey[raw.type] ? raw.type : 'other',
    date: raw.date,
    startTime: str(raw.startTime),
    endTime: str(raw.endTime),
    reminder: reminderOptions.some((o) => o.value === raw.reminder) ? raw.reminder : '',
  };
}

export function loadEvents() {
  try {
    const raw = window.localStorage.getItem(PLANNER_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeEvent).filter(Boolean) : [];
  } catch {
    return [];
  }
}

/** true = saved, false = the browser refused (private mode, storage full...). */
export function saveEvents(events) {
  try {
    window.localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(events));
    return true;
  } catch {
    return false;
  }
}

/* ------------------------------- dates ------------------------------ */

const parseKey = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

/** True for a real calendar date written as "YYYY-MM-DD" (years 1900-2100). */
export function isValidDateKey(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  if (y < 1900 || y > 2100) return false;
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

/** Monday of the week that contains `key`. */
export const startOfWeek = (key) => addDays(key, -((parseKey(key).getDay() + 6) % 7));

/** The 7 date keys (Mon-Sun) of the week containing `key`. */
export const weekKeys = (key) => {
  const start = startOfWeek(key);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

/** Whole weeks covering the month of `key` (Mon-first), so dates and weekdays always line up. */
export function monthGridKeys(key) {
  const [y, m] = key.split('-').map(Number);
  const first = toDateInputValue(new Date(y, m - 1, 1));
  const last = toDateInputValue(new Date(y, m, 0));
  const start = startOfWeek(first);
  const end = addDays(startOfWeek(last), 6);
  const keys = [];
  for (let k = start; k <= end; k = addDays(k, 1)) keys.push(k);
  return keys;
}

/** Same day-of-month in another month; clamps (e.g. Jan 31 + 1 month = Feb 28). */
export function addMonths(key, amount) {
  const [y, m, d] = key.split('-').map(Number);
  const lastDay = new Date(y, m - 1 + amount + 1, 0).getDate();
  return toDateInputValue(new Date(y, m - 1 + amount, Math.min(d, lastDay)));
}

export const monthTitle = (key) =>
  parseKey(key).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

/** "Oct 19 – 25, 2026", "Oct 26 – Nov 1, 2026" or "Dec 28, 2026 – Jan 3, 2027". */
export function weekTitle(key) {
  const keys = weekKeys(key);
  const a = parseKey(keys[0]);
  const b = parseKey(keys[6]);
  const fmt = (d, opts) => d.toLocaleDateString(undefined, opts);
  if (a.getFullYear() !== b.getFullYear()) {
    const full = { month: 'short', day: 'numeric', year: 'numeric' };
    return `${fmt(a, full)} – ${fmt(b, full)}`;
  }
  if (a.getMonth() !== b.getMonth()) {
    return `${fmt(a, { month: 'short', day: 'numeric' })} – ${fmt(b, { month: 'short', day: 'numeric' })}, ${b.getFullYear()}`;
  }
  return `${fmt(a, { month: 'short', day: 'numeric' })} – ${b.getDate()}, ${b.getFullYear()}`;
}

export const weekdayName = (key) => parseKey(key).toLocaleDateString(undefined, { weekday: 'long' });
export const fullDateLabel = (key) =>
  parseKey(key).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

/* --------------------------- sorting & checks ----------------------- */

/** Chronological: earliest start first, then earliest end, then title. */
export const sortEvents = (list) =>
  [...list].sort(
    (a, b) =>
      a.startTime.localeCompare(b.startTime) ||
      (a.endTime || '99:99').localeCompare(b.endTime || '99:99') ||
      a.title.localeCompare(b.title),
  );

export const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** Friendly validation. Returns {} when everything is fine. */
export function validatePlan(values) {
  const errors = {};
  if (!values.title.trim()) errors.title = 'Give your plan a name.';
  if (!values.date) errors.date = 'Please choose a date.';
  else if (!isValidDateKey(values.date)) errors.date = 'That date doesn’t look right. Please pick a real date.';
  if (!values.startTime) errors.startTime = 'Please add a start time.';
  else if (!/^\d{2}:\d{2}$/.test(values.startTime)) errors.startTime = 'That time doesn’t look right.';
  if (values.endTime) {
    if (!/^\d{2}:\d{2}$/.test(values.endTime)) errors.endTime = 'That time doesn’t look right.';
    else if (values.startTime && values.endTime <= values.startTime) {
      errors.endTime = 'The end time needs to be after the start time.';
    }
  }
  return errors;
}
