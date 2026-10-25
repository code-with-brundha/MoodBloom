import { useState } from 'react';
import FormField from '../FormField.jsx';
import Button from '../Button.jsx';
import { toDateInputValue } from '../../utils/dates.js';

/**
 * Pick a mood, add an optional short note and a date.
 * Pass `record` to edit one; leave it out to log a new mood.
 * Calls onSave({ mood, note, date }) once valid.
 */
export default function MoodLogForm({ record, moods, onSave, onCancel, submitLabel = 'Log mood' }) {
  const today = toDateInputValue();
  const [values, setValues] = useState({
    mood: record?.mood ?? null,
    note: record?.note ?? '',
    date: record?.date ?? today,
  });
  const [errors, setErrors] = useState({});

  const update = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = {};
    if (!values.mood) found.mood = 'Pick the mood that fits best.';
    if (!values.date) found.date = 'Please choose a date.';
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSave({ ...values, note: values.note.trim() });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <fieldset>
        <legend className="mb-2 block text-sm font-bold text-ink-700">How are you feeling?</legend>
        <div role="radiogroup" aria-label="Mood" className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
          {moods.map((mood) => {
            const isSelected = values.mood === mood.key;
            return (
              <button
                key={mood.key}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => update('mood', mood.key)}
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
        {errors.mood && (
          <p role="alert" className="mt-1.5 text-sm font-semibold text-blush-500">
            {errors.mood}
          </p>
        )}
      </fieldset>

      <div>
        <label htmlFor="mood-note" className="mb-1.5 block text-sm font-bold text-ink-700">
          Short note <span className="font-normal text-ink-500">(optional)</span>
        </label>
        <textarea
          id="mood-note"
          name="note"
          rows={3}
          maxLength={200}
          value={values.note}
          onChange={(e) => update('note', e.target.value)}
          placeholder="What's behind this feeling?"
          className="w-full resize-none rounded-2xl border-2 border-lilac-200 bg-white/80 px-4 py-3 text-base text-ink-800 placeholder:text-ink-500/60 transition focus:border-lilac-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-lilac-200/70"
        />
        <p className="mt-1 text-right text-xs text-ink-500">{values.note.length}/200</p>
      </div>

      <FormField
        id="date"
        label="Date"
        type="date"
        max={today}
        value={values.date}
        onChange={(e) => update('date', e.target.value)}
        error={errors.date}
      />

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="py-2.5">
            Cancel
          </Button>
        )}
        <Button type="submit" className="py-2.5">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
