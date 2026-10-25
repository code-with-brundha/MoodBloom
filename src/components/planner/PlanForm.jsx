import { useState } from 'react';
import FormField from '../FormField.jsx';
import Button from '../Button.jsx';
import { eventTypes, reminderOptions, validatePlan } from '../../utils/planner.js';

/**
 * Create / edit form for a plan. Pass `plan` to edit, or `defaultDate` for a new one.
 * Calls onSave({ title, description, type, date, startTime, endTime, reminder }) once valid.
 */
export default function PlanForm({ plan, defaultDate, idPrefix = 'plan', onSave, onCancel }) {
  const [values, setValues] = useState({
    title: plan?.title ?? '',
    description: plan?.description ?? '',
    type: plan?.type ?? 'personal',
    date: plan?.date ?? defaultDate,
    startTime: plan?.startTime ?? '',
    endTime: plan?.endTime ?? '',
    reminder: plan?.reminder ?? '',
  });
  const [errors, setErrors] = useState({});

  const update = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, ...(name === 'startTime' ? { endTime: undefined } : {}) }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = validatePlan(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSave({ ...values, title: values.title.trim(), description: values.description.trim() });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField
        id={`${idPrefix}-title`}
        label="Title"
        placeholder="e.g. Study group for biology"
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
          maxLength={300}
          value={values.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Any details you'd like to remember"
          className="w-full resize-none rounded-2xl border-2 border-lilac-200 bg-white/80 px-4 py-3 text-base text-ink-800 placeholder:text-ink-500/60 transition focus:border-lilac-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-lilac-200/70"
        />
      </div>

      <fieldset>
        <legend className="mb-1.5 block text-sm font-bold text-ink-700">Event type</legend>
        <div role="radiogroup" aria-label="Event type" className="grid grid-cols-3 gap-2">
          {eventTypes.map((t) => {
            const selected = values.type === t.key;
            return (
              <button
                key={t.key}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => update('type', t.key)}
                className={`flex flex-col items-center gap-0.5 rounded-2xl border-2 px-1 py-2 transition ${
                  selected ? `${t.ring} shadow-sm` : 'border-transparent bg-white/70 hover:bg-lilac-100'
                }`}
              >
                <span className="text-xl" aria-hidden="true">
                  {t.emoji}
                </span>
                <span className="text-xs font-bold text-ink-700">{t.label}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <FormField
        id={`${idPrefix}-date`}
        label="Date"
        type="date"
        value={values.date}
        onChange={(e) => update('date', e.target.value)}
        error={errors.date}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id={`${idPrefix}-start`}
          label="Start time"
          type="time"
          value={values.startTime}
          onChange={(e) => update('startTime', e.target.value)}
          error={errors.startTime}
        />
        <FormField
          id={`${idPrefix}-end`}
          label="End time (optional)"
          type="time"
          value={values.endTime}
          onChange={(e) => update('endTime', e.target.value)}
          error={errors.endTime}
        />
      </div>

      <div>
        <label htmlFor={`${idPrefix}-reminder`} className="mb-1.5 block text-sm font-bold text-ink-700">
          Reminder <span className="font-semibold text-ink-500">(optional)</span>
        </label>
        <select
          id={`${idPrefix}-reminder`}
          value={values.reminder}
          onChange={(e) => update('reminder', e.target.value)}
          aria-describedby={`${idPrefix}-reminder-hint`}
          className="w-full rounded-2xl border-2 border-lilac-200 bg-white/80 px-4 py-3 text-base text-ink-800 transition focus:border-lilac-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-lilac-200/70"
        >
          {reminderOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <p id={`${idPrefix}-reminder-hint`} className="mt-1.5 text-sm text-ink-500">
          This only saves your reminder preference with the plan. MoodBloom doesn’t send notifications or alerts yet.
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} className="py-2.5">
          Cancel
        </Button>
        <Button type="submit" className="py-2.5">
          {plan ? 'Save changes' : 'Add plan'}
        </Button>
      </div>
    </form>
  );
}
