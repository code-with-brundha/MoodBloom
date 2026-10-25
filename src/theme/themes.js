/* ------------------------------------------------------------------ */
/* MoodBloom theme configuration                                       */
/*                                                                     */
/* Every colour the website uses (cream, blush, lilac, ink, white and  */
/* the category tints) is a CSS variable. Each appearance below simply */
/* provides different values for those variables, so every page, card, */
/* button and form follows the selected theme automatically.           */
/*                                                                     */
/* The CSS is generated from this file and attached to the page as     */
/* [data-theme="..."] rules. Because the rules are scoped to the       */
/* attribute (not just <html>), the Settings live preview can show any */
/* theme inside a small container without changing the whole site.     */
/* ------------------------------------------------------------------ */

export const APPEARANCE_STORAGE_KEY = 'moodbloom.appearance.v1';

/* ------------------------------ tints ------------------------------ */
// Category / mood tints that some components use (sky, amber, emerald, orange, indigo).
const lightTints = {
  sky: { 50: '#F0F9FF', 100: '#E0F2FE', 300: '#7DD3FC', 700: '#0369A1' },
  amber: { 50: '#FFFBEB', 100: '#FEF3C7', 300: '#FCD34D', 700: '#B45309' },
  emerald: { 100: '#D1FAE5', 300: '#6EE7B7' },
  orange: { 50: '#FFF7ED', 100: '#FFEDD5', 300: '#FDBA74', 700: '#C2410C' },
  indigo: { 50: '#EEF2FF', 100: '#E0E7FF', 300: '#A5B4FC', 600: '#4F46E5' },
};
const darkTints = {
  sky: { 50: '#14324A', 100: '#19405C', 300: '#3E86B5', 700: '#B4E0FA' },
  amber: { 50: '#3A2A0E', 100: '#4A3810', 300: '#B88518', 700: '#F8D985' },
  emerald: { 100: '#134536', 300: '#2E9E78' },
  orange: { 50: '#3C2410', 100: '#4F3014', 300: '#C0702A', 700: '#FFCDA0' },
  indigo: { 50: '#1F2556', 100: '#2A3270', 300: '#6670D6', 600: '#C0C6FF' },
};

/* ----------------------------- palettes ---------------------------- */
// cream: [50, 100, 200]  blush/lilac: [100, 200, 300, 400, 500]  ink: [500, 600, 700, 800]
const palette = ({ mode, cream, white, blush, lilac, ink, shadow, shadowAlpha, petal, scrim, veil, blobs, focus }) => ({
  mode,
  cream,
  white,
  blush,
  lilac,
  ink,
  tints: mode === 'dark' ? darkTints : lightTints,
  shadow,
  shadowAlpha,
  petal,
  scrim,
  veil, // how strongly the page colour is laid over the scenery (keeps text readable)
  blobs, // opacity of the soft decorative blobs
  focus, // extra wash in the centre of the scenery (defaults below)
});

const PALETTES = {
  light: palette({
    mode: 'light',
    cream: ['#FFFCF7', '#FFF8F0', '#FDEFE0'],
    white: '#FFFFFF',
    blush: ['#FFE4EC', '#FDCADB', '#F9A8C4', '#F07FA6', '#E0608C'],
    lilac: ['#F1ECFD', '#E0D6F8', '#C9B8F0', '#A98EE2', '#8767CF'],
    ink: ['#7A6C8C', '#5E5070', '#463A57', '#2F2640'],
    shadow: '#A78BDA', shadowAlpha: 0.35, petal: '#F07FA6', scrim: '#2F2640', veil: 0, blobs: 1,
  }),
  dark: palette({
    mode: 'dark',
    cream: ['#2B2342', '#181325', '#352B52'],
    white: '#3A3058',
    blush: ['#4D2C48', '#70405F', '#B44A80', '#E27AA6', '#FFA3C3'],
    lilac: ['#3D3366', '#54468A', '#6F55C4', '#A98EE2', '#CDB9FA'],
    ink: ['#A99DC2', '#CBC1DF', '#E6DFF3', '#F7F3FF'],
    shadow: '#000000', shadowAlpha: 0.45, petal: '#B44A80', scrim: '#07040F', veil: 0, blobs: 0.35,
  }),

  'unicorn-day': palette({
    mode: 'light',
    cream: ['#FFFBFE', '#FFF4FA', '#FFE9F4'],
    white: '#FFFFFF',
    blush: ['#FFE0F0', '#FFC6E3', '#FF9FCF', '#CE629B', '#B52E82'],
    lilac: ['#F3EAFF', '#E3D2FF', '#C9AEFF', '#9776D8', '#7440D0'],
    ink: ['#5D516F', '#4A3B60', '#443359', '#2E2144'],
    shadow: '#B78BEF', shadowAlpha: 0.3, petal: '#F575B9', scrim: '#2E2144', veil: 0.34, blobs: 0.25,
  }),
  'unicorn-night': palette({
    mode: 'dark',
    cream: ['#2A1F5C', '#1B1342', '#33276E'],
    white: '#3A2D7A',
    blush: ['#512A68', '#7A3A86', '#AC4090', '#EE7FC0', '#FFA6DA'],
    lilac: ['#3A3080', '#51449F', '#6552CC', '#9A86F2', '#C9BBFF'],
    ink: ['#C4BBE4', '#E0DBF3', '#E9E4FA', '#F8F5FF'],
    shadow: '#05020F', shadowAlpha: 0.5, petal: '#AC4090', scrim: '#07031A', veil: 0.34, blobs: 0.2,
  }),

  'cosmic-day': palette({
    mode: 'light',
    cream: ['#FDFEFF', '#F2F9FF', '#FFF3D9'],
    white: '#FFFFFF',
    blush: ['#FFF0D6', '#FFE0A8', '#FFC56E', '#BA782C', '#A8590A'],
    lilac: ['#E8F3FF', '#CFE5FF', '#A9D0FF', '#598BC2', '#2468B8'],
    ink: ['#4A576A', '#354357', '#2F405A', '#1E2C44'],
    shadow: '#6FAEF2', shadowAlpha: 0.3, petal: '#F59E3A', scrim: '#1E2C44', veil: 0.34, blobs: 0.25,
  }),
  'cosmic-night': palette({
    mode: 'dark',
    cream: ['#1D2354', '#0D1131', '#262C68'],
    white: '#2A3070',
    blush: ['#47285F', '#693788', '#9A3FBE', '#DC7BF0', '#F5A6FF'],
    lilac: ['#2B3478', '#3F4BA0', '#4F63D6', '#8FA2FF', '#B9C6FF'],
    ink: ['#B0B9E4', '#D2D9F3', '#E1E6FA', '#F4F6FF'],
    shadow: '#02030F', shadowAlpha: 0.5, petal: '#9A3FBE', scrim: '#03051A', veil: 0.38, blobs: 0.2,
  }),

  'nature-day': palette({
    mode: 'light',
    cream: ['#FCFFF8', '#F4FBEC', '#EAF5D8'],
    white: '#FFFFFF',
    blush: ['#FFE9EE', '#FFD0DB', '#FFAFC1', '#C66A82', '#B03860'],
    lilac: ['#E6F5DF', '#CBEBBF', '#A6D993', '#569355', '#2A7541'],
    ink: ['#4A5A4E', '#36463B', '#314336', '#202F26'],
    shadow: '#6CB86A', shadowAlpha: 0.3, petal: '#F2819F', scrim: '#202F26', veil: 0.34, blobs: 0.25,
  }),
  'nature-night': palette({
    mode: 'dark',
    cream: ['#14323A', '#0A1F2B', '#1B4046'],
    white: '#1F4650',
    blush: ['#4A2B45', '#6C3A62', '#A04880', '#DD7DB4', '#FFA9D0'],
    lilac: ['#17414A', '#22606A', '#1F7A74', '#5CD0B8', '#9DF0D8'],
    ink: ['#B2CFCC', '#DEEEEB', '#DAEFEA', '#EFFBF8'],
    shadow: '#020A0E', shadowAlpha: 0.5, petal: '#A04880', scrim: '#020A10', veil: 0.34, blobs: 0.2,
  }),

  'ocean-day': palette({
    mode: 'light',
    cream: ['#F7FEFF', '#EAFBFC', '#D8F6F7'],
    white: '#FFFFFF',
    blush: ['#FFE6E0', '#FFCBC0', '#FFA898', '#CE6B5C', '#B93E2C'],
    lilac: ['#DDF7F8', '#B8EEF1', '#82DCE4', '#30919D', '#05596B'],
    ink: ['#3E5A61', '#2C464E', '#264650', '#153440'],
    shadow: '#3FBFCF', shadowAlpha: 0.3, petal: '#F57F6E', scrim: '#153440', veil: 0.32, blobs: 0.25,
  }),
  'ocean-night': palette({
    mode: 'dark',
    cream: ['#0F2A55', '#061633', '#143566'],
    white: '#17396C',
    blush: ['#4A1F5E', '#6D2D82', '#9E3A9C', '#E06BD0', '#FFA0EE'],
    lilac: ['#103F66', '#17598A', '#17719E', '#4FC6E8', '#9BE6FF'],
    ink: ['#A5C3E2', '#CEE1F4', '#DCEAF9', '#F0F7FF'],
    shadow: '#01050F', shadowAlpha: 0.5, petal: '#9E3A9C', scrim: '#010612', veil: 0.32, blobs: 0.2,
  }),

  'cozy-day': palette({
    mode: 'light',
    cream: ['#FFFAF2', '#FDF1E1', '#F7E3C8'],
    white: '#FFFDF9',
    blush: ['#FDE4E0', '#F9CBC4', '#F0A59B', '#C86E66', '#A8413B'],
    lilac: ['#F6EADB', '#EBD3B6', '#DDB48A', '#B07C4D', '#6A3C12'],
    ink: ['#665241', '#533F31', '#443226', '#2D2018'],
    shadow: '#C48A55', shadowAlpha: 0.3, petal: '#DE7A71', scrim: '#2D2018', veil: 0.34, blobs: 0.25,
  }),
  'cozy-night': palette({
    mode: 'dark',
    cream: ['#33231F', '#1F1514', '#3E2B26'],
    white: '#40302B',
    blush: ['#4D2A2E', '#6E383D', '#A8505A', '#D9808A', '#FFB3BA'],
    lilac: ['#4A3524', '#6A4A2C', '#9A6428', '#D9983C', '#FFC773'],
    ink: ['#C6B5A7', '#E0D4C8', '#EBDFD2', '#FBF4EA'],
    shadow: '#080303', shadowAlpha: 0.5, petal: '#A8505A', scrim: '#0A0504', veil: 0.36, blobs: 0.2,
  }),

  'sakura-day': palette({
    mode: 'light',
    cream: ['#FFFDFD', '#FFF6F8', '#FFE8EE'],
    white: '#FFFFFF',
    blush: ['#FFE6EE', '#FFCFDF', '#FFA9C6', '#CB6487', '#B5336A'],
    lilac: ['#F7EAF3', '#EBD2E4', '#D9AFCF', '#A7769F', '#8A4880'],
    ink: ['#67505D', '#513C49', '#483442', '#32222F'],
    shadow: '#F77AA5', shadowAlpha: 0.28, petal: '#F77AA5', scrim: '#32222F', veil: 0.34, blobs: 0.25,
  }),
  'sakura-night': palette({
    mode: 'dark',
    cream: ['#2B2159', '#1B163F', '#352A6B'],
    white: '#3A2F72',
    blush: ['#53294F', '#79386B', '#A94782', '#F08AB6', '#FFB6D3'],
    lilac: ['#4D2F2A', '#6F4030', '#9C5630', '#E6975A', '#FFC08D'],
    ink: ['#C3BBE1', '#E0DBF3', '#E9E4FA', '#F8F5FF'],
    shadow: '#05020F', shadowAlpha: 0.5, petal: '#A94782', scrim: '#07031A', veil: 0.34, blobs: 0.2,
  }),
};

/* ------------------------------ registry --------------------------- */

export const BASIC_THEMES = [
  { id: 'light', name: 'Light Mode', emoji: '☀️', description: 'Bright, clean and soft. The classic MoodBloom look.' },
  { id: 'dark', name: 'Dark Mode', emoji: '🌙', description: 'A comfortable dark look with readable text and balanced contrast.' },
];

export const WORLDS = [
  {
    id: 'unicorn',
    name: 'Unicorn World',
    emoji: '🦄',
    description: 'A sparkly pastel fantasy of rainbows, castles and magic.',
    day: { name: 'Rainbow Dreamland', blurb: 'Pastel rainbows, fluffy clouds, flowers and a castle.' },
    night: { name: 'Midnight Unicorn Kingdom', blurb: 'Violet skies, a crescent moon and a glowing castle.' },
  },
  {
    id: 'cosmic',
    name: 'Cosmic World',
    emoji: '🪐',
    description: 'Drift between planets, from a sunny garden to deep space.',
    day: { name: 'Solar Garden', blurb: 'Sunny skies, soft clouds, planets and a celestial garden.' },
    night: { name: 'Starlight Galaxy', blurb: 'Deep space, ringed planets, constellations and a glowing moon.' },
  },
  {
    id: 'nature',
    name: 'Nature World',
    emoji: '🌿',
    description: 'Fresh air, green hills and gentle wildlife.',
    day: { name: 'Sunny Meadow', blurb: 'Green hills, wildflowers, butterflies and warm sunlight.' },
    night: { name: 'Moonlit Forest', blurb: 'Teal trees, glowing fireflies and luminous flowers.' },
  },
  {
    id: 'ocean',
    name: 'Ocean World',
    emoji: '🐠',
    description: 'Dive into calm water, colourful reefs and glowing creatures.',
    day: { name: 'Coral Paradise', blurb: 'Turquoise water, sunbeams, fish and coral reefs.' },
    night: { name: 'Bioluminescent Deep', blurb: 'Deep navy water, glowing jellyfish and luminous coral.' },
  },
  {
    id: 'cozy',
    name: 'Cozy World',
    emoji: '☕',
    description: 'A snug little room with books, plants and warm light.',
    day: { name: 'Morning Nook', blurb: 'A sunlit window, houseplants, books and a cup of tea.' },
    night: { name: 'Midnight Nook', blurb: 'A glowing lamp, moonlit window, blankets and books.' },
  },
  {
    id: 'sakura',
    name: 'Sakura World',
    emoji: '🌸',
    description: 'Cherry blossoms drifting through a peaceful garden.',
    day: { name: 'Blossom Spring', blurb: 'Blossoming trees, pink petals and a peaceful garden.' },
    night: { name: 'Moonlit Sakura', blurb: 'Indigo skies, lanterns, glowing blossoms and drifting petals.' },
  },
];

export const VARIANTS = ['day', 'night'];
export const DEFAULT_APPEARANCE = { theme: 'light', variant: 'day' };

export const isWorldId = (id) => WORLDS.some((w) => w.id === id);
export const isBasicId = (id) => BASIC_THEMES.some((t) => t.id === id);

/** { theme: 'unicorn', variant: 'night' } -> 'unicorn-night';  { theme: 'dark' } -> 'dark' */
export const themeKey = ({ theme, variant }) => (isWorldId(theme) ? `${theme}-${variant === 'night' ? 'night' : 'day'}` : theme);

/** Clean up anything read from storage so a bad value can never break the page. */
export function normalizeAppearance(value) {
  const theme = value && typeof value === 'object' ? value.theme : null;
  if (isBasicId(theme)) return { theme, variant: 'day' };
  if (isWorldId(theme)) return { theme, variant: value.variant === 'night' ? 'night' : 'day' };
  return { ...DEFAULT_APPEARANCE };
}

export const getPalette = (key) => PALETTES[key] ?? PALETTES.light;
export const isDarkKey = (key) => getPalette(key).mode === 'dark';
export const isWorldKey = (key) => key.includes('-');

/* ------------------------------- CSS ------------------------------- */

const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

function variablesFor(p) {
  const v = [];
  const add = (name, hex) => v.push(`--c-${name}:${rgb(hex)}`);
  [50, 100, 200].forEach((s, i) => add(`cream-${s}`, p.cream[i]));
  [100, 200, 300, 400, 500].forEach((s, i) => {
    add(`blush-${s}`, p.blush[i]);
    add(`lilac-${s}`, p.lilac[i]);
  });
  [500, 600, 700, 800].forEach((s, i) => add(`ink-${s}`, p.ink[i]));
  add('white', p.white);
  Object.entries(p.tints).forEach(([name, shades]) => Object.entries(shades).forEach(([s, hex]) => add(`${name}-${s}`, hex)));
  add('shadow', p.shadow);
  add('petal', p.petal);
  add('scrim', p.scrim);
  // veil = even wash over the scenery; focus = extra wash in the middle so scenery lives at the edges and text stays clear
  v.push(`--shadow-a:${p.shadowAlpha}`, `--scene-veil:${p.veil}`, `--scene-focus:${p.veil ? (p.focus ?? (p.mode === 'dark' ? 0.4 : 0.42)) : 0}`, `--blob-opacity:${p.blobs}`);
  return v.join(';');
}

/** All theme rules as one CSS string. Light is also the :root default. */

export function buildThemeCss() {
  const rules = Object.entries(PALETTES).map(([key, p]) => {
    const selector = `[data-theme="${key}"]`;
    return `${selector}{color-scheme:${p.mode};${variablesFor(p)}}`;
  });

  // Keep the public page background fixed to the default light palette.
  rules.push(
    `html{background-color:rgb(${rgb(PALETTES.light.cream[1])})}`,
  );
  rules.push('body{background-color:transparent}');

  return rules.join('\n');
}


const STYLE_ID = 'moodbloom-theme-styles';

export function installThemeStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = buildThemeCss();
  document.head.appendChild(style);
}

/** Puts the chosen theme on <html> (data attributes drive the CSS above). */

export function applyThemeToDocument(key) {
  if (typeof document === 'undefined') return;

  // Keep the document on the fixed public-page theme.
  const root = document.documentElement;
  const defaultKey = themeKey(DEFAULT_APPEARANCE);
  const palette = getPalette(defaultKey);

  root.setAttribute('data-theme', defaultKey);
  root.setAttribute('data-mode', palette.mode);
  root.setAttribute('data-world', 'none');

  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', palette.cream[1]);
}


/* -------------------------- localStorage -------------------------- */

export function getAppearanceStorageKey(userId) {
  return userId
    ? `${APPEARANCE_STORAGE_KEY}.${userId}`
    : APPEARANCE_STORAGE_KEY;
}

export function loadAppearance(userId = null) {
  try {
    const raw = window.localStorage.getItem(
      getAppearanceStorageKey(userId)
    );

    return raw
      ? normalizeAppearance(JSON.parse(raw))
      : { ...DEFAULT_APPEARANCE };
  } catch {
    return { ...DEFAULT_APPEARANCE };
  }
}

/** true = saved, false = storage unavailable */
export function saveAppearance(value, userId = null) {
  try {
    window.localStorage.setItem(
      getAppearanceStorageKey(userId),
      JSON.stringify(normalizeAppearance(value))
    );
    return true;
  } catch {
    return false;
  }
}

/** Apply the default appearance before React renders. */
export function bootTheme() {
  installThemeStyles();
  applyThemeToDocument(themeKey(DEFAULT_APPEARANCE));
}
