import { Anim, Castle, Cloud, Flower, Glow, GlowDef, Hill, Sparkle, Stars } from './parts.jsx';

const RAINBOW = ['#FFADC6', '#FFCFA5', '#FFF0A0', '#B5EDC4', '#A8DCFF', '#BDB4FF', '#E0B4FF'];

/** Day: Rainbow Dreamland. Pastel rainbow, fluffy clouds, flowers, a magical castle and sparkles. */
export function UnicornDay(p) {
  const flowers = [
    [90, 872, 1.1, '#FFB3D1'], [210, 884, 0.9, '#FFFFFF'], [340, 868, 1, '#FFE27A'], [470, 880, 1.2, '#E2C4FF'], [610, 872, 0.9, '#FFB3D1'],
    [740, 886, 1.1, '#FFFFFF'], [880, 870, 1, '#C9E8FF'], [1010, 884, 1.2, '#FFB3D1'], [1140, 872, 0.9, '#FFE27A'], [1270, 884, 1.1, '#E2C4FF'],
    [1400, 868, 1, '#FFFFFF'], [1520, 882, 1.2, '#FFB3D1'],
  ];
  return (
    <>
      <defs>
        <linearGradient id={`${p}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C9E6FF" />
          <stop offset="0.5" stopColor="#EEDDFF" />
          <stop offset="0.82" stopColor="#FFE1EE" />
          <stop offset="1" stopColor="#FFF0D6" />
        </linearGradient>
        <GlowDef id={`${p}sun`} color="#FFF3B0" inner={0.95} />
      </defs>
      <rect width="1600" height="900" fill={`url(#${p}sky)`} />
      <Glow id={`${p}sun`} x={1340} y={120} r={320} opacity={0.85} />

      <g fill="none" opacity="0.8">
        {RAINBOW.map((c, i) => {
          const r = 650 - i * 31;
          return <path key={c} d={`M${430 - r} 790 A${r} ${r} 0 0 1 ${430 + r} 790`} stroke={c} strokeWidth="33" />;
        })}
      </g>

      <Anim kind="drift" dur={70} amp={50}><Cloud x={330} y={150} s={1.1} /></Anim>
      <Anim kind="drift" dur={90} amp={40} delay={20}><Cloud x={800} y={90} s={0.8} opacity={0.85} /></Anim>
      <Anim kind="drift" dur={80} amp={60} delay={40}><Cloud x={1130} y={300} s={1} opacity={0.88} /></Anim>
      <Anim kind="drift" dur={110} amp={30} delay={10}><Cloud x={80} y={330} s={0.9} opacity={0.8} /></Anim>

      <Hill y={700} amp={50} fill="#CFEFE2" opacity={0.95} />
      <Cloud x={1055} y={778} s={1.7} />
      <Cloud x={-10} y={780} s={1.6} />
      <Hill y={770} amp={46} fill="#FFD3E9" shift={14} />
      <Castle x={1270} y={760} s={1} wall="#FFFFFF" roof="#FF9FCF" roof2="#B9A2FF" win="#FFD86B" trim="#F3A9D2" />
      <Hill y={838} amp={36} fill="#E3D3FF" shift={10} />
      <Hill y={880} amp={26} fill="#C9F0D8" shift={16} />
      {flowers.map(([x, y, s, petal]) => <Flower key={x} x={x} y={y} s={s} petal={petal} />)}

      <Sparkle x={160} y={90} s={1.4} fill="#FFFFFF" delay={0} />
      <Sparkle x={560} y={230} s={1} fill="#FFE98A" delay={1.2} />
      <Sparkle x={980} y={170} s={1.5} fill="#FFFFFF" delay={2.1} />
      <Sparkle x={1450} y={330} s={1.2} fill="#FFB8DA" delay={0.6} />
      <Sparkle x={700} y={520} s={1} fill="#FFFFFF" delay={1.8} />
      <Sparkle x={260} y={540} s={1.3} fill="#FFE98A" delay={2.6} />
      <Sparkle x={1180} y={560} s={1} fill="#FFFFFF" delay={0.3} />
      <Sparkle x={1500} y={80} s={0.9} fill="#FFFFFF" delay={1.5} />
      <Sparkle x={440} y={400} s={0.8} fill="#FFB8DA" delay={3} />
    </>
  );
}

/** Night: Midnight Unicorn Kingdom. Violet and indigo sky, crescent moon, stars and a glowing castle. */
export function UnicornNight(p) {
  const orbs = [[180, 640, 8], [520, 700, 6], [860, 610, 9], [1100, 690, 7], [1480, 600, 8], [330, 520, 5], [1380, 500, 6]];
  return (
    <>
      <defs>
        <linearGradient id={`${p}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#120A36" />
          <stop offset="0.5" stopColor="#2A1B6B" />
          <stop offset="0.85" stopColor="#5A3A9E" />
          <stop offset="1" stopColor="#8B54B5" />
        </linearGradient>
        <GlowDef id={`${p}moon`} color="#FFF1BE" inner={0.7} mid={0.18} />
        <GlowDef id={`${p}orb`} color="#FFB8F0" inner={0.95} />
        <GlowDef id={`${p}win`} color="#FFD98A" inner={0.8} />
        <mask id={`${p}crescent`}>
          <rect width="1600" height="900" fill="#fff" />
          <circle cx="1285" cy="140" r="64" fill="#000" />
        </mask>
        <linearGradient id={`${p}aur`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FF7AD9" stopOpacity="0" />
          <stop offset="0.5" stopColor="#7AE8FF" stopOpacity="0.28" />
          <stop offset="1" stopColor="#C58BFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill={`url(#${p}sky)`} />
      <Stars seed={7} count={110} box={[0, 0, 1600, 520]} colors={['#FFFFFF', '#FFE9FF', '#CFE2FF']} />

      <path d="M0 250 C 300 150, 600 330, 900 220 S 1400 160, 1600 260 L1600 330 C 1300 250, 1000 380, 720 300 S 250 240, 0 340Z" fill={`url(#${p}aur)`} />

      <Glow id={`${p}moon`} x={1250} y={160} r={330} />
      <circle cx="1250" cy="150" r="70" fill="#FFF3C8" mask={`url(#${p}crescent)`} />

      <g opacity="0.5" fill="none">
        {['#FF9BD0', '#B5A2FF', '#8FD3FF'].map((c, i) => {
          const r = 520 - i * 30;
          return <path key={c} d={`M${420 - r} 800 A${r} ${r} 0 0 1 ${420 + r} 800`} stroke={c} strokeWidth="22" opacity="0.35" />;
        })}
      </g>

      <Hill y={720} amp={48} fill="#3A2584" opacity={0.95} />
      <Glow id={`${p}win`} x={1270} y={610} r={210} opacity={0.5} />
      <Castle x={1270} y={780} s={1.05} wall="#241556" roof="#3C2792" roof2="#4B34A8" win="#FFD98A" trim="#1A1040" flag="#FF8FD8" />
      <Hill y={800} amp={36} fill="#2A1A66" shift={16} />
      <Hill y={868} amp={26} fill="#1D1148" shift={10} />

      {orbs.map(([x, y, r], i) => (
        <Anim key={x} kind="bob" dur={6 + (i % 3)} delay={i * 1.3} amp={14}>
          <Glow id={`${p}orb`} x={x} y={y} r={r * 5} opacity={0.55} />
          <circle cx={x} cy={y} r={r / 2} fill="#FFE6FA" />
        </Anim>
      ))}
      <Sparkle x={380} y={250} s={1.4} fill="#FFE9FF" delay={0} />
      <Sparkle x={820} y={160} s={1.1} fill="#CFE2FF" delay={1.4} />
      <Sparkle x={1000} y={380} s={1.3} fill="#FFFFFF" delay={2.4} />
      <Sparkle x={140} y={420} s={1} fill="#FFB8F0" delay={0.8} />
      <Sparkle x={1480} y={420} s={1.2} fill="#FFFFFF" delay={1.9} />
    </>
  );
}
