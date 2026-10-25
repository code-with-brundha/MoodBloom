import Card from '../dashboard/Card.jsx';
import { scoreLabel } from '../../utils/insights.js';

const TREND_TEXT = {
  up: (p) => `Your mood looks brighter than last ${p}. 🌤️`,
  down: (p) => `This ${p} felt a little heavier than last. Be gentle with yourself. 🤍`,
  steady: (p) => `Pretty steady compared with last ${p}.`,
};

/** A short, friendly written summary of the selected week or month. */
export default function InsightsSummary({ insights, moodByKey }) {
  const { view, total, loggedDayCount, top, trend, score } = insights;
  const period = view === 'week' ? 'week' : 'month';
  const topMood = top ? moodByKey[top.mood] : null;

  return (
    <Card title={`${view === 'week' ? 'Weekly' : 'Monthly'} summary`} subtitle={insights.range.label}>
      {total === 0 ? (
        <p className="rounded-2xl bg-lilac-100/60 px-4 py-8 text-center text-ink-600">
          No moods logged this {period} yet. Check in on the Mood Tracker and your summary will bloom here. 🌱
        </p>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <span
            aria-hidden="true"
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blush-200 to-lilac-200 text-3xl shadow-sm"
          >
            {topMood.emoji}
          </span>
          <div className="text-ink-700">
            <p className="leading-relaxed">
              You logged <strong>{total}</strong> {total === 1 ? 'mood' : 'moods'} across{' '}
              <strong>{loggedDayCount}</strong> {loggedDayCount === 1 ? 'day' : 'days'}.{' '}
              <strong>{topMood.label}</strong> showed up most often, and your overall mood felt{' '}
              <strong>{scoreLabel(score).toLowerCase()}</strong>.
            </p>
            {trend && <p className="mt-1 text-sm font-semibold text-ink-500">{TREND_TEXT[trend](period)}</p>}
          </div>
        </div>
      )}
    </Card>
  );
}
