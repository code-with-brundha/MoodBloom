import { useState } from 'react';
import FormField from '../FormField.jsx';
import Button from '../Button.jsx';
import { priorities } from '../../utils/tasks.js';

/**
 * Create / edit form for a task. Pass `task` to edit.
 * Calls onSave({ title, description, date, time, priority }) once valid.
 * `idPrefix` keeps input ids unique when two forms are on screen at once.
 */
export default function TaskForm({ task, defaultDate, idPrefix = 'task', onSave, onCancel, submitLabel }) {
  const [values, setValues] = useState({
    title: task?.title ?? '',
    description: task?.description ?? '',
    date: task?.date ?? defaultDate,
    time: task?.time ?? '',
    priority: task?.priority ?? 'medium',
  });
  const [errors, setErrors] = useState({});

  const update = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const found = {};
    if (!values.title.trim()) found.title = 'What would you like to do?';
    if (!values.date) found.date = 'Please choose a date.';
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSave({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField
        id={`${idPrefix}-title`}
        label="Task"
        placeholder="e.g. Take a short walk"
        maxLength={80}
        value={values.title}
        onChange={(e) => update('title', e.target.value)}
        error={errors.title}
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
          placeholder="Any small details you'd like to remember"
          className="w-full resize-none rounded-2xl border-2 border-lilac-200 bg-white/80 px-4 py-3 text-base text-ink-800 placeholder:text-ink-500/60 transition focus:border-lilac-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-lilac-200/70"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id={`${idPrefix}-date`}
          label="Date"
          type="date"
          value={values.date}
          onChange={(e) => update('date', e.target.value)}
          error={errors.date}
        />
        <FormField
          id={`${idPrefix}-time`}
          label="Time (optional)"
          type="time"
          value={values.time}
          onChange={(e) => update('time', e.target.value)}
        />
      </div>

      <fieldset>
        <legend className="mb-1.5 block text-sm font-bold text-ink-700">Priority</legend>
        <div role="radiogroup" aria-label="Priority" className="grid grid-cols-3 gap-2">
          {priorities.map((p) => {
            const selected = values.priority === p.key;
            return (
              <button
                key={p.key}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => update('priority', p.key)}
                className={`flex flex-col items-center gap-0.5 rounded-2xl border-2 px-1 py-2 transition ${
                  selected ? `${p.ring} shadow-sm` : 'border-transparent bg-white/70 hover:bg-lilac-100'
                }`}
              >
                <span className="text-xl" aria-hidden="true">
                  {p.emoji}
                </span>
                <span className="text-xs font-bold text-ink-700">{p.label}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className={`flex gap-3 ${onCancel ? 'flex-col-reverse sm:flex-row sm:justify-end' : ''}`}>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="py-2.5">
            Cancel
          </Button>
        )}
        <Button type="submit" className={`py-2.5 ${onCancel ? '' : 'w-full'}`}>
          {submitLabel ?? (task ? 'Save changes' : 'Add task')}
        </Button>
      </div>
    </form>
  );
}
