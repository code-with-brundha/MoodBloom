// Sample mood records for the Mood Tracker preview only.
// Will be replaced with real data from Supabase in the next step.
import { toDateInputValue } from '../utils/dates.js';

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toDateInputValue(d);
};

export const moodLogs = [
  { id: 1, date: daysAgo(20), mood: 'tired', note: 'Long week at work. Early night.' },
  { id: 2, date: daysAgo(17), mood: 'happy', note: 'Lunch with an old friend.' },
  { id: 3, date: daysAgo(15), mood: 'calm', note: '' },
  { id: 4, date: daysAgo(13), mood: 'anxious', note: 'Big presentation coming up.' },
  { id: 5, date: daysAgo(12), mood: 'happy', note: 'The presentation went well!' },
  { id: 6, date: daysAgo(10), mood: 'sad', note: 'Missing home today.' },
  { id: 7, date: daysAgo(9), mood: 'grateful', note: 'Mom called and we talked for ages.' },
  { id: 8, date: daysAgo(7), mood: 'tired', note: 'Barely slept.' },
  { id: 9, date: daysAgo(6), mood: 'calm', note: 'Slow morning with tea.' },
  { id: 10, date: daysAgo(5), mood: 'happy', note: 'Sunny walk in the park.' },
  { id: 11, date: daysAgo(4), mood: 'happy', note: 'Finished my project!' },
  { id: 12, date: daysAgo(3), mood: 'anxious', note: 'Too many thoughts about next week.' },
  { id: 13, date: daysAgo(3), mood: 'calm', note: 'Wrote it all down and felt lighter.' },
  { id: 14, date: daysAgo(1), mood: 'grateful', note: 'Little things added up to a good day.' },
  { id: 15, date: daysAgo(0), mood: 'calm', note: 'Rainy and peaceful.' },
];
