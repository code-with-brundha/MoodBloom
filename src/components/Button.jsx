import { Link } from 'react-router-dom';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-base font-bold ' +
  'transition duration-200 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60';

const variants = {
  primary:
    'bg-gradient-to-r from-blush-300 to-lilac-300 text-ink-800 shadow-petal hover:-translate-y-0.5 hover:shadow-soft',
  secondary:
    'border-2 border-lilac-300 bg-white/70 text-ink-700 hover:-translate-y-0.5 hover:bg-lilac-100',
  ghost: 'px-4 text-ink-600 hover:bg-lilac-100',
};

/**
 * Renders a router <Link> when `to` is provided, otherwise a <button>.
 * variant: 'primary' | 'secondary' | 'ghost'
 */
export default function Button({ to, variant = 'primary', className = '', children, ...props }) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
