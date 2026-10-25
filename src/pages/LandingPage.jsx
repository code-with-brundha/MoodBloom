import Logo, { LogoMark } from '../components/Logo.jsx';
import Button from '../components/Button.jsx';
import SoftBackground from '../components/SoftBackground.jsx';
import { TAGLINE } from '../components/AuthLayout.jsx';

const highlights = [
  { emoji: '🌸', title: 'Write freely', text: 'A gentle space for your thoughts, with no pressure and no judgement.' },
  { emoji: '🌈', title: 'Notice your moods', text: 'Check in with how you feel and see the colours of your days.' },
  { emoji: '🌙', title: 'Look back kindly', text: 'Revisit your stories and watch yourself grow, one day at a time.' },
];

const moodChips = [
  { label: 'Happy', emoji: '😊', style: 'bg-blush-100 text-blush-500' },
  { label: 'Calm', emoji: '😌', style: 'bg-lilac-100 text-lilac-500' },
  { label: 'Cozy', emoji: '☁️', style: 'bg-cream-200 text-ink-600' },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SoftBackground />

      {/* Navigation */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-2">
          <Button to="/signin" variant="ghost" className="py-2">
            Sign In
          </Button>
          <Button to="/signup" className="hidden py-2 sm:inline-flex">
            Get Started
          </Button>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-8 sm:px-6 md:pt-14 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pb-24">
          <div className="animate-rise text-center lg:text-left">
            <span className="inline-block rounded-full bg-white/80 px-4 py-1.5 text-sm font-bold text-lilac-500 shadow-sm">
              ✨ A gentle little mood journal
            </span>

            <h1 className="mt-5 text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">
              Your feelings, your stories,{' '}
              <span className="bg-gradient-to-r from-blush-400 to-lilac-400 bg-clip-text text-transparent">
                your little world.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-600 lg:mx-0">
              MoodBloom is a soft, private place to check in with yourself. Capture how you feel,
              write down your day, and let your feelings bloom at their own pace.
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
              <Button to="/signup">Get Started</Button>
              <Button to="/signin" variant="secondary">
                Sign In
              </Button>
            </div>
          </div>

          {/* Decorative illustration (not a feature) */}
          <div aria-hidden="true" className="relative mx-auto flex w-full max-w-sm justify-center sm:max-w-md">
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-blush-200 to-lilac-200 opacity-70 blur-2xl" />
            <div className="relative w-full animate-float rounded-[2.5rem] border border-white/80 bg-white/70 p-8 shadow-soft backdrop-blur-md">
              <div className="flex justify-center">
                <LogoMark className="h-28 w-28 sm:h-32 sm:w-32" />
              </div>
              <p className="mt-5 text-center font-display text-xl text-ink-800">How are you feeling today?</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {moodChips.map((chip) => (
                  <span
                    key={chip.label}
                    className={`rounded-full px-4 py-2 text-sm font-bold ${chip.style}`}
                  >
                    {chip.emoji} {chip.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-white/80 bg-white/60 p-6 text-center shadow-soft backdrop-blur-sm transition hover:-translate-y-1 sm:text-left"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blush-100 to-lilac-100 text-2xl sm:mx-0">
                  {item.emoji}
                </div>
                <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-600">{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-lilac-200/60 px-4 py-8 text-center text-sm text-ink-500">
        <p className="font-display text-base text-ink-600">{TAGLINE}</p>
        <p className="mt-1">© {new Date().getFullYear()} MoodBloom. Made with care.</p>
      </footer>
    </div>
  );
}
