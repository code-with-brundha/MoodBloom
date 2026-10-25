const pad = (n) => String(n).padStart(2, '0');

/** Date -> "YYYY-MM-DD" in the user's local time (the format <input type="date"> uses). */
export const toDateInputValue = (date = new Date()) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** "YYYY-MM-DD" -> "Tue, Oct 21, 2026" (parsed as a local date, so no timezone shift). */
export const formatEntryDate = (value) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
