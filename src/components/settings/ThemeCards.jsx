import Scene from '../../theme/scenes/index.jsx';
import { ThemeFrame } from './ThemeLivePreview.jsx';

const check = (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

function SelectedBadge({ children = 'Selected' }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blush-300 to-lilac-300 px-2.5 py-1 text-xs font-bold text-ink-800 shadow-sm">
      {check} {children}
    </span>
  );
}

/** Tiny picture of the app used on the Light / Dark cards. */
function MiniThumb() {
  return (
    <div className="flex gap-2 p-3" aria-hidden="true">
      <div className="w-1/4 space-y-1.5 rounded-xl border border-white/80 bg-white/70 p-1.5">
        <div className="h-2 rounded-full bg-gradient-to-r from-blush-300 to-lilac-300" />
        <div className="h-2 rounded-full bg-lilac-200" />
        <div className="h-2 rounded-full bg-lilac-200" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="h-2.5 w-2/3 rounded-full bg-ink-800/80" />
        <div className="space-y-1.5 rounded-xl border border-white/80 bg-white/70 p-2">
          <div className="h-2 w-5/6 rounded-full bg-ink-600/60" />
          <div className="h-2 w-2/3 rounded-full bg-ink-600/40" />
          <div className="flex gap-1.5 pt-1">
            <div className="h-3.5 w-10 rounded-full bg-gradient-to-r from-blush-300 to-lilac-300" />
            <div className="h-3.5 w-6 rounded-full bg-blush-100" />
            <div className="h-3.5 w-6 rounded-full bg-lilac-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Light Mode / Dark Mode card. */
export function BasicThemeCard({ theme, selected, onSelect, onPreview }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`${theme.name}. ${theme.description}`}
      onClick={() => onSelect(theme.id)}
      onMouseEnter={() => onPreview(theme.id)}
      onMouseLeave={() => onPreview(null)}
      onFocus={() => onPreview(theme.id)}
      onBlur={() => onPreview(null)}
      className={`group flex w-full flex-col items-stretch justify-start rounded-3xl border-2 p-3 text-left transition duration-300 hover:-translate-y-0.5 hover:shadow-soft ${
        selected ? 'border-lilac-400 bg-white/85 shadow-soft' : 'border-white/80 bg-white/70'
      }`}
    >
      <ThemeFrame themeKey={theme.id} animated={false} className="rounded-2xl border border-white/80">
        <MiniThumb />
      </ThemeFrame>
      <div className="mt-3 flex items-start justify-between gap-2 px-1">
        <div>
          <p className="font-display text-lg font-semibold text-ink-800">
            <span aria-hidden="true">{theme.emoji}</span> {theme.name}
          </p>
          <p className="mt-0.5 text-sm text-ink-600">{theme.description}</p>
        </div>
        {selected && <SelectedBadge />}
      </div>
    </button>
  );
}

function VariantButton({ world, variant, selected, onSelect, onPreview }) {
  const key = `${world.id}-${variant}`;
  const info = world[variant];
  const label = variant === 'day' ? 'Day' : 'Night';
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`${world.name}, ${label}: ${info.name}. ${info.blurb}`}
      onClick={() => onSelect(world.id, variant)}
      onMouseEnter={() => onPreview(key)}
      onMouseLeave={() => onPreview(null)}
      onFocus={() => onPreview(key)}
      onBlur={() => onPreview(null)}
      className={`group flex min-w-0 flex-col items-stretch justify-start rounded-2xl border-2 p-1.5 text-left transition duration-300 hover:-translate-y-0.5 ${
        selected ? 'border-lilac-400 bg-lilac-100/70 shadow-sm' : 'border-transparent bg-white/50 hover:bg-lilac-100/60'
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
        <Scene themeKey={key} animated={false} className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105" />
        <span className="absolute left-1.5 top-1.5 rounded-full bg-black/65 px-2 py-0.5 text-[11px] font-bold text-on-accent backdrop-blur-sm">
          {variant === 'day' ? '☀️' : '🌙'} {label}
        </span>
        {selected && (
          <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blush-300 to-lilac-300 text-on-accent shadow-petal">
            {check}
            <span className="sr-only">Selected</span>
          </span>
        )}
      </div>
      <p className="mt-2 px-1 text-sm font-bold leading-tight text-ink-800">{info.name}</p>
      <p className="px-1 pb-1 text-xs leading-snug text-ink-600">{info.blurb}</p>
    </button>
  );
}

/**
 * A theme world: name, description and separate Day / Night choices.
 * Pressing the title area picks the world on its Day variant (or keeps the current variant if it is already active).
 */
export function WorldThemeCard({ world, appearance, onSelectWorld, onSelectVariant, onPreview }) {
  const active = appearance.theme === world.id;
  const previewKey = `${world.id}-${active ? appearance.variant : 'day'}`;
  return (
    <article
      aria-label={world.name}
      className={`rounded-3xl border-2 p-4 transition duration-300 ${
        active ? 'border-lilac-400 bg-white/85 shadow-soft' : 'border-white/80 bg-white/70'
      }`}
    >
      <header className="flex items-start justify-between gap-3">
        <button
          type="button"
          aria-pressed={active}
          aria-label={`${world.name}. ${active ? 'Selected.' : 'Switch to this world, starting with Day.'}`}
          onClick={() => onSelectWorld(world.id)}
          onMouseEnter={() => onPreview(previewKey)}
          onMouseLeave={() => onPreview(null)}
          onFocus={() => onPreview(previewKey)}
          onBlur={() => onPreview(null)}
          className="min-w-0 flex-1 rounded-2xl text-left transition hover:opacity-90"
        >
          <h4 className="font-display text-lg font-semibold text-ink-800">
            <span aria-hidden="true">{world.emoji}</span> {world.name}
          </h4>
          <p className="mt-0.5 text-sm text-ink-600">{world.description}</p>
        </button>
        {active && <SelectedBadge>{appearance.variant === 'night' ? 'Night' : 'Day'}</SelectedBadge>}
      </header>
      <div role="group" aria-label={`${world.name} Day and Night`} className="mt-3 grid grid-cols-2 gap-2">
        {['day', 'night'].map((variant) => (
          <VariantButton
            key={variant}
            world={world}
            variant={variant}
            selected={active && appearance.variant === variant}
            onSelect={onSelectVariant}
            onPreview={onPreview}
          />
        ))}
      </div>
    </article>
  );
}
