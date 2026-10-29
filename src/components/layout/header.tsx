import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Logo } from '@/components/layout/logo';
import { menuNames, menuSlugs, type MenuSlug } from '@/lib/menu';

const focusOutlineClassName = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500';

// 各ページの h1 と重ならないよう、工房名は見出しにせずリンクだけにする。
// currentSlug のメニューを今いる場所として色付けする。作品詳細のような一覧の下のページ（isDetail）は
// メニューのページそのものではないので、aria-current を page ではなく true にする。
// スマホではページ全体がスクロールするので、上に貼り付けて本文が透けないよう背景を塗る（SubPage を参照）。
// ページ遷移で、スクロールした本文の画像がヘッダーの上に重ならないよう、view-transition-name を付けて手前に描かせる
export function Header({ currentSlug, isDetail = false }: { currentSlug?: MenuSlug; isDetail?: boolean }) {
  return (
    <header className="sticky top-0 z-20 border-b border-sky-200 bg-background [view-transition-name:site-header]">
      <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4">
        <Link
          href="/"
          transitionTypes={['nav-back']}
          className={`flex rounded-sm text-navy transition-colors hover:text-sky-700 ${focusOutlineClassName}`}
        >
          <Logo />
        </Link>
        {/* スマホでは工房名の下の1行に4つを広げて並べ、押しやすくする */}
        <nav aria-label="メインメニュー" className="w-full sm:w-auto">
          <ul className="flex flex-wrap justify-between gap-1 sm:justify-end sm:gap-2">
            {menuSlugs.map((slug) => {
              const isCurrent = slug === currentSlug;
              return (
                <li key={slug}>
                  <Link
                    href={`/${slug}`}
                    transitionTypes={['nav-forward']}
                    aria-current={isCurrent ? (isDetail ? 'true' : 'page') : undefined}
                    className={`block rounded-full px-2.5 py-2 text-[15px] font-semibold whitespace-nowrap transition-colors sm:px-4 sm:text-lg ${
                      isCurrent
                        ? 'bg-white text-sky-900 shadow-sm ring-1 ring-sky-200'
                        : 'text-slate-700 hover:bg-white/60 hover:text-sky-800'
                    } ${focusOutlineClassName}`}
                  >
                    {menuNames[slug]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
