import Scene, { hasScene } from './scenes/index.jsx';

/**
 * Full-screen scenery that sits behind every page (Light and Dark have none).
 * A soft wash of the page colour is laid over it so text and forms always stay easy to read.
 */
export default function ThemeBackdrop({ themeKey }) {
  if (!hasScene(themeKey)) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      <div key={themeKey} className="mb-scene-in absolute inset-0">
        <Scene themeKey={themeKey} className="absolute inset-0 h-full w-full" />
      </div>
      <div className="absolute inset-0" style={{ backgroundColor: 'rgb(var(--c-cream-100) / var(--scene-veil))' }} />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 75% 85% at 52% 40%, rgb(var(--c-cream-100) / var(--scene-focus)) 0%, rgb(var(--c-cream-100) / calc(var(--scene-focus) * 0.55)) 55%, rgb(var(--c-cream-100) / 0) 100%)',
        }}
      />
    </div>
  );
}
