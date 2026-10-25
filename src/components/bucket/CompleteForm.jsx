import { useState } from 'react';
import Button from '../Button.jsx';
import CompletionFields from './CompletionFields.jsx';
import { validateCompletion } from '../../utils/bucket.js';
import { toDateInputValue } from '../../utils/dates.js';

/**
 * Small dialog form used when marking a dream as completed, and later to add or edit its reflection.
 * Calls onSave({ completedDate, reflection }).
 */
export default function CompleteForm({ item, submitLabel, onSave, onCancel }) {
  const [values, setValues] = useState({
    completedDate: item.completedDate || toDateInputValue(),
    reflection: item.reflection || '',
  });
  const [errors, setErrors] = useState({});

  const update = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validateCompletion(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSave({ completedDate: values.completedDate, reflection: values.reflection.trim() });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <p className="leading-relaxed text-ink-600">
        <span className="font-bold text-ink-800">{item.title}</span>
      </p>
      <CompletionFields idPrefix="complete" values={values} errors={errors} onChange={update} />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} className="py-2.5">
          Cancel
        </Button>
        <Button type="submit" className="py-2.5">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
