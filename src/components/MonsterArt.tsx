import type { Monster } from '../types';

/** Original, parametric SVG illustrations for every creature. */
export function MonsterArt({ monster, size = 200 }: { monster: Monster; size?: number }) {
  const { id, shape, color, accent, boss } = monster;
  const g = `g-${id}`;
  const glow = `glow-${id}`;

  const eyes = (cx: number, cy: number, gap = 22, r = 9) => (
    <g>
      {[-1, 1].map((s) => (
        <g key={s}>
          <ellipse cx={cx + s * gap} cy={cy} rx={r} ry={r * 1.15} fill="#0b0816" />
          <circle cx={cx + s * gap} cy={cy} r={r * 0.55} fill={accent} filter={`url(#${glow})`} />
          <circle cx={cx + s * gap - 2} cy={cy - 3} r={r * 0.2} fill="#fff" />
        </g>
      ))}
    </g>
  );

  let body: JSX.Element;
  switch (shape) {
    case 'blob':
      body = (
        <g>
          <path d="M40 150 C30 95 65 60 100 60 C140 60 172 95 160 150 C150 172 52 172 40 150Z" fill={`url(#${g})`} />
          <path d="M92 62 C88 40 70 34 62 40 C78 44 84 52 88 64Z M108 62 C114 38 134 32 142 40 C126 44 118 54 112 64Z" fill={accent} opacity="0.85" />
          <circle cx="70" cy="140" r="6" fill={accent} opacity="0.4" />
          <circle cx="132" cy="128" r="4" fill={accent} opacity="0.4" />
          {eyes(100, 108)}
          <path d="M84 135 Q100 145 116 135" stroke="#0b0816" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      );
      break;
    case 'spiky':
      body = (
        <g>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const x1 = 100 + Math.cos(a - 0.2) * 50, y1 = 110 + Math.sin(a - 0.2) * 50;
            const x2 = 100 + Math.cos(a) * 82, y2 = 110 + Math.sin(a) * 82;
            const x3 = 100 + Math.cos(a + 0.2) * 50, y3 = 110 + Math.sin(a + 0.2) * 50;
            return <path key={i} d={`M${x1} ${y1} L${x2} ${y2} L${x3} ${y3}Z`} fill={accent} opacity="0.9" />;
          })}
          <circle cx="100" cy="110" r="56" fill={`url(#${g})`} />
          {eyes(100, 100, 20, 10)}
          <path d="M78 130 L88 138 L96 130 L104 138 L112 130 L122 138" stroke="#0b0816" strokeWidth="4" fill="none" strokeLinejoin="round" />
        </g>
      );
      break;
    case 'ghost':
      body = (
        <g>
          <path d="M45 170 L45 100 C45 62 70 38 100 38 C130 38 155 62 155 100 L155 170 Q142 156 130 170 Q116 156 100 170 Q86 156 72 170 Q58 156 45 170Z" fill={`url(#${g})`} opacity="0.95" />
          <path d="M60 90 C62 70 78 56 96 54" stroke={accent} strokeWidth="4" opacity="0.5" fill="none" strokeLinecap="round" />
          {eyes(100, 100, 22, 11)}
          <ellipse cx="100" cy="135" rx="12" ry="8" fill="#0b0816" />
        </g>
      );
      break;
    case 'beast':
      body = (
        <g>
          <path d="M70 70 C55 45 40 40 30 22 M60 60 C45 50 38 54 30 50 M130 70 C145 45 160 40 170 22 M140 60 C155 50 162 54 170 50" stroke={accent} strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M50 105 C50 70 75 55 100 55 C125 55 150 70 150 105 C150 140 128 175 100 175 C72 175 50 140 50 105Z" fill={`url(#${g})`} />
          <path d="M78 140 C80 160 120 160 122 140 C112 150 88 150 78 140Z" fill="#0b0816" opacity="0.55" />
          <path d="M86 146 L90 156 L94 146 M106 146 L110 156 L114 146" fill="#fff" />
          {eyes(100, 102, 26, 10)}
          <path d="M66 88 L88 96 M134 88 L112 96" stroke="#0b0816" strokeWidth="5" strokeLinecap="round" />
        </g>
      );
      break;
    case 'tome':
      body = (
        <g>
          <path d="M40 60 L100 72 L160 60 L160 160 L100 172 L40 160Z" fill={`url(#${g})`} />
          <path d="M100 72 L100 172" stroke="#0b0816" strokeWidth="4" opacity="0.5" />
          <path d="M44 156 L100 168 L156 156" stroke={accent} strokeWidth="3" fill="none" opacity="0.7" />
          <path d="M52 76 L90 84 M52 90 L90 98 M110 84 L148 76 M110 98 L148 90" stroke={accent} strokeWidth="3" opacity="0.4" />
          <ellipse cx="100" cy="122" rx="30" ry="18" fill="#0b0816" />
          <circle cx="100" cy="122" r="11" fill={accent} filter={`url(#${glow})`} />
          <circle cx="100" cy="122" r="4" fill="#0b0816" />
          <path d="M60 172 L52 188 M80 176 L78 192 M120 176 L122 192 M140 172 L148 188" stroke={accent} strokeWidth="4" strokeLinecap="round" opacity="0.6" />
        </g>
      );
      break;
    case 'golem':
    default:
      body = (
        <g>
          <rect x="62" y="40" width="76" height="58" rx="10" fill={`url(#${g})`} />
          <rect x="44" y="96" width="112" height="70" rx="14" fill={`url(#${g})`} />
          <rect x="22" y="104" width="26" height="54" rx="10" fill={color} />
          <rect x="152" y="104" width="26" height="54" rx="10" fill={color} />
          <path d="M80 110 L96 128 L88 146 L104 160 M124 104 L116 124 L130 140" stroke={accent} strokeWidth="4" fill="none" filter={`url(#${glow})`} />
          <rect x="76" y="62" width="48" height="12" rx="6" fill="#0b0816" />
          <circle cx="88" cy="68" r="4" fill={accent} filter={`url(#${glow})`} />
          <circle cx="112" cy="68" r="4" fill={accent} filter={`url(#${glow})`} />
        </g>
      );
  }

  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label={`${monster.name} illustration`}>
      <defs>
        <radialGradient id={g} cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.55" />
          <stop offset="35%" stopColor={color} />
          <stop offset="100%" stopColor="#0b0816" />
        </radialGradient>
        <filter id={glow} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx="100" cy="186" rx="60" ry="8" fill="#000" opacity="0.35" />
      {body}
      {boss && (
        <path d="M74 34 L82 14 L92 28 L100 8 L108 28 L118 14 L126 34Z" fill="#f5c451" stroke="#8a6414" strokeWidth="2" filter={`url(#${glow})`} />
      )}
    </svg>
  );
}
