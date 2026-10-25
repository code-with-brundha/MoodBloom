# 🌸 MoodBloom — Your Personal Space to Grow

MoodBloom is a personal mood and lifestyle web application designed to help you track your emotions, organize your daily life, and keep your personal goals in one place. With a calming interface and customizable themes, MoodBloom gives you a space to reflect, plan, and grow at your own pace.

## ✨ Features

- 🌈 **Mood Tracker** — Record and track your daily moods.
- 📔 **Personal Journal** — Write down your thoughts, feelings, and daily experiences.
- 🎯 **Goal Planner** — Set personal goals and keep track of your progress.
- ✅ **Daily To-Do List** — Organize your tasks and manage daily priorities.
- 🗓️ **Monthly Planner** — Keep track of important events and plans.
- 🌷 **Bucket List** — Save experiences and things you want to accomplish.
- 🎨 **Customizable Themes** — Personalize your experience with themes such as Unicorn and Space.
- ⚙️ **Settings & Profile** — Manage your profile and app preferences.
- 🔐 **Authentication** — User authentication powered by Supabase.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Development and build tooling |
| Tailwind CSS | Styling and responsive layouts |
| Supabase | Authentication and database services |
| React Router | Page navigation |
| Lucide React | Icons |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm
- A [Supabase](https://supabase.com/) account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR-USERNAME/MoodBloom.git
   ```

2. Navigate to the project directory:

   ```bash
   cd MoodBloom
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project root and add your Supabase configuration:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
   ```

   Use the exact environment variable names expected by your application. Never expose a Supabase service-role key or secret key in frontend code.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL displayed in your terminal.

## 🏗️ Build for Production

To create a production build, run:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 🔒 Security & Privacy

MoodBloom uses Supabase for authentication and database services. Configure appropriate Row Level Security (RLS) policies to ensure users can access only their own private data.

Permanent account deletion and complete removal of associated user data are planned for a future update.

## 🌱 Project Vision

MoodBloom aims to make everyday life feel a little more organized and personal by bringing mood tracking, journaling, planning, and goal setting together in one space.



*Bloom at your own pace. Every little step matters. 🌸*
