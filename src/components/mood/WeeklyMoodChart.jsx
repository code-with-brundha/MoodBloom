import { useState } from 'react';
import Card from '../dashboard/Card.jsx';
import PeriodNav from './PeriodNav.jsx';
import { addDays, getRange, reachesToday, shiftAnchor, startOfWeek } from '../../utils/moodPeriods.js';
import { toDateInputValue } from '../../utils/dates.js';

// How "bright" each mood feels. Taller bar = brighter day. Purely for the chart.
const BRIGHTNESS = { happy: 5, grateful: 5, calm: 4, tired: 2, anxious: 2, sad: 1 };

/** Mon–Sun bar chart. Bar height = average brightness of that day's moods; emoji = latest mood. */
export default function WeeklyMoodChart({ logs, moods }) {
  const [anchor, setAnchor] = useState(() => new Date());
  const range = getRange('week', anchor);
  const moodByKey = Object.fromEntries(moods.map((m) => [m.key, m]));
  const todayKey = toDateInputValue();

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfWeek(anchor), i);
    const key = toDateInputValue(date);
    const dayLogs = logs.filter((l) => l.date === key);
    const latest = dayLogs.reduce((a, b) => (!a || b.id > a.id ? b : a), null);
    const average = dayLogs.length
      ? dayLogs.reduce((sum, l) => sum + BRIGHTNESS[l.mood], 0) / dayLogs.length
      : 0;
    return {
      key,
      label: date.toLocaleDateString(undefined, { weekday: 'short' }),
      mood: latest ? moodByKey[latest.mood] : null,
      count: dayLogs.length,
      height: (average / 5) * 100,
    };
  });

  // Most frequent mood this week.
  const counts = {};
  logs
    .filter((l) => l.date >= range.start && l.date <= range.end)
    .forEach((l) => {
      counts[l.mood] = (counts[l.mood] || 0) + 1;
    });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const topMood = top ? moodByKey[top[0]] : null;

  return (
    <Card title="Weekly mood chart" subtitle="Taller bars mean brighter days.">
      <PeriodNav
        label={range.label}
        onPrev={() => setAnchor((a) => shiftAnchor('week', a, -1))}
        onNext={() => setAnchor((a) => shiftAnchor('week', a, 1))}
        nextDisabled={reachesToday(range)}
      />

      <ul className="mt-5 grid grid-cols-7 gap-1.5 sm:gap-3">
        {days.map((day) => (
          <li key={day.key} className="flex flex-col items-center">
            <span className="sr-only">
              {day.label}: {day.mood ? `${day.mood.label}${day.count > 1 ? `, ${day.count} check-ins` : ''}` : 'no mood logged'}
            </span>
            <span className="h-7 text-xl sm:text-2xl" aria-hidden="true">
              {day.mood?.emoji ?? ''}
            </span>
            <div className="flex h-32 w-full items-end justify-center rounded-2xl bg-lilac-100/60 sm:h-40" aria-hidden="true">
              <div
                className={`w-full rounded-2xl ${
                  day.count ? 'bg-gradient-to-t from-blush-300 to-lilac-300' : 'bg-lilac-200/60'
                }`}
                style={{ height: day.count ? `${day.height}%` : '6px' }}
              />
            </div>
            <span
              aria-hidden="true"
              className={`mt-2 text-xs font-semibold sm:text-sm ${
                day.key === todayKey ? 'text-lilac-500' : 'text-ink-500'
              }`}
            >
              {day.label}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-5 rounded-2xl bg-lilac-100/70 px-4 py-3 text-sm text-ink-700">
        {topMood ? (
          <>
            Mostly <strong>{topMood.label.toLowerCase()}</strong> this week {topMood.emoji}
          </>
        ) : (
          'No moods logged this week yet.'
        )}
      </p>
    </Card>
  );
}
