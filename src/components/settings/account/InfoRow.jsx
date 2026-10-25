/** One label + value line inside a <dl>. `children` can hold a small chip or link after the value. */
export default function InfoRow({ label, value, testId, children }) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:gap-4">
      <dt className="text-sm font-bold text-ink-700 sm:w-44 sm:shrink-0">{label}</dt>
      <dd className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 text-ink-800">
        <span data-testid={testId} className="min-w-0 break-words">
          {value}
        </span>
        {children}
      </dd>
    </div>
  );
}
