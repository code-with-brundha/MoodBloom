import { useState } from 'react';
import Card from './Card.jsx';
import Button from '../Button.jsx';

/** Short note box. Controlled by the page so the daily prompt can fill it. */
export default function QuickJournal({ value, onChange, onSave }) {
  const [saved, setSaved] = useState(false);
  const isEmpty = value.trim().length === 0;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isEmpty) return;
    onSave();
    setSaved(true);
  };

  return (
    <Card title="Quick journal" subtitle="Write a few words about your day.">
      <form onSubmit={handleSubmit}>
        <label htmlFor="quick-entry" className="sr-only">
          Journal entry
        </label>
        <textarea
          id="quick-entry"
          rows={5}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setSaved(false);
          }}
          placeholder="What's on your mind today?"
          className="w-full resize-none rounded-2xl border-2 border-lilac-200 bg-white/80 px-4 py-3 text-base text-ink-800 placeholder:text-ink-500/60 transition focus:border-lilac-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-lilac-200/70"
        />

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p role="status" className="text-sm text-ink-500">
            {saved && isEmpty
              ? 'Added to the preview list below. It will be stored for real once Supabase is connected.'
              : `${value.length} characters`}
          </p>
          <Button type="submit" disabled={isEmpty} className="w-full py-2.5 sm:w-auto">
            Save entry
          </Button>
        </div>
      </form>
    </Card>
  );
}
