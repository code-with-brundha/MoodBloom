import { useState } from 'react';
import FormField from '../FormField.jsx';
import Button from '../Button.jsx';
import { categories, validateGoal } from '../../utils/goals.js';
import { toDateInputValue } from '../../utils/dates.js';

/**
 * Create / edit form for a goal. Pass `goal` to edit.
 * Calls onSave({ title, description, category, startDate, targetDate }) once valid.
 */
export default function GoalForm({ goal, idPrefix = 'goal', onSave, onCancel }) {
  const today = toDateInputValue();
  const [values, setValues] = useState({
    title: goal?.title ?? '',
    description: goal?.description ?? '',
    category: goal?.category ?? 'personal',
    startDate: goal?.startDate ?? today,
    targetDate: goal?.targetDate ?? '',
  });
  const [errors, setErrors] = useState({});

  const update = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, ...(name === 'startDate' ? { targetDate: undefined } : {}) }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validateGoal(values, { isNew: !goal, today });
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSave({ ...values, title: values.title.trim(), description: values.description.trim() });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField
        id={`${idPrefix}-title`}
        label="Goal"
        placeholder="e.g. Read 12 books this year"
        maxLength={80}
        value={values.title}
        onChange={(e) => update('title', e.target.value)}
        error={errors.title}
        autoFocus
      />

      <div>
        <label htmlFor={`${idPrefix}-description`} className="mb-1.5 block text-sm font-bold text-ink-700">
          Description <span className="font-semibold text-ink-500">(optional)</span>
        </label>
        <textarea
          id={`${idPrefix}-description`}
          name={`${idPrefix}-description`}
          rows={3}
          maxLength={400}
          value={values.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Why does this matter to you?"
          className="w-full resize-none rounded-2xl border-2 border-lilac-200 bg-white/80 px-4 py-3 text-base text-ink-800 placeholder:text-ink-500/60 transition focus:border-lilac-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-lilac-200/70"
        />
      </div>

      <fieldset>
        <legend className="mb-1.5 block text-sm font-bold text-ink-700">Category</legend>
        <div role="radiogroup" aria-label="Category" className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {categories.map((c) => {
            const selected = values.category === c.key;
            return (
              <button
                key={c.key}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => update('category', c.key)}
                className={`flex flex-col items-center gap-0.5 rounded-2xl border-2 px-1 py-2 transition ${
                  selected ? `${c.ring} shadow-sm` : 'border-transparent bg-white/70 hover:bg-lilac-100'
                }`}
              >
                <span className="text-xl" aria-hidden="true">
                  {c.emoji}
                </span>
                <span className="text-xs font-bold text-ink-700">{c.label}</span>
              </button>
            );
          })}
        </div>
        {errors.category && (
          <p role="alert" className="mt-1.5 text-sm font-semibold text-blush-500">
            {errors.category}
          </p>
        )}
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id={`${idPrefix}-start`}
          label="Start date"
          type="date"
          value={values.startDate}
          onChange={(e) => update('startDate', e.target.value)}
          error={errors.startDate}
        />
        <FormField
          id={`${idPrefix}-target`}
          label="Target completion date"
          type="date"
          min={values.startDate || undefined}
          value={values.targetDate}
          onChange={(e) => update('targetDate', e.target.value)}
          error={errors.targetDate}
        />
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} className="py-2.5">
          Cancel
        </Button>
        <Button type="submit" className="py-2.5">
          {goal ? 'Save changes' : 'Create goal'}
        </Button>
      </div>
    </form>
  );
}
