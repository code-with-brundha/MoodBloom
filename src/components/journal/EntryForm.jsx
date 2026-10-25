import { useState } from 'react';
import FormField from '../FormField.jsx';
import Button from '../Button.jsx';
import { toDateInputValue } from '../../utils/dates.js';

/**
 * Create / edit form. Pass `entry` to edit, leave it out to create.
 * Calls onSave({ title, date, mood, text }) once everything is valid.
 */
export default function EntryForm({ entry, moods, onSave, onCancel, submitLabel }) {
  const today = toDateInputValue();
  const [values, setValues] = useState({
    title: entry?.title ?? '',
    date: entry?.date ?? today,
    mood: entry?.mood ?? null,
    text: entry?.text ?? '',
  });
  const [errors, setErrors] = useState({});

  const update = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = {};
    if (!values.title.trim()) found.title = 'Give your entry a title.';
    if (!values.date) found.date = 'Please choose a date.';
    if (!values.mood) found.mood = 'Pick the mood that fits best.';
    if (!values.text.trim()) found.text = 'Write a few words about your day.';
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSave({ ...values, title: values.title.trim(), text: values.text.trim() });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <FormField
        id="title"
        label="Title"
        placeholder="Give this moment a name"
        maxLength={80}
        value={values.title}
        onChange={(e) => update('title', e.target.value)}
        error={errors.title}
      />

      <FormField
        id="date"
        label="Date"
        type="date"
        max={today}
        value={values.date}
        onChange={(e) => update('date', e.target.value)}
        error={errors.date}
      />

      <fieldset>
        <legend className="mb-1.5 block text-sm font-bold text-ink-700">Mood</legend>
        <div role="radiogroup" aria-label="Mood" className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {moods.map((mood) => {
            const isSelected = values.mood === mood.key;
            return (
              <button
                key={mood.key}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => update('mood', mood.key)}
                className={`flex flex-col items-center gap-0.5 rounded-2xl border-2 px-1 py-2 transition ${
                  isSelected ? `${mood.ring} shadow-sm` : 'border-transparent bg-white/70 hover:bg-lilac-100'
                }`}
              >
                <span className="text-2xl" aria-hidden="true">
                  {mood.emoji}
                </span>
                <span className="text-xs font-bold text-ink-700">{mood.label}</span>
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
        <label htmlFor="text" className="mb-1.5 block text-sm font-bold text-ink-700">
          Your thoughts
        </label>
        <textarea
          id="text"
          name="text"
          rows={6}
          value={values.text}
          onChange={(e) => update('text', e.target.value)}
          placeholder="What's on your mind?"
          aria-invalid={errors.text ? 'true' : 'false'}
          className={`w-full resize-none rounded-2xl border-2 bg-white/80 px-4 py-3 text-base text-ink-800 placeholder:text-ink-500/60 transition focus:bg-white focus:outline-none focus:ring-4 ${
            errors.text
              ? 'border-blush-400 focus:ring-blush-200'
              : 'border-lilac-200 focus:border-lilac-400 focus:ring-lilac-200/70'
          }`}
        />
        {errors.text && (
          <p role="alert" className="mt-1.5 text-sm font-semibold text-blush-500">
            {errors.text}
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} className="py-2.5">
          Cancel
        </Button>
        <Button type="submit" className="py-2.5">
          {submitLabel ?? (entry ? 'Save changes' : 'Save entry')}
        </Button>
      </div>
    </form>
  );
}
