import { useState } from 'react';

function EyeIcon({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {!open && <path d="M4 4l16 16" />}
    </svg>
  );
}

/**
 * Labelled input with optional error/hint text.
 * Password fields get a show/hide toggle automatically.
 */
export default function FormField({ label, id, type = 'text', error, hint, ...props }) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-ink-700">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          name={id}
          type={isPassword && visible ? 'text' : type}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          className={`w-full rounded-2xl border-2 bg-white/80 px-4 py-3 text-base text-ink-800 
            placeholder:text-ink-500/60 transition focus:bg-white focus:outline-none focus:ring-4
            ${isPassword ? 'pr-12' : ''}
            ${
              error
                ? 'border-blush-400 focus:ring-blush-200'
                : 'border-lilac-200 focus:border-lilac-400 focus:ring-lilac-200/70'
            }`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-ink-500 hover:bg-lilac-100"
          >
            <EyeIcon open={visible} />
          </button>
        )}
      </div>

      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm font-semibold text-blush-500">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-ink-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
