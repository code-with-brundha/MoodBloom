import Card from './Card.jsx';

/** "How are you feeling today?" — pick one mood. */
export default function MoodSelector({ moods, selected, onSelect }) {
  const current = moods.find((m) => m.key === selected);

  return (
    <Card title="How are you feeling today?" subtitle="Tap the mood that fits best right now.">
      <div role="radiogroup" aria-label="Today's mood" className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {moods.map((mood) => {
          const isSelected = mood.key === selected;
          return (
            <button
              key={mood.key}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(mood.key)}
              className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-2 py-3 transition hover:-translate-y-0.5 ${
                isSelected ? `${mood.ring} shadow-sm` : 'border-transparent bg-white/70 hover:bg-lilac-100'
              }`}
            >
              <span className="text-3xl" aria-hidden="true">
                {mood.emoji}
              </span>
              <span className="text-sm font-bold text-ink-700">{mood.label}</span>
            </button>
          );
        })}
      </div>

      <p role="status" className="mt-4 text-sm text-ink-600">
        {current ? `Feeling ${current.label.toLowerCase()} today ${current.emoji}` : 'No mood picked yet.'}
      </p>
    </Card>
  );
}
