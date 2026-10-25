import { useId } from 'react';
import './scenes.css';
import { UnicornDay, UnicornNight } from './UnicornScenes.jsx';
import { CosmicDay, CosmicNight } from './CosmicScenes.jsx';
import { NatureDay, NatureNight } from './NatureScenes.jsx';
import { OceanDay, OceanNight } from './OceanScenes.jsx';
import { CozyDay, CozyNight } from './CozyScenes.jsx';
import { SakuraDay, SakuraNight } from './SakuraScenes.jsx';

// Theme key -> scenery. Light and Dark have no scenery.
const SCENES = {
  'unicorn-day': UnicornDay,
  'unicorn-night': UnicornNight,
  'cosmic-day': CosmicDay,
  'cosmic-night': CosmicNight,
  'nature-day': NatureDay,
  'nature-night': NatureNight,
  'ocean-day': OceanDay,
  'ocean-night': OceanNight,
  'cozy-day': CozyDay,
  'cozy-night': CozyNight,
  'sakura-day': SakuraDay,
  'sakura-night': SakuraNight,
};

export const hasScene = (key) => key in SCENES;

/**
 * Inline-SVG scenery for a theme key such as "ocean-night".
 * `animated={false}` freezes it (used for small thumbnails).
 * Each instance gets its own id prefix so gradients never clash when several scenes are on screen.
 */
export default function Scene({ themeKey, animated = true, className = '' }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const render = SCENES[themeKey];
  if (!render) return null;
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      className={`scene-svg ${className}`}
      data-static={animated ? undefined : ''}
      aria-hidden="true"
      focusable="false"
    >
      {render(`s${uid}-`)}
    </svg>
  );
}
