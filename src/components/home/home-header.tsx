import { Container } from '@/components/layout/container';

// 小さな人が階段を登っている線画（仮のイラスト）
function StairClimber({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 72 48"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 46 H18 V36 H34 V26 H50 V16 H64" />
      <circle cx="30" cy="12" r="4" fill="#fff" />
      <path d="M30 16 L29 26 L25 36 M29 26 L34 22 L37 26 M29.5 19 L34 23 M29.5 19 L25 22" />
      <path d="M62 16 V4" />
      <path d="M62 4 L70 6.5 L62 9 Z" fill="#fbbf24" />
    </svg>
  );
}

// トップ専用のヘッダー。メニューは下のカードに任せるので、下層ページの Header と違ってリンクを置かない。
// 工房名はトップでは今いるページそのものなので、リンクにせずページの見出しにする
export function HomeHeader() {
  return (
    <header className="border-b-2 border-navy">
      <Container className="flex items-center justify-between gap-6 py-4">
        <h1 className="py-1 text-2xl font-bold">髙尾工房</h1>
        <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] whitespace-nowrap text-navy sm:text-sm">
          Step by Step
          <StairClimber className="w-14 sm:w-16" />
        </p>
      </Container>
    </header>
  );
}
