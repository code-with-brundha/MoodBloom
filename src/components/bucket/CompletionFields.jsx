import FormField from '../FormField.jsx';
import { toDateInputValue } from '../../utils/dates.js';

/** Completion date + reflection. Shared by the dream form and the "mark as completed" dialog. */
export default function CompletionFields({ idPrefix, values, errors, onChange }) {
  return (
    <div className="space-y-4 rounded-2xl bg-lilac-100/50 p-4">
      <FormField
        id={`${idPrefix}-completed`}
        label="Completion date"
        type="date"
        max={toDateInputValue()}
        value={values.completedDate}
        onChange={(e) => onChange('completedDate', e.target.value)}
        error={errors.completedDate}
      />
      <div>
        <label htmlFor={`${idPrefix}-reflection`} className="mb-1.5 block text-sm font-bold text-ink-700">
          Reflection or memory <span className="font-semibold text-ink-500">(optional)</span>
        </label>
        <textarea
          id={`${idPrefix}-reflection`}
          name={`${idPrefix}-reflection`}
          rows={3}
          maxLength={800}
          value={values.reflection}
          onChange={(e) => onChange('reflection', e.target.value)}
          placeholder="How did it feel? What do you want to remember?"
          className="w-full resize-none rounded-2xl border-2 border-lilac-200 bg-white/80 px-4 py-3 text-base text-ink-800 placeholder:text-ink-500/60 transition focus:border-lilac-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-lilac-200/70"
        />
      </div>
    </div>
  );
}
