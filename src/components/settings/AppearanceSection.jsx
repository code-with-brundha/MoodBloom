import { useState } from 'react';
import Card from '../dashboard/Card.jsx';
import ThemeLivePreview from './ThemeLivePreview.jsx';
import { BasicThemeCard, WorldThemeCard } from './ThemeCards.jsx';
import { useTheme } from '../../theme/ThemeProvider.jsx';
import { BASIC_THEMES, WORLDS, isWorldId } from '../../theme/themes.js';

/** Name + variant of a theme key such as "ocean-night", for captions. */
function describe(key) {
  const basic = BASIC_THEMES.find((t) => t.id === key);
  if (basic) return { emoji: basic.emoji, title: basic.name, detail: basic.description };
  const [id, variant] = key.split('-');
  const world = WORLDS.find((w) => w.id === id);
  return {
    emoji: world.emoji,
    title: `${world.name} · ${variant === 'night' ? 'Night' : 'Day'}`,
    detail: world[variant].name,
  };
}

/** Appearance & Themes: pick Light, Dark or one of six worlds (each with Day and Night). */
export default function AppearanceSection() {
  const { appearance, key: activeKey, selectTheme, selectVariant, saveFailed } = useTheme();
  const [hoverKey, setHoverKey] = useState(null);

  // Hovering or focusing a theme previews it; otherwise the preview shows what is applied.
  const previewKey = hoverKey ?? activeKey;
  const previewing = hoverKey !== null && hoverKey !== activeKey;
  const shown = describe(previewKey);
  const current = describe(activeKey);
  const previewWorld = isWorldId(previewKey.split('-')[0]) ? previewKey.split('-')[0] : null;

  return (
    <div className="space-y-6">
      <Card
        title="Appearance & Themes"
        subtitle="Choose how MoodBloom looks everywhere: every page follows your pick."
        action={
          <span className="hidden rounded-full bg-lilac-100 px-3 py-1.5 text-xs font-bold text-ink-800 sm:inline-block">
            <span aria-hidden="true">{current.emoji}</span> {current.title}
          </span>
        }
      >
        <p className="text-sm leading-relaxed text-ink-600">
          Currently using <strong className="text-ink-800">{current.title}</strong>
          {current.detail && isWorldId(activeKey.split('-')[0]) ? ` (${current.detail})` : ''}. Hover or focus any theme to preview it,
          and press it to apply. Your choice is saved in this browser only (demo storage); it isn’t synced to an account yet.
        </p>
        {saveFailed && (
          <p role="alert" className="mt-3 rounded-2xl bg-blush-100 px-4 py-3 text-sm font-semibold text-ink-700">
            Your browser blocked saving, so this theme may reset when you refresh the page.
          </p>
        )}
      </Card>

      <section aria-labelledby="live-preview-title">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 id="live-preview-title" className="font-display text-xl font-semibold">
              Live preview
            </h3>
            <p aria-live="polite" className="text-sm text-ink-600">
              <span aria-hidden="true">{shown.emoji}</span> {shown.title}
              {shown.detail && previewWorld ? ` · ${shown.detail}` : ''}{' '}
              <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${previewing ? 'bg-blush-100 text-ink-800' : 'bg-lilac-100 text-ink-800'}`}>
                {previewing ? 'Preview only' : 'Applied'}
              </span>
            </p>
          </div>

          {previewWorld && (
            <div role="group" aria-label="Switch Day or Night" className="inline-flex gap-1 rounded-full bg-white/70 p-1.5 shadow-soft">
              {['day', 'night'].map((v) => {
                const on = previewKey === `${previewWorld}-${v}`;
                return (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={on && !previewing}
                    onClick={() => selectVariant(previewWorld, v)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-bold transition ${
                      on ? 'bg-gradient-to-r from-blush-200 to-lilac-200 text-ink-800 shadow-sm' : 'text-ink-600 hover:bg-lilac-100'
                    }`}
                  >
                    {v === 'day' ? '☀️ Day' : '🌙 Night'}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <ThemeLivePreview themeKey={previewKey} />
        <p className="mt-2 text-xs text-ink-600">The sample controls above are interactive, so you can feel how buttons, forms and chips look in this theme.</p>
      </section>

      <section aria-labelledby="basic-themes-title">
        <h3 id="basic-themes-title" className="mb-3 font-display text-xl font-semibold">
          Basic themes
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {BASIC_THEMES.map((t) => (
            <BasicThemeCard key={t.id} theme={t} selected={appearance.theme === t.id} onSelect={selectTheme} onPreview={setHoverKey} />
          ))}
        </div>
      </section>

      <section aria-labelledby="worlds-title">
        <h3 id="worlds-title" className="font-display text-xl font-semibold">
          Theme worlds
        </h3>
        <p className="mb-3 mt-0.5 text-sm text-ink-600">
          Six little worlds, each with its own Day and Night. Pick a Day or Night picture; switching worlds always starts with Day.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {WORLDS.map((w) => (
            <WorldThemeCard key={w.id} world={w} appearance={appearance} onSelectWorld={selectTheme} onSelectVariant={selectVariant} onPreview={setHoverKey} />
          ))}
        </div>
      </section>
    </div>
  );
}
