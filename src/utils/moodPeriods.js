// Date helpers for the Mood Tracker's day / week / month views.
// Weeks run Monday to Sunday. All dates are local "YYYY-MM-DD" strings or local Date objects.
import { toDateInputValue } from './dates.js';

const format = (date, options) => date.toLocaleDateString(undefined, options);

export const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const addDays = (date, n) => {
  const d = startOfDay(date);
  d.setDate(d.getDate() + n);
  return d;
};

export const startOfWeek = (date) => addDays(date, -((date.getDay() + 6) % 7));

/** Returns { start, end, label } for the view ('day' | 'week' | 'month') around `anchor`. */
export function getRange(view, anchor) {
  if (view === 'day') {
    const day = startOfDay(anchor);
    return {
      start: toDateInputValue(day),
      end: toDateInputValue(day),
      label: format(day, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
    };
  }
  if (view === 'week') {
    const start = startOfWeek(anchor);
    const end = addDays(start, 6);
    return {
      start: toDateInputValue(start),
      end: toDateInputValue(end),
      label: `${format(start, { month: 'short', day: 'numeric' })} – ${format(end, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}`,
    };
  }
  const start = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const end = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);
  return {
    start: toDateInputValue(start),
    end: toDateInputValue(end),
    label: format(start, { month: 'long', year: 'numeric' }),
  };
}

/** Move the anchor one day / week / month back (-1) or forward (+1). */
export function shiftAnchor(view, anchor, direction) {
  if (view === 'day') return addDays(anchor, direction);
  if (view === 'week') return addDays(anchor, 7 * direction);
  return new Date(anchor.getFullYear(), anchor.getMonth() + direction, 1);
}

/** True when the range already reaches today, so "next" would go into the future. */
export const reachesToday = (range) => range.end >= toDateInputValue(new Date());
