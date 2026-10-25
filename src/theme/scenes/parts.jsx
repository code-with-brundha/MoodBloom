/* Small reusable SVG building blocks for the theme scenery (viewBox 1600 x 900). */

/** Tiny seeded random generator, so scenery looks the same on every render. */
export function rng(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** Wraps children in a gently animated group. kind: drift | bob | glow | pulse | sway | swim | rise | fall | steam | flutter | spin | shoot */
export function Anim({ kind, dur, delay = 0, amp, rise, drift, children }) {
  const style = {};
  if (dur) style['--dur'] = `${dur}s`;
  if (delay) style['--delay'] = `${-Math.abs(delay)}s`;
  if (amp !== undefined) style['--amp'] = `${amp}px`;
  if (rise !== undefined) style['--rise'] = `${rise}px`;
  if (drift !== undefined) style['--drift'] = `${drift}px`;
  return (
    <g className={`mb-${kind}`} style={style}>
      {children}
    </g>
  );
}

/** Soft radial light. Put <GlowDef/> in <defs> and use fill={`url(#id)`}. */
export const GlowDef = ({ id, color, inner = 0.9, mid, outer = 0 }) => (
  <radialGradient id={id}>
    <stop offset="0" stopColor={color} stopOpacity={inner} />
    {mid !== undefined && <stop offset="0.45" stopColor={color} stopOpacity={mid} />}
    <stop offset="1" stopColor={color} stopOpacity={outer} />
  </radialGradient>
);

export const Glow = ({ id, x, y, r, opacity = 1, className, style }) => (
  <circle cx={x} cy={y} r={r} fill={`url(#${id})`} opacity={opacity} className={className} style={style} />
);

/** Four-point sparkle. */
export function Sparkle({ x, y, s = 1, fill = '#fff', delay = 0, dur = 3.6, opacity = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
      <path
        className="mb-twinkle"
        style={{ '--delay': `${-delay}s`, '--dur': `${dur}s` }}
        d="M0 -12 Q1.6 -1.6 12 0 Q1.6 1.6 0 12 Q-1.6 1.6 -12 0 Q-1.6 -1.6 0 -12Z"
        fill={fill}
      />
    </g>
  );
}

/** A field of little stars (some twinkle). */
export function Stars({ seed = 1, count = 80, box = [0, 0, 1600, 500], colors = ['#FFFFFF'], maxR = 2, twinkle = 0.45 }) {
  const r = rng(seed);
  const items = Array.from({ length: count }, () => ({
    x: box[0] + r() * (box[2] - box[0]),
    y: box[1] + r() * (box[3] - box[1]),
    r: 0.6 + r() * maxR,
    c: colors[Math.floor(r() * colors.length)],
    tw: r() < twinkle,
    d: r() * 6,
    dur: 2.4 + r() * 3.2,
    o: 0.5 + r() * 0.5,
  }));
  return (
    <g>
      {items.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill={s.c}
          opacity={s.o}
          className={s.tw ? 'mb-twinkle' : undefined}
          style={s.tw ? { '--delay': `${-s.d}s`, '--dur': `${s.dur}s` } : undefined}
        />
      ))}
    </g>
  );
}

/** Fluffy cloud made of circles, centred on (x, y). */
export function Cloud({ x, y, s = 1, fill = '#FFFFFF', opacity = 0.92 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity} fill={fill}>
      <ellipse cx="0" cy="6" rx="110" ry="30" />
      <circle cx="-52" cy="-14" r="36" />
      <circle cx="4" cy="-32" r="46" />
      <circle cx="58" cy="-12" r="34" />
    </g>
  );
}

/** Rolling hill: a wavy ridge around height y, filled down to the bottom. */
export function Hill({ y, amp = 60, fill, opacity = 1, shift = 0 }) {
  const a = amp;
  return (
    <path
      opacity={opacity}
      fill={fill}
      d={`M-40 ${y + shift} C 260 ${y - a + shift}, 520 ${y + a * 0.8 + shift}, 820 ${y - a * 0.3 + shift} S 1340 ${y - a + shift}, 1640 ${y + a * 0.4 + shift} L1640 920 L-40 920 Z`}
    />
  );
}

/** Simple five-petal flower on a stem. */
export function Flower({ x, y, s = 1, petal = '#FFB3D1', center = '#FFE27A', stem = '#6CC38A', h = 34 }) {
  const petals = [0, 72, 144, 216, 288];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M0 0 Q3 ${-h / 2} 0 ${-h}`} stroke={stem} strokeWidth="3" fill="none" strokeLinecap="round" />
      <g transform={`translate(0 ${-h})`}>
        {petals.map((a) => (
          <circle key={a} cx={Math.sin((a * Math.PI) / 180) * 8} cy={-Math.cos((a * Math.PI) / 180) * 8} r="7" fill={petal} />
        ))}
        <circle r="5" fill={center} />
      </g>
    </g>
  );
}

/** Towers, roofs and a gate. Colours are passed in so the same castle works day and night. */
export function Castle({ x, y, s = 1, wall, roof, roof2, win, trim, flag = '#FF8FC4' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-132" y="-130" width="54" height="130" rx="4" fill={wall} />
      <rect x="78" y="-150" width="54" height="150" rx="4" fill={wall} />
      <rect x="-64" y="-190" width="128" height="190" rx="4" fill={wall} />
      <path d="M-144 -130 L-105 -214 L-66 -130Z" fill={roof2} />
      <path d="M66 -150 L105 -246 L144 -150Z" fill={roof2} />
      <path d="M-76 -190 L0 -320 L76 -190Z" fill={roof} />
      <path d="M0 -320 V-354" stroke={trim} strokeWidth="3" />
      <path d="M0 -354 L32 -343 L0 -332Z" fill={flag} />
      <path d="M-105 -214 V-240" stroke={trim} strokeWidth="2.5" />
      <path d="M105 -246 V-272" stroke={trim} strokeWidth="2.5" />
      <rect x="-13" y="-152" width="26" height="42" rx="13" fill={win} />
      <rect x="-118" y="-100" width="22" height="34" rx="11" fill={win} />
      <rect x="92" y="-110" width="22" height="34" rx="11" fill={win} />
      <rect x="-12" y="-96" width="24" height="30" rx="4" fill={win} opacity=".75" />
      <path d="M-24 0 V-48 A24 24 0 0 1 24 -48 V0Z" fill={trim} />
    </g>
  );
}

/** A hanging paper lantern / simple warm glow ball centred at the top of its string. */
export function Lantern({ x, y, len = 70, s = 1, body = '#FFB45E', glow, swayDur = 6, delay = 0 }) {
  return (
    <Anim kind="sway" dur={swayDur} delay={delay}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <line x1="0" y1="0" x2="0" y2={len} stroke="#2A1B3F" strokeWidth="2" />
        <g transform={`translate(0 ${len})`}>
          {glow && <circle cx="0" cy="34" r="90" fill={glow} />}
          <rect x="-16" y="0" width="32" height="6" rx="2" fill="#2A1B3F" />
          <ellipse cx="0" cy="34" rx="26" ry="32" fill={body} />
          <path d="M-26 34 Q0 14 26 34 M-26 34 Q0 54 26 34" stroke="#FFF1CF" strokeOpacity=".5" strokeWidth="2" fill="none" />
          <rect x="-16" y="62" width="32" height="6" rx="2" fill="#2A1B3F" />
          <line x1="0" y1="68" x2="0" y2="86" stroke="#FFD28A" strokeWidth="3" />
        </g>
      </g>
    </Anim>
  );
}
