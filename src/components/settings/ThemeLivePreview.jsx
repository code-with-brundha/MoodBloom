import { useId, useState } from 'react';
import Scene, { hasScene } from '../../theme/scenes/index.jsx';

const MOODS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '🥰', label: 'Grateful' },
  { emoji: '😴', label: 'Tired' },
];

/**
 * A miniature MoodBloom screen drawn with the site's real Tailwind classes.
 * Wrapping it in data-theme="..." makes it use that theme's colours without changing the rest of the page,
 * so it can show any theme as a live preview. The sample controls really work.
 */
export function MiniApp() {
  const uid = useId();
  const [mood, setMood] = useState('Calm');
  const [tasks, setTasks] = useState([
    { id: 'a', label: 'Write three lines in my journal', done: true },
    { id: 'b', label: 'Take a short walk', done: false },
  ]);
  const doneCount = tasks.filter((t) => t.done).length;
  const percent = Math.round((doneCount / tasks.length) * 100);

  return (
    <div className="flex gap-3 text-left">
      <div className="hidden w-28 shrink-0 space-y-1.5 rounded-2xl border border-white/80 bg-white/60 p-2 backdrop-blur-md sm:block" aria-hidden="true">
        <p className="px-1 pb-1 font-display text-xs font-semibold text-ink-800">
          Mood<span className="text-blush-400">Bloom</span>
        </p>
        <div className="rounded-full bg-gradient-to-r from-blush-200 to-lilac-200 px-2.5 py-1.5 text-[11px] font-bold text-ink-800">Dashboard</div>
        <div className="rounded-full px-2.5 py-1.5 text-[11px] font-bold text-ink-600">My Journal</div>
        <div className="rounded-full px-2.5 py-1.5 text-[11px] font-bold text-ink-600">Calendar</div>
        <div className="rounded-full px-2.5 py-1.5 text-[11px] font-bold text-ink-600">Goals</div>
      </div>

      <div className="min-w-0 flex-1 space-y-3">
        <div className="inline-block rounded-2xl bg-cream-100/75 px-3 py-2 backdrop-blur-sm">
          <p className="text-[11px] font-bold text-lilac-500">Thursday</p>
          <p className="font-display text-xl font-semibold text-ink-800">Good evening, Friend 🌸</p>
          <p className="text-xs text-ink-600">Take a breath. This is your little world.</p>
        </div>

        <div className="rounded-2xl border border-white/80 bg-white/70 p-3 shadow-soft backdrop-blur-md">
          <p className="text-sm font-semibold text-ink-800">How are you feeling?</p>
          <div role="group" aria-label="Sample moods" className="mt-2 flex flex-wrap gap-1.5">
            {MOODS.map((m) => (
              <button
                key={m.label}
                type="button"
                aria-pressed={mood === m.label}
                onClick={() => setMood(m.label)}
                className={`rounded-xl border-2 px-2.5 py-1 text-xs font-bold transition ${
                  mood === m.label ? 'border-lilac-300 bg-lilac-100 text-ink-800' : 'border-transparent bg-white/70 text-ink-600 hover:bg-lilac-100'
                }`}
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>

          <ul className="mt-3 space-y-1.5">
            {tasks.map((t) => (
              <li key={t.id}>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-white/60 px-2.5 py-1.5 text-xs font-semibold text-ink-700">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
                    className="h-4 w-4 accent-lilac-400"
                  />
                  <span className={t.done ? 'text-ink-500 line-through' : ''}>{t.label}</span>
                </label>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex items-baseline justify-between text-[11px] font-bold text-ink-600">
            <span>{doneCount} of {tasks.length} done</span>
            <span className="text-lilac-500">{percent}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Sample progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            className="mt-1 h-2.5 overflow-hidden rounded-full bg-lilac-100"
          >
            <div className="h-full rounded-full bg-gradient-to-r from-blush-300 to-lilac-300 transition-all duration-500" style={{ width: `${percent}%` }} />
          </div>

          <label htmlFor={`${uid}-note`} className="mt-3 block text-[11px] font-bold text-ink-700">
            Quick note
          </label>
          <input
            id={`${uid}-note`}
            placeholder="What's on your mind?"
            className="mt-1 w-full rounded-xl border-2 border-lilac-200 bg-white/80 px-3 py-1.5 text-xs text-ink-800 placeholder:text-ink-500/60 focus:border-lilac-400 focus:outline-none focus:ring-4 focus:ring-lilac-200/70"
          />

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" className="rounded-full bg-gradient-to-r from-blush-300 to-lilac-300 px-4 py-1.5 text-xs font-bold text-ink-800 shadow-petal transition hover:-translate-y-0.5">
              Save entry
            </button>
            <button type="button" className="rounded-full border-2 border-lilac-300 bg-white/70 px-4 py-1.5 text-xs font-bold text-ink-700 transition hover:bg-lilac-100">
              Cancel
            </button>
            <span className="rounded-full bg-blush-100 px-2.5 py-1 text-[11px] font-bold text-blush-500">Needs a name</span>
            <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-bold text-sky-700">Travel</span>
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">Appointment</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Frame that applies a theme (colours + scenery) to everything inside it, without touching the rest of the page. */
export function ThemeFrame({ themeKey, animated = true, className = '', children }) {
  return (
    <div data-theme={themeKey} className={`relative isolate overflow-hidden text-ink-700 ${className}`} style={{ backgroundColor: 'rgb(var(--c-cream-100))' }}>
      {hasScene(themeKey) && (
        <>
          <div key={themeKey} className="mb-scene-in absolute inset-0 -z-10">
            <Scene themeKey={themeKey} animated={animated} className="absolute inset-0 h-full w-full" />
          </div>
          <div className="absolute inset-0 -z-10" style={{ backgroundColor: 'rgb(var(--c-cream-100) / var(--scene-veil))' }} />
        </>
      )}
      {children}
    </div>
  );
}

export default function ThemeLivePreview({ themeKey }) {
  return (
    <ThemeFrame themeKey={themeKey} className="rounded-3xl border border-white/80 p-3 shadow-soft transition-colors sm:p-4">
      <MiniApp />
    </ThemeFrame>
  );
}
