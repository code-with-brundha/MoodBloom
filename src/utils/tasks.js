import { toDateInputValue } from './dates.js';

/** "YYYY-MM-DD" + n days -> "YYYY-MM-DD" (local time, so no timezone shift). */
export const addDays = (value, amount) => {
  const [y, m, d] = value.split('-').map(Number);
  return toDateInputValue(new Date(y, m - 1, d + amount));
};

/** "YYYY-MM-DD" -> "Tuesday, October 21" (adds the year when it isn't this year). */
export const formatLongDate = (value) => {
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const sameYear = date.getFullYear() === new Date().getFullYear();
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
};

/** "14:30" -> "2:30 PM" (uses the browser's locale). */
export const formatTime = (value) => {
  if (!value) return '';
  const [h, min] = value.split(':').map(Number);
  return new Date(2000, 0, 1, h, min).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
};

/** Priority options. `chip` styles the small badge, `ring` styles the selected form button. */
export const priorities = [
  { key: 'high', label: 'High', emoji: '🌷', chip: 'bg-blush-200 text-ink-800', ring: 'border-blush-300 bg-blush-100' },
  { key: 'medium', label: 'Medium', emoji: '🌼', chip: 'bg-lilac-200 text-ink-800', ring: 'border-lilac-300 bg-lilac-100' },
  { key: 'low', label: 'Low', emoji: '🍃', chip: 'bg-cream-200 text-ink-600', ring: 'border-cream-200 bg-cream-200' },
];

export const priorityByKey = Object.fromEntries(priorities.map((p) => [p.key, p]));
const priorityRank = { high: 0, medium: 1, low: 2 };

/** Tasks with a time come first (earliest first), then untimed tasks by priority. */
export const sortTasks = (tasks) =>
  [...tasks].sort((a, b) => {
    if (a.time && b.time) return a.time.localeCompare(b.time);
    if (a.time) return -1;
    if (b.time) return 1;
    return priorityRank[a.priority] - priorityRank[b.priority] || a.id - b.id;
  });
