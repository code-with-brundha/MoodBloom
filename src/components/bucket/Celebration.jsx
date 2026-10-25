import { useEffect, useMemo } from 'react';

const COLORS = ['#F9A8C4', '#C9B8F0', '#FDCADB', '#A98EE2', '#FFE4EC', '#E0D6F8', '#F07FA6'];

/**
 * Soft confetti + a little toast when a dream is completed.
 * Self-contained (its keyframes live here), so no Tailwind config changes are needed.
 * Skips the confetti for people who prefer reduced motion.
 */
export default function Celebration({ title, onDone }) {
  const reduceMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.7,
        duration: 2.2 + Math.random() * 1.6,
        size: 8 + Math.random() * 8,
        color: COLORS[i % COLORS.length],
        round: i % 3 === 0,
      })),
    [],
  );

  useEffect(() => {
    const t = setTimeout(onDone, 3800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <>
      <style>{`
        @keyframes mb-fall { 0% { transform: translateY(-12vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(105vh) rotate(720deg); opacity: 0; } }
        @keyframes mb-pop { 0% { transform: scale(1); } 40% { transform: scale(1.04); } 100% { transform: scale(1); } }
        @keyframes mb-toast { 0% { opacity: 0; transform: translateY(16px) scale(.95); } 12%, 85% { opacity: 1; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(8px) scale(.98); } }
        .mb-pop { animation: mb-pop .9s ease-out; }
      `}</style>

      {!reduceMotion && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
          {pieces.map((p) => (
            <span
              key={p.id}
              className="absolute top-0 block"
              style={{
                left: `${p.left}%`,
                width: p.size,
                height: p.round ? p.size : p.size * 0.6,
                borderRadius: p.round ? '9999px' : '2px',
                backgroundColor: p.color,
                animation: `mb-fall ${p.duration}s ${p.delay}s ease-in forwards`,
                opacity: 0,
              }}
            />
          ))}
        </div>
      )}

      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
        <p
          className="max-w-sm rounded-full border border-white/80 bg-white/90 px-5 py-3 text-center text-sm font-bold text-ink-800 shadow-soft backdrop-blur-md"
          style={{ animation: 'mb-toast 3.8s ease-out forwards' }}
        >
          🎉 Dream achieved: {title}
        </p>
      </div>
    </>
  );
}
