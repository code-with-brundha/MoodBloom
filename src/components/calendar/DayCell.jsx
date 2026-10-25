/**
 * One day in the month grid.
 * Shows the day's latest mood emoji (+N if there are more) and a dot when a journal entry exists.
 */
export default function DayCell({ day, dateKey, isToday, isSelected, moods, entryCount, moodByKey, onSelect }) {
  const latest = moods.reduce((a, b) => (!a || b.id > a.id ? b : a), null);
  const mood = latest ? moodByKey[latest.mood] : null;

  const summary = [
    mood ? `${moods.length} mood${moods.length > 1 ? 's' : ''}` : 'no mood',
    entryCount ? `${entryCount} journal entr${entryCount > 1 ? 'ies' : 'y'}` : 'no journal entry',
  ].join(', ');

  const state = isSelected
    ? 'border-lilac-400 bg-lilac-100 shadow-sm'
    : isToday
      ? 'border-blush-300 bg-white/80 hover:bg-lilac-100/70'
      : 'border-transparent bg-white/60 hover:bg-lilac-100/70';

  return (
    <button
      type="button"
      onClick={() => onSelect(dateKey)}
      aria-pressed={isSelected}
      aria-current={isToday ? 'date' : undefined}
      aria-label={`${dateKey}${isToday ? ' (today)' : ''}: ${summary}`}
      className={`flex h-14 flex-col items-center justify-between rounded-xl border-2 px-0.5 py-1 transition sm:h-24 sm:rounded-2xl sm:px-2 sm:py-2 ${state}`}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold sm:h-7 sm:w-7 sm:text-sm ${
          isToday ? 'bg-gradient-to-br from-blush-300 to-lilac-300 text-ink-800' : 'text-ink-700'
        }`}
      >
        {day}
      </span>

      <span className="flex h-5 items-center gap-0.5 text-base leading-none sm:h-7 sm:text-2xl" aria-hidden="true">
        {mood?.emoji}
        {moods.length > 1 && <span className="text-[10px] font-bold text-ink-500 sm:text-xs">+{moods.length - 1}</span>}
      </span>

      <span className="flex h-3 items-center gap-1" aria-hidden="true">
        {entryCount > 0 && (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-lilac-400 sm:h-2 sm:w-2" />
            <span className="hidden text-[11px] font-bold text-lilac-500 sm:inline">
              {entryCount > 1 ? entryCount : 'entry'}
            </span>
          </>
        )}
      </span>
    </button>
  );
}
