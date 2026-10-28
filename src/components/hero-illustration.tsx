// 仮のイラスト。本番のイラストができたら差し替える
export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 200" aria-hidden className={className}>
      <line x1="8" y1="181" x2="232" y2="181" stroke="#bae6fd" strokeWidth="3" strokeLinecap="round" />
      <rect x="20" y="150" width="48" height="30" rx="4" fill="#bae6fd" />
      <rect x="72" y="120" width="48" height="60" rx="4" fill="#7dd3fc" />
      <rect x="124" y="90" width="48" height="90" rx="4" fill="#38bdf8" />
      <rect x="176" y="60" width="48" height="120" rx="4" fill="#0ea5e9" />
      <path
        d="M44 140 Q70 100 96 110 Q122 70 148 80 Q170 44 186 50"
        fill="none"
        stroke="#0369a1"
        strokeWidth="2"
        strokeDasharray="4 6"
        strokeLinecap="round"
      />
      <line x1="200" y1="60" x2="200" y2="20" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
      <path d="M200 20 L226 28 L200 36 Z" fill="#fbbf24" />
    </svg>
  );
}
