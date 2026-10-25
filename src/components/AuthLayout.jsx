import Logo from './Logo.jsx';
import SoftBackground from './SoftBackground.jsx';

export const TAGLINE = 'Your feelings, your stories, your little world.';

/**
 * Shared shell for the sign-up and sign-in pages.
 * Mobile/tablet: a single centered card. Desktop (lg+): text side panel + card.
 */
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="relative min-h-screen">
      <SoftBackground />

      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Side panel — desktop only */}
        <aside className="hidden lg:block">
          <Logo />
          <div className="mt-12 max-w-md">
            <h2 className="text-4xl font-semibold leading-tight">{TAGLINE}</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-600">
              A calm little corner of the internet, made for noticing how you feel.
            </p>
          </div>
        </aside>

        {/* Form card */}
        <main className="mx-auto w-full max-w-md animate-rise">
          <div className="mb-6 flex flex-col items-center text-center lg:hidden">
            <Logo />
            <p className="mt-2 text-sm text-ink-600">{TAGLINE}</p>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/70 p-6 shadow-soft backdrop-blur-md sm:p-9">
            <h1 className="text-3xl font-semibold">{title}</h1>
            <p className="mt-2 text-ink-600">{subtitle}</p>
            <div className="mt-7">{children}</div>
          </div>

          <p className="mt-6 text-center text-ink-600">{footer}</p>
        </main>
      </div>
    </div>
  );
}
