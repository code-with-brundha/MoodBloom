/** Blurry pastel blobs that sit behind page content. Decorative only. */
export default function SoftBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" style={{ opacity: 'var(--blob-opacity, 1)' }}>
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blush-200/70 blur-3xl sm:h-96 sm:w-96" />
      <div className="absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-lilac-200/80 blur-3xl sm:h-[28rem] sm:w-[28rem]" />
      <div className="absolute -bottom-32 left-1/4 h-64 w-64 rounded-full bg-blush-100 blur-3xl sm:h-80 sm:w-80" />
    </div>
  );
}
