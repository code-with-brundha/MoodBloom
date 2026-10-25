// Sample journal entries for the My Journal preview only.
// Will be replaced with real data from Supabase in the next step.
import { toDateInputValue } from '../utils/dates.js';

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toDateInputValue(d);
};

export const journalEntries = [
  {
    id: 1,
    date: daysAgo(0),
    mood: 'calm',
    title: 'A slow, quiet morning',
    text: 'Made tea, opened the window and just listened to the rain for a while. Nothing to rush for today, and it feels really nice. I want more mornings like this.',
  },
  {
    id: 2,
    date: daysAgo(1),
    mood: 'grateful',
    title: 'Little things I loved',
    text: 'My friend called out of nowhere, dinner turned out better than expected, and the sunset was unreal. Small things add up to a really good day.',
  },
  {
    id: 3,
    date: daysAgo(3),
    mood: 'anxious',
    title: 'Too many thoughts',
    text: 'Felt overwhelmed thinking about next week. Wrote everything down and it already feels lighter. One step at a time, and I do not have to solve it all tonight.',
  },
  {
    id: 4,
    date: daysAgo(4),
    mood: 'happy',
    title: 'Finally finished it!',
    text: 'Wrapped up the project I have been working on for weeks. Treated myself to ice cream and did a tiny happy dance in the kitchen.',
  },
  {
    id: 5,
    date: daysAgo(7),
    mood: 'tired',
    title: 'Running on empty',
    text: 'Barely slept and the day dragged on. Cancelled my evening plans and went to bed early. Rest is not lazy, it is necessary.',
  },
  {
    id: 6,
    date: daysAgo(10),
    mood: 'sad',
    title: 'Missing home',
    text: 'Looked through old photos tonight and felt a little homesick. Called mom and we talked for an hour. I feel a bit better now.',
  },
  {
    id: 7,
    date: daysAgo(14),
    mood: 'happy',
    title: 'Picnic in the park',
    text: 'Sunshine, sandwiches and a good book. We stayed until the sky turned pink. Days like this are what I want to remember.',
  },
  {
    id: 8,
    date: daysAgo(18),
    mood: 'calm',
    title: 'Evening walk',
    text: 'Went for a long walk without my phone. The air smelled like rain and I finally felt my shoulders drop.',
  },
];
