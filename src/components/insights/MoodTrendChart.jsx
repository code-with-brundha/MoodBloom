import { useState } from 'react';
import Card from '../dashboard/Card.jsx';
import { formatEntryDate } from '../../utils/dates.js';

// Maps a score (1 to 5) to a height inside the chart, leaving a little padding top and bottom.
const toPercent = (score) => 8 + ((score - 1) / 4) * 84;
const GUIDES = [
  { score: 5, label: 'Bright' },
  { score: 3, label: 'Okay' },
  { score: 1, label: 'Low' },
];

/**
 * Line chart of the daily mood score across the week or month.
 * Built with one stretched SVG (line + soft fill) and positioned buttons for the dots,
 * so it scales smoothly. The month view scrolls sideways on narrow phones instead of squashing.
 */
export default function MoodTrendChart({ days, view, moodByKey }) {
  const [selectedKey, setSelectedKey] = useState(null);
  const count = days.length;
  const xPercent = (i) => ((i + 0.5) / count) * 100;
  const points = days.map((d, i) => (d.score === null ? null : { i, x: xPercent(i), y: 100 - toPercent(d.score) }));
  const hasData = points.some(Boolean);

  // Split into runs of consecutive logged days so days with no check-in leave a gap in the line.
  const runs = [];
  points.forEach((p) => {
    if (!p) return runs.push([]);
    if (!runs.length) runs.push([]);
    runs[runs.length - 1].push(p);
  });
  const linePath = (run) => run.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ');
  const areaPath = (run) => `${linePath(run)} L${run[run.length - 1].x} 100 L${run[0].x} 100 Z`;

  const selected = days.find((d) => d.key === selectedKey && d.logs.length);
  const showLabel = (d) => (view === 'week' ? true : d.date.getDate() === 1 || d.date.getDate() % 5 === 0);

  return (
    <Card title="Mood pattern" subtitle="Higher points mean brighter days. Tap a dot to see that day.">
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div className={view === 'month' ? 'min-w-[520px]' : ''}>
          <div className="flex gap-2">
            {/* Left labels */}
            <div className="relative h-48 w-11 shrink-0 sm:h-56" aria-hidden="true">
              {GUIDES.map((g) => (
                <span
                  key={g.score}
                  className="absolute right-0 translate-y-1/2 text-[11px] font-semibold text-ink-500"
                  style={{ bottom: `${toPercent(g.score)}%` }}
                >
                  {g.label}
                </span>
              ))}
            </div>

            {/* Plot area */}
            <div className="relative h-48 flex-1 rounded-2xl bg-lilac-100/40 sm:h-56">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="insightsArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" style={{ stopColor: 'rgb(var(--c-lilac-300))' }} stopOpacity="0.55" />
                    <stop offset="100%" style={{ stopColor: 'rgb(var(--c-blush-200))' }} stopOpacity="0" />
                  </linearGradient>
                </defs>
                {GUIDES.map((g) => (
                  <line
                    key={g.score}
                    x1="0"
                    x2="100"
                    y1={100 - toPercent(g.score)}
                    y2={100 - toPercent(g.score)}
                    style={{ stroke: 'rgb(var(--c-lilac-200))' }}
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
                {runs
                  .filter((r) => r.length > 1)
                  .map((run) => (
                    <g key={run[0].i}>
                      <path d={areaPath(run)} fill="url(#insightsArea)" />
                      <path
                        d={linePath(run)}
                        fill="none"
                        style={{ stroke: 'rgb(var(--c-lilac-400))' }}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    </g>
                  ))}
              </svg>

              {days.map((d, i) => {
                if (d.score === null) return null;
                const mood = moodByKey[d.latest.mood];
                const active = d.key === selectedKey;
                return (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => setSelectedKey(active ? null : d.key)}
                    aria-pressed={active}
                    aria-label={`${formatEntryDate(d.key)}: ${mood.label}${d.logs.length > 1 ? `, ${d.logs.length} check-ins` : ''}`}
                    className={`group absolute flex -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full ${
                      view === 'week' ? 'h-8 w-8' : 'h-5 w-5'
                    }`}
                    style={{ left: `${xPercent(i)}%`, bottom: `${toPercent(d.score)}%` }}
                  >
                    <span
                      className={`block rounded-full border-2 border-white shadow-sm transition ${
                        active
                          ? 'h-4 w-4 bg-blush-400'
                          : `bg-lilac-400 group-hover:bg-blush-300 ${view === 'week' ? 'h-3.5 w-3.5' : 'h-2.5 w-2.5'}`
                      }`}
                    />
                  </button>
                );
              })}

              {!hasData && (
                <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm font-semibold text-ink-500">
                  No moods logged in this period. 🌱
                </p>
              )}
            </div>
          </div>

          {/* Bottom labels */}
          <div className="mt-2 flex gap-2" aria-hidden="true">
            <div className="w-11 shrink-0" />
            <div className={`relative flex-1 ${view === 'week' ? 'h-12' : 'h-5'}`}>
              {days.map((d, i) =>
                showLabel(d) ? (
                  <span
                    key={d.key}
                    className="absolute flex -translate-x-1/2 flex-col items-center text-xs font-semibold text-ink-500 sm:text-sm"
                    style={{ left: `${xPercent(i)}%` }}
                  >
                    {view === 'week' ? d.date.toLocaleDateString(undefined, { weekday: 'short' }) : d.date.getDate()}
                    {view === 'week' && <span className="mt-0.5 h-6 text-lg">{d.latest ? moodByKey[d.latest.mood].emoji : ''}</span>}
                  </span>
                ) : null,
              )}
            </div>
          </div>
        </div>
      </div>

      <div role="status" className="mt-4 rounded-2xl bg-lilac-100/70 px-4 py-3 text-sm text-ink-700">
        {selected ? (
          <>
            <p className="font-bold text-ink-800">{formatEntryDate(selected.key)}</p>
            <ul className="mt-1 space-y-0.5">
              {selected.logs.map((l) => (
                <li key={l.id}>
                  {moodByKey[l.mood].emoji} <strong>{moodByKey[l.mood].label}</strong>
                  {l.note ? <span className="text-ink-600">: {l.note}</span> : null}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <span className="text-ink-600">Pick a dot on the chart to see how that day felt.</span>
        )}
      </div>
    </Card>
  );
}

