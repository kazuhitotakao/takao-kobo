// Works カードの後ろから覗く、積みかけの積み木（仮の線画）。
// blocks__ で始まる class は home-page.css の動き（押すと残りが1つずつ積み上がり、てっぺんの星が光る）と対応している
export function Blocks({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      overflow="visible"
      className={`text-navy ${className ?? ''}`}
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* ふだんから積んである分（下の段3つと、2段目の左。下端はカードの下で切れる） */}
      <rect x="18" y="79" width="20" height="20" rx="2" fill="#e0f2fe" />
      <rect x="40" y="79" width="20" height="20" rx="2" fill="#fbcfe8" />
      <rect x="62" y="79" width="20" height="20" rx="2" fill="#fde68a" />
      <rect x="29" y="57" width="20" height="20" rx="2" fill="#fde68a" />

      {/* 押すと落ちてきて積み上がる分と、てっぺんの星 */}
      <rect className="blocks__piece blocks__piece--1" x="51" y="57" width="20" height="20" rx="2" fill="#e0f2fe" />
      <rect className="blocks__piece blocks__piece--2" x="40" y="35" width="20" height="20" rx="2" fill="#fbcfe8" />
      <path
        className="blocks__star"
        d="M50 15L52.1 20.2L57.6 20.5L53.3 24.1L54.7 29.5L50 26.5L45.3 29.5L46.7 24.1L42.4 20.5L47.9 20.2Z"
        fill="#fde68a"
      />
    </svg>
  );
}
