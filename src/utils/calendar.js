import { toDateInputValue } from './dates.js';

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const firstOfMonth = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), 1);

export const monthLabel = (date) =>
  date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

/**
 * Cells for a Monday-first month grid: `null` for blank leading cells,
 * otherwise { key: 'YYYY-MM-DD', day: 1..31 }.
 */
export function buildMonthCells(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const leadingBlanks = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => ({
      key: toDateInputValue(new Date(year, month, i + 1)),
      day: i + 1,
    })),
  ];
}

/** Groups items that have a `date` field into { 'YYYY-MM-DD': [items] }. */
export function groupByDate(items) {
  return items.reduce((groups, item) => {
    (groups[item.date] ||= []).push(item);
    return groups;
  }, {});
}
