import { useMemo, useState } from 'react';
import Card from '../dashboard/Card.jsx';
import PeriodNav from './PeriodNav.jsx';
import MoodRecord from './MoodRecord.jsx';
import { getRange, reachesToday, shiftAnchor } from '../../utils/moodPeriods.js';

const VIEWS = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
];

/** Mood history with Day / Week / Month filters and a back/forward navigator. */
export default function MoodHistory({ logs, moods, onEdit, onDelete }) {
  const [view, setView] = useState('week');
  const [anchor, setAnchor] = useState(() => new Date());
  const range = getRange(view, anchor);
  const moodByKey = Object.fromEntries(moods.map((m) => [m.key, m]));

  const records = useMemo(
    () =>
      logs
        .filter((l) => l.date >= range.start && l.date <= range.end)
        .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id),
    [logs, range.start, range.end],
  );

  return (
    <Card title="Mood history" subtitle="Look back at how you've been feeling.">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="View by" className="grid grid-cols-3 rounded-full bg-lilac-100/70 p-1 sm:w-64">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              type="button"
              aria-pressed={view === v.key}
              onClick={() => setView(v.key)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                view === v.key ? 'bg-white text-ink-800 shadow-sm' : 'text-ink-600 hover:text-ink-800'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <PeriodNav
          label={range.label}
          onPrev={() => setAnchor((a) => shiftAnchor(view, a, -1))}
          onNext={() => setAnchor((a) => shiftAnchor(view, a, 1))}
          nextDisabled={reachesToday(range)}
        />
      </div>

      <p role="status" className="mt-4 text-sm font-semibold text-ink-500">
        {records.length} {records.length === 1 ? 'record' : 'records'}
      </p>

      {records.length > 0 ? (
        <ul className="mt-3 space-y-3">
          {records.map((record) => (
            <MoodRecord
              key={record.id}
              record={record}
              mood={moodByKey[record.mood]}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-2xl bg-lilac-100/60 px-4 py-8 text-center text-ink-600">
          No moods logged for this {view}. 🌱
        </p>
      )}
    </Card>
  );
}
