// Sample mood records for the Mood Insights preview only (about 90 days).
// Generated with a fixed seed, so it looks the same on every reload.
// TODO (next step): replace this with the user's real mood records from Supabase.
// Each record has the same shape as the Mood Tracker's: { id, date: 'YYYY-MM-DD', mood, note }.
import { toDateInputValue } from '../utils/dates.js';

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toDateInputValue(d);
};

// Small seeded random number generator (0 <= value < 1).
const seeded = (seed) => {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
};

const moodWeights = [
  ['calm', 22],
  ['happy', 22],
  ['grateful', 14],
  ['tired', 14],
  ['anxious', 16],
  ['sad', 8],
];

const notes = {
  calm: ['Slow morning with tea.', 'Rainy and peaceful.', 'A quiet evening walk.', 'Read for an hour. Perfect.', ''],
  happy: ['Sunny walk in the park.', 'Finished something I was proud of!', 'Lunch with a good friend.', 'Danced in the kitchen.', ''],
  grateful: ['Mom called and we talked for ages.', 'Little things added up to a good day.', 'Someone held the door and smiled.', ''],
  tired: ['Barely slept.', 'Long day, early night.', 'Brain fog all afternoon.', ''],
  anxious: ['Too many thoughts about next week.', 'Big deadline coming up.', 'Wrote it all down and felt lighter.', ''],
  sad: ['Missing home today.', 'Felt a bit lonely.', ''],
};

const total = moodWeights.reduce((sum, [, w]) => sum + w, 0);

export const insightsLogs = (() => {
  const rand = seeded(2026);
  const pickMood = () => {
    let r = rand() * total;
    for (const [mood, weight] of moodWeights) {
      r -= weight;
      if (r < 0) return mood;
    }
    return 'calm';
  };

  const logs = [];
  let id = 1;
  for (let n = 89; n >= 0; n -= 1) {
    if (n > 2 && rand() < 0.2) continue; // skip a few days, like real life
    const entries = rand() < 0.15 ? 2 : 1; // sometimes two check-ins in a day
    for (let i = 0; i < entries; i += 1) {
      const mood = pickMood();
      const options = notes[mood];
      logs.push({ id: id++, date: daysAgo(n), mood, note: options[Math.floor(rand() * options.length)] });
    }
  }
  return logs;
})();
