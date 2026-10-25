// Sample data for the dashboard preview only.
// Everything here will be replaced with real data from Supabase in the next step.

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const sampleUser = { name: 'Friend' };

export const moods = [
  { key: 'happy', label: 'Happy', emoji: '😊', chip: 'bg-amber-100 text-amber-700', ring: 'border-amber-300 bg-amber-50' },
  { key: 'calm', label: 'Calm', emoji: '😌', chip: 'bg-lilac-100 text-lilac-500', ring: 'border-lilac-300 bg-lilac-100' },
  { key: 'grateful', label: 'Grateful', emoji: '🥰', chip: 'bg-blush-100 text-blush-500', ring: 'border-blush-300 bg-blush-100' },
  { key: 'tired', label: 'Tired', emoji: '😴', chip: 'bg-sky-100 text-sky-700', ring: 'border-sky-300 bg-sky-50' },
  { key: 'anxious', label: 'Anxious', emoji: '😟', chip: 'bg-orange-100 text-orange-700', ring: 'border-orange-300 bg-orange-50' },
  { key: 'sad', label: 'Sad', emoji: '😢', chip: 'bg-indigo-100 text-indigo-600', ring: 'border-indigo-300 bg-indigo-50' },
];

export const recentEntries = [
  {
    id: 1,
    date: daysAgo(0),
    mood: 'calm',
    title: 'A slow, quiet morning',
    text: 'Made tea, opened the window and just listened to the rain for a while. Nothing to rush for today, and it feels really nice.',
  },
  {
    id: 2,
    date: daysAgo(1),
    mood: 'grateful',
    title: 'Little things I loved',
    text: 'My friend called out of nowhere, dinner turned out better than expected, and the sunset was unreal. Small things add up.',
  },
  {
    id: 3,
    date: daysAgo(3),
    mood: 'anxious',
    title: 'Too many thoughts',
    text: 'Felt overwhelmed thinking about next week. Wrote everything down and it already feels lighter. One step at a time.',
  },
  {
    id: 4,
    date: daysAgo(4),
    mood: 'happy',
    title: 'Finally finished it!',
    text: 'Wrapped up the project I have been working on for weeks. Treated myself to ice cream and did a tiny happy dance.',
  },
];

// Mood for each of the last 7 days (oldest first).
export const weekMoods = [
  { day: 'Mon', mood: 'tired' },
  { day: 'Tue', mood: 'calm' },
  { day: 'Wed', mood: 'happy' },
  { day: 'Thu', mood: 'anxious' },
  { day: 'Fri', mood: 'happy' },
  { day: 'Sat', mood: 'grateful' },
  { day: 'Sun', mood: 'calm' },
];

export const prompts = [
  'What is one small thing that made you smile today?',
  'Describe a moment this week when you felt at peace.',
  'What are you carrying right now that you could gently put down?',
  'Write a kind note to yourself, as if to a close friend.',
  'Who or what are you grateful for today, and why?',
  'What would make tomorrow feel a little softer?',
  'What is your body trying to tell you right now?',
];
