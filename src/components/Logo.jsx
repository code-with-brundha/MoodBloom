import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

/** The MoodBloom logo image. Size it with className, e.g. "h-12 w-12". */
export function LogoMark({ className = 'h-11 w-11' }) {
  return <img src={logo} alt="" aria-hidden="true" className={`${className} object-contain`} />;
}

/** Logo + wordmark. Links to the landing page. */
export default function Logo({ className = '' }) {
  return (
    <Link
      to="/"
      aria-label="MoodBloom home"
      className={`inline-flex items-center gap-2 rounded-full ${className}`}
    >
      <LogoMark />
      <span className="font-display text-2xl font-semibold tracking-tight text-ink-800">
        Mood<span className="text-blush-400">Bloom</span>
      </span>
    </Link>
  );
}
