import { toDateInputValue } from './dates.js';

/* ------------------------------------------------------------------ */
/* Bucket List helpers: categories, statuses, storage, sorting, checks */
/* ------------------------------------------------------------------ */

export const BUCKET_STORAGE_KEY = 'moodbloom.bucketlist.v1';

export const categories = [
  { key: 'travel', label: 'Travel', emoji: '✈️', chip: 'bg-sky-100 text-ink-800', ring: 'border-sky-300 bg-sky-100' },
  { key: 'skills', label: 'Skills to Learn', emoji: '🎨', chip: 'bg-lilac-100 text-ink-800', ring: 'border-lilac-300 bg-lilac-100' },
  { key: 'experiences', label: 'Life Experiences', emoji: '🎈', chip: 'bg-blush-100 text-ink-800', ring: 'border-blush-300 bg-blush-100' },
  { key: 'career', label: 'Career', emoji: '💼', chip: 'bg-cream-200 text-ink-700', ring: 'border-cream-200 bg-cream-200' },
  { key: 'growth', label: 'Personal Growth', emoji: '🌻', chip: 'bg-amber-100 text-ink-800', ring: 'border-amber-300 bg-amber-100' },
  { key: 'other', label: 'Other', emoji: '✨', chip: 'bg-white/90 text-ink-600', ring: 'border-lilac-200 bg-white' },
];
export const categoryByKey = Object.fromEntries(categories.map((c) => [c.key, c]));

/** `chip` = status badge, `card` = card surface, `accent` = the thin gradient strip on top of a card. */
export const statuses = [
  { key: 'planned', label: 'Planned', emoji: '🌱', chip: 'bg-lilac-100 text-ink-800', card: 'border-white/80 bg-white/70', accent: 'from-lilac-200 to-lilac-100' },
  { key: 'inprogress', label: 'In progress', emoji: '🚀', chip: 'bg-blush-200 text-ink-800', card: 'border-blush-200 bg-white/80', accent: 'from-blush-300 to-lilac-300' },
  {
    key: 'completed',
    label: 'Completed',
    emoji: '🎉',
    chip: 'bg-gradient-to-r from-blush-200 to-lilac-200 text-ink-800',
    card: 'border-lilac-200 bg-gradient-to-br from-blush-100/80 to-lilac-100/80',
    accent: 'from-blush-300 to-lilac-400',
  },
];
export const statusByKey = Object.fromEntries(statuses.map((s) => [s.key, s]));

export const sortOptions = [
  { key: 'recent', label: 'Recently added' },
  { key: 'target', label: 'Target date (soonest first)' },
];

/** A few gentle ideas for the empty state. Clicking one pre-fills the form. */
export const ideas = [
  { title: 'Watch the sunrise from a mountain', category: 'experiences' },
  { title: 'Visit a country I’ve never been to', category: 'travel' },
  { title: 'Learn to play an instrument', category: 'skills' },
];

export const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/* ------------------------------ dates ------------------------------- */

export function isValidDateKey(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  if (y < 1900 || y > 2100) return false;
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

const toUtc = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};
export const daysBetween = (from, to) => Math.round((toUtc(to) - toUtc(from)) / 86400000);

/**
 * Friendly note about a target date (only for dreams that aren't completed yet).
 * state: 'passed' | 'soon' | 'later'. Never harsh: a passed date is just a gentle nudge.
 */
export function getTargetInfo(item, today = toDateInputValue()) {
  if (item.status === 'completed' || !item.targetDate) return null;
  const days = daysBetween(today, item.targetDate);
  if (days < 0) return { state: 'passed', label: 'Target date passed. No rush, adjust it anytime.' };
  if (days === 0) return { state: 'soon', label: 'Target is today 🌟' };
  if (days === 1) return { state: 'soon', label: 'Target is tomorrow' };
  if (days <= 30) return { state: 'soon', label: `${days} days to go` };
  return { state: 'later', label: '' };
}

/* ------------------------------ storage ----------------------------- */

const str = (v) => (typeof v === 'string' ? v : '');

export function normalizeItem(raw) {
  if (!raw || typeof raw !== 'object' || !raw.id || typeof raw.title !== 'string') return null;
  const status = statusByKey[raw.status] ? raw.status : 'planned';
  return {
    id: String(raw.id),
    title: raw.title,
    description: str(raw.description),
    category: categoryByKey[raw.category] ? raw.category : 'other',
    targetDate: isValidDateKey(str(raw.targetDate)) ? raw.targetDate : '',
    notes: str(raw.notes),
    status,
    completedDate: status === 'completed' && isValidDateKey(str(raw.completedDate)) ? raw.completedDate : '',
    reflection: str(raw.reflection),
    createdAt: str(raw.createdAt),
  };
}

export function loadItems() {
  try {
    const raw = window.localStorage.getItem(BUCKET_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeItem).filter(Boolean) : [];
  } catch {
    return [];
  }
}

/** true = saved, false = the browser refused (private mode, storage full...). */
export function saveItems(items) {
  try {
    window.localStorage.setItem(BUCKET_STORAGE_KEY, JSON.stringify(items));
    return true;
  } catch {
    return false;
  }
}

/* ----------------------- stats, sorting, validation ----------------- */

export function getStats(items) {
  const count = (key) => items.filter((i) => i.status === key).length;
  const completed = count('completed');
  return {
    total: items.length,
    planned: count('planned'),
    inprogress: count('inprogress'),
    completed,
    percent: items.length === 0 ? 0 : Math.round((completed / items.length) * 100),
  };
}

export function sortItems(list, sort) {
  const copy = [...list];
  const byNewest = (a, b) => b.createdAt.localeCompare(a.createdAt);
  if (sort === 'target') {
    // Soonest first; dreams without a date ("someday") go last.
    return copy.sort((a, b) => {
      if (a.targetDate && b.targetDate) return a.targetDate.localeCompare(b.targetDate) || byNewest(a, b);
      if (a.targetDate) return -1;
      if (b.targetDate) return 1;
      return byNewest(a, b);
    });
  }
  return copy.sort(byNewest);
}

/** Friendly validation. Returns {} when everything is fine. */
export function validateItem(values, { isNew, today = toDateInputValue() }) {
  const errors = {};
  if (!values.title.trim()) errors.title = 'What’s the dream? Give it a name.';
  if (!categoryByKey[values.category]) errors.category = 'Please choose a category.';
  if (!statusByKey[values.status]) errors.status = 'Please choose a status.';

  if (values.targetDate) {
    if (!isValidDateKey(values.targetDate)) errors.targetDate = 'That date doesn’t look right. Please pick a real date.';
    else if (isNew && values.status !== 'completed' && values.targetDate < today) {
      errors.targetDate = 'Pick a date from today onwards, or leave it empty for “someday”.';
    }
  }

  if (values.status === 'completed') Object.assign(errors, validateCompletion(values, today));
  return errors;
}

export function validateCompletion(values, today = toDateInputValue()) {
  const errors = {};
  if (!values.completedDate) errors.completedDate = 'When did this dream come true?';
  else if (!isValidDateKey(values.completedDate)) errors.completedDate = 'That date doesn’t look right. Please pick a real date.';
  else if (values.completedDate > today) errors.completedDate = 'The completion date can’t be in the future.';
  return errors;
}
