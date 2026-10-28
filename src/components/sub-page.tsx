import Link from 'next/link';
import type { ReactNode } from 'react';
import { MenuTitle, PageTransition } from '@/components/page-transition';
import { menuNames, type MenuSlug } from '@/lib/menu';

export function SubPage({ slug, children }: { slug: MenuSlug; children: ReactNode }) {
  return (
    <PageTransition>
      <main className="mx-auto w-full max-w-3xl px-6 py-12">
        <Link
          href="/"
          transitionTypes={['nav-back']}
          className="group inline-flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-sky-700"
        >
          <span
            aria-hidden
            className="transition-transform group-hover:-translate-x-1 motion-reduce:transition-none"
          >
            ←
          </span>
          トップへ戻る
        </Link>
        <h1 className="mt-6 text-3xl font-bold">
          <MenuTitle slug={slug}>{menuNames[slug]}</MenuTitle>
        </h1>
        {children}
      </main>
    </PageTransition>
  );
}
