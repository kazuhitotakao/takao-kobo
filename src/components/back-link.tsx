import Link from 'next/link';
import type { ReactNode } from 'react';

// 詳細ページから一覧へ戻るリンク
export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      transitionTypes={['nav-back']}
      className="group inline-flex items-center gap-1.5 rounded-sm font-semibold text-sky-700 transition-colors hover:text-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
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
