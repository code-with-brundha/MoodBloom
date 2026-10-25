import JournalIcon from './JournalIcon.jsx';

/** Search box + mood filter chips. Fully controlled by the page. */
export default function JournalFilters({ search, onSearchChange, moods, moodFilter, onMoodChange }) {
  const chip = 'rounded-full border-2 px-3.5 py-1.5 text-sm font-bold transition';
  const idle = 'border-transparent bg-white/70 text-ink-600 hover:bg-lilac-100';

  return (
    <div className="space-y-4">
      <div className="relative">
        <label htmlFor="journal-search" className="sr-only">
          Search entries
        </label>
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-500">
          <JournalIcon name="search" />
        </span>
        <input
          id="journal-search"
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title or words in your entry"
          className="w-full rounded-full border-2 border-lilac-200 bg-white/80 py-3 pl-12 pr-4 text-base text-ink-800 placeholder:text-ink-500/60 transition focus:border-lilac-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-lilac-200/70"
        />
      </div>

      <div role="group" aria-label="Filter by mood" className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={moodFilter === 'all'}
          onClick={() => onMoodChange('all')}
          className={`${chip} ${moodFilter === 'all' ? 'border-lilac-300 bg-lilac-100 text-ink-800' : idle}`}
        >
          All moods
        </button>
        {moods.map((mood) => (
          <button
            key={mood.key}
            type="button"
            aria-pressed={moodFilter === mood.key}
            onClick={() => onMoodChange(mood.key)}
            className={`${chip} ${moodFilter === mood.key ? `${mood.ring} text-ink-800` : idle}`}
          >
            {mood.emoji} {mood.label}
          </button>
        ))}
      </div>
    </div>
  );
}
