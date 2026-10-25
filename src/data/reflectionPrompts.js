// Gentle reflection prompts for the Mood Insights page.
// The page picks from these based on the mood that showed up most.
export const reflectionPrompts = {
  happy: [
    'What helped you feel this good, and how could you invite more of it in?',
    'Who would you love to share a happy moment with this week?',
  ],
  calm: [
    'What does calm feel like in your body? Where do you notice it?',
    'Which small routine keeps you feeling steady?',
  ],
  grateful: [
    'Who made a difference to you lately, and how could you thank them?',
    'What is something ordinary that you would miss if it were gone?',
  ],
  tired: [
    'What would real rest look like for you today?',
    'Is there one thing you could set down so you can recharge?',
  ],
  anxious: [
    'What is within your control right now, and what can you let be?',
    'What would you say to a friend who felt the way you do?',
  ],
  sad: [
    'What do you need most right now: comfort, company, or quiet?',
    'It is okay to feel this. What is one kind thing you can do for yourself?',
  ],
  // Added when the period included heavier moods (tired, anxious, sad).
  gentle: [
    'When things felt heavy, what helped even a little?',
    'What is one small thing you are proud of getting through lately?',
  ],
  general: [
    'What is one small thing that made you smile recently?',
    'What would make tomorrow feel a little softer?',
    'What are you looking forward to, even something tiny?',
    'What did you learn about yourself this week?',
  ],
};
