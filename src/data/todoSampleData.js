import { toDateInputValue } from '../utils/dates.js';
import { addDays } from '../utils/tasks.js';

// Demo tasks. Dates are relative to today so there's always something to see.
// TODO (next step): load these from Supabase instead.
const today = toDateInputValue();

export const todoTasks = [
  { id: 1, title: 'Morning stretch and a glass of water', description: '', date: today, time: '07:30', priority: 'low', completed: true },
  { id: 2, title: 'Write in my journal', description: 'Just a few lines about how today feels.', date: today, time: '09:00', priority: 'medium', completed: true },
  { id: 3, title: 'Finish the project outline', description: 'Only the first draft. It does not need to be perfect.', date: today, time: '11:00', priority: 'high', completed: false },
  { id: 4, title: 'Reply to Maya’s message', description: '', date: today, time: '15:30', priority: 'medium', completed: false },
  { id: 5, title: 'Evening walk outside', description: 'Phone stays in my pocket.', date: today, time: '18:30', priority: 'low', completed: false },
  { id: 6, title: 'Tidy my desk', description: '', date: today, time: '', priority: 'low', completed: false },
  { id: 7, title: 'Plan the week ahead', description: 'Three priorities, no more.', date: addDays(today, 1), time: '10:00', priority: 'high', completed: false },
  { id: 8, title: 'Call Mum', description: '', date: addDays(today, 1), time: '19:00', priority: 'medium', completed: false },
  { id: 9, title: 'Water the plants', description: '', date: addDays(today, -1), time: '08:00', priority: 'low', completed: true },
  { id: 10, title: 'Buy groceries', description: 'Fruit, oats, tea.', date: addDays(today, -1), time: '17:00', priority: 'medium', completed: false },
];
