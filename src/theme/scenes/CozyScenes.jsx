import { Anim, Glow, GlowDef, Stars } from './parts.jsx';

const BOOKS = [
  ['#E58F8F', 120], ['#F3C98B', 96], ['#9CC3A5', 132], ['#B7A4DE', 108], ['#F0A98F', 124], ['#8FB3D9', 100], ['#E7D08A', 116], ['#C58FA6', 130],
];

function BookRow({ x, y, books, scale = 1, dim = 0 }) {
  let cx = x;
  return (
    <g>
      {books.map(([c, h], i) => {
        const w = 24 + (i % 3) * 6;
        const bx = cx;
        cx += w + 3;
        return (
          <g key={i}>
            <rect x={bx} y={y - h * scale} width={w} height={h * scale} rx="3" fill={c} />
            <rect x={bx + 4} y={y - h * scale + 14} width={w - 8} height="5" rx="2" fill="#fff" opacity={0.45 - dim} />
          </g>
        );
      })}
    </g>
  );
}

function Plant({ x, y, s = 1, pot, leaf1, leaf2 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g>
        {[[-60, -150, -28], [-26, -190, -10], [10, -200, 6], [44, -170, 24], [72, -120, 40]].map(([lx, ly, rot], i) => (
          <g key={i} transform={`rotate(${rot})`}>
            <path d={`M0 -30 Q${lx * 0.5 - 18} ${ly * 0.6} ${lx} ${ly} Q${lx * 0.5 + 22} ${ly * 0.55} 0 -30Z`} fill={i % 2 ? leaf1 : leaf2} />
          </g>
        ))}
      </g>
      <path d="M-46 -40 H46 L36 40 H-36Z" fill={pot} />
      <rect x="-52" y="-48" width="104" height="14" rx="5" fill={pot} />
    </g>
  );
}

function Cup({ x, y, s = 1, cup = '#FFF6E8', tea = '#C98A4B', steam = '#FFFFFF', steamOpacity = 0.6 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="22" rx="52" ry="9" fill="#000" opacity="0.12" />
      <ellipse cx="0" cy="18" rx="46" ry="8" fill={cup} />
      <path d="M-32 -22 H32 L26 14 Q0 26 -26 14Z" fill={cup} />
      <path d="M32 -14 Q54 -12 50 4 Q46 14 28 10" stroke={cup} strokeWidth="6" fill="none" />
      <ellipse cx="0" cy="-22" rx="32" ry="7" fill={tea} />
      {[-12, 6, 22].map((sx, i) => (
        <Anim key={i} kind="steam" dur={4.5 + i} delay={i * 1.4}>
          <path d={`M${sx} -30 q-9 -16 0 -30 q9 -14 0 -28`} stroke={steam} strokeOpacity={steamOpacity} strokeWidth="5" strokeLinecap="round" fill="none" />
        </Anim>
      ))}
    </g>
  );
}

/** Day: Morning Nook. A sunlit comfortable room with a window, houseplants, books and a warm cup of tea. */
export function CozyDay(p) {
  return (
    <>
      <defs>
        <linearGradient id={`${p}wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF3E0" />
          <stop offset="1" stopColor="#F8DDBC" />
        </linearGradient>
        <linearGradient id={`${p}win`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#BFE5FF" />
          <stop offset="1" stopColor="#FFF4CC" />
        </linearGradient>
        <linearGradient id={`${p}floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D9A877" />
          <stop offset="1" stopColor="#B97F52" />
        </linearGradient>
        <linearGradient id={`${p}beam`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF0B0" stopOpacity="0.6" />
          <stop offset="1" stopColor="#FFF0B0" stopOpacity="0" />
        </linearGradient>
        <GlowDef id={`${p}sun`} color="#FFF0A8" inner={0.9} />
      </defs>
      <rect width="1600" height="900" fill={`url(#${p}wall)`} />
      <rect y="760" width="1600" height="140" fill={`url(#${p}floor)`} />
      <g stroke="#A8693F" strokeOpacity="0.35" strokeWidth="3">
        <line x1="0" y1="800" x2="1600" y2="800" /><line x1="0" y1="846" x2="1600" y2="846" />
        {[200, 520, 840, 1160, 1480].map((x) => <line key={x} x1={x} y1="760" x2={x - 40} y2="800" />)}
      </g>
      <rect y="742" width="1600" height="20" fill="#F3E2C8" />

      <polygon points="1010,150 1290,150 1480,790 780,790" fill={`url(#${p}beam)`} className="mb-glow" style={{ '--dur': '9s' }} />
      <g>
        <rect x="1000" y="90" width="320" height="400" rx="10" fill="#9B6A45" />
        <rect x="1016" y="106" width="288" height="368" rx="6" fill={`url(#${p}win)`} />
        <Glow id={`${p}sun`} x={1220} y={190} r={150} opacity={0.9} />
        <circle cx="1220" cy="190" r="34" fill="#FFE46B" />
        <ellipse cx="1110" cy="300" rx="58" ry="18" fill="#fff" opacity="0.9" />
        <ellipse cx="1138" cy="288" rx="34" ry="16" fill="#fff" opacity="0.9" />
        <path d="M1016 400 Q1090 360 1160 400 T1304 396 V474 H1016Z" fill="#B8E3B0" />
        <rect x="1156" y="106" width="8" height="368" fill="#9B6A45" /><rect x="1016" y="282" width="288" height="8" fill="#9B6A45" />
        <rect x="984" y="478" width="352" height="20" rx="6" fill="#B98152" />
        <path d="M964 80 Q1010 200 986 500 H940 Q930 260 964 80Z" fill="#F7B9C4" />
        <path d="M1356 80 Q1310 200 1334 500 H1380 Q1390 260 1356 80Z" fill="#F7B9C4" />
        <rect x="946" y="70" width="440" height="14" rx="7" fill="#8A5A3A" />
      </g>

      <g transform="translate(-110 0)">
        <rect x="90" y="250" width="500" height="14" rx="5" fill="#A8693F" />
        <BookRow x={110} y={250} books={BOOKS} />
        <rect x="90" y="410" width="500" height="14" rx="5" fill="#A8693F" />
        <BookRow x={330} y={410} books={[...BOOKS].reverse().slice(0, 5)} scale={0.85} />
        <Plant x={170} y={410} s={0.5} pot="#D98F6B" leaf1="#7CC38F" leaf2="#5FB179" />
      </g>
      <g>
        <rect x="660" y="190" width="150" height="110" rx="6" fill="#FFF8EC" stroke="#C99467" strokeWidth="8" />
        <path d="M672 288 L720 230 L752 262 L776 238 L800 288Z" fill="#9BCFB0" />
        <circle cx="770" cy="222" r="14" fill="#FFD66B" />
      </g>

      <ellipse cx="760" cy="850" rx="360" ry="40" fill="#F4C2B8" />
      <ellipse cx="760" cy="850" rx="300" ry="30" fill="none" stroke="#FFF1E8" strokeWidth="5" strokeDasharray="14 12" />
      <Plant x={130} y={800} s={1.25} pot="#D98F6B" leaf1="#6FBF86" leaf2="#4FA672" />
      <Plant x={1500} y={790} s={0.9} pot="#C98B6B" leaf1="#86CC95" leaf2="#5DB57A" />
      <g>
        <rect x="1080" y="660" width="260" height="16" rx="6" fill="#A8693F" />
        <rect x="1100" y="676" width="14" height="120" fill="#8E5A36" /><rect x="1306" y="676" width="14" height="120" fill="#8E5A36" />
        <rect x="1130" y="634" width="100" height="26" rx="4" fill="#E58F8F" /><rect x="1138" y="612" width="86" height="22" rx="4" fill="#9CC3A5" />
        <Cup x={1270} y={640} s={1} />
      </g>
    </>
  );
}

/** Night: Midnight Nook. A cozy room with a glowing lamp, moonlit window, blankets, books and warm light. */
export function CozyNight(p) {
  return (
    <>
      <defs>
        <linearGradient id={`${p}wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2A1A30" />
          <stop offset="1" stopColor="#1B1220" />
        </linearGradient>
        <linearGradient id={`${p}win`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0F1B4A" />
          <stop offset="1" stopColor="#3D4A98" />
        </linearGradient>
        <linearGradient id={`${p}beam`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9FB8FF" stopOpacity="0.3" />
          <stop offset="1" stopColor="#9FB8FF" stopOpacity="0" />
        </linearGradient>
        <GlowDef id={`${p}lamp`} color="#FFB347" inner={0.75} mid={0.22} />
        <GlowDef id={`${p}moon`} color="#EAF0FF" inner={0.7} />
      </defs>
      <rect width="1600" height="900" fill={`url(#${p}wall)`} />
      <rect y="760" width="1600" height="140" fill="#2B1A22" />
      <rect y="742" width="1600" height="20" fill="#3A2530" />
      <g stroke="#120A10" strokeOpacity="0.5" strokeWidth="3"><line x1="0" y1="802" x2="1600" y2="802" /><line x1="0" y1="848" x2="1600" y2="848" /></g>

      <polygon points="1010,150 1290,150 1500,790 800,790" fill={`url(#${p}beam)`} />
      <g>
        <rect x="1000" y="90" width="320" height="400" rx="10" fill="#4A3040" />
        <rect x="1016" y="106" width="288" height="368" rx="6" fill={`url(#${p}win)`} />
        <Stars seed={31} count={26} box={[1020, 110, 1300, 380]} colors={['#FFFFFF', '#CFDDFF']} maxR={1.6} />
        <Glow id={`${p}moon`} x={1230} y={200} r={120} opacity={0.8} />
        <mask id={`${p}cres`}><rect x="1150" y="130" width="160" height="160" fill="#fff" /><circle cx="1244" cy="194" r="28" fill="#000" /></mask>
        <circle cx="1226" cy="204" r="32" fill="#FFF3CC" mask={`url(#${p}cres)`} />
        <path d="M1016 410 Q1090 380 1160 410 T1304 406 V474 H1016Z" fill="#14204E" />
        <rect x="1156" y="106" width="8" height="368" fill="#4A3040" /><rect x="1016" y="282" width="288" height="8" fill="#4A3040" />
        <rect x="984" y="478" width="352" height="20" rx="6" fill="#4A3040" />
        <path d="M964 80 Q1010 200 986 500 H940 Q930 260 964 80Z" fill="#5E3552" />
        <path d="M1356 80 Q1310 200 1334 500 H1380 Q1390 260 1356 80Z" fill="#5E3552" />
        <rect x="946" y="70" width="440" height="14" rx="7" fill="#3A2230" />
      </g>

      <g transform="translate(-110 0)">
        <rect x="90" y="250" width="500" height="14" rx="5" fill="#4A3040" />
        <BookRow x={110} y={250} books={BOOKS} dim={0.25} />
        <rect x="90" y="410" width="500" height="14" rx="5" fill="#4A3040" />
        <BookRow x={330} y={410} books={[...BOOKS].reverse().slice(0, 5)} scale={0.85} dim={0.25} />
      </g>
      <rect x="0" y="0" width="1600" height="900" fill="#0A0510" opacity="0.18" />

      {/* floor lamp */}
      <Anim kind="glow" dur={7}>
        <Glow id={`${p}lamp`} x={330} y={640} r={520} opacity={0.85} />
      </Anim>
      <g transform="translate(-90 110)">
        <rect x="414" y="560" width="12" height="230" fill="#4A3040" />
        <ellipse cx="420" cy="796" rx="52" ry="12" fill="#3A2230" />
        <path d="M368 470 H472 L492 560 H348Z" fill="#FFD27A" />
        <ellipse cx="420" cy="470" rx="52" ry="10" fill="#FFE9B8" />
        <ellipse cx="420" cy="560" rx="72" ry="12" fill="#FFB347" opacity="0.7" />
      </g>

      {/* armchair + blanket */}
      <g>
        <rect x="620" y="610" width="360" height="190" rx="50" fill="#5E3552" />
        <rect x="590" y="650" width="70" height="150" rx="30" fill="#6E4262" />
        <rect x="940" y="650" width="70" height="150" rx="30" fill="#6E4262" />
        <path d="M640 640 Q780 600 960 660 L990 800 H700Z" fill="#C46A55" />
        <g stroke="#FFD9A0" strokeOpacity="0.5" strokeWidth="5">
          <path d="M690 650 L720 800 M760 630 L790 800 M830 630 L860 800 M900 645 L930 800" />
          <path d="M660 690 H990 M670 740 H990 M690 785 H990" />
        </g>
      </g>

      <g>
        <rect x="1100" y="660" width="260" height="16" rx="6" fill="#4A3040" />
        <rect x="1120" y="676" width="14" height="120" fill="#3A2230" /><rect x="1326" y="676" width="14" height="120" fill="#3A2230" />
        <rect x="1150" y="634" width="100" height="26" rx="4" fill="#B8707A" /><rect x="1158" y="612" width="86" height="22" rx="4" fill="#6E8F7C" />
        <Cup x={1294} y={640} s={1} cup="#F4E3CF" tea="#B77A3D" steamOpacity={0.45} />
        <circle cx="1294" cy="640" r="110" fill={`url(#${p}lamp)`} opacity="0.35" />
      </g>
    </>
  );
}
