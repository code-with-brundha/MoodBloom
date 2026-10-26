/* Data Management: overview, export, import and clearing of the data MoodBloom keeps in THIS browser.
 *
 * Safety rules built into this file:
 *  - It only ever touches the fixed list of MoodBloom keys in CATEGORIES below. It never loops over
 *    localStorage, so other websites' / apps' entries can never be read, exported or removed.
 *  - Journal entries, mood records and to-do tasks are NOT saved by MoodBloom yet (sample data in memory),
 *    so they are never counted, exported, imported or cleared here. NOT_STORED lists them for the interface.
 *  - Exports only contain whitelisted, sanitized data. MoodBloom stores no passwords or sign-in secrets.
 *  - Imported files are untrusted: every item is run through the same normalize/sanitize functions the
 *    features use for their own saved data. Nothing from a file is ever executed.
 */
import { GOALS_STORAGE_KEY, normalizeGoal } from './goals.js';
import { PLANNER_STORAGE_KEY, normalizeEvent } from './planner.js';
import { BUCKET_STORAGE_KEY, normalizeItem } from './bucket.js';
import { PROFILE_STORAGE_KEY, sanitizeProfile } from './profile.js';
import { PREFERENCES_STORAGE_KEY, sanitizePreferences } from './preferences.js';
import { REMINDERS_STORAGE_KEY, sanitizeReminders } from './reminders.js';
import { APPEARANCE_STORAGE_KEY, normalizeAppearance } from '../theme/themes.js';

export const EXPORT_FILENAME = 'moodbloom-my-data.json';
export const EXPORT_FORMAT_VERSION = 1;
export const MAX_IMPORT_BYTES = 5 * 1024 * 1024; // refuse anything bigger than 5 MB
const MAX_AVATAR_CHARS = 400000; // a photo bigger than this would not fit comfortably in localStorage

/**
 * Everything MoodBloom saves in this browser. `path` is where it lives inside the export file's "data" object.
 * kind: 'list' = an array of items with ids (can be merged), 'single' = one settings object (can only be replaced).
 */
export const CATEGORIES = [
  { key: 'goals', label: 'Goals & milestones', kind: 'list', storageKey: GOALS_STORAGE_KEY, path: ['goals'] },
  { key: 'planner', label: 'Planner events', kind: 'list', storageKey: PLANNER_STORAGE_KEY, path: ['plannerEvents'] },
  { key: 'bucket', label: 'Bucket-list items', kind: 'list', storageKey: BUCKET_STORAGE_KEY, path: ['bucketList'] },
  { key: 'profile', label: 'Profile', kind: 'single', storageKey: PROFILE_STORAGE_KEY, path: ['profile'] },
  { key: 'appearance', label: 'Appearance & theme', kind: 'single', storageKey: APPEARANCE_STORAGE_KEY, path: ['settings', 'appearance'] },
  { key: 'privacy', label: 'Privacy & journal preferences', kind: 'single', storageKey: PREFERENCES_STORAGE_KEY, path: ['settings', 'privacy'] },
  { key: 'reminders', label: 'Reminders', kind: 'single', storageKey: REMINDERS_STORAGE_KEY, path: ['settings', 'reminders'] },
];
export const categoryByKey = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));



const NORMALIZERS = { goals: normalizeGoal, planner: normalizeEvent, bucket: normalizeItem };
const SINGLE_SANITIZERS = {
  profile: sanitizeProfile,
  appearance: normalizeAppearance,
  privacy: sanitizePreferences,
  reminders: sanitizeReminders,
};

/* ------------------------------ helpers ----------------------------- */

const getRaw = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const parseJson = (raw) => {
  try {
    return { ok: true, value: JSON.parse(raw) };
  } catch {
    return { ok: false };
  }
};

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

const getAt = (obj, path) => path.reduce((acc, k) => (isPlainObject(acc) ? acc[k] : undefined), obj);

/** Items from a list that are valid, de-duplicated by id. `skipped` counts incomplete or duplicate entries. */
function cleanList(key, rawList) {
  const normalize = NORMALIZERS[key];
  const seen = new Set();
  const items = [];
  rawList.forEach((raw) => {
    const item = normalize(raw);
    if (item && !seen.has(item.id)) {
      seen.add(item.id);
      items.push(item);
    }
  });
  return { items, skipped: rawList.length - items.length };
}

/** What is saved right now for one category: { stored, items | value }. Damaged storage counts as "not saved". */
export function readCategory(key) {
  const cat = categoryByKey[key];
  const raw = getRaw(cat.storageKey);
  if (raw === null) return { stored: false };
  const parsed = parseJson(raw);
  if (!parsed.ok) return { stored: false };
  if (cat.kind === 'list') {
    if (!Array.isArray(parsed.value)) return { stored: false };
    return { stored: true, items: cleanList(key, parsed.value).items };
  }
  if (!isPlainObject(parsed.value)) return { stored: false };
  return { stored: true, value: SINGLE_SANITIZERS[key](parsed.value) };
}

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** One short, truthful line for a category, from data that really is saved. */
export function describeCategory(key, data) {
  if (!data.stored) return 'Nothing saved yet';
  if (key === 'goals') {
    if (data.items.length === 0) return 'None saved yet';
    const milestones = data.items.reduce((sum, g) => sum + g.milestones.length, 0);
    return `${plural(data.items.length, 'goal')} · ${plural(milestones, 'milestone')}`;
  }
  if (key === 'planner') return data.items.length ? plural(data.items.length, 'event') : 'None saved yet';
  if (key === 'bucket') return data.items.length ? plural(data.items.length, 'item') : 'None saved yet';
  return 'Saved in this browser';
}

/** Overview of everything saved. Returns { goals: {stored, items, text}, ... } */
export function getOverview() {
  const out = {};
  CATEGORIES.forEach((cat) => {
    const data = readCategory(cat.key);
    out[cat.key] = { ...data, text: describeCategory(cat.key, data) };
  });
  return out;
}

/** True when a category holds something the person could export or clear. */
export const hasContent = (data) => Boolean(data?.stored) && (data.items ? data.items.length > 0 : true);

/* ------------------------------- export ----------------------------- */

/**
 * Builds the export file from what is saved in this browser. Nothing from the cloud (there is none yet).
 * Returns { ok: true, payload, included: [keys] } or { ok: false, error }.
 */
export function buildExport(now = new Date()) {
  try {
    const data = {};
    const included = [];
    CATEGORIES.forEach((cat) => {
      const saved = readCategory(cat.key);
      if (!saved.stored) return;
      const value = cat.kind === 'list' ? saved.items : saved.value;
      // place under data.<path...>
      let target = data;
      cat.path.slice(0, -1).forEach((p) => {
        target[p] = target[p] ?? {};
        target = target[p];
      });
      target[cat.path[cat.path.length - 1]] = value;
      included.push(cat.key);
    });
    if (included.length === 0) return { ok: false, error: 'empty' };

    const payload = {
      app: 'MoodBloom',
      formatVersion: EXPORT_FORMAT_VERSION,
      exportedAt: now.toISOString(),
      source: 'This browser only (local demo storage). No cloud data is included.',
      notIncluded: {
        journalEntries: 'Not saved in this browser yet (sample data only).',
        moodRecords: 'Not saved in this browser yet (sample data only).',
        dailyTodoTasks: 'Not saved in this browser yet (sample data only).',
      },
      data,
    };
    return { ok: true, payload, included };
  } catch {
    return { ok: false, error: 'failed' };
  }
}

/** Starts a browser download. Returns { ok }. */
export function downloadJson(payload, filename = EXPORT_FILENAME) {
  try {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

/* ------------------------------- import ----------------------------- */

const fail = (error) => ({ ok: false, error });

/**
 * Checks the text of a chosen file. Returns { ok: false, error } with a friendly message,
 * or { ok: true, exportedAt, categories: { key: { items | value, skipped, note } }, ignored: [labels] }.
 */
export function parseImportText(text, sizeBytes = text?.length ?? 0) {
  if (sizeBytes > MAX_IMPORT_BYTES) return fail('That file is bigger than 5 MB, so it can’t be a MoodBloom export.');
  if (typeof text !== 'string' || !text.trim()) return fail('That file is empty.');

  const parsed = parseJson(text);
  if (!parsed.ok) return fail('That file isn’t valid JSON, so we can’t read it. Please choose a file exported from MoodBloom.');
  const file = parsed.value;
  if (!isPlainObject(file) || file.app !== 'MoodBloom') {
    return fail('This doesn’t look like a MoodBloom export. Please choose a file you downloaded with “Export my data”.');
  }
  if (!Number.isInteger(file.formatVersion) || file.formatVersion < 1) {
    return fail('This MoodBloom file is missing its version information, so it can’t be imported safely.');
  }
  if (file.formatVersion > EXPORT_FORMAT_VERSION) {
    return fail('This file was made by a newer version of MoodBloom, so this version can’t import it safely.');
  }
  if (!isPlainObject(file.data)) return fail('This MoodBloom file has no data section, so there is nothing to import.');

  const categories = {};
  CATEGORIES.forEach((cat) => {
    const raw = getAt(file.data, cat.path);
    if (raw === undefined || raw === null) return;
    if (cat.kind === 'list') {
      if (!Array.isArray(raw)) return;
      const { items, skipped } = cleanList(cat.key, raw);
      if (items.length === 0 && raw.length > 0) {
        categories[cat.key] = { items, skipped, note: 'None of the items in the file were complete enough to import.' };
      } else {
        categories[cat.key] = { items, skipped };
      }
    } else {
      if (!isPlainObject(raw)) return;
      let value = SINGLE_SANITIZERS[cat.key](raw);
      let note = '';
      if (cat.key === 'profile' && value.avatar && value.avatar.length > MAX_AVATAR_CHARS) {
        value = { ...value, avatar: null };
        note = 'The profile photo in the file was too large and will be left out.';
      }
      categories[cat.key] = { value, skipped: 0, note };
    }
  });

  const importable = Object.values(categories).filter((c) => (c.items ? c.items.length > 0 : true));
  if (importable.length === 0) return fail('This file doesn’t contain any MoodBloom data we can import.');

  const exportedAt = typeof file.exportedAt === 'string' && !Number.isNaN(Date.parse(file.exportedAt)) ? file.exportedAt : '';
  return { ok: true, exportedAt, categories };
}

/**
 * Shows what an import would do, using what is saved right now.
 * mode: 'merge' (add what isn't here yet, keep everything already saved) | 'replace' (swap in the file's version).
 */
export function planImport(parsed, mode) {
  return CATEGORIES.filter((cat) => parsed.categories[cat.key]).map((cat) => {
    const incoming = parsed.categories[cat.key];
    const current = readCategory(cat.key);
    if (cat.kind === 'list') {
      const existingIds = new Set((current.items ?? []).map((i) => i.id));
      const fresh = incoming.items.filter((i) => !existingIds.has(i.id)).length;
      const duplicates = incoming.items.length - fresh;
      return {
        key: cat.key,
        label: cat.label,
        kind: 'list',
        incoming: incoming.items.length,
        existing: current.items?.length ?? 0,
        add: mode === 'replace' ? incoming.items.length : fresh,
        skip: mode === 'replace' ? 0 : duplicates,
        replaces: mode === 'replace' ? (current.items?.length ?? 0) : 0,
        invalid: incoming.skipped,
        note: incoming.note || '',
        hasExisting: hasContent(current),
      };
    }
    return {
      key: cat.key,
      label: cat.label,
      kind: 'single',
      incoming: 1,
      existing: current.stored ? 1 : 0,
      add: current.stored ? 0 : 1,
      skip: 0,
      replaces: current.stored ? 1 : 0,
      invalid: 0,
      note: incoming.note || '',
      hasExisting: Boolean(current.stored),
    };
  });
}

function dispatchStorageEvent(key) {
  try {
    window.dispatchEvent(new StorageEvent('storage', { key }));
  } catch {
    /* older browsers: pages still read fresh data when they open */
  }
}

/**
 * Writes the chosen categories. All-or-nothing: if the browser refuses any write, everything already
 * written is put back exactly as it was. Returns { ok: true, applied: [...] } or { ok: false, error }.
 */
export function applyImport(parsed, selectedKeys, mode) {
  const keys = CATEGORIES.map((c) => c.key).filter((k) => selectedKeys.includes(k) && parsed.categories[k]);
  if (keys.length === 0) return { ok: false, error: 'Nothing was selected to import.' };

  const before = {};
  keys.forEach((k) => {
    before[k] = getRaw(categoryByKey[k].storageKey);
  });

  const applied = [];
  try {
    keys.forEach((key) => {
      const cat = categoryByKey[key];
      const incoming = parsed.categories[key];
      let next;
      let summary;
      if (cat.kind === 'list') {
        const current = readCategory(key).items ?? [];
        if (mode === 'replace') {
          next = incoming.items;
          summary = { key, label: cat.label, added: incoming.items.length, skipped: 0, replaced: current.length };
        } else {
          const ids = new Set(current.map((i) => i.id));
          const fresh = incoming.items.filter((i) => !ids.has(i.id));
          next = [...current, ...fresh];
          summary = { key, label: cat.label, added: fresh.length, skipped: incoming.items.length - fresh.length, replaced: 0 };
        }
      } else {
        next = incoming.value;
        summary = { key, label: cat.label, added: 1, skipped: 0, replaced: before[key] !== null ? 1 : 0 };
      }
      window.localStorage.setItem(cat.storageKey, JSON.stringify(next));
      applied.push(summary);
    });
  } catch {
    // Put back whatever was there before, so the person's data is never left half-imported.
    keys.forEach((k) => {
      try {
        const storageKey = categoryByKey[k].storageKey;
        if (before[k] === null) window.localStorage.removeItem(storageKey);
        else window.localStorage.setItem(storageKey, before[k]);
      } catch {
        /* nothing more we can do */
      }
    });
    return {
      ok: false,
      error: 'We couldn’t save the imported data to this browser (storage may be full or blocked). Nothing was changed.',
    };
  }

  if (keys.includes('appearance')) dispatchStorageEvent(APPEARANCE_STORAGE_KEY);
  if (keys.includes('privacy')) dispatchStorageEvent(PREFERENCES_STORAGE_KEY);
  return { ok: true, applied };
}

/* ------------------------------- clear ------------------------------ */

/**
 * Removes ONLY the chosen categories' MoodBloom keys from this browser. Cloud data and accounts
 * are not involved (there are none yet). Returns { ok, cleared: [keys], failed: [keys] }.
 */
export function clearCategories(selectedKeys) {
  const cleared = [];
  const failed = [];
  CATEGORIES.forEach((cat) => {
    if (!selectedKeys.includes(cat.key)) return;
    try {
      window.localStorage.removeItem(cat.storageKey);
      cleared.push(cat.key);
    } catch {
      failed.push(cat.key);
    }
  });
  if (cleared.includes('appearance')) dispatchStorageEvent(APPEARANCE_STORAGE_KEY);
  if (cleared.includes('privacy')) dispatchStorageEvent(PREFERENCES_STORAGE_KEY);
  return { ok: failed.length === 0, cleared, failed };
}
