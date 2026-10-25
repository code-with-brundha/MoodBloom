/* Reminder preferences: defaults, storage (localStorage), validation and plain-language summaries.
 *
 * IMPORTANT: this only SAVES what the person prefers. MoodBloom does not send any notification yet
 * (no browser notifications, no background reminders, no push), and it never asks for notification
 * permission. The saved shape is deliberately simple so a real notification feature can read it later:
 * see getEnabledReminders() at the bottom.
 */
import { reminderOptions } from './planner.js';
import { formatTime } from './tasks.js';

// Own key, so it never touches journal / mood / goals / planner / profile / appearance / privacy data.
export const REMINDERS_STORAGE_KEY = 'moodbloom.reminders.v1';

/** Days use JavaScript's numbering (0 = Sunday ... 6 = Saturday); shown Monday-first. */
export const WEEK_DAYS = [
  { value: 1, short: 'Mon', long: 'Monday' },
  { value: 2, short: 'Tue', long: 'Tuesday' },
  { value: 3, short: 'Wed', long: 'Wednesday' },
  { value: 4, short: 'Thu', long: 'Thursday' },
  { value: 5, short: 'Fri', long: 'Friday' },
  { value: 6, short: 'Sat', long: 'Saturday' },
  { value: 0, short: 'Sun', long: 'Sunday' },
];
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
const WEEKDAYS = [1, 2, 3, 4, 5];
const WEEKENDS = [0, 6];

export const DAY_PRESETS = [
  { key: 'every', label: 'Every day', days: ALL_DAYS },
  { key: 'weekdays', label: 'Weekdays', days: WEEKDAYS },
  { key: 'weekends', label: 'Weekends', days: WEEKENDS },
];

/** Goal deadline reminders: how many days before the target date. */
export const GOAL_LEAD_OPTIONS = [
  { value: '0', label: 'On the due date' },
  { value: '1', label: '1 day before' },
  { value: '3', label: '3 days before' },
  { value: '7', label: '1 week before' },
];

/** Planner event reminders reuse the Planner's own intervals (minus "No reminder": the switch covers that). */
export const PLANNER_LEAD_OPTIONS = reminderOptions.filter((o) => o.value !== '');

export const REMINDER_TYPES = ['journal', 'mood', 'todo', 'goals', 'planner'];

/**
 * Everything starts switched OFF: reminders are opt-in, and nothing is sent yet anyway.
 * The times / days / intervals are sensible starting points that are kept even while a reminder is off.
 */
export const DEFAULT_REMINDERS = Object.freeze({
  journal: Object.freeze({ enabled: false, time: '20:00', days: ALL_DAYS }),
  mood: Object.freeze({ enabled: false, time: '09:00', days: ALL_DAYS }),
  todo: Object.freeze({ enabled: false, time: '08:30' }),
  goals: Object.freeze({ enabled: false, leadDays: '1' }),
  planner: Object.freeze({ enabled: false, leadMinutes: '10' }),
});

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
export const isValidTime = (value) => typeof value === 'string' && TIME_PATTERN.test(value);

const cleanDays = (days) =>
  Array.isArray(days)
    ? [...new Set(days.filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))].sort((a, b) => a - b)
    : null;

const cloneDefaults = () => JSON.parse(JSON.stringify(DEFAULT_REMINDERS));

/** Turns whatever came out of storage into a complete, safe reminders object (bad parts fall back to defaults). */
export function sanitizeReminders(raw) {
  const out = cloneDefaults();
  if (!raw || typeof raw !== 'object') return out;

  ['journal', 'mood', 'todo'].forEach((type) => {
    const r = raw[type];
    if (!r || typeof r !== 'object') return;
    if (typeof r.enabled === 'boolean') out[type].enabled = r.enabled;
    if (isValidTime(r.time)) out[type].time = r.time;
    if (type !== 'todo') {
      const days = cleanDays(r.days);
      if (days && days.length > 0) out[type].days = days;
    }
  });
  if (raw.goals && typeof raw.goals === 'object') {
    if (typeof raw.goals.enabled === 'boolean') out.goals.enabled = raw.goals.enabled;
    if (GOAL_LEAD_OPTIONS.some((o) => o.value === raw.goals.leadDays)) out.goals.leadDays = raw.goals.leadDays;
  }
  if (raw.planner && typeof raw.planner === 'object') {
    if (typeof raw.planner.enabled === 'boolean') out.planner.enabled = raw.planner.enabled;
    if (PLANNER_LEAD_OPTIONS.some((o) => o.value === raw.planner.leadMinutes)) {
      out.planner.leadMinutes = raw.planner.leadMinutes;
    }
  }
  return out;
}

export function loadReminders() {
  try {
    const raw = window.localStorage.getItem(REMINDERS_STORAGE_KEY);
    return sanitizeReminders(raw ? JSON.parse(raw) : null);
  } catch {
    return cloneDefaults(); // storage blocked, or the saved value was damaged
  }
}

/** Returns { ok: true } or { ok: false } when the browser refuses (private mode, storage full...). */
export function saveReminders(reminders) {
  try {
    // TODO (next step): also save reminder preferences to the user's Supabase profile.
    window.localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export function clearReminders() {
  try {
    window.localStorage.removeItem(REMINDERS_STORAGE_KEY);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export const defaultReminders = () => cloneDefaults();

const sameDays = (a, b) => a.length === b.length && a.every((d, i) => d === b[i]);

/** True when one reminder (e.g. 'journal') is identical in both objects. Used for the small "Unsaved" tags. */
export function isSameReminder(type, a, b) {
  const x = a[type];
  const y = b[type];
  return Object.keys(x).every((key) => (key === 'days' ? sameDays(x.days, y.days) : x[key] === y[key]));
}

/** True when nothing differs between two reminders objects. */
export const isSameReminders = (a, b) => REMINDER_TYPES.every((type) => isSameReminder(type, a, b));

/** Returns friendly errors keyed by reminder type, e.g. { journal: { time: '...', days: '...' } }. Empty = valid. */
export function validateReminders(reminders) {
  const errors = {};
  const add = (type, field, message) => {
    errors[type] = { ...errors[type], [field]: message };
  };

  ['journal', 'mood', 'todo'].forEach((type) => {
    const r = reminders[type];
    if (!r.time) add(type, 'time', 'Please choose a time.');
    else if (!isValidTime(r.time)) add(type, 'time', 'That time doesn’t look right. Try again, like 8:30 PM.');
    if (type !== 'todo' && (!Array.isArray(r.days) || r.days.length === 0)) {
      add(type, 'days', 'Pick at least one day.');
    }
  });
  if (!GOAL_LEAD_OPTIONS.some((o) => o.value === reminders.goals.leadDays)) {
    add('goals', 'leadDays', 'Please choose when to be reminded.');
  }
  if (!PLANNER_LEAD_OPTIONS.some((o) => o.value === reminders.planner.leadMinutes)) {
    add('planner', 'leadMinutes', 'Please choose a reminder interval.');
  }
  return errors;
}

/* --------------------------- plain-language text -------------------- */

export function describeDays(days) {
  const sorted = [...days].sort((a, b) => a - b);
  const match = DAY_PRESETS.find((p) => sameDays(p.days, sorted));
  if (match) return match.label;
  return WEEK_DAYS.filter((d) => days.includes(d.value))
    .map((d) => d.short)
    .join(', ');
}

export const goalLeadLabel = (value) => GOAL_LEAD_OPTIONS.find((o) => o.value === value)?.label ?? '';
export const plannerLeadLabel = (value) => PLANNER_LEAD_OPTIONS.find((o) => o.value === value)?.label ?? '';

/** One line describing a reminder, like "8:00 PM · Every day". Used for status chips. */
export function describeSchedule(type, r) {
  const time = isValidTime(r.time) ? formatTime(r.time) : 'time not set';
  switch (type) {
    case 'journal':
    case 'mood':
      return `${time} · ${r.days.length ? describeDays(r.days) : 'no days chosen'}`;
    case 'todo':
      return `${time} · Every day`;
    case 'goals':
      return goalLeadLabel(r.leadDays);
    case 'planner':
      return plannerLeadLabel(r.leadMinutes);
    default:
      return '';
  }
}

export const countEnabled = (reminders) => REMINDER_TYPES.filter((t) => reminders[t].enabled).length;

/**
 * For a future notification feature: only the reminders that are switched on, in one flat shape.
 * Turned-off reminders keep their settings but are NOT returned here, so they can never trigger.
 * Nothing calls this yet.
 */
export function getEnabledReminders(reminders) {
  return REMINDER_TYPES.filter((type) => reminders[type].enabled).map((type) => ({ type, ...reminders[type] }));
}
