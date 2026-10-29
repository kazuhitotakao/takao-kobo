'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { requestScrollRestoration } from '@/lib/scroll-restoration';

// 詳細ページから一覧へ、404 やエラーのページからトップへ戻るリンク。
// スマホ（トップが1列になる 680px 以下）では指で押しやすいよう、押せる範囲を高さ 48px にし、淡い背景と枠で押せる場所を見せる
export function BackLink({ href, children, restoreScroll = false }: { href: string; children: ReactNode; restoreScroll?: boolean }) {
  return (
    <Link
      href={href}
      scroll={restoreScroll ? false : undefined}
      onNavigate={restoreScroll ? () => requestScrollRestoration(href) : undefined}
      transitionTypes={['nav-back']}
      className="group inline-flex items-center gap-1.5 rounded-sm font-semibold text-sky-700 transition-colors hover:text-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 max-[681px]:min-h-12 max-[681px]:rounded-full max-[681px]:bg-white/70 max-[681px]:px-4 max-[681px]:ring-1 max-[681px]:ring-sky-200"
    >
      <span
        aria-hidden
        className="transition group-hover:-translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
      >
        ←
      </span>
      {children}
    </Link>
  );
}
