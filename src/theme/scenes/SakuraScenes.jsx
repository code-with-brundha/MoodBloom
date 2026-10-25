import { Anim, Glow, GlowDef, Hill, Lantern, Stars, rng } from './parts.jsx';

/** A cluster of blossoms around a point. */
function Blossoms({ seed, cx, cy, spread = 120, count = 22, colors, min = 14, max = 30, glow }) {
  const r = rng(seed);
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const a = r() * Math.PI * 2;
        const d = Math.sqrt(r()) * spread;
        const x = cx + Math.cos(a) * d * 1.25;
        const y = cy + Math.sin(a) * d * 0.8;
        const rad = min + r() * (max - min);
        return (
          <g key={i}>
            {glow && <circle cx={x} cy={y} r={rad * 2.2} fill={glow} opacity="0.18" />}
            <circle cx={x} cy={y} r={rad} fill={colors[i % colors.length]} opacity="0.92" />
            <circle cx={x - rad * 0.25} cy={y - rad * 0.2} r={rad * 0.28} fill="#fff" opacity="0.35" />
          </g>
        );
      })}
    </g>
  );
}

function Petals({ seed, count, colors, glow }) {
  const r = rng(seed);
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <Anim key={i} kind="fall" dur={16 + r() * 14} delay={r() * 30} drift={-160 + r() * 380}>
          <g transform={`translate(${r() * 1600} 0) rotate(${r() * 360})`}>
            <ellipse rx={8 + r() * 5} ry={5 + r() * 3} fill={colors[i % colors.length]} />
            {glow && <circle r="14" fill={glow} opacity="0.12" />}
          </g>
        </Anim>
      ))}
    </>
  );
}

const trunkPath = 'M1500 900 C1480 760 1400 700 1380 560 C1360 440 1260 400 1180 320';

/** Day: Blossom Spring. Cherry blossom trees, pink petals, a peaceful garden and soft sunshine. */
export function SakuraDay(p) {
  return (
    <>
      <defs>
        <linearGradient id={`${p}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD9E8" />
          <stop offset="0.5" stopColor="#FFF1F5" />
          <stop offset="1" stopColor="#E4F3FF" />
        </linearGradient>
        <GlowDef id={`${p}sun`} color="#FFF3C4" inner={0.9} mid={0.25} />
        <linearGradient id={`${p}water`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#BFE6F5" /><stop offset="1" stopColor="#9ED3EA" /></linearGradient>
      </defs>
      <rect width="1600" height="900" fill={`url(#${p}sky)`} />
      <Glow id={`${p}sun`} x={360} y={130} r={400} opacity={0.9} />
      <path d="M0 640 L200 520 L360 600 L560 470 L760 610 L960 540 L1180 640 L1400 560 L1600 620 V900 H0Z" fill="#F4D4E2" opacity="0.7" />

      <Hill y={720} amp={40} fill="#D3EDC6" />
      <g stroke="#7E5149" strokeLinecap="round" fill="none">
        <path d={trunkPath} strokeWidth="46" />
        <path d="M1380 560 C1460 500 1500 420 1480 340" strokeWidth="26" />
        <path d="M1180 320 C1100 290 1040 250 960 250" strokeWidth="22" />
        <path d="M1260 400 C1200 440 1140 450 1080 500" strokeWidth="20" />
      </g>
      <Blossoms seed={2} cx={1240} cy={300} spread={190} count={36} colors={['#FFB7D0', '#FFC9DC', '#FF9EC0', '#FFDCE8']} />
      <Blossoms seed={4} cx={980} cy={250} spread={120} count={20} colors={['#FFB7D0', '#FFC9DC', '#FFDCE8']} />
      <Blossoms seed={6} cx={1500} cy={360} spread={140} count={24} colors={['#FF9EC0', '#FFB7D0', '#FFC9DC']} />
      <Blossoms seed={8} cx={1110} cy={500} spread={90} count={14} colors={['#FFC9DC', '#FFDCE8']} />
      <g stroke="#7E5149" strokeLinecap="round" fill="none" strokeWidth="18">
        <path d="M-20 70 C120 90 200 150 300 130" /><path d="M120 100 C150 170 190 200 250 210" strokeWidth="12" />
      </g>
      <Blossoms seed={12} cx={180} cy={150} spread={170} count={28} colors={['#FFB7D0', '#FFC9DC', '#FF9EC0', '#FFDCE8']} />

      <Hill y={800} amp={34} fill="#BCE3AA" shift={6} />
      <ellipse cx="640" cy="842" rx="260" ry="34" fill={`url(#${p}water)`} />
      <ellipse cx="600" cy="838" rx="80" ry="8" fill="#fff" opacity="0.45" />
      <path d="M470 840 Q640 770 810 840" stroke="#E7A9A0" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M470 846 Q640 790 810 846" stroke="#F6D0C8" strokeWidth="6" fill="none" strokeLinecap="round" />
      <Hill y={868} amp={24} fill="#A5D993" shift={12} />
      {[120, 210, 300, 1010, 1100, 1190].map((x, i) => <ellipse key={x} cx={x} cy={876 + (i % 2) * 6} rx="30" ry="9" fill="#EADFD4" />)}
      <g>
        <rect x="1380" y="830" width="14" height="42" fill="#C9B8A8" /><rect x="1362" y="814" width="50" height="18" rx="4" fill="#D8C9BA" />
        <path d="M1352 814 H1422 L1388 790Z" fill="#B9A593" />
      </g>
      <Petals seed={3} count={26} colors={['#FFB7D0', '#FFC9DC', '#FF9EC0']} />
    </>
  );
}

/** Night: Moonlit Sakura. Indigo skies, a glowing moon, lanterns, illuminated blossoms and drifting petals. */
export function SakuraNight(p) {
  return (
    <>
      <defs>
        <linearGradient id={`${p}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B0830" />
          <stop offset="0.55" stopColor="#201756" />
          <stop offset="1" stopColor="#4B2F86" />
        </linearGradient>
        <GlowDef id={`${p}moon`} color="#FFF0D4" inner={0.7} mid={0.2} />
        <GlowDef id={`${p}lit`} color="#FF9EC8" inner={0.9} />
        <GlowDef id={`${p}lan`} color="#FFB45E" inner={0.85} />
      </defs>
      <rect width="1600" height="900" fill={`url(#${p}sky)`} />
      <Stars seed={14} count={70} box={[0, 0, 1600, 420]} colors={['#FFFFFF', '#FFE6F5', '#D5D0FF']} />
      <Glow id={`${p}moon`} x={1010} y={140} r={330} />
      <circle cx="1010" cy="140" r="70" fill="#FFF3DA" />
      <circle cx="990" cy="124" r="11" fill="#F1DDBD" opacity="0.7" /><circle cx="1030" cy="160" r="8" fill="#F1DDBD" opacity="0.7" />
      <path d="M0 650 L200 540 L400 620 L620 500 L820 630 L1040 560 L1260 650 L1440 580 L1600 640 V900 H0Z" fill="#2B1D63" opacity="0.8" />

      <path d="M0 110 Q400 220 800 140 T1600 120" stroke="#2A1B3F" strokeWidth="2" fill="none" />
      <Lantern x={180} y={150} len={30} s={1} glow={`url(#${p}lan)`} delay={0} />
      <Lantern x={520} y={188} len={50} s={0.9} body="#FF9E7A" glow={`url(#${p}lan)`} delay={2} swayDur={7} />
      <Lantern x={900} y={176} len={36} s={1.05} glow={`url(#${p}lan)`} delay={4} swayDur={5.5} />
      <Lantern x={1260} y={150} len={44} s={0.95} body="#FF9E7A" glow={`url(#${p}lan)`} delay={1} swayDur={6.5} />
      <Lantern x={1520} y={140} len={30} s={0.85} glow={`url(#${p}lan)`} delay={3} />

      <Hill y={760} amp={40} fill="#2A1B66" />
      <g stroke="#1B1038" strokeLinecap="round" fill="none">
        <path d="M1500 900 C1480 760 1400 700 1380 560 C1360 440 1260 400 1180 320" strokeWidth="46" />
        <path d="M1380 560 C1460 500 1500 420 1480 340" strokeWidth="26" />
        <path d="M1180 320 C1100 290 1040 250 960 250" strokeWidth="22" />
        <path d="M1260 400 C1200 440 1140 450 1080 500" strokeWidth="20" />
        <path d="M-20 70 C120 90 200 150 300 130" strokeWidth="18" /><path d="M120 100 C150 170 190 200 250 210" strokeWidth="12" />
      </g>
      <Anim kind="glow" dur={8}>
        <Glow id={`${p}lit`} x={1240} y={310} r={260} opacity={0.18} />
      </Anim>
      <Blossoms seed={2} cx={1240} cy={300} spread={190} count={36} colors={['#E88FB8', '#F0A4C6', '#DF7DAE', '#F3B4CE']} glow="#FF9EC8" />
      <Blossoms seed={4} cx={980} cy={250} spread={120} count={20} colors={['#E88FB8', '#F0A4C6', '#F3B4CE']} glow="#FF9EC8" />
      <Blossoms seed={6} cx={1500} cy={360} spread={140} count={24} colors={['#DF7DAE', '#E88FB8', '#F0A4C6']} glow="#FF9EC8" />
      <Blossoms seed={12} cx={180} cy={150} spread={170} count={28} colors={['#E88FB8', '#F0A4C6', '#DF7DAE', '#F3B4CE']} glow="#FF9EC8" />

      <Hill y={820} amp={30} fill="#1D1250" shift={6} />
      <ellipse cx="640" cy="850" rx="260" ry="32" fill="#2C2A78" />
      <ellipse cx="560" cy="846" rx="70" ry="7" fill="#FFF0D4" opacity="0.4" />
      <path d="M470 846 Q640 780 810 846" stroke="#7A4A6A" strokeWidth="14" fill="none" strokeLinecap="round" />
      <Hill y={872} amp={20} fill="#150C3C" shift={12} />
      <Petals seed={9} count={24} colors={['#FFC8E0', '#FFB3D4', '#FFDDEB']} glow="#FF9EC8" />
    </>
  );
}
