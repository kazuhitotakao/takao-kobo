// 全ページの左上に出す工房のロゴ。トップと下層ページで同じ見た目になるよう、どちらもここで描画する。
// 色は親から受け継ぐ。スマホで小さくする幅は、トップのレイアウトが切り替わる幅（home-page.css の max-width: 680px）にそろえる。
// 読み上げは「髙尾工房」だけにし、ローマ字の TAKAO KOBO は飾りとして扱う
export function Logo() {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 min-[681px]:gap-2.5">
      <svg
        viewBox="0 0 48 45"
        fill="none"
        aria-hidden
        focusable="false"
        className="size-[30px] min-[681px]:size-9"
      >
        <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 21L23 5L43 21M9 18V40H38V18M20 40V29H29V40" />
          {/* 窓と、屋根の上に立つ煙突（煙突の下端は屋根の線にそろえる） */}
          <path d="M18 17H29V24H18ZM31 11.4V6H37V16.2" />
        </g>
      </svg>
      <span className="text-center">
        <strong className="block font-['Hiragino_Maru_Gothic_ProN','Yu_Gothic',sans-serif] text-[18px] leading-[1.35] font-extrabold tracking-[.16em] whitespace-nowrap min-[681px]:text-[21px]">
          髙尾工房
        </strong>
        <small aria-hidden className="mt-[3px] block text-[7px] font-bold tracking-[.29em] min-[681px]:text-[8px]">
          TAKAO KOBO
        </small>
      </span>
    </span>
  );
}
