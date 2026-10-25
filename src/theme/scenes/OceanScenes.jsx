import { Anim, Glow, GlowDef, rng } from './parts.jsx';

function Fish({ y, s = 1, body, fin, stripe, flip, dur, delay }) {
  return (
    <Anim kind="swim" dur={dur} delay={delay}>
      <g transform={`translate(0 ${y}) scale(${flip ? -s : s} ${s})`}>
        <path d="M-30 0 L-58 -20 L-58 20Z" fill={fin} />
        <ellipse cx="0" cy="0" rx="38" ry="22" fill={body} />
        <path d="M-6 -22 Q8 -40 22 -18Z" fill={fin} />
        <path d="M6 -20 Q14 0 6 20" stroke={stripe} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.85" />
        <circle cx="22" cy="-4" r="4.2" fill="#fff" />
        <circle cx="23" cy="-4" r="2" fill="#2B2640" />
      </g>
    </Anim>
  );
}

function Bubbles({ seed, count, color = '#FFFFFF' }) {
  const r = rng(seed);
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const size = 4 + r() * 11;
        return (
          <Anim key={i} kind="rise" dur={11 + r() * 12} delay={r() * 20} rise={-(500 + r() * 400)}>
            <circle cx={30 + r() * 1540} cy={880 - r() * 120} r={size} fill="none" stroke={color} strokeWidth="2" opacity="0.8" />
          </Anim>
        );
      })}
    </>
  );
}

/** Day: Coral Paradise. Turquoise water, sunlight rays, colourful fish, coral reefs and bubbles. */
export function OceanDay(p) {
  return (
    <>
      <defs>
        <linearGradient id={`${p}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9BF0F2" />
          <stop offset="0.5" stopColor="#3FCADA" />
          <stop offset="1" stopColor="#1B8FBE" />
        </linearGradient>
        <linearGradient id={`${p}ray`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill={`url(#${p}sky)`} />
      <g className="mb-glow" style={{ '--dur': '8s' }}>
        <polygon points="200,0 360,0 800,900 560,900" fill={`url(#${p}ray)`} opacity="0.45" />
        <polygon points="520,0 640,0 1180,900 1000,900" fill={`url(#${p}ray)`} opacity="0.35" />
        <polygon points="900,0 1000,0 1500,900 1340,900" fill={`url(#${p}ray)`} opacity="0.3" />
      </g>
      <path d="M0 40 Q200 10 400 40 T800 40 T1200 40 T1600 40" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="5" fill="none" />

      <Fish y={250} s={1.1} body="#FFB347" fin="#FF7A59" stripe="#FFFFFF" dur={75} delay={10} />
      <Fish y={420} s={0.8} body="#FF8FC4" fin="#FFD0E6" stripe="#FFFFFF" flip dur={95} delay={40} />
      <Fish y={560} s={1.3} body="#FFE066" fin="#FFB347" stripe="#3F8CD0" dur={85} delay={55} />
      <Fish y={170} s={0.7} body="#B7A2FF" fin="#E2D6FF" stripe="#FFFFFF" dur={110} delay={70} />
      <Fish y={690} s={0.9} body="#7CE0C8" fin="#C9FFF0" stripe="#FFFFFF" flip dur={90} delay={25} />

      <path d="M0 850 Q300 800 640 840 T1240 830 T1640 850 V920 H0Z" fill="#F6E3B5" />
      <path d="M0 880 Q400 850 800 876 T1640 870 V920 H0Z" fill="#EBD29B" />
      <g strokeLinecap="round" fill="none">
        <g stroke="#FF8F7A" strokeWidth="16"><path d="M180 850 V770 M180 790 Q150 760 144 730 M180 780 Q212 750 218 716" /><path d="M300 860 V800 M300 815 Q274 796 268 770" /></g>
        <g stroke="#FF7FB5" strokeWidth="18"><path d="M470 850 V740 M470 770 Q430 740 424 700 M470 760 Q508 730 516 690 M470 800 Q500 780 520 760" /></g>
        <g stroke="#FFB04A" strokeWidth="14"><path d="M820 860 V790 M820 805 Q796 782 792 756 M820 800 Q846 780 852 752" /><path d="M900 862 V808 M900 822 Q922 806 926 784" /></g>
        <g stroke="#B58CFF" strokeWidth="16"><path d="M1120 850 V760 M1120 780 Q1086 750 1082 716 M1120 774 Q1150 744 1160 706" /></g>
        <g stroke="#FF8F7A" strokeWidth="18"><path d="M1380 850 V736 M1380 764 Q1340 734 1334 694 M1380 756 Q1418 726 1428 684 M1380 800 Q1416 782 1432 756" /></g>
      </g>
      <g>
        <path d="M640 850 Q610 780 640 740 Q670 780 640 850Z" fill="#FF7FB5" opacity="0.9" />
        <path d="M660 850 Q640 800 680 770 Q690 810 660 850Z" fill="#FFB3D6" opacity="0.9" />
        <ellipse cx="1260" cy="846" rx="46" ry="26" fill="#FF8F7A" /><ellipse cx="1260" cy="838" rx="30" ry="16" fill="#FFB8A8" />
        <ellipse cx="70" cy="852" rx="54" ry="28" fill="#B58CFF" /><ellipse cx="70" cy="844" rx="34" ry="16" fill="#D6C2FF" />
      </g>
      <g stroke="#2FA87A" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.85">
        <path d="M1000 860 Q980 800 1004 760" /><path d="M1520 860 Q1500 810 1526 770" /><path d="M360 862 Q344 820 366 790" />
      </g>
      <Bubbles seed={4} count={16} />
    </>
  );
}

function Jellyfish({ x, y, s = 1, c1, c2, p, dur = 5, delay = 0 }) {
  return (
    <Anim kind="bob" dur={9 + dur} delay={delay} amp={26}>
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <circle cy="20" r="130" fill={`url(#${p}jg)`} opacity="0.35" />
        <g stroke={c2} strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.85">
          <path d="M-34 36 Q-44 90 -30 130 T-38 200" /><path d="M-12 40 Q-4 100 -16 150 T-6 230" />
          <path d="M12 40 Q22 96 10 150 T20 224" /><path d="M34 36 Q46 92 32 132 T42 196" />
        </g>
        <Anim kind="pulse" dur={dur} delay={delay}>
          <path d="M-60 40 C-60 -34 60 -34 60 40 Q40 28 20 42 Q0 28 -20 42 Q-40 28 -60 40Z" fill={`url(#${p}jb${c1 === '#FF6BE0' ? 'a' : 'b'})`} />
          <ellipse cx="-14" cy="0" rx="16" ry="9" fill="#fff" opacity="0.35" />
        </Anim>
      </g>
    </Anim>
  );
}

/** Night: Bioluminescent Deep. Deep navy water, glowing jellyfish, luminous coral and magical light. */
export function OceanNight(p) {
  const r = rng(9);
  const plankton = Array.from({ length: 36 }, () => ({ x: r() * 1600, y: 300 + r() * 600, s: 1 + r() * 2.2, d: r() * 14, dur: 14 + r() * 14 }));
  return (
    <>
      <defs>
        <linearGradient id={`${p}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#031030" />
          <stop offset="0.55" stopColor="#07265A" />
          <stop offset="1" stopColor="#0A3C78" />
        </linearGradient>
        <linearGradient id={`${p}ray`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7FD8FF" stopOpacity="0.25" />
          <stop offset="1" stopColor="#7FD8FF" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${p}jg`}><stop offset="0" stopColor="#FF6BE0" stopOpacity="0.8" /><stop offset="1" stopColor="#FF6BE0" stopOpacity="0" /></radialGradient>
        <linearGradient id={`${p}jba`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFB3F2" /><stop offset="1" stopColor="#B04DE0" stopOpacity="0.8" /></linearGradient>
        <linearGradient id={`${p}jbb`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#B8F4FF" /><stop offset="1" stopColor="#3FA8E8" stopOpacity="0.8" /></linearGradient>
        <GlowDef id={`${p}cy`} color="#4FE8FF" inner={0.9} />
        <GlowDef id={`${p}mg`} color="#FF6BE0" inner={0.9} />
        <GlowDef id={`${p}gn`} color="#7CFFC0" inner={0.9} />
      </defs>
      <rect width="1600" height="900" fill={`url(#${p}sky)`} />
      <g className="mb-glow" style={{ '--dur': '10s' }}>
        <polygon points="300,0 420,0 760,900 520,900" fill={`url(#${p}ray)`} opacity="0.5" />
        <polygon points="1000,0 1100,0 1500,900 1280,900" fill={`url(#${p}ray)`} opacity="0.4" />
      </g>

      <Jellyfish x={260} y={260} s={1.1} c1="#FF6BE0" c2="#FFB3F2" p={p} dur={5} delay={0} />
      <Jellyfish x={1240} y={200} s={1.4} c1="#4FD0FF" c2="#B8F4FF" p={p} dur={6} delay={4} />
      <Jellyfish x={800} y={420} s={0.8} c1="#FF6BE0" c2="#FFB3F2" p={p} dur={4.5} delay={8} />
      <Jellyfish x={1480} y={520} s={0.7} c1="#4FD0FF" c2="#B8F4FF" p={p} dur={5.5} delay={2} />

      {plankton.map((q, i) => (
        <Anim key={i} kind="bob" dur={q.dur} delay={q.d} amp={20}>
          <circle cx={q.x} cy={q.y} r={q.s} fill="#9FEFFF" opacity="0.7" />
        </Anim>
      ))}

      <path d="M0 850 Q300 810 640 842 T1240 834 T1640 852 V920 H0Z" fill="#06173A" />
      <path d="M0 884 Q400 858 800 880 T1640 874 V920 H0Z" fill="#040F29" />
      <g strokeLinecap="round" fill="none">
        <g stroke="#0E3A6E" strokeWidth="16"><path d="M170 852 V760 M170 780 Q140 752 134 716 M170 772 Q202 744 208 706" /></g>
        <g stroke="#2A2370" strokeWidth="18"><path d="M470 852 V736 M470 764 Q432 736 426 696 M470 756 Q506 726 514 684" /></g>
        <g stroke="#0E3A6E" strokeWidth="14"><path d="M830 862 V790 M830 805 Q806 782 802 756 M830 800 Q856 780 862 752" /></g>
        <g stroke="#2A2370" strokeWidth="16"><path d="M1130 852 V758 M1130 780 Q1096 750 1092 714 M1130 774 Q1160 744 1170 706" /></g>
        <g stroke="#0E3A6E" strokeWidth="18"><path d="M1400 852 V734 M1400 762 Q1362 734 1356 694 M1400 754 Q1436 724 1446 682" /></g>
      </g>
      {[[134, 716, 'cy'], [208, 706, 'cy'], [426, 696, 'mg'], [514, 684, 'mg'], [802, 756, 'gn'], [862, 752, 'gn'], [1092, 714, 'mg'], [1170, 706, 'cy'], [1356, 694, 'gn'], [1446, 682, 'cy']].map(([x, y, c], i) => (
        <Anim key={i} kind="glow" dur={4 + (i % 4)} delay={i * 0.8}>
          <circle cx={x} cy={y} r="30" fill={`url(#${p}${c})`} opacity="0.8" />
          <circle cx={x} cy={y} r="6" fill={c === 'cy' ? '#C8F8FF' : c === 'mg' ? '#FFD0F6' : '#D2FFE8'} />
        </Anim>
      ))}
      <ellipse cx="640" cy="852" rx="50" ry="22" fill="#10305F" />
      <Anim kind="glow" dur={6}><circle cx="640" cy="842" r="40" fill={`url(#${p}cy)`} opacity="0.55" /></Anim>
      <Bubbles seed={12} count={12} color="#9FEFFF" />
    </>
  );
}
