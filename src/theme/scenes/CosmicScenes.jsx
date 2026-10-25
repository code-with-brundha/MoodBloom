import { Anim, Cloud, Glow, GlowDef, Hill, Sparkle, Stars } from './parts.jsx';

const starPath = 'M0 -14 L4 -4.5 L14 -4.5 L6 2 L9 12 L0 6 L-9 12 L-6 2 L-14 -4.5 L-4 -4.5Z';

/** A planet with a tilted ring. */
function RingedPlanet({ x, y, r, body, band, ring, ringBack, tilt = -18, id }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <path d={`M${-r * 2.1} 0 A${r * 2.1} ${r * 0.5} 0 0 1 ${r * 2.1} 0`} stroke={ringBack} strokeWidth={r * 0.2} fill="none" />
      <circle r={r} fill={body} />
      <path d={`M${-r * 0.95} ${-r * 0.35} Q0 ${-r * 0.1} ${r * 0.95} ${-r * 0.35}`} stroke={band} strokeWidth={r * 0.16} fill="none" opacity="0.7" />
      <path d={`M${-r * 0.8} ${r * 0.35} Q0 ${r * 0.6} ${r * 0.8} ${r * 0.35}`} stroke={band} strokeWidth={r * 0.12} fill="none" opacity="0.6" />
      <path d={`M${-r * 2.1} 0 A${r * 2.1} ${r * 0.5} 0 0 0 ${r * 2.1} 0`} stroke={ring} strokeWidth={r * 0.2} fill="none" />
    </g>
  );
}

/** Day: Solar Garden. Sunny sky, soft clouds, planets and a cheerful celestial garden. */
export function CosmicDay(p) {
  const blooms = [
    [120, 880, '#FFD84D', 'star'], [260, 868, '#FF9FC4', 'planet'], [420, 884, '#B8A2FF', 'star'], [590, 872, '#7CC4FF', 'planet'],
    [760, 886, '#FFB04D', 'star'], [930, 870, '#FF9FC4', 'star'], [1090, 884, '#FFD84D', 'planet'], [1250, 872, '#B8A2FF', 'star'],
    [1400, 886, '#7CC4FF', 'star'], [1530, 870, '#FFB04D', 'planet'],
  ];
  return (
    <>
      <defs>
        <linearGradient id={`${p}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B4DCFF" />
          <stop offset="0.55" stopColor="#E2F2FF" />
          <stop offset="1" stopColor="#FFF3D2" />
        </linearGradient>
        <GlowDef id={`${p}sun`} color="#FFE98A" inner={0.95} mid={0.35} />
      </defs>
      <rect width="1600" height="900" fill={`url(#${p}sky)`} />
      <Glow id={`${p}sun`} x={1330} y={150} r={360} />
      <g className="mb-spin" style={{ '--dur': '220s' }}>
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x="1326" y="40" width="8" height="46" rx="4" fill="#FFD84D" opacity="0.7" transform={`rotate(${i * 30} 1330 150)`} />
        ))}
      </g>
      <circle cx="1330" cy="150" r="62" fill="#FFD84D" />
      <circle cx="1330" cy="150" r="48" fill="#FFE68A" />

      <Anim kind="drift" dur={80} amp={50}><Cloud x={260} y={130} s={1} /></Anim>
      <Anim kind="drift" dur={100} amp={40} delay={30}><Cloud x={900} y={70} s={0.8} opacity={0.85} /></Anim>
      <Anim kind="drift" dur={90} amp={50} delay={15}><Cloud x={1080} y={360} s={0.9} opacity={0.8} /></Anim>

      <Anim kind="bob" dur={9} amp={16}>
        <RingedPlanet x={330} y={300} r={50} body="#FFB46B" band="#FF8A3D" ring="#FFE3B0" ringBack="#E59A55" />
      </Anim>
      <Anim kind="bob" dur={11} amp={12} delay={3}>
        <g transform="translate(820 190)">
          <circle r="34" fill="#6FB6FF" />
          <path d="M-20 -8 Q-8 -22 6 -14 Q-2 -2 -14 6Z M8 8 Q20 2 24 14 Q14 24 6 18Z" fill="#8EE0A8" />
        </g>
      </Anim>
      <Anim kind="bob" dur={8} amp={10} delay={5}>
        <g transform="translate(600 430)">
          <circle r="24" fill="#FF9FC4" />
          <path d="M-22 -6 H22 M-20 6 H20" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="5" />
        </g>
      </Anim>
      <circle cx="1060" cy="560" r="14" fill="#B8A2FF" />
      <circle cx="140" cy="500" r="18" fill="#FFD84D" opacity="0.9" />

      <Hill y={760} amp={44} fill="#C4EBD4" opacity={0.95} />
      <Hill y={820} amp={34} fill="#A6DDC0" shift={10} />
      <Hill y={872} amp={24} fill="#8ACFAE" shift={14} />
      {blooms.map(([x, y, c, kind], i) => (
        <g key={x} transform={`translate(${x} ${y})`}>
          <path d="M0 0 Q4 -26 0 -52" stroke="#5FB58A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M0 -20 Q16 -30 22 -22 Q10 -12 0 -20Z" fill="#6FC79A" />
          {kind === 'star' ? (
            <path d={starPath} fill={c} transform="translate(0 -62) scale(1.5)" />
          ) : (
            <g transform="translate(0 -62)">
              <circle r="15" fill={c} />
              <ellipse rx="26" ry="6" fill="none" stroke={c} strokeWidth="3" transform="rotate(-18)" />
            </g>
          )}
          <Sparkle x={i % 2 ? 16 : -16} y={-92} s={0.6} fill="#FFFFFF" delay={i * 0.7} />
        </g>
      ))}
      <Sparkle x={120} y={90} s={1.2} fill="#FFFFFF" delay={0.5} />
      <Sparkle x={560} y={560} s={1} fill="#FFFFFF" delay={1.6} />
      <Sparkle x={1250} y={470} s={1.1} fill="#FFFFFF" delay={2.4} />
    </>
  );
}

const CONSTELLATIONS = [
  [[160, 150], [250, 110], [330, 170], [420, 130], [470, 220]],
  [[1050, 380], [1130, 330], [1210, 360], [1290, 300], [1350, 380], [1290, 450]],
  [[620, 120], [700, 180], [780, 140]],
];

/** Night: Starlight Galaxy. Deep space, ringed planets, constellations and a glowing moon. */
export function CosmicNight(p) {
  return (
    <>
      <defs>
        <linearGradient id={`${p}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050824" />
          <stop offset="0.55" stopColor="#14154A" />
          <stop offset="1" stopColor="#2B1A66" />
        </linearGradient>
        <GlowDef id={`${p}n1`} color="#8A4DFF" inner={0.5} />
        <GlowDef id={`${p}n2`} color="#FF5CC8" inner={0.38} />
        <GlowDef id={`${p}n3`} color="#3F8CFF" inner={0.4} />
        <GlowDef id={`${p}moon`} color="#E8EEFF" inner={0.5} mid={0.12} />
      </defs>
      <rect width="1600" height="900" fill={`url(#${p}sky)`} />
      <Glow id={`${p}n1`} x={420} y={640} r={520} />
      <Glow id={`${p}n2`} x={1180} y={220} r={460} />
      <Glow id={`${p}n3`} x={900} y={760} r={480} />
      <Stars seed={21} count={190} box={[0, 0, 1600, 900]} colors={['#FFFFFF', '#CFE0FF', '#FFE6F5', '#E4D4FF']} maxR={2.2} />

      {CONSTELLATIONS.map((pts, i) => (
        <g key={i} opacity="0.75">
          <polyline points={pts.map((q) => q.join(',')).join(' ')} fill="none" stroke="#B9C8FF" strokeWidth="1.5" strokeOpacity="0.55" strokeDasharray="4 5" />
          {pts.map(([x, y], j) => <circle key={j} cx={x} cy={y} r={j % 2 ? 3 : 4.2} fill="#FFFFFF" />)}
        </g>
      ))}

      <Glow id={`${p}moon`} x={1450} y={170} r={230} />
      <g>
        <circle cx="1450" cy="170" r="62" fill="#EEF2FF" />
        <circle cx="1432" cy="154" r="11" fill="#D3DAF2" />
        <circle cx="1472" cy="188" r="8" fill="#D3DAF2" />
        <circle cx="1454" cy="136" r="5" fill="#D3DAF2" />
      </g>

      <Anim kind="bob" dur={14} amp={14}>
        <RingedPlanet x={1330} y={560} r={78} body="#E7B66C" band="#B8803A" ring="#F8E2B4" ringBack="#9C6A33" tilt={-20} />
      </Anim>
      <Anim kind="bob" dur={10} amp={10} delay={4}>
        <g transform="translate(720 640)"><circle r="36" fill="#6B8CFF" /><path d="M-30 -6 Q0 -20 30 -4 M-26 12 Q0 4 26 16" stroke="#C9D6FF" strokeOpacity="0.55" strokeWidth="5" fill="none" /></g>
      </Anim>
      <circle cx="120" cy="260" r="22" fill="#FF8AD0" />
      <circle cx="120" cy="260" r="22" fill="none" stroke="#FFD0F0" strokeOpacity="0.4" strokeWidth="6" />
      <circle cx="120" cy="720" r="16" fill="#7CE0C8" />

      <g className="mb-shoot" style={{ '--dur': '17s', '--delay': '-4s' }}>
        <line x1="1000" y1="120" x2="1060" y2="86" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        <circle cx="1000" cy="120" r="3.4" fill="#FFFFFF" />
      </g>
      <g className="mb-shoot" style={{ '--dur': '23s', '--delay': '-14s' }}>
        <line x1="560" y1="420" x2="620" y2="386" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="560" cy="420" r="3" fill="#FFFFFF" />
      </g>
    </>
  );
}
