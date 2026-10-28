// トップ専用。下層ページの Header・ナビゲーション・ロゴには影響させない。
export function HomeHeader() {
  return (
    <header className="kobo-home__header">
      <div className="kobo-home__brand" aria-label="髙尾工房">
        <svg viewBox="0 0 48 45" fill="none" aria-hidden focusable="false">
          <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 21L23 5L43 21M9 18V40H38V18M20 40V29H29V40" />
            {/* 窓と、屋根の上に立つ煙突（煙突の下端は屋根の線にそろえる） */}
            <path d="M18 17H29V24H18ZM31 11.4V6H37V16.2" />
          </g>
        </svg>
        <span><strong>髙尾工房</strong><small>TAKAO KOBO</small></span>
      </div>
    </header>
  );
}
