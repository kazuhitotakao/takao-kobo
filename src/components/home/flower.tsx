// Contact カードの後ろから覗く、つぼみの花（仮の線画）。
// flower__ で始まる class は home-page.css の動き（押すとつぼみが開いて咲く）と対応している
export function Flower({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 70 90"
      aria-hidden
      overflow="visible"
      className={`text-navy ${className ?? ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 茎と葉（下端はカードの下で切れる） */}
      <path d="M35 92 Q37 70 35 44" />
      <path d="M36 76 Q22 76 20 66 Q31 63 36 76 Z M36 68 Q50 66 52 56 Q40 54 36 68 Z" fill="#bbf7d0" />

      {/* つぼみ */}
      <g className="flower__bud">
        <path d="M35 44 Q25 37 28 28 Q30 22 35 17 Q40 22 42 28 Q45 37 35 44 Z" fill="#fbcfe8" />
        <path d="M35 41 Q32 31 35 21" />
      </g>

      {/* 咲いた花 */}
      <g className="flower__bloom" fill="#fbcfe8">
        <circle cx="35" cy="19" r="8" />
        <circle cx="45.5" cy="26.6" r="8" />
        <circle cx="41.5" cy="38.9" r="8" />
        <circle cx="28.5" cy="38.9" r="8" />
        <circle cx="24.5" cy="26.6" r="8" />
        <circle cx="35" cy="30" r="6" fill="#fde68a" />
      </g>
    </svg>
  );
}
