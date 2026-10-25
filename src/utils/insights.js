// Calculations for the Mood Insights page. Pure functions, so they're easy to reuse with
// real data later: pass in an array of { id, date: 'YYYY-MM-DD', mood, note } records.
import { toDateInputValue } from './dates.js';
import { addDays, getRange, shiftAnchor } from './moodPeriods.js';
import { reflectionPrompts } from '../data/reflectionPrompts.js';

// How "bright" each mood feels (1 to 5). Same scale the Mood Tracker chart uses.
export const BRIGHTNESS = { happy: 5, grateful: 5, calm: 4, tired: 2, anxious: 2, sad: 1 };
export const POSITIVE_MOODS = ['happy', 'grateful', 'calm'];
const HEAVY_MOODS = ['tired', 'anxious', 'sad'];

const parseKey = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const average = (nums) => (nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : null);

/** All 'YYYY-MM-DD' keys from range.start to range.end. */
function getDayKeys(range) {
  const keys = [];
  const end = parseKey(range.end);
  for (let d = parseKey(range.start); d <= end; d = addDays(d, 1)) keys.push(toDateInputValue(d));
  return keys;
}

/**
 * Everything the page needs for one week or month.
 * view: 'week' | 'month'. anchor: any Date inside the period.
 */
export function buildInsights(logs, view, anchor) {
  const range = getRange(view, anchor);
  const prevRange = getRange(view, shiftAnchor(view, anchor, -1));
  const todayKey = toDateInputValue();
  const within = (r) => (l) => l.date >= r.start && l.date <= r.end;

  const current = logs.filter(within(range));
  const previous = logs.filter(within(prevRange));

  // One item per calendar day in the period.
  const days = getDayKeys(range).map((key) => {
    const dayLogs = current.filter((l) => l.date === key).sort((a, b) => a.id - b.id);
    return {
      key,
      date: parseKey(key),
      logs: dayLogs,
      latest: dayLogs[dayLogs.length - 1] || null,
      score: average(dayLogs.map((l) => BRIGHTNESS[l.mood])),
      isFuture: key > todayKey,
    };
  });
  const loggedDays = days.filter((d) => d.logs.length);

  // Mood counts, most common first.
  const counts = {};
  current.forEach((l) => {
    counts[l.mood] = (counts[l.mood] || 0) + 1;
  });
  const ranked = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([mood, count]) => ({ mood, count, share: Math.round((count / current.length) * 100) }));

  // Average mood score, and how it compares with the previous period.
  const score = average(current.map((l) => BRIGHTNESS[l.mood]));
  const prevScore = average(previous.map((l) => BRIGHTNESS[l.mood]));
  let trend = null; // 'up' | 'down' | 'steady' | null (nothing to compare with)
  if (score !== null && prevScore !== null) {
    trend = score - prevScore > 0.25 ? 'up' : score - prevScore < -0.25 ? 'down' : 'steady';
  }

  // Longest run of consecutive days with a check-in.
  let streak = 0;
  let run = 0;
  days.forEach((d) => {
    run = d.logs.length ? run + 1 : 0;
    streak = Math.max(streak, run);
  });

  // Brightest day: highest score, then a day with a note, then the most recent.
  const bestDay = [...loggedDays].sort(
    (a, b) =>
      b.score - a.score ||
      Number(b.logs.some((l) => l.note)) - Number(a.logs.some((l) => l.note)) ||
      b.key.localeCompare(a.key),
  )[0] || null;

  // Latest time a heavy day (anxious or sad) was followed by a bright day.
  let bounceBack = null;
  for (let i = 0; i < days.length - 1; i += 1) {
    const [a, b] = [days[i], days[i + 1]];
    if (a.latest && b.score >= 4 && ['anxious', 'sad'].includes(a.latest.mood)) bounceBack = { from: a, to: b };
  }

  const positiveLogs = current.filter((l) => POSITIVE_MOODS.includes(l.mood));
  const brightMoments = positiveLogs
    .filter((l) => l.note)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
    .slice(0, 3);

  return {
    range,
    view,
    total: current.length,
    previousTotal: previous.length,
    days,
    loggedDayCount: loggedDays.length,
    elapsedDayCount: days.filter((d) => !d.isFuture).length,
    ranked,
    top: ranked[0] || null,
    score,
    trend,
    positiveDayCount: loggedDays.filter((d) => d.score >= 4).length,
    positiveCount: positiveLogs.length,
    hasHeavyMoods: current.some((l) => HEAVY_MOODS.includes(l.mood)),
    streak,
    bestDay,
    bounceBack,
    brightMoments,
  };
}

/** Friendly word for an average score. */
export const scoreLabel = (score) =>
  score === null ? 'No data yet' : score >= 4.2 ? 'Bright' : score >= 3.4 ? 'Pretty good' : score >= 2.6 ? 'Mixed' : 'Tender';

/** Short positive highlights, built from the numbers. Returns [{ emoji, title, text }]. */
export function buildHighlights(insights, moodByKey) {
  const { total, view, positiveCount, bestDay, loggedDayCount, elapsedDayCount, streak, bounceBack } = insights;
  if (!total) return [];
  const list = [];
  const dayName = (d) => d.date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

  list.push({
    emoji: '🌼',
    title: `${positiveCount} bright ${positiveCount === 1 ? 'moment' : 'moments'}`,
    text: `${Math.round((positiveCount / total) * 100)}% of your check-ins were happy, grateful or calm.`,
  });

  if (bestDay) {
    const mood = moodByKey[bestDay.latest.mood];
    list.push({
      emoji: '☀️',
      title: 'Your brightest day',
      text: `${dayName(bestDay)}, feeling ${mood.label.toLowerCase()} ${mood.emoji}.`,
    });
  }

  if (bounceBack) {
    list.push({
      emoji: '🌱',
      title: 'You bounced back',
      text: `After a ${moodByKey[bounceBack.from.latest.mood].label.toLowerCase()} day, you felt ${moodByKey[bounceBack.to.latest.mood].label.toLowerCase()} the next. That takes strength.`,
    });
  }

  list.push({
    emoji: '📅',
    title: `Checked in on ${loggedDayCount} of ${elapsedDayCount} days`,
    text:
      streak >= 3
        ? `Including a ${streak}-day streak. Lovely consistency.`
        : `Every check-in helps you know yourself a little better this ${view}.`,
  });

  return list.slice(0, 4);
}

/** Prompt pool tuned to the period: the top mood's prompts, gentle ones if it was heavy, plus general ones. */
export function getPromptPool(insights) {
  const pool = [
    ...(reflectionPrompts[insights.top?.mood] || []),
    ...(insights.hasHeavyMoods ? reflectionPrompts.gentle : []),
    ...reflectionPrompts.general,
  ];
  return [...new Set(pool)];
}
