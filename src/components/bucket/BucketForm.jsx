import { useState } from 'react';
import FormField from '../FormField.jsx';
import Button from '../Button.jsx';
import CompletionFields from './CompletionFields.jsx';
import { categories, statuses, validateItem } from '../../utils/bucket.js';
import { toDateInputValue } from '../../utils/dates.js';

const textarea =
  'w-full resize-none rounded-2xl border-2 border-lilac-200 bg-white/80 px-4 py-3 text-base text-ink-800 placeholder:text-ink-500/60 transition focus:border-lilac-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-lilac-200/70';

/**
 * Create / edit form for a dream. Pass `item` to edit, or `prefill` ({ title, category }) for a new one.
 * Calls onSave({ title, description, category, targetDate, notes, status, completedDate, reflection }).
 */
export default function BucketForm({ item, prefill, idPrefix = 'dream', onSave, onCancel }) {
  const [values, setValues] = useState({
    title: item?.title ?? prefill?.title ?? '',
    description: item?.description ?? '',
    category: item?.category ?? prefill?.category ?? 'experiences',
    targetDate: item?.targetDate ?? '',
    notes: item?.notes ?? '',
    status: item?.status ?? 'planned',
    completedDate: item?.completedDate ?? '',
    reflection: item?.reflection ?? '',
  });
  const [errors, setErrors] = useState({});

  const update = (name, value) => {
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      // Choosing "Completed" suggests today's date so it's one less thing to fill in.
      if (name === 'status' && value === 'completed' && !next.completedDate) next.completedDate = toDateInputValue();
      return next;
    });
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validateItem(values, { isNew: !item });
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSave({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
      notes: values.notes.trim(),
      reflection: values.reflection.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField
        id={`${idPrefix}-title`}
        label="Dream"
        placeholder="e.g. See the northern lights"
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
          rows={2}
          maxLength={400}
          value={values.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Paint the picture. What does it look like?"
          className={textarea}
        />
      </div>

      <fieldset>
        <legend className="mb-1.5 block text-sm font-bold text-ink-700">Category</legend>
        <div role="radiogroup" aria-label="Category" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {categories.map((c) => {
            const selected = values.category === c.key;
            return (
              <button
                key={c.key}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => update('category', c.key)}
                className={`flex items-center gap-2 rounded-2xl border-2 px-3 py-2 text-left transition ${
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

      <fieldset>
        <legend className="mb-1.5 block text-sm font-bold text-ink-700">Status</legend>
        <div role="radiogroup" aria-label="Status" className="grid grid-cols-3 gap-2">
          {statuses.map((s) => {
            const selected = values.status === s.key;
            return (
              <button
                key={s.key}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => update('status', s.key)}
                className={`flex flex-col items-center gap-0.5 rounded-2xl border-2 px-1 py-2 transition ${
                  selected ? 'border-lilac-300 bg-lilac-100 shadow-sm' : 'border-transparent bg-white/70 hover:bg-lilac-100'
                }`}
              >
                <span className="text-xl" aria-hidden="true">
                  {s.emoji}
                </span>
                <span className="text-xs font-bold text-ink-700">{s.label}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <FormField
        id={`${idPrefix}-target`}
        label="Target date (optional)"
        type="date"
        hint="Leave it empty if it’s a “someday” dream."
        value={values.targetDate}
        onChange={(e) => update('targetDate', e.target.value)}
        error={errors.targetDate}
      />

      <div>
        <label htmlFor={`${idPrefix}-notes`} className="mb-1.5 block text-sm font-bold text-ink-700">
          Personal notes <span className="font-semibold text-ink-500">(optional)</span>
        </label>
        <textarea
          id={`${idPrefix}-notes`}
          name={`${idPrefix}-notes`}
          rows={2}
          maxLength={500}
          value={values.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Ideas, costs, who to go with, things to prepare…"
          className={textarea}
        />
      </div>

      {values.status === 'completed' && (
        <CompletionFields idPrefix={idPrefix} values={values} errors={errors} onChange={update} />
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} className="py-2.5">
          Cancel
        </Button>
        <Button type="submit" className="py-2.5">
          {item ? 'Save changes' : 'Add dream'}
        </Button>
      </div>
    </form>
  );
}
