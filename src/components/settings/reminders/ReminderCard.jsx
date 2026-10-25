import Card from '../../dashboard/Card.jsx';
import Icon from '../../dashboard/Icon.jsx';
import ToggleSwitch from '../privacy/ToggleSwitch.jsx';

/**
 * One reminder type: icon, title, on/off switch, a status line, its controls and a short honest note.
 * Turning the switch off keeps every other setting; it just stops being "turned on".
 */
export default function ReminderCard({ id, icon, title, description, enabled, onToggle, status, unsaved, note, children }) {
  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blush-100 to-lilac-200 text-ink-800"
          >
            <Icon name={icon} className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h2 id={`${id}-label`} className="text-xl font-semibold">
              {title}
            </h2>
            <p id={`${id}-desc`} className="mt-0.5 text-sm leading-relaxed text-ink-600">
              {description}
            </p>
          </div>
        </div>
        <div className="shrink-0 pl-14 sm:pl-0 sm:pt-1">
          <ToggleSwitch checked={enabled} onChange={onToggle} labelledBy={`${id}-label`} describedBy={`${id}-desc`} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 pl-14 sm:pl-[3.75rem]" data-testid={`${id}-status-row`}>
        <span
          data-testid={`${id}-status`}
          className={`rounded-full px-3 py-1 text-xs font-bold text-ink-800 ${
            enabled ? 'bg-lilac-200' : 'border border-lilac-200 bg-white/80'
          }`}
        >
          {status}
        </span>
        {unsaved && (
          <span className="rounded-full bg-blush-200 px-3 py-1 text-xs font-bold text-ink-800">Unsaved changes</span>
        )}
      </div>

      <div className="mt-5 space-y-5 border-t border-lilac-200/60 pt-5">{children}</div>

      {note && (
        <p className="mt-5 rounded-2xl bg-lilac-100/70 px-4 py-3 text-sm leading-relaxed text-ink-700">{note}</p>
      )}
    </Card>
  );
}
