import { Anim, Cloud, Flower, Glow, GlowDef, Hill, Stars, rng } from './parts.jsx';

function Butterfly({ x, y, s = 1, c1, c2 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="mb-wing"><path d="M0 0 C-12 -20 -30 -14 -22 2 C-30 14 -10 18 0 6Z" fill={c1} /><path d="M0 0 C12 -20 30 -14 22 2 C30 14 10 18 0 6Z" fill={c1} /></g>
      <circle cx="-10" cy="-2" r="4" fill={c2} opacity="0.8" />
      <circle cx="10" cy="-2" r="4" fill={c2} opacity="0.8" />
      <rect x="-1.5" y="-6" width="3" height="16" rx="1.5" fill="#5B4A63" />
    </g>
  );
}

function LeafyTree({ x, y, s = 1, trunk = '#8A5B3C', leaves = ['#58B868', '#6FCB7A', '#82DA8C'] }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-16 0 C-10 -90 -14 -150 -6 -210 L10 -210 C8 -140 14 -80 18 0Z" fill={trunk} />
      <circle cx="-70" cy="-250" r="76" fill={leaves[0]} />
      <circle cx="68" cy="-258" r="80" fill={leaves[0]} />
      <circle cx="0" cy="-320" r="92" fill={leaves[1]} />
      <circle cx="-30" cy="-240" r="74" fill={leaves[2]} />
      <circle cx="40" cy="-232" r="62" fill={leaves[1]} />
    </g>
  );
}

/** Day: Sunny Meadow. Green hills, wildflowers, butterflies, leafy trees and warm sunlight. */
export function NatureDay(p) {
  const r = rng(11);
  const colors = ['#FF8FB5', '#FFE066', '#FFFFFF', '#C7A6FF', '#FFA566'];
  const wild = Array.from({ length: 34 }, (_, i) => ({
    x: 20 + r() * 1560,
    y: 842 + r() * 52,
    s: 0.7 + r() * 0.7,
    c: colors[i % colors.length],
  }));
  return (
    <>
      <defs>
        <linearGradient id={`${p}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A9DCFF" />
          <stop offset="0.6" stopColor="#E4F5FF" />
          <stop offset="1" stopColor="#FFF7DA" />
        </linearGradient>
        <GlowDef id={`${p}sun`} color="#FFF0A8" inner={0.95} mid={0.3} />
        <linearGradient id={`${p}ray`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF6C2" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFF6C2" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill={`url(#${p}sky)`} />
      <Glow id={`${p}sun`} x={220} y={110} r={380} />
      <g className="mb-glow" style={{ '--dur': '9s' }}>
        <polygon points="220,110 900,560 1100,470" fill={`url(#${p}ray)`} opacity="0.5" />
        <polygon points="220,110 600,700 860,640" fill={`url(#${p}ray)`} opacity="0.4" />
      </g>
      <circle cx="220" cy="110" r="52" fill="#FFE766" />
      <Anim kind="drift" dur={95} amp={50}><Cloud x={760} y={120} s={1} /></Anim>
      <Anim kind="drift" dur={120} amp={40} delay={30}><Cloud x={1240} y={230} s={0.8} opacity={0.88} /></Anim>
      <Anim kind="drift" dur={85} amp={30} delay={10}><Cloud x={520} y={310} s={0.6} opacity={0.8} /></Anim>

      <Hill y={640} amp={60} fill="#CDEFC0" />
      <LeafyTree x={1410} y={760} s={0.95} />
      <Hill y={730} amp={54} fill="#A8E0A0" shift={10} />
      <LeafyTree x={170} y={770} s={0.85} leaves={['#4FB064', '#68C676', '#7BD688']} />
      <Hill y={820} amp={40} fill="#82CD88" shift={10} />
      <Hill y={868} amp={26} fill="#6DBF7A" shift={16} />
      {wild.map((f, i) => <Flower key={i} x={f.x} y={f.y} s={f.s} petal={f.c} h={22 + (i % 4) * 5} />)}

      <Anim kind="flutter" dur={18}><Butterfly x={700} y={560} s={1} c1="#FFB3D1" c2="#FF7FB0" /></Anim>
      <Anim kind="flutter" dur={22} delay={8}><Butterfly x={1050} y={470} s={0.8} c1="#FFE066" c2="#FFB347" /></Anim>
      <Anim kind="flutter" dur={20} delay={4}><Butterfly x={380} y={600} s={0.7} c1="#C7A6FF" c2="#9B7BE8" /></Anim>
    </>
  );
}

function Pine({ x, y, s = 1, fill }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
      <path d="M0 -300 L50 -180 H24 L70 -80 H30 L84 0 H-84 L-30 -80 H-70 L-24 -180 H-50Z" />
    </g>
  );
}

/** Night: Moonlit Forest. Deep teal and indigo trees, fireflies, moonlit leaves and luminous flowers. */
export function NatureNight(p) {
  const r = rng(5);
  const flies = Array.from({ length: 20 }, () => ({ x: 60 + r() * 1480, y: 380 + r() * 440, d: r() * 10, dur: 6 + r() * 6, a: 20 + r() * 40 }));
  const bells = [
    [150, 872, '#7FE8FF'], [330, 884, '#FFA6E0'], [520, 870, '#7FE8FF'], [700, 886, '#C9A6FF'], [880, 872, '#FFA6E0'],
    [1060, 884, '#7FE8FF'], [1240, 870, '#C9A6FF'], [1420, 884, '#FFA6E0'], [1540, 872, '#7FE8FF'],
  ];
  const farPines = [60, 190, 330, 470, 610, 760, 910, 1050, 1190, 1330, 1470, 1590];
  return (
    <>
      <defs>
        <linearGradient id={`${p}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#05101E" />
          <stop offset="0.55" stopColor="#0D2D3D" />
          <stop offset="1" stopColor="#18505A" />
        </linearGradient>
        <GlowDef id={`${p}moon`} color="#DFFBFF" inner={0.6} mid={0.14} />
        <GlowDef id={`${p}fly`} color="#E6FF8A" inner={1} />
        <GlowDef id={`${p}bell1`} color="#7FE8FF" inner={0.9} />
        <GlowDef id={`${p}bell2`} color="#FFA6E0" inner={0.9} />
        <GlowDef id={`${p}bell3`} color="#C9A6FF" inner={0.9} />
      </defs>
      <rect width="1600" height="900" fill={`url(#${p}sky)`} />
      <Stars seed={3} count={70} box={[0, 0, 1600, 360]} colors={['#FFFFFF', '#CFF5FF']} />
      <Glow id={`${p}moon`} x={1280} y={150} r={340} />
      <circle cx="1280" cy="150" r="66" fill="#F2FFFF" />
      <circle cx="1262" cy="136" r="10" fill="#D6EEF0" opacity="0.8" />
      <circle cx="1300" cy="170" r="7" fill="#D6EEF0" opacity="0.8" />

      <g opacity="0.9">{farPines.map((x, i) => <Pine key={x} x={x} y={690 + (i % 3) * 14} s={0.9 + (i % 4) * 0.12} fill="#103A47" />)}</g>
      <Hill y={720} amp={40} fill="#0D3340" />
      <g>
        {[110, 420, 780, 1130, 1480].map((x, i) => <Pine key={x} x={x} y={820} s={1.5 + (i % 2) * 0.35} fill="#082530" />)}
      </g>
      <g fill="#9FEBDD" opacity="0.2">
        <ellipse cx="520" cy="610" rx="46" ry="14" transform="rotate(-24 520 610)" />
        <ellipse cx="1180" cy="520" rx="50" ry="15" transform="rotate(18 1180 520)" />
        <ellipse cx="260" cy="470" rx="40" ry="12" transform="rotate(-10 260 470)" />
        <ellipse cx="1420" cy="640" rx="44" ry="13" transform="rotate(-18 1420 640)" />
      </g>
      <Hill y={850} amp={22} fill="#06202A" shift={10} />
      {bells.map(([x, y, c], i) => (
        <g key={x} transform={`translate(${x} ${y})`}>
          <path d="M0 0 Q5 -22 0 -46" stroke="#1E6E64" strokeWidth="3" fill="none" strokeLinecap="round" />
          <Anim kind="glow" dur={4 + (i % 3)} delay={i}>
            <circle cy="-52" r="34" fill={`url(#${p}bell${c === '#7FE8FF' ? 1 : c === '#FFA6E0' ? 2 : 3})`} opacity="0.7" />
          </Anim>
          <path d="M-10 -48 Q0 -76 10 -48 Q0 -40 -10 -48Z" fill={c} />
        </g>
      ))}
      {flies.map((f, i) => (
        <Anim key={i} kind="flutter" dur={f.dur + 8} delay={f.d} amp={f.a}>
          <Anim kind="glow" dur={f.dur / 2} delay={f.d}>
            <circle cx={f.x} cy={f.y} r="16" fill={`url(#${p}fly)`} opacity="0.75" />
            <circle cx={f.x} cy={f.y} r="2.6" fill="#F6FFC0" />
          </Anim>
        </Anim>
      ))}
    </>
  );
}
