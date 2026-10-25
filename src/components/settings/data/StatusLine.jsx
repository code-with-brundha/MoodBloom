import SettingsIcon from '../SettingsIcon.jsx';

/** A polite status / error message with an icon. `status` = { type: 'success' | 'info' | 'error', text } or null. */
export default function StatusLine({ status, testId, children }) {
  return (
    <div role={status?.type === 'error' ? 'alert' : 'status'} aria-live="polite" data-testid={testId} className="min-h-[1.5rem]">
      {status && (
        <div className="flex items-start gap-2 rounded-2xl bg-lilac-100/70 px-4 py-3 text-sm font-semibold text-ink-800">
          <SettingsIcon name={status.type === 'error' ? 'alert' : 'check'} className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="min-w-0">
            <p>{status.text}</p>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
