/**
 * One setting: title + short explanation on the left, the control on the right
 * (below the text on phones). `unavailable` greys the row out and shows why.
 */
export default function PreferenceRow({ id, title, description, children, unavailable, note }) {
  return (
    <div className={`flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8`}>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2">
          <span id={`${id}-label`} className="font-bold text-ink-800">
            {title}
          </span>
          {unavailable && (
            <span className="rounded-full bg-lilac-100 px-2.5 py-0.5 text-xs font-bold text-ink-700">Coming later</span>
          )}
        </p>
        <p id={`${id}-desc`} className="mt-1 text-sm leading-relaxed text-ink-600">
          {description}
        </p>
        {unavailable && (
          <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{unavailable}</p>
        )}
        {note && (
          <p role="note" className="mt-2 rounded-2xl bg-blush-100/70 px-3 py-2 text-sm font-semibold text-ink-700">
            {note}
          </p>
        )}
      </div>
      <div className="shrink-0 sm:w-auto">{children}</div>
    </div>
  );
}
