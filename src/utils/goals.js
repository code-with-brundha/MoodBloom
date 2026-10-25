import { toDateInputValue } from './dates.js';

/* ------------------------------------------------------------------ */
/* Goal Planner helpers: categories, localStorage, progress, deadlines */
/* ------------------------------------------------------------------ */

export const GOALS_STORAGE_KEY = 'moodbloom.goals.v1';

/** Goal categories. `chip` styles the small badge, `ring` styles the selected form button. */
export const categories = [
  { key: 'personal', label: 'Personal', emoji: '🌸', chip: 'bg-blush-100 text-ink-800', ring: 'border-blush-300 bg-blush-100' },
  { key: 'studies', label: 'Studies', emoji: '📚', chip: 'bg-lilac-100 text-ink-800', ring: 'border-lilac-300 bg-lilac-100' },
  { key: 'career', label: 'Career', emoji: '💼', chip: 'bg-cream-200 text-ink-700', ring: 'border-cream-200 bg-cream-200' },
  { key: 'health', label: 'Health', emoji: '🌿', chip: 'bg-lilac-200 text-ink-800', ring: 'border-lilac-300 bg-lilac-200' },
  { key: 'other', label: 'Other', emoji: '✨', chip: 'bg-white/90 text-ink-600', ring: 'border-lilac-200 bg-white' },
];
export const categoryByKey = Object.fromEntries(categories.map((c) => [c.key, c]));

export const STATUSES = ['active', 'completed', 'archived'];

/** Short unique id (works in every browser, even without crypto.randomUUID). */
export const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/* ------------------------------ storage ----------------------------- */

const str = (v, fallback = '') => (typeof v === 'string' ? v : fallback);

/** Makes sure whatever was stored in localStorage is safe to render. */
export function normalizeGoal(raw) {
  if (!raw || typeof raw !== 'object' || !raw.id || typeof raw.title !== 'string') return null;
  return {
    id: String(raw.id),
    title: raw.title,
    description: str(raw.description),
    category: categoryByKey[raw.category] ? raw.category : 'other',
    startDate: str(raw.startDate),
    targetDate: str(raw.targetDate),
    status: STATUSES.includes(raw.status) ? raw.status : 'active',
    createdAt: str(raw.createdAt),
    completedAt: raw.completedAt ? str(raw.completedAt) : null,
    archivedAt: raw.archivedAt ? str(raw.archivedAt) : null,
    milestones: (Array.isArray(raw.milestones) ? raw.milestones : [])
      .filter((m) => m && m.id && typeof m.title === 'string')
      .map((m) => ({ id: String(m.id), title: m.title, completed: Boolean(m.completed) })),
    linkedTasks: (Array.isArray(raw.linkedTasks) ? raw.linkedTasks : [])
      .filter((t) => t && t.id && typeof t.title === 'string')
      .map((t) => ({ id: String(t.id), title: t.title, date: str(t.date), completed: Boolean(t.completed) })),
  };
}

export function loadGoals() {
  try {
    const raw = window.localStorage.getItem(GOALS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeGoal).filter(Boolean) : [];
  } catch {
    return []; // storage blocked or data unreadable: start fresh instead of crashing
  }
}

/** Returns true when saved, false when the browser refused (private mode, storage full...). */
export function saveGoals(goals) {
  try {
    window.localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
    return true;
  } catch {
    return false;
  }
}

/* ----------------------------- progress ----------------------------- */

/**
 * Progress is based ONLY on milestones. `percent` is null when a goal has no
 * steps yet, so the UI can ask for steps instead of showing a misleading 0%.
 */
export function getProgress(goal) {
  const total = goal.milestones.length;
  const done = goal.milestones.filter((m) => m.completed).length;
  return { total, done, percent: total === 0 ? null : Math.round((done / total) * 100) };
}

/** Steps done / steps total across a list of goals (goals without steps are ignored). */
export function getOverallProgress(goals) {
  let done = 0;
  let total = 0;
  let goalsWithSteps = 0;
  goals.forEach((g) => {
    const p = getProgress(g);
    if (p.total > 0) goalsWithSteps += 1;
    done += p.done;
    total += p.total;
  });
  return { done, total, goalsWithSteps, percent: total === 0 ? null : Math.round((done / total) * 100) };
}

/* ----------------------------- deadlines ---------------------------- */

const toUtc = (value) => {
  const [y, m, d] = value.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};

/** Whole days from `from` to `to` ("YYYY-MM-DD"). Negative when `to` is in the past. */
export const daysBetween = (from, to) => Math.round((toUtc(to) - toUtc(from)) / 86400000);

export const SOON_DAYS = 7;

/** state: 'overdue' | 'today' | 'soon' | 'later'. */
export function getDeadline(targetDate, today = toDateInputValue()) {
  const days = daysBetween(today, targetDate);
  if (days < 0) {
    const n = Math.abs(days);
    return { days, state: 'overdue', label: `Overdue by ${n} ${n === 1 ? 'day' : 'days'}` };
  }
  if (days === 0) return { days, state: 'today', label: 'Due today' };
  if (days === 1) return { days, state: 'soon', label: 'Due tomorrow' };
  if (days <= SOON_DAYS) return { days, state: 'soon', label: `Due in ${days} days` };
  return { days, state: 'later', label: `${days} days to go` };
}

export const deadlineChip = {
  overdue: 'bg-blush-200 text-ink-800',
  today: 'bg-lilac-200 text-ink-800',
  soon: 'bg-lilac-200 text-ink-800',
  later: 'bg-white/80 text-ink-600',
};

/* ----------------------- sorting, stats, validation ----------------- */

export function sortGoals(list, status) {
  const copy = [...list];
  if (status === 'active') return copy.sort((a, b) => a.targetDate.localeCompare(b.targetDate));
  const key = status === 'completed' ? 'completedAt' : 'archivedAt';
  return copy.sort((a, b) => (b[key] || '').localeCompare(a[key] || ''));
}

export function getStats(goals, today = toDateInputValue()) {
  const active = goals.filter((g) => g.status === 'active');
  const completed = goals.filter((g) => g.status === 'completed');
  const archived = goals.filter((g) => g.status === 'archived');
  const overdue = active.filter((g) => g.targetDate && g.targetDate < today);
  const dueSoon = active.filter((g) => {
    if (!g.targetDate) return false;
    const days = daysBetween(today, g.targetDate);
    return days >= 0 && days <= SOON_DAYS;
  });
  return {
    total: goals.length,
    active,
    completed,
    archived,
    overdue,
    dueSoon,
    overall: getOverallProgress([...active, ...completed]),
  };
}

/** Returns an object of error messages (empty object = valid). */
export function validateGoal(values, { isNew, today = toDateInputValue() }) {
  const errors = {};
  if (!values.title.trim()) errors.title = 'Give your goal a name.';
  if (!categoryByKey[values.category]) errors.category = 'Please choose a category.';
  if (!values.startDate) errors.startDate = 'Please choose a start date.';
  if (!values.targetDate) {
    errors.targetDate = 'Please choose a target date.';
  } else if (values.startDate && values.targetDate < values.startDate) {
    errors.targetDate = 'The target date can’t be before the start date.';
  } else if (isNew && values.targetDate < today) {
    errors.targetDate = 'Pick a target date from today onwards.';
  }
  return errors;
}
