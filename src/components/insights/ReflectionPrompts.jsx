import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../dashboard/Card.jsx';

const SHOWN = 3;

/** A few gentle prompts. "Show different prompts" cycles through the pool. */
export default function ReflectionPrompts({ pool }) {
  const [offset, setOffset] = useState(0);
  const shown = Array.from({ length: Math.min(SHOWN, pool.length) }, (_, i) => pool[(offset + i) % pool.length]);

  return (
    <Card
      title="Gentle reflection prompts"
      subtitle="No pressure. Pick one that feels right."
      action={
        pool.length > SHOWN && (
          <button
            type="button"
            onClick={() => setOffset((o) => (o + SHOWN) % pool.length)}
            className="shrink-0 rounded-full px-3 py-1.5 text-sm font-bold text-lilac-500 transition hover:bg-lilac-100"
          >
            Show different prompts
          </button>
        )
      }
    >
      <ul className="space-y-3">
        {shown.map((prompt) => (
          <li key={prompt} className="flex gap-3 rounded-2xl bg-gradient-to-r from-blush-100 to-lilac-100 px-4 py-3.5">
            <span aria-hidden="true">💭</span>
            <p className="text-ink-700">{prompt}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-ink-600">
        Want to write about it?{' '}
        <Link to="/journal" className="font-bold text-lilac-500 underline-offset-2 hover:underline">
          Open your journal
        </Link>
      </p>
    </Card>
  );
}
