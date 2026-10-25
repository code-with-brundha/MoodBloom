/* My Profile helpers: demo storage (localStorage), validation and avatar processing. */
import { toDateInputValue } from './dates.js';

// Own key, so it never touches journal / mood / goals / planner / bucket list data.
export const PROFILE_STORAGE_KEY = 'moodbloom.profile.v1';

export const AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const AVATAR_MAX_BYTES = 5 * 1024 * 1024; // largest file we accept (5 MB)
const AVATAR_SIZE = 256; // photos are resized to 256x256 so they stay small enough for localStorage

export const BIO_MAX = 160;
const NAME_MAX = 60;
const LOCATION_MAX = 60;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9_.]{3,20}$/;

const TEXT_FIELDS = ['fullName', 'username', 'email', 'bio', 'dateOfBirth', 'location'];

// Demo values shown the first time. Not a real account.
export const defaultProfile = {
  avatar: null, // a small JPEG data URL, or null
  fullName: 'Friend',
  username: 'moodbloom_friend',
  email: 'friend@example.com',
  bio: 'Collecting little moments, one day at a time. 🌸',
  dateOfBirth: '',
  location: '',
};

/** Makes sure whatever came out of localStorage is safe to render. */
export function sanitizeProfile(raw) {
  const profile = { ...defaultProfile };
  if (raw && typeof raw === 'object') {
    TEXT_FIELDS.forEach((key) => {
      if (typeof raw[key] === 'string') profile[key] = raw[key];
    });
    profile.avatar =
      typeof raw.avatar === 'string' && raw.avatar.startsWith('data:image/') ? raw.avatar : null;
  }
  return profile;
}

export function loadProfile() {
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    return raw ? sanitizeProfile(JSON.parse(raw)) : { ...defaultProfile };
  } catch {
    // Storage blocked, or the saved value was damaged: fall back to the demo profile.
    return { ...defaultProfile };
  }
}

/** Returns { ok: true } or { ok: false, error } (storage full or blocked). */
export function saveProfile(profile) {
  try {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "We couldn't save to this browser. Storage may be full or blocked. Try a smaller photo or free some space.",
    };
  }
}

export const isSameProfile = (a, b) => a.avatar === b.avatar && TEXT_FIELDS.every((key) => a[key] === b[key]);

/** Trim the text fields before validating / saving. */
export function normalizeProfile(profile) {
  const next = { ...profile };
  TEXT_FIELDS.forEach((key) => {
    next[key] = profile[key].trim();
  });
  return next;
}

/** Friendly error for a username, or '' when it is fine. Shared by My Profile and Account & Security. */
export function validateUsername(value) {
  const username = (value ?? '').trim();
  if (!username) return 'Please choose a username.';
  if (!USERNAME_PATTERN.test(username)) return 'Use 3–20 letters, numbers, dots or underscores (no spaces).';
  return '';
}

/**
 * Changes ONLY the username inside the saved demo profile (photo, bio, etc. are kept as they are).
 * Returns { ok: true, profile } or { ok: false, error }.
 */
export function saveUsername(value) {
  const error = validateUsername(value);
  if (error) return { ok: false, error };
  const result = saveProfile({ ...loadProfile(), username: value.trim() });
  return result.ok ? { ok: true, profile: loadProfile() } : result;
}

/** Returns an object of friendly error messages, keyed by field. Empty = valid. */
export function validateProfile(values) {
  const errors = {};

  if (!values.fullName) errors.fullName = 'Please tell us your name.';
  else if (values.fullName.length > NAME_MAX) errors.fullName = `Your name can be up to ${NAME_MAX} characters.`;

  if (!values.username) errors.username = 'Please choose a username.';
  else if (!USERNAME_PATTERN.test(values.username))
    errors.username = 'Use 3–20 letters, numbers, dots or underscores (no spaces).';

  if (!values.email) errors.email = 'Please enter your email address.';
  else if (!EMAIL_PATTERN.test(values.email)) errors.email = 'Please enter a valid email, like you@example.com.';

  if (values.bio.length > BIO_MAX) errors.bio = `Your bio can be up to ${BIO_MAX} characters.`;

  if (values.dateOfBirth) {
    const parsed = new Date(`${values.dateOfBirth}T00:00:00`);
    if (Number.isNaN(parsed.getTime()) || values.dateOfBirth < '1900-01-01') {
      errors.dateOfBirth = 'Please enter a valid date.';
    } else if (values.dateOfBirth > toDateInputValue()) {
      errors.dateOfBirth = "Date of birth can't be in the future.";
    }
  }

  if (values.location.length > LOCATION_MAX) errors.location = `Location can be up to ${LOCATION_MAX} characters.`;

  return errors;
}

export function getInitials(name) {
  const letters = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => Array.from(word)[0].toUpperCase());
  return letters.join('') || '🌸';
}

/**
 * Checks a chosen image, then crops it to a square and shrinks it to 256x256.
 * Resolves with a small JPEG data URL (~10–30 KB); rejects with a friendly Error.
 */
export function processAvatarFile(file) {
  return new Promise((resolve, reject) => {
    if (!AVATAR_TYPES.includes(file.type)) {
      reject(new Error('Please choose a JPG, PNG or WebP image.'));
      return;
    }
    if (file.size > AVATAR_MAX_BYTES) {
      reject(new Error('That image is bigger than 5 MB. Please choose a smaller one.'));
      return;
    }

    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      try {
        const side = Math.min(image.naturalWidth, image.naturalHeight);
        if (!side) throw new Error('empty image');
        const canvas = document.createElement('canvas');
        canvas.width = AVATAR_SIZE;
        canvas.height = AVATAR_SIZE;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFF8F0'; // fills any transparent areas
        ctx.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
        const sx = (image.naturalWidth - side) / 2;
        const sy = (image.naturalHeight - side) / 2;
        ctx.drawImage(image, sx, sy, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      } catch {
        reject(new Error("We couldn't read that image. Please try a different one."));
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("We couldn't read that image. Please try a different one."));
    };
    image.src = url;
  });
}
